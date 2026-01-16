import React, { useState } from "react";
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

// Types for the Goal Item
interface GoalItem {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  icon: any;
  color: string;
}

export default function GoalsScreen() {
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("cart");

  // Static Data (You can replace this with a real backend later)
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: "1",
      name: "iPhone 15 Pro",
      targetAmount: 70000,
      savedAmount: 42000,
      targetDate: "Dec 2026",
      icon: "phone-portrait-outline",
      color: "#1E293B",
    },
    {
      id: "2",
      name: "Japan Vacation",
      targetAmount: 100000,
      savedAmount: 25000,
      targetDate: "May 2026",
      icon: "airplane-outline",
      color: "#E11D48",
    },
  ]);

  const handleCreateGoal = () => {
    if (!name || !amount) return;

    const newGoal: GoalItem = {
      id: Math.random().toString(),
      name,
      targetAmount: parseFloat(amount),
      savedAmount: 0,
      targetDate: date || "No Date",
      icon: selectedIcon,
      color: "#6366F1", // Default Indigo
    };

    setGoals([...goals, newGoal]);
    closeModal();
  };

  const closeModal = () => {
    setName("");
    setAmount("");
    setDate("");
    setModalVisible(false);
  };

  const renderGoal = ({ item }: { item: GoalItem }) => {
    const progress = (item.savedAmount / item.targetAmount) * 100;

    return (
      <View style={styles.goalCard}>
        <View style={styles.cardTop}>
          <View
            style={[styles.iconBox, { backgroundColor: item.color + "15" }]}
          >
            <Ionicons name={item.icon} size={28} color={item.color} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{item.name}</Text>
            <Text style={styles.goalDate}>Target: {item.targetDate}</Text>
          </View>
          <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: item.color },
            ]}
          />
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.amountSaved}>
            ₱{item.savedAmount.toLocaleString()}{" "}
            <Text style={styles.amountTotal}>
              / ₱{item.targetAmount.toLocaleString()}
            </Text>
          </Text>
          <Pressable style={styles.contributeBtn}>
            <Text style={styles.contributeText}>Add Money</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* List Content */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Savings Goals</Text>
            <Text style={styles.headerSubtitle}>
              Items you're working towards
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="gift-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No goals yet. Start dreaming!</Text>
          </View>
        }
      />

      {/* FIXED FLOATING ACTION BUTTON */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </Pressable>

      {/* CREATE GOAL MODAL */}
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
              <Text style={styles.modalTitle}>New Savings Goal</Text>

              <Text style={styles.label}>What are you saving for?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. New Laptop, Dream Car"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Target Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="₱ 0.00"
                placeholderTextColor="#94A3B8"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Target Date (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="MM / YYYY"
                placeholderTextColor="#94A3B8"
                value={date}
                onChangeText={setDate}
              />

              <Text style={styles.label}>Select Icon</Text>
              <View style={styles.iconPicker}>
                {[
                  "cart",
                  "airplane",
                  "home",
                  "car",
                  "gift",
                  "game-controller",
                ].map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                    ]}
                  >
                    <Ionicons
                      name={icon as any}
                      size={24}
                      color={selectedIcon === icon ? "#10B981" : "#64748B"}
                    />
                  </Pressable>
                ))}
              </View>

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={closeModal}
                >
                  <Text style={styles.btnTextSecondary}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={handleCreateGoal}
                >
                  <Text style={styles.btnTextPrimary}>Create Goal</Text>
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
  header: { paddingVertical: 24, paddingHorizontal: 4 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  headerSubtitle: { fontSize: 16, color: "#64748B", marginTop: 4 },
  listContainer: { padding: 20, paddingBottom: 100 },

  // Goal Card
  goalCard: {
    backgroundColor: "#FFF",
    marginBottom: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  goalInfo: { flex: 1, marginLeft: 16 },
  goalName: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  goalDate: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  percentageText: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  progressBackground: {
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5 },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  amountSaved: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  amountTotal: { fontWeight: "400", color: "#94A3B8" },
  contributeBtn: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  contributeText: { fontSize: 12, fontWeight: "700", color: "#10B981" },

  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 12, color: "#94A3B8", fontSize: 16 },

  // Floating Action Button
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabPressed: { transform: [{ scale: 0.9 }], opacity: 0.9 },

  // Modal Styles
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
  iconPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconOptionSelected: { borderColor: "#10B981", backgroundColor: "#ECFDF5" },
  buttonRow: { flexDirection: "row", marginTop: 32, gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#10B981" },
  btnSecondary: { backgroundColor: "#F1F5F9" },
  btnTextPrimary: { color: "#FFFFFF", fontWeight: "700" },
  btnTextSecondary: { color: "#64748B", fontWeight: "700" },
});
