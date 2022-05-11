import {
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  MdiCardsHeart,
  MdiCardsHeartOutline,
  TablerMessageCircle2,
} from "assets/Icons";
import { Input, Post, PostProps, User } from "Interfaces";
import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import "./post.css";
import { useAxios } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "reducers/postsSlice";
import { Grid } from "react-loader-spinner";
import { RootState } from "store";

export const PostCard: FC<PostProps> = ({ post }) => {
  const [captionState, setCaptionState] = useState(false);
  const [commentState, setCommentState] = useState(
    post.comments.length === 1 ? true : false
  );
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as User);

  const { loading, operation } = useAxios();

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

  return (
    <div className="posts_wrapper">
      <div key={post._id} className="post_wrapper">
        <PostHeader />
        <div className="post_image">
          <img src={post.photo} alt={post.caption} className="post_img" />
        </div>
        <PostCta />
        <div className="likes_comments_wrapper">
          <p className="post_likes">{post.likes.length} likes</p>
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
          <Grid height="150" width="150" color="#1a8d1a" ariaLabel="loading" />
        </div>
      )}
    </div>
  );

  function PostHeader() {
    return (
      <div className="post_header">
        <img
          className="post_owner_photo"
          src={post.owner.photo}
          alt={post.owner.username}
        />
        <div className="post_owner_username">{post.owner.username}</div>
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
          <button className="cta_btn bookmark_btn">
            <IcRoundBookmarkBorder />
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
