import { User } from "@/utils/types";

export default function authReducer(
    state: AuthState,
    action: AuthAction
): AuthState {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.user };
        case FETCH_USERS:
            return { ...state, users: action.users };
        case AUTH_LOADING:
            return { ...state, isLoading: true };
        case SIGN_OUT:
            return { ...state, user: null };
        case AUTH_SUCCESS:
            return { ...state, isLoading: false, error: undefined };
        case AUTH_ERROR:
            return { ...state, isLoading: false, error: action.error };
        default:
            return state;
    }
}

const actions = {
    listUsers: (payload?: User[] | null) => ({ type: FETCH_USERS, users: payload }),
    setUser: (payload: User) => ({ type: SET_USER, user: payload }),
    logOut: () => ({ type: SIGN_OUT }),
    authLoading: () => ({ type: AUTH_LOADING }),
    authSuccess: () => ({ type: AUTH_SUCCESS }),
    authError: (payload: string) => ({ type: AUTH_ERROR, error: payload }),
};
export const {
    listUsers,
    setUser,
    logOut,
    authLoading,
    authSuccess,
    authError,
} = actions;

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error?: string;
    users?: User[] | null
}

export type AuthAction =
    | { type: typeof FETCH_USERS; users?: User[] | null }
    | { type: typeof SET_USER; user: User }
    | { type: typeof SIGN_OUT }
    | { type: typeof AUTH_LOADING }
    | { type: typeof AUTH_SUCCESS }
    | { type: typeof AUTH_ERROR; error: string };

const AuthActionTypes = {
    FETCH_USERS: "auth/fetch_users",
    SET_USER: "auth/set_user",
    SIGN_OUT: "auth/sign_out",
    AUTH_LOADING: "auth/loading",
    AUTH_SUCCESS: "auth/success",
    AUTH_ERROR: "auth/error",
} as const;
const {
    FETCH_USERS,
    SET_USER,
    AUTH_LOADING,
    SIGN_OUT,
    AUTH_SUCCESS,
    AUTH_ERROR
} = AuthActionTypes;
