/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import {
  Home,
  Languages,
  MessageSquare,
  Users,
  Database,
  Shield,
  Upload,
  Plus,
  Trash2,
  Check,
  Sun,
  Moon,
  RefreshCw,
  Save,
  Globe,
  Lock,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Eye,
} from "lucide-react";
import * as Images from "../../../assets/Images";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { fetchAdminSettings, updateAdminSettings } from "../../../services/adminSettingsApi";
import CustomSelect from "../Dashboard/components/CustomSelect";
import { updateDocumentFavicon, updateDocumentMetaSEO } from "../../../utils/systemBranding";

const SOCIAL_PRESETS = [
  { name: "Facebook", placeholder: "https://facebook.com/pacific.ocean", color: "text-blue-400" },
  { name: "Instagram", placeholder: "https://instagram.com/pacific.ocean", color: "text-pink-400" },
  { name: "YouTube", placeholder: "https://youtube.com/@pacific.ocean", color: "text-red-400" },
  { name: "TikTok", placeholder: "https://tiktok.com/@pacific.ocean", color: "text-cyan-400" },
  { name: "X (Twitter)", placeholder: "https://x.com/pacific_ocean", color: "text-sky-400" },
  { name: "GitHub", placeholder: "https://github.com/pacific-ocean", color: "text-purple-400" },
  { name: "Zalo", placeholder: "https://zalo.me/pacific", color: "text-blue-300" },
  { name: "Khác", placeholder: "https://...", color: "text-slate-400" },
];

export default function SystemSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const logoInputRef = useRef(null);

  // Settings State Form
  const [formData, setFormData] = useState({
    general: {
      websiteName: "Pacific Ocean Portal",
      seoDescription: "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học",
      contactEmail: "admin@pacific.org",
      logoUrl: "",
      socialLinks: [
        { id: "1", platform: "Facebook", url: "https://facebook.com/pacific.ocean" },
        { id: "2", platform: "Instagram", url: "https://instagram.com/pacific.ocean" },
        { id: "3", platform: "YouTube", url: "https://youtube.com/@pacific.ocean" },
      ],
    },
    display: {
      defaultLanguage: "vi",
      enableAudioAutoPlay: false,
      enable3DViewer: true,
    },
    content: {
      autoModeration: true,
      filterProfanity: true,
      allowGuestComment: false,
      maxReportsToHide: 3,
    },
    users: {
      allowRegistration: true,
      requireEmailVerification: false,
    },
    api: {
      gbifApiKey: "gbif_sec_99182310231",
      syncFrequency: "daily",
    },
    security: {
      require2FA: true,
      sessionTimeoutMinutes: 60,
    },
  });

  // Fetch initial settings from backend API
  useEffect(() => {
    let isCancelled = false;

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAdminSettings();
        if (!isCancelled && res?.success && res.data) {
          setFormData((prev) => ({
            ...prev,
            general: { ...prev.general, ...(res.data.general || {}) },
            display: { ...prev.display, ...(res.data.display || {}) },
            content: { ...prev.content, ...(res.data.content || {}) },
            users: { ...prev.users, ...(res.data.users || {}) },
            api: { ...prev.api, ...(res.data.api || {}) },
            security: { ...prev.security, ...(res.data.security || {}) },
          }));
        }
      } catch (err) {
        console.warn("Không thể tải cấu hình từ backend, dùng mặc định:", err.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadSettings();

    return () => {
      isCancelled = true;
    };
  }, []);

  const settingsTabs = [
    { id: "general", label: "Thông tin chung", icon: Home },
    { id: "display", label: "Hiển thị & Ngôn ngữ", icon: Languages },
    { id: "content", label: "Nội dung & Bình luận", icon: MessageSquare },
    { id: "users", label: "Tài khoản người dùng", icon: Users },
    { id: "api", label: "API & Dữ liệu", icon: Database },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  // Social Links Handlers
  const handleAddSocialLink = () => {
    const newId = Date.now().toString();
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        socialLinks: [
          ...(prev.general.socialLinks || []),
          { id: newId, platform: "Facebook", url: "https://" },
        ],
      },
    }));
  };

  const handleRemoveSocialLink = (id) => {
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        socialLinks: prev.general.socialLinks.filter((item) => item.id !== id),
      },
    }));
  };

  const handleSocialChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        socialLinks: prev.general.socialLinks.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          // Gợi ý placeholder/URL khi chọn platform mới nếu url đang trống hoặc là https://
          if (field === "platform" && (!item.url || item.url === "https://")) {
            const foundPreset = SOCIAL_PRESETS.find((p) => p.name === value);
            if (foundPreset) updated.url = foundPreset.placeholder;
          }
          return updated;
        }),
      },
    }));
  };

  // Logo Handlers
  const handleLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, SVG, WebP)", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Kích thước file ảnh không được vượt quá 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateSection("general", "logoUrl", reader.result);
      updateDocumentFavicon(reader.result);
      showToast("Đã chọn logo mới và cập nhật favicon! Hãy nhấn 'Lưu thay đổi' để lưu vào hệ thống.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateSection("general", "logoUrl", "");
    updateDocumentFavicon(Images.Logo);
    if (logoInputRef.current) logoInputRef.current.value = "";
    showToast("Đã đặt lại về logo Pacific mặc định", "info");
  };

  // Reset Tab 1 Defaults Handler
  const handleResetGeneralDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      general: {
        websiteName: "Pacific Ocean Portal",
        seoDescription: "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học",
        contactEmail: "admin@pacific.org",
        logoUrl: "",
        socialLinks: [
          { id: "1", platform: "Facebook", url: "https://facebook.com/pacific.ocean" },
          { id: "2", platform: "Instagram", url: "https://instagram.com/pacific.ocean" },
          { id: "3", platform: "YouTube", url: "https://youtube.com/@pacific.ocean" },
        ],
      },
    }));
    if (logoInputRef.current) logoInputRef.current.value = "";
    showToast("Đã khôi phục các giá trị mặc định cho Thông tin chung", "info");
  };

  // Generic Update Handler
  const updateSection = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Save Settings to Backend API
  const handleSave = async () => {
    // Validate Tab 1: General
    if (!formData.general.websiteName?.trim()) {
      showToast("Tên website không được để trống", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.general.contactEmail?.trim() && !emailRegex.test(formData.general.contactEmail.trim())) {
      showToast("Email liên hệ hỗ trợ không đúng định dạng", "error");
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateAdminSettings(formData);
      if (res?.success) {
        setSaveSuccess(true);
        showToast("Đã lưu thiết lập hệ thống thành công!", "success");

        // Đồng bộ tức thì logo, favicon và tên website tới Navbar, Header & Title
        try {
          localStorage.setItem("pacific_system_settings", JSON.stringify(res.data));
          window.dispatchEvent(new CustomEvent("pacific_settings_update", { detail: res.data }));
          if (res.data?.general) {
            updateDocumentMetaSEO(res.data.general);
          }
        } catch (_) {}

        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        showToast(res?.error || "Không thể lưu thiết lập hệ thống", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || err.message || "Lỗi khi lưu thiết lập", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2 space-y-6">
      {/* ── 2-COLUMN SETTINGS LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT SIDEBAR: TABS MENU ── */}
        <div
          className={`lg:col-span-4 xl:col-span-3 rounded-2xl border p-4 space-y-3 transition-colors ${
            isDark ? "bg-[#111c38] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between px-2 mb-2">
            <h2
              className={`text-lg font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Thiết lập hệ thống
            </h2>
            {isLoading && <RefreshCw size={14} className="text-cyan-400 animate-spin" />}
          </div>

          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? isDark
                        ? "bg-[#29407c] text-white shadow-md shadow-blue-900/30 border border-cyan-400"
                        : "bg-blue-600 text-white shadow-sm border border-cyan-400"
                      : isDark
                      ? "text-white/70 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-cyan-300" : ""} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT CONTENT PANEL ── */}
        <div
          className={`lg:col-span-8 xl:col-span-9 rounded-2xl border p-6 md:p-8 space-y-8 transition-colors ${
            isDark ? "bg-[#111c38] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* TAB 1: THÔNG TIN CHUNG */}
          {activeTab === "general" && (
            <div className="space-y-7 animate-in fade-in duration-200">
              {/* Header Tab */}
              <div className="border-b pb-4 border-white/10">
                <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                  <span>Thông tin chung</span>
                  <Sparkles size={18} className="text-cyan-400" />
                </h1>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Cấu hình nhận diện thương hiệu, thẻ meta SEO và các kênh truyền thông chính thức của cổng thông tin
                </p>
              </div>

              {/* 1.1 Khối Thương hiệu & Biểu tượng Logo */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Globe size={14} />
                    <span>Thương hiệu & Biểu tượng Logo</span>
                  </h3>
                  <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Hiển thị trên toàn bộ Navbar & Tiêu đề trình duyệt
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Cột trái: Tên website & Mô tả SEO */}
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Tên website <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.general.websiteName}
                        onChange={(e) => updateSection("general", "websiteName", e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Pacific Ocean Portal"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Xuất hiện ở góc trên bên trái thanh điều hướng và thẻ tiêu đề trang web.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Mô tả SEO (Meta Description)
                        </label>
                        <span
                          className={`text-[11px] font-mono ${
                            formData.general.seoDescription.length >= 120 &&
                            formData.general.seoDescription.length <= 160
                              ? "text-emerald-400 font-bold"
                              : formData.general.seoDescription.length > 160
                              ? "text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {formData.general.seoDescription.length}/160 ký tự
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.general.seoDescription}
                        onChange={(e) => updateSection("general", "seoDescription", e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-colors resize-none leading-relaxed ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học..."
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Khuyến nghị từ 120 đến 160 ký tự để tối ưu hóa hiển thị khi tìm kiếm trên Google Search.
                      </p>
                    </div>
                  </div>

                  {/* Cột phải: Khu vực Tải lên & Xem trước Logo */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoFile}
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className={`w-full flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center ${
                        formData.general.logoUrl
                          ? isDark
                            ? "border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400"
                            : "border-cyan-400 bg-cyan-50/50 hover:border-cyan-500"
                          : isDark
                          ? "border-white/20 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.05]"
                          : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
                      }`}
                      title="Nhấn để chọn ảnh logo mới từ máy tính"
                    >
                      {/* Box xem trước Logo */}
                      <div className="relative w-20 h-20 rounded-2xl p-2.5 flex items-center justify-center bg-[#091124] border border-white/15 shadow-inner mb-3 group-hover:scale-105 transition-transform">
                        <img
                          src={formData.general.logoUrl || Images.Logo}
                          alt="Logo Preview"
                          className="w-full h-full object-contain drop-shadow"
                          onError={(e) => {
                            e.target.src = Images.Logo;
                          }}
                        />
                        {formData.general.logoUrl && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-sm">
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold block text-white group-hover:text-cyan-300 transition-colors">
                        {formData.general.logoUrl ? "Thay đổi biểu tượng" : "Tải lên biểu tượng Logo"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        PNG, SVG, JPG, WebP tối đa 2MB
                      </span>

                      {/* Trạng thái logo */}
                      <span
                        className={`inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          formData.general.logoUrl
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {formData.general.logoUrl ? (
                          <>
                            <CheckCircle2 size={10} />
                            <span>Logo tùy chỉnh</span>
                          </>
                        ) : (
                          <span>Logo Pacific mặc định</span>
                        )}
                      </span>
                    </div>

                    {/* Nút Xóa logo tùy chỉnh về mặc định nếu đang có logo tùy chỉnh */}
                    {formData.general.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="mt-2.5 text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={11} />
                        <span>Về lại logo mặc định</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1.2 Mô phỏng kết quả tìm kiếm Google (Google Search Snippet Preview) */}
                <div
                  className={`rounded-xl p-4 border transition-colors ${
                    isDark ? "bg-[#0b1329]/80 border-white/10" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Search size={12} className="text-cyan-400" />
                      <span>Xem trước trên Google Search</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                      Mô phỏng tự động
                    </span>
                  </div>

                  <div className="space-y-1 font-sans pl-1">
                    {/* URL row */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
                        <img
                          src={formData.general.logoUrl || Images.Logo}
                          alt="Favicon"
                          className="w-3 h-3 object-contain"
                        />
                      </div>
                      <span className="text-slate-300 font-medium">https://pacific.org</span>
                      <span className="text-slate-500">› portal › explore</span>
                    </div>

                    {/* Title row */}
                    <h4 className="text-sm md:text-base font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                      {formData.general.websiteName || "Pacific Ocean Portal"} | Tra cứu sinh vật biển Thái Bình Dương
                    </h4>

                    {/* Description snippet */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {formData.general.seoDescription ||
                        "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học với mô hình 3D xoay 360 độ và dữ liệu đa dạng sinh học đại dương."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 1.3 Khối Liên hệ & Mạng xã hội */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-cyan-400">
                      Liên hệ & Kênh truyền thông mạng xã hội
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Xuất hiện ở chân trang (Footer), trang liên hệ và thông báo hệ thống
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus size={14} />
                    <span>Thêm mạng xã hội</span>
                  </button>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Email liên hệ */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Email liên hệ hỗ trợ chính thức
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.general.contactEmail}
                        onChange={(e) => updateSection("general", "contactEmail", e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="admin@pacific.org"
                      />
                    </div>
                  </div>

                  {/* Danh sách các nền tảng mạng xã hội */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Liên kết mạng xã hội ({formData.general.socialLinks?.length || 0})
                    </label>

                    {formData.general.socialLinks?.length === 0 ? (
                      <div
                        className={`p-6 rounded-xl border border-dashed text-center text-xs ${
                          isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"
                        }`}
                      >
                        Chưa có liên kết mạng xã hội nào. Nhấn nút <strong>"Thêm mạng xã hội"</strong> ở trên để bổ sung.
                      </div>
                    ) : (
                      formData.general.socialLinks?.map((link, idx) => {
                        const preset = SOCIAL_PRESETS.find((p) => p.name === link.platform);
                        return (
                          <div
                            key={link.id || idx}
                            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl border transition-all ${
                              isDark ? "bg-[#0b1329]/60 border-white/10" : "bg-white border-slate-200"
                            }`}
                          >
                            {/* Chọn Nền tảng với CustomSelect đồng bộ */}
                            <CustomSelect
                              options={SOCIAL_PRESETS.map((p) => ({
                                value: p.name,
                                label: p.name,
                              }))}
                              value={link.platform}
                              onChange={(val) => handleSocialChange(link.id, "platform", val)}
                              isDark={isDark}
                              size="sm"
                              className="w-full sm:w-36 shrink-0"
                              buttonClassName="py-2 px-3 text-xs"
                            />

                            {/* Nhập URL liên kết */}
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => handleSocialChange(link.id, "url", e.target.value)}
                              className={`flex-1 px-3 py-2 rounded-lg text-xs border outline-none font-mono transition-colors ${
                                isDark
                                  ? "bg-transparent border-white/10 text-white focus:border-cyan-400"
                                  : "bg-transparent border-slate-200 text-slate-900 focus:border-blue-500"
                              }`}
                              placeholder={preset?.placeholder || "https://..."}
                            />

                            {/* Nút truy cập thử nếu có URL */}
                            {link.url && link.url.startsWith("http") && (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg transition-colors shrink-0 text-center ${
                                  isDark ? "hover:bg-white/10 text-cyan-400" : "hover:bg-slate-100 text-blue-600"
                                }`}
                                title="Mở thử liên kết trên tab mới"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}

                            {/* Nút xóa liên kết */}
                            <button
                              type="button"
                              onClick={() => handleRemoveSocialLink(link.id)}
                              className={`p-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                                isDark ? "hover:bg-white/10 text-rose-400" : "hover:bg-rose-50 text-rose-500"
                              }`}
                              title="Xóa liên kết này"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HIỂN THỊ & NGÔN NGỮ */}
          {activeTab === "display" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                Hiển thị & Ngôn ngữ
              </h1>

              {/* Theme Toggle */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold text-cyan-400">
                  Giao diện hệ thống
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (!isDark) toggleTheme();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? "bg-blue-600/30 border-cyan-400 text-white font-bold"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Moon size={18} />
                    <span>Chế độ tối (Dark Navy)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isDark) toggleTheme();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                      !isDark
                        ? "bg-blue-600 text-white font-bold shadow-md"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sun size={18} />
                    <span>Chế độ sáng (Light Clean)</span>
                  </button>
                </div>
              </div>

              {/* Ngôn ngữ mặc định */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold text-cyan-400">
                  Ngôn ngữ mặc định
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateSection("display", "defaultLanguage", "vi")}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                      formData.display.defaultLanguage === "vi"
                        ? "border-cyan-500/40 bg-cyan-500/10 font-bold"
                        : "border-white/10 bg-white/5 opacity-70"
                    }`}
                  >
                    <span className="text-lg">🇻🇳</span>
                    <div>
                      <p className="text-xs font-bold">Tiếng Việt</p>
                      <p className="text-[10px] text-slate-400">Mặc định hệ thống</p>
                    </div>
                  </button>

                  <button
                    onClick={() => updateSection("display", "defaultLanguage", "en")}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                      formData.display.defaultLanguage === "en"
                        ? "border-cyan-500/40 bg-cyan-500/10 font-bold"
                        : "border-white/10 bg-white/5 opacity-70"
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    <div>
                      <p className="text-xs font-bold">English</p>
                      <p className="text-[10px] text-slate-400">International</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tùy chọn 3D & Âm thanh */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold text-cyan-400">
                  Đa phương tiện tương tác
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold">Kích hoạt trình xem 3D sinh vật</h4>
                      <p className="text-xs text-slate-400">Cho phép người dùng tương tác với mô hình 3D xoay 360 độ</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.display.enable3DViewer}
                      onChange={(e) => updateSection("display", "enable3DViewer", e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold">Tự động phát âm thanh đại dương</h4>
                      <p className="text-xs text-slate-400">Phát âm thanh sinh cảnh biển khi vào trang chi tiết sinh vật</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.display.enableAudioAutoPlay}
                      onChange={(e) => updateSection("display", "enableAudioAutoPlay", e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NỘI DUNG & BÌNH LUẬN */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                Nội dung & Bình luận
              </h1>
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Kiểm duyệt tự động bằng AI</h4>
                    <p className="text-xs text-slate-400">Tự động gắn cờ các bình luận có chứa từ ngữ vi phạm tiêu chuẩn cộng đồng</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.content.autoModeration}
                    onChange={(e) => updateSection("content", "autoModeration", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Bộ lọc từ ngữ nhạy cảm & chửi thề</h4>
                    <p className="text-xs text-slate-400">Ẩn hoặc thay thế các từ ngữ thô tục bằng ký tự hoa thị</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.content.filterProfanity}
                    onChange={(e) => updateSection("content", "filterProfanity", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Ngưỡng báo cáo tự động ẩn bình luận</h4>
                    <p className="text-xs text-slate-400">Số lượt báo cáo từ người dùng để hệ thống tự động tạm ẩn bình luận</p>
                  </div>
                  <select
                    value={formData.content.maxReportsToHide}
                    onChange={(e) => updateSection("content", "maxReportsToHide", Number(e.target.value))}
                    className={`px-3 py-1.5 rounded-xl text-xs border outline-none ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value={1}>1 báo cáo</option>
                    <option value={3}>3 báo cáo (khuyên dùng)</option>
                    <option value={5}>5 báo cáo</option>
                    <option value={10}>10 báo cáo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TÀI KHOẢN NGƯỜI DÙNG */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                Tài khoản người dùng
              </h1>
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Mở đăng ký thành viên mới</h4>
                    <p className="text-xs text-slate-400">Cho phép người dùng bên ngoài tự tạo tài khoản tham gia portal</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.users.allowRegistration}
                    onChange={(e) => updateSection("users", "allowRegistration", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Yêu cầu xác thực email khi kích hoạt</h4>
                    <p className="text-xs text-slate-400">Gửi email xác thực liên kết trước khi cho phép đăng nhập</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.users.requireEmailVerification}
                    onChange={(e) => updateSection("users", "requireEmailVerification", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: API & DỮ LIỆU */}
          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                API & Dữ liệu
              </h1>
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <label className="text-xs text-slate-400 block mb-1">GBIF Marine API Key</label>
                  <input
                    type="password"
                    value={formData.api.gbifApiKey}
                    onChange={(e) => updateSection("api", "gbifApiKey", e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none font-mono ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tần suất đồng bộ dữ liệu tự động</label>
                  <select
                    value={formData.api.syncFrequency}
                    onChange={(e) => updateSection("api", "syncFrequency", e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="daily">Hàng ngày (00:00 UTC)</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="manual">Thủ công</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BẢO MẬT */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                Bảo mật hệ thống
              </h1>
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Xác thực hai yếu tố (2FA) cho quản trị viên</h4>
                    <p className="text-xs text-slate-400">Yêu cầu mã OTP hoặc xác thực khi đăng nhập vào trang quản trị</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.security.require2FA}
                    onChange={(e) => updateSection("security", "require2FA", e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Thời gian hết hạn phiên đăng nhập (phút)</h4>
                    <p className="text-xs text-slate-400">Tự động đăng xuất sau khoảng thời gian không có hoạt động</p>
                  </div>
                  <select
                    value={formData.security.sessionTimeoutMinutes}
                    onChange={(e) => updateSection("security", "sessionTimeoutMinutes", Number(e.target.value))}
                    className={`px-3 py-1.5 rounded-xl text-xs border outline-none ${
                      isDark ? "bg-[#0b1329] border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value={30}>30 phút</option>
                    <option value={60}>60 phút (1 giờ)</option>
                    <option value={120}>120 phút (2 giờ)</option>
                    <option value={1440}>24 giờ</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── BOTTOM ACTIONS: LƯU THAY ĐỔI ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div>
              {activeTab === "general" && (
                <button
                  type="button"
                  onClick={handleResetGeneralDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại thông tin thương hiệu về mặc định"
                >
                  <RotateCcw size={13} />
                  <span>Khôi phục mặc định tab này</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
                  <Check size={15} />
                  Đã lưu thay đổi thành công!
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
