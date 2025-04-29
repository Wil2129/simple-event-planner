import authReducer, { authSuccess, authError } from "@/features/auth/authSlice";

describe("authReducer", () => {
  it("should handle AUTH_SUCCESS", () => {
    const state = { user: null, isLoading: true };
    const action = authSuccess();
    expect(authReducer(state, action)).toEqual({ user: null, isLoading: false });
  });
  it("should handle AUTH_ERROR", () => {
    const state = { user: null, isLoading: true };
    const action = authError("Login failed");
    // Check if the error is set correctly in the state
    expect(authReducer(state, action)).toEqual({ user: null, isLoading: false, error: "Login failed" });
  });
});