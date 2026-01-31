import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { expenseCategoryIcons } from "@/types/category";

// Import your services
import { fetchExpenses } from "@/services/expenseServices";
import { fetchIncomes } from "@/services/incomeServices";
import { fetchGoals } from "@/services/goalServices";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    goals: [] as any[],
    categoryTotals: [] as { category: string; amount: number; color: string }[],
  });

  const loadDashboardData = async () => {
    try {
      const [expenseRes, incomeRes, goalRes] = await Promise.all([
        fetchExpenses(),
        fetchIncomes(),
        fetchGoals(),
      ]);

      const expenses = expenseRes?.data || [];
      const incomes = incomeRes?.data || [];
      const goals = goalRes?.data || [];

      const totalIn = incomes.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );
      const totalOut = expenses.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );

      // Group Expenses by Category
      const categoriesMap = expenses.reduce((acc: any, curr: any) => {
        acc[curr.category] =
          (acc[curr.category] || 0) + (Number(curr.amount) || 0);
        return acc;
      }, {});

      const categoryTotals = Object.keys(categoriesMap)
        .map((cat, index) => ({
          category: cat,
          amount: categoriesMap[cat],
          color: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"][
            index % 5
          ],
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

      // Sort Goals by Most Recent
      const recentGoals = goals
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 3);

      setData({
        totalIncome: totalIn,
        totalExpenses: totalOut,
        goals: recentGoals,
        categoryTotals: categoryTotals,
      });
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const totalBalance = data.totalIncome - data.totalExpenses;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10B981"
        />
      }
    >
      {/* Main Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: totalBalance >= 0 ? "#10B981" : "#EF4444" },
            ]}
          >
            ₱
            {totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <Pressable style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* Income and Expenses Summary */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { marginRight: 12 }]}>
          <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="arrow-down" size={20} color="#10B981" />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>
              ₱{data.totalIncome.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="arrow-up" size={20} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValue}>
              ₱{data.totalExpenses.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Category Spending Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Spending</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {data.categoryTotals.length > 0 ? (
          data.categoryTotals.map((item, index) => (
            <CategoryCard
              key={index}
              icon={expenseCategoryIcons[item.category] || "cash-outline"}
              label={item.category}
              amount={`₱${item.amount.toLocaleString()}`}
              color={item.color}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}
      </View>

      {/* Financial Goals Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Financial Goals</Text>
      </View>

      <View style={styles.goalsListContainer}>
        {data.goals.length > 0 ? (
          data.goals.map((goal) => {
            const progress =
              Math.min(
                (Number(goal.current_amount) / Number(goal.target_amount)) *
                  100,
                100,
              ) || 0;
            return (
              <View key={goal.goal_id} style={styles.goalItem}>
                <View
                  style={[
                    styles.goalIconContainer,
                    { backgroundColor: "#3B82F620" },
                  ]}
                >
                  <Ionicons
                    name={goal.icon_name || "flag"}
                    size={22}
                    color="#3B82F6"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.goalInfoRow}>
                    <Text style={styles.goalNameText}>{goal.goal_name}</Text>
                    <Text style={styles.goalProgressText}>
                      {progress.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress}%`, backgroundColor: "#3B82F6" },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.emptyCard, { marginHorizontal: 16 }]}>
            <Ionicons name="trophy-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>No financial goals set</Text>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const CategoryCard = ({ icon, label, amount, color }: any) => (
  <View style={styles.catCard}>
    <View style={[styles.catIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View>
      <Text style={styles.catLabel}>{label}</Text>
      <Text style={styles.catAmount}>{amount}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  balanceCard: {
    backgroundColor: "#0F172A",
    margin: 16,
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#DBEAFE",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  balanceAmount: { fontSize: 30, fontWeight: "bold", marginTop: 4 },
  notificationBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 14,
  },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statLabel: { fontSize: 11, color: "#64748B", fontWeight: "600" },
  statValue: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  categoriesContainer: { paddingHorizontal: 16 },
  catCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  catLabel: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  catAmount: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
  goalsListContainer: {
    /* spacing */
  },
  goalItem: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  goalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalNameText: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  goalProgressText: { fontSize: 13, fontWeight: "800", color: "#10B981" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 10,
    fontWeight: "600",
  },
});
