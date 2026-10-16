import { Link } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import CustomSelect from "../../Dashboard/components/CustomSelect";
import {
  TWO_FACTOR_METHOD_OPTIONS,
  ADMIN_PASSWORD_EXPIRY_OPTIONS,
  SESSION_TIMEOUT_OPTIONS,
} from "../settingsConstants";

export default function SecurityTab({ formData, updateSection, isDark }) {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header Tab */}
      <div className="border-b pb-4 border-white/10">
        <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
          <span>Bảo mật hệ thống</span>
        </h1>
        <p
          className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Bảo vệ tài khoản quản trị viên, kiểm soát phiên đăng nhập và thiết lập
          chính sách an toàn thông tin
        </p>
      </div>

      {/* 6.1 Khối Xác thực quản trị & Kiểm soát truy cập */}
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
            <span>Xác thực quản trị & Kiểm soát truy cập</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Tăng cường bảo vệ tài khoản quản trị trước các nguy cơ xâm nhập trái
            phép
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Toggle Cha: Bắt buộc xác thực hai yếu tố */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">
                    Bắt buộc xác thực hai yếu tố cho quản trị viên
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                    Bảo mật cao
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Yêu cầu bước xác nhận thứ hai ngoài mật khẩu khi đăng nhập vào
                  bảng điều khiển quản trị.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.security.require2FA}
              onClick={() =>
                updateSection(
                  "security",
                  "require2FA",
                  !formData.security.require2FA,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.security.require2FA
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.security.require2FA
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {formData.security.require2FA && (
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <KeyRound size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">
                    Phương thức xác thực hai yếu tố
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Lựa chọn phương thức gửi hoặc sinh mã OTP xác nhận đăng
                    nhập.
                  </p>
                </div>
              </div>

              <CustomSelect
                options={TWO_FACTOR_METHOD_OPTIONS}
                value={formData.security.twoFactorMethod || "authenticator"}
                onChange={(val) =>
                  updateSection("security", "twoFactorMethod", val)
                }
                isDark={isDark}
                size="sm"
                className="w-full sm:w-80 shrink-0"
              />
            </div>
          )}

          {/* Chu kỳ bắt buộc thay đổi mật khẩu */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Chu kỳ bắt buộc thay đổi mật khẩu quản trị
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Yêu cầu đổi mật khẩu định kỳ để ngăn ngừa lộ lọt thông tin tài
                  khoản quản trị.
                </p>
              </div>
            </div>

            <CustomSelect
              options={ADMIN_PASSWORD_EXPIRY_OPTIONS}
              value={formData.security.adminPasswordExpiryDays ?? 90}
              onChange={(val) =>
                updateSection(
                  "security",
                  "adminPasswordExpiryDays",
                  Number(val),
                )
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-80 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* 6.2 Khối Quản lý phiên làm việc & Nhật ký an toàn */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <ShieldAlert size={14} />
            <span>Quản lý phiên làm việc & Nhật ký an toàn</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Kiểm soát thời gian tồn tại của phiên đăng nhập và ngăn chặn hành vi
            bất thường
          </p>
        </div>

        <div className="space-y-4 divide-y divide-white/10 pt-1">
          {/* Thời gian tự động hết hạn phiên làm việc */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Thời gian tự động kết thúc phiên làm việc
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tự động đăng xuất tài khoản khi không có bất kỳ thao tác nào
                  sau khoảng thời gian này.
                </p>
              </div>
            </div>

            <CustomSelect
              options={SESSION_TIMEOUT_OPTIONS}
              value={formData.security.sessionTimeoutMinutes ?? 60}
              onChange={(val) =>
                updateSection(
                  "security",
                  "sessionTimeoutMinutes",
                  Number(val),
                )
              }
              isDark={isDark}
              size="sm"
              className="w-full sm:w-80 shrink-0"
            />
          </div>

          {/* Giới hạn một phiên đăng nhập duy nhất */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <Lock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Giới hạn một phiên đăng nhập duy nhất
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tự động đăng xuất phiên làm việc cũ khi phát hiện tài khoản
                  đăng nhập trên một thiết bị mới.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.security.singleSessionPerUser}
              onClick={() =>
                updateSection(
                  "security",
                  "singleSessionPerUser",
                  !formData.security.singleSessionPerUser,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.security.singleSessionPerUser
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.security.singleSessionPerUser
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Ghi nhật ký kiểm toán cho các thao tác quan trọng */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Ghi nhật ký kiểm toán cho thao tác quan trọng
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Lưu trữ lịch sử khi có thao tác xóa loài sinh vật, đổi phân
                  quyền hoặc chỉnh sửa thiết lập hệ thống.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.security.logSensitiveActions}
              onClick={() =>
                updateSection(
                  "security",
                  "logSensitiveActions",
                  !formData.security.logSensitiveActions,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.security.logSensitiveActions
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.security.logSensitiveActions
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Chặn truy cập qua mạng ẩn danh đáng ngờ */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Chặn truy cập qua mạng ẩn danh đáng ngờ
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tự động từ chối yêu cầu từ các mạng Tor hoặc máy chủ proxy
                  không xác thực để phòng tránh phá hoại.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.security.blockTorAndProxies}
              onClick={() =>
                updateSection(
                  "security",
                  "blockTorAndProxies",
                  !formData.security.blockTorAndProxies,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.security.blockTorAndProxies
                  ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                  : isDark
                    ? "bg-white/15"
                    : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  formData.security.blockTorAndProxies
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6.3 Khối Trạng thái an toàn & Tiêu chuẩn bảo mật kết nối */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>Trạng thái an toàn & Tiêu chuẩn bảo mật kết nối</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Tổng hợp các cơ chế bảo vệ hạ tầng và mã hóa kết nối đang hoạt động
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark
                ? "bg-[#0f1933] border-white/10"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Mã hóa HTTPS / TLS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                Hoạt động
              </span>
            </div>
            <p
              className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Chứng chỉ SSL bảo vệ mã hóa đầu cuối 256-bit trên toàn bộ các tuyến
              đường
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark
                ? "bg-[#0f1933] border-white/10"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Chính sách CORS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                Nghiêm ngặt
              </span>
            </div>
            <p
              className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Chỉ chấp nhận các yêu cầu truy cập từ miền ứng dụng chính thức và IP
              cho phép
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isDark
                ? "bg-[#0f1933] border-white/10"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">
                Giới hạn tần suất (Rate Limit)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
                Kích hoạt
              </span>
            </div>
            <p
              className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Tối đa 120 yêu cầu mỗi phút nhằm chống nghẽn mạng và tấn công dò
              quét tự động
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold">
              Tra cứu nhật ký kiểm toán hệ thống
            </h4>
            <p
              className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Xem toàn bộ lịch sử đăng nhập, thay đổi phân quyền và thao tác quản
              trị viên gần đây.
            </p>
          </div>

          <Link
            to="/admin/profile?tab=activity"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
          >
            <span>Mở nhật ký hoạt động</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
