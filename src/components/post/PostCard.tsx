import { Input, Post, PostProps, User } from "Interfaces";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import { useAxios, useToast } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, updatePost, updateUserPost } from "reducers/postsSlice";
import { Grid as Loader } from "react-loader-spinner";
import { RootState } from "store";
import TextareaAutosize from "react-textarea-autosize";
import { PostHeader } from "./PostHeader";
import { PostCta } from "./PostCta";
import { PostCaption } from "./PostCaption";
import { PostComments } from "./PostComments";

export const PostCard: FC<PostProps> = ({ post }) => {
  const [editDeleteOptions, setEditDeleteOptions] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState(post.caption);
  const [captionState, setCaptionState] = useState(false);
  const [commentState, setCommentState] = useState(
    post.comments?.length === 1 ? true : false
  );
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as User);
  const { loading, operation } = useAxios();
  const { sendToast } = useToast();

  const handleCommentInput = (e: Input) => {
    setComment(e.target.value);
  };

  const handleCommentPost = async () => {
    const response = await operation({
      method: "put",
      url: "/comment",
      data: { postId: post._id, comment: comment.trim() },
    });
    const updatedPost = response as unknown as Post;
    if (post.owner._id !== user._id) {
      dispatch(updatePost(updatedPost));
    } else {
      dispatch(updateUserPost(updatedPost));
    }
    setComment("");
  };

  const OpenEditModal = () => {
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleDeletePost = async () => {
    if (post._id) {
      const response = await operation({
        method: "delete",
        url: `/delete/${post._id}`,
      });
      dispatch(deletePost(post._id));
      sendToast(response.message);
    }
  };

  const handUpdateCaption = async () => {
    const response = await operation({
      method: "put",
      url: `/post/edit`,
      data: { postId: post._id, caption: modalData },
    });
    const updatedPost = response as unknown as Post;
    dispatch(updateUserPost(updatedPost));
    setEditModal(false);
  };

  return (
    <div className="posts_wrapper">
      <div key={post._id} className="post_wrapper">
        <PostHeader
          user={user}
          post={post}
          editDeleteOptions={editDeleteOptions}
          setEditDeleteOptions={setEditDeleteOptions}
          OpenEditModal={OpenEditModal}
          handleDeletePost={handleDeletePost}
        />
        <Link to={`/post/${post._id}`}>
          <div className="post_image">
            <img src={post.photo} alt={post.caption} className="post_img" />
          </div>
        </Link>
        <PostCta user={user} post={post} />
        <div className="likes_comments_wrapper">
          <p className="post_likes">{`${post.likes.length} ${
            post.likes.length === 1 ? "like" : "likes"
          }`}</p>
          <PostCaption
            post={post}
            captionState={captionState}
            setCaptionState={setCaptionState}
          />
          <div className="post_time">
            {new Date(post.timestamp).toLocaleString()}
          </div>
          <PostComments
            user={user}
            post={post}
            commentState={commentState}
            setCommentState={setCommentState}
          />
          <div className="add_comment_wrapper">
            <input
              className="add_comment_input"
              value={comment}
              type="text"
              placeholder="Add a comment..."
              onChange={handleCommentInput}
            />
            <button
              className={`post_comment_btn ${
                comment.trim().length === 0 && "disabled_btn"
              }`}
              onClick={handleCommentPost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="stg_loader">
          <Loader
            height="150"
            width="150"
            color="#1a8d1a"
            ariaLabel="loading"
          />
        </div>
      )}
      {editModal && (
        <div className="stg_edit_post">
          <TextareaAutosize
            minRows={2}
            name="caption"
            maxRows={5}
            className="caption"
            value={modalData}
            onChange={(e) => setModalData(e.target.value)}
          />
          <div className="cancel_update">
            <button
              className="update_caption cancel_btn"
              onClick={closeEditModal}
            >
              Cancel
            </button>
            <button className="update_caption" onClick={handUpdateCaption}>
              Update Caption
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
