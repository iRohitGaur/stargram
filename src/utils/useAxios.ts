import { useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Response } from "Interfaces";
import { useToast } from "./useToast";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.headers.common.Authorization =
  localStorage.getItem("stargram-user-token") ?? "";

export const useAxios = () => {
  const [response, setResponse] = useState<Response>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(false);

  const { sendToast } = useToast();

  const operation = async (params: AxiosRequestConfig) => {
    try {
      setLoading(true);
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error: any) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.error
      ) {
        setError(error.response.data.error);
        sendToast(error.response.data.error, true);
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, operation };
};
