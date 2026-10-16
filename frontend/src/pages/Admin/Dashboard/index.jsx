/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Fish,
  Eye,
  Search,
  Heart,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  Trash2,
  RefreshCw,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { clearStoredAuth } from "../../../utils/auth";
import { fetchAdminFullDashboard } from "../../../services/adminStatsApi";

import StatCard from "./components/StatCard";
import LineChartView from "./components/LineChartView";
import BarChartNew from "./components/BarChartNew";
import TopSpeciesTable from "./components/TopSpeciesTable";
import ZoneDistribution from "./components/ZoneDistribution";
import TopUsersTable from "./components/TopUsersTable";
import RecentActivity from "./components/RecentActivity";
import CustomSelect from "./components/CustomSelect";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    users: {},
    contentAndView: {},
    comments: {},
    recentActivities: [],
    charts: { viewsByDay: [], usersByDay: [] },
    rankings: { topSpecies: [], speciesByZone: [], topUsers: [] },
  });

  const loadData = useCallback(
    async (selectedDays, isManualRefresh = false) => {
      try {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);
        setAuthError(false);

        const res = await fetchAdminFullDashboard(selectedDays);
        if (res?.success && res?.data) {
          setDashboardData(res.data);
          if (isManualRefresh) {
            showToast("Đã cập nhật dữ liệu thống kê mới nhất!", "success");
          }
        }
      } catch (err) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setAuthError(true);
        } else {
          showToast("Không thể tải dữ liệu thống kê.", "error");
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadData(days);
  }, [days, loadData]);

  const {
    users,
    contentAndView,
    comments,
    charts,
    rankings,
    recentActivities,
  } = dashboardData;

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold font-heading tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Tổng quan hệ thống
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <CustomSelect
            options={[
              { value: "7", label: "7 ngày qua" },
              { value: "14", label: "14 ngày qua" },
              { value: "30", label: "30 ngày qua" },
            ]}
            value={String(days)}
            onChange={(val) => setDays(Number(val))}
            isDark={isDark}
            size="sm"
            className="w-36"
          />

          <button
            onClick={() => loadData(days, true)}
            disabled={isRefreshing || isLoading}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 ${
              isDark
                ? "bg-[#162040] hover:bg-[#1e2c56] border-white/10 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
            title="Làm mới toàn bộ số liệu"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin text-cyan-400" : ""}
            />
            <span>{isRefreshing ? "Đang tải..." : "Làm mới"}</span>
          </button>
        </div>
      </div>

      {/* ── AUTH ERROR BANNER ── */}
      {authError && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark
              ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-400 shrink-0" size={20} />
            <p className="text-xs sm:text-sm font-medium">
              Phiên đăng nhập hết hạn hoặc bạn không có quyền xem trang này. Vui
              lòng đăng nhập lại.
            </p>
          </div>
          <button
            onClick={() => {
              clearStoredAuth();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <LogIn size={14} />
            <span>Đăng nhập lại</span>
          </button>
        </div>
      )}

      {/* ── SECTION 1: TÀI KHOẢN NGƯỜI DÙNG ── */}
      <div className="space-y-3">
        <h2
          className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
        >
          Tài khoản người dùng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng tài khoản"
            value={users?.totalUsers}
            icon={Users}
            iconColor="cyan"
            trend={users?.userGrowth}
            trendLabel="so với tuần trước"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Đang hoạt động"
            value={users?.activeUsers}
            icon={UserCheck}
            iconColor="emerald"
            badge="Hoạt động"
            badgeColor="success"
            subtext="Tài khoản đã xác thực"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Chờ xác thực"
            value={users?.pendingUsers}
            icon={UserPlus}
            iconColor="amber"
            badge="Chờ duyệt"
            badgeColor="warning"
            subtext="Đăng ký chưa xác minh"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Tài khoản bị khóa"
            value={users?.lockedUsers}
            icon={UserX}
            iconColor="rose"
            badge={users?.lockedUsers > 0 ? "Cần lưu ý" : "Bình thường"}
            badgeColor={users?.lockedUsers > 0 ? "danger" : "neutral"}
            subtext="Vi phạm hoặc tạm khóa"
            isDark={isDark}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── SECTION 2: NỘI DUNG & LƯỢT XEM ── */}
      <div className="space-y-3">
        <h2
          className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
        >
          Nội dung & Lượt tương tác
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng sinh vật"
            value={contentAndView?.totalSpecies}
            icon={Fish}
            iconColor="blue"
            subtext="Sinh vật trong cơ sở dữ liệu"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Lượt xem chi tiết"
            value={contentAndView?.totalViews}
            icon={Eye}
            iconColor="cyan"
            trend={contentAndView?.viewGrowth}
            trendLabel="so với tuần trước"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Lượt tìm kiếm"
            value={contentAndView?.totalSearches}
            icon={Search}
            iconColor="purple"
            subtext="Nhật ký tìm kiếm từ người dùng"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Được sưu tập"
            value={contentAndView?.totalFavorites}
            icon={Heart}
            iconColor="rose"
            subtext="Tổng số lượt lưu yêu thích"
            isDark={isDark}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── SECTION 3: BÌNH LUẬN & KIỂM DUYỆT ── */}
      <div className="space-y-3">
        <h2
          className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
        >
          Bình luận & Báo cáo vi phạm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng bình luận"
            value={comments?.totalComments}
            icon={MessageSquare}
            iconColor="indigo"
            subtext="Tất cả thảo luận công khai"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Báo cáo vi phạm"
            value={comments?.reportedComments}
            icon={AlertTriangle}
            iconColor="amber"
            badge={comments?.reportedComments > 0 ? "Chờ duyệt" : "An toàn"}
            badgeColor={comments?.reportedComments > 0 ? "warning" : "success"}
            subtext="Báo cáo cần xử lý"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Bình luận hôm nay"
            value={comments?.todayComments}
            icon={MessageCircle}
            iconColor="emerald"
            subtext="Tương tác mới trong ngày"
            isDark={isDark}
            isLoading={isLoading}
          />
          <StatCard
            title="Bình luận đã xóa"
            value={comments?.deletedComments}
            icon={Trash2}
            iconColor="rose"
            subtext="Nội dung đã gỡ bỏ"
            isDark={isDark}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── SECTION 4: BIỂU ĐỒ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LineChartView
          data={charts?.viewsByDay || []}
          isDark={isDark}
          isLoading={isLoading}
          days={days}
        />
        <BarChartNew
          data={charts?.usersByDay || []}
          isDark={isDark}
          isLoading={isLoading}
          days={days}
        />
      </div>

      {/* ── SECTION 5: BẢNG XẾP HẠNG & HOẠT ĐỘNG ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopSpeciesTable
          species={rankings?.topSpecies || []}
          isDark={isDark}
          isLoading={isLoading}
        />
        <ZoneDistribution
          zones={rankings?.speciesByZone || []}
          isDark={isDark}
          isLoading={isLoading}
        />
        <TopUsersTable
          users={rankings?.topUsers || []}
          isDark={isDark}
          isLoading={isLoading}
        />
        <RecentActivity
          activities={recentActivities || []}
          isDark={isDark}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
