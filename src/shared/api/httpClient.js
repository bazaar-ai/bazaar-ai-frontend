import axios from "axios";
import { getAccessToken, clearAccessToken } from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend wraps responses as SuccessResponse<T> = { data, message, ... }.
// Unwrap here so callers just deal with the payload.
httpClient.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({ ...error, message });
  }
);
