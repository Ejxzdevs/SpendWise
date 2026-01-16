import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
// 1. Ensure these imports are exactly like this
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUserInfo } from "@/utils/authStorage";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string }>({ username: "Guest" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (e) {
          console.error("Failed to parse user info");
        }
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ padding: 0 }}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userSub}>Personal Account</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={(styles.drawerItems, { padding: 0 })}>
          <DrawerItem
            label="Dashboard"
            inactiveTintColor="#64748B"
            activeTintColor="#10B981"
            icon={({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/")}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Income"
            inactiveTintColor="#64748B"
            activeTintColor="#10B981"
            icon={({ color, size }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/income")}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Expenses"
            inactiveTintColor="#64748B"
            activeTintColor="#10B981"
            icon={({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/expense")}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Savings Goals"
            inactiveTintColor="#64748B"
            activeTintColor="#10B981"
            icon={({ color, size }) => (
              <Ionicons name="trophy-outline" size={size} color={color} />
            )}
            onPress={() => router.push("/wishlist")}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Logout"
            inactiveTintColor="#64748B"
            activeTintColor="#10B981"
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            )}
            onPress={() => handleLogout()}
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
          backgroundColor: "#10B981",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        drawerActiveTintColor: "#10B981",
        drawerInactiveTintColor: "#64748B",
        drawerType: "slide",
        headerTitle: "SpendWise",
        headerTitleStyle: {
          color: "#ffffff",
          fontWeight: "bold",
        },
      }}
    >
      {/* Ensure the name matches your file structure */}
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
});
