import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { saveExpense, fetchExpenses } from "@/services/expenseServices";
import { ExpenseItem } from "@/types/expense";
import dayjs from "dayjs";

export default function ExpenseTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // fetch expenses
  const loadExpenses = async () => {
    try {
      const response = await fetchExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  //  handle save expense
  const handleSave = async () => {
    if (!category.trim() || !amount.trim()) {
      setError("Category and Amount are required!");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive number for Amount!");
      return;
    }

    try {
      await saveExpense({
        category,
        amount: parseFloat(amount),
        description,
      });

      Alert.alert("Success", "Expense saved successfully!");
      await loadExpenses();
    } catch (error: any) {
      setError(error.message || "Error saving expense");
      return;
    }

    setCategory("");
    setAmount("");
    setDescription("");
    setError(null);
    setModalVisible(false);
  };

  // render expense item

  const renderExpense = ({ item }: { item: ExpenseItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>

      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      <Text style={styles.date}>
        {item.created_at
          ? dayjs(item.created_at).format("MMMM DD YYYY")
          : "Unknown date"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Expense List */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpense}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses added yet</Text>
        }
      />

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add New Expense</Text>

              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                value={category}
                onChangeText={setCategory}
              />

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
              />

              {error && <Text style={styles.error}>{error}</Text>}

              <View style={styles.buttonRow}>
                <Pressable style={styles.submitBtn} onPress={handleSave}>
                  <Text style={styles.submitBtnText}>Save</Text>
                </Pressable>

                <Pressable
                  style={[styles.submitBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.submitBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },

  /* Cards */
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#509893",
  },
  description: {
    marginTop: 6,
    color: "#555",
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#509893",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#0000FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: "#f30f0f",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
