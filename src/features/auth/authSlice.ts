import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../../types";

// Initial state — user starts as not logged in
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  twoFactorPending: false,
};

const authSlice = createSlice({
  name: "auth", // Slice name (used in Redux DevTools)
  initialState,
  reducers: {
    // Called when login starts
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Called when login succeeds — stores the user
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.twoFactorPending = false;
    },

    // Called when any error happens
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Called after password login — waiting for OTP
    setTwoFactorPending(state, action: PayloadAction<boolean>) {
      state.twoFactorPending = action.payload;
    },

    // Called on logout — resets everything
    clearAuth(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.twoFactorPending = false;
    },
  },
});

// Export actions so components can dispatch them
export const { setLoading, setUser, setError, setTwoFactorPending, clearAuth } =
  authSlice.actions;

// Export the reducer to add to the store
export default authSlice.reducer;
