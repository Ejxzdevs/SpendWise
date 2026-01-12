import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
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
