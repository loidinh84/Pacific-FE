/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Home,
  Languages,
  MessageSquare,
  Users,
  Database,
  Shield,
  RotateCcw,
  RefreshCw,
  Save,
  Check,
} from "lucide-react";
import * as Images from "../../../assets/Images";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import {
  fetchAdminSettings,
  updateAdminSettings,
} from "../../../services/adminSettingsApi";
import {
  fetchAdminApiProviders,
  updateAdminApiProvider,
  testAdminApiProvider,
} from "../../../services/speciesApi";
import {
  updateDocumentFavicon,
  updateDocumentMetaSEO,
} from "../../../utils/systemBranding";
import { useLanguageStore } from "../../../stores/useLanguageStore";

// Tab Components
import GeneralTab from "./tabs/GeneralTab";
import DisplayTab from "./tabs/DisplayTab";
import ContentTab from "./tabs/ContentTab";
import UsersTab from "./tabs/UsersTab";
import ApiTab from "./tabs/ApiTab";
import SecurityTab from "./tabs/SecurityTab";

// Constants & Defaults
import {
  VALID_TABS,
  DEFAULT_FORM_DATA,
  SOCIAL_PRESETS,
} from "./settingsConstants";

export default function SystemSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc tab ban đầu từ URL (?tab=...) hoặc localStorage, mặc định là "general"
  const getInitialTab = () => {
    const urlTab = searchParams.get("tab");
    if (urlTab && VALID_TABS.includes(urlTab)) return urlTab;

    const savedTab = localStorage.getItem("pacific_admin_settings_tab");
    if (savedTab && VALID_TABS.includes(savedTab)) return savedTab;

    return "general";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Đồng bộ tab khi người dùng tải lại trang (F5), Back/Forward lịch sử duyệt
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && VALID_TABS.includes(urlTab)) {
      if (urlTab !== activeTab) {
        setActiveTab(urlTab);
      }
      localStorage.setItem("pacific_admin_settings_tab", urlTab);
    } else {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [searchParams]);

  // Chuyển tab: Cập nhật state, URL query và localStorage
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    localStorage.setItem("pacific_admin_settings_tab", tabId);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bannedWordInput, setBannedWordInput] = useState("");
  const [apiProviders, setApiProviders] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [testingProviderId, setTestingProviderId] = useState(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [providerPings, setProviderPings] = useState({});
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const logoInputRef = useRef(null);

  // Settings State Form
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

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
        console.warn(
          "Không thể tải cấu hình từ backend, dùng mặc định:",
          err.message,
        );
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
      showToast(
        "Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, SVG, WebP)",
        "error",
      );
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
      showToast(
        "Đã chọn logo mới và cập nhật favicon! Hãy nhấn 'Lưu thay đổi' để lưu vào hệ thống.",
        "info",
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateSection("general", "logoUrl", "");
    updateDocumentFavicon(Images.Logo);
    if (logoInputRef.current) logoInputRef.current.value = "";
    showToast("Đã đặt lại về logo Pacific mặc định", "info");
  };

  // Reset Tab Defaults Handlers
  const handleResetGeneralDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      general: {
        websiteName: "Pacific Ocean - Bách khoa toàn thư sinh vật biển",
        seoDescription:
          "Hệ thống số hóa sinh vật biển toàn diện, cung cấp dữ liệu tương tác 3D và bảo tồn hệ sinh thái biển Thái Bình Dương.",
        contactEmail: "admin@pacific.org",
        logoUrl: "",
        socialLinks: [
          {
            id: "1",
            platform: "Facebook",
            url: "https://facebook.com/pacific.ocean",
          },
          {
            id: "2",
            platform: "Instagram",
            url: "https://instagram.com/pacific.ocean",
          },
          {
            id: "3",
            platform: "YouTube",
            url: "https://youtube.com/@pacific.ocean",
          },
        ],
      },
    }));
    updateDocumentFavicon(Images.Logo);
    if (logoInputRef.current) logoInputRef.current.value = "";
    showToast("Đã khôi phục các giá trị mặc định cho Thông tin chung", "info");
  };

  const handleResetDisplayDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      display: {
        defaultLanguage: "vi",
        enableAudioAutoPlay: false,
        enable3DViewer: true,
        enableOceanEffects: true,
      },
    }));
    showToast(
      "Đã khôi phục các giá trị mặc định cho Hiển thị & Ngôn ngữ",
      "info",
    );
  };

  const handleAddBannedWord = () => {
    const word = bannedWordInput.trim().toLowerCase();
    if (!word) return;
    const currentWords = formData.content.customBannedWords || [];
    if (currentWords.includes(word)) {
      showToast(`Từ khóa "${word}" đã có trong danh sách cấm!`, "warning");
      return;
    }
    updateSection("content", "customBannedWords", [...currentWords, word]);
    setBannedWordInput("");
    showToast(`Đã thêm từ cấm "${word}" vào danh sách!`, "info");
  };

  const handleRemoveBannedWord = (wordToRemove) => {
    const currentWords = formData.content.customBannedWords || [];
    updateSection(
      "content",
      "customBannedWords",
      currentWords.filter((w) => w !== wordToRemove),
    );
    showToast(`Đã xóa từ cấm "${wordToRemove}"`, "info");
  };

  const handleResetContentDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      content: {
        autoModeration: true,
        aiSensitivity: "medium",
        filterProfanity: true,
        profanityAction: "mask",
        customBannedWords: ["scam", "lừa đảo", "chửi bậy", "xúc phạm", "hack"],
        maxReportsToHide: 3,
        allowGuestComment: false,
        requireApprovalFirst: false,
        commentCooldownSeconds: 15,
        notifyAdminOnFlag: true,
      },
    }));
    showToast(
      "Đã khôi phục các giá trị mặc định cho Nội dung & Bình luận",
      "info",
    );
  };

  const handleResetUsersDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      users: {
        allowRegistration: true,
        requireEmailVerification: false,
        defaultUserRole: "user",
        requireApprovalForNewUsers: false,
        minPasswordLength: 8,
        requireSpecialChar: true,
        allowSocialLogin: true,
        maxLoginAttempts: 5,
      },
    }));
    showToast(
      "Đã khôi phục các giá trị mặc định cho Tài khoản người dùng",
      "info",
    );
  };

  // API Providers Handlers
  const loadApiProviders = async () => {
    try {
      setIsLoadingProviders(true);
      const res = await fetchAdminApiProviders(false);
      if (res?.success && Array.isArray(res.data)) {
        setApiProviders(res.data);
      }
    } catch (err) {
      console.warn("Lỗi khi tải danh sách nguồn dữ liệu API:", err.message);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "api" && apiProviders.length === 0) {
      loadApiProviders();
    }
  }, [activeTab]);

  const handleToggleProvider = async (providerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      setApiProviders((prev) =>
        prev.map((p) =>
          p.id === providerId ? { ...p, isEnabled: newStatus } : p,
        ),
      );
      await updateAdminApiProvider(providerId, { isEnabled: newStatus });
      showToast(
        `Đã ${newStatus ? "bật" : "tạm dừng"} kết nối nguồn dữ liệu`,
        "info",
      );
    } catch (err) {
      showToast(
        err.message || "Không thể cập nhật trạng thái nguồn dữ liệu",
        "error",
      );
      loadApiProviders();
    }
  };

  const handleTestProvider = async (providerId) => {
    try {
      setTestingProviderId(providerId);
      const res = await testAdminApiProvider(providerId);
      const data = res?.data || {};
      const isOk = data.status === "ok" || res?.success;
      setProviderPings((prev) => ({
        ...prev,
        [providerId]: {
          status: isOk ? "online" : "offline",
          latency: data.responseTimeMs || 120,
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          message: isOk
            ? "Kết nối ổn định"
            : data.statusMessage || "Không phản hồi",
        },
      }));
      if (isOk) {
        showToast(
          `Kết nối nguồn dữ liệu thành công (${data.responseTimeMs || 120}ms)`,
          "success",
        );
      } else {
        showToast("Nguồn dữ liệu không phản hồi hoặc đang bảo trì", "warning");
      }
    } catch (err) {
      setProviderPings((prev) => ({
        ...prev,
        [providerId]: {
          status: "offline",
          latency: null,
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          message: err.message || "Lỗi kết nối",
        },
      }));
      showToast(
        "Lỗi kiểm tra kết nối: " + (err.message || "Không phản hồi"),
        "error",
      );
    } finally {
      setTestingProviderId(null);
    }
  };

  const handleTestAllProviders = async () => {
    if (apiProviders.length === 0) return;
    try {
      setIsTestingAll(true);
      showToast(
        "Đang kiểm tra kết nối toàn bộ các cổng dữ liệu quốc tế...",
        "info",
      );
      const res = await fetchAdminApiProviders(true);
      if (res?.success && Array.isArray(res.data)) {
        const pingMap = {};
        res.data.forEach((p) => {
          pingMap[p.id] = {
            status:
              p.status === "ok"
                ? "online"
                : p.status === "disabled"
                  ? "disabled"
                  : "offline",
            latency: p.responseTimeMs,
            time: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            message:
              p.statusMessage ||
              (p.status === "ok" ? "Kết nối ổn định" : "Ngoại tuyến"),
          };
        });
        setProviderPings(pingMap);
        showToast("Đã kiểm tra xong toàn bộ các nguồn dữ liệu!", "success");
      }
    } catch (err) {
      showToast("Lỗi kiểm tra đồng loạt: " + err.message, "error");
    } finally {
      setIsTestingAll(false);
    }
  };

  const handleTriggerManualSync = () => {
    setIsManualSyncing(true);
    showToast("Đang gửi yêu cầu đồng bộ danh mục sinh vật biển...", "info");
    setTimeout(() => {
      setIsManualSyncing(false);
      showToast("Đã kích hoạt đồng bộ nền thành công!", "success");
    }, 1500);
  };

  const handleResetApiDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      api: {
        syncFrequency: "daily",
        autoEnrichNewSpecies: true,
        cacheTtlHours: 24,
        enableTaxonomyFallback: true,
        timeoutSeconds: 5,
      },
    }));
    showToast("Đã khôi phục các giá trị mặc định cho API & Dữ liệu", "info");
  };

  const handleResetSecurityDefaults = () => {
    setFormData((prev) => ({
      ...prev,
      security: {
        require2FA: true,
        twoFactorMethod: "authenticator",
        sessionTimeoutMinutes: 60,
        singleSessionPerUser: false,
        logSensitiveActions: true,
        blockTorAndProxies: false,
        adminPasswordExpiryDays: 90,
      },
    }));
    showToast("Đã khôi phục các giá trị mặc định cho Bảo mật hệ thống", "info");
  };

  // Save Settings to Backend API
  const handleSave = async () => {
    if (!formData.general.websiteName?.trim()) {
      showToast("Tên website không được để trống", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.general.contactEmail?.trim() &&
      !emailRegex.test(formData.general.contactEmail.trim())
    ) {
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
          localStorage.setItem(
            "pacific_system_settings",
            JSON.stringify(res.data),
          );
          window.dispatchEvent(
            new CustomEvent("pacific_settings_update", { detail: res.data }),
          );
          if (res.data?.general) {
            updateDocumentMetaSEO(res.data.general);
          }
          if (res.data?.display?.defaultLanguage) {
            useLanguageStore
              .getState()
              .changeLanguage(res.data.display.defaultLanguage);
          }
        } catch (syncErr) {
          console.warn("Lỗi đồng bộ cấu hình client:", syncErr);
        }

        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        showToast(res?.error || "Không thể lưu thiết lập hệ thống", "error");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.error || err.message || "Lỗi khi lưu thiết lập",
        "error",
      );
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
            isDark
              ? "bg-[#111c38] border-white/10"
              : "bg-white border-slate-200 shadow-sm"
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
            {isLoading && (
              <RefreshCw size={14} className="text-cyan-400 animate-spin" />
            )}
          </div>

          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
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
            isDark
              ? "bg-[#111c38] border-white/10"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* TAB 1: THÔNG TIN CHUNG */}
          {activeTab === "general" && (
            <GeneralTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
              logoInputRef={logoInputRef}
              handleLogoFile={handleLogoFile}
              handleRemoveLogo={handleRemoveLogo}
              handleAddSocialLink={handleAddSocialLink}
              handleSocialChange={handleSocialChange}
              handleRemoveSocialLink={handleRemoveSocialLink}
            />
          )}

          {/* TAB 2: HIỂN THỊ & NGÔN NGỮ */}
          {activeTab === "display" && (
            <DisplayTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
          )}

          {/* TAB 3: NỘI DUNG & BÌNH LUẬN */}
          {activeTab === "content" && (
            <ContentTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
              bannedWordInput={bannedWordInput}
              setBannedWordInput={setBannedWordInput}
              handleAddBannedWord={handleAddBannedWord}
              handleRemoveBannedWord={handleRemoveBannedWord}
            />
          )}

          {/* TAB 4: TÀI KHOẢN NGƯỜI DÙNG */}
          {activeTab === "users" && (
            <UsersTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
            />
          )}

          {/* TAB 5: API & DỮ LIỆU */}
          {activeTab === "api" && (
            <ApiTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
              apiProviders={apiProviders}
              isLoadingProviders={isLoadingProviders}
              testingProviderId={testingProviderId}
              isTestingAll={isTestingAll}
              providerPings={providerPings}
              isManualSyncing={isManualSyncing}
              handleToggleProvider={handleToggleProvider}
              handleTestProvider={handleTestProvider}
              handleTestAllProviders={handleTestAllProviders}
              handleTriggerManualSync={handleTriggerManualSync}
            />
          )}

          {/* TAB 6: BẢO MẬT */}
          {activeTab === "security" && (
            <SecurityTab
              formData={formData}
              updateSection={updateSection}
              isDark={isDark}
            />
          )}

          {/* ── BOTTOM ACTIONS: LƯU THAY ĐỔI & KHÔI PHỤC MẶC ĐỊNH ── */}
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
              {activeTab === "display" && (
                <button
                  type="button"
                  onClick={handleResetDisplayDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại hiển thị & ngôn ngữ về mặc định"
                >
                  <RotateCcw size={13} />
                  <span>Khôi phục mặc định tab này</span>
                </button>
              )}
              {activeTab === "content" && (
                <button
                  type="button"
                  onClick={handleResetContentDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại cài đặt nội dung & kiểm duyệt về mặc định"
                >
                  <RotateCcw size={13} />
                  <span>Khôi phục mặc định tab này</span>
                </button>
              )}
              {activeTab === "users" && (
                <button
                  type="button"
                  onClick={handleResetUsersDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại cài đặt tài khoản người dùng về mặc định"
                >
                  <RotateCcw size={13} />
                  <span>Khôi phục mặc định tab này</span>
                </button>
              )}
              {activeTab === "api" && (
                <button
                  type="button"
                  onClick={handleResetApiDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại cài đặt API & dữ liệu về mặc định"
                >
                  <RotateCcw size={13} />
                  <span>Khôi phục mặc định tab này</span>
                </button>
              )}
              {activeTab === "security" && (
                <button
                  type="button"
                  onClick={handleResetSecurityDefaults}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Đặt lại cài đặt bảo mật hệ thống về mặc định"
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
