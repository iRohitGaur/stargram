import { FC, useState, useEffect } from "react";
import { AuthProps, Input } from "Interfaces";
import { isValidPassword } from "Validators";
import { useAxios } from "utils";
import { useToast } from "utils/useToast";

const Login: FC<AuthProps> = ({ toggleLogin, setLoading }) => {
  const initialState = { usernameOrEmail: "", password: "" };
  const [loginForm, setLoginForm] = useState(initialState);
  const { usernameOrEmail, password } = loginForm;
  const { response, operation, loading } = useAxios();
  const { sendToast } = useToast();

  const handleUsernameOrEmail = (e: Input) => {
    setLoginForm((s) => ({ ...s, usernameOrEmail: e.target.value }));
  };

  const handlePassword = (e: Input) => {
    setLoginForm((s) => ({ ...s, password: e.target.value }));
  };

  const handleLogin = () => {
    if (isValidPassword(password)) {
      operation({
        method: "post",
        url: "/login",
        data: { usernameOrEmail, password },
      });
    } else {
      sendToast("invalid username or password", true);
    }
  };

  useEffect(() => {
    if (response) {
      // TODO: set token in localStorage and user in Redux store
      setLoginForm(initialState);
      sendToast(response.message ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <input
        className="input_username"
        type="text"
        placeholder="username or email"
        value={usernameOrEmail}
        onChange={(e) => handleUsernameOrEmail(e)}
      />
      <input
        className="input_password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => handlePassword(e)}
      />
      <button className="stg_btn" onClick={handleLogin}>
        Login
      </button>
      <p className="toggle_auth">
        Don't have an account?{" "}
        <button className="signup_btn" onClick={() => toggleLogin()}>
          Signup
        </button>
      </p>
    </>
  );
};

export default Login;
