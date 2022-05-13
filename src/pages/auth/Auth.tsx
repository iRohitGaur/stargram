import { FC, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./auth.css";
import { Grid as Loader } from "react-loader-spinner";

export const Auth: FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleLogin = () => {
    setShowLogin((l) => !l);
  };

  return (
    <div className="auth_page">
      <div className="auth_wrapper">
        <h1>Stargram</h1>
        {showLogin && (
          <Login toggleLogin={toggleLogin} setLoading={setLoading} />
        )}
        {!showLogin && (
          <Signup toggleLogin={toggleLogin} setLoading={setLoading} />
        )}
      </div>
      {loading && (
        <div className="stg_loader">
          <Loader height="150" width="150" color="#1a8d1a" ariaLabel="loading" />
        </div>
      )}
    </div>
  );
};
