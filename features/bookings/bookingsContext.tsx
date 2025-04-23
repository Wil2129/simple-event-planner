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

  const { user } = useSession();
  const isClient = user?.role === "client";

  const bookEvent = useCallback(
    async ({ eventId, userId }: EventBooking) => {
      try {
        if (isClient) {
          dispatch(bookingsLoading());
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
    [isClient]
  );
  const cancelBooking = useCallback(
    async ({ eventId, userId }: EventBooking) => {
      try {
        if (isClient) {
          dispatch(bookingsLoading());
          dispatch(deleteBooking(eventId, userId));
          dispatch(bookingsSuccess());
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(bookingsError(`${error}`));
        console.error("Bookings (DELETE) error:", error);
      }
    },
    [isClient]
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
