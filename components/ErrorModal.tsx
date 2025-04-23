import { useAppState } from "@/hooks/useAppState";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useEffect } from "react";

export default function ErrorModal() {
  const { error, reset } = useAppState();

  useEffect(() => {
    if (error) {
      setTimeout(reset, 4000);
    }
  }, [error]);

  return (
    error && (
      <ThemedView style={styles.container}>
        <ThemedText numberOfLines={2} style={styles.text}>
          {error}
        </ThemedText>
      </ThemedView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#303030",
  },
  text: {
    color: "#f0d0d0",
  },
});
