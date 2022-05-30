import { Post, User } from "Interfaces";
import { FC, useEffect, useRef, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { timelinePosts } from "reducers/postsSlice";
import { setUser } from "reducers/userSlice";
import { RootState } from "store";
import { useAxios, useOnClickOutside } from "utils";
import "./profile.css";
import Lottie from "react-lottie";
import animationData from "lotties/search-users.json";
import { ToggleFollow } from "./ToggleFollow";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const OtherProfile: FC = () => {
  const [ffUsers, setFfUsers] = useState<User[]>([]);
  const [ffUsersModal, setFfUsersModal] = useState({
    state: false,
    usersType: "",
  });
  const { user } = useSelector((user: RootState) => user.user);
  const [otherUser, setOtherUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, operation } = useAxios();
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, () =>
    setFfUsersModal({
      state: false,
      usersType: "",
    })
  );

  useEffect(() => {
    (async () => {
      const response = await operation({
        method: "get",
        url: `/user/${username}`,
      });
      const foundUser = response?.user as unknown as User;
      const newPosts = response?.posts as unknown as Post[];
      if (foundUser && newPosts) {
        setOtherUser(foundUser);
        setPosts(newPosts);
        setFfUsersModal({
          state: false,
          usersType: "",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

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

  const showFollowingFollowers = async (following: boolean) => {
    const response = await operation({
      method: "post",
      url: "/users",
      data: {
        userList: following ? otherUser?.following : otherUser?.followers,
      },
    });
    const users = response?.users as User[];
    if (users.length > 0) {
      setFfUsers(users);
      setFfUsersModal({
        state: true,
        usersType: following ? "following" : "followers",
      });
    }
  };

  const websiteToShow = otherUser?.website.includes("http://")
    ? otherUser?.website.split("http://")[1]
    : otherUser?.website.includes("https://")
    ? otherUser?.website.split("https://")[1]
    : otherUser?.website;

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
                <p onClick={() => showFollowingFollowers(true)}>
                  <span>{otherUser.following.length}</span> following
                </p>
                <p onClick={() => showFollowingFollowers(false)}>
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
                    <a
                      href={`http://${websiteToShow}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {websiteToShow}
                    </a>
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
      {user && ffUsersModal.state && (
        <div className="user_follow_list_wrapper">
          <div className="user_follow_list_content" ref={modalRef}>
            <div className="user_follow_list_title">
              {ffUsersModal.usersType}
            </div>
            {ffUsers.map((otherUser) => (
              <ToggleFollow
                key={otherUser._id}
                user={user}
                otherUser={otherUser}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
