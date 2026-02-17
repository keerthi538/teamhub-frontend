import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getMe } from "../apis";

export const fetchMe = createAsyncThunk("me/fetch", getMe);

interface UserState {
  id: number;
  email: string;
  name: string;
  teams?: Array<{ id: number; name: string }>;
  currentTeam?: { id: number; name: string } | null;
  status?: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  isAuthenticated?: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  id: 0,
  email: "",
  name: "",
  teams: [],
  currentTeam: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        console.log("Fetched user:", action.payload);
        state.status = "succeeded";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.teams = action.payload.teams;
        state.currentTeam = action.payload.currentTeam;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
