import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
