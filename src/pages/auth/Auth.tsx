import { FC, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./auth.css";
import { Grid as Loader } from "react-loader-spinner";
import Lottie from "react-lottie";
import animationData from "lotties/landing.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const Auth: FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleLogin = () => {
    setShowLogin((l) => !l);
  };

  return (
    <div className="auth_page">
      <div className="auth_lottie_wrapper">
        <Lottie width="100%" options={defaultOptions} />
      </div>
      <div className="auth_wrapper">
        <div>
          <h1>Stargram</h1>
          <h4>social network</h4>
        </div>
        {showLogin && (
          <Login toggleLogin={toggleLogin} setLoading={setLoading} />
        )}
        {!showLogin && (
          <Signup toggleLogin={toggleLogin} setLoading={setLoading} />
        )}
      </div>
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
    </div>
  );
};
