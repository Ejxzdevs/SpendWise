import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Main Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₱45,250.00</Text>
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
            <Text style={styles.statValue}>₱60,000</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="arrow-up" size={20} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValue}>₱14,750</Text>
          </View>
        </View>
      </View>

      {/* 3. Category Spending (Horizontal) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <Pressable>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <CategoryCard
          icon="fast-food"
          label="Food"
          amount="₱5,200"
          color="#F59E0B"
        />
        <CategoryCard
          icon="car"
          label="Transport"
          amount="₱2,100"
          color="#3B82F6"
        />
        <CategoryCard icon="film" label="Fun" amount="₱3,450" color="#8B5CF6" />
        <CategoryCard
          icon="cart"
          label="Groceries"
          amount="₱4,000"
          color="#10B981"
        />
      </ScrollView>

      {/* 4. Quick Insights / Budget Status */}
      <Text style={[styles.sectionTitle, { marginLeft: 16, marginTop: 24 }]}>
        Quick Insights
      </Text>
      <View style={styles.insightCard}>
        <View style={styles.insightContent}>
          <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.insightTitle}>Budget Alert</Text>
            <Text style={styles.insightDesc}>
              You've spent 85% of your Entertainment budget for January.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightContent}>
          <Ionicons name="trending-down-outline" size={24} color="#10B981" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.insightTitle}>Good News!</Text>
            <Text style={styles.insightDesc}>
              Your spending is 12% lower than last month at this time.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Helper component for Categories
const CategoryCard = ({ icon, label, amount, color }: any) => (
  <View style={styles.catCard}>
    <View style={[styles.catIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.catLabel}>{label}</Text>
    <Text style={styles.catAmount}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  balanceCard: {
    backgroundColor: "#10B981", // Teal Green
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
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
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
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  seeAll: {
    color: "#10B981",
    fontWeight: "600",
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  catCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    width: width * 0.35,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  catLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  catAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  insightCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  insightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  insightDesc: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 18,
  },
});
