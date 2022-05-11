import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "Interfaces";

interface UserState {
  [key: string]: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
