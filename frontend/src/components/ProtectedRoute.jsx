import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute Component - Bảo vệ các Route yêu cầu Đăng nhập & Quyền Admin
 * @param {Object} props
 * @param {boolean} [props.requireAdmin=false] - Yêu cầu quyền admin / super_admin
 * @param {React.ReactNode} [props.children] - Component con
 */
export default function ProtectedRoute({ requireAdmin = false, children }) {
  const location = useLocation();

  const token =
    localStorage.getItem("pacific_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("pacific_token") ||
    sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("pacific_user") ||
    localStorage.getItem("user") ||
    sessionStorage.getItem("pacific_user") ||
    sessionStorage.getItem("user");

  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.warn("Lỗi parse thông tin user trong ProtectedRoute:", error);
      user = null;
    }
  }

  // 1. Chưa đăng nhập -> Chuyển hướng về /login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Yêu cầu quyền Admin nhưng role không hợp lệ -> Chuyển hướng về trang chủ
  if (requireAdmin) {
    const role = user?.role;
    if (role !== "admin" && role !== "super_admin") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
