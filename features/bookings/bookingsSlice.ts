import { Booking } from "@/utils/types";

export default function bookingsReducer(
    state: BookingState,
    action: BookingAction
): BookingState {
    switch (action.type) {
        case FETCH_BOOKINGS:
            return { ...state, bookings: action.bookings };
        case BOOK_EVENT:
            return { ...state, bookings: [...state.bookings, action.booking] };
        case DELETE_BOOKING:
            return {
                ...state,
                bookings: state.bookings.filter(
                    (b) => b.eventId !== action.eventId || b.userId !== action.userId
                ),
            };
        case BOOKINGS_LOADING:
            return { ...state, isLoading: true };
        case BOOKINGS_SUCCESS:
            return { ...state, isLoading: false, error: undefined };
        case BOOKINGS_ERROR:
            return { ...state, isLoading: false, error: action.error };
        default:
            return state;
    }
}

const actions = {
    listBookings: (payload: Booking[]) => ({
        type: FETCH_BOOKINGS,
        bookings: payload,
    }),
    createBooking: (booking: Booking) => ({ type: BOOK_EVENT, booking }),
    deleteBooking: (eventId: string, userId: string) => ({
        type: DELETE_BOOKING,
        eventId,
        userId,
    }),
    bookingsLoading: () => ({ type: BOOKINGS_LOADING }),
    bookingsSuccess: () => ({ type: BOOKINGS_SUCCESS }),
    bookingsError: (payload: string) => ({
        type: BOOKINGS_ERROR,
        error: payload,
    }),
};
export const {
    listBookings,
    createBooking,
    deleteBooking,
    bookingsLoading,
    bookingsSuccess,
    bookingsError,
} = actions;

export interface BookingState {
    bookings: Booking[];
    isLoading: boolean;
    error?: string;
}

export type BookingAction =
    | { type: typeof FETCH_BOOKINGS; bookings: Booking[] }
    | { type: typeof BOOK_EVENT; booking: Booking }
    | { type: typeof DELETE_BOOKING; eventId: string; userId: string }
    | { type: typeof BOOKINGS_LOADING }
    | { type: typeof BOOKINGS_SUCCESS }
    | { type: typeof BOOKINGS_ERROR; error: string };

const BookingActionTypes = {
    FETCH_BOOKINGS: "bookings/fetch",
    BOOK_EVENT: "bookings/create",
    DELETE_BOOKING: "bookings/delete",
    BOOKINGS_LOADING: "bookings/loading",
    BOOKINGS_SUCCESS: "bookings/success",
    BOOKINGS_ERROR: "bookings/error",
} as const;
const {
    FETCH_BOOKINGS,
    BOOK_EVENT,
    DELETE_BOOKING,
    BOOKINGS_LOADING,
    BOOKINGS_SUCCESS,
    BOOKINGS_ERROR,
} = BookingActionTypes;
