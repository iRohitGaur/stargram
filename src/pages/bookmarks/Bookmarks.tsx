import { PostCard } from "components";
import { FC, useEffect } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store";
import "./bookmarks.css";
import { useAxios } from "utils";
import { updateBookmarks } from "reducers/postsSlice";
import Lottie from "react-lottie";
import animationData from "lotties/not-found.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const Bookmarks: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { timelinePosts, userPosts } = useSelector(
    (state: RootState) => state.posts
  );
  const bookmarks = useSelector(
    (state: RootState) => state.posts.bookmarksPosts
  );
  const { loading, operation } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const bookmarkResponse = await operation({
          method: "get",
          url: "/bookmarkedposts",
        });
        const posts = bookmarkResponse.posts;
        dispatch(updateBookmarks(posts));
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userPosts, timelinePosts]);

  return (
    <div>
      {bookmarks.length === 0 && (
        <div className="no_bookmarks">
          <p>No bookmarks</p>
          <Lottie options={defaultOptions} />
        </div>
      )}
      {bookmarks.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
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
    </div>
  );
};
