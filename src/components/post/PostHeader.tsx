import { MiOptionsVertical } from "assets/Icons";
import { PostHeaderProps } from "Interfaces";
import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "utils";

export const PostHeader: FC<PostHeaderProps> = ({
  user,
  post,
  editDeleteOptions,
  setEditDeleteOptions,
  OpenEditModal,
  handleDeletePost,
}) => {
  const headerRef = useRef(null);
  useOnClickOutside(headerRef, () => setEditDeleteOptions(false));

  return (
    <div className="post_header">
      <Link to={`/${post.owner.username}`}>
        <img
          className="post_owner_photo"
          src={post.owner.photo}
          alt={post.owner.username}
        />
        <div className="post_owner_username">{post.owner.username}</div>
      </Link>
      {post.owner._id === user._id && (
        <div ref={headerRef}>
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
        </div>
      )}
    </div>
  );
};
