import React, { useContext } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/context/authContext";
import { useAuthUser } from "@/hooks/use-auth-user";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const { logout } = useContext(AuthContext);

  // Prevent render until user is resolved
  if (loading) {
    return null;
  }

  const username = user?.username ?? "Guest";
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ padding: 0 }}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{username.toLocaleUpperCase()}</Text>
            <Text style={styles.userSub}>Personal Account</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.drawerItems}>
          <DrawerItem
            label="Dashboard"
            icon={({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/")}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Income"
            icon={({ color, size }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/income")}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Expenses"
            icon={({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/expense")}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Savings Goals"
            icon={({ color, size }) => (
              <Ionicons name="trophy-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/wishlist")}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Logout"
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            )}
            onPress={logout}
            labelStyle={styles.drawerLabel}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0F172A",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        drawerActiveTintColor: "#10B981",
        drawerInactiveTintColor: "#64748B",
        drawerType: "slide",
        headerTitle: () => (
          <View style={styles.headerContainer}>
            {/* Bars */}
            <View style={styles.bars}>
              <View style={[styles.bar, { height: 8 }]} />
              <View style={[styles.bar, { height: 14 }]} />
              <View style={[styles.bar, { height: 20 }]} />
              <View style={[styles.bar, { height: 26 }]} />
            </View>

            {/* Brand text */}
            <Text style={styles.brandText}>
              Spend<Text style={styles.brandTextBold}>Wise</Text>
            </Text>
          </View>
        ),

        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "SpendWise Dashboard",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E293B",
    paddingVertical: Platform.OS === "ios" ? 30 : 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  drawerItems: {
    paddingHorizontal: 8,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 6,
  },

  bar: {
    width: 4,
    backgroundColor: "#2ec4b6",
    marginRight: 3,
    borderRadius: 2,
  },

  brandText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#eef0f3",
  },

  brandTextBold: {
    fontWeight: "800",
    color: "#2ec4b6",
  },
});
