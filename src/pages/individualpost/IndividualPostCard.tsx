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
import { NavLink, useNavigate } from "react-router-dom";
import "components/post/post.css";
import { useAxios, useToast } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPost } from "reducers/postsSlice";
import { Grid as Loader } from "react-loader-spinner";
import { RootState } from "store";
import { setUser } from "reducers/userSlice";
import TextareaAutosize from "react-textarea-autosize";

export const IndividualPostCard: FC<PostProps> = ({ post }) => {
  const [singlePost, setSinglePost] = useState<Post>(post);
  const [editDeleteOptions, setEditDeleteOptions] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState(singlePost.caption);
  const [captionState, setCaptionState] = useState(false);
  const [comment, setComment] = useState("");
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

  const handleLikePost = async () => {
    const response = await operation({
      method: "put",
      url: "/like",
      data: { postId: singlePost._id },
    });
    const updatedPost = response as unknown as Post;
    if (updatedPost) {
      setSinglePost(updatedPost);
    }
  };

  const handleBookmarkPost = async () => {
    const response = await operation({
      method: "put",
      url: "/bookmark",
      data: { postId: singlePost._id },
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
        <PostHeader />
        <div className="post_image">
          <img
            src={singlePost.photo}
            alt={singlePost.caption}
            className="post_img"
          />
        </div>
        <PostCta />
        <div className="likes_comments_wrapper">
          <p className="post_likes">{`${singlePost.likes.length} ${
            singlePost.likes.length === 1 ? "like" : "likes"
          }`}</p>
          <PostCaption />
          <div className="post_time">
            {new Date(singlePost.timestamp).toLocaleString()}
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
        <NavLink to={`/${singlePost.owner.username}`}>
          <img
            className="post_owner_photo"
            src={singlePost.owner.photo}
            alt={singlePost.owner.username}
          />
          <div className="post_owner_username">{singlePost.owner.username}</div>
        </NavLink>
        {singlePost.owner._id === user._id && (
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
            {singlePost.likes.includes(user._id ?? "") ? (
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
            {user.bookmarks.includes(singlePost._id ?? "") ? (
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
            <NavLink to={`/${singlePost.owner.username}`}>
              {singlePost.owner.username}
            </NavLink>
          }{" "}
          {captionState
            ? singlePost.caption
            : singlePost.caption.substring(
                0,
                160 - singlePost.owner.username.length
              )}
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
        {singlePost.comments.map((c) => (
          <div key={c._id} className="comment_wrapper">
            <img src={c.owner.photo} alt={c.owner.username} />
            <NavLink to={`/${c.owner.username}`}>{c.owner.username}</NavLink>
            <p>{c.comment}</p>
          </div>
        ))}
      </div>
    );
  }
};
