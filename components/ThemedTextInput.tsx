import { TextInput, type TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export function ThemedTextInput({
  style,
  error,
  ...otherProps
}: TextInputProps & { error?: string }) {
  const color = useThemeColor({}, "text");

  return (
    <>
      <TextInput
        style={[
          {
            color,
            borderColor: color,
            borderRadius: 8,
            // height: 48,
            borderWidth: 1,
            padding: 12,
            fontSize: 16,
            lineHeight: 24,
          },
          style,
        ]}
        {...otherProps}
      />
      {error && (
        <ThemedText style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </ThemedText>
      )}
    </>
  );
}
