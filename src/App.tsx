import { FC } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Nav, PrivateRoute, RestrictedRoute } from "./components";
import { Auth, Home, Page404, Profile } from "./pages";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  const { pathname } = useLocation();
  return (
    <>
      {pathname !== "/auth" && <Nav />}

      <Routes>
        <Route path="/" element={<Home />}></Route>

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RestrictedRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
