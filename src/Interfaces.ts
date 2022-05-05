import { ChangeEvent } from "react";
import { AxiosResponse } from "axios";

export interface AuthProps {
  toggleLogin: () => void;
  setLoading: (loading: boolean) => void;
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
  username: string;
  password?: string;
  name: string;
  email: string;
  photo: string;
  following: [string];
  followers: [string];
}

export interface Post {
  title: string;
  caption: string;
  photo: string;
  owner: { _id: string };
  likes: [string];
  comments: [
    {
      _id?: string;
      comment: string;
      owner: { _id: string };
    }
  ];
}

export interface Like {
  postId: string;
  userId: string;
}
