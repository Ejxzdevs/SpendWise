import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="explore" options={{ title: "Explore" }} />
    </Stack>
  );
}
