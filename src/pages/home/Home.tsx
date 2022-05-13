import { PostCard } from "components";
import { Post } from "Interfaces";
import { FC, useEffect } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { RootState } from "store";
import "./home.css";
import { timelinePosts } from "reducers/postsSlice";

export const Home: FC = () => {
  const timeline = useSelector((state: RootState) => state.posts.timelinePosts);
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && timeline.length === 0) {
      (async () => {
        const response = await operation({
          method: "get",
          url: "/timeline",
        });
        const posts = response.posts as unknown as Post[];
        dispatch(timelinePosts(posts));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="homepage_wrapper">
      {timeline.length === 0 ? (
        <div className="no_posts">
          No posts on your timeline. Follow some people!
        </div>
      ) : (
        timeline.map((post) => <PostCard key={post._id} post={post} />)
      )}
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
