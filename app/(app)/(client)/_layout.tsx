import { Redirect, Tabs, useSegments } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";

export default function ClientLayout() {
  const colorScheme = useColorScheme();
  const {user} = useSession();

  const segments = useSegments();
  const hideTabBar = segments.length > 4 && segments[3] == "events";

  if (user?.role === "admin") {
    return <Redirect href="/admin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            display: hideTabBar ? "none" : "flex",
          },
          default: {
            display: hideTabBar ? "none" : "flex",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(bookings)"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="text.badge.checkmark" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
