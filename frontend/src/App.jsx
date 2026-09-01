import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import SpeciesDetail from "./pages/SpeciesDetail";
import SpeciesView3D from "./pages/SpeciesView3D";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./pages/Profile";

// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import SpeciesManagement from "./pages/Admin/Species";
import SpeciesGroupsManagement from "./pages/Admin/SpeciesGroups";
import LocationsManagement from "./pages/Admin/Locations";
import UsersManagement from "./pages/Admin/Users";
import CommentsManagement from "./pages/Admin/Comments";
import SystemSettings from "./pages/Admin/Settings";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="/species/:id/3d" element={<SpeciesView3D />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/me" element={<Navigate to="/profile" replace />} />

        {/* Admin Portal Nested Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
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
          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


