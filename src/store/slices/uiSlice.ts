import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UiState {
    themeMode: 'light' | 'dark' | null;
    loading: boolean;
}

const initialState: UiState = {
    themeMode: null,
    loading: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<'light' | 'dark' | null>) => {
            state.themeMode = action.payload;
        },
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setThemeMode, setGlobalLoading } = uiSlice.actions;

export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectGlobalLoading = (state: RootState) => state.ui.loading;

export default uiSlice.reducer;
