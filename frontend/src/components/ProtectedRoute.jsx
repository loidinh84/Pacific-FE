import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

// Tuyến đường dành cho quản trị viên
export function AdminRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to="/403" replace />;
  }

  return children;
}

// Tuyến đường dành cho khách chưa đăng nhập
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

// Tuyến đường công khai
export function ClientRoute({ children }) {
  return children;
}

// Tuyến đường yêu cầu đăng nhập
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

export default function ProtectedRoute({ requireAdmin = false, children }) {
  if (requireAdmin) {
    return <AdminRoute>{children}</AdminRoute>;
  }
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
