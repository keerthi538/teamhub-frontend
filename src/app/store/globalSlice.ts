import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
  activeNav: string;
}

const initialState: InitialState = {
  loading: false,
  activeNav: "Documents",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setActiveNav(state, action: PayloadAction<string>) {
      state.activeNav = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  selectors: {
    selectActiveNav: (globalState) => globalState.activeNav,
  },
});

export const { selectActiveNav } = globalSlice.selectors;
export const { setActiveNav, setLoading } = globalSlice.actions;

export default globalSlice.reducer;
