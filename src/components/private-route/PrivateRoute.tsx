import { FC } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { RootState } from "store";

export const PrivateRoute: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};
