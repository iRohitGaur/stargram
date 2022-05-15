import {
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  MdiCardsHeart,
  MdiCardsHeartOutline,
  TablerMessageCircle2,
} from "assets/Icons";
import { PostCtaProps } from "Interfaces";
import { FC } from "react";

export const PostCta: FC<PostCtaProps> = ({
  user,
  post,
  handleLikePost,
  handleBookmarkPost,
}) => {
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
};
