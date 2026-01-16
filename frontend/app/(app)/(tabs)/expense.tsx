import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { saveExpense, fetchExpenses } from "@/services/expenseServices";
import { ExpenseItem } from "@/types/expense";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { expenseCategoryIcons } from "@/types/category";

export default function ExpenseTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Fetch expenses on mount
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

  // Calculate total expenses
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const handleSave = async () => {
    if (!category || !amount) {
      setError("Please select a category and enter an amount.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    try {
      await saveExpense({
        category,
        amount: parseFloat(amount),
        description,
      });

      Alert.alert("Success", "Expense saved successfully");
      loadExpenses();
      closeModal();
    } catch (error: any) {
      setError(error.message || "Error saving expense");
    }
  };

  const closeModal = () => {
    setCategory("");
    setAmount("");
    setDescription("");
    setError(null);
    setModalVisible(false);
  };

  // Render expense list item
  const renderExpense = ({ item }: { item: ExpenseItem }) => (
    <View style={styles.card}>
      <View style={styles.cardIconContainer}>
        <Ionicons
          name={expenseCategoryIcons[item.category] ?? "receipt-outline"}
          size={24}
          color="#10B981"
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.amountText}>
            -₱{Number(item.amount).toLocaleString()}
          </Text>
        </View>

        <Text style={styles.descriptionText} numberOfLines={1}>
          {item.description || "No description"}
        </Text>

        <Text style={styles.dateText}>
          {item.created_at
            ? dayjs(item.created_at).format("DD MMM, YYYY")
            : "N/A"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total Expenses</Text>
        <Text style={styles.headerAmount}>₱{totalAmount.toLocaleString()}</Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.expense_id}
        renderItem={renderExpense}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add Expense</Text>

              {/* Dynamic Icon */}
              {category && (
                <Ionicons
                  name={expenseCategoryIcons[category] ?? "receipt-outline"}
                  size={48}
                  color="#10B981"
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
              )}

              {/* Category Picker */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(val) => setCategory(val)}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Choose category"
                    value=""
                    color="#94A3B8"
                  />
                  <Picker.Item label="Food" value="Food" />
                  <Picker.Item label="Transport" value="Transport" />
                  <Picker.Item label="Rent" value="Rent" />
                  <Picker.Item label="Utilities" value="Utilities" />
                  <Picker.Item label="Entertainment" value="Entertainment" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>

              {/* Amount */}
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What was this for?"
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnTextSecondary}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={handleSave}
                >
                  <Text style={styles.btnTextPrimary}>Save Expense</Text>
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
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerCard: {
    backgroundColor: "#0F172A",
    margin: 16,
    padding: 24,
    borderRadius: 20,
  },
  headerLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  headerAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  categoryText: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  amountText: { fontSize: 16, fontWeight: "700", color: "#EF4444" },
  descriptionText: { fontSize: 14, color: "#64748B", marginTop: 2 },
  dateText: { fontSize: 11, color: "#94A3B8", marginTop: 8 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 12, color: "#94A3B8", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#1E293B" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  errorText: { color: "#EF4444", marginTop: 8 },
  buttonRow: { flexDirection: "row", marginTop: 32, gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#10B981" },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnTextPrimary: { color: "#FFFFFF", fontWeight: "700" },
  btnTextSecondary: { color: "#64748B", fontWeight: "700" },
});
