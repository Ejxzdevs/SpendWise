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
  ActivityIndicator,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const { width } = Dimensions.get("window");

export default function GoalsScreen() {
  const [goals, setGoals] = useState<GoalItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddMoneyVisible, setModalAddMoneyVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // --- FORM STATES ---
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const MAX_DESC_LENGTH = 80;
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);

  // --- ADD MONEY STATES ---
  const [addAmount, setAddAmount] = useState("");
  const [currentGoalAmount, setCurrentGoalAmount] = useState(0);
  const [currentGoalTarget, setCurrentGoalTarget] = useState(0);

  // --- INLINE ERROR STATES ---
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const validateGoalForm = () => {
    const amountVal = parseFloat(targetAmount);
    let valid = true;
    if (!goalName?.trim()) {
      setNameError("Goal name is required");
      valid = false;
    }
    if (!targetAmount || amountVal <= 0 || isNaN(amountVal)) {
      setAmountError("Enter a valid target");
      valid = false;
    }
    return valid;
  };

  const closeModal = () => {
    setModalVisible(false);
    setGoalName("");
    setTargetAmount("");
    setDescription("");
    setSelectedIcon(null);
    setSelectedGoalId(null);
    setNameError("");
    setAmountError("");
  };

  const handleSaveGoal = async () => {
    if (!validateGoalForm()) return;
    const payload: GoalPayload = {
      goal_name: goalName,
      target_amount: parseFloat(targetAmount),
      target_date: targetDate.toISOString(),
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
                color={isCompleted ? "#10B981" : "#509893"}
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
                    {isCompleted ? "Completed" : "Active"}
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
                  backgroundColor: isCompleted ? "#10B981" : "#509893",
                },
              ]}
            />
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.currentAmount}>₱{cur.toLocaleString()}</Text>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#64748B" />
              <Text style={styles.dateText}>
                {format(new Date(item.target_date), "MM/dd/yyyy")}
              </Text>
            </View>
          </View>
        </View>

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
              setTargetDate(new Date(item.target_date));
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
              Alert.alert("Delete", "Remove this goal?", [
                { text: "Cancel" },
                {
                  text: "Delete",
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
      {/* TOTAL PROGRESS CARD - Always Visible Now */}
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
        <View style={styles.summaryProgressTrack}>
          <View
            style={[
              styles.summaryProgressBar,
              { width: `${totals.progress}%` },
            ]}
          />
        </View>
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryFooterText}>
            Combined Target: ₱{totals.target.toLocaleString()}
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#509893"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.goal_id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Wishlist Goals</Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="gift-outline" size={50} color="#CBD5E1" />
              <Text style={styles.emptyText}>
                No goals found. Tap + to start saving!
              </Text>
            </View>
          }
        />
      )}

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </Pressable>

      {/* NEW GOAL MODAL */}
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
                    placeholder="e.g. New Laptop"
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
                      {amountError ? (
                        <Text style={styles.errorText}> {amountError}</Text>
                      ) : null}
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.inputLabel}>Deadline</Text>

                      {Platform.OS === "web" ? (
                        <input
                          type="date"
                          value={targetDate.toISOString().split("T")[0]}
                          style={styles.input}
                          onChange={(e) =>
                            setTargetDate(new Date(e.target.value))
                          }
                        />
                      ) : (
                        <DateTimePicker
                          value={targetDate}
                          style={styles.input}
                          mode="date"
                          display="default"
                          onChange={(event, date) =>
                            date && setTargetDate(date)
                          }
                        />
                      )}
                    </View>
                  </View>
                  <Text style={styles.inputLabel}>Description</Text>
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
                  <TextInput
                    style={[
                      styles.inputDescription,
                      description.length > MAX_DESC_LENGTH && styles.inputError,
                    ]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    placeholder="Why are you saving for this?"
                  />

                  <Text style={styles.inputLabel}>Choose Icon</Text>
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
                  <Pressable
                    style={[
                      styles.btn,
                      styles.btnPrimary,
                      description.length > MAX_DESC_LENGTH &&
                        styles.btnDisabled,
                    ]}
                    onPress={handleSaveGoal}
                    disabled={description.length > MAX_DESC_LENGTH}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "700" }}>
                      Save Goal
                    </Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ADD MONEY MODAL */}
      <Modal transparent visible={modalAddMoneyVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
            ]}
          >
            <Text style={styles.modalTitle}>Add Savings</Text>
            <Text style={styles.inputLabel}>Amount to add (₱)</Text>
            <TextInput
              style={[styles.input, addMoneyError && styles.inputError]}
              value={addAmount}
              onChangeText={(t) => {
                setAddAmount(t);
                setAddMoneyError("");
              }}
              placeholder="0.00"
              keyboardType="numeric"
              autoFocus
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
                <Text style={{ color: "#FFF", fontWeight: "700" }}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  summaryCard: {
    backgroundColor: "#1E293B",
    margin: 20,
    padding: 24,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryMainAmount: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryPercentage: { color: "#10B981", fontSize: 24, fontWeight: "800" },
  summaryProgressTrack: {
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 5,
    marginTop: 18,
  },
  summaryProgressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 5,
  },
  summaryFooter: { marginTop: 14 },
  summaryFooterText: { color: "#94A3B8", fontSize: 13 },

  list: { paddingHorizontal: 20, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardPadding: { padding: 20 },
  cardTop: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalName: { fontSize: 17, fontWeight: "700", color: "#1E293B" },
  goalTarget: { fontSize: 13, color: "#64748B", marginTop: 2 },
  percentageText: { fontSize: 16, fontWeight: "800", color: "#509893" },
  progressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    marginTop: 16,
  },
  progressBar: { height: "100%", borderRadius: 4 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  currentAmount: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  dateBadge: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    marginLeft: 4,
    color: "#64748B",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  descriptionContainer: {
    marginTop: 10,
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 8,
  },
  descriptionText: { fontSize: 13, color: "#475569", fontStyle: "italic" },
  charCount: { fontSize: 12, color: "#94A3B8" },

  footerActionRow: {
    flexDirection: "row",
    backgroundColor: "#FDFDFD",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  footerButtonText: { fontSize: 13, fontWeight: "700" },
  borderRight: { borderRightWidth: 1, borderRightColor: "#F1F5F9" },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 34,
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
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
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "#1E293B",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  inputError: { borderColor: "#EF4444" },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4, marginLeft: 4 },
  inputDescription: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputRow: { flexDirection: "row" },
  iconOption: {
    width: (width - 88) / 5,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  iconSelected: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  buttonRow: { flexDirection: "row", marginTop: 30, gap: 12, marginBottom: 20 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12 },
  btnDisabled: { backgroundColor: "#94A3B8" },
  btnPrimary: {
    flex: 2,
    backgroundColor: "#509893",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
  },
});
