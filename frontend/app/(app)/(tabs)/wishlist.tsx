import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  saveGoal,
  fetchGoals,
  addMoneyToGoal,
  updateGoal,
  deleteGoal,
} from "@/services/goalServices";
import {
  iconOptions,
  IconName,
  GoalPayload,
  GoalItems,
  addMoneyToGoalPayload,
} from "@/types/goal";

const { width } = Dimensions.get("window");

export default function GoalsScreen() {
  // utils temporary date formatter
  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) {
      cleaned = `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 6)}`;
    }
    setTargetDate(cleaned);
  };

  const formatDateForPayload = (dateString: string) => {
    const [month, year] = dateString.split(" / ");
    if (!month || !year || year.length < 4) return null;
    return `${year}-${month.padStart(2, "0")}-01`;
  };

  // FETCH GOALS
  const loadGoals = async () => {
    try {
      const response = await fetchGoals();
      if (response.success) {
        setGoals(response.data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // CREATE GOAL MODAL FUNCTIONALITY AND STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState<GoalItems[]>([]);
  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);

  // HANDLE SAVE GOAL
  const handleSaveGoal = async () => {
    const formattedDate = formatDateForPayload(targetDate);

    if (!goal || !targetAmount || !formattedDate) {
      Alert.alert(
        "Missing Info",
        "Please fill in the goal, amount, and valid date.",
      );
      return;
    }

    const payload: GoalPayload = {
      goal_name: goal,
      target_amount: parseFloat(targetAmount),
      target_date: formattedDate,
      description,
      icon_name: selectedIcon ?? undefined,
    };

    try {
      await saveGoal(payload);
      closeModal();
      loadGoals();
    } catch {
      Alert.alert("Error", "Failed to save goal.");
    }
  };

  // CLOSE CREATE GOAL MODAL
  const closeModal = () => {
    setGoal("");
    setTargetAmount("");
    setTargetDate("");
    setDescription("");
    setSelectedIcon(null);
    setModalVisible(false);

    // reset edit mode
    setSelectedGoalId(null);
  };

  // ADD GOAL MODAL FUNCTIONALITY AND STATE
  const [amount, setAmount] = useState("");
  const [modalAddMoneyVisible, setModalAddMoneyVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // ADD MONEY FUNCTIONALITY
  const handleSaveAddMoney = async () => {
    if (!amount || !selectedGoalId) {
      Alert.alert("Missing Info", "Please enter an amount.");
      return;
    }

    try {
      const payload: addMoneyToGoalPayload = {
        goal_id: selectedGoalId,
        amount: parseFloat(amount),
      };

      await addMoneyToGoal(payload);
      loadGoals();
      setAmount("");
      setModalAddMoneyVisible(false);
    } catch {
      Alert.alert("Error", "Failed to add money to goal.");
    }
  };

  // CLOSE ADD MONEY MODAL
  const handCloseAddMoneyModal = () => {
    setAmount("");
    setModalAddMoneyVisible(false);
  };

  // handle delete goal
  const handleDeleteGoal = async (goal_id: string) => {
    try {
      await deleteGoal(goal_id);
      loadGoals();
    } catch (error) {
      Alert.alert("Error", "Failed to delete goal.");
    }
    // Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: async () => {
    //       try {
    //         await deleteGoal(goal_id);
    //         loadGoals();
    //       } catch (error) {
    //         Alert.alert("Error", "Failed to delete goal.");
    //       }
    //     },
    //   },
    // ]);
  };

  // handle edit goal (opens create goal modal with pre-filled data)
  const isEditMode = selectedGoalId !== null;

  const handleEditGoalModal = (goal_id: string) => {
    const goalToEdit = goals.find((g) => g.goal_id === goal_id);
    if (goalToEdit) {
      setGoal(goalToEdit.goal_name);
      setTargetAmount(goalToEdit.target_amount.toString());
      const targetDateObj = new Date(goalToEdit.target_date);
      const month = (targetDateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = targetDateObj.getFullYear().toString();
      setTargetDate(`${month} / ${year}`);
      setSelectedGoalId(goalToEdit.goal_id);
      setDescription(goalToEdit.description || "");
      setSelectedIcon(goalToEdit.icon_name || null);
      setModalVisible(true);
    }
  };

  const handleSaveUpdateGoal = async () => {
    const formattedDate = formatDateForPayload(targetDate);

    if (!goal || !targetAmount || !formattedDate || !selectedGoalId) {
      Alert.alert(
        "Missing Info",
        "Please fill in the goal, amount, and valid date.",
      );
      return;
    }
    const updateData: Partial<GoalPayload> = {
      goal_name: goal,
      target_amount: parseFloat(targetAmount),
      target_date: formattedDate,
      description,
      icon_name: selectedIcon ?? undefined,
    };
    try {
      await updateGoal(selectedGoalId, updateData);
      closeModal();
      loadGoals();
    } catch {
      Alert.alert("Error", "Failed to update goal.");
    }
  };

  // RENDER GOAL ITEM
  const renderGoal = ({ item }: { item: GoalItems }) => {
    const progress = Math.min(
      (item.current_amount / item.target_amount) * 100,
      100,
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon_name || "rocket"}
              size={22}
              color="#10B981"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.goalName}>{item.goal_name}</Text>
            <Text style={styles.goalTarget}>
              Target: ₱{item.target_amount.toLocaleString()}
            </Text>
          </View>

          <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.currentAmount}>
            ₱{item.current_amount.toLocaleString()}
          </Text>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color="#64748B" />
            <Text style={styles.dateText}>
              {new Date(item.target_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          {/* Add */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setModalAddMoneyVisible(true);
              setSelectedGoalId(item.goal_id);
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#1ad358" />
          </Pressable>

          {/* Edit */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleEditGoalModal(item.goal_id)}
          >
            <Ionicons name="create-outline" size={20} color="#120fda" />
          </Pressable>

          {/* Delete */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleDeleteGoal(item.goal_id)}
          >
            <Ionicons name="trash-outline" size={20} color="#d11313" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Savings Goals</Text>
          <Text style={styles.headerSubtitle}>Fuel your future</Text>
        </View>
        <View style={styles.headerCircle} />
      </View>

      {/* GOALS LIST */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.goal_id}
        renderItem={renderGoal}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No goals yet. Start small!</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </Pressable>

      {/* CREATE GOAL MODAL */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create Goal</Text>

            <FlatList
              data={iconOptions}
              keyExtractor={(item) => item}
              numColumns={5}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <Text style={styles.inputLabel}>Goal Name</Text>
                  <TextInput
                    style={styles.input}
                    value={goal}
                    onChangeText={setGoal}
                    placeholderTextColor="#9CA3AF"
                    placeholder="e.g. New Laptop"
                  />

                  <View style={styles.inputRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.inputLabel}>Amount (₱)</Text>
                      <TextInput
                        style={styles.input}
                        placeholderTextColor="#9CA3AF"
                        placeholder="0.00"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.inputLabel}>Deadline</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM / YYYY"
                        keyboardType="number-pad"
                        maxLength={9}
                        value={targetDate}
                        onChangeText={handleDateChange}
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>Choose an Icon</Text>
                </>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.iconOption,
                    selectedIcon === item && styles.iconSelected,
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <Ionicons
                    name={item}
                    size={22}
                    color={selectedIcon === item ? "#10B981" : "#475569"}
                  />
                </Pressable>
              )}
              ListFooterComponent={
                <View style={styles.buttonRow}>
                  <Pressable style={styles.btnSecondary} onPress={closeModal}>
                    <Text style={styles.btnSecondaryText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.btnPrimary}
                    onPress={isEditMode ? handleSaveUpdateGoal : handleSaveGoal}
                  >
                    <Text style={styles.btnPrimaryText}>
                      {isEditMode ? "Save" : "Create Goal"}
                    </Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ADD MONEY MODAL */}
      <Modal transparent animationType="fade" visible={modalAddMoneyVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
            />

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.btnSecondary}
                onPress={handCloseAddMoneyModal}
              >
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.btnPrimary} onPress={handleSaveAddMoney}>
                <Text style={styles.btnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFDFF" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: { fontSize: 16, color: "#64748B" },
  headerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },

  list: { paddingHorizontal: 20, paddingBottom: 120 },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 3,
  },

  cardTop: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  goalName: { fontSize: 18, fontWeight: "700" },
  goalTarget: { fontSize: 13, color: "#94A3B8" },
  percentageText: { fontSize: 16, fontWeight: "800", color: "#10B981" },

  progressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    marginTop: 14,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  currentAmount: { fontSize: 18, fontWeight: "700" },

  dateBadge: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 6,
    borderRadius: 8,
  },
  dateText: { fontSize: 12, marginLeft: 4 },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
    marginTop: 10,
  },
  button: {
    padding: 1,
  },
  buttonPressed: {
    transform: [{ scale: 0.8 }],
    opacity: 0.7,
  },

  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { marginTop: 12, color: "#94A3B8" },

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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "90%",
  },

  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#0dd137",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },

  inputLabel: { fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  inputRow: { flexDirection: "row" },

  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },

  iconSelected: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },

  btnPrimary: {
    flex: 2,
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  btnSecondary: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginRight: 12,
  },

  btnPrimaryText: { color: "#FFF", fontWeight: "700" },
  btnSecondaryText: { color: "#64748B", fontWeight: "700" },
});
