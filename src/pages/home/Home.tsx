import { PostCard } from "components";
import { Post } from "Interfaces";
import { FC, useEffect, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { RootState } from "store";
import "./home.css";
import { timelinePosts, userPosts } from "reducers/postsSlice";
import { sortByOlderFirst, sortByRecent, sortByTrending } from "./sort";

enum SortBy {
  recent,
  trending,
  olderFirst,
}

export const Home: FC = () => {
  const [sortState, setSortState] = useState(SortBy.recent);
  const timeline = useSelector((state: RootState) => state.posts.timelinePosts);
  const myPosts = useSelector((state: RootState) => state.posts.userPosts);
  const allPosts = sortPosts(sortState, timeline, myPosts);
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
      <div className="sort_posts">
        <label onClick={() => setSortState(SortBy.recent)}>
          Recent
          <input
            type="radio"
            name="sortBy"
            defaultChecked={sortState === SortBy.recent}
          />
        </label>
        <label onClick={() => setSortState(SortBy.trending)}>
          Trending
          <input
            type="radio"
            name="sortBy"
            defaultChecked={sortState === SortBy.trending}
          />
        </label>
        <label onClick={() => setSortState(SortBy.olderFirst)}>
          Older First
          <input
            type="radio"
            name="sortBy"
            defaultChecked={sortState === SortBy.olderFirst}
          />
        </label>
      </div>
      {allPosts.length === 0 ? (
        <div className="no_posts">
          No posts on your timeline. Follow some people!
        </div>
      ) : (
        <div className="homepage_posts_wrapper">
          {allPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
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

function sortPosts(sort: SortBy, timeline: Post[], myPosts: Post[]) {
  switch (sort) {
    case SortBy.recent:
      return sortByRecent(timeline, myPosts);
    case SortBy.trending:
      return sortByTrending(timeline, myPosts);
    case SortBy.olderFirst:
      return sortByOlderFirst(timeline, myPosts);
    default:
      throw new Error(`Non-existent size in switch: ${sort}`);
  }
}
