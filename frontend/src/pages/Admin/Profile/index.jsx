import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLanguage } from "../../../hooks/useLanguage";
import { fetchAdminProfile } from "../../../services/adminProfileApi";

import TabNavigation from "./TabNavigation";
import OverviewTab from "./OverviewTab";
import ActivityLogTab from "./ActivityLogTab";
import EditAdminProfileModal from "./EditAdminProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function AdminProfile() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isEn = language === "en";

  const [activeTab, setActiveTab] = useState("overview");
  const [admin, setAdmin] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileRes = await fetchAdminProfile();
      if (profileRes.success) {
        setAdmin(profileRes.admin);
      }
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ quản trị viên:", err);
      setError("Không thể tải thông tin hồ sơ Admin. Vui lòng kiểm tra lại quyền truy cập hoặc đăng nhập lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdminUpdated = (updatedAdmin) => {
    setAdmin((prev) => ({ ...prev, ...updatedAdmin }));
  };

  const handleRelogin = () => {
    localStorage.removeItem("pacific_token");
    localStorage.removeItem("pacific_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("pacific_token");
    sessionStorage.removeItem("pacific_user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("pacific_auth_change"));
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 size={36} className="animate-spin text-blue-500" />
        <p className="text-sm font-semibold text-slate-400">
          {isEn ? "Loading Administrator Profile..." : "Đang tải hồ sơ Quản trị viên..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-bold text-white">
          {isEn ? "Login Session Expired or Invalid" : "Phiên đăng nhập đã hết hạn hoặc không hợp lệ"}
        </h3>
        <p className="text-xs text-rose-200/90 leading-relaxed">
          {isEn
            ? "Your admin authentication token has expired or is out of sync. Please click the button below to re-login."
            : "Mã xác thực Admin của bạn đã hết hạn hoặc chưa được đồng bộ sau khi cập nhật bảo mật. Vui lòng nhấn nút đăng nhập lại để làm mới phiên làm việc."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRelogin}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            {isEn ? "Log In Again" : "Đăng nhập lại ngay"}
          </button>
          <button
            onClick={loadData}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
          >
            {isEn ? "Retry" : "Thử lại"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* 1. 2-Tab Navigation (Thông tin hồ sơ & Nhật ký thao tác) */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
      />

      {/* 2. Tab Contents */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            admin={admin}
            onAdminUpdated={handleAdminUpdated}
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            isDark={isDark}
          />
        )}

        {activeTab === "activity" && (
          <ActivityLogTab isDark={isDark} />
        )}
      </div>

      {/* 3. Edit Admin Profile Modal */}
      <EditAdminProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        admin={admin}
        onAdminUpdated={handleAdminUpdated}
        isDark={isDark}
      />

      {/* 4. Change Password Security Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
