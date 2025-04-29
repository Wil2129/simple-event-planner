import { StyleSheet, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UpcomingEvent } from "@/utils/types";
import { useCallback } from "react";
import BookedEvent from "@/components/BookedEvent";
import { useAppState } from "@/hooks/useAppState";
import GoToSignIn from "@/components/GoToSignIn";
import Logout from "@/components/Logout";

export default function BookingsScreen() {
  const { user, events, bookings } = useAppState();

  const renderItem = useCallback(({ item }: { item: UpcomingEvent }) => {
    return <BookedEvent event={item} />;
  }, []);

  return user?.role === "guest" ? (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <GoToSignIn />
    </ThemedView>
  ) : (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          My Bookings
        </ThemedText>
        <Logout />
      </ThemedView>
      <FlatList
        data={events.filter((e) =>
          bookings
            .filter((b) => b.userId === user?.id)
            .map((b) => b.eventId)
            .includes(e.id)
        )}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
        style={{ paddingVertical: 16 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    overflow: "hidden",
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    elevation: 1,
    boxShadow: "0 1px 1px #80808080",
    justifyContent: "space-between",
  },
});
