import { FC } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export const PrivateRoute: FC = () => {
  // const { user } = useAuth();
  const user = false;
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};
