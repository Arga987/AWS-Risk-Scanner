import axios from "axios";
import api from "@/API";
import { isCognitoMode, isSessionMode } from "@/config/authConfig";
import { fetchAuthSession } from "aws-amplify/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: isSessionMode,
});

// Keep the CSRF token in memory for local session authentication.
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

// Fetch once and reuse the token.
export const fetchCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }

  // Prevent multiple simultaneous token requests.
  if (!csrfTokenPromise) {
    csrfTokenPromise = axiosInstance
      .get<{ token: string }>(api.AUTH.CSRF)
      .then((response) => {
        csrfToken = response.data.token;
        return csrfToken;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
};

// Clear the cached token when session authentication ends.
export const clearCsrfToken = () => {
  csrfToken = null;
  csrfTokenPromise = null;
};

// Attach the appropriate authentication credentials to each request.
axiosInstance.interceptors.request.use(async (config) => {
  if (isCognitoMode) {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  }

  const method = config.method?.toLowerCase();
  const requestUrl = config.url ?? "";

  const isStateChangingRequest = ["post", "put", "patch", "delete"].includes(
    method ?? ""
  );

  const isLoginRequest = requestUrl.includes("/api/auth/login");

  if (isStateChangingRequest && !isLoginRequest) {
    const token = await fetchCsrfToken();
    config.headers.set("X-CSRF-TOKEN", token);
  }

  return config;
});

// Handle expired sessions or unauthenticated API requests.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      const isLoginRequest = requestUrl.includes("/api/auth/login");

      if (!isLoginRequest) {
        clearCsrfToken();
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
