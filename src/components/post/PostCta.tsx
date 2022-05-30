import {
  AntDesignLoading3QuartersOutlined,
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  MdiCardsHeart,
  MdiCardsHeartOutline,
  TablerMessageCircle2,
} from "assets/Icons";
import { Post, PostCtaProps, User } from "Interfaces";
import { setUser } from "reducers/userSlice";
import { useDispatch } from "react-redux";
import { updatePost, updateUserPost } from "reducers/postsSlice";
import { FC } from "react";
import { useAxios } from "utils";

export const PostCta: FC<PostCtaProps> = ({ user, post }) => {
  const dispatch = useDispatch();
  const { loading: likeLoading, operation: likeOperation } = useAxios();
  const { loading: bookmarkLoading, operation: bookmarkOperation } = useAxios();

  const handleLikePost = async () => {
    const response = await likeOperation({
      method: "put",
      url: "/like",
      data: { postId: post._id },
    });
    const updatedPost = response as unknown as Post;
    if (post.owner._id !== user._id) {
      dispatch(updatePost(updatedPost));
    } else {
      dispatch(updateUserPost(updatedPost));
    }
  };

  const handleBookmarkPost = async () => {
    const response = await bookmarkOperation({
      method: "put",
      url: "/bookmark",
      data: { postId: post._id },
    });

    const updatedUser = response as unknown as User;
    dispatch(setUser(updatedUser));
  };

  return (
    <div className="post_cta">
      <div className="left_section">
        {likeLoading ? (
          <button className="cta_btn like_btn">
            <AntDesignLoading3QuartersOutlined
              className="spinning_loader"
              style={{ width: "2rem", height: "2rem" }}
            />
          </button>
        ) : (
          <button className="cta_btn like_btn" onClick={handleLikePost}>
            {post.likes.includes(user._id ?? "") ? (
              <MdiCardsHeart />
            ) : (
              <MdiCardsHeartOutline />
            )}
          </button>
        )}
        <button className="cta_btn comment_btn">
          <TablerMessageCircle2 />
        </button>
      </div>
      <div className="right_section">
        {bookmarkLoading ? (
          <button className="cta_btn bookmark_btn">
            <AntDesignLoading3QuartersOutlined
              className="spinning_loader"
              style={{ width: "2rem", height: "2rem" }}
            />
          </button>
        ) : (
          <button className="cta_btn bookmark_btn" onClick={handleBookmarkPost}>
            {user.bookmarks.includes(post._id ?? "") ? (
              <IcRoundBookmark />
            ) : (
              <IcRoundBookmarkBorder />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
