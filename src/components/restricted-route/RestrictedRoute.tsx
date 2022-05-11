import { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { RootState } from "store";

export const RestrictedRoute: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const location = useLocation();

  interface LocationState {
    from: Location;
  }

  const state = location.state as LocationState;

  let from = state?.from?.pathname || "/";

  return user ? (
    <Navigate to={from} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};
