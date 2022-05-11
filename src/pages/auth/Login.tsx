import { FC, useState, useEffect } from "react";
import { AuthProps, Input, User } from "Interfaces";
import { isValidPassword } from "Validators";
import { useAxios } from "utils";
import { useToast } from "utils/useToast";
import { useDispatch } from "react-redux";
import { setUser } from "reducers/userSlice";

const Login: FC<AuthProps> = ({ toggleLogin, setLoading }) => {
  const initialState = { usernameOrEmail: "", password: "" };
  const [loginForm, setLoginForm] = useState(initialState);
  const { usernameOrEmail, password } = loginForm;
  const { operation, loading } = useAxios();
  const { sendToast } = useToast();
  const dispatch = useDispatch();

  const handleUsernameOrEmail = (e: Input) => {
    setLoginForm((s) => ({ ...s, usernameOrEmail: e.target.value }));
  };

  const handlePassword = (e: Input) => {
    setLoginForm((s) => ({ ...s, password: e.target.value }));
  };

  const handleLogin = async () => {
    if (isValidPassword(password)) {
      const response = await operation({
        method: "post",
        url: "/login",
        data: { usernameOrEmail, password },
      });
      const user = response.user as unknown as User;
      if (user && response.token) {
        localStorage.setItem("stargram-user-token", response.token);
        setLoginForm(initialState);
        sendToast(response.message);
        dispatch(setUser(user));
      }
    } else {
      sendToast("invalid username or password", true);
    }
  };

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
