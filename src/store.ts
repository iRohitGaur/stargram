import { configureStore } from "@reduxjs/toolkit";
import { userReducer, postReducer } from "reducers";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = ReturnType<typeof store.dispatch>;
