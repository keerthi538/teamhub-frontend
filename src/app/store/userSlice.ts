import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface UserState {
  id: number;
  email: string;
  name: string;
  teams?: Array<{ id: number; name: string }>;
  currentTeam?: { id: number; name: string } | null;
}

// Define the initial state using that type
const initialState: UserState = {
  id: 0,
  email: "",
  name: "",
  teams: [],
  currentTeam: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.teams = action.payload.teams;
      state.currentTeam = action.payload.currentTeam;
    },
    clearCurrentUser: (state) => {
      state.id = 0;
      state.email = "";
      state.name = "";
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
