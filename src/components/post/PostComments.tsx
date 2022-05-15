import { PostCommentsProps } from "Interfaces";
import { FC } from "react";
import { Link } from "react-router-dom";

export const PostComments: FC<PostCommentsProps> = ({
  post,
  commentState,
  setCommentState,
}) => {
  return (
    <div className="post_comments">
      {commentState ? (
        post.comments.map((c) => (
          <div key={c._id} className="comment_wrapper">
            <img src={c.owner.photo} alt={c.owner.username} />
            <Link to={`/${c.owner.username}`}>{c.owner.username}</Link>
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
};
