import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  UserCheck,
  AlertCircle,
  Lock,
  KeyRound,
  Shield,
  Clock,
  Globe,
  Users,
  ExternalLink,
} from "lucide-react";
import CustomSelect from "../../Dashboard/components/CustomSelect";
import {
  MIN_PASSWORD_OPTIONS,
  MAX_LOGIN_ATTEMPTS_OPTIONS,
} from "../settingsConstants";

export default function UsersTab({ formData, updateSection, isDark }) {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header Tab */}
      <div className="border-b pb-4 border-white/10">
        <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
          <span>Tài khoản người dùng</span>
        </h1>
        <p
          className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Chính sách đăng ký thành viên mới, tiêu chuẩn mật khẩu an toàn và phân
          quyền ban đầu
        </p>
      </div>

      {/* 4.1 Khối Chính sách đăng ký thành viên mới */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <UserPlus size={14} />
            <span>Chính sách đăng ký thành viên mới</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Quản lý luồng tiếp nhận người dùng mới tham gia vào cổng thông tin
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Toggle Cha: Mở cổng đăng ký tài khoản mới */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <UserPlus size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Mở cổng đăng ký tài khoản mới
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                    Công khai
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Cho phép khách truy cập tự do tạo tài khoản thành viên trên
                  cổng thông tin.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.users.allowRegistration}
              onClick={() =>
                updateSection(
                  "users",
                  "allowRegistration",
                  !formData.users.allowRegistration,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.users.allowRegistration
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.users.allowRegistration
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {formData.users.allowRegistration ? (
            <>
              {/* Toggle Con 1: Yêu cầu xác thực email */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      Bắt buộc xác thực địa chỉ email
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Gửi liên kết kích hoạt đến hộp thư trước khi người dùng
                      được phép đăng nhập chính thức.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.users.requireEmailVerification}
                  onClick={() =>
                    updateSection(
                      "users",
                      "requireEmailVerification",
                      !formData.users.requireEmailVerification,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.users.requireEmailVerification
                      ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                      : isDark
                        ? "bg-white/15"
                        : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.users.requireEmailVerification
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Con 2: Phê duyệt thủ công trước khi kích hoạt */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      Phê duyệt thủ công trước khi kích hoạt
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Tài khoản mới sẽ ở trạng thái chờ duyệt và chỉ kích hoạt
                      khi quản trị viên phê duyệt.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.users.requireApprovalForNewUsers}
                  onClick={() =>
                    updateSection(
                      "users",
                      "requireApprovalForNewUsers",
                      !formData.users.requireApprovalForNewUsers,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    formData.users.requireApprovalForNewUsers
                      ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                      : isDark
                        ? "bg-white/15"
                        : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      formData.users.requireApprovalForNewUsers
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </>
          ) : (
            <div
              className={`pt-4 p-4 rounded-xl border flex items-start gap-3 ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <AlertCircle
                size={18}
                className="shrink-0 mt-0.5 text-amber-400"
              />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold">
                  Cổng đăng ký người dùng hiện đang đóng
                </p>
                <p className="opacity-90 mt-0.5">
                  Khách truy cập sẽ không thể tự đăng ký tài khoản. Quản trị
                  viên vẫn có thể tạo và cấp tài khoản trực tiếp trong trang quản
                  lý thành viên.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4.2 Khối Quy chuẩn mật khẩu & Bảo mật đăng nhập */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Lock size={14} />
            <span>Quy chuẩn mật khẩu & Bảo mật đăng nhập</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Bảo vệ an toàn tài khoản người dùng và ngăn chặn tấn công tự động
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Độ dài mật khẩu tối thiểu */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <KeyRound size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Độ dài mật khẩu tối thiểu
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Số lượng ký tự tối thiểu khi thành viên đăng ký mới hoặc thay
                  đổi mật khẩu.
                </p>
              </div>
            </div>

            <CustomSelect
              options={MIN_PASSWORD_OPTIONS}
              value={formData.users.minPasswordLength ?? 8}
              onChange={(val) =>
                updateSection("users", "minPasswordLength", Number(val))
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-72 shrink-0"
            />
          </div>

          {/* Toggle Yêu cầu chữ hoa hoặc ký tự đặc biệt */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Shield size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Yêu cầu mật khẩu phức tạp
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Bắt buộc mật khẩu phải chứa ít nhất một chữ in hoa hoặc một
                  ký tự đặc biệt.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.users.requireSpecialChar}
              onClick={() =>
                updateSection(
                  "users",
                  "requireSpecialChar",
                  !formData.users.requireSpecialChar,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.users.requireSpecialChar
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.users.requireSpecialChar
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Giới hạn số lần đăng nhập sai */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Giới hạn số lần đăng nhập sai liên tiếp
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tạm thời khóa phiên đăng nhập sau nhiều lần nhập sai mật khẩu
                  để ngăn chặn dò mật khẩu tự động.
                </p>
              </div>
            </div>

            <CustomSelect
              options={MAX_LOGIN_ATTEMPTS_OPTIONS}
              value={formData.users.maxLoginAttempts ?? 5}
              onChange={(val) =>
                updateSection("users", "maxLoginAttempts", Number(val))
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-72 shrink-0"
            />
          </div>

          {/* Toggle Cho phép đăng nhập qua mạng xã hội */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <Globe size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Cho phép đăng nhập nhanh qua tài khoản xã hội
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Hỗ trợ thành viên liên kết và đăng nhập nhanh bằng tài khoản
                  Google hoặc GitHub.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.users.allowSocialLogin}
              onClick={() =>
                updateSection(
                  "users",
                  "allowSocialLogin",
                  !formData.users.allowSocialLogin,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.users.allowSocialLogin
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.users.allowSocialLogin
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4.3 Khối Điều hướng quản lý thành viên */}
      <div
        className={`rounded-2xl border p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>Quản lý danh sách thành viên & Phân quyền</span>
            </h3>
            <p
              className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Xem danh sách toàn bộ người dùng, thay đổi quyền hạn chi tiết hoặc
              khóa/mở khóa tài khoản thành viên.
            </p>
          </div>
        </div>

        <Link
          to="/admin/users"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
        >
          <span>Mở danh sách người dùng</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
