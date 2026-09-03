import { useState, useEffect } from "react";
import { X, Camera, Loader2, AlertCircle, CheckCircle2, Lock, User } from "lucide-react";
import { updateAdminProfile, updateAdminAvatar } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function EditAdminProfileModal({
  isOpen,
  onClose,
  admin,
  onAdminUpdated,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarBase64, setAvatarBase64] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (admin && isOpen) {
      setUsername(admin.username || "");
      setFullName(admin.fullName || "");
      setBio(admin.bio || "");
      setEmail(admin.email || "");
      setPhoneNumber(admin.phoneNumber || "");
      setDateOfBirth(admin.dateOfBirth || "");
      setAvatarPreview(admin.avatar || "");
      setAvatarBase64("");
      setCurrentPassword("");
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [admin, isOpen]);

  if (!isOpen) return null;

  const isEmailChanged = admin && email.trim().toLowerCase() !== admin.email.toLowerCase();

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isEn
          ? "Avatar file size must not exceed 5MB"
          : "Kích thước ảnh đại diện không được vượt quá 5MB"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatarBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate Username
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      setErrorMessage(
        isEn
          ? "Username must be between 3 and 30 characters"
          : "Tên đăng nhập phải từ 3 đến 30 ký tự"
      );
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(cleanUsername)) {
      setErrorMessage(
        isEn
          ? "Username can only contain letters, numbers, and underscores (_)"
          : "Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới (_)"
      );
      return;
    }

    // Validate Full Name
    if (fullName.trim().length > 0 && (fullName.trim().length < 2 || fullName.trim().length > 50)) {
      setErrorMessage(
        isEn
          ? "Full name must be between 2 and 50 characters"
          : "Họ và tên phải từ 2 đến 50 ký tự"
      );
      return;
    }

    // Validate Phone
    if (phoneNumber.trim().length > 0) {
      const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
      if (!phoneRegex.test(phoneNumber.trim())) {
        setErrorMessage(
          isEn
            ? "Invalid phone number format (e.g. 0912345678 or +84912345678)"
            : "Số điện thoại không đúng định dạng (Ví dụ: 0912345678 hoặc +84912345678)"
        );
        return;
      }
    }

    // Validate Email change
    if (isEmailChanged && !currentPassword) {
      setErrorMessage(
        isEn
          ? "Please enter your current password to confirm email change"
          : "Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi địa chỉ email"
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cập nhật Avatar nếu có đổi ảnh mới
      let newAvatarUrl = admin.avatar;
      if (avatarBase64) {
        const avatarRes = await updateAdminAvatar(avatarBase64);
        if (avatarRes.avatarUrl) {
          newAvatarUrl = avatarRes.avatarUrl;
        }
      }

      // 2. Cập nhật thông tin profile
      const updateData = {
        username: cleanUsername,
        fullName: fullName.trim(),
        bio: bio.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: dateOfBirth || null,
      };

      if (isEmailChanged) {
        updateData.email = email.trim().toLowerCase();
        updateData.currentPassword = currentPassword;
      }

      const res = await updateAdminProfile(updateData);

      // Cập nhật lại localStorage để header đồng bộ tức thì
      const savedUser = JSON.parse(localStorage.getItem("pacific_user") || "{}");
      const updatedSavedUser = {
        ...savedUser,
        username: res.admin.username,
        full_name: res.admin.fullName,
        email: res.admin.email,
        avatar_url: newAvatarUrl || res.admin.avatar,
      };
      localStorage.setItem("pacific_user", JSON.stringify(updatedSavedUser));
      window.dispatchEvent(new Event("pacific_auth_change"));

      setSuccessMessage(
        isEn ? "Administrator profile updated successfully!" : "Cập nhật hồ sơ quản trị viên thành công!"
      );

      if (onAdminUpdated) {
        onAdminUpdated({ ...res.admin, avatar: newAvatarUrl || res.admin.avatar });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Cập nhật hồ sơ Admin lỗi:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (isEn ? "Could not update profile!" : "Không thể cập nhật hồ sơ!");
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/30 animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-xl rounded-3xl border shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(6,182,212,0.18)] overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? "bg-[#142247]/95 border-cyan-400/40 text-white" : "bg-white border-slate-300 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-white/10 bg-white/[0.04] shrink-0">
          <div>
            <h2 className="text-base sm:text-xl font-bold font-heading tracking-tight text-white">
              {isEn ? "Edit Administrator Profile" : "Chỉnh sửa hồ sơ quản trị"}
            </h2>
            <p className="text-xs text-cyan-200/70 mt-0.5 font-medium">
              {isEn
                ? "Update identity, username and contact information"
                : "Cập nhật thông tin nhận diện, tên đăng nhập và liên hệ"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-500/20 text-rose-200 text-xs font-semibold border-b border-rose-500/30 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success notification */}
        {successMessage && (
          <div className="px-6 py-2.5 bg-emerald-500/20 text-emerald-200 text-xs font-semibold border-b border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Avatar Upload */}
          <div className="flex items-center gap-5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-[#0e1732] border border-cyan-400/40 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-inner">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Admin" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-cyan-400">{username?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
              <label
                htmlFor="admin-avatar-file"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-opacity text-white text-[10px] font-semibold gap-1"
              >
                <Camera size={18} />
                <span>{isEn ? "Change" : "Đổi ảnh"}</span>
              </label>
              <input
                id="admin-avatar-file"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">{isEn ? "Admin Avatar" : "Ảnh đại diện Quản trị"}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "JPG, PNG, WEBP formats (max. 5MB)" : "Định dạng JPG, PNG, WEBP (tối đa 5MB)"}
              </p>
              <label
                htmlFor="admin-avatar-file"
                className="inline-block mt-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
              >
                {isEn ? "Upload new photo" : "Tải ảnh mới"}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {isEn ? "Username" : "Tên đăng nhập"} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono font-bold">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  maxLength={30}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="vuthaitai2000"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {isEn ? "Full Name" : "Họ và tên"}
              </label>
              <input
                type="text"
                value={fullName}
                maxLength={50}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isEn ? "Enter full name" : "Nhập họ và tên đầy đủ"}
                className="w-full px-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              {isEn ? "Email Address" : "Địa chỉ Email"} <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pacific.org"
              className="w-full px-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all"
            />
          </div>

          {/* Mật khẩu xác nhận nếu đổi Email */}
          {isEmailChanged && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                <Lock size={13} />
                <span>
                  {isEn
                    ? "Enter current password to confirm Email change"
                    : "Nhập mật khẩu hiện tại để xác nhận thay đổi Email"}
                </span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={isEn ? "Enter your current password" : "Nhập mật khẩu hiện tại của bạn"}
                className="w-full px-4 py-2.5 bg-[#0e1732] border border-amber-400/40 focus:border-amber-400 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* Tiểu sử (Bio) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                {isEn ? "Bio & Notes" : "Tiểu sử & Chức vụ"}
              </label>
              <span className="text-[11px] text-slate-400">{bio.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                isEn
                  ? "Describe your administrative role or marine biology background..."
                  : "Mô tả vai trò quản trị hoặc chuyên môn sinh học biển của bạn..."
              }
              className="w-full px-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {isEn ? "Phone Number" : "Số điện thoại"}
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={isEn ? "e.g. 0912345678" : "VD: 0912345678"}
                className="w-full px-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all"
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {isEn ? "Date of Birth" : "Ngày sinh"}
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0e1732] border border-white/20 focus:border-cyan-400 focus:bg-[#121c3d] rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
            >
              {isEn ? "Cancel" : "Hủy"}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_4px_14px_rgba(37,99,235,0.4)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              <span>
                {isLoading
                  ? isEn
                    ? "Saving..."
                    : "Đang lưu..."
                  : isEn
                  ? "Save Changes"
                  : "Lưu thay đổi"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
