import {
  Sun,
  Moon,
  Globe,
  Sparkles,
  Box,
  Volume2,
  Waves,
  Check,
} from "lucide-react";

export default function DisplayTab({
  formData,
  updateSection,
  isDark,
  toggleTheme,
}) {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header Tab */}
      <div className="border-b pb-4 border-white/10">
        <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
          <span>Hiển thị & Ngôn ngữ</span>
        </h1>
        <p
          className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Cấu hình chủ đề giao diện sáng/tối, ngôn ngữ mặc định và các tính năng
          đa phương tiện 3D & âm thanh sinh vật
        </p>
      </div>

      {/* 2.1 Khối Giao diện hệ thống (Theme Mode) */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Sun size={14} />
            <span>Giao diện hệ thống</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Chọn chủ đề màu sắc hiển thị phù hợp với thị giác và điều kiện ánh
            sáng làm việc
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
                  <span className="text-[11px] text-slate-400">
                    Tông màu đại dương sâu
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDark ? "border-cyan-400 bg-cyan-500" : "border-slate-400"
                }`}
              >
                {isDark && (
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="text-slate-900"
                  />
                )}
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
              Dịu mắt khi làm việc buổi tối, tôn vinh sắc thái các rạn san hô
              và sinh vật biển phát quang sinh học.
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
                  <span className="text-[11px] text-slate-500">
                    Sáng sủa, thanh lịch
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  !isDark ? "border-blue-600 bg-blue-600" : "border-slate-500"
                }`}
              >
                {!isDark && (
                  <Check size={12} strokeWidth={3} className="text-white" />
                )}
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
              Tối ưu độ tương phản, phù hợp khi thuyết trình hoặc sử dụng ở
              môi trường ánh sáng tự nhiên mạnh.
            </p>
          </div>
        </div>
      </div>

      {/* 2.2 Khối Ngôn ngữ mặc định hệ thống */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Globe size={14} />
            <span>Ngôn ngữ mặc định hệ thống</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Ngôn ngữ hiển thị khởi đầu khi khách truy cập mới lần đầu vào
            portal
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
                <p
                  className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
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
                <Check
                  size={12}
                  strokeWidth={3}
                  className={isDark ? "text-slate-900" : "text-white"}
                />
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
                <p
                  className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
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
                <Check
                  size={12}
                  strokeWidth={3}
                  className={isDark ? "text-slate-900" : "text-white"}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2.3 Khối Đa phương tiện & Trải nghiệm đại dương */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Đa phương tiện tương tác & Trải nghiệm đại dương</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Kiểm soát các công nghệ tương tác đồ họa 3D, âm thanh thủy âm và
            hiệu ứng môi trường
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
                  <h4 className="text-sm font-bold">
                    Kích hoạt trình xem 3D sinh vật
                  </h4>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Cho phép người dùng xoay 360 độ và giải phẫu chi tiết mô hình
                  3D sinh vật ở trang chi tiết loài và trang /3d.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.display.enable3DViewer}
              onClick={() =>
                updateSection(
                  "display",
                  "enable3DViewer",
                  !formData.display.enable3DViewer,
                )
              }
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
                  formData.display.enable3DViewer
                    ? "translate-x-5"
                    : "translate-x-0"
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
                  <h4 className="text-sm font-bold">
                    Tự động phát âm thanh sinh vật
                  </h4>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Tự động phát tiếng kêu đặc trưng của sinh vật hoặc âm thanh
                  sóng ngầm khi mở trang chi tiết loài.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.display.enableAudioAutoPlay}
              onClick={() =>
                updateSection(
                  "display",
                  "enableAudioAutoPlay",
                  !formData.display.enableAudioAutoPlay,
                )
              }
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
                  formData.display.enableAudioAutoPlay
                    ? "translate-x-5"
                    : "translate-x-0"
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
                  <h4 className="text-sm font-bold">
                    Hiệu ứng bọt khí & Ánh sáng đại dương
                  </h4>
                </div>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Hiển thị luồng sáng huyền ảo dưới đáy biển và các hạt bong
                  bóng nước nổi lơ lửng trên toàn bộ portal.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.display.enableOceanEffects !== false}
              onClick={() =>
                updateSection(
                  "display",
                  "enableOceanEffects",
                  formData.display.enableOceanEffects === false,
                )
              }
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
                  formData.display.enableOceanEffects !== false
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
