import { StyleSheet } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { useSession } from "@/hooks/useSession";

export default function Logout() {
  const { signOut } = useSession();
  return (
    <ThemedButton
      title="Logout"
      icon="logout"
      style={styles.button}
      textStyle={styles.buttonText}
      type="outlined"
      onPress={signOut}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
    color: "red"
  },
});
