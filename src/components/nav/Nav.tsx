import { FC } from "react";
import {
  ClarityBoltLine,
  ClarityBoltSolid,
  IcRoundBookmark,
  IcRoundBookmarkBorder,
  RiUser6Fill,
  RiUser6Line,
  FluentHome16Regular,
  FluentHome16Filled,
} from "assets/Icons";
import { NavLink, useLocation } from "react-router-dom";
import "./nav.css";

export const Nav: FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="nav_wrapper">
      <div className="logo">Stargram</div>
      <div className="cta">
        <NavLink to={"/"}>
          {pathname === "/" ? <FluentHome16Filled /> : <FluentHome16Regular />}
        </NavLink>
        <NavLink to={"/explore"}>
          {pathname === "/explore" ? <ClarityBoltSolid /> : <ClarityBoltLine />}
        </NavLink>
        <NavLink to={"/bookmarks"}>
          {pathname === "/bookmarks" ? (
            <IcRoundBookmark />
          ) : (
            <IcRoundBookmarkBorder />
          )}
        </NavLink>
        <NavLink to={"/profile"}>
          {pathname === "/profile" ? <RiUser6Fill /> : <RiUser6Line />}
        </NavLink>
      </div>
    </div>
  );
};
