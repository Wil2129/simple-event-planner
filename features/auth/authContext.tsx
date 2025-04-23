import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";
import { User } from "@/utils/types";
import { validateEmail } from "@/utils/utils";
import authReducer, {
  authError,
  authLoading,
  authSuccess,
  listUsers,
  logOut,
  setUser,
} from "./authSlice";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

export type AuthContextType = {
  signIn: (args: { email: string; password: string }) => Promise<void>;
  signUp: (args: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
  reset: () => void;
  user: User | null;
  isLoading: boolean;
  error?: string | null;
  users?: User[] | null;
};

const initialState = {
  user: null,
  isLoading: false,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async ({ email, password }) => {},
  signUp: async (args) => {},
  signOut: () => null,
  continueAsGuest: () => null,
  reset: () => null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  // const [[isLoading, session], setSession] = useStorageState("session")
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setSession = async (user: User) => {
    console.log("before setUser");
    dispatch(setUser(user));
    console.log("after setUser");
    console.log("before setItemAsync");
    await setItemAsync(SESSION_KEY, JSON.stringify(user));
    console.log("after setItemAsync");
    console.log("before authSuccess");
    dispatch(authSuccess());
    console.log("after authSuccess");
  };

  const { user } = state;
  useEffect(() => {
    async function fetchSession() {
      try {
        if (!user) {
          dispatch(authLoading());
          const session = await getItemAsync(SESSION_KEY);
          if (session && !ignore) {
            dispatch(setUser(JSON.parse(session)));
          }
          dispatch(authSuccess());
        }
      } catch (error) {
        dispatch(authError(`${error}`));
        console.error("Auth (SESSION) error:", error);
      }
    }

    let ignore = false;
    fetchSession();
    return () => {
      ignore = true;
    };
  }, [user]);

  const signIn = useCallback(
    async ({
      email: $email,
      password: $password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        console.log("before authLoading");
        dispatch(authLoading());
        console.log("after authLoading");
        if (!validateEmail($email)) {
          throw new Error("The email address is badly formatted.");
        }
        const result = state.users?.find(
          (user) => user.email === $email
        );
        if (result) {
          console.log(result);
          const user: User = { ...result, id: String(result.id) };
          console.log("before setSession");
          await setSession(user);
          console.log("after setSession");
        } else {
          throw new Error("Incorrect email or password");
        }
      } catch (error) {
        dispatch(authError(`${error}`));
        console.error("Auth (SIGN-IN) error:", error);
      }
    },
    []
  );
  const signUp = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        dispatch(authLoading());
        if (!name.length) {
          throw new Error("A non-empty name must be provided");
        }
        if (!validateEmail(email)) {
          throw new Error("The email address is badly formatted.");
        }
        if (password.length < 6) {
          throw new Error("The password must be 6 characters long or more.");
        }
        const user: User = {
          id: String(state.users?.length) ,
          name,
          email,
          role: "client",
        };
        await setSession(user);
      } catch (error) {
        dispatch(authError(`${error}`));
        console.error("Auth (SIGNUP) error:", error);
      }
    },
    []
  );
  const signOut = useCallback(async () => {
    await deleteItemAsync(SESSION_KEY);
    dispatch(logOut());
  }, []);

  const continueAsGuest = useCallback(async () => {
    await setSession({
      id: "0",
      name: "Guest",
      email: "guest@localhost",
      role: "guest",
    });
  }, []);
  const reset = useCallback(() => {
    dispatch(authSuccess());
  }, []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      continueAsGuest,
      reset,
    }),
    [signIn, signUp, signOut, continueAsGuest, reset, state]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

const SESSION_KEY = "session";
