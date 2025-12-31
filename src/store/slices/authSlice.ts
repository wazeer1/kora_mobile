import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
            }
            state.isAuthenticated = true;
            state.error = null;
        },
        restoreTokens: (
            state,
            action: PayloadAction<{ token: string; refreshToken?: string }>
        ) => {
            state.token = action.payload.token;
            // Set a placeholder user to avoid null-checks failing in UI while real profile fetches
            state.user = { id: 'restoring', name: 'Restoring...', email: '' };
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
            }
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading, setError, restoreTokens } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
// Helper to get refresh token via store if needed inside non-hook functions
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
