import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useToast } from "./useToast";
import { useSelector } from "react-redux";
import { RootState } from "store";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

export const useAxios = () => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("stargram-user-token") ?? ""
  );
  axios.defaults.headers.common.Authorization = authToken;
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state: RootState) => state.user);

  const { sendToast } = useToast();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const operation = async (params: AxiosRequestConfig) => {
    try {
      setLoading(true);
      const result = await axios.request(params);
      return result.data;
    } catch (error: any) {
      if (
        error instanceof AxiosError &&
        error?.response &&
        error?.response?.data?.error
      ) {
        setError(error.response.data.error);
        sendToast(error.response.data.error, true);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, operation };
};
