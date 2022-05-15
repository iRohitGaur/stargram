import { Post, User } from "Interfaces";
import { FC, useEffect, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { timelinePosts } from "reducers/postsSlice";
import { setUser } from "reducers/userSlice";
import { RootState } from "store";
import { useAxios } from "utils";
import "./profile.css";
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

export const OtherProfile: FC = () => {
  const { user } = useSelector((user: RootState) => user.user);
  const [otherUser, setOtherUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, operation } = useAxios();
  const { pathname } = useLocation();
  const path = pathname.substring(1, pathname.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!otherUser) {
      (async () => {
        const response = await operation({
          method: "get",
          url: `/user/${path}`,
        });
        const foundUser = response?.user as unknown as User;
        const newPosts = response?.posts as unknown as Post[];
        if (foundUser && newPosts) {
          setOtherUser(foundUser);
          setPosts(newPosts);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser]);

  const toggleFollow = async () => {
    if (otherUser) {
      const response = await operation({
        method: "put",
        url: `/follow`,
        data: { followId: otherUser._id },
      });

      if (response) {
        setOtherUser(response.otherUser);
        dispatch(setUser(response.myUser));

        // RG: update timeline posts
        const timelineResponse = await operation({
          method: "get",
          url: "/timeline",
        });
        const posts = timelineResponse.posts as unknown as Post[];
        dispatch(timelinePosts(posts));
      }
    }
  };

  return (
    <div className="profile_wrapper">
      {otherUser ? (
        <>
          <div className="about_section">
            <div className="profile_photo">
              <img src={otherUser.photo} alt={otherUser.username} />
            </div>
            <div className="profile_info">
              <div className="username">
                {otherUser.username}
                {user && otherUser.followers.includes(user._id ?? "") ? (
                  <button onClick={toggleFollow}>Unfollow</button>
                ) : (
                  <button onClick={toggleFollow}>Follow</button>
                )}
              </div>
              <div className="following_followers">
                <p>
                  <span>{otherUser.following.length}</span> following
                </p>
                <p>
                  <span>{otherUser.followers.length}</span> followers
                </p>
              </div>
              <div className="name_bio">
                <div className="profile_name">{otherUser.name}</div>
                <div className="profile_bio">
                  {otherUser.bio === "" ? "no bio" : otherUser.bio}
                </div>
                <div className="profile_website">
                  {otherUser.website === "" ? (
                    "no website"
                  ) : (
                    <a href={otherUser.website}>{otherUser.website}</a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="user_posts">
            {posts.map((post) => (
              <div
                key={post._id}
                className="post_photo_wrapper"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <img
                  src={post.photo}
                  alt={post.caption}
                  className="post_photo"
                />
              </div>
            ))}
          </div>
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
        </>
      ) : (
        <div className="user_not_found">
          <Lottie options={defaultOptions} />
        </div>
      )}
    </div>
  );
};
