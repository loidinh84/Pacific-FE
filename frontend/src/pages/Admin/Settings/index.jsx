import { useState } from "react";
import {
  Home,
  Languages,
  MessageSquare,
  Users,
  Database,
  Shield,
  Upload,
  Plus,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function SystemSettings() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    websiteName: "Pacific Ocean Portal",
    seoDescription: "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học",
    contactEmail: "admin@pacific.org",
    socialLinks: [
      { id: "1", platform: "Facebook", url: "https://facebook.com/pacific.ocean" },
      { id: "2", platform: "Instagram", url: "https://instagram.com/pacific.ocean" },
    ],
  });

  const [displayForm, setDisplayForm] = useState({
    defaultLanguage: "vi",
    enableAudioAutoPlay: false,
    enable3DViewer: true,
  });

  const settingsTabs = [
    { id: "general", label: "Thông tin chung", icon: Home },
    { id: "display", label: "Hiển thị & Ngôn ngữ", icon: Languages },
    { id: "content", label: "Nội dung & Bình luận", icon: MessageSquare },
    { id: "users", label: "Tài khoản người dùng", icon: Users },
    { id: "api", label: "API & Dữ liệu", icon: Database },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  const handleAddSocialLink = () => {
    const newId = Date.now().toString();
    setGeneralForm((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: newId, platform: "Mạng xã hội", url: "https://" },
      ],
    }));
  };

  const handleRemoveSocialLink = (id) => {
    setGeneralForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((item) => item.id !== id),
    }));
  };

  const handleSocialChange = (id, field, value) => {
    setGeneralForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2">
      {/* ── 2-COLUMN SETTINGS LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT SIDEBAR: TABS MENU ── */}
        <div
          className={`lg:col-span-4 xl:col-span-3 rounded-2xl border p-4 space-y-3 transition-colors ${
            isDark
              ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 shadow-sm"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <h2
            className={`text-xl font-bold tracking-wide px-2 mb-2 ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Thiết lập hệ thống
          </h2>

          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? isDark
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm border border-cyan-400/40"
                        : "bg-blue-600 text-white shadow-sm border border-cyan-400"
                      : isDark
                      ? "text-slate-200 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-cyan-300"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT CONTENT PANEL ── */}
        <div
          className={`lg:col-span-8 xl:col-span-9 rounded-2xl border p-6 md:p-8 space-y-8 transition-colors ${
            isDark
              ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 shadow-sm text-white"
              : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          {/* TAB 1: THÔNG TIN CHUNG (Theo đúng mockup) */}
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <h1 className="text-xl md:text-2xl font-bold font-heading text-white">
                Thông tin chung
              </h1>

              {/* 1. Khối Thương hiệu */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#122147]/90 border-white/20 shadow-sm" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                  Thương hiệu
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Cột trái: Form nhập tên & SEO */}
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="text-xs text-cyan-300 font-bold block mb-1">Tên Website</label>
                      <input
                        type="text"
                        value={generalForm.websiteName}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, websiteName: e.target.value })
                        }
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Nhập tên website..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Mô tả SEO</label>
                      <input
                        type="text"
                        value={generalForm.seoDescription}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, seoDescription: e.target.value })
                        }
                        className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                          isDark
                            ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                        }`}
                        placeholder="Mô tả SEO công cụ tìm kiếm..."
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-slate-300 block font-medium">Favicon</span>
                        <span className="text-[10px] text-slate-400">ICO/PNG 32×32px</span>
                      </div>
                      <button className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold transition-all cursor-pointer">
                        Tải lên
                      </button>
                    </div>
                  </div>

                  {/* Cột phải: Logo Upload Box */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition-colors cursor-pointer text-center bg-white/[0.02]">
                    <Upload size={26} className="text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-white block">Logo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG/SVG tối đa 2MB</span>
                  </div>
                </div>
              </div>

              {/* 2. Khối Liên hệ & Mạng xã hội */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  Liên hệ
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email liên hệ</label>
                    <input
                      type="email"
                      value={generalForm.contactEmail}
                      onChange={(e) =>
                        setGeneralForm({ ...generalForm, contactEmail: e.target.value })
                      }
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                        isDark
                          ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                      }`}
                      placeholder="admin@pacific.org"
                    />
                  </div>

                  {/* Social Links List */}
                  {generalForm.socialLinks.map((link) => (
                    <div key={link.id} className="space-y-1">
                      <label className="text-xs text-slate-400 block">{link.platform}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            handleSocialChange(link.id, "url", e.target.value)
                          }
                          className={`flex-1 px-3.5 py-2 rounded-xl text-xs border outline-none transition-colors ${
                            isDark
                              ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                              : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                          }`}
                        />
                        <button
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Thêm liên kết button */}
                  <div className="pt-2">
                    <button
                      onClick={handleAddSocialLink}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Thêm liên kết</span>
                    </button>
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

              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  Chế độ giao diện (Theme Mode)
                </h3>
                <div className="flex items-center gap-4">
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
                    <span>🌙 Chế độ Tối (Dark Navy)</span>
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
                    <span>☀️ Chế độ Sáng (Light Clean)</span>
                  </button>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  Ngôn ngữ mặc định
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDisplayForm({ ...displayForm, defaultLanguage: "vi" })}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                      displayForm.defaultLanguage === "vi"
                        ? "border-cyan-500/40 bg-cyan-500/10 font-bold"
                        : "border-white/10 bg-white/5 opacity-70"
                    }`}
                  >
                    <span className="text-lg">🇻🇳</span>
                    <div>
                      <p className="text-xs font-bold text-white">Tiếng Việt</p>
                      <p className="text-[10px] text-slate-400">Mặc định hệ thống</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setDisplayForm({ ...displayForm, defaultLanguage: "en" })}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                      displayForm.defaultLanguage === "en"
                        ? "border-cyan-500/40 bg-cyan-500/10 font-bold"
                        : "border-white/10 bg-white/5 opacity-70"
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    <div>
                      <p className="text-xs font-bold text-white">English</p>
                      <p className="text-[10px] text-slate-400">International</p>
                    </div>
                  </button>
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
                    <h4 className="text-sm font-bold text-white">Kiểm duyệt tự động</h4>
                    <p className="text-xs text-slate-400">Ẩn các bình luận chứa từ ngữ tiêu cực hoặc spam</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-400 cursor-pointer" />
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Cho phép khách bình luận</h4>
                    <p className="text-xs text-slate-400">Người dùng chưa đăng nhập vẫn có thể để lại ý kiến</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-cyan-400 cursor-pointer" />
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
                    <h4 className="text-sm font-bold text-white">Mở đăng ký thành viên mới</h4>
                    <p className="text-xs text-slate-400">Cho phép người dùng tạo tài khoản Pacific công khai</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-400 cursor-pointer" />
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
                    defaultValue="gbif_sec_99182310231"
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-white/15 bg-[#0b1329] text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tần suất đồng bộ dữ liệu tự động</label>
                  <select className="w-full px-3.5 py-2 rounded-xl text-xs border border-white/15 bg-[#0b1329] text-white">
                    <option>Hàng ngày (00:00 UTC)</option>
                    <option>Hàng tuần</option>
                    <option>Thủ công</option>
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
                    <h4 className="text-sm font-bold text-white">Xác thực hai yếu tố (2FA) cho Quản trị viên</h4>
                    <p className="text-xs text-slate-400">Yêu cầu mã OTP khi đăng nhập vào trang Admin</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-400 cursor-pointer" />
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
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-md active:scale-95"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
