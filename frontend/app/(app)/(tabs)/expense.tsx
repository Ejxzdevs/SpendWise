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
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";

import {
  saveExpense,
  fetchExpenses,
  deleteExpense,
} from "@/services/expenseServices";
import { ExpenseItem } from "@/types/expense";
import { expenseCategoryIcons } from "@/types/category";

export default function ExpenseTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const MAX_DESC_LENGTH = 80;

  const [categoryError, setCategoryError] = useState("");
  const [amountError, setAmountError] = useState("");

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetchExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  // ✅ SAME VALIDATION AS INCOME
  const formValidation = () => {
    let valid = true;

    if (!category) {
      setCategoryError("Please select a category.");
      valid = false;
    } else {
      setCategoryError("");
    }

    if (!amount) {
      setAmountError("Please enter an amount.");
      valid = false;
    } else if (!/^-?\d+(\.\d+)?$/.test(amount)) {
      setAmountError("Please enter a valid number.");
      valid = false;
    } else {
      setAmountError("");
    }

    return valid;
  };

  const handleSave = async () => {
    if (!formValidation()) return;
    if (description.length > MAX_DESC_LENGTH) return;

    try {
      await saveExpense({
        category,
        amount: parseFloat(amount),
        description,
      });
      await loadExpenses();
      closeModal();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExpense(id);
              await loadExpenses();
            } catch {
              Alert.alert("Error", "Could not delete item.");
            }
          },
        },
      ],
    );
  };

  const closeModal = () => {
    setCategory("");
    setAmount("");
    setDescription("");
    setCategoryError("");
    setAmountError("");
    setModalVisible(false);
  };

  const renderExpenseItem = ({ item }: { item: ExpenseItem }) => (
    <View style={styles.card}>
      {/* MAIN CONTENT */}
      <View style={styles.cardMainContent}>
        <View style={styles.cardIconContainer}>
          <Ionicons
            name={expenseCategoryIcons[item.category] ?? "receipt-outline"}
            size={24}
            color="#10B981"
          />
        </View>

        <View style={styles.cardTextContainer}>
          <View style={styles.cardRow}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.amountText}>
              -₱{Number(item.amount).toLocaleString()}
            </Text>
          </View>

          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description || "No description provided."}
          </Text>

          <Text style={styles.dateText}>
            {item.created_at
              ? dayjs(item.created_at).format("DD MMM, YYYY")
              : "N/A"}
          </Text>
        </View>
      </View>

      {/* FOOTER DELETE */}
      <Pressable
        style={styles.cardFooter}
        onPress={() => handleDelete(item.expense_id)}
      >
        <Ionicons name="trash-outline" size={16} color="#EF4444" />
        <Text style={styles.deleteBtnText}>Delete Record</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total Expenses</Text>
        <Text style={styles.headerAmount}>₱{totalAmount.toLocaleString()}</Text>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.expense_id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses recorded.</Text>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      {/* MODAL */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <ScrollView>
              <Text style={styles.modalTitle}>Add Expense</Text>

              {category && (
                <Ionicons
                  name={expenseCategoryIcons[category]}
                  size={48}
                  color="#10B981"
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
              )}

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose Category" value="" />
                  <Picker.Item label="Food" value="Food" />
                  <Picker.Item label="Transport" value="Transport" />
                  <Picker.Item label="Rent" value="Rent" />
                  <Picker.Item label="Utilities" value="Utilities" />
                  <Picker.Item label="Entertainment" value="Entertainment" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
              {categoryError ? (
                <Text style={styles.errorMessage}>{categoryError}</Text>
              ) : null}

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              {amountError ? (
                <Text style={styles.errorMessage}>{amountError}</Text>
              ) : null}

              <View style={styles.labelRow}>
                <Text style={styles.label}>Description</Text>
                <Text
                  style={[
                    styles.charCount,
                    description.length > MAX_DESC_LENGTH && {
                      color: "#EF4444",
                    },
                  ]}
                >
                  {description.length}/{MAX_DESC_LENGTH}
                </Text>
              </View>

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  description.length > MAX_DESC_LENGTH && styles.inputError,
                ]}
                placeholder="What was this for?"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnTextSecondary}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.btn,
                    styles.btnPrimary,
                    description.length > MAX_DESC_LENGTH && styles.btnDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={description.length > MAX_DESC_LENGTH}
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  headerCard: {
    backgroundColor: "#0F172A",
    margin: 16,
    padding: 24,
    borderRadius: 20,
  },
  headerLabel: {
    color: "#DBEAFE",
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

  listContainer: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  cardMainContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
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
  cardTextContainer: { flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  categoryText: { fontSize: 16, fontWeight: "600" },
  amountText: { fontSize: 16, fontWeight: "700", color: "#EF4444" },
  descriptionText: { fontSize: 14, color: "#64748B", marginTop: 2 },
  dateText: { fontSize: 12, color: "#94A3B8", marginTop: 4 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFF5F5",
    borderTopWidth: 1,
    borderTopColor: "#FEE2E2",
  },
  deleteBtnText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 34,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

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
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  charCount: { fontSize: 12, color: "#94A3B8" },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
  },
  inputError: { borderColor: "#EF4444" },
  textArea: { height: 80 },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  picker: { height: 50, width: "100%", color: "#000", backgroundColor: "#fff" },
  buttonRow: { flexDirection: "row", marginTop: 32, gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12 },
  btnPrimary: { backgroundColor: "#10B981" },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnDisabled: { backgroundColor: "#94A3B8" },
  btnTextPrimary: { color: "#FFFFFF", textAlign: "center", fontWeight: "700" },
  btnTextSecondary: { textAlign: "center", fontWeight: "700" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94A3B8" },
  errorMessage: { color: "#EF4444", marginTop: 4 },
});
