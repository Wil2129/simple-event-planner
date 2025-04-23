import { Stack, useLocalSearchParams } from "expo-router";
import { Header } from "@react-navigation/elements";

export default function ManageEventLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title="Details"
              back={{ title: "", href: `/admin` }}
              headerBackButtonDisplayMode="minimal"
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          header: ({ options }) => (
            <Header
              {...options}
              title="Edit Event"
              back={{ title: "", href: `/admin/events/${id}` }}
              headerBackButtonDisplayMode="minimal"
            />
          ),
        }}
      />
    </Stack>
  );
}
