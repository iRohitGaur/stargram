import { Post, User } from "Interfaces";
import { FC, useEffect, useRef, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userPosts } from "reducers/postsSlice";
import { setUser } from "reducers/userSlice";
import { RootState } from "store";
import { useAxios, useOnClickOutside } from "utils";
import "./profile.css";
import { ToggleFollow } from "./ToggleFollow";

export const Profile: FC = () => {
  const [ffUsers, setFfUsers] = useState<User[]>([]);
  const [ffUsersModal, setFfUsersModal] = useState({
    state: false,
    usersType: "",
  });
  const { user } = useSelector((user: RootState) => user.user);
  const posts = useSelector((state: RootState) => state.posts.userPosts);
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, () =>
    setFfUsersModal({
      state: false,
      usersType: "",
    })
  );

  useEffect(() => {
    if (user && posts.length === 0) {
      (async () => {
        const response = await operation({
          method: "get",
          url: "/posts",
        });
        const newPosts = response.posts as Post[];
        dispatch(userPosts(newPosts));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const showFollowingFollowers = async (following: boolean) => {
    const response = await operation({
      method: "post",
      url: "/users",
      data: { userList: following ? user?.following : user?.followers },
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

  const handleEditProfile = () => {
    user && navigate(`/${user.username}/edit`);
  };

  const handleProfilePic = () => {
    fileInput.current?.click();
  };

  const websiteToShow = user?.website.includes("http://")
    ? user?.website.split("http://")[1]
    : user?.website.includes("https://")
    ? user?.website.split("https://")[1]
    : user?.website;

  const handleImageSelected = async () => {
    if (fileInput.current?.files) {
      const profilePic = fileInput.current.files[0];
      const data = new FormData();
      data.append("file", profilePic);
      data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET ?? ""
      );

      fetch(process.env.REACT_APP_CLOUDINARY_API_URL ?? "", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (data) => {
          const response = await operation({
            method: "put",
            url: "/user/photoupdate",
            data: { photo: data?.secure_url },
          });
          if (response) {
            dispatch(setUser(response));
            navigate(`/${user?.username}`);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  return (
    <div className="profile_wrapper">
      {user && (
        <>
          <div className="about_section">
            <div
              className="profile_photo my_profile"
              onClick={handleProfilePic}
            >
              <input
                type="file"
                className="file_input"
                accept="image/*"
                ref={fileInput}
                onChange={handleImageSelected}
              />
              <img src={user.photo} alt={user.username} />
            </div>
            <div className="profile_info">
              <div className="username">
                {user.username}
                <button onClick={handleEditProfile}>Edit Profile</button>
              </div>
              <div className="following_followers">
                <p onClick={() => showFollowingFollowers(true)}>
                  <span>{user.following.length}</span> following
                </p>
                <p onClick={() => showFollowingFollowers(false)}>
                  <span>{user.followers.length}</span> followers
                </p>
              </div>
              <div className="name_bio">
                <div className="profile_name">{user.name}</div>
                <div className="profile_bio">
                  {user.bio === "" ? "no bio" : user.bio}
                </div>
                <div className="profile_website">
                  {user.website === "" ? (
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
