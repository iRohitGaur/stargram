import { FC, useState } from "react";
import {
  HeroiconsOutlineLightningBolt,
  HeroiconsSolidLightningBolt,
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  RiUser6Line,
  FluentHome16Regular,
  FluentHome16Filled,
  IcBaselineLogout,
} from "assets/Icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./nav.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { logout } from "reducers/userSlice";

export const Nav: FC = () => {
  const [toggleProfile, setToggleProfile] = useState(false);
  const { pathname } = useLocation();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileToggle = () => {
    setToggleProfile((p) => !p);
  };

  const handleProfile = () => {
    handleProfileToggle();
    user && navigate(`/${user.username}`);
  };

  const handleLogout = () => {
    handleProfileToggle();
    dispatch(logout());
  };

  return (
    <div className="nav_content">
      <div className="nav_wrapper">
        <div className="logo">Stargram</div>
        <div className="cta">
          {user && (
            <>
              <NavLink to={"/"}>
                {pathname === "/" ? (
                  <FluentHome16Filled />
                ) : (
                  <FluentHome16Regular />
                )}
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
              {/* <NavLink to={"/profile"}>
                {pathname === "/profile" ? <RiUser6Fill /> : <RiUser6Line />}
              </NavLink> */}
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
