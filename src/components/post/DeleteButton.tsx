import {
  AntDesignLoading3QuartersOutlined,
  MdiTrashCanOutline,
} from "assets/Icons";
import { Post, User } from "Interfaces";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { updatePost, updateUserPost } from "reducers/postsSlice";
import { useAxios } from "utils";

interface DeleteBtnProps {
  user: User;
  post: Post;
  commentId: string;
}

const DeleteButton: FC<DeleteBtnProps> = ({ user, post, commentId }) => {
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();

  const handleDeleteComment = async (commentId: string) => {
    const response = await operation({
      method: "delete",
      url: `/comment/${commentId}`,
    });
    const updatedPost = response as unknown as Post;

    if (post.owner._id !== user._id) {
      dispatch(updatePost(updatedPost));
    } else {
      dispatch(updateUserPost(updatedPost));
    }
  };

  return loading ? (
    <button className="delete_btn">
      <AntDesignLoading3QuartersOutlined
        className="spinning_loader"
        style={{ width: "2rem", height: "2rem" }}
      />
    </button>
  ) : (
    <button
      className="delete_btn"
      onClick={() => handleDeleteComment(commentId)}
    >
      <MdiTrashCanOutline />
    </button>
  );
};

export { DeleteButton };
