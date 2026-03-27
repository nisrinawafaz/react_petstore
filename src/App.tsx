import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./features/auth/LoginPage";
import PetListPage from "./features/pet/PetListPage";
import OrderListPage from "./features/store/OrderListPage";
import UserListPage from "./features/user/UserListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/pets" replace />} />
            <Route path="/pets" element={<PetListPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/users" element={<UserListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
