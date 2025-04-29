import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import bookingsReducer, {
  bookingsError,
  bookingsLoading,
  bookingsSuccess,
  BookingState,
  createBooking,
  deleteBooking,
  listBookings,
} from "./bookingsSlice";
import { useSQLiteContext } from "expo-sqlite";
import { useSession } from "@/hooks/useSession";

const initialState: BookingState = {
  bookings: [],
  isLoading: true,
};

export type BookingsContextType = BookingState & {
  bookEvent: (args: EventBooking) => Promise<void>;
  cancelBooking: (args: EventBooking) => Promise<void>;
  reset: () => void;
};

export const BookingsContext = createContext<BookingsContextType>({
  ...initialState,
  bookEvent: async (args) => {},
  cancelBooking: async (args) => {},
  reset: () => null,
});

export default function BookingsProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(bookingsReducer, initialState);

  const db = useSQLiteContext();

  const {user} = useSession();
  const isClient = user?.role === "client";

  useEffect(() => {
    async function fetchBookings() {
      try {
        dispatch(bookingsLoading());
        const results = await db.getAllAsync<{
          date_time: string;
          event_id: number;
          user_id: number;
        }>("SELECT * FROM bookings");
        if (!ignore) {
          dispatch(
            listBookings(
              results.map(({ date_time, event_id, user_id }) => ({
                dateTime: new Date(date_time),
                eventId: String(event_id),
                userId: String(user_id),
              }))
            )
          );
          dispatch(bookingsSuccess());
        }
      } catch (error) {
        dispatch(bookingsError(`${error}`));
        console.error("Bookings (GET) error:", error);
      }
    }

    let ignore = false;
    fetchBookings();
    return () => {
      ignore = true;
    };
  }, [db]);

  const bookEvent = useCallback(
    async ({ eventId, userId }: EventBooking) => {
      try {
        if (isClient) {
          dispatch(bookingsLoading());
          await db.runAsync(
            "INSERT INTO bookings (event_id, user_id, date_time) VALUES ($eventId, $userId, datetime('now','localtime'))",
            { $eventId: parseInt(eventId), $userId: parseInt(userId) }
          );
          dispatch(createBooking({ eventId, userId, dateTime: new Date() }));
          dispatch(bookingsSuccess());
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(bookingsError(`${error}`));
        console.error("Bookings (CREATE) error:", error);
      }
    },
    [db, isClient]
  );
  const cancelBooking = useCallback(
    async ({ eventId, userId }: EventBooking) => {
      try {
        if (isClient) {
          dispatch(bookingsLoading());
          const result = await db.runAsync(
            "DELETE FROM bookings WHERE event_id = $eventId AND user_id = $userId",
            { $eventId: parseInt(eventId), $userId: parseInt(userId) }
          );
          if (result.changes) {
            dispatch(deleteBooking(eventId, userId));
            dispatch(bookingsSuccess());
          }
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(bookingsError(`${error}`));
        console.error("Bookings (DELETE) error:", error);
      }
    },
    [db, isClient]
  );
  const reset = useCallback(() => {
    dispatch(bookingsSuccess());
  }, []);

  const contextValue: BookingsContextType = useMemo(
    () => ({ ...state, bookEvent, cancelBooking, reset }),
    [state, bookEvent, cancelBooking, reset]
  );

  return (
    <BookingsContext.Provider value={contextValue}>
      {children}
    </BookingsContext.Provider>
  );
}

export type EventBooking = { eventId: string; userId: string };
