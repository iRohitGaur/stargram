import { PostCommentsProps } from "Interfaces";
import { FC } from "react";
import { Link } from "react-router-dom";
import { DeleteButton } from "./DeleteButton";

export const PostComments: FC<PostCommentsProps> = ({
  user,
  post,
  commentState,
  setCommentState,
}) => {
  return (
    <div className="post_comments">
      {commentState ? (
        post.comments.map((c) => (
          <div key={c._id} className="comment_wrapper">
            <div className="comment_section">
              <img src={c.owner.photo} alt={c.owner.username} />
              <Link to={`/${c.owner.username}`}>{c.owner.username}</Link>
              <p>{c.comment}</p>
            </div>
            {/* post owner can delete all comments, comment owner can delete own comment */}
            {(user._id === post.owner._id || user._id === c.owner._id) && (
              <DeleteButton user={user} post={post} commentId={c._id ?? ""} />
            )}
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
