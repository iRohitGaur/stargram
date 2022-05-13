import { Post, User } from "Interfaces";
import { FC, useEffect, useState } from "react";
import { Grid as Loader } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import { useAxios } from "utils";
import "./profile.css";

export const OtherProfile: FC = () => {
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, operation } = useAxios();
  const { pathname } = useLocation();
  const path = pathname.substring(1, pathname.length);

  useEffect(() => {
    if (!user) {
      (async () => {
        const response = await operation({
          method: "get",
          url: `/user/${path}`,
        });
        const foundUser = response?.user as unknown as User;
        const newPosts = response?.posts as unknown as Post[];
        if (foundUser && newPosts) {
          setUser(foundUser);
          setPosts(newPosts);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="profile_wrapper">
      {user ? (
        <>
          <div className="about_section">
            <div className="profile_photo">
              <img src={user.photo} alt={user.username} />
            </div>
            <div className="profile_info">
              <div className="username">{user.username}</div>
              <div className="following_followers">
                <p>
                  <span>{user.following.length}</span> following
                </p>
                <p>
                  <span>{user.followers.length}</span> followers
                </p>
              </div>
              <div className="name_bio">
                <div className="profile_name">{user.name}</div>
                <div className="profile_bio">{user.bio === "" && "no bio"}</div>
                <div className="profile_website">
                  {user.website === "" && "no website"}
                </div>
              </div>
            </div>
          </div>
          <div className="user_posts">
            {posts.map((post) => (
              <div key={post._id} className="post_photo_wrapper">
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
        <div className="user_not_found">user not found</div>
      )}
    </div>
  );
};
