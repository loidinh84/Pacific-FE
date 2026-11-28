import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import { AdminRoute, ClientRoute, GuestRoute, UserProtectedRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/Error/ErrorBoundary";

import "./App.css";

// Lazy-loaded routes for code-splitting
const SpeciesDetail = lazy(() => import("./pages/SpeciesDetail"));
const OceanDepth = lazy(() => import("./pages/OceanDepth"));
const SpeciesView3D = lazy(() => import("./pages/SpeciesView3D"));
const KnowledgeGraph = lazy(() => import("./pages/KnowledgeGraph"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const OceanMap = lazy(() => import("./pages/OceanMap"));
const ProfileLayout = lazy(() => import("./pages/Profile"));

// Lazy-loaded Admin Pages
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const SpeciesManagement = lazy(() => import("./pages/Admin/Species"));
const SpeciesGroupsManagement = lazy(() => import("./pages/Admin/SpeciesGroups"));
const LocationsManagement = lazy(() => import("./pages/Admin/Locations"));
const UsersManagement = lazy(() => import("./pages/Admin/Users"));
const CommentsManagement = lazy(() => import("./pages/Admin/Comments"));
const FeedbackManagement = lazy(() => import("./pages/Admin/Feedback"));
const SystemSettings = lazy(() => import("./pages/Admin/Settings"));
const AdminProfile = lazy(() => import("./pages/Admin/Profile"));
const RelationshipsManagement = lazy(() => import("./pages/Admin/Relationships"));
const NewsManagement = lazy(() => import("./pages/Admin/News"));

// Lazy-loaded Error Pages
const NotFound = lazy(() => import("./pages/Error").then((m) => ({ default: m.NotFound })));
const Forbidden = lazy(() => import("./pages/Error").then((m) => ({ default: m.Forbidden })));
const Unauthorized = lazy(() => import("./pages/Error").then((m) => ({ default: m.Unauthorized })));
const ServerError = lazy(() => import("./pages/Error").then((m) => ({ default: m.ServerError })));
const Maintenance = lazy(() => import("./pages/Error").then((m) => ({ default: m.Maintenance })));
const Offline = lazy(() => import("./pages/Error").then((m) => ({ default: m.Offline })));
const GenericErrorPage = lazy(() => import("./pages/Error").then((m) => ({ default: m.GenericErrorPage })));

// Minimal quiet loading fallback
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071322]">
      <div className="w-8 h-8 rounded-full border-2 border-slate-700/60 border-t-sky-400 animate-spin" />
    </div>
  );
}

// Tự động cuộn mượt về đầu trang mỗi khi chuyển trang
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

const ROUTE_TITLES = {
  "/": "",
  "/search": "Tra cứu sinh vật",
  "/map": "Bản đồ Biển Đông",
  "/ocean-depth": "Độ sâu đại dương",
  "/knowledge-graph": "Đồ thị tri thức",
  "/news": "Tin tức đại dương",
  "/login": "Đăng nhập",
  "/register": "Đăng ký",
  "/forgot-password": "Quên mật khẩu",
  "/reset-password": "Đặt lại mật khẩu",
  "/profile": "Hồ sơ cá nhân",
  "/admin/stats": "Thống kê hệ thống",
  "/admin/species": "Quản lý sinh vật",
  "/admin/groups": "Quản lý nhóm sinh vật",
  "/admin/relationships": "Quan hệ sinh thái",
  "/admin/locations": "Quản lý địa điểm",
  "/admin/news": "Quản lý tin tức",
  "/admin/users": "Quản lý người dùng",
  "/admin/comments": "Quản lý bình luận",
  "/admin/feedback": "Ý kiến đóng góp",
  "/admin/settings": "Thiết lập hệ thống",
  "/admin/profile": "Hồ sơ quản trị",
};

// Đồng bộ tiêu đề tab trình duyệt theo tuyến đường và tên website thời gian thực
function DocumentTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const updateTitle = () => {
      let siteName = "Biển Đông";
      try {
        const saved = localStorage.getItem("pacific_system_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.general?.websiteName) siteName = parsed.general.websiteName;
        }
      } catch {
        // Giữ tên website mặc định nếu dữ liệu trong localStorage không hợp lệ
      }

      if (pathname.startsWith("/news/") || pathname.startsWith("/species/")) {
        return;
      }

      const pageTitle =
        ROUTE_TITLES[pathname] ||
        (pathname.startsWith("/admin") ? "Quản trị hệ thống" : "");

      if (pageTitle) {
        document.title = `${pageTitle} | ${siteName}`;
      } else {
        document.title = siteName;
      }
    };

    updateTitle();
    window.addEventListener("pacific_settings_update", updateTitle);
    return () => window.removeEventListener("pacific_settings_update", updateTitle);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <DocumentTitleManager />
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Tuyến đường công khai */}
            <Route
              path="/"
              element={
                <ClientRoute>
                  <Landing />
                </ClientRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ClientRoute>
                  <Search />
                </ClientRoute>
              }
            />
            <Route
              path="/species/:id"
              element={
                <ClientRoute>
                  <SpeciesDetail />
                </ClientRoute>
              }
            />
            <Route
              path="/ocean-depth"
              element={
                <ClientRoute>
                  <OceanDepth />
                </ClientRoute>
              }
            />
            <Route
              path="/species/:id/3d"
              element={
                <ClientRoute>
                  <SpeciesView3D />
                </ClientRoute>
              }
            />
            <Route
              path="/knowledge-graph"
              element={
                <ClientRoute>
                  <KnowledgeGraph />
                </ClientRoute>
              }
            />
            <Route
              path="/news"
              element={
                <ClientRoute>
                  <News />
                </ClientRoute>
              }
            />
            <Route
              path="/news/:slug"
              element={
                <ClientRoute>
                  <NewsDetail />
                </ClientRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ClientRoute>
                  <OceanMap />
                </ClientRoute>
              }
            />
            <Route path="/ocean-map" element={<Navigate to="/map" replace />} />
            <Route path="/pages/news" element={<Navigate to="/news" replace />} />
            <Route path="/pages/News" element={<Navigate to="/news" replace />} />

            {/* Tuyến đường xác thực */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <GuestRoute>
                  <ResetPassword />
                </GuestRoute>
              }
            />

            {/* Tuyến đường hồ sơ người dùng */}
            <Route
              path="/profile"
              element={
                <UserProtectedRoute>
                  <ProfileLayout />
                </UserProtectedRoute>
              }
            />
            <Route path="/profile/me" element={<Navigate to="/profile" replace />} />

            {/* Tuyến đường quản trị */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/species" replace />} />
              <Route path="stats" element={<AdminDashboard />} />
              <Route path="species" element={<SpeciesManagement />} />
              <Route path="groups" element={<SpeciesGroupsManagement />} />
              <Route path="species-groups" element={<Navigate to="/admin/groups" replace />} />
              <Route path="relationships" element={<RelationshipsManagement />} />
              <Route path="locations" element={<LocationsManagement />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="comments" element={<CommentsManagement />} />
              <Route path="feedback" element={<FeedbackManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Tuyến đường thông báo lỗi */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/401" element={<Unauthorized />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/503" element={<Maintenance />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/error/:code" element={<GenericErrorPage />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
