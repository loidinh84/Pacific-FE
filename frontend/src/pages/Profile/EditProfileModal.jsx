import { useState, useEffect } from "react";
import { X, Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateMyProfile, updateAvatar } from "../../services/userService";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeMessage } from "../../utils/errorTranslator";

export default function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setBio(user.bio || "");
      setPhoneNumber(user.phoneNumber || "");
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
      setAvatarUrl(user.avatar || "");
      setAvatarPreview(user.avatar || "");
    }
    setErrorMessage("");
    setSuccessMessage("");
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatarUrl(reader.result); // Base64 data url for preview and save
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Form Validation
    if (fullName.trim().length > 0 && (fullName.trim().length < 2 || fullName.trim().length > 50)) {
      setErrorMessage("Họ và tên phải từ 2 đến 50 ký tự");
      return;
    }

    if (phoneNumber.trim().length > 0) {
      const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
      if (!phoneRegex.test(phoneNumber.trim())) {
        setErrorMessage("Số điện thoại không đúng định dạng (Ví dụ: 0912345678 hoặc +84912345678)");
        return;
      }
    }

    if (dateOfBirth) {
      const dobDate = new Date(dateOfBirth);
      const ageYears = (Date.now() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (ageYears < 10) {
        setErrorMessage("Tuổi phải từ 10 tuổi trở lên");
        return;
      }
    }

    setIsLoading(true);

    try {
      const updateData = {
        fullName: fullName.trim(),
        bio: bio.trim(),
        phoneNumber: phoneNumber.trim(),
        dateOfBirth: dateOfBirth || null,
        avatar: avatarUrl,
      };

      const res = await updateMyProfile(updateData);

      // Cập nhật lại thông tin trong localStorage để Navbar đồng bộ
      const savedUser = JSON.parse(localStorage.getItem("pacific_user") || "{}");
      const newSavedUser = {
        ...savedUser,
        full_name: res.user.fullName,
        avatar_url: res.user.avatar,
      };
      localStorage.setItem("pacific_user", JSON.stringify(newSavedUser));
      window.dispatchEvent(new Event("pacific_auth_change"));

      setSuccessMessage(
        isEn ? "Profile updated successfully!" : "Cập nhật thông tin thành công!"
      );
      if (onProfileUpdated) {
        onProfileUpdated(res.user);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Cập nhật hồ sơ lỗi:", err);
      const msg = localizeMessage(
        err,
        language,
        isEn ? "Unable to update profile!" : "Không thể cập nhật hồ sơ!"
      );
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg liquid-glass-strong border border-[#0f172a]/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0f172a]/10 bg-white/[0.04]">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] font-heading tracking-tight">
              {t("profile.editModalTitle", isEn ? "Edit Profile Information" : "Chỉnh sửa hồ sơ cá nhân")}
            </h2>
            <p className="text-xs text-[#0284c7] mt-0.5 font-medium">
              {isEn ? "Update your personal account details" : "Cập nhật thông tin tài khoản của bạn"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#0f172a]/10 liquid-glass-subtle hover:bg-white/90 text-[#0f172a] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="p-3 rounded-xl text-xs bg-rose-600/10 border border-rose-500/30 text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-700" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl text-xs bg-emerald-600/10 border border-emerald-500/30 text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Avatar Edit Section */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl liquid-glass-strong border border-sky-600/25 flex items-center justify-center text-[#0f172a] text-2xl font-bold overflow-hidden shadow-sm">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.username?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <label
                htmlFor="avatar-file-input"
                className="absolute inset-0 liquid-glass-strong opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-opacity text-[#0f172a] text-[10px] font-semibold gap-1"
              >
                <Camera size={18} />
                <span>{isEn ? "Change" : "Đổi ảnh"}</span>
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0f172a]">{isEn ? "Profile Avatar" : "Ảnh đại diện"}</p>
              <p className="text-xs text-[#475569] mb-2">
                {isEn ? "Supports JPG, PNG, WEBP (max 5MB)" : "Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)"}
              </p>
              <label
                htmlFor="avatar-file-input"
                className="inline-block px-3 py-1.5 liquid-glass-subtle hover:bg-white/90 border border-[#0f172a]/10 rounded-xl text-xs font-semibold text-[#0f172a] transition-all cursor-pointer"
              >
                {isEn ? "Upload Photo" : "Tải ảnh mới"}
              </label>
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              {isEn ? "Full Name" : "Họ và tên"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isEn ? "Enter your full name" : "Nhập họ và tên đầy đủ"}
              className="w-full px-4 py-2.5 liquid-input rounded-xl text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none transition-all"
            />
          </div>

          {/* Tiểu sử */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                {isEn ? "Biography (Bio)" : "Tiểu sử (Bio)"}
              </label>
              <span className="text-[11px] text-[#475569]">{bio.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                isEn
                  ? "Tell us about your passion for ocean biodiversity..."
                  : "Giới thiệu đôi nét về niềm đam mê đại dương của bạn..."
              }
              className="w-full px-4 py-2.5 liquid-input rounded-xl text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              {isEn ? "Phone Number" : "Số điện thoại"}
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={isEn ? "E.g: +84912345678" : "Ví dụ: 0912345678"}
              className="w-full px-4 py-2.5 liquid-input rounded-xl text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none transition-all"
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              {isEn ? "Date of Birth" : "Ngày sinh"}
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2.5 liquid-input rounded-xl text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0f172a]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#334155] hover:text-[#0f172a] hover:bg-white/80 transition-all cursor-pointer"
            >
              {t("profile.btnCancel", isEn ? "Cancel" : "Hủy")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 shadow-sm active:translate-y-0.5 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isEn ? "Saving..." : "Đang lưu..."}</span>
                </>
              ) : (
                <span>{t("profile.btnSave", isEn ? "Save Changes" : "Lưu thay đổi")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
