import { Stack } from "expo-router";

export default function DynamicLayout({
  segment,
}: {
  segment: "(home)" | "(bookings)";
}) {
  return (
    <Stack>
      <Stack.Screen
        name={segment === "(bookings)" ? "my-bookings" : "index"}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="events/[id]"
        options={{
          headerTransparent: true,
          title: "",
        }}
      />
    </Stack>
  );
}
