import { Input, Post, PostProps, User } from "Interfaces";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import "components/post/post.css";
import { useAxios, useToast } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPost } from "reducers/postsSlice";
import { Grid as Loader } from "react-loader-spinner";
import { RootState } from "store";
import TextareaAutosize from "react-textarea-autosize";
import { PostHeader } from "components/post/PostHeader";
import { PostCta } from "components/post/PostCta";
import { PostCaption } from "components/post/PostCaption";
import { PostComments } from "components/post/PostComments";

export const IndividualPostCard: FC<PostProps> = ({ post }) => {
  const [singlePost, setSinglePost] = useState<Post>(post);
  const [editDeleteOptions, setEditDeleteOptions] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState(singlePost.caption);
  const [captionState, setCaptionState] = useState(false);
  const [comment, setComment] = useState("");
  const [commentState, setCommentState] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as User);

  const { loading, operation } = useAxios();
  const { sendToast } = useToast();
  const navigate = useNavigate();

  const handleCommentInput = (e: Input) => {
    setComment(e.target.value);
  };

  const handleCommentPost = async () => {
    const response = await operation({
      method: "put",
      url: "/comment",
      data: { postId: singlePost._id, comment: comment.trim() },
    });
    const updatedPost = response as unknown as Post;
    if (updatedPost) {
      setSinglePost(updatedPost);
      setComment("");
    }
  };

  const OpenEditModal = () => {
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleDeletePost = async () => {
    if (singlePost._id) {
      const response = await operation({
        method: "delete",
        url: `/delete/${singlePost._id}`,
      });
      sendToast(response.message);
      navigate(`/${user.username}`);
    }
  };

  const handUpdateCaption = async () => {
    const response = await operation({
      method: "put",
      url: `/post/edit`,
      data: { postId: singlePost._id, caption: modalData },
    });
    const updatedPost = response as unknown as Post;
    if (updatedPost) {
      setSinglePost(updatedPost);
    }
    dispatch(updateUserPost(updatedPost));
    setEditModal(false);
  };

  return (
    <div className="posts_wrapper">
      <div key={singlePost._id} className="post_wrapper">
        <PostHeader
          user={user}
          post={post}
          editDeleteOptions={editDeleteOptions}
          setEditDeleteOptions={setEditDeleteOptions}
          OpenEditModal={OpenEditModal}
          handleDeletePost={handleDeletePost}
        />
        <div className="post_image">
          <img
            src={singlePost.photo}
            alt={singlePost.caption}
            className="post_img"
          />
        </div>
        <PostCta user={user} post={post} />
        <div className="likes_comments_wrapper">
          <p className="post_likes">{`${singlePost.likes.length} ${
            singlePost.likes.length === 1 ? "like" : "likes"
          }`}</p>
          <PostCaption
            post={post}
            captionState={captionState}
            setCaptionState={setCaptionState}
          />
          <div className="post_time">
            {new Date(singlePost.timestamp).toLocaleString()}
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
