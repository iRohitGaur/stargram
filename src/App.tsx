import { FC, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Nav, PrivateRoute, RestrictedRoute } from "./components";
import { Auth, Home, Page404, Profile } from "./pages";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { setUser } from "reducers/userSlice";
import { Grid } from "react-loader-spinner";

const App: FC = () => {
  const { pathname } = useLocation();
  const { operation, loading } = useAxios();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      (async () => {
        const response = await operation({
          method: "get",
          url: "/verify",
        });
        const user = response.user;
        if (user) {
          dispatch(setUser(user));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {pathname !== "/auth" && <Nav />}

      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RestrictedRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>

      <ToastContainer />

      {loading && (
        <div className="stg_loader">
          <Grid height="150" width="150" color="#1a8d1a" ariaLabel="loading" />
        </div>
      )}
    </>
  );
};

export default App;
