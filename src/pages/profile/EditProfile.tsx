import { User } from "Interfaces";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "reducers/userSlice";
import { RootState } from "store";
import { useAxios } from "utils";
import { Grid as Loader } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const EditProfile: FC = () => {
  const { user } = useSelector((user: RootState) => user.user);
  const [userState, setUserState] = useState(user);
  const { operation, loading } = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileUpdate = async () => {
    if (userState) {
      const response = await operation({
        method: "put",
        url: "/user/update",
        data: {
          name: userState.name,
          bio: userState.bio,
          website: userState.website,
        },
      });
      if (response) {
        dispatch(setUser(response));
        navigate(`/${user?.username}`);
      }
    }
  };

  return (
    <div className="edit_profile_wrapper">
      {userState && (
        <>
          <div className="edit_profile_row">
            Name
            <input
              type="text"
              placeholder="name"
              value={userState.name}
              onChange={(e) =>
                setUserState((u) => ({ ...u, name: e.target.value } as User))
              }
            />
          </div>
          <div className="edit_profile_row">
            Bio
            <input
              type="text"
              placeholder="bio"
              value={userState.bio}
              onChange={(e) =>
                setUserState((u) => ({ ...u, bio: e.target.value } as User))
              }
            />
          </div>
          <div className="edit_profile_row">
            Website
            <input
              type="text"
              placeholder="website"
              value={userState.website}
              onChange={(e) =>
                setUserState((u) => ({ ...u, website: e.target.value } as User))
              }
            />
          </div>
          <button className="update_profile_btn" onClick={handleProfileUpdate}>
            Update Profile
          </button>
        </>
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

export default EditProfile;
