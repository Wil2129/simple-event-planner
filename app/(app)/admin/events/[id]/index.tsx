import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";
import EventDetail from "@/components/EventDetail";
import { useAppState } from "@/hooks/useAppState";
import NotFoundScreen from "@/app/(app)/+not-found";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{id: string}>();

  const { events, deleteEvent } = useAppState();
  const upcomingEvent = events.find((e) => e.id === id);

  return (
    <ThemedView style={styles.container}>
      {upcomingEvent ? (
        <EventDetail event={upcomingEvent} />
      ) : (
        <NotFoundScreen />
      )}
      <ThemedView style={styles.buttonContainer}>
        <ThemedButton
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: pressed ? "darkred" : "crimson",
          })}
          title="Delete"
          onPress={async() => {
            if (router.canGoBack()) {
              router.back();
            }
            await deleteEvent(id);
          }}
        />
        <Link
          href={{
            pathname: "/admin/events/[id]/edit",
            params: { id },
          }}
          asChild
        >
          <ThemedButton style={{ flex: 1 }} title="Edit" />
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  detail: {
    gap: 8,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    elevation: 2,
    boxShadow: "0 -2px 2px #40404040",
  },
});
