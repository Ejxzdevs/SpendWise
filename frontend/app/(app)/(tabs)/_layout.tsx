import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="income" options={{ title: "Income" }} />
      <Stack.Screen name="expense" options={{ title: "Expense" }} />
      <Stack.Screen name="wishlist" options={{ title: "Wishlist" }} />
    </Stack>
  );
}
