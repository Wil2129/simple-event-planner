import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";

export default function SignUpScreen() {
  const { user, signUp } = useSession();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");

  if (user) {
    if (user?.role === "admin") {
      return <Redirect href="/admin" />;
    }
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <ThemedView
        style={{
          borderColor: colors.disabledText,
          borderWidth: 1,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 32,
          flex: 1,
          gap: 8,
        }}
      >
        <ThemedText type="title" style={styles.centerText}>
          Create Account
        </ThemedText>
        <ThemedText
          style={[
            styles.centerText,
            { color: colors.disabledText, marginBottom: 32 },
          ]}
        >
          Sign up to start planning your events!
        </ThemedText>
        <ThemedText type="defaultSemiBold">Name</ThemedText>
        <ThemedTextInput
          placeholder="Enter your full name"
          placeholderTextColor={colors.disabledText}
          style={styles.textInput}
          onChangeText={onChangeName}
          value={name}
        />
        <ThemedText type="defaultSemiBold">Email</ThemedText>
        <ThemedTextInput
          placeholder="Enter your email"
          placeholderTextColor={colors.disabledText}
          style={styles.textInput}
          keyboardType="email-address"
          autoComplete="email"
          onChangeText={onChangeEmail}
          value={email}
        />
        <ThemedText type="defaultSemiBold">Password</ThemedText>
        <ThemedTextInput
          placeholder="Enter your password"
          placeholderTextColor={colors.disabledText}
          style={styles.textInput}
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={onChangePassword}
          value={password}
        />
        <ThemedButton
          style={styles.marginTop}
          title="Sign Up"
          onPress={async () => {
            Keyboard.dismiss();
            try {
              await signUp({ name, email, password });
              // if (user) {
              //   if (user.role === "admin") {
              //     router.replace("/admin");
              //   } else if (user.role === "client") {
              //     router.replace("/");
              //   }
              // }
            } catch (error) {
              console.error(error);
            }
          }}
        />
        <ThemedText style={[styles.centerText, styles.marginTop]}>
          Already registered?{" "}
          <Link style={styles.link} href="/sign-in">
            Log In
          </Link>
        </ThemedText>
        <ThemedView style={styles.row}>
          <ThemedView style={styles.divider} />
          <ThemedText>Or</ThemedText>
          <ThemedView style={styles.divider} />
        </ThemedView>
        <ThemedButton type="outlined" title="Continue as Guest" />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
    alignItems: "stretch",
  },
  centerText: {
    textAlign: "center",
  },
  textInput: {
    width: "100%",
  },
  marginTop: {
    marginTop: 16,
  },
  link: {
    color: "#0a7ea4",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#c0c0c0",
  },
});
