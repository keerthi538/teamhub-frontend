import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getMe, createTeam as createTeamAPI } from "../apis";

export const fetchMe = createAsyncThunk("me/fetch", getMe);

export const createTeam = createAsyncThunk(
  "team/create",
  async (teamName: string, { dispatch }) => {
    const result = await createTeamAPI(teamName);
    // Automatically fetch updated user data after creating team
    dispatch(fetchMe());
    return result;
  },
);

interface UserState {
  id: number;
  email: string;
  name: string;
  teams?: Array<{ id: number; name: string }>;
  currentTeam?: { id: number; name: string } | null;
  status?: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  isAuthenticated?: boolean;
  profileColor?: string;
  currentTeamRole?: string; // Add currentTeamRole to the state
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
  profileColor: "#3b82f6", // Default profile color
  currentTeamRole: "", // Initialize currentTeamRole
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const {
        id,
        email,
        name,
        teams,
        currentTeam,
        profileColor,
        currentTeamRole,
      } = action.payload;
      state.id = id;
      state.email = email;
      state.name = name;
      state.teams = teams;
      state.currentTeam = currentTeam;
      state.isAuthenticated = true;
      state.profileColor = profileColor || state.profileColor;
      state.currentTeamRole = currentTeamRole || state.currentTeamRole; // Update currentTeamRole if provided
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.teams = action.payload.teams;
        state.currentTeam = action.payload.currentTeam;
        state.isAuthenticated = true;
        state.profileColor = action.payload.profileColor || state.profileColor;
        state.currentTeamRole = action.payload.currentTeamRole || "";
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
