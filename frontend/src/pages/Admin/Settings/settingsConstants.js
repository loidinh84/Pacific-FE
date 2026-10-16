export const SOCIAL_PRESETS = [
  {
    name: "Facebook",
    placeholder: "https://facebook.com/pacific.ocean",
    color: "text-blue-400",
  },
  {
    name: "Instagram",
    placeholder: "https://instagram.com/pacific.ocean",
    color: "text-pink-400",
  },
  {
    name: "YouTube",
    placeholder: "https://youtube.com/@pacific.ocean",
    color: "text-red-400",
  },
  {
    name: "TikTok",
    placeholder: "https://tiktok.com/@pacific.ocean",
    color: "text-cyan-400",
  },
  {
    name: "X (Twitter)",
    placeholder: "https://x.com/pacific_ocean",
    color: "text-sky-400",
  },
  {
    name: "GitHub",
    placeholder: "https://github.com/pacific-ocean",
    color: "text-purple-400",
  },
  {
    name: "Zalo",
    placeholder: "https://zalo.me/pacific",
    color: "text-blue-300",
  },
  { name: "Khác", placeholder: "https://...", color: "text-slate-400" },
];

export const AI_SENSITIVITY_OPTIONS = [
  { value: "low", label: "Nhẹ nhàng - Chỉ gắn cờ khi rõ rệt" },
  { value: "medium", label: "Tiêu chuẩn - Khuyên dùng" },
  { value: "high", label: "Nghiêm ngặt - Quét chặt chẽ" },
];

export const PROFANITY_ACTION_OPTIONS = [
  { value: "mask", label: "Thay thế bằng ký tự hoa thị (***)" },
  { value: "reject", label: "Chặn và yêu cầu chỉnh sửa" },
];

export const MAX_REPORTS_OPTIONS = [
  { value: 1, label: "1 báo cáo - Tạm ẩn ngay" },
  { value: 2, label: "2 báo cáo vi phạm" },
  { value: 3, label: "3 báo cáo vi phạm - Khuyên dùng" },
  { value: 5, label: "5 báo cáo vi phạm" },
  { value: 10, label: "10 báo cáo vi phạm" },
];

export const COOLDOWN_OPTIONS = [
  { value: 0, label: "Không giới hạn thời gian chờ" },
  { value: 15, label: "15 giây - Khuyên dùng" },
  { value: 30, label: "30 giây chống spam" },
  { value: 60, label: "60 giây - Chống spam cao" },
];

export const MIN_PASSWORD_OPTIONS = [
  { value: 0, label: "Không giới hạn độ dài tối thiểu" },
  { value: 6, label: "6 ký tự - Tối thiểu cơ bản" },
  { value: 8, label: "8 ký tự - Khuyên dùng" },
  { value: 10, label: "10 ký tự - An toàn nâng cao" },
  { value: 12, label: "12 ký tự - Tiêu chuẩn cao" },
];

export const MAX_LOGIN_ATTEMPTS_OPTIONS = [
  { value: 0, label: "Không giới hạn số lần" },
  { value: 3, label: "3 lần nhập sai liên tiếp" },
  { value: 5, label: "5 lần nhập sai - Khuyên dùng" },
  { value: 10, label: "10 lần nhập sai liên tiếp" },
];

export const SYNC_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Hàng ngày (Vào 00:00 UTC) - Khuyên dùng" },
  { value: "weekly", label: "Hàng tuần (Chủ nhật)" },
  { value: "manual", label: "Thủ công (Chỉ đồng bộ khi có yêu cầu)" },
];

export const CACHE_TTL_OPTIONS = [
  { value: 6, label: "6 giờ - Luôn làm mới dữ liệu" },
  { value: 12, label: "12 giờ" },
  { value: 24, label: "24 giờ (1 ngày) - Khuyên dùng" },
  { value: 48, label: "48 giờ (2 ngày) - Tiết kiệm băng thông" },
];

export const TIMEOUT_OPTIONS = [
  { value: 3, label: "3 giây - Phản hồi nhanh" },
  { value: 5, label: "5 giây - Tiêu chuẩn khuyên dùng" },
  { value: 10, label: "10 giây - Mạng chậm hoặc tải dữ liệu lớn" },
];

export const TWO_FACTOR_METHOD_OPTIONS = [
  {
    value: "authenticator",
    label: "Ứng dụng xác thực (Google Authenticator / Authy) - Khuyên dùng",
  },
  { value: "email", label: "Mã OTP bảo mật gửi qua Email quản trị" },
];

export const SESSION_TIMEOUT_OPTIONS = [
  { value: 15, label: "15 phút - Tối đa an toàn" },
  { value: 30, label: "30 phút" },
  { value: 60, label: "60 phút (1 giờ) - Khuyên dùng" },
  { value: 120, label: "120 phút (2 giờ)" },
  { value: 1440, label: "24 giờ (1 ngày)" },
];

export const ADMIN_PASSWORD_EXPIRY_OPTIONS = [
  { value: 0, label: "Không bao giờ hết hạn" },
  { value: 30, label: "30 ngày" },
  { value: 60, label: "60 ngày" },
  { value: 90, label: "90 ngày - Khuyên dùng" },
  { value: 180, label: "180 ngày (6 tháng)" },
];

export const VALID_TABS = [
  "general",
  "display",
  "content",
  "users",
  "api",
  "security",
];

export const DEFAULT_FORM_DATA = {
  general: {
    websiteName: "Pacific Ocean Portal",
    seoDescription:
      "Cổng thông tin & tra cứu sinh vật biển Thái Bình Dương chuẩn khoa học",
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
};
