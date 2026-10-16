import api from "@/API";
import axiosInstance, { fetchCsrfToken } from "@/util/axiosInstance";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axiosInstance.get(api.AUTH.SESSION);
        await fetchCsrfToken();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-[#0a0e0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-500" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Checking authentication...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
