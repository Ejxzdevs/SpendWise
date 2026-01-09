import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Home" onPress={() => router.push("/")} />
      <DrawerItem label="Explore" onPress={() => router.push("/explore")} />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: "Home", title: "App" }}
      />
    </Drawer>
  );
}
