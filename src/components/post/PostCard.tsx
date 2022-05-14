import {
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  MdiCardsHeart,
  MdiCardsHeartOutline,
  MiOptionsVertical,
  TablerMessageCircle2,
} from "assets/Icons";
import { Input, Post, PostProps, User } from "Interfaces";
import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import "./post.css";
import { useAxios, useToast } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, updatePost, updateUserPost } from "reducers/postsSlice";
import { Grid as Loader } from "react-loader-spinner";
import { RootState } from "store";
import { setUser } from "reducers/userSlice";
import TextareaAutosize from "react-textarea-autosize";

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
    dispatch(updatePost(updatedPost));
    setComment("");
  };

  const handleLikePost = async () => {
    const response = await operation({
      method: "put",
      url: "/like",
      data: { postId: post._id },
    });
    const updatedPost = response as unknown as Post;
    dispatch(updatePost(updatedPost));
  };

  const handleBookmarkPost = async () => {
    const response = await operation({
      method: "put",
      url: "/bookmark",
      data: { postId: post._id },
    });

    const updatedUser = response as unknown as User;
    dispatch(setUser(updatedUser));
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
        <PostHeader />
        <div className="post_image">
          <img src={post.photo} alt={post.caption} className="post_img" />
        </div>
        <PostCta />
        <div className="likes_comments_wrapper">
          <p className="post_likes">{`${post.likes.length} ${
            post.likes.length === 1 ? "like" : "likes"
          }`}</p>
          <PostCaption />
          <div className="post_time">
            {new Date(post.timestamp).toLocaleString()}
          </div>
          <PostComments />
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

  function PostHeader() {
    return (
      <div className="post_header">
        <NavLink to={`/${post.owner.username}`}>
          <img
            className="post_owner_photo"
            src={post.owner.photo}
            alt={post.owner.username}
          />
          <div className="post_owner_username">{post.owner.username}</div>
        </NavLink>
        {post.owner._id === user._id && (
          <>
            <button
              className="post_options_btn"
              onClick={() => setEditDeleteOptions((o) => !o)}
            >
              <MiOptionsVertical />
            </button>
            {editDeleteOptions && (
              <div className="edit_delete_post">
                <button onClick={OpenEditModal}>Edit</button>
                <button onClick={handleDeletePost}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function PostCta() {
    return (
      <div className="post_cta">
        <div className="left_section">
          <button className="cta_btn like_btn" onClick={handleLikePost}>
            {post.likes.includes(user._id ?? "") ? (
              <MdiCardsHeart />
            ) : (
              <MdiCardsHeartOutline />
            )}
          </button>
          <button className="cta_btn comment_btn">
            <TablerMessageCircle2 />
          </button>
        </div>
        <div className="right_section">
          <button className="cta_btn bookmark_btn" onClick={handleBookmarkPost}>
            {user.bookmarks.includes(post._id ?? "") ? (
              <IcRoundBookmark />
            ) : (
              <IcRoundBookmarkBorder />
            )}
          </button>
        </div>
      </div>
    );
  }

  function PostCaption() {
    return (
      <div className="post_caption">
        <p className="caption_text">
          {
            <NavLink to={`/${post.owner.username}`}>
              {post.owner.username}
            </NavLink>
          }{" "}
          {captionState
            ? post.caption
            : post.caption.substring(0, 160 - post.owner.username.length)}
          {"... "}
          {
            <button
              className="see_more"
              onClick={() => setCaptionState((c) => !c)}
            >
              {captionState ? "see less" : "see more"}
            </button>
          }
        </p>
      </div>
    );
  }

  function PostComments() {
    return (
      <div className="post_comments">
        {commentState ? (
          post.comments.map((c) => (
            <div key={c._id} className="comment_wrapper">
              <img src={c.owner.photo} alt={c.owner.username} />
              <NavLink to={`/${c.owner.username}`}>{c.owner.username}</NavLink>
              <p>{c.comment}</p>
            </div>
          ))
        ) : post.comments.length > 0 ? (
          post.comments.length === 1 ? (
            <button
              className="view_all_comments"
              onClick={() => setCommentState((c) => !c)}
            >
              view 1 comment
            </button>
          ) : (
            <button
              className="view_all_comments"
              onClick={() => setCommentState((c) => !c)}
            >
              view all {post.comments.length} comments
            </button>
          )
        ) : (
          ""
        )}
      </div>
    );
  }
};
