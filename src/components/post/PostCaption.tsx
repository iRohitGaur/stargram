import { PostCaptionProps } from "Interfaces";
import { FC } from "react";
import { Link } from "react-router-dom";

export const PostCaption: FC<PostCaptionProps> = ({
  post,
  captionState,
  setCaptionState,
}) => {
  return (
    <div className="post_caption">
      <p className="caption_text">
        {<Link to={`/${post.owner.username}`}>{post.owner.username}</Link>}{" "}
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
};
