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
    return <div>Checking authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
