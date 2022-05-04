import { FC } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export const RestrictedRoute: FC = () => {
  // const { user } = useAuth();
  const user = false;
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
