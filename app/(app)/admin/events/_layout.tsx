import { Stack } from "expo-router";

export default function AdminEventsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: "Create Event" }} />
    </Stack>
  );
}
