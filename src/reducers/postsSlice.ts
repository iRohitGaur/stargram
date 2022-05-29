import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Post } from "Interfaces";

interface PostState {
  userPosts: Post[];
  timelinePosts: Post[];
  bookmarksPosts: Post[];
  explorePosts: Post[];
}

const initialState: PostState = {
  userPosts: [],
  timelinePosts: [],
  bookmarksPosts: [],
  explorePosts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    userPosts(state, action: PayloadAction<Post[]>) {
      state.userPosts = action.payload;
    },
    addNewPost(state, action: PayloadAction<Post>) {
      state.userPosts.unshift(action.payload);
    },
    timelinePosts(state, action: PayloadAction<Post[]>) {
      state.timelinePosts = action.payload;
    },
    updatePost(state, action: PayloadAction<Post>) {
      // RG: check if the id exists in timeline posts
      const index = state.timelinePosts.findIndex(
        (p) => p._id === action.payload._id
      );
      // RG: if not then it belongs to explore posts
      if (index === -1) {
        state.explorePosts = state.explorePosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      } else {
        state.timelinePosts = state.timelinePosts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      }
    },
    updateUserPost(state, action: PayloadAction<Post>) {
      state.userPosts = state.userPosts.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
    deletePost(state, action: PayloadAction<string>) {
      state.userPosts = state.userPosts.filter((p) => p._id !== action.payload);
    },
    updateBookmarks(state, action: PayloadAction<Post[]>) {
      state.bookmarksPosts = action.payload;
    },
    updateExplorePosts(state, action: PayloadAction<Post[]>) {
      state.explorePosts = action.payload;
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
  updateBookmarks,
  updateExplorePosts,
} = postsSlice.actions;
export default postsSlice.reducer;
