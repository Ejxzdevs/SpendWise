// app/index.tsx
import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not logged in → Auth flow
  if (!userToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in → App
  return <Redirect href="/(tabs)" />;
}
