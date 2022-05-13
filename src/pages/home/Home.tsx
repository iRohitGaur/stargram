import { PostCard } from "components";
import { Post } from "Interfaces";
import { FC, useEffect } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { RootState } from "store";
import "./home.css";
import { timelinePosts, userPosts } from "reducers/postsSlice";

export const Home: FC = () => {
  const timeline = useSelector((state: RootState) => state.posts.timelinePosts);
  const myPosts = useSelector((state: RootState) => state.posts.userPosts);
  const allPosts = sortPosts(timeline, myPosts);
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && allPosts.length === 0) {
      (async () => {
        const timelineResponse = await operation({
          method: "get",
          url: "/timeline",
        });
        const posts = timelineResponse.posts as unknown as Post[];
        const userPostsresponse = await operation({
          method: "get",
          url: "/posts",
        });
        const newPosts = userPostsresponse.posts as unknown as Post[];
        dispatch(userPosts(newPosts));
        dispatch(timelinePosts(posts));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="homepage_wrapper">
      {allPosts.length === 0 ? (
        <div className="no_posts">
          No posts on your timeline. Follow some people!
        </div>
      ) : (
        allPosts.map((post) => <PostCard key={post._id} post={post} />)
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

function sortPosts(timeline: Post[], myPosts: Post[]) {
  const allPosts = [...timeline, ...myPosts];

  return allPosts.sort((a, b) => b.timestamp - a.timestamp);
}
