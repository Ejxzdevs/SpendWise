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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { saveIncome, fetchIncomes } from "@/services/incomeService";
import { IncomeItem } from "@/types/income";
import { expenseCategory, expenseCategoryIcons } from "@/types/category";

export default function IncomeTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [source, setSource] = useState<expenseCategory | "">("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);

  // Fetch incomes on mount
  useEffect(() => {
    const loadIncomes = async () => {
      try {
        const response = await fetchIncomes();
        setIncomes(response.data);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    };
    loadIncomes();
  }, []);

  // Calculate total income
  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  }, [incomes]);

  // Save new income
  const handleSaveIncome = async () => {
    if (!source || !amount) {
      Alert.alert("Error", "Please select a source and enter amount.");
      return;
    }

    const payload = {
      source,
      amount: parseFloat(amount),
      description,
    };

    try {
      await saveIncome(payload);
      const response = await fetchIncomes();
      setIncomes(response.data);
      Alert.alert("Success", "Income saved successfully");
      closeModal();
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const closeModal = () => {
    setSource("");
    setAmount("");
    setDescription("");
    setModalVisible(false);
  };

  // Render income list item
  const renderIncomeItem = ({ item }: { item: IncomeItem }) => (
    <View style={styles.card}>
      <View style={styles.cardIconContainer}>
        {item.source &&
          expenseCategoryIcons[item.source as expenseCategory] && (
            <Ionicons
              name={expenseCategoryIcons[item.source as expenseCategory]}
              size={24}
              color="#2563EB"
            />
          )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.sourceText}>{item.source}</Text>
          <Text style={styles.amountText}>
            +₱{Number(item.amount).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total Revenue</Text>
        <Text style={styles.headerAmount}>₱{totalIncome.toLocaleString()}</Text>
      </View>

      {/* Income List */}
      <FlatList
        data={incomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.source_id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Income History</Text>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      {/* Add Income Modal */}
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
              <Text style={styles.modalTitle}>Add Income</Text>

              {/* Dynamic Icon */}
              {source ? (
                <Ionicons
                  name={expenseCategoryIcons[source]}
                  size={48}
                  color="#2563EB"
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
              ) : null}

              {/* Source Picker */}
              <Text style={styles.label}>Source</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={source}
                  onValueChange={(val) => setSource(val)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Source" value="" color="#94A3B8" />
                  <Picker.Item label="Salary" value="Salary" />
                  <Picker.Item label="Freelance" value="Freelance" />
                  <Picker.Item label="Investment" value="Investment" />
                  <Picker.Item label="Gift" value="Gift" />
                  <Picker.Item label="Other" value="Other" />
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
                placeholder="Where did this come from?"
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />

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
                  onPress={handleSaveIncome}
                >
                  <Text style={styles.btnTextPrimary}>Save Income</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerCard: {
    backgroundColor: "#2563EB",
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
    color: "#1E293B",
    marginBottom: 16,
  },
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
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  sourceText: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  amountText: { fontSize: 16, fontWeight: "700", color: "#059669" },
  descriptionText: { fontSize: 14, color: "#64748B", marginTop: 2 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
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
    color: "#1E293B",
    marginBottom: 20,
  },
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
  buttonRow: { flexDirection: "row", marginTop: 32, gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#2563EB" },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnTextPrimary: { color: "#FFFFFF", fontWeight: "700" },
  btnTextSecondary: { color: "#64748B", fontWeight: "700" },
});
