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
 * Route dành riêng cho khách chưa đăng nhập (Auth: Login, Register, Forgot Password).
 * Nếu đã đăng nhập:
 * - Admin/Super Admin -> chuyển hướng vào /admin/species
 * - Người dùng thông thường -> chuyển về trang chủ /
 */
export function GuestRoute({ children }) {
  const user = getStoredUser();

  if (user && user.token) {
    if (user.role === "admin" || user.role === "super_admin") {
      return <Navigate to="/admin/species" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route cho Giao diện Khách & Người dùng (Client Pages: Trang chủ, Khám phá, Chi tiết sinh vật...)
 * Cho phép cả khách vãng lai, người dùng lẫn Admin xem công khai một cách liền mạch, không bị chặn.
 */
export function ClientRoute({ children }) {
  return children;
}

/**
 * Route yêu cầu đăng nhập với tư cách Người dùng thông thường (VD: /profile)
 * Nếu chưa đăng nhập -> /login. Nếu là Admin -> chuyển vào /admin/profile.
 */
export function UserProtectedRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === "admin" || user.role === "super_admin") {
    return <Navigate to="/admin/profile" replace />;
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
