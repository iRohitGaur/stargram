import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Post } from "Interfaces";

interface PostState {
  userPosts: Post[];
  timelinePosts: Post[];
}

const initialState: PostState = {
  userPosts: [],
  timelinePosts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    userPosts(state, action: PayloadAction<Post[]>) {
      state.userPosts = action.payload;
    },
    addNewPost(state, action: PayloadAction<Post>) {
      state.userPosts.push(action.payload);
    },
    timelinePosts(state, action: PayloadAction<Post[]>) {
      state.timelinePosts = action.payload;
    },
    updatePost(state, action: PayloadAction<Post>) {
      state.timelinePosts = state.timelinePosts.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
  },
});

export const { userPosts, addNewPost, timelinePosts, updatePost } =
  postsSlice.actions;
export default postsSlice.reducer;
