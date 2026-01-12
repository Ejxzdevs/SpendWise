import React, { useState } from "react";
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
} from "react-native";
import { saveExpense } from "@/services/expenseServices";
export default function ExpenseTabScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!category.trim() || !amount.trim()) {
      setError("Category and Amount are required!");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive number for Amount!");
      return;
    }

    try {
      saveExpense({ category, amount: parseFloat(amount), description });
      Alert.alert("Expense saved successfully!");
    } catch (error: any) {
      setError(error.message || "Error saving expense");
    }

    // reset form
    setCategory("");
    setAmount("");
    setDescription("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Open modal button */}
      <Pressable style={styles.addbtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addbtntext}>Add Expense</Text>
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Add New Expense</Text>

              {/* Category */}
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                value={category}
                onChangeText={setCategory}
              />

              {/* Amount */}
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              {/* Description */}
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
              />
              {error && <Text style={{ color: "red" }}>{error}</Text>}

              {/* Buttons */}
              <View style={styles.buttonRow}>
                {/* // Save Button */}
                <Pressable style={styles.submitBtn} onPress={handleSave}>
                  <Text style={styles.submitBtnText}>Save</Text>
                </Pressable>

                {/* // Cancel Button */}
                <Pressable
                  style={[styles.submitBtn, { backgroundColor: "#f30f0fff" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.submitBtnText, { color: "#fff" }]}>
                    Cancel
                  </Text>
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
  container: {
    flex: 1,
    padding: 16,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "#eef2ff",
  },
  addbtn: {
    backgroundColor: "#509893",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addbtntext: { color: "#fff", fontWeight: "600", fontSize: 16 },

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
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "400", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  submitBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
