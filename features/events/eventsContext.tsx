import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import eventsReducer, {
  addEvent,
  EventState,
  listEvents,
  removeEvent,
  eventsSuccess,
  eventsError,
  updateEvent,
  eventsLoading,
} from "./eventsSlice";
import { SnakifyKeys, UpcomingEvent } from "@/utils/types";
import { useSQLiteContext } from "expo-sqlite";
import { toSqlNamedParams } from "@/utils/database";
import { snakeToCamelKeys, toSnakeCase } from "@/utils/utils";
import { useSession } from "@/hooks/useSession";

const initialState: EventState = {
  events: [],
  isLoading: true,
};

export type EventsContextType = EventState & {
  createEvent: (event: EventData) => Promise<void>;
  editEvent: (id: string, event: Partial<UpcomingEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  reset: () => void;
};

export const EventsContext = createContext<EventsContextType>({
  ...initialState,
  createEvent: async (event) => {},
  editEvent: async (id, event) => {},
  deleteEvent: async (id) => {},
  reset: () => null,
});

export default function EventsProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const db = useSQLiteContext();

  const { user } = useSession();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchEvents() {
      try {
        dispatch(eventsLoading());
        const results = await db.getAllAsync<SnakifyKeys<DbEvent>>(
          "SELECT * FROM events"
        );
        if (!ignore) {
          dispatch(
            listEvents(
              results.map((e) => {
                const { id, dateTime, ...rest } = snakeToCamelKeys(e);
                return {
                  dateTime: new Date(dateTime),
                  ...rest,
                  id: String(id),
                };
              })
            )
          );
          dispatch(eventsSuccess());
        }
      } catch (error) {
        dispatch(eventsError(`${error}`));
        console.error("Events (GET) error:", error);
      }
    }

    let ignore = false;
    fetchEvents();
    return () => {
      ignore = true;
    };
  }, [db]);

  const createEvent = useCallback(
    async (event: EventData) => {
      try {
        if (isAdmin) {
          dispatch(eventsLoading());
          const { title, description, location, capacity, dateTime } = event;
          if (!title) {
            throw new Error("A non-empty title must be provided");
          }
          if (!description) {
            throw new Error("A non-empty description must be provided");
          }
          if (!location) {
            throw new Error("A non-empty location must be provided");
          }
          if (capacity < 1) {
            throw new Error("The event capacity must be greater than 0");
          }
          if (dateTime < new Date()) {
            throw new Error("The event date cannot be in the past");
          }
          const result = await db.runAsync(
            "INSERT INTO events (title, description, date_time, location, capacity, category, image_url) VALUES ($title, $description, $dateTime, $location, $capacity, $category, $imageUrl)",
            {
              ...toSqlNamedParams(event, {
                dateTime: (value) => (value as Date).toISOString(),
              }),
            }
          );
          dispatch(addEvent({ ...event, id: String(result.lastInsertRowId) }));
          dispatch(eventsSuccess());
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(eventsError(`${error}`));
        console.error("Events (CREATE) error:", error);
        throw error;
      }
    },
    [db, isAdmin]
  );
  const editEvent = useCallback(
    async (id: string, event: Partial<EventData>) => {
      try {
        if (isAdmin) {
          dispatch(eventsLoading());
          const { title, description, location, capacity } = event;
          if (title?.length === 0) {
            throw new Error("A non-empty title must be provided");
          }
          if (description?.length === 0) {
            throw new Error("A non-empty description must be provided");
          }
          if (location?.length === 0) {
            throw new Error("A non-empty location must be provided");
          }
          if (capacity !== undefined && capacity < 1) {
            throw new Error("The event capacity must be greater than 0");
          }
          const bindings = Object.keys(event).map(
            (key) => `${toSnakeCase(key)} = $${key}`
          );
          const result = await db.runAsync(
            `UPDATE events SET ${bindings.join(", ")} WHERE id = $id`,
            {
              $id: parseInt(id),
              ...toSqlNamedParams(event, {
                dateTime: (value) => (value as Date).toISOString(),
              }),
            }
          );
          console.log(bindings.join(", "));
          console.log({
            $id: parseInt(id),
            ...toSqlNamedParams(event, {
              dateTime: (value) => (value as Date).toISOString(),
            }),
          });
          console.log(result);

          if (result.changes) {
            dispatch(updateEvent({ ...event, id }));
            dispatch(eventsSuccess());
          }
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(eventsError(`${error}`));
        console.error("Events (UPDATE) error:", error);
        throw error;
      }
    },
    [db, isAdmin]
  );
  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        if (isAdmin) {
          dispatch(eventsLoading());
          const result = await db.runAsync(
            "DELETE FROM events WHERE id = $id",
            { $id: parseInt(id) }
          );
          if (result.changes) {
            dispatch(removeEvent(id));
            dispatch(eventsSuccess());
          }
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        dispatch(eventsError(`${error}`));
        console.error("Events (DELETE) error:", error);
      }
    },
    [db, isAdmin]
  );
  const reset = useCallback(() => {
    dispatch(eventsSuccess());
  }, []);

  const contextValue: EventsContextType = useMemo(
    () => ({ ...state, createEvent, editEvent, deleteEvent, reset }),
    [state, createEvent, editEvent, deleteEvent, reset]
  );

  return (
    <EventsContext.Provider value={contextValue}>
      {children}
    </EventsContext.Provider>
  );
}

type EventData = Omit<UpcomingEvent, "id">;
type DbEvent = SnakifyKeys<EventData> & { id: number; dateTime: string };
