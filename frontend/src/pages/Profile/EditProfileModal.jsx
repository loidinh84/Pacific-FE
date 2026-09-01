import { useState, useEffect } from "react";
import { X, Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateMyProfile, updateAvatar } from "../../services/userService";

export default function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
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

      setSuccessMessage("Cập nhật thông tin thành công!");
      if (onProfileUpdated) {
        onProfileUpdated(res.user);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Cập nhật hồ sơ lỗi:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || "Không thể cập nhật hồ sơ!";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#192348] border border-white/15 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white font-heading">Chỉnh sửa hồ sơ cá nhân</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="p-3 rounded-xl text-xs bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Avatar Edit Section */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-[#161f3e] border border-white/20 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.username?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <label
                htmlFor="avatar-file-input"
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-opacity text-white text-[10px] font-semibold gap-1"
              >
                <Camera size={18} />
                <span>Đổi ảnh</span>
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
              <p className="text-sm font-semibold text-white">Ảnh đại diện</p>
              <p className="text-xs text-white/50 mb-2">Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)</p>
              <label
                htmlFor="avatar-file-input"
                className="inline-block px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Tải ảnh mới
              </label>
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên đầy đủ"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          {/* Tiểu sử */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-white/70">Tiểu sử (Bio)</label>
              <span className="text-[11px] text-white/40">{bio.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Giới thiệu đôi nét về niềm đam mê đại dương của bạn..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Số điện thoại</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ví dụ: 0912345678"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Ngày sinh</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu thay đổi</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
