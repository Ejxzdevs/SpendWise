import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "@/context/authContext";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { logout, username } = useContext(AuthContext);

  const handleLogout = async () => {
    setLoading(true);

    // Give React a chance to render the spinner
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Home Page</Text>
      <Text>welcome back {username}</Text>
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#509893" }]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
  },
  text: { fontSize: 24, fontWeight: "bold" },
  button: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: { color: "#fff" },
});
