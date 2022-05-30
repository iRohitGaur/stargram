import { PostCard } from "components";
import { Post } from "Interfaces";
import { FC, useEffect, useRef, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { RootState } from "store";
import "./home.css";
import { timelinePosts } from "reducers/postsSlice";
import { sortByOlderFirst, sortByRecent, sortByTrending } from "./sort";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "lotties/no-posts.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

enum SortBy {
  recent,
  trending,
  olderFirst,
}

export const Home: FC = () => {
  const [sortState, setSortState] = useState(SortBy.recent);
  const [page, setPage] = useState(1);
  const timeline = useSelector((state: RootState) => state.posts.timelinePosts);
  const allPosts = sortPosts(sortState, timeline);
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const loadPosts = useRef(null);

  const getTimelinePosts = async () => {
    if (user) {
      const timelineResponse = await operation({
        method: "get",
        url: `/timeline/${page}/${sortState}`,
      });
      const posts = timelineResponse.posts as unknown as Post[];
      dispatch(timelinePosts(posts));
    }
  };

  useEffect(() => {
    getTimelinePosts();
    
    const element = loadPosts.current;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((page) => page + 1);
      }
    };
    const observer = new IntersectionObserver(handleObserver);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTimelinePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sortState]);

  return (
    <div className="homepage_wrapper">
      {allPosts.length === 0 ? (
        <div className="no_posts">
          <p>No posts on your timeline.</p>
          <p>
            Checkout the <Link to="/explore">explore</Link> page and follow some
            people!
          </p>
          <Lottie options={defaultOptions} />
        </div>
      ) : (
        <div className="homepage_posts_wrapper">
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
          <div className="timeline_posts_wrapper">
            {allPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
      <div ref={loadPosts}></div>
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

function sortPosts(sort: SortBy, timeline: Post[]) {
  switch (sort) {
    case SortBy.recent:
      return sortByRecent(timeline);
    case SortBy.trending:
      return sortByTrending(timeline);
    case SortBy.olderFirst:
      return sortByOlderFirst(timeline);
    default:
      throw new Error(`Non-existent size in switch: ${sort}`);
  }
}
