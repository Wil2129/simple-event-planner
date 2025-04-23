import { UpcomingEvent } from "@/utils/types";

export default function eventsReducer(
    state: EventState,
    action: EventAction
): EventState {
    switch (action.type) {
        case FETCH_EVENTS:
            return { ...state, events: action.events };
        case CREATE_EVENT:
            return { ...state, events: [...state.events, action.event] };
        case EDIT_EVENT:
            const event = action.event;
            return {
                ...state,
                events: state.events.map((e) =>
                    e.id === event.id ? { ...e, ...event } : e
                ),
            };
        case DELETE_EVENT:
            return {
                ...state,
                events: state.events.filter((e) => e.id !== action.id),
            };
        case EVENTS_LOADING:
            return { ...state, isLoading: true };
        case EVENTS_SUCCESS:
            return { ...state, isLoading: false, error: undefined };
        case EVENTS_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        default:
            return state;
    }
}

const actions = {
    listEvents: (payload: UpcomingEvent[]) => ({
        type: FETCH_EVENTS,
        events: payload,
    }),
    addEvent: (payload: UpcomingEvent) => ({
        type: CREATE_EVENT,
        event: payload,
    }),
    updateEvent: (
        payload: Partial<UpcomingEvent> & { id: UpcomingEvent["id"] }
    ) => ({
        type: EDIT_EVENT,
        event: payload,
    }),
    removeEvent: (payload: string) => ({ type: DELETE_EVENT, id: payload }),
    eventsLoading: () => ({ type: EVENTS_LOADING }),
    eventsSuccess: () => ({ type: EVENTS_SUCCESS }),
    eventsError: (payload: string) => ({ type: EVENTS_FAILURE, error: payload }),
};
export const {
    listEvents,
    addEvent,
    updateEvent,
    removeEvent,
    eventsLoading,
    eventsSuccess,
    eventsError,
} = actions;

export interface EventState {
    events: UpcomingEvent[];
    isLoading: boolean;
    error?: string;
}

type EventAction =
    | { type: typeof FETCH_EVENTS; events: UpcomingEvent[] }
    | { type: typeof CREATE_EVENT; event: UpcomingEvent }
    | {
        type: typeof EDIT_EVENT;
        event: Partial<UpcomingEvent> & { id: UpcomingEvent["id"] };
      }
    | { type: typeof DELETE_EVENT; id: string }
    | { type: typeof EVENTS_LOADING }
    | { type: typeof EVENTS_SUCCESS }
    | { type: typeof EVENTS_FAILURE; error: string };

const EventActionTypes = {
    FETCH_EVENTS: "events/fetch",
    CREATE_EVENT: "events/create",
    EDIT_EVENT: "events/edit",
    DELETE_EVENT: "events/delete",
    EVENTS_LOADING: "events/loading",
    EVENTS_SUCCESS: "events/success",
    EVENTS_FAILURE: "events/failure",
} as const;
const {
    FETCH_EVENTS,
    CREATE_EVENT,
    EDIT_EVENT,
    DELETE_EVENT,
    EVENTS_LOADING,
    EVENTS_SUCCESS,
    EVENTS_FAILURE,
} = EventActionTypes;
