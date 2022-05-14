import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Post } from "Interfaces";

interface PostState {
  userPosts: Post[];
  timelinePosts: Post[];
  loading: boolean;
}

const initialState: PostState = {
  userPosts: [],
  timelinePosts: [],
  loading: false,
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
    updateUserPost(state, action: PayloadAction<Post>) {
      state.userPosts = state.userPosts.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
    deletePost(state, action: PayloadAction<string>) {
      state.userPosts = state.userPosts.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  userPosts,
  addNewPost,
  timelinePosts,
  updatePost,
  updateUserPost,
  deletePost,
} = postsSlice.actions;
export default postsSlice.reducer;
