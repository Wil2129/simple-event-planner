import { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { UpcomingEvent } from "@/utils/types";
import { AdminEvent } from "@/components/AdminEvent";
import { Link } from "expo-router";
import { useAppState } from "@/hooks/useAppState";
import Logout from "@/components/Logout";

export default function AdminDashboardScreen() {
  const { events } = useAppState();

  const renderItem = useCallback(({ item }: { item: UpcomingEvent }) => {
    return <AdminEvent event={item} />;
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Events</ThemedText>
          <Logout />
        </ThemedView>
        <Link style={styles.button} href="/admin/events/create" asChild>
          <ThemedButton icon="add" title="Create Event" />
        </Link>
      </ThemedView>
      <FlatList
        data={events}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    marginTop: 16,
    gap: 16,
    overflow: "hidden",
  },
  header: {
    paddingBottom: 16,
    gap: 16,
    elevation: 1,
    boxShadow: "0 1px 1px #80808080",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  button: {
    marginHorizontal: 24,
  },
});
