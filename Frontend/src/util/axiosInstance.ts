import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Handle expired sessions or unauthenticated API requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url;

      // Let the login page handle invalid credentials itself
      if (!requestUrl?.includes("/api/auth/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
