import { router } from "expo-router";
import { ThemedButton } from "./ThemedButton";
import { StyleSheet } from "react-native";
import { useSession } from "@/hooks/useSession";

export default function GoToSignIn({ small }: { small?: boolean }) {
  const { signOut } = useSession();

  return (
    <ThemedButton
      title="Go to Sign-In"
      type={small ? "outlined" : "filled"}
      onPress={async () => {
        await signOut();
        router.replace("/sign-in");
      }}
      style={small ? styles.button : undefined}
      textStyle={small ? styles.buttonText : undefined}
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
  },
});
