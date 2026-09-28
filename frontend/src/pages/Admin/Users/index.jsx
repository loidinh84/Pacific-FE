import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldOff,
  Lock,
  Unlock,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  LogIn,
  UserCheck,
  UserX,
  Crown,
  Clock,
  Eye,
  Heart,
  MapPin,
  MessageSquare,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { clearStoredAuth, getStoredUser } from "../../../utils/auth";
import {
  fetchAdminUserList,
  fetchAdminUserById,
  updateAdminUserStatus,
  updateAdminUserRole,
  resetAdminUserPassword,
} from "../../../services/adminUserApi";

// ── Helpers ──────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "Chưa đăng nhập";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getMemberDays = (joinedDate) => {
  if (!joinedDate) return 0;
  const diff = Date.now() - new Date(joinedDate).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

// ── Status badge ─────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    active: { label: "Hoạt động", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
    locked: { label: "Đã khóa", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", dot: "bg-rose-400" },
    pending: { label: "Chờ duyệt", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
  };
  const s = map[status] || { label: status, color: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ── Role badge ────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
        <Crown size={10} />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
      <Users size={10} />
      Người dùng
    </span>
  );
};

// ── Avatar initials ───────────────────────────────────────
const Avatar = ({ src, username, size = 8 }) => {
  const initials = (username || "U").slice(0, 2).toUpperCase();
  const colors = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-teal-600",
  ];
  const colorIdx = (username?.charCodeAt(0) || 0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-white/10`}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10`}>
      {initials}
    </div>
  );
};

// ── Confirm Dialog Modal ──────────────────────────────────
const ConfirmDialog = ({ isOpen, title, message, confirmText, variant = "danger", isLoading, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2744] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              variant === "danger"
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : variant === "warning"
                ? "bg-amber-500 hover:bg-amber-400 text-slate-900"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Reset Password Dialog ─────────────────────────────────
const ResetPasswordDialog = ({ isOpen, user, isLoading, onConfirm, onClose }) => {
  const [newPwd, setNewPwd] = useState("Pacific@123");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2744] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-white mb-1">Đặt lại mật khẩu</h3>
        <p className="text-xs text-slate-400 mb-4">
          Đặt lại mật khẩu cho <strong className="text-cyan-400">@{user?.username}</strong>
        </p>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu mới</label>
        <input
          type="text"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white font-mono mb-5 focus:outline-none focus:border-cyan-400/60"
          placeholder="Nhập mật khẩu mới..."
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(newPwd)}
            disabled={isLoading || !newPwd.trim() || newPwd.length < 6}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            <KeyRound size={14} />
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};

// ── User Detail Panel ─────────────────────────────────────
const UserDetailPanel = ({ userId, isDark, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    fetchAdminUserById(userId)
      .then((res) => { if (res?.success) setDetail(res.user); })
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, [userId]);

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Chi tiết người dùng</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && detail && (
        <div className="p-4 space-y-4">
          {/* Profile card */}
          <div className="flex items-center gap-3">
            <Avatar src={detail.avatar} username={detail.username} size={12} />
            <div className="min-w-0">
              <p className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                {detail.fullName || detail.username}
              </p>
              <p className="text-xs text-slate-400 truncate">@{detail.username}</p>
              <p className="text-xs text-slate-400 truncate">{detail.email}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <RoleBadge role={detail.role} />
            <StatusBadge status={detail.status} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Heart, label: "Yêu thích", val: detail.stats?.totalFavorites ?? 0, color: "text-rose-400" },
              { icon: Eye, label: "Lượt xem", val: detail.stats?.totalViews ?? 0, color: "text-cyan-400" },
              { icon: MapPin, label: "Địa điểm", val: detail.stats?.totalLocations ?? 0, color: "text-emerald-400" },
              { icon: MessageSquare, label: "Bình luận", val: detail.stats?.totalComments ?? 0, color: "text-amber-400" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className={color} />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{val.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Meta info */}
          <div className={`text-xs space-y-1.5 rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
            {detail.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-slate-400">SĐT</span>
                <span className={isDark ? "text-white" : "text-slate-900"}>{detail.phoneNumber}</span>
              </div>
            )}
            {detail.dateOfBirth && (
              <div className="flex justify-between">
                <span className="text-slate-400">Ngày sinh</span>
                <span className={isDark ? "text-white" : "text-slate-900"}>{formatDate(detail.dateOfBirth)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Tham gia</span>
              <span className={isDark ? "text-white" : "text-slate-900"}>{formatDate(detail.joinedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Đăng nhập cuối</span>
              <span className={isDark ? "text-white" : "text-slate-900"}>{formatDateTime(detail.lastLogin)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Số ngày là thành viên</span>
              <span className={`font-bold ${isDark ? "text-cyan-300" : "text-blue-600"}`}>{getMemberDays(detail.joinedDate)} ngày</span>
            </div>
          </div>

          {detail.bio && (
            <div className={`text-xs rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
              <p className="text-slate-400 mb-1">Bio</p>
              <p className={`leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>{detail.bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
export default function UsersManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const currentAdmin = getStoredUser();

  // Data
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Selected row & detail panel
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    variant: "danger",
    isLoading: false,
    action: null,
  });

  // Reset password dialog
  const [resetPwdDialog, setResetPwdDialog] = useState({
    isOpen: false,
    user: null,
    isLoading: false,
  });

  // Debounce search
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(h);
  }, [searchTerm]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedRole, selectedStatus]);

  // Fetch users
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setAuthError(false);
        setIsLoading(true);
        const params = {
          page,
          limit: perPage,
          sortBy,
          order: sortOrder,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedRole !== "all") params.role = selectedRole;
        if (selectedStatus !== "all") params.status = selectedStatus;

        const res = await fetchAdminUserList(params);
        if (!ignore && res?.success) {
          setUserList(res.data || []);
          setPagination({
            total: res.pagination?.total ?? 0,
            totalPages: res.pagination?.totalPages ?? 1,
          });
        }
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setAuthError(true);
          } else {
            showToast("Không thể tải danh sách người dùng. Kiểm tra kết nối backend.", "error");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [refreshKey, page, perPage, sortBy, sortOrder, debouncedSearch, selectedRole, selectedStatus]);

  // Sort handler
  const handleSort = (col) => {
    if (sortBy === col) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortOrder("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronDown size={12} className="text-slate-500 ml-0.5" />;
    return sortOrder === "asc"
      ? <ChevronUp size={12} className="text-cyan-400 ml-0.5" />
      : <ChevronDown size={12} className="text-cyan-400 ml-0.5" />;
  };

  // Status update
  const handleStatusAction = (user, newStatus) => {
    const labelMap = { active: "mở khóa", locked: "khóa", pending: "đặt thành chờ duyệt" };
    setConfirmDialog({
      isOpen: true,
      title: newStatus === "locked" ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản",
      message: `Bạn có chắc chắn muốn ${labelMap[newStatus]} tài khoản "@${user.username}"?${
        newStatus === "locked" ? " Người dùng sẽ không thể đăng nhập." : ""
      }`,
      confirmText: newStatus === "locked" ? "Khóa tài khoản" : "Mở khóa",
      variant: newStatus === "locked" ? "danger" : "success",
      isLoading: false,
      action: async () => {
        setConfirmDialog((p) => ({ ...p, isLoading: true }));
        try {
          await updateAdminUserStatus(user.id, newStatus);
          setUserList((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
          showToast(
            newStatus === "locked"
              ? `Đã khóa tài khoản "@${user.username}"`
              : `Đã mở khóa tài khoản "@${user.username}"`,
            newStatus === "locked" ? "warning" : "success"
          );
          setConfirmDialog((p) => ({ ...p, isOpen: false, isLoading: false }));
        } catch (err) {
          showToast(err?.response?.data?.error || "Không thể cập nhật trạng thái.", "error");
          setConfirmDialog((p) => ({ ...p, isLoading: false }));
        }
      },
    });
  };

  // Role update
  const handleRoleAction = (user, newRole) => {
    setConfirmDialog({
      isOpen: true,
      title: newRole === "admin" ? "Cấp quyền Admin" : "Thu hồi quyền Admin",
      message: newRole === "admin"
        ? `Bạn có chắc chắn muốn cấp quyền Admin cho "@${user.username}"? Người này sẽ có toàn quyền quản trị hệ thống.`
        : `Bạn có chắc chắn muốn thu hồi quyền Admin của "@${user.username}"?`,
      confirmText: newRole === "admin" ? "Cấp quyền Admin" : "Thu hồi quyền",
      variant: newRole === "admin" ? "warning" : "danger",
      isLoading: false,
      action: async () => {
        setConfirmDialog((p) => ({ ...p, isLoading: true }));
        try {
          await updateAdminUserRole(user.id, newRole);
          setUserList((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
          showToast(
            newRole === "admin" ? `Đã cấp quyền Admin cho "@${user.username}"` : `Đã thu hồi quyền Admin của "@${user.username}"`,
            "success"
          );
          setConfirmDialog((p) => ({ ...p, isOpen: false, isLoading: false }));
        } catch (err) {
          showToast(err?.response?.data?.error || "Không thể cập nhật vai trò.", "error");
          setConfirmDialog((p) => ({ ...p, isLoading: false }));
        }
      },
    });
  };

  // Reset password
  const handleResetPassword = async (newPwd) => {
    const user = resetPwdDialog.user;
    setResetPwdDialog((p) => ({ ...p, isLoading: true }));
    try {
      const res = await resetAdminUserPassword(user.id, newPwd);
      showToast(
        `Đã đặt lại mật khẩu cho "@${user.username}". Mật khẩu mới: ${res.temporaryPassword}`,
        "success"
      );
      setResetPwdDialog({ isOpen: false, user: null, isLoading: false });
    } catch (err) {
      showToast(err?.response?.data?.error || "Không thể đặt lại mật khẩu.", "error");
      setResetPwdDialog((p) => ({ ...p, isLoading: false }));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!userList.length) { showToast("Không có dữ liệu để xuất", "warning"); return; }
    const headers = ["ID", "Username", "Họ tên", "Email", "Vai trò", "Trạng thái", "Ngày tham gia", "Đăng nhập cuối", "Yêu thích", "Lượt xem"];
    const rows = userList.map((u) => [
      `"${u.id}"`,
      `"${u.username}"`,
      `"${(u.fullName || "").replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${formatDate(u.joinedDate)}"`,
      `"${formatDateTime(u.lastLogin)}"`,
      u.totalFavorites || 0,
      u.totalViews || 0,
    ]);
    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pacific_users_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${userList.length} người dùng ra CSV!`, "success");
  };

  // Summary stats (from current page)
  const pageStats = useMemo(() => {
    const active = userList.filter((u) => u.status === "active").length;
    const locked = userList.filter((u) => u.status === "locked").length;
    const admins = userList.filter((u) => u.role === "admin").length;
    return { active, locked, admins };
  }, [userList]);

  const cols = [
    { key: "username", label: "Người dùng" },
    { key: "role", label: "Vai trò" },
    { key: "status", label: "Trạng thái" },
    { key: "created_at", label: "Tham gia" },
    { key: "last_login_at", label: "Đăng nhập cuối" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Quản lý người dùng
          </h1>
          <p className={`text-xs md:text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tra cứu, phân quyền và quản lý tài khoản thành viên Pacific
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <Download size={15} />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── AUTH ERROR BANNER ── */}
      {authError && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
          isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="text-amber-400 shrink-0" size={20} />
            <span><strong>Phiên đăng nhập đã hết hạn.</strong> Vui lòng đăng nhập lại để quản lý người dùng.</span>
          </div>
          <button
            onClick={() => { clearStoredAuth(); navigate("/login"); }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl cursor-pointer"
          >
            <LogIn size={14} />
            Đăng nhập lại
          </button>
        </div>
      )}

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng người dùng",
            value: pagination.total,
            icon: Users,
            color: "from-sky-500 to-blue-600",
            bg: isDark ? "bg-sky-500/10 border-sky-500/25" : "bg-sky-50 border-sky-200",
            text: isDark ? "text-sky-300" : "text-sky-700",
          },
          {
            label: "Đang hoạt động",
            value: isLoading ? "—" : pageStats.active,
            icon: UserCheck,
            color: "from-emerald-500 to-teal-600",
            bg: isDark ? "bg-emerald-500/10 border-emerald-500/25" : "bg-emerald-50 border-emerald-200",
            text: isDark ? "text-emerald-300" : "text-emerald-700",
            sub: "trên trang này",
          },
          {
            label: "Đã khóa",
            value: isLoading ? "—" : pageStats.locked,
            icon: Lock,
            color: "from-rose-500 to-pink-600",
            bg: isDark ? "bg-rose-500/10 border-rose-500/25" : "bg-rose-50 border-rose-200",
            text: isDark ? "text-rose-300" : "text-rose-700",
            sub: "trên trang này",
          },
          {
            label: "Quản trị viên",
            value: isLoading ? "—" : pageStats.admins,
            icon: Crown,
            color: "from-violet-500 to-purple-600",
            bg: isDark ? "bg-violet-500/10 border-violet-500/25" : "bg-violet-50 border-violet-200",
            text: isDark ? "text-violet-300" : "text-violet-700",
            sub: "trên trang này",
          },
        ].map(({ label, value, icon: Icon, bg, text, sub }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <div className="flex items-start justify-between mb-2">
              <p className={`text-xs font-semibold ${text}`}>{label}</p>
              <Icon size={16} className={text} />
            </div>
            <p className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div className={`rounded-2xl border p-4 flex flex-wrap gap-3 items-center ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
        {/* Search */}
        <div className={`flex items-center gap-2 flex-1 min-w-52 rounded-xl border px-3 py-2 ${isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"}`}>
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm tên, email, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-white cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
          <option value="pending">Chờ duyệt</option>
        </select>

        {/* Per page */}
        <select
          value={perPage}
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / trang</option>)}
        </select>

        {/* Reset */}
        {(searchTerm || selectedRole !== "all" || selectedStatus !== "all") && (
          <button
            onClick={() => { setSearchTerm(""); setSelectedRole("all"); setSelectedStatus("all"); }}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X size={12} /> Xóa bộ lọc
          </button>
        )}

        <span className={`ml-auto text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {isLoading ? "Đang tải..." : `${pagination.total} người dùng`}
        </span>
      </div>

      {/* ── MAIN LAYOUT: TABLE + DETAIL PANEL ── */}
      <div className={`grid gap-5 ${selectedUserId ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* TABLE */}
        <div className={selectedUserId ? "lg:col-span-8" : "col-span-1"}>
          <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b text-xs ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                    {cols.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-3 text-left font-bold cursor-pointer select-none transition-colors ${
                          isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-0.5">
                          {label}
                          <SortIcon col={key} />
                        </span>
                      </th>
                    ))}
                    <th className={`px-4 py-3 text-right font-bold text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className={`border-b ${isDark ? "border-white/5" : "border-slate-50"}`}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className={`h-4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ width: `${60 + j * 10}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}

                  {!isLoading && userList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <Users size={32} className="mx-auto text-slate-400 mb-3" />
                        <p className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          Không tìm thấy người dùng nào
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </td>
                    </tr>
                  )}

                  {!isLoading && userList.map((user) => {
                    const isSelected = selectedUserId === user.id;
                    const isSelf = String(currentAdmin?.id) === String(user.id) || currentAdmin?.username === user.username;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setSelectedUserId(isSelected ? null : user.id)}
                        className={`border-b transition-colors cursor-pointer ${
                          isDark ? "border-white/5" : "border-slate-50"
                        } ${
                          isSelected
                            ? isDark ? "bg-sky-500/10" : "bg-sky-50"
                            : isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* User column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={user.avatar} username={user.username} size={8} />
                            <div className="min-w-0">
                              <p className={`font-semibold text-sm truncate max-w-[160px] ${isDark ? "text-white" : "text-slate-900"}`}>
                                {user.fullName || user.username}
                                {isSelf && <span className="ml-1.5 text-[10px] text-cyan-400 font-bold">(Bạn)</span>}
                              </p>
                              <p className="text-xs text-slate-400 truncate max-w-[160px]">
                                @{user.username} · {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Role */}
                        <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                        {/* Status */}
                        <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                        {/* Joined */}
                        <td className={`px-4 py-3 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          {formatDate(user.joinedDate)}
                        </td>
                        {/* Last login */}
                        <td className={`px-4 py-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {user.lastLogin ? formatDate(user.lastLogin) : "—"}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {/* Lock / Unlock */}
                            {!isSelf && (
                              user.status === "locked" ? (
                                <button
                                  onClick={() => handleStatusAction(user, "active")}
                                  title="Mở khóa tài khoản"
                                  className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors cursor-pointer"
                                >
                                  <Unlock size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusAction(user, "locked")}
                                  title="Khóa tài khoản"
                                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                                >
                                  <Lock size={14} />
                                </button>
                              )
                            )}

                            {/* Grant / Revoke admin */}
                            {!isSelf && (
                              user.role === "admin" ? (
                                <button
                                  onClick={() => handleRoleAction(user, "user")}
                                  title="Thu hồi quyền Admin"
                                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/15 transition-colors cursor-pointer"
                                >
                                  <ShieldOff size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRoleAction(user, "admin")}
                                  title="Cấp quyền Admin"
                                  className="p-1.5 rounded-lg text-violet-400 hover:bg-violet-500/15 transition-colors cursor-pointer"
                                >
                                  <ShieldCheck size={14} />
                                </button>
                              )
                            )}

                            {/* Reset password */}
                            <button
                              onClick={() => setResetPwdDialog({ isOpen: true, user, isLoading: false })}
                              title="Đặt lại mật khẩu"
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <KeyRound size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={`flex items-center justify-between px-4 py-3 border-t text-xs ${isDark ? "border-white/10 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                <span>
                  Trang {page} / {pagination.totalPages} · {pagination.total} người dùng
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          p === page
                            ? "bg-blue-500 text-white"
                            : isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        {selectedUserId && (
          <div className="lg:col-span-4">
            <UserDetailPanel
              userId={selectedUserId}
              isDark={isDark}
              onClose={() => setSelectedUserId(null)}
            />
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        isLoading={confirmDialog.isLoading}
        onConfirm={confirmDialog.action}
        onClose={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
      />

      <ResetPasswordDialog
        isOpen={resetPwdDialog.isOpen}
        user={resetPwdDialog.user}
        isLoading={resetPwdDialog.isLoading}
        onConfirm={handleResetPassword}
        onClose={() => setResetPwdDialog({ isOpen: false, user: null, isLoading: false })}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
