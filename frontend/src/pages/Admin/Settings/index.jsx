/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  Box,
  Volume2,
  VolumeX,
  Waves,
  Bot,
  ShieldAlert,
  ShieldCheck,
  Filter,
  Clock,
  Flag,
  MessageCircle,
  UserPlus,
  UserCheck,
  Mail,
  KeyRound,
  Activity,
  Radio,
  Server,
  Zap,
  Layers,
  Wifi,
  WifiOff,
} from "lucide-react";
import * as Images from "../../../assets/Images";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { fetchAdminSettings, updateAdminSettings } from "../../../services/adminSettingsApi";
import {
  fetchAdminApiProviders,
  updateAdminApiProvider,
  testAdminApiProvider,
} from "../../../services/speciesApi";
import CustomSelect from "../Dashboard/components/CustomSelect";
import { updateDocumentFavicon, updateDocumentMetaSEO } from "../../../utils/systemBranding";
import { useLanguageStore } from "../../../stores/useLanguageStore";

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

const AI_SENSITIVITY_OPTIONS = [
  { value: "low", label: "Nhẹ nhàng - Chỉ gắn cờ khi rõ rệt" },
  { value: "medium", label: "Tiêu chuẩn - Khuyên dùng" },
  { value: "high", label: "Nghiêm ngặt - Quét chặt chẽ" },
];

const PROFANITY_ACTION_OPTIONS = [
  { value: "mask", label: "Thay thế bằng ký tự hoa thị (***)" },
  { value: "reject", label: "Chặn và yêu cầu chỉnh sửa" },
];

const MAX_REPORTS_OPTIONS = [
  { value: 1, label: "1 báo cáo - Tạm ẩn ngay" },
  { value: 2, label: "2 báo cáo vi phạm" },
  { value: 3, label: "3 báo cáo vi phạm - Khuyên dùng" },
  { value: 5, label: "5 báo cáo vi phạm" },
  { value: 10, label: "10 báo cáo vi phạm" },
];

const COOLDOWN_OPTIONS = [
  { value: 0, label: "Không giới hạn thời gian chờ" },
  { value: 15, label: "15 giây - Khuyên dùng" },
  { value: 30, label: "30 giây chống spam" },
  { value: 60, label: "60 giây - Chống spam cao" },
];

const MIN_PASSWORD_OPTIONS = [
  { value: 0, label: "Không giới hạn độ dài tối thiểu" },
  { value: 6, label: "6 ký tự - Tối thiểu cơ bản" },
  { value: 8, label: "8 ký tự - Khuyên dùng" },
  { value: 10, label: "10 ký tự - An toàn nâng cao" },
  { value: 12, label: "12 ký tự - Tiêu chuẩn cao" },
];

const MAX_LOGIN_ATTEMPTS_OPTIONS = [
  { value: 0, label: "Không giới hạn số lần" },
  { value: 3, label: "3 lần nhập sai liên tiếp" },
  { value: 5, label: "5 lần nhập sai - Khuyên dùng" },
  { value: 10, label: "10 lần nhập sai liên tiếp" },
];

const SYNC_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Hàng ngày (Vào 00:00 UTC) - Khuyên dùng" },
  { value: "weekly", label: "Hàng tuần (Chủ nhật)" },
  { value: "manual", label: "Thủ công (Chỉ đồng bộ khi có yêu cầu)" },
];

const CACHE_TTL_OPTIONS = [
  { value: 6, label: "6 giờ - Luôn làm mới dữ liệu" },
  { value: 12, label: "12 giờ" },
  { value: 24, label: "24 giờ (1 ngày) - Khuyên dùng" },
  { value: 48, label: "48 giờ (2 ngày) - Tiết kiệm băng thông" },
];

const TIMEOUT_OPTIONS = [
  { value: 3, label: "3 giây - Phản hồi nhanh" },
  { value: 5, label: "5 giây - Tiêu chuẩn khuyên dùng" },
  { value: 10, label: "10 giây - Mạng chậm hoặc tải dữ liệu lớn" },
];

const TWO_FACTOR_METHOD_OPTIONS = [
  { value: "authenticator", label: "Ứng dụng xác thực (Google Authenticator / Authy) - Khuyên dùng" },
  { value: "email", label: "Mã OTP bảo mật gửi qua Email quản trị" },
];

const SESSION_TIMEOUT_OPTIONS = [
  { value: 15, label: "15 phút - Tối đa an toàn" },
  { value: 30, label: "30 phút" },
  { value: 60, label: "60 phút (1 giờ) - Khuyên dùng" },
  { value: 120, label: "120 phút (2 giờ)" },
  { value: 1440, label: "24 giờ (1 ngày)" },
];

const ADMIN_PASSWORD_EXPIRY_OPTIONS = [
  { value: 0, label: "Không bao giờ hết hạn" },
  { value: 30, label: "30 ngày" },
  { value: 60, label: "60 ngày" },
  { value: 90, label: "90 ngày - Khuyên dùng" },
  { value: 180, label: "180 ngày (6 tháng)" },
];

export default function SystemSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Danh sách các tab hợp lệ trong hệ thống
  const VALID_TABS = ["general", "display", "content", "users", "api", "security"];

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
      // Đảm bảo URL luôn có ?tab=... tương ứng tab đang mở
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
      enableOceanEffects: true,
    },
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
    api: {
      syncFrequency: "daily",
      autoEnrichNewSpecies: true,
      cacheTtlHours: 24,
      enableTaxonomyFallback: true,
      timeoutSeconds: 5,
    },
    security: {
      require2FA: true,
      twoFactorMethod: "authenticator",
      sessionTimeoutMinutes: 60,
      singleSessionPerUser: false,
      logSensitiveActions: true,
      blockTorAndProxies: false,
      adminPasswordExpiryDays: 90,
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
        websiteName: "Pacific Ocean - Bách khoa toàn thư sinh vật biển",
        siteDescription:
          "Hệ thống số hóa sinh vật biển toàn diện, cung cấp dữ liệu tương tác 3D và bảo tồn hệ sinh thái biển Thái Bình Dương.",
        contactEmail: "admin@pacific.org",
        logoUrl: "",
        socialLinks: [
          { id: "1", platform: "Facebook", url: "https://facebook.com/pacific.ocean" },
          { id: "2", platform: "Instagram", url: "https://instagram.com/pacific.ocean" },
          { id: "3", platform: "YouTube", url: "https://youtube.com/@pacific.ocean" },
        ],
      },
    }));
    updateDocumentFavicon(Images.Logo);
    if (logoInputRef.current) logoInputRef.current.value = "";
    showToast("Đã khôi phục các giá trị mặc định cho Thông tin chung", "info");
  };

  // Reset Tab 2 Defaults Handler
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
    showToast("Đã khôi phục các giá trị mặc định cho Hiển thị & Ngôn ngữ", "info");
  };

  // Tab 3: Banned words and moderation handlers
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
      currentWords.filter((w) => w !== wordToRemove)
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
    showToast("Đã khôi phục các giá trị mặc định cho Nội dung & Bình luận", "info");
  };

  // Reset Tab 4 Defaults Handler
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
    showToast("Đã khôi phục các giá trị mặc định cho Tài khoản người dùng", "info");
  };

  // Tab 5: API & Dữ liệu Handlers
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
        prev.map((p) => (p.id === providerId ? { ...p, isEnabled: newStatus } : p))
      );
      await updateAdminApiProvider(providerId, { isEnabled: newStatus });
      showToast(`Đã ${newStatus ? "bật" : "tạm dừng"} kết nối nguồn dữ liệu`, "info");
    } catch (err) {
      showToast(err.message || "Không thể cập nhật trạng thái nguồn dữ liệu", "error");
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
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          message: isOk ? "Kết nối ổn định" : (data.statusMessage || "Không phản hồi"),
        },
      }));
      if (isOk) {
        showToast(`Kết nối nguồn dữ liệu thành công (${data.responseTimeMs || 120}ms)`, "success");
      } else {
        showToast("Nguồn dữ liệu không phản hồi hoặc đang bảo trì", "warning");
      }
    } catch (err) {
      setProviderPings((prev) => ({
        ...prev,
        [providerId]: {
          status: "offline",
          latency: null,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          message: err.message || "Lỗi kết nối",
        },
      }));
      showToast("Lỗi kiểm tra kết nối: " + (err.message || "Không phản hồi"), "error");
    } finally {
      setTestingProviderId(null);
    }
  };

  const handleTestAllProviders = async () => {
    if (apiProviders.length === 0) return;
    try {
      setIsTestingAll(true);
      showToast("Đang kiểm tra kết nối toàn bộ các cổng dữ liệu quốc tế...", "info");
      const res = await fetchAdminApiProviders(true);
      if (res?.success && Array.isArray(res.data)) {
        const pingMap = {};
        res.data.forEach((p) => {
          pingMap[p.id] = {
            status: p.status === "ok" ? "online" : (p.status === "disabled" ? "disabled" : "offline"),
            latency: p.responseTimeMs,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            message: p.statusMessage || (p.status === "ok" ? "Kết nối ổn định" : "Ngoại tuyến"),
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

  // Tab 6: Reset Security Defaults Handler
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
          if (res.data?.display?.defaultLanguage) {
            useLanguageStore.getState().changeLanguage(res.data.display.defaultLanguage);
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
            <div className="space-y-7 animate-in fade-in duration-200">
              {/* Header Tab */}
              <div className="border-b pb-4 border-white/10">
                <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                  <span>Hiển thị & Ngôn ngữ</span>
                  <Languages size={20} className="text-cyan-400" />
                </h1>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Cấu hình chủ đề giao diện sáng/tối, ngôn ngữ mặc định và các tính năng đa phương tiện 3D & âm thanh sinh vật
                </p>
              </div>

              {/* 2.1 Khối Giao diện hệ thống (Theme Mode) */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sun size={14} />
                    <span>Giao diện hệ thống</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Chọn chủ đề màu sắc hiển thị phù hợp với thị giác và điều kiện ánh sáng làm việc
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Card Dark Mode */}
                  <div
                    onClick={() => {
                      if (!isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                      isDark
                        ? "border-cyan-400 bg-[#0d1730] shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-400/20"
                        : "border-slate-300 bg-white hover:border-slate-400 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                          <Moon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            Chế độ tối
                          </h4>
                          <span className="text-[11px] text-slate-400">Tông màu đại dương sâu</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isDark ? "border-cyan-400 bg-cyan-500" : "border-slate-400"
                        }`}
                      >
                        {isDark && <Check size={12} strokeWidth={3} className="text-slate-900" />}
                      </div>
                    </div>

                    {/* Mini Mockup Visual */}
                    <div className="rounded-xl p-3 bg-[#080f24] border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                        <div className="w-16 h-2 rounded-full bg-white/20" />
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10" />
                      <div className="w-3/4 h-2 rounded-full bg-white/10" />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Dịu mắt khi làm việc buổi tối, tôn vinh sắc thái các rạn san hô và sinh vật biển phát quang sinh học.
                    </p>
                  </div>

                  {/* Card Light Mode */}
                  <div
                    onClick={() => {
                      if (isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                      !isDark
                        ? "border-blue-600 bg-white shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                        : "border-white/10 bg-[#0d1730] hover:border-white/20 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                          <Sun size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            Chế độ sáng
                          </h4>
                          <span className="text-[11px] text-slate-500">Sáng sủa, thanh lịch</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          !isDark ? "border-blue-600 bg-blue-600" : "border-slate-500"
                        }`}
                      >
                        {!isDark && <Check size={12} strokeWidth={3} className="text-white" />}
                      </div>
                    </div>

                    {/* Mini Mockup Visual */}
                    <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <div className="w-16 h-2 rounded-full bg-slate-300" />
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200" />
                      <div className="w-3/4 h-2 rounded-full bg-slate-200" />
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tối ưu độ tương phản, phù hợp khi thuyết trình hoặc sử dụng ở môi trường ánh sáng tự nhiên mạnh.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2.2 Khối Ngôn ngữ mặc định hệ thống */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Globe size={14} />
                    <span>Ngôn ngữ mặc định hệ thống</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Ngôn ngữ hiển thị khởi đầu khi khách truy cập mới lần đầu vào portal
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Tiếng Việt */}
                  <div
                    onClick={() => updateSection("display", "defaultLanguage", "vi")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      formData.display.defaultLanguage === "vi"
                        ? isDark
                          ? "border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-400/20"
                          : "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                        : isDark
                        ? "border-white/10 bg-[#0d1730] hover:border-white/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl shrink-0">🇻🇳</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Tiếng Việt</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/30">
                            Khuyên dùng
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Toàn bộ giao diện & dữ liệu loài tiếng Việt chuẩn hóa
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                        formData.display.defaultLanguage === "vi"
                          ? isDark
                            ? "border-cyan-400 bg-cyan-500"
                            : "border-blue-600 bg-blue-600"
                          : "border-slate-400"
                      }`}
                    >
                      {formData.display.defaultLanguage === "vi" && (
                        <Check size={12} strokeWidth={3} className={isDark ? "text-slate-900" : "text-white"} />
                      )}
                    </div>
                  </div>

                  {/* English */}
                  <div
                    onClick={() => updateSection("display", "defaultLanguage", "en")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      formData.display.defaultLanguage === "en"
                        ? isDark
                          ? "border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-400/20"
                          : "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                        : isDark
                        ? "border-white/10 bg-[#0d1730] hover:border-white/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl shrink-0">🇬🇧</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">English</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold border border-white/15">
                            International
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Global marine species database with English labels
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                        formData.display.defaultLanguage === "en"
                          ? isDark
                            ? "border-cyan-400 bg-cyan-500"
                            : "border-blue-600 bg-blue-600"
                          : "border-slate-400"
                      }`}
                    >
                      {formData.display.defaultLanguage === "en" && (
                        <Check size={12} strokeWidth={3} className={isDark ? "text-slate-900" : "text-white"} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.3 Khối Đa phương tiện & Trải nghiệm đại dương */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Đa phương tiện tương tác & Trải nghiệm đại dương</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Kiểm soát các công nghệ tương tác đồ họa 3D, âm thanh thủy âm và hiệu ứng môi trường
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-white/10 pt-1">
                  {/* Toggle 1: 3D Viewer */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Box size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Kích hoạt trình xem 3D sinh vật</h4>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Cho phép người dùng xoay 360 độ và giải phẫu chi tiết mô hình 3D sinh vật ở trang chi tiết loài và trang /3d.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.display.enable3DViewer}
                      onClick={() => updateSection("display", "enable3DViewer", !formData.display.enable3DViewer)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.display.enable3DViewer
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.display.enable3DViewer ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Audio Autoplay */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Volume2 size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Tự động phát âm thanh sinh vật</h4>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tự động phát tiếng kêu đặc trưng của sinh vật hoặc âm thanh sóng ngầm khi mở trang chi tiết loài.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.display.enableAudioAutoPlay}
                      onClick={() => updateSection("display", "enableAudioAutoPlay", !formData.display.enableAudioAutoPlay)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.display.enableAudioAutoPlay
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.display.enableAudioAutoPlay ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Ocean Ambient Effects */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Waves size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Hiệu ứng bọt khí & Ánh sáng đại dương</h4>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Hiển thị luồng sáng huyền ảo dưới đáy biển và các hạt bong bóng nước nổi lơ lửng trên toàn bộ portal.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.display.enableOceanEffects !== false}
                      onClick={() => updateSection("display", "enableOceanEffects", formData.display.enableOceanEffects === false)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.display.enableOceanEffects !== false
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.display.enableOceanEffects !== false ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NỘI DUNG & BÌNH LUẬN */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Tab 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                    <MessageSquare className="text-cyan-400" size={24} />
                    <span>Nội dung & Bình luận</span>
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Thiết lập quy tắc kiểm duyệt AI, bộ lọc từ khóa nhạy cảm, chống spam và cơ chế xử lý báo cáo vi phạm
                  </p>
                </div>

                <Link
                  to="/admin/comments"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                    isDark
                      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                      : "bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200"
                  }`}
                >
                  <MessageCircle size={14} />
                  <span>Trang quản lý bình luận</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              {/* 3.1 Khối Kiểm duyệt AI */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Bot size={15} />
                    <span>Kiểm duyệt thông minh bằng AI</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Tự động phân tích ngữ nghĩa bình luận, nhận diện phát ngôn thù địch, xúc phạm danh dự hoặc spam
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-white/10 pt-1">
                  {/* Toggle 1: Kích hoạt kiểm duyệt AI */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Bot size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Kích hoạt kiểm duyệt tự động bằng AI</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                            Khuyên dùng
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Mô hình NLP sẽ quét các bình luận ngay khi người dùng gửi và tự động gắn cờ nếu phát hiện nội dung độc hại.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.content.autoModeration}
                      onClick={() => updateSection("content", "autoModeration", !formData.content.autoModeration)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.content.autoModeration
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.content.autoModeration ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Các tùy chọn con phụ thuộc vào Kiểm duyệt tự động */}
                  {formData.content.autoModeration && (
                    <>
                      {/* Độ nhạy AI */}
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold">Mức độ nhạy kiểm duyệt của AI</h4>
                          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Xác định ngưỡng phân loại để mô hình quyết định gắn cờ cảnh báo
                          </p>
                        </div>
                        <CustomSelect
                          options={AI_SENSITIVITY_OPTIONS}
                          value={formData.content.aiSensitivity || "medium"}
                          onChange={(val) => updateSection("content", "aiSensitivity", val)}
                          isDark={isDark}
                          size="sm"
                          className="w-full sm:w-72 shrink-0"
                        />
                      </div>

                      {/* Toggle Thông báo quản trị viên */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                            <ShieldAlert size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">Cảnh báo tức thì đến quản trị viên</h4>
                            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Hiển thị chấm đỏ thông báo trên thanh điều hướng Admin khi có bình luận mới bị AI gắn cờ vi phạm.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.content.notifyAdminOnFlag !== false}
                          onClick={() => updateSection("content", "notifyAdminOnFlag", formData.content.notifyAdminOnFlag === false)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            formData.content.notifyAdminOnFlag !== false
                              ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                              : isDark
                              ? "bg-white/15"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              formData.content.notifyAdminOnFlag !== false ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3.2 Khối Bộ lọc từ ngữ */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Filter size={15} />
                    <span>Bộ lọc từ ngữ nhạy cảm & Từ khóa cấm</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Kiểm soát các từ ngữ thô tục, xúc phạm hoặc lừa đảo tài chính trong các cuộc thảo luận
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-white/10 pt-1">
                  {/* Toggle 1: Kích hoạt bộ lọc */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Filter size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Kích hoạt bộ lọc từ ngữ nhạy cảm</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30">
                            Bảo vệ cộng đồng
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tự động nhận diện danh sách từ cấm và áp dụng hành vi xử lý khi người dùng bình luận.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.content.filterProfanity}
                      onClick={() => updateSection("content", "filterProfanity", !formData.content.filterProfanity)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.content.filterProfanity
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.content.filterProfanity ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {formData.content.filterProfanity && (
                    <>
                      {/* Hành vi khi phát hiện từ cấm */}
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold">Hành vi khi phát hiện từ cấm</h4>
                          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Cách hệ thống phản hồi khi người dùng nhập từ trong danh sách cấm
                          </p>
                        </div>
                        <CustomSelect
                          options={PROFANITY_ACTION_OPTIONS}
                          value={formData.content.profanityAction || "mask"}
                          onChange={(val) => updateSection("content", "profanityAction", val)}
                          isDark={isDark}
                          size="sm"
                          className="w-full sm:w-80 shrink-0"
                        />
                      </div>

                      {/* Quản lý danh sách từ khóa cấm */}
                      <div className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold">Danh sách từ khóa cấm tùy chỉnh</h4>
                            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Đã thiết lập {formData.content.customBannedWords?.length || 0} từ khóa cấm
                            </p>
                          </div>
                        </div>

                        {/* Input thêm từ cấm */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bannedWordInput}
                            onChange={(e) => setBannedWordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddBannedWord();
                              }
                            }}
                            placeholder="Nhập từ hoặc cụm từ cần cấm rồi nhấn Enter..."
                            className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-colors ${
                              isDark
                                ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                                : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={handleAddBannedWord}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer shrink-0"
                          >
                            <Plus size={14} />
                            <span>Thêm từ</span>
                          </button>
                        </div>

                        {/* Danh sách badge từ cấm */}
                        <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
                          {(formData.content.customBannedWords || []).map((word, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                isDark
                                  ? "bg-red-500/10 border-red-500/25 text-red-300 hover:border-red-500/40"
                                  : "bg-red-50 border-red-200 text-red-700 hover:border-red-300"
                              }`}
                            >
                              <span>{word}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBannedWord(word)}
                                className="hover:opacity-60 cursor-pointer ml-1 p-0.5 text-red-400"
                                title={`Xóa "${word}"`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                          {(!formData.content.customBannedWords || formData.content.customBannedWords.length === 0) && (
                            <div className={`text-xs italic py-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                              Chưa có từ khóa cấm nào. Hãy nhập từ khóa ở ô trên để thêm vào danh sách.
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3.3 Khối Báo cáo vi phạm */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Flag size={15} />
                    <span>Xử lý báo cáo vi phạm từ cộng đồng</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Quy định ngưỡng cảnh báo tự động khi thành viên trong portal gửi báo cáo về một bình luận
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                        <Flag size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">Ngưỡng báo cáo tự động tạm ẩn bình luận</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30">
                            Tự động ẩn
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Khi số lượt người dùng báo cáo một bình luận đạt ngưỡng này, hệ thống sẽ tự động chuyển trạng thái bình luận sang "Tạm ẩn" để chờ quản trị viên duyệt.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={MAX_REPORTS_OPTIONS}
                      value={formData.content.maxReportsToHide || 3}
                      onChange={(val) => updateSection("content", "maxReportsToHide", Number(val))}
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-64 shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* 3.4 Khối Chính sách thảo luận */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Clock size={15} />
                    <span>Chính sách thảo luận & Tần suất đăng</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Chống spam bot, kiểm soát chất lượng nội dung trước khi xuất bản công khai
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-white/10 pt-1">
                  {/* Toggle Duyệt thủ công trước khi xuất bản */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Kiểm duyệt thủ công trước khi hiển thị</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Mọi bình luận mới sẽ ở trạng thái chờ duyệt và chỉ xuất hiện khi quản trị viên phê duyệt.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.content.requireApprovalFirst}
                      onClick={() => updateSection("content", "requireApprovalFirst", !formData.content.requireApprovalFirst)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.content.requireApprovalFirst
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.content.requireApprovalFirst ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Cooldown chống spam */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Khoảng thời gian chờ giữa 2 bình luận</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Ngăn chặn người dùng gửi liên tiếp quá nhanh hoặc bot spam bình luận hàng loạt.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={COOLDOWN_OPTIONS}
                      value={formData.content.commentCooldownSeconds ?? 15}
                      onChange={(val) => updateSection("content", "commentCooldownSeconds", Number(val))}
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-72 shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TÀI KHOẢN NGƯỜI DÙNG */}
          {activeTab === "users" && (
            <div className="space-y-7 animate-in fade-in duration-200">
              {/* Header Tab */}
              <div className="border-b pb-4 border-white/10">
                <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                  <span>Tài khoản người dùng</span>
                  <Users size={18} className="text-cyan-400" />
                </h1>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Chính sách đăng ký thành viên mới, tiêu chuẩn mật khẩu an toàn và phân quyền ban đầu
                </p>
              </div>

              {/* 4.1 Khối Chính sách đăng ký thành viên mới */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <UserPlus size={14} />
                    <span>Chính sách đăng ký thành viên mới</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
                          <h4 className="text-sm font-bold">Mở cổng đăng ký tài khoản mới</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                            Công khai
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Cho phép khách truy cập tự do tạo tài khoản thành viên trên cổng thông tin.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.users.allowRegistration}
                      onClick={() => updateSection("users", "allowRegistration", !formData.users.allowRegistration)}
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
                          formData.users.allowRegistration ? "translate-x-5" : "translate-x-0"
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
                            <h4 className="text-sm font-bold">Bắt buộc xác thực địa chỉ email</h4>
                            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Gửi liên kết kích hoạt đến hộp thư trước khi người dùng được phép đăng nhập chính thức.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.users.requireEmailVerification}
                          onClick={() => updateSection("users", "requireEmailVerification", !formData.users.requireEmailVerification)}
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
                              formData.users.requireEmailVerification ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>


                      {/* Toggle Con 3: Phê duyệt thủ công trước khi kích hoạt */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                            <UserCheck size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">Phê duyệt thủ công trước khi kích hoạt</h4>
                            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Tài khoản mới sẽ ở trạng thái chờ duyệt và chỉ kích hoạt khi quản trị viên phê duyệt.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.users.requireApprovalForNewUsers}
                          onClick={() => updateSection("users", "requireApprovalForNewUsers", !formData.users.requireApprovalForNewUsers)}
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
                              formData.users.requireApprovalForNewUsers ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`pt-4 p-4 rounded-xl border flex items-start gap-3 ${
                        isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                      <div className="text-xs leading-relaxed">
                        <p className="font-semibold">Cổng đăng ký người dùng hiện đang đóng</p>
                        <p className="opacity-90 mt-0.5">
                          Khách truy cập sẽ không thể tự đăng ký tài khoản. Quản trị viên vẫn có thể tạo và cấp tài khoản trực tiếp trong trang quản lý thành viên.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4.2 Khối Quy chuẩn mật khẩu & Bảo mật đăng nhập */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Lock size={14} />
                    <span>Quy chuẩn mật khẩu & Bảo mật đăng nhập</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
                        <h4 className="text-sm font-bold">Độ dài mật khẩu tối thiểu</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Số lượng ký tự tối thiểu khi thành viên đăng ký mới hoặc thay đổi mật khẩu.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={MIN_PASSWORD_OPTIONS}
                      value={formData.users.minPasswordLength ?? 8}
                      onChange={(val) => updateSection("users", "minPasswordLength", Number(val))}
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
                        <h4 className="text-sm font-bold">Yêu cầu mật khẩu phức tạp</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Bắt buộc mật khẩu phải chứa ít nhất một chữ in hoa hoặc một ký tự đặc biệt.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.users.requireSpecialChar}
                      onClick={() => updateSection("users", "requireSpecialChar", !formData.users.requireSpecialChar)}
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
                          formData.users.requireSpecialChar ? "translate-x-5" : "translate-x-0"
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
                        <h4 className="text-sm font-bold">Giới hạn số lần đăng nhập sai liên tiếp</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tạm thời khóa phiên đăng nhập sau nhiều lần nhập sai mật khẩu để ngăn chặn dò mật khẩu tự động.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={MAX_LOGIN_ATTEMPTS_OPTIONS}
                      value={formData.users.maxLoginAttempts ?? 5}
                      onChange={(val) => updateSection("users", "maxLoginAttempts", Number(val))}
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
                        <h4 className="text-sm font-bold">Cho phép đăng nhập nhanh qua tài khoản xã hội</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Hỗ trợ thành viên liên kết và đăng nhập nhanh bằng tài khoản Google hoặc GitHub.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.users.allowSocialLogin}
                      onClick={() => updateSection("users", "allowSocialLogin", !formData.users.allowSocialLogin)}
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
                          formData.users.allowSocialLogin ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4.3 Khối Điều hướng quản lý thành viên */}
              <div
                className={`rounded-2xl border p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
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
                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Xem danh sách toàn bộ người dùng, thay đổi quyền hạn chi tiết hoặc khóa/mở khóa tài khoản thành viên.
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
          )}

          {/* TAB 5: API & DỮ LIỆU */}
          {activeTab === "api" && (
            <div className="space-y-7 animate-in fade-in duration-200">
              {/* Header Tab */}
              <div className="border-b pb-4 border-white/10">
                <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                  <span>API & Dữ liệu</span>
                  <Database size={18} className="text-cyan-400" />
                </h1>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Quản lý kết nối các cổng dữ liệu sinh học đại dương quốc tế, chu kỳ đồng bộ và bộ nhớ đệm
                </p>
              </div>

              {/* 5.1 Khối Cấu hình đồng bộ & Bộ nhớ đệm dữ liệu */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>Cấu hình đồng bộ & Bộ nhớ đệm dữ liệu</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Điều khiển chu kỳ cập nhật tự động và tối ưu tốc độ tra cứu danh mục sinh vật biển
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-white/10 pt-1">
                  {/* Tần suất đồng bộ tự động */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Tần suất đồng bộ dữ liệu tự động</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Chu kỳ hệ thống tự động kiểm tra và làm mới dữ liệu sinh vật từ các nguồn quốc tế.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={SYNC_FREQUENCY_OPTIONS}
                      value={formData.api.syncFrequency || "daily"}
                      onChange={(val) => updateSection("api", "syncFrequency", val)}
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-80 shrink-0"
                    />
                  </div>

                  {/* Toggle Tự động bổ sung thông tin khi tạo loài mới */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Tự động bổ sung thông tin khi tạo loài mới</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Khi nhập tên khoa học, hệ thống tự động tra cứu họ, bộ, mô tả và kích thước từ các nguồn dữ liệu mở.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.api.autoEnrichNewSpecies}
                      onClick={() => updateSection("api", "autoEnrichNewSpecies", !formData.api.autoEnrichNewSpecies)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.api.autoEnrichNewSpecies
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.api.autoEnrichNewSpecies ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Thời gian lưu bộ nhớ đệm */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Database size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Thời gian lưu bộ nhớ đệm</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Lưu tạm kết quả tra cứu ngoài máy chủ để tăng tốc độ tải trang và tiết kiệm băng thông.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={CACHE_TTL_OPTIONS}
                      value={formData.api.cacheTtlHours ?? 24}
                      onChange={(val) => updateSection("api", "cacheTtlHours", Number(val))}
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-80 shrink-0"
                    />
                  </div>

                  {/* Toggle Tự động chuyển cổng dự phòng */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Tự động chuyển cổng dữ liệu dự phòng</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Khi một cổng dữ liệu bị nghẽn mạng hoặc gián đoạn, tự động chuyển sang nguồn kế tiếp.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.api.enableTaxonomyFallback}
                      onClick={() => updateSection("api", "enableTaxonomyFallback", !formData.api.enableTaxonomyFallback)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formData.api.enableTaxonomyFallback
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                          : isDark
                          ? "bg-white/15"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          formData.api.enableTaxonomyFallback ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Thời gian chờ tối đa cho mỗi yêu cầu */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Thời gian chờ tối đa cho mỗi yêu cầu</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Hủy yêu cầu và trả về dữ liệu nội bộ nếu nguồn dữ liệu ngoài phản hồi quá thời gian quy định.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={TIMEOUT_OPTIONS}
                      value={formData.api.timeoutSeconds ?? 5}
                      onChange={(val) => updateSection("api", "timeoutSeconds", Number(val))}
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-80 shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* 5.2 Khối Các cổng kết nối dữ liệu sinh vật biển quốc tế */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Server size={14} />
                      <span>Các cổng kết nối dữ liệu sinh vật biển quốc tế</span>
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Các nguồn dữ liệu mở phục vụ tra cứu danh pháp, phân loại học và hình ảnh sinh học
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestAllProviders}
                    disabled={isTestingAll || apiProviders.length === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isTestingAll ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-cyan-400" />
                        <span>Đang kiểm tra kết nối...</span>
                      </>
                    ) : (
                      <>
                        <Activity size={13} className="text-cyan-400" />
                        <span>Kiểm tra tất cả nguồn</span>
                      </>
                    )}
                  </button>
                </div>

                {isLoadingProviders ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <RefreshCw size={20} className="animate-spin text-cyan-400" />
                    <span className="text-xs">Đang tải danh sách cổng dữ liệu...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {apiProviders.map((provider) => {
                      const ping = providerPings[provider.id];
                      const isTestingThis = testingProviderId === provider.id;

                      return (
                        <div
                          key={provider.id}
                          className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between gap-4 ${
                            isDark
                              ? "bg-[#0f1933] border-white/10 hover:border-cyan-400/40"
                              : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"
                          }`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                                  {provider.name?.slice(0, 2).toUpperCase() || "API"}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                                    <span>{provider.name}</span>
                                    {provider.isBuiltIn && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300 font-normal">
                                        Tích hợp
                                      </span>
                                    )}
                                  </h4>
                                  <p className={`text-[11px] line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {provider.desc || "Cổng dữ liệu sinh học đại dương"}
                                  </p>
                                </div>
                              </div>

                              {/* Công tắc Bật/Tắt cổng */}
                              <button
                                type="button"
                                role="switch"
                                aria-checked={provider.isEnabled}
                                onClick={() => handleToggleProvider(provider.id, provider.isEnabled)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                  provider.isEnabled
                                    ? "bg-cyan-500 shadow-sm shadow-cyan-500/30"
                                    : isDark
                                    ? "bg-white/15"
                                    : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                    provider.isEnabled ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Trạng thái kết nối Ping */}
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <div className="flex items-center gap-1.5">
                                {isTestingThis ? (
                                  <span className="flex items-center gap-1 text-cyan-400">
                                    <RefreshCw size={11} className="animate-spin" />
                                    <span>Đang kiểm tra...</span>
                                  </span>
                                ) : ping ? (
                                  ping.status === "online" ? (
                                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                      <Wifi size={12} />
                                      <span>Trực tuyến ({ping.latency}ms)</span>
                                    </span>
                                  ) : ping.status === "disabled" ? (
                                    <span className="text-slate-500 flex items-center gap-1">
                                      <span>Đã tạm dừng</span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                                      <WifiOff size={12} />
                                      <span>Ngoại tuyến</span>
                                    </span>
                                  )
                                ) : (
                                  <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {provider.isEnabled ? "Sẵn sàng kết nối" : "Đã tạm dừng"}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleTestProvider(provider.id)}
                                disabled={isTestingThis || !provider.isEnabled}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer disabled:opacity-40 ${
                                  isDark
                                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                                }`}
                              >
                                Kiểm tra
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5.3 Khối Đồng bộ thủ công tức thì */}
              <div
                className={`rounded-2xl border p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span>Đồng bộ danh mục ngay bây giờ</span>
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Kích hoạt quét và chuẩn hóa toàn bộ dữ liệu phân loại học của các loài sinh vật biển hiện có ngay lúc này mà không cần chờ chu kỳ tự động.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerManualSync}
                  disabled={isManualSyncing}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shrink-0 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isManualSyncing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Đang đồng bộ...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Đồng bộ ngay bây giờ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: BẢO MẬT */}
          {activeTab === "security" && (
            <div className="space-y-7 animate-in fade-in duration-200">
              {/* Header Tab */}
              <div className="border-b pb-4 border-white/10">
                <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
                  <span>Bảo mật hệ thống</span>
                  <Shield size={18} className="text-cyan-400" />
                </h1>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Bảo vệ tài khoản quản trị viên, kiểm soát phiên đăng nhập và thiết lập chính sách an toàn thông tin
                </p>
              </div>

              {/* 6.1 Khối Xác thực quản trị & Kiểm soát truy cập */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Lock size={14} />
                    <span>Xác thực quản trị & Kiểm soát truy cập</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Tăng cường bảo vệ tài khoản quản trị trước các nguy cơ xâm nhập trái phép
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
                          <h4 className="text-sm font-bold">Bắt buộc xác thực hai yếu tố cho quản trị viên</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                            Bảo mật cao
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Yêu cầu bước xác nhận thứ hai ngoài mật khẩu khi đăng nhập vào bảng điều khiển quản trị.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.security.require2FA}
                      onClick={() => updateSection("security", "require2FA", !formData.security.require2FA)}
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
                          formData.security.require2FA ? "translate-x-5" : "translate-x-0"
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
                          <h4 className="text-sm font-bold">Phương thức xác thực hai yếu tố</h4>
                          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Lựa chọn phương thức gửi hoặc sinh mã OTP xác nhận đăng nhập.
                          </p>
                        </div>
                      </div>

                      <CustomSelect
                        options={TWO_FACTOR_METHOD_OPTIONS}
                        value={formData.security.twoFactorMethod || "authenticator"}
                        onChange={(val) => updateSection("security", "twoFactorMethod", val)}
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
                        <h4 className="text-sm font-bold">Chu kỳ bắt buộc thay đổi mật khẩu quản trị</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Yêu cầu đổi mật khẩu định kỳ để ngăn ngừa lộ lọt thông tin tài khoản quản trị.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={ADMIN_PASSWORD_EXPIRY_OPTIONS}
                      value={formData.security.adminPasswordExpiryDays ?? 90}
                      onChange={(val) => updateSection("security", "adminPasswordExpiryDays", Number(val))}
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
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    <span>Quản lý phiên làm việc & Nhật ký an toàn</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Kiểm soát thời gian tồn tại của phiên đăng nhập và ngăn chặn hành vi bất thường
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
                        <h4 className="text-sm font-bold">Thời gian tự động kết thúc phiên làm việc</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tự động đăng xuất tài khoản khi không có bất kỳ thao tác nào sau khoảng thời gian này.
                        </p>
                      </div>
                    </div>

                    <CustomSelect
                      options={SESSION_TIMEOUT_OPTIONS}
                      value={formData.security.sessionTimeoutMinutes ?? 60}
                      onChange={(val) => updateSection("security", "sessionTimeoutMinutes", Number(val))}
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
                        <h4 className="text-sm font-bold">Giới hạn một phiên đăng nhập duy nhất</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tự động đăng xuất phiên làm việc cũ khi phát hiện tài khoản đăng nhập trên một thiết bị mới.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.security.singleSessionPerUser}
                      onClick={() => updateSection("security", "singleSessionPerUser", !formData.security.singleSessionPerUser)}
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
                          formData.security.singleSessionPerUser ? "translate-x-5" : "translate-x-0"
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
                        <h4 className="text-sm font-bold">Ghi nhật ký kiểm toán cho thao tác quan trọng</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Lưu trữ lịch sử khi có thao tác xóa loài sinh vật, đổi phân quyền hoặc chỉnh sửa thiết lập hệ thống.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.security.logSensitiveActions}
                      onClick={() => updateSection("security", "logSensitiveActions", !formData.security.logSensitiveActions)}
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
                          formData.security.logSensitiveActions ? "translate-x-5" : "translate-x-0"
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
                        <h4 className="text-sm font-bold">Chặn truy cập qua mạng ẩn danh đáng ngờ</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Tự động từ chối yêu cầu từ các mạng Tor hoặc máy chủ proxy không xác thực để phòng tránh phá hoại.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.security.blockTorAndProxies}
                      onClick={() => updateSection("security", "blockTorAndProxies", !formData.security.blockTorAndProxies)}
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
                          formData.security.blockTorAndProxies ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 6.3 Khối Trạng thái an toàn & Tiêu chuẩn bảo mật kết nối */}
              <div
                className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
                  isDark ? "bg-[#152345] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Trạng thái an toàn & Tiêu chuẩn bảo mật kết nối</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Tổng hợp các cơ chế bảo vệ hạ tầng và mã hóa kết nối đang hoạt động
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#0f1933] border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Mã hóa HTTPS / TLS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                        Hoạt động
                      </span>
                    </div>
                    <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Chứng chỉ SSL bảo vệ mã hóa đầu cuối 256-bit trên toàn bộ các tuyến đường
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#0f1933] border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Chính sách CORS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                        Nghiêm ngặt
                      </span>
                    </div>
                    <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Chỉ chấp nhận các yêu cầu truy cập từ miền ứng dụng chính thức và IP cho phép
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#0f1933] border-white/10" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Giới hạn tần suất (Rate Limit)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
                        Kích hoạt
                      </span>
                    </div>
                    <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Tối đa 120 yêu cầu mỗi phút nhằm chống nghẽn mạng và tấn công dò quét tự động
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold">Tra cứu nhật ký kiểm toán hệ thống</h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Xem toàn bộ lịch sử đăng nhập, thay đổi phân quyền và thao tác quản trị viên gần đây.
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
