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
    logout() {
      localStorage.removeItem("stargram-user-token");
      return { ...initialState };
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
