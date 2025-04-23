import React, { forwardRef } from "react"; // 1. Import forwardRef
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ThemedButtonProps = PressableProps & {
  title?: string;
  textStyle?: TextStyle;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  type?: "filled" | "text" | "outlined";
};

// 2. Wrap the component definition with forwardRef
//    Specify the type of the ref (Pressable) and the props type
export const ThemedButton = forwardRef<View, ThemedButtonProps>(
  (
    { style, disabled, textStyle, title, icon, type = "filled", ...otherProps },
    ref
  ) => {
    // 3. Accept ref as the second argument
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const color = disabled
      ? colors.disabledText
      : type === "text" || type === "outlined"
      ? colors.outlinedButtonText
      : colors.buttonText;

    const filledButtonStyle = ({
      pressed,
    }: {
      pressed: boolean;
    }): ViewStyle => ({
      backgroundColor: pressed
        ? colors.buttonBackgroundPressed
        : colors.buttonBackground,
      elevation: 4,
      borderWidth: 0,
    });

    const textButtonStyle = ({ pressed }: { pressed: boolean }): ViewStyle => ({
      backgroundColor: pressed
        ? colors.outlinedButtonBackgroundPressed
        : colors.outlinedButtonBackground,
    });

    const outlinedButtonStyle = ({
      pressed,
    }: {
      pressed: boolean;
    }): ViewStyle => ({
      backgroundColor: pressed
        ? colors.outlinedButtonBackgroundPressed
        : colors.outlinedButtonBackground,
      borderColor: colors.outlinedButtonBorder,
      borderWidth: 1,
    });

    const disabledButtonStyle: ViewStyle = {
      opacity: 1,
      backgroundColor: colors.buttonBackgroundDisabled,
      elevation: 0,
    };

    return (
      <Pressable
        ref={ref} // 4. Forward the ref to the Pressable component
        accessibilityRole="button"
        style={(state) => [
          {
            borderRadius: 8,
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            flexDirection: "row",
            opacity: state.hovered ? 0.5 : 1, // Note: You might want `state.pressed` instead of `hovered` for mobile
          },
          icon && title && { paddingRight: 16 },
          type === "text"
            ? textButtonStyle(state)
            : type === "outlined"
            ? outlinedButtonStyle(state)
            : filledButtonStyle(state),
          disabled && disabledButtonStyle,

          typeof style === "function" ? style(state) : style,
        ]}
        {...otherProps}
      >
        {icon && (
          <MaterialIcons
            size={textStyle?.fontSize ?? 18}
            name={icon}
            color={textStyle?.color ?? color}
          />
        )}
        {title && (
          <Text style={[{ color }, styles.text, textStyle]}>{title}</Text>
        )}
      </Pressable>
    );
  }
);

// Make sure displayName is set for better debugging (optional but recommended)
ThemedButton.displayName = "ThemedButton";

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
  },
});
