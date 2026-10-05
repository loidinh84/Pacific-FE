import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import SpeciesDetail from "./pages/SpeciesDetail";
import OceanDepth from "./pages/OceanDepth";
import SpeciesView3D from "./pages/SpeciesView3D";
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
import QuizManagement from "./pages/Admin/Quiz";
import SystemSettings from "./pages/Admin/Settings";
import AdminProfile from "./pages/Admin/Profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Client Routes (Open for all visitors, users, and admins) */}
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

        {/* Auth Routes (Redirect to / or /admin/species if already authenticated) */}
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

        {/* User Profile Routes (Protected for regular user, Admin redirected to /admin/species) */}
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <ProfileLayout />
            </UserProtectedRoute>
          }
        />
        <Route path="/profile/me" element={<Navigate to="/profile" replace />} />

        {/* Admin Portal Nested Routes (Strictly for Admin & Super Admin) */}
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
          <Route path="locations" element={<LocationsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="comments" element={<CommentsManagement />} />
          <Route path="quiz" element={<QuizManagement />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
