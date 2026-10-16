import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/history"
          element={
            <>
              <Navbar />
              <History />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <NotFound />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
