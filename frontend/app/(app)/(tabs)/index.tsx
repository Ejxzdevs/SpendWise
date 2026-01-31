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

// Import your services
import { fetchExpenses } from "@/services/expenseServices";
import { fetchIncomes } from "@/services/incomeServices";
import { fetchGoals } from "@/services/goalServices";

const { width } = Dimensions.get("window");

// Helper to map categories to specific icons
const getCategoryIcon = (category: string) => {
  const map: Record<string, any> = {
    Food: "fast-food",
    Transport: "car",
    Fun: "film",
    Groceries: "cart",
    Bills: "receipt",
    Health: "medkit",
  };
  return map[category] || "wallet";
};

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

      // Safely extract arrays
      const expenses = expenseRes?.data || [];
      const incomes = incomeRes?.data || [];
      const goals = goalRes?.data || [];

      // 1. Calculate Totals with Number conversion to fix ₱NaN
      const totalIn = incomes.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );
      const totalOut = expenses.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );

      // 2. Group Expenses by Category & LIMIT TO 3
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
        .sort((a, b) => b.amount - a.amount) // Highest spending first
        .slice(0, 3); // LIMIT TO 3

      // 3. Sort Goals by MOST RECENT (created_at) & LIMIT TO 3
      const recentGoals = goals
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 3); // LIMIT TO 3

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
      {/* 1. Main Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
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

      {/* 2. Income vs Expense Row */}
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

      {/* 3. Category Spending (Limited to 3) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <Pressable>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.categoriesContainer}>
        {data.categoryTotals.map((item, index) => (
          <CategoryCard
            key={index}
            icon={getCategoryIcon(item.category)}
            label={item.category}
            amount={`₱${item.amount.toLocaleString()}`}
            color={item.color}
          />
        ))}
      </View>

      {/* 4. Financial Goals (Recent 3) */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Financial Goals</Text>
        <Pressable>
          <Text style={styles.seeAll}>Manage</Text>
        </Pressable>
      </View>

      {data.goals.map((goal) => {
        const progress =
          Math.min(
            (Number(goal.current_amount) / Number(goal.target_amount)) * 100,
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
      })}

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
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
  },
  notificationBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
  },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statLabel: { fontSize: 12, color: "#64748B" },
  statValue: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  seeAll: { color: "#10B981", fontWeight: "600" },
  categoriesContainer: { paddingHorizontal: 16 }, // Changed to vertical list for cleaner look if limiting to 3
  catCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 8,
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
  catLabel: { fontSize: 12, color: "#64748B" },
  catAmount: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
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
    borderRadius: 12,
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
  goalNameText: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  goalProgressText: { fontSize: 12, fontWeight: "700", color: "#10B981" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
});
