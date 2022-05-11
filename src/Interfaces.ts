import { ChangeEvent } from "react";
import { AxiosResponse } from "axios";

export interface AuthProps {
  toggleLogin: () => void;
  setLoading: (loading: boolean) => void;
}

export interface PostProps {
  post: Post;
}

export interface Input extends ChangeEvent<HTMLInputElement> {}

export interface Response extends AxiosResponse {
  message?: string;
  token?: string;
  user?: User;
  post?: Post;
  posts?: [Post];
}

export interface User {
  _id?: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  photo: string;
  following: [string];
  followers: [string];
}

export interface Post {
  _id?: string;
  timestamp: number;
  title: string;
  caption: string;
  photo: string;
  owner: User;
  likes: [string];
  comments: [
    {
      _id?: string;
      comment: string;
      owner: User;
    }
  ];
}

export interface Like {
  postId: string;
  userId: string;
}

export interface UserSliceState {
  user: User | null;
  token: string | null;
}
