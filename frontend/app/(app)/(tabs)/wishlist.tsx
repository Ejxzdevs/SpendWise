import React, { useState, useEffect, useMemo } from "react";
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
import { iconOptions, IconName, GoalPayload, GoalItems } from "@/types/goal";

const { width } = Dimensions.get("window");

export default function GoalsScreen() {
  const [goals, setGoals] = useState<GoalItems[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddMoneyVisible, setModalAddMoneyVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // --- FORM STATES ---
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);

  // --- ADD MONEY STATES ---
  const [addAmount, setAddAmount] = useState("");
  const [currentGoalAmount, setCurrentGoalAmount] = useState(0);
  const [currentGoalTarget, setCurrentGoalTarget] = useState(0);

  // --- INLINE ERROR STATES ---
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [dateError, setDateError] = useState("");
  const [descError, setDescError] = useState("");
  const [addMoneyError, setAddMoneyError] = useState("");

  // --- CALCULATIONS ---
  const totals = useMemo(() => {
    const totalCurrent = goals.reduce(
      (acc, g) => acc + Number(g.current_amount || 0),
      0,
    );
    const totalTarget = goals.reduce(
      (acc, g) => acc + Number(g.target_amount || 0),
      0,
    );
    const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    return {
      current: totalCurrent,
      target: totalTarget,
      progress: Math.min(progress, 100),
    };
  }, [goals]);

  // --- API HANDLERS ---
  const loadGoals = async () => {
    try {
      const response = await fetchGoals();
      if (response.success) {
        const sanitized = response.data.map((item: any) => ({
          ...item,
          current_amount: Number(item.current_amount || 0),
          target_amount: Number(item.target_amount || 0),
          description: item.description || "",
        }));
        setGoals(sanitized);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // --- UTILS ---
  const handleDateChange = (text: string) => {
    setDateError("");
    let cleaned = (text || "").replace(/\D/g, "");
    if (cleaned.length > 2)
      cleaned = `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 6)}`;
    setTargetDate(cleaned);
  };

  const validateGoalForm = () => {
    let valid = true;
    if (!goalName?.trim()) {
      setNameError("Goal name is required");
      valid = false;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setAmountError("Enter a valid target");
      valid = false;
    }
    if ((targetDate || "").length < 9) {
      setDateError("Enter valid date (MM / YYYY)");
      valid = false;
    }
    if (description.length > 80) {
      setDescError("Max 80 characters");
      valid = false;
    }
    if (targetAmount && isNaN(Number(targetAmount))) {
      setAmountError("Enter a valid number");
      valid = false;
    }
    if (currentGoalAmount > Number(targetAmount)) {
      setAmountError("Target cannot be less than current amount");
      valid = false;
    }
    return valid;
  };

  const closeModal = () => {
    setModalVisible(false);
    setGoalName("");
    setTargetAmount("");
    setTargetDate("");
    setDescription("");
    setSelectedIcon(null);
    setSelectedGoalId(null);
    setNameError("");
    setAmountError("");
    setDateError("");
    setDescError("");
  };

  const handleSaveGoal = async () => {
    if (!validateGoalForm()) return;
    const [month, year] = targetDate.split(" / ");
    const formattedDate = `${year}-${month.padStart(2, "0")}-01`;
    const payload: GoalPayload = {
      goal_name: goalName,
      target_amount: parseFloat(targetAmount),
      target_date: formattedDate,
      description: description || "",
      icon_name: selectedIcon ?? undefined,
    };
    try {
      if (selectedGoalId) await updateGoal(selectedGoalId, payload);
      else await saveGoal(payload);
      loadGoals();
      closeModal();
    } catch {
      Alert.alert("Error", "Could not save goal.");
    }
  };

  const handleSaveAddMoney = async () => {
    const amountVal = parseFloat(addAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setAddMoneyError("Enter a valid amount");
      return;
    }
    if (amountVal + currentGoalAmount > currentGoalTarget) {
      setAddMoneyError("Amount exceeds target");
      return;
    }
    try {
      await addMoneyToGoal({ goal_id: selectedGoalId!, amount: amountVal });
      loadGoals();
      setModalAddMoneyVisible(false);
      setAddAmount("");
      setAddMoneyError("");
    } catch {
      Alert.alert("Error", "Failed to add money.");
    }
  };

  // --- RENDER ITEM ---
  const renderGoal = ({ item }: { item: GoalItems }) => {
    const cur = Number(item.current_amount || 0);
    const tar = Number(item.target_amount || 0);
    const isCompleted = cur >= tar;
    const progress = tar > 0 ? Math.min((cur / tar) * 100, 100) : 0;

    return (
      <View style={styles.card}>
        {/* Main Content Area */}
        <View style={styles.cardPadding}>
          <View style={styles.cardTop}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={
                  isCompleted
                    ? "checkmark-circle"
                    : (item.icon_name as any) || "rocket"
                }
                size={22}
                color={isCompleted ? "#10B981" : "#3B82F6"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.goalName}>{item.goal_name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isCompleted ? "#D1FAE5" : "#FEF3C7" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isCompleted ? "#065F46" : "#92400E" },
                    ]}
                  >
                    {isCompleted ? "Completed" : "Incomplete"}
                  </Text>
                </View>
              </View>
              <Text style={styles.goalTarget}>
                Target: ₱{tar.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
          </View>

          {item.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          ) : null}

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress}%`,
                  backgroundColor: isCompleted ? "#10B981" : "#3B82F6",
                },
              ]}
            />
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.currentAmount}>₱{cur.toLocaleString()}</Text>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#64748B" />
              <Text style={styles.dateText}>
                {item.target_date
                  ? new Date(item.target_date).toLocaleDateString()
                  : "No Date"}
              </Text>
            </View>
          </View>
        </View>

        {/* --- IMPROVED FOOTER UI --- */}
        <View style={styles.footerActionRow}>
          {!isCompleted && (
            <Pressable
              style={[styles.footerButton, styles.borderRight]}
              onPress={() => {
                setSelectedGoalId(item.goal_id);
                setCurrentGoalAmount(cur);
                setCurrentGoalTarget(tar);
                setModalAddMoneyVisible(true);
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#10B981" />
              <Text style={[styles.footerButtonText, { color: "#10B981" }]}>
                Add
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.footerButton, styles.borderRight]}
            onPress={() => {
              setGoalName(item.goal_name || "");
              setTargetAmount((item.target_amount || 0).toString());
              setCurrentGoalAmount(Number(item.current_amount || 0));
              const d = new Date(item.target_date);
              setTargetDate(
                `${(d.getMonth() + 1).toString().padStart(2, "0")} / ${d.getFullYear()}`,
              );
              setDescription(item.description || "");
              setSelectedIcon(item.icon_name || null);
              setSelectedGoalId(item.goal_id);
              setModalVisible(true);
            }}
          >
            <Ionicons name="create-outline" size={20} color="#3B82F6" />
            <Text style={[styles.footerButtonText, { color: "#3B82F6" }]}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            style={styles.footerButton}
            onPress={() => {
              Alert.alert("Delete", "Are you sure?", [
                { text: "No" },
                {
                  text: "Yes",
                  onPress: () => deleteGoal(item.goal_id).then(loadGoals),
                },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.footerButtonText, { color: "#EF4444" }]}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {goals.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Progress</Text>
              <Text style={styles.summaryMainAmount}>
                ₱{totals.current.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.summaryPercentage}>
              {Math.round(totals.progress)}%
            </Text>
          </View>
          <div style={styles.summaryProgressTrack}>
            <div
              style={{
                ...styles.summaryProgressBar,
                width: `${totals.progress}%`,
              }}
            />
          </div>
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryFooterText}>
              Target: ₱{totals.target.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.goal_id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Wishlist Goals</Text>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No goals found.</Text>
        }
      />

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </Pressable>

      {/* MODALS REMAIN THE SAME... */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {selectedGoalId ? "Edit Goal" : "New Goal"}
            </Text>
            <FlatList
              data={iconOptions}
              numColumns={5}
              keyExtractor={(i) => i}
              ListHeaderComponent={
                <>
                  <Text style={styles.inputLabel}>Goal Name</Text>
                  <TextInput
                    style={[styles.input, nameError && styles.inputError]}
                    value={goalName}
                    onChangeText={(t) => {
                      setGoalName(t);
                      setNameError("");
                    }}
                    placeholder="e.g. Travel"
                  />
                  {nameError ? (
                    <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}
                  <View style={styles.inputRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.inputLabel}>Target (₱)</Text>
                      <TextInput
                        style={[styles.input, amountError && styles.inputError]}
                        value={targetAmount}
                        onChangeText={(t) => {
                          setTargetAmount(t);
                          setAmountError("");
                        }}
                        keyboardType="numeric"
                        placeholder="0.00"
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.inputLabel}>Deadline</Text>
                      <TextInput
                        style={[styles.input, dateError && styles.inputError]}
                        value={targetDate}
                        onChangeText={handleDateChange}
                        placeholder="MM / YYYY"
                        maxLength={9}
                      />
                    </View>
                  </View>
                  {amountError ? (
                    <Text style={styles.errorText}>{amountError}</Text>
                  ) : null}
                  {dateError ? (
                    <Text style={styles.errorText}>{dateError}</Text>
                  ) : null}
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[
                      styles.inputDescription,
                      descError && styles.inputError,
                    ]}
                    value={description}
                    onChangeText={(t) => {
                      setDescription(t);
                      setDescError("");
                    }}
                    multiline
                    placeholder="Optional..."
                  />
                  {descError ? (
                    <Text style={styles.errorText}>{descError}</Text>
                  ) : null}
                  <Text style={styles.inputLabel}>Icon</Text>
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
                    name={item as any}
                    size={22}
                    color={selectedIcon === item ? "#10B981" : "#475569"}
                  />
                </Pressable>
              )}
              ListFooterComponent={
                <View style={styles.buttonRow}>
                  <Pressable style={styles.btnSecondary} onPress={closeModal}>
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.btnPrimary} onPress={handleSaveGoal}>
                    <Text style={{ color: "#FFF" }}>Save Goal</Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent visible={modalAddMoneyVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Savings</Text>
            <TextInput
              style={[styles.input, addMoneyError && styles.inputError]}
              value={addAmount}
              onChangeText={(t) => {
                setAddAmount(t);
                setAddMoneyError("");
              }}
              placeholder="0.00"
              keyboardType="numeric"
            />
            {addMoneyError ? (
              <Text style={styles.errorText}>{addMoneyError}</Text>
            ) : null}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.btnSecondary}
                onPress={() => {
                  setModalAddMoneyVisible(false);
                  setAddAmount("");
                }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable style={styles.btnPrimary} onPress={handleSaveAddMoney}>
                <Text style={{ color: "#FFF" }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFDFF" },
  summaryCard: {
    backgroundColor: "#0F172A",
    margin: 20,
    padding: 20,
    borderRadius: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#DBEAFE",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  summaryMainAmount: { color: "#FFF", fontSize: 26, fontWeight: "800" },
  summaryPercentage: { color: "#10B981", fontSize: 22, fontWeight: "800" },
  summaryProgressTrack: {
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 5,
    marginTop: 15,
  },
  summaryProgressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 5,
  },
  summaryFooter: { marginTop: 12 },
  summaryFooterText: { color: "#fff" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardPadding: { padding: 20 },
  cardTop: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
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
  progressBar: { height: "100%", borderRadius: 4 },
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
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: { fontSize: 9, fontWeight: "bold" },
  descriptionContainer: { marginTop: 8 },
  descriptionText: { fontSize: 13, color: "#475569" },

  // NEW FOOTER STYLES
  footerActionRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  footerButtonText: { fontSize: 13, fontWeight: "700" },
  borderRight: { borderRightWidth: 1, borderRightColor: "#F1F5F9" },

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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: { fontWeight: "700", marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputError: { borderColor: "#EF4444" },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4 },
  inputDescription: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputRow: { flexDirection: "row" },
  iconOption: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  iconSelected: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  buttonRow: { flexDirection: "row", marginTop: 25, gap: 10, marginBottom: 20 },
  btnPrimary: {
    flex: 2,
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94A3B8" },
});
