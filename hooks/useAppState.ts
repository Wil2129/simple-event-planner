import { BookingsContext } from "@/features/bookings/bookingsContext";
import { EventsContext } from "@/features/events/eventsContext";
import { useCallback, useContext, useMemo } from "react";
import { useSession } from "./useSession";

export function useAppState() {
    const {reset: eventsReset, ...eventsState} = useContext(EventsContext);
    const {reset: bookingsReset, ...bookingsState} = useContext(BookingsContext);
    const {reset: userReset, ...userState} = useSession();

    const reset = useCallback(() => {
        userReset();
        eventsReset();
        bookingsReset();
    }, [userReset, eventsReset, bookingsReset]);

    return useMemo(
        () => ({
            ...userState,
            ...eventsState,
            ...bookingsState,
            isUserLoading: userState.isLoading,
            isEventsLoading: eventsState.isLoading,
            isBookingsLoading: bookingsState.isLoading,
            isLoading:
                userState.isLoading || eventsState.isLoading || bookingsState.isLoading,
            // userError: userState.error,
            // eventsError: eventsState.error,
            // bookingsError: bookingsState.error,
            error: userState.error || eventsState.error || bookingsState.error,
            reset
        }),
        [eventsState, bookingsState, userState, reset]
    );
}

export function useEventBookingsCount(id: string): number {
    const { bookings } = useAppState();
    const count = useMemo(
        () => bookings.filter((b) => b.eventId === id).length,
        [bookings, id]
    );
    return count;
}
