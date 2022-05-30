import { AntDesignLoading3QuartersOutlined } from "assets/Icons";
import { Post, User } from "Interfaces";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { timelinePosts } from "reducers/postsSlice";
import { setUser } from "reducers/userSlice";
import { useAxios } from "utils";

interface ToggleFollowProps {
  user: User;
  otherUser: User;
}

export const ToggleFollow: FC<ToggleFollowProps> = ({ user, otherUser }) => {
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleFollow = async (userId: string) => {
    const response = await operation({
      method: "put",
      url: `/follow`,
      data: { followId: userId },
    });

    if (response) {
      dispatch(setUser(response.myUser));

      // RG: update timeline posts
      const timelineResponse = await operation({
        method: "get",
        url: "/timeline",
      });
      const posts = timelineResponse.posts as unknown as Post[];
      dispatch(timelinePosts(posts));
    }
  };

  return (
    <div className="user_follow_list">
      <div
        className="img_username"
        onClick={() => navigate(`/${otherUser.username}`)}
      >
        <img src={otherUser.photo} alt={otherUser.username} />
        {otherUser.username}
      </div>
      {otherUser._id !== user._id && (
        <>
          {loading ? (
            <button>
              <AntDesignLoading3QuartersOutlined
                className="spinning_loader"
                style={{ width: "2rem", height: "2rem" }}
              />
            </button>
          ) : (
            <button onClick={() => toggleFollow(otherUser._id ?? "")}>
              {user?.following.includes(otherUser._id ?? "")
                ? "Unfollow"
                : "Follow"}
            </button>
          )}
        </>
      )}
    </div>
  );
};
