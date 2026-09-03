import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

/**
 * Route chỉ dành riêng cho Quản trị viên (Admin & Super Admin)
 * Nếu chưa đăng nhập -> chuyển về /login
 * Nếu đã đăng nhập nhưng không phải admin -> chuyển về trang chủ /
 */
export function AdminRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route chỉ dành cho Giao diện Khách & Người dùng thông thường (Client)
 * Nếu Admin đã đăng nhập, tự động chuyển hướng họ vào /admin/species
 */
export function ClientRoute({ children }) {
  const user = getStoredUser();

  if (user && (user.role === "admin" || user.role === "super_admin")) {
    return <Navigate to="/admin/species" replace />;
  }

  return children;
}

/**
 * Route yêu cầu đăng nhập với tư cách Người dùng thông thường (VD: /profile)
 * Nếu chưa đăng nhập -> /login. Nếu là Admin -> /admin/species.
 */
export function UserProtectedRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === "admin" || user.role === "super_admin") {
    return <Navigate to="/admin/species" replace />;
  }

  return children;
}

// Default export for backward compatibility
export default function ProtectedRoute({ requireAdmin = false, children }) {
  if (requireAdmin) {
    return <AdminRoute>{children}</AdminRoute>;
  }
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
