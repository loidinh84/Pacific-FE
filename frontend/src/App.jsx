import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import SpeciesDetail from "./pages/SpeciesDetail";
import OceanDepth from "./pages/OceanDepth";
import SpeciesView3D from "./pages/SpeciesView3D";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import { AdminRoute, ClientRoute, GuestRoute, UserProtectedRoute } from "./components/ProtectedRoute";
import ProfileLayout from "./pages/Profile";

// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import SpeciesManagement from "./pages/Admin/Species";
import SpeciesGroupsManagement from "./pages/Admin/SpeciesGroups";
import LocationsManagement from "./pages/Admin/Locations";
import UsersManagement from "./pages/Admin/Users";
import CommentsManagement from "./pages/Admin/Comments";
import FeedbackManagement from "./pages/Admin/Feedback";
import SystemSettings from "./pages/Admin/Settings";
import AdminProfile from "./pages/Admin/Profile";
import RelationshipsManagement from "./pages/Admin/Relationships";

// Error Pages & Error Boundary
import {
  ErrorBoundary,
  NotFound,
  Forbidden,
  Unauthorized,
  ServerError,
  Maintenance,
  Offline,
  GenericErrorPage,
} from "./pages/Error";

import "./App.css";

// Tự động cuộn mượt về đầu trang mỗi khi chuyển trang
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
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
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
