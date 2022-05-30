import { FC, useRef, useState } from "react";
import {
  HeroiconsOutlineLightningBolt,
  HeroiconsSolidLightningBolt,
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  RiUser6Line,
  IcBaselineLogout,
  IcRoundAddBox,
  IcRoundAdd,
} from "assets/Icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./nav.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { logout } from "reducers/userSlice";
import { useOnClickOutside } from "utils";
import { resetPosts } from "reducers/postsSlice";

export const Nav: FC = () => {
  const [toggleProfile, setToggleProfile] = useState(false);
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  useOnClickOutside(profileRef, () => setToggleProfile(false));

  const handleProfileToggle = () => {
    setToggleProfile((p) => !p);
  };

  const handleProfile = () => {
    handleProfileToggle();
    user && navigate(`/${user.username}`);
  };

  const handleLogout = () => {
    handleProfileToggle();
    dispatch(resetPosts());
    dispatch(logout());
  };

  return (
    <div className="nav_content">
      <div className="nav_wrapper">
        <NavLink to={"/"}>
          <div className="logo">Stargram</div>
        </NavLink>
        <div className="cta" ref={profileRef}>
          {user && (
            <>
              <NavLink to={"/create"}>
                {pathname === "/create" ? <IcRoundAddBox /> : <IcRoundAdd />}
              </NavLink>
              <NavLink to={"/explore"}>
                {pathname === "/explore" ? (
                  <HeroiconsSolidLightningBolt />
                ) : (
                  <HeroiconsOutlineLightningBolt />
                )}
              </NavLink>
              <NavLink to={"/bookmarks"}>
                {pathname === "/bookmarks" ? (
                  <IcRoundBookmark />
                ) : (
                  <IcRoundBookmarkBorder />
                )}
              </NavLink>
              <button className="profile_btn" onClick={handleProfileToggle}>
                <img src={user.photo} alt={user.username} />
              </button>
              {toggleProfile && (
                <div className="profile_dropdown">
                  <div className="dd_row" onClick={handleProfile}>
                    Profile
                    <RiUser6Line />
                  </div>
                  <div className="dd_row" onClick={handleLogout}>
                    Logout
                    <IcBaselineLogout className="logout_btn" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
