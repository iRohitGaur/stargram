import { FC, useState, useEffect } from "react";
import { AuthProps, Input } from "Interfaces";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidUsername,
} from "Validators";
import { useAxios } from "utils";
import { useToast } from "utils/useToast";

const Signup: FC<AuthProps> = ({ toggleLogin, setLoading }) => {
  const initialState = { name: "", username: "", email: "", password: "" };
  const [signupForm, setSignupForm] = useState(initialState);
  const { name, username, email, password } = signupForm;
  const { response, operation, loading } = useAxios();
  const { sendToast } = useToast();

  const handleName = (e: Input) => {
    setSignupForm((s) => ({ ...s, name: e.target.value }));
  };

  const handleUsername = (e: Input) => {
    setSignupForm((s) => ({ ...s, username: e.target.value }));
  };

  const handleEmail = (e: Input) => {
    setSignupForm((s) => ({ ...s, email: e.target.value }));
  };

  const handlePassword = (e: Input) => {
    setSignupForm((s) => ({ ...s, password: e.target.value }));
  };

  useEffect(() => {
    if (response) {
      toggleLogin();
      setSignupForm(initialState);
      sendToast(response.message ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleSignup = () => {
    if (
      isValidName(name) &&
      isValidUsername(username) &&
      isValidEmail(email) &&
      isValidPassword(password)
    ) {
      operation({
        method: "post",
        url: "/signup",
        data: { name, username, email, password },
      });
    } else {
      sendToast(
        "Name and Username should be more than 3 characters.\n\nPassword should be more than 5 characters",
        true
      );
    }
  };

  return (
    <>
      <input
        className="input_name"
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => handleName(e)}
      />
      <input
        className="input_username"
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => handleUsername(e)}
      />
      <input
        className="input_email"
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => handleEmail(e)}
      />
      <input
        className="input_password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => handlePassword(e)}
      />
      <button className="stg_btn" onClick={handleSignup}>
        Signup
      </button>
      <p className="toggle_auth">
        Already have an account?{" "}
        <button className="signup_btn" onClick={() => toggleLogin()}>
          Login
        </button>
      </p>
    </>
  );
};

export default Signup;
