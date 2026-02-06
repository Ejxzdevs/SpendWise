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
import {
  saveIncome,
  fetchIncomes,
  deleteIncome,
} from "@/services/incomeServices";
import { IncomeItem } from "@/types/income";
import { incomeCategoryIcons } from "@/types/category";

const MAX_DESC_LENGTH = 80;

export default function IncomeTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [source, setSource] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [description, setDescription] = useState("");
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      const response = await fetchIncomes();
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  }, [incomes]);

  // Delete income handler
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Income",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteIncome(id);
              await loadIncomes();
            } catch (error) {
              Alert.alert("Error", "Could not delete item.");
            }
          },
        },
      ],
    );
  };

  const formValidation = () => {
    let valid = true;
    if (!source) {
      setSourceError("Please select a source.");
      valid = false;
    } else {
      setSourceError("");
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

  const handleSaveIncome = async () => {
    if (!formValidation()) return;
    if (description.length > MAX_DESC_LENGTH) return;

    try {
      await saveIncome({ source, amount: parseFloat(amount), description });
      await loadIncomes();
      closeModal();
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const closeModal = () => {
    setSource("");
    setAmount("");
    setDescription("");
    setSourceError("");
    setAmountError("");
    setModalVisible(false);
  };

  const renderIncomeItem = ({ item }: { item: IncomeItem }) => (
    <View style={styles.card}>
      {/* Top Section: Icon and Details */}
      <View style={styles.cardMainContent}>
        <View style={styles.cardIconContainer}>
          <Ionicons
            name={(incomeCategoryIcons[item.source] as any) ?? "cash-outline"}
            size={24}
            color="#2563EB"
          />
        </View>
        <View style={styles.cardTextContainer}>
          <View style={styles.cardRow}>
            <Text style={styles.sourceText}>{item.source}</Text>
            <Text style={styles.amountText}>
              +₱{Number(item.amount).toLocaleString()}
            </Text>
          </View>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description || "No description provided."}
          </Text>
        </View>
      </View>

      {/* FOOTER SECTION: Delete Button */}
      <Pressable
        style={styles.cardFooter}
        onPress={() => handleDelete(item.source_id)}
      >
        <Ionicons name="trash-outline" size={16} color="#EF4444" />
        <Text style={styles.deleteBtnText}>Delete Record</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total Revenue</Text>
        <Text style={styles.headerAmount}>₱{totalIncome.toLocaleString()}</Text>
      </View>

      <FlatList
        data={incomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.source_id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Income History</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No income sources found.</Text>
        }
      />

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

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

              {source && (
                <Ionicons
                  name={incomeCategoryIcons[source] as any}
                  size={48}
                  color="#2563EB"
                  style={{ alignSelf: "center", marginBottom: 12 }}
                />
              )}

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
              {sourceError ? (
                <Text style={styles.errorMessage}>{sourceError}</Text>
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
                placeholder="Where did this come from?"
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
                  onPress={handleSaveIncome}
                  disabled={description.length > MAX_DESC_LENGTH}
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
    color: "#1E293B",
    marginBottom: 16,
  },

  // Card Styling
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
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextContainer: { flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  sourceText: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  amountText: { fontSize: 16, fontWeight: "700", color: "#059669" },
  descriptionText: { fontSize: 14, color: "#64748B", marginTop: 2 },

  // Footer Delete Button
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#1E293B",
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  charCount: { fontSize: 12, color: "#94A3B8" },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputError: { borderColor: "#EF4444" },
  textArea: { height: 80, textAlignVertical: "top" },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%", color: "#000", backgroundColor: "#fff" },
  buttonRow: { flexDirection: "row", marginTop: 32, gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#2563EB" },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnDisabled: { backgroundColor: "#94A3B8" },
  btnTextPrimary: { color: "#FFFFFF", fontWeight: "700" },
  btnTextSecondary: { color: "#64748B", fontWeight: "700" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94A3B8" },
  errorMessage: { color: "#EF4444", marginTop: 4 },
});
