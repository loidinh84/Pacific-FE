/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { fetchAdminSettings, updateAdminSettings } from "../../../services/adminSettingsApi";

export default function SystemSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State Form
  const [formData, setFormData] = useState({
    general: {
      websiteName: "Pacific Ocean Portal",
      seoDescription: "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học",
      contactEmail: "admin@pacific.org",
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
          { id: newId, platform: "Mạng xã hội", url: "https://" },
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
        socialLinks: prev.general.socialLinks.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
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
    try {
      setIsSaving(true);
      const res = await updateAdminSettings(formData);
      if (res?.success) {
        setSaveSuccess(true);
        showToast("Đã lưu thiết lập hệ thống thành công!", "success");
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
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading">
                Thông tin chung
              </h1>

              {/* Thương hiệu */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Thương hiệu & Nhận diện
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Tên website</label>
                      <input
                        type="text"
                        value={formData.general.websiteName}
                        onChange={(e) => updateSection("general", "websiteName", e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Pacific Ocean Portal"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Mô tả SEO</label>
                      <textarea
                        rows={2}
                        value={formData.general.seoDescription}
                        onChange={(e) => updateSection("general", "seoDescription", e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors resize-none ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Mô tả SEO công cụ tìm kiếm..."
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition-colors text-center bg-white/[0.02]">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-xs font-bold block">Biểu tượng & Logo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG / SVG tối đa 2MB</span>
                  </div>
                </div>
              </div>

              {/* Liên hệ & Mạng xã hội */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Liên hệ & Mạng xã hội
                  </h3>
                  <button
                    onClick={handleAddSocialLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Thêm mạng xã hội</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email liên hệ hỗ trợ</label>
                    <input
                      type="email"
                      value={formData.general.contactEmail}
                      onChange={(e) => updateSection("general", "contactEmail", e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                        isDark
                          ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                      placeholder="admin@pacific.org"
                    />
                  </div>

                  {formData.general.socialLinks?.map((link) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => handleSocialChange(link.id, "platform", e.target.value)}
                        className={`w-32 px-3 py-2 rounded-xl text-xs border outline-none transition-colors shrink-0 ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Nền tảng"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleSocialChange(link.id, "url", e.target.value)}
                        className={`flex-1 px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="https://"
                      />
                      <button
                        onClick={() => handleRemoveSocialLink(link.id)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isDark ? "hover:bg-white/10 text-rose-400" : "hover:bg-rose-50 text-rose-500"
                        }`}
                        title="Xóa liên kết"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
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
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
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
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
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
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
