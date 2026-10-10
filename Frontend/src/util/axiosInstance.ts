import axios from "axios";
import api from "@/API";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.111:8080",
  withCredentials: true,
});

// Keep the CSRF token in memory
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

// Fetch once and reuse the token
export const fetchCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }

  // Prevent multiple simultaneous token requests
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

// Clear the cached token when authentication ends
export const clearCsrfToken = () => {
  csrfToken = null;
  csrfTokenPromise = null;
};

// Attach CSRF token to state-changing requests
axiosInstance.interceptors.request.use(async (config) => {
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

// Handle expired sessions or unauthenticated API requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";

      if (!requestUrl.includes("/api/auth/login")) {
        clearCsrfToken();
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
