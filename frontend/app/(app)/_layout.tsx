import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { getUserInfo } from "@/utils/authStorage";
import { useEffect, useState } from "react";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string }>({ username: "" });
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <DrawerContentScrollView contentContainerStyle={{ padding: 0 }} {...props}>
      <View style={styles.header}>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <DrawerItem label="Dashboard" onPress={() => router.push("/")} />
      <DrawerItem label="Explore" onPress={() => router.push("/explore")} />
      <DrawerItem label="Expenses" onPress={() => router.push("/expense")} />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#509893" },
        drawerActiveTintColor: "#5A0038",
        drawerInactiveTintColor: "#5A0038",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "SpendWise",
          headerTintColor: "#ffffff",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#509893",
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  role: {
    fontSize: 14,
    color: "#E0F2F1",
    marginTop: 4,
  },
});
