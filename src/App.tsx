import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { Nav, PrivateRoute, RestrictedRoute } from "./components";
import { Auth, Home, Page404, Profile } from "./pages";

const App: FC = () => {
  return (
    <>
      <Nav />

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
    </>
  );
};

export default App;
