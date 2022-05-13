import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, UserSliceState } from "Interfaces";

const initialState: UserSliceState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      localStorage.removeItem("stargram-user-token");
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
