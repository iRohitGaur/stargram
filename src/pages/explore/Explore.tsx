import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useAxios } from "utils";
import { Grid as Loader } from "react-loader-spinner";
import { updateExplorePosts } from "reducers/postsSlice";
import { PostCard } from "components";
import "./explore.css";
import Lottie from "react-lottie";
import animationData from "lotties/search-users.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const Explore: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const explore = useSelector((state: RootState) => state.posts.explorePosts);
  const { loading, operation } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const allPostsResponse = await operation({
          method: "get",
          url: "/allposts",
        });
        const posts = allPostsResponse.posts;
        dispatch(updateExplorePosts(posts));
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="explore_page_wrapper">
      {explore.length === 0 && (
        <div className="no_users">
          <Lottie options={defaultOptions} />
        </div>
      )}
      {explore.map((post) => (
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
