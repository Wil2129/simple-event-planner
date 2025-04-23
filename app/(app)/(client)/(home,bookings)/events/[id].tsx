import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";
import EventDetail from "@/components/EventDetail";
import { useAppState, useEventBookingsCount } from "@/hooks/useAppState";
import NotFoundScreen from "@/app/(app)/+not-found";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  const {
    events,
    bookings,
    user,
    cancelBooking,
    bookEvent,
    isBookingsLoading,
  } = useAppState();
  const bookingsCount = useEventBookingsCount(id as string);

  const upcomingEvent = events.find((e) => e.id === id);
  const canBook = bookingsCount < (upcomingEvent?.capacity ?? 0);
  const isBooked = bookings.some(
    (b) => b.userId === user?.id && b.eventId === id
  );

  return (
    <ThemedView style={styles.container}>
      {upcomingEvent ? (
        <EventDetail event={upcomingEvent} />
      ) : (
        <NotFoundScreen />
      )}
      {user?.role !== "guest" && (
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton
            style={({ pressed }) =>
              isBooked && { backgroundColor: pressed ? "darkred" : "crimson" }
            }
            icon={isBookingsLoading ? "refresh" : undefined}
            title={
              isBooked
                ? "Cancel Booking"
                : canBook
                ? "Book Now"
                : "Fully Booked"
            }
            disabled={!canBook || isBookingsLoading}
            onPress={() => {
              const booking = {
                eventId: id as string,
                userId: user?.id as string,
              };
              if (isBooked) {
                cancelBooking(booking);
              } else {
                bookEvent(booking);
              }
            }}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    // elevation: 2,
    boxShadow: "0 -2px 2px #40404040",
  },
});
