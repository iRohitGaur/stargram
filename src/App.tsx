import { FC, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Nav, PrivateRoute, RestrictedRoute } from "./components";
import {
  Auth,
  Bookmarks,
  Explore,
  Home,
  OtherProfile,
  Page404,
  Profile,
} from "./pages";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "utils";
import { setUser } from "reducers/userSlice";
import { Grid as Loader } from "react-loader-spinner";
import EditProfile from "pages/profile/EditProfile";

const App: FC = () => {
  const { pathname } = useLocation();
  const { operation, loading } = useAxios();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("stargram-user-token");
    if (!user && token) {
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
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path={`/${user?.username}`} element={<Profile />} />
          <Route path={`/${user?.username}/edit`} element={<EditProfile />} />
        </Route>

        <Route element={<RestrictedRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route path="/:username" element={<OtherProfile />} />
        <Route path="*" element={<Page404 />} />
      </Routes>

      <ToastContainer />

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
    </>
  );
};

export default App;
