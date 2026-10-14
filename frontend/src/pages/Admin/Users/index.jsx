/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  LogIn,
  UserCheck,
  Crown,
  Eye,
  Heart,
  MapPin,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  User,
  Activity,
  Calendar,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Compass,
  CheckCircle2,
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
  fetchAdminUserActivity,
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
    active: {
      label: "Hoạt động",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    locked: {
      label: "Đã khóa",
      color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      dot: "bg-rose-400",
    },
    pending: {
      label: "Chờ duyệt",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      dot: "bg-amber-400",
    },
  };
  const s = map[status] || {
    label: status,
    color: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ── Role Config & Badge ──────────────────────────────────
const ROLE_CONFIG = {
  super_admin: {
    label: "Tổng quản trị",
    shortLabel: "Super Admin",
    color: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: Crown,
    badgeColor: "text-purple-400",
    description: "Toàn quyền hệ thống & phân quyền",
  },
  admin: {
    label: "Quản trị viên",
    shortLabel: "Admin",
    color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: ShieldCheck,
    badgeColor: "text-blue-400",
    description: "Quản lý dữ liệu, kiểm duyệt & thống kê",
  },
  moderator: {
    label: "Biên tập viên",
    shortLabel: "Biên tập viên",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: Compass,
    badgeColor: "text-emerald-400",
    description: "Biên tập sinh vật, kiểm duyệt bình luận",
  },
  expert: {
    label: "Chuyên gia biển",
    shortLabel: "Chuyên gia",
    color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: Sparkles,
    badgeColor: "text-amber-400",
    description: "Nhà nghiên cứu / đóng góp kiến thức uy tín",
  },
  top_fan: {
    label: "Fan cứng đại dương",
    shortLabel: "Fan cứng",
    color: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: Heart,
    badgeColor: "text-rose-400",
    description: "Thành viên tích cực & gắn bó lâu năm",
  },
  user: {
    label: "Thành viên",
    shortLabel: "Thành viên",
    color: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    icon: Users,
    badgeColor: "text-sky-400",
    description: "Người dùng khám phá thông thường",
  },
};

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.color}`}
    >
      <Icon size={11} className={config.badgeColor} />
      <span>{config.shortLabel}</span>
    </span>
  );
};

// ── Avatar initials ───────────────────────────────────────
const sizeClassMap = {
  8: "w-8 h-8 text-xs",
  9: "w-9 h-9 text-xs",
  10: "w-10 h-10 text-sm",
  12: "w-12 h-12 text-sm",
  14: "w-14 h-14 text-base",
  16: "w-16 h-16 text-lg",
  20: "w-20 h-20 text-xl",
};

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
  const sizeClasses = sizeClassMap[size] || "w-8 h-8 text-xs";

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={`${sizeClasses} rounded-2xl object-cover ring-2 ring-white/10`}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses} rounded-2xl bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white font-bold ring-2 ring-white/10`}
    >
      {initials}
    </div>
  );
};

// ── Confirm Dialog Modal ──────────────────────────────────
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText,
  variant = "danger",
  isLoading,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-md border rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200 bg-[#0d1730] border-white/10 text-white shadow-xl">
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                : variant === "warning"
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white mb-1 font-heading">
              {title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2.5 justify-end pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
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
const ResetPasswordDialog = ({
  isOpen,
  user,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const [newPwd, setNewPwd] = useState("Pacific@123");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPwd("Pacific@123");
      setShowPwd(false);
    }
  }, [isOpen]);

  const handleGenerateRandom = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let gen = "";
    for (let i = 0; i < 8; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPwd(`Pacific@${gen}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-md border rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200 bg-[#0d1730] border-white/10 text-white shadow-xl">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <KeyRound size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white mb-1 font-heading">
              Đặt lại mật khẩu
            </h3>
            <p className="text-xs text-slate-300">
              Cấp lại mật khẩu mới cho tài khoản{" "}
              <strong className="text-cyan-400 font-mono">@{user?.username}</strong>
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Mật khẩu mới
            </label>
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline underline-offset-2"
            >
              Tạo mật khẩu ngẫu nhiên
            </button>
          </div>

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400/70 pr-10"
              placeholder="Nhập mật khẩu mới..."
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <Eye size={15} />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed space-y-1">
            <p className="font-semibold text-cyan-300 flex items-center gap-1">
              <ShieldCheck size={13} className="shrink-0" />
              Cơ chế bảo mật mật khẩu:
            </p>
            <p>
              Mật khẩu sẽ được mã hóa an toàn bằng thuật toán <strong>bcrypt (salt 10)</strong> trên server trước khi lưu vào database. Người dùng có thể dùng mật khẩu này để đăng nhập ngay lập tức.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer transition-all"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(newPwd)}
            disabled={isLoading || !newPwd.trim() || newPwd.length < 6}
            className="px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            <KeyRound size={14} />
            Đặt lại mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Role Assignment Dialog ────────────────────────────────
const RoleAssignmentDialog = ({
  isOpen,
  user,
  currentAdmin,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState("user");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setSelectedRole(user.role || "user");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const isOperatorSuperAdmin = currentAdmin?.role === "super_admin";
  const isChangingAdminLevel =
    selectedRole === "admin" ||
    selectedRole === "super_admin" ||
    user.role === "admin" ||
    user.role === "super_admin";

  const availableRoles = [
    ...(isOperatorSuperAdmin
      ? [
          {
            id: "super_admin",
            label: "Tổng quản trị",
            sub: "Super Admin - Toàn quyền quản trị & phân quyền",
            icon: Crown,
            color: "text-purple-400 bg-purple-500/15 border-purple-500/30",
          },
        ]
      : []),
    ...(isOperatorSuperAdmin
      ? [
          {
            id: "admin",
            label: "Quản trị viên",
            sub: "Admin - Quản lý người dùng, sinh vật & thống kê",
            icon: ShieldCheck,
            color: "text-blue-400 bg-blue-500/15 border-blue-500/30",
          },
        ]
      : []),
    {
      id: "moderator",
      label: "Biên tập viên",
      sub: "Moderator - Biên tập dữ liệu biển & kiểm duyệt bình luận",
      icon: Compass,
      color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    },
    {
      id: "expert",
      label: "Chuyên gia biển",
      sub: "Expert - Nhà nghiên cứu & đóng góp kiến thức uy tín",
      icon: Sparkles,
      color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    },
    {
      id: "top_fan",
      label: "Fan cứng đại dương",
      sub: "Top Fan - Thành viên nhiệt huyết, tích cực tương tác",
      icon: Heart,
      color: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    },
    {
      id: "user",
      label: "Thành viên khám phá",
      sub: "Standard User - Người dùng khám phá thông thường",
      icon: Users,
      color: "text-sky-400 bg-sky-500/15 border-sky-500/30",
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-lg border rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200 bg-[#0d1730] border-white/10 text-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl border border-purple-500/30 bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Crown size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white mb-0.5 font-heading">
              Phân quyền & Vai trò
            </h3>
            <p className="text-xs text-slate-300">
              Cập nhật vai trò hệ thống cho tài khoản{" "}
              <strong className="text-cyan-400 font-mono">
                @{user?.username}
              </strong>
            </p>
          </div>
        </div>

        {/* Roles list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {availableRoles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? "bg-white/10 border-cyan-400/50"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${r.color}`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">{r.label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{r.sub}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400"
                      : "border-slate-500"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Password confirmation if escalating/modifying admin */}
        {isChangingAdminLevel && (
          <div className="mt-2 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1.5 shrink-0">
            <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-purple-400" />
              Mật khẩu xác nhận của bạn (Bảo mật bắt buộc):
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập mật khẩu tài khoản quản trị của bạn..."
                className="w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400/60 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <Eye size={13} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Chỉ Tổng quản trị (Super Admin) mới được phép thay đổi quyền hạn
              Quản trị viên.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2.5 justify-end pt-3 mt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer transition-all"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedRole, confirmPassword)}
            disabled={
              isLoading || (isChangingAdminLevel && !confirmPassword.trim())
            }
            className="px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            <CheckCircle2 size={14} />
            Lưu vai trò
          </button>
        </div>
      </div>
    </div>
  );
};

// ── User Detail Modal ─────────────────────────────────────
const UserDetailModal = ({
  userId,
  user: initialUser,
  isDark,
  onClose,
  onStatusAction,
  onRoleAction,
  onResetPassword,
  currentAdmin,
}) => {
  const [detail, setDetail] = useState(() => {
    if (!initialUser) return null;
    return {
      ...initialUser,
      stats: {
        totalFavorites: initialUser.totalFavorites || 0,
        totalViews: initialUser.totalViews || 0,
        totalLocations: 0,
        totalComments: 0,
      },
    };
  });
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (initialUser) {
      setDetail((prev) => {
        if (!prev) return initialUser;
        return {
          ...prev,
          role: initialUser.role,
          status: initialUser.status,
        };
      });
    }
  }, [initialUser?.role, initialUser?.status]);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    if (!initialUser && !detail) {
      setIsLoading(true);
    }
    fetchAdminUserById(userId)
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && res.user) {
          setDetail((prev) => ({
            ...(prev || {}),
            ...res.user,
            stats: {
              ...(prev?.stats || {}),
              ...(res.user.stats || {}),
            },
          }));
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Lỗi tải chi tiết người dùng:", err);
        if (!detail && !initialUser) {
          setLoadError("Không thể tải thông tin chi tiết người dùng.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (activeTab !== "activity" || !userId || activity) return;
    let isMounted = true;
    setIsActivityLoading(true);
    fetchAdminUserActivity(userId, 8)
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && res.activity) {
          setActivity(res.activity);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Lỗi tải lịch sử hoạt động:", err);
      })
      .finally(() => {
        if (isMounted) setIsActivityLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, userId, activity]);

  const formatRelTime = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const statusColor = (s) => {
    if (s === "visible") return "text-emerald-400";
    if (s === "hidden") return "text-amber-400";
    return "text-slate-400";
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 ${
        isDark ? "bg-black/40 text-white" : "bg-slate-900/40 text-slate-800"
      }`}
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className={`w-full max-w-2xl border rounded-3xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 ${
          isDark
            ? "bg-[#0d1730] border-white/10 text-white shadow-xl"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isDark
                  ? "bg-cyan-500/15 border-cyan-400/25 text-cyan-300"
                  : "bg-cyan-50 border-cyan-200 text-cyan-600"
              }`}
            >
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">
                Chi tiết người dùng
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {detail ? `@${detail.username} • ID: ${detail.id}` : `ID: ${userId}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b px-6 pt-3 gap-2 shrink-0 ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "info"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            <User size={14} />
            <span>Thông tin cá nhân</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "activity"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            <Activity size={14} />
            <span>Hoạt động gần đây</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {isLoading && !detail && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <RefreshCw size={24} className="animate-spin text-cyan-400" />
              <p className="text-xs text-slate-400">Đang tải thông tin người dùng...</p>
            </div>
          )}

          {loadError && !detail && (
            <div className="py-12 text-center space-y-3">
              <AlertTriangle size={32} className="mx-auto text-amber-400" />
              <p className="text-sm text-slate-300">{loadError}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white"
              >
                Đóng
              </button>
            </div>
          )}

          {detail && activeTab === "info" && (
            <div className="space-y-5">
              {/* Profile Card Banner */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-transparent border-cyan-500/20"
                    : "bg-gradient-to-r from-cyan-50 via-blue-50 to-slate-50 border-cyan-200/60"
                }`}
              >
                <Avatar src={detail.avatar} username={detail.username} size={16} />
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <h3
                      className={`text-lg font-bold truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {detail.fullName || detail.username}
                    </h3>
                    <RoleBadge role={detail.role} />
                    <StatusBadge status={detail.status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400/90 font-medium">@{detail.username}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{detail.email}</span>
                    </span>
                  </div>
                  {detail.bio && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p
                        className={`text-xs italic leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        "{detail.bio}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: Heart,
                    label: "Yêu thích",
                    val: detail.stats?.totalFavorites ?? detail.totalFavorites ?? 0,
                    color: "text-rose-400",
                    bg: isDark ? "bg-rose-500/15" : "bg-rose-50",
                  },
                  {
                    icon: Eye,
                    label: "Lượt xem",
                    val: detail.stats?.totalViews ?? detail.totalViews ?? 0,
                    color: "text-cyan-400",
                    bg: isDark ? "bg-cyan-500/15" : "bg-cyan-50",
                  },
                  {
                    icon: MapPin,
                    label: "Địa điểm",
                    val: detail.stats?.totalLocations ?? 0,
                    color: "text-emerald-400",
                    bg: isDark ? "bg-emerald-500/15" : "bg-emerald-50",
                  },
                  {
                    icon: MessageSquare,
                    label: "Bình luận",
                    val: detail.stats?.totalComments ?? 0,
                    color: "text-amber-400",
                    bg: isDark ? "bg-amber-500/15" : "bg-amber-50",
                  },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div
                    key={label}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      isDark
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium">{label}</span>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${bg}`}>
                        <Icon size={13} className={color} />
                      </div>
                    </div>
                    <p
                      className={`text-xl font-bold font-heading ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {Number(val).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Account Metadata List */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border space-y-3.5 text-xs sm:text-sm ${
                  isDark
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-cyan-400">
                    Thông tin tài khoản & Hoạt động
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {getMemberDays(detail.joinedDate)} ngày tham gia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone size={13} />
                      Số điện thoại
                    </span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {detail.phoneNumber || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar size={13} />
                      Ngày sinh
                    </span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {formatDate(detail.dateOfBirth)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock size={13} />
                      Ngày tạo
                    </span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {formatDate(detail.joinedDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <LogIn size={13} />
                      Đăng nhập cuối
                    </span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                      {formatDateTime(detail.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {detail && activeTab === "activity" && (
            <div className="space-y-5">
              {isActivityLoading && !activity && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <RefreshCw size={24} className="animate-spin text-cyan-400" />
                  <p className="text-xs text-slate-400">Đang tải lịch sử hoạt động...</p>
                </div>
              )}

              {activity && (
                <>
                  {/* Recent Comments */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border space-y-3 ${
                      isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200"
                    }`}
                  >
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <MessageSquare size={14} className="text-amber-400" />
                      Bình luận gần đây ({activity.recentComments?.length || 0})
                    </h3>
                    {(!activity.recentComments || activity.recentComments.length === 0) ? (
                      <p className="text-xs text-slate-500 py-3 text-center italic">
                        Chưa có bình luận nào trên hệ thống.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {activity.recentComments.map((c) => (
                          <div
                            key={c.id}
                            className={`rounded-xl p-3 text-xs sm:text-sm border ${
                              isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className={`text-xs font-semibold ${statusColor(c.status)}`}>
                                {c.status === "visible" ? "• Hiển thị" : c.status === "hidden" ? "• Ẩn" : `• ${c.status}`}
                                {c.reportCount > 0 && (
                                  <span className="ml-2 text-rose-400">⚠ {c.reportCount} báo cáo</span>
                                )}
                              </span>
                              <span className="text-[11px] text-slate-500 shrink-0">
                                {formatRelTime(c.createdAt)}
                              </span>
                            </div>
                            <p
                              className={`leading-relaxed line-clamp-2 ${
                                isDark ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              {c.content}
                            </p>
                            {c.species && (
                              <p className="text-[11px] text-cyan-400 mt-1 font-medium">
                                → Sinh vật: {c.species.name}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Favorites */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border space-y-3 ${
                      isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200"
                    }`}
                  >
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <Heart size={14} className="text-rose-400" />
                      Sinh vật yêu thích ({activity.recentFavorites?.length || 0})
                    </h3>
                    {(!activity.recentFavorites || activity.recentFavorites.length === 0) ? (
                      <p className="text-xs text-slate-500 py-3 text-center italic">
                        Chưa yêu thích loài sinh vật nào.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activity.recentFavorites.map((f, i) => (
                          <div
                            key={i}
                            className={`rounded-xl p-2.5 flex items-center gap-2.5 border ${
                              isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            {f.species?.image ? (
                              <img
                                src={f.species.image}
                                alt={f.species.name}
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
                                <Heart size={16} className="text-rose-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-bold truncate ${
                                  isDark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {f.species?.name || "—"}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {formatRelTime(f.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Locations */}
                  {activity.recentLocations && activity.recentLocations.length > 0 && (
                    <div
                      className={`rounded-2xl p-4 sm:p-5 border space-y-3 ${
                        isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200"
                      }`}
                    >
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <MapPin size={14} className="text-emerald-400" />
                        Địa điểm đã khám phá ({activity.recentLocations.length})
                      </h3>
                      <div className="space-y-2">
                        {activity.recentLocations.map((l, i) => (
                          <div
                            key={i}
                            className={`rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm border ${
                              isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            <span className={`flex items-center gap-2 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                              <MapPin size={13} className="text-emerald-400 shrink-0" />
                              {l.location?.name || "—"}
                            </span>
                            <span className="text-[11px] text-slate-500 shrink-0">
                              {formatRelTime(l.exploredAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 backdrop-blur-md ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"
          }`}
        >
          {/* Quick Actions (if not self) */}
          <div className="flex flex-wrap items-center gap-2">
            {detail && currentAdmin?.id !== detail.id && (
              <>
                {onStatusAction && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = detail.status === "active" ? "locked" : "active";
                      onStatusAction(detail, nextStatus);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      detail.status === "active"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    {detail.status === "active" ? <Lock size={12} /> : <Unlock size={12} />}
                    <span>{detail.status === "active" ? "Khóa tài khoản" : "Mở khóa"}</span>
                  </button>
                )}
                {onRoleAction && (
                  <button
                    type="button"
                    onClick={() => onRoleAction(detail)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Crown size={12} />
                    <span>Phân quyền & Vai trò</span>
                  </button>
                )}
                {onResetPassword && (
                  <button
                    type="button"
                    onClick={() => onResetPassword(detail)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                  >
                    <KeyRound size={12} />
                    <span>Đặt lại mật khẩu</span>
                  </button>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-white/5 hover:bg-white/10 border-white/15 text-white/80 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
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

  // Role assignment dialog
  const [roleDialog, setRoleDialog] = useState({
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
            showToast(
              "Không thể tải danh sách người dùng. Kiểm tra kết nối backend.",
              "error",
            );
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [
    refreshKey,
    page,
    perPage,
    sortBy,
    sortOrder,
    debouncedSearch,
    selectedRole,
    selectedStatus,
  ]);

  // Sort handler
  const handleSort = (col) => {
    if (sortBy === col) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col)
      return <ChevronDown size={12} className="text-slate-500 ml-0.5" />;
    return sortOrder === "asc" ? (
      <ChevronUp size={12} className="text-cyan-400 ml-0.5" />
    ) : (
      <ChevronDown size={12} className="text-cyan-400 ml-0.5" />
    );
  };

  // Status update
  const handleStatusAction = (user, newStatus) => {
    const labelMap = {
      active: "mở khóa",
      locked: "khóa",
      pending: "đặt thành chờ duyệt",
    };
    setConfirmDialog({
      isOpen: true,
      title:
        newStatus === "locked"
          ? "Xác nhận khóa tài khoản"
          : "Xác nhận mở khóa tài khoản",
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
          setUserList((prev) =>
            prev.map((u) =>
              u.id === user.id ? { ...u, status: newStatus } : u,
            ),
          );
          showToast(
            newStatus === "locked"
              ? `Đã khóa tài khoản "@${user.username}"`
              : `Đã mở khóa tài khoản "@${user.username}"`,
            newStatus === "locked" ? "warning" : "success",
          );
          setConfirmDialog((p) => ({ ...p, isOpen: false, isLoading: false }));
        } catch (err) {
          showToast(
            err?.response?.data?.error || "Không thể cập nhật trạng thái.",
            "error",
          );
          setConfirmDialog((p) => ({ ...p, isLoading: false }));
        }
      },
    });
  };

  // Role assignment dialog
  const handleOpenRoleDialog = (targetUser) => {
    setRoleDialog({
      isOpen: true,
      user: targetUser,
      isLoading: false,
    });
  };

  const handleRoleSubmit = async (newRole, confirmPassword) => {
    const targetUser = roleDialog.user;
    if (!targetUser) return;
    setRoleDialog((p) => ({ ...p, isLoading: true }));
    try {
      await updateAdminUserRole(targetUser.id, newRole, confirmPassword);
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      const roleLabel = ROLE_CONFIG[newRole]?.label || newRole;
      showToast(
        `Đã cập nhật vai trò của "@${targetUser.username}" thành "${roleLabel}"`,
        "success"
      );
      setRoleDialog({ isOpen: false, user: null, isLoading: false });
    } catch (err) {
      showToast(
        err?.response?.data?.error || "Không thể cập nhật vai trò.",
        "error"
      );
      setRoleDialog((p) => ({ ...p, isLoading: false }));
    }
  };

  // Reset password
  const handleResetPassword = async (newPwd) => {
    const user = resetPwdDialog.user;
    setResetPwdDialog((p) => ({ ...p, isLoading: true }));
    try {
      const res = await resetAdminUserPassword(user.id, newPwd);
      showToast(
        `Đã đặt lại mật khẩu cho "@${user.username}". Mật khẩu mới: ${res.temporaryPassword}`,
        "success",
      );
      setResetPwdDialog({ isOpen: false, user: null, isLoading: false });
    } catch (err) {
      showToast(
        err?.response?.data?.error || "Không thể đặt lại mật khẩu.",
        "error",
      );
      setResetPwdDialog((p) => ({ ...p, isLoading: false }));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!userList.length) {
      showToast("Không có dữ liệu để xuất", "warning");
      return;
    }
    const headers = [
      "ID",
      "Username",
      "Họ tên",
      "Email",
      "Vai trò",
      "Trạng thái",
      "Ngày tham gia",
      "Đăng nhập cuối",
      "Yêu thích",
      "Lượt xem",
    ];
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
    const csv =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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
    const admins = userList.filter((u) => u.role === "admin" || u.role === "super_admin").length;
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
          <h1
            className={`text-2xl md:text-3xl font-bold font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Quản lý người dùng
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-white/10 hover:bg-white/15 border-white/20 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <Download size={15} />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-white/10 hover:bg-white/15 border-white/20 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            <span>Làm mới</span>
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
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="text-amber-400 shrink-0" size={20} />
            <span>
              <strong>Phiên đăng nhập đã hết hạn.</strong> Vui lòng đăng nhập
              lại để quản lý người dùng.
            </span>
          </div>
          <button
            onClick={() => {
              clearStoredAuth();
              navigate("/login");
            }}
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
            bg: isDark
              ? "bg-sky-500/10 border-sky-500/25"
              : "bg-sky-50 border-sky-200",
            text: isDark ? "text-sky-300" : "text-sky-700",
          },
          {
            label: "Đang hoạt động",
            value: isLoading ? "—" : pageStats.active,
            icon: UserCheck,
            color: "from-emerald-500 to-teal-600",
            bg: isDark
              ? "bg-emerald-500/10 border-emerald-500/25"
              : "bg-emerald-50 border-emerald-200",
            text: isDark ? "text-emerald-300" : "text-emerald-700",
            sub: "trên trang này",
          },
          {
            label: "Đã khóa",
            value: isLoading ? "—" : pageStats.locked,
            icon: Lock,
            color: "from-rose-500 to-pink-600",
            bg: isDark
              ? "bg-rose-500/10 border-rose-500/25"
              : "bg-rose-50 border-rose-200",
            text: isDark ? "text-rose-300" : "text-rose-700",
            sub: "trên trang này",
          },
          {
            label: "Quản trị viên",
            value: isLoading ? "—" : pageStats.admins,
            icon: Crown,
            color: "from-violet-500 to-purple-600",
            bg: isDark
              ? "bg-violet-500/10 border-violet-500/25"
              : "bg-violet-50 border-violet-200",
            text: isDark ? "text-violet-300" : "text-violet-700",
            sub: "trên trang này",
          },
        ].map(({ label, value, icon: Icon, bg, text, sub }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <div className="flex items-start justify-between mb-2">
              <p className={`text-xs font-semibold ${text}`}>{label}</p>
              <Icon size={16} className={text} />
            </div>
            <p
              className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {value}
            </p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div
        className={`rounded-2xl border p-4 flex flex-wrap gap-3 items-center ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}
      >
        {/* Search */}
        <div
          className={`flex items-center gap-2 flex-1 min-w-52 rounded-xl border px-3 py-2 ${isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"}`}
        >
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm tên, email, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark
              ? "bg-[#162040] border-white/15 text-white"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <option value="all" className={isDark ? "bg-[#0f172a] text-white" : ""}>Tất cả vai trò</option>
          <option value="super_admin" className={isDark ? "bg-[#0f172a] text-white" : ""}>👑 Tổng quản trị</option>
          <option value="admin" className={isDark ? "bg-[#0f172a] text-white" : ""}>🛡️ Quản trị viên</option>
          <option value="moderator" className={isDark ? "bg-[#0f172a] text-white" : ""}>🌿 Biên tập viên</option>
          <option value="expert" className={isDark ? "bg-[#0f172a] text-white" : ""}>🔬 Chuyên gia biển</option>
          <option value="top_fan" className={isDark ? "bg-[#0f172a] text-white" : ""}>🌟 Fan cứng đại dương</option>
          <option value="user" className={isDark ? "bg-[#0f172a] text-white" : ""}>🤿 Thành viên khám phá</option>
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark
              ? "bg-white/5 border-white/15 text-white"
              : "bg-slate-50 border-slate-200 text-slate-700"
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
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${
            isDark
              ? "bg-white/5 border-white/15 text-white"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </select>

        {/* Reset */}
        {(searchTerm || selectedRole !== "all" || selectedStatus !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRole("all");
              setSelectedStatus("all");
            }}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X size={12} /> Xóa bộ lọc
          </button>
        )}

        <span
          className={`ml-auto text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {isLoading ? "Đang tải..." : `${pagination.total} người dùng`}
        </span>
      </div>

      {/* ── MAIN LAYOUT: TABLE (full width, detail is a modal) ── */}
      <div className="grid grid-cols-1 gap-5">
        {/* TABLE */}
        <div className="col-span-1">
          <div
            className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={`border-b text-xs ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}
                  >
                    {cols.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-3 text-left font-bold cursor-pointer select-none transition-colors ${
                          isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-0.5">
                          {label}
                          <SortIcon col={key} />
                        </span>
                      </th>
                    ))}
                    <th
                      className={`px-4 py-3 text-right font-bold text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr
                        key={i}
                        className={`border-b ${isDark ? "border-white/5" : "border-slate-50"}`}
                      >
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-4 py-3">
                            <div
                              className={`h-4 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-slate-200"}`}
                              style={{ width: `${60 + j * 10}%` }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!isLoading && userList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <Users
                          size={32}
                          className="mx-auto text-slate-400 mb-3"
                        />
                        <p
                          className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}
                        >
                          Không tìm thấy người dùng nào
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    userList.map((user) => {
                      const isSelected = selectedUserId === user.id;
                      const isSelf =
                        String(currentAdmin?.id) === String(user.id) ||
                        currentAdmin?.username === user.username;
                      return (
                        <tr
                          key={user.id}
                          onClick={() =>
                            setSelectedUserId(isSelected ? null : user.id)
                          }
                          className={`border-b transition-colors cursor-pointer ${
                            isDark ? "border-white/5" : "border-slate-50"
                          } ${
                            isSelected
                              ? isDark
                                ? "bg-sky-500/10"
                                : "bg-sky-50"
                              : isDark
                                ? "hover:bg-white/5"
                                : "hover:bg-slate-50"
                          }`}
                        >
                          {/* User column */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={user.avatar}
                                username={user.username}
                                size={8}
                              />
                              <div className="min-w-0">
                                <p
                                  className={`font-semibold text-sm truncate max-w-[160px] ${isDark ? "text-white" : "text-slate-900"}`}
                                >
                                  {user.fullName || user.username}
                                  {isSelf && (
                                    <span className="ml-1.5 text-[10px] text-cyan-400 font-bold">
                                      (Bạn)
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-400 truncate max-w-[160px]">
                                  @{user.username} · {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Role */}
                          <td className="px-4 py-3">
                            <RoleBadge role={user.role} />
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <StatusBadge status={user.status} />
                          </td>
                          {/* Joined */}
                          <td
                            className={`px-4 py-3 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {formatDate(user.joinedDate)}
                          </td>
                          {/* Last login */}
                          <td
                            className={`px-4 py-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {user.lastLogin ? formatDate(user.lastLogin) : "—"}
                          </td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center justify-end gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Lock / Unlock */}
                              {!isSelf &&
                                (user.status === "locked" ? (
                                  <button
                                    onClick={() =>
                                      handleStatusAction(user, "active")
                                    }
                                    title="Mở khóa tài khoản"
                                    className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors cursor-pointer"
                                  >
                                    <Unlock size={14} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleStatusAction(user, "locked")
                                    }
                                    title="Khóa tài khoản"
                                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                                  >
                                    <Lock size={14} />
                                  </button>
                                ))}

                              {/* Change role */}
                              {!isSelf && (
                                <button
                                  onClick={() => handleOpenRoleDialog(user)}
                                  title="Phân quyền & Vai trò"
                                  className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/15 transition-colors cursor-pointer"
                                >
                                  <Crown size={14} />
                                </button>
                              )}

                              {/* Reset password */}
                              <button
                                onClick={() =>
                                  setResetPwdDialog({
                                    isOpen: true,
                                    user,
                                    isLoading: false,
                                  })
                                }
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
              <div
                className={`flex items-center justify-between px-4 py-3 border-t text-xs ${isDark ? "border-white/10 text-slate-400" : "border-slate-100 text-slate-500"}`}
              >
                <span>
                  Trang {page} / {pagination.totalPages} · {pagination.total}{" "}
                  người dùng
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const p =
                        Math.max(
                          1,
                          Math.min(pagination.totalPages - 4, page - 2),
                        ) + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            p === page
                              ? "bg-blue-500 text-white"
                              : isDark
                                ? "hover:bg-white/10 text-slate-300"
                                : "hover:bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
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
      </div>

      {/* DETAIL MODAL */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          user={userList.find((u) => u.id === selectedUserId)}
          isDark={isDark}
          onClose={() => setSelectedUserId(null)}
          onStatusAction={handleStatusAction}
          onRoleAction={handleOpenRoleDialog}
          onResetPassword={(targetUser) =>
            setResetPwdDialog({
              isOpen: true,
              user: targetUser,
              isLoading: false,
            })
          }
          currentAdmin={currentAdmin}
        />
      )}

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
        onClose={() =>
          setResetPwdDialog({ isOpen: false, user: null, isLoading: false })
        }
      />

      <RoleAssignmentDialog
        isOpen={roleDialog.isOpen}
        user={roleDialog.user}
        currentAdmin={currentAdmin}
        isLoading={roleDialog.isLoading}
        onConfirm={handleRoleSubmit}
        onClose={() =>
          setRoleDialog({ isOpen: false, user: null, isLoading: false })
        }
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
