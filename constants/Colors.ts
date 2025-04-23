/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const disabledColorLight = '#687076';
const disabledColorDark = '#9BA1A6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: disabledColorLight,
    tabIconDefault: disabledColorLight,
    tabIconSelected: tintColorLight,
    disabledText: disabledColorLight,
    buttonBackground: tintColorLight,
    buttonBackgroundPressed: "#2196F3",
    buttonBackgroundDisabled: "#dfdfdf",
    buttonText: "white",
    buttonTextDisabled: "#a1a1a1",
    outlinedButtonBackground: "white",
    outlinedButtonBackgroundPressed: "#dfdfdf",
    outlinedButtonText: tintColorLight,
    outlinedButtonBorder: disabledColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: disabledColorDark,
    tabIconDefault: disabledColorDark,
    tabIconSelected: tintColorDark,
    disabledText: disabledColorDark,
    buttonBackground: "#40c0ff",
    buttonBackgroundPressed: "#2196F3",
    buttonBackgroundDisabled: "#404040",
    buttonText: tintColorLight,
    buttonTextDisabled: disabledColorDark,
    outlinedButtonBackground: "#151718",
    outlinedButtonBackgroundPressed: disabledColorDark,
    outlinedButtonText: tintColorLight,
    outlinedButtonBorder: tintColorDark,
  },
};
