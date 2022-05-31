import { FC, useState, useEffect, SyntheticEvent } from "react";
import { AuthProps, Input, User } from "Interfaces";
import { isValidPassword } from "Validators";
import { useAxios } from "utils";
import { useToast } from "utils/useToast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "reducers/userSlice";

const Login: FC<AuthProps> = ({ toggleLogin, setLoading }) => {
  const initialState = { usernameOrEmail: "", password: "" };
  const [loginForm, setLoginForm] = useState(initialState);
  const { usernameOrEmail, password } = loginForm;
  const { operation, loading } = useAxios();
  const { sendToast } = useToast();
  const dispatch = useDispatch();

  const handleUsernameOrEmail = (e: Input) => {
    setLoginForm((s) => ({
      ...s,
      usernameOrEmail: e.target.value.toLowerCase(),
    }));
  };

  const handlePassword = (e: Input) => {
    setLoginForm((s) => ({ ...s, password: e.target.value }));
  };

  const handleLogin = async (e?: SyntheticEvent) => {
    e?.preventDefault();

    if (isValidPassword(password)) {
      const response = await operation({
        method: "post",
        url: "/login",
        data: {
          usernameOrEmail: usernameOrEmail,
          password: password,
        },
      });
      const user = response.user as unknown as User;
      const token = response.token as unknown as string;

      if (user && token) {
        localStorage.setItem("stargram-user-token", token);
        setLoginForm(initialState);
        sendToast(response.message);

        dispatch(setUser(user));
        dispatch(setToken(token));
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
    <form onSubmit={handleLogin}>
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
      <button type="submit" className="stg_btn" onClick={handleLogin}>
        Login
      </button>
      <button
        type="submit"
        className="stg_btn"
        onClick={() => {
          setLoginForm({
            usernameOrEmail: "guest@rohit.xyz",
            password: "guest@123",
          });
        }}
      >
        Use Guest Login
      </button>
      <p className="toggle_auth">
        Don't have an account?{" "}
        <button className="signup_btn" onClick={() => toggleLogin()}>
          Signup
        </button>
      </p>
    </form>
  );
};

export default Login;
