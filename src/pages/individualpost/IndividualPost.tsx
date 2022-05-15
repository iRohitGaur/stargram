import { FC, useEffect, useState } from "react";
import { useAxios } from "utils";
import { Post } from "Interfaces";
import { useParams } from "react-router-dom";
import { Grid as Loader } from "react-loader-spinner";
import Lottie from "react-lottie";
import animationData from "lotties/search-users.json";
import { IndividualPostCard } from "./IndividualPostCard";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
export const IndividualPost: FC = () => {
  const [post, setPost] = useState<Post | undefined>();
  const { loading, operation } = useAxios();
  const { postId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await operation({
          method: "get",
          url: `/post/${postId}`,
        });
        const IndividualPost = response.post;
        setPost(IndividualPost);
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="individual_post_page_wrapper">
      {post ? (
        <IndividualPostCard key={post._id} post={post} />
      ) : (
        <div className="no_users">
          <Lottie options={defaultOptions} />
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
