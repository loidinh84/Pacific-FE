import {
  Globe,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Check,
  CheckCircle2,
} from "lucide-react";
import * as Images from "../../../../assets/Images";
import CustomSelect from "../../Dashboard/components/CustomSelect";
import { SOCIAL_PRESETS } from "../settingsConstants";

export default function GeneralTab({
  formData,
  updateSection,
  isDark,
  logoInputRef,
  handleLogoFile,
  handleRemoveLogo,
  handleAddSocialLink,
  handleSocialChange,
  handleRemoveSocialLink,
}) {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header Tab */}
      <div className="border-b pb-4 border-white/10">
        <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
          <span>Thông tin chung</span>
        </h1>
        <p
          className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Cấu hình nhận diện thương hiệu, thẻ meta SEO và các kênh truyền thông
          chính thức của cổng thông tin
        </p>
      </div>

      {/* 1.1 Khối Thương hiệu & Biểu tượng Logo */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Globe size={14} />
            <span>Thương hiệu & Biểu tượng Logo</span>
          </h3>
          <span
            className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
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
                onChange={(e) =>
                  updateSection("general", "websiteName", e.target.value)
                }
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-colors ${
                  isDark
                    ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
                placeholder="Pacific Ocean Portal"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Xuất hiện ở góc trên bên trái thanh điều hướng và thẻ tiêu đề
                trang web.
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
                onChange={(e) =>
                  updateSection("general", "seoDescription", e.target.value)
                }
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-colors resize-none leading-relaxed ${
                  isDark
                    ? "bg-[#0b1329] border-white/15 text-white focus:border-cyan-400"
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
                placeholder="Cổng thông tin & tra cứu sinh vật biển Biển Đông chuẩn khoa học..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Khuyến nghị từ 120 đến 160 ký tự để tối ưu hóa hiển thị khi tìm
                kiếm trên Google Search.
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
                {formData.general.logoUrl
                  ? "Thay đổi biểu tượng"
                  : "Tải lên biểu tượng Logo"}
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

        {/* Mô phỏng kết quả tìm kiếm */}
        <div
          className={`rounded-xl p-4 border transition-colors ${
            isDark
              ? "bg-[#0b1329]/80 border-white/10"
              : "bg-white border-slate-200"
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
              <span className="text-slate-300 font-medium">
                https://pacific.org
              </span>
              <span className="text-slate-500">› portal › explore</span>
            </div>

            {/* Title row */}
            <h4 className="text-sm md:text-base font-semibold text-blue-400 hover:underline cursor-pointer truncate">
              {formData.general.websiteName || "Pacific Ocean Portal"} | Tra
              cứu sinh vật biển Biển Đông
            </h4>

            {/* Description snippet */}
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {formData.general.seoDescription ||
                "Cổng thông tin & tra cứu sinh vật biển Biển Đông chuẩn khoa học với mô hình 3D xoay 360 độ và dữ liệu đa dạng sinh học đại dương."}
            </p>
          </div>
        </div>
      </div>

      {/* 1.3 Khối Liên hệ & Mạng xã hội */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-4 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-cyan-400">
              Liên hệ & Kênh truyền thông mạng xã hội
            </h3>
            <p
              className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Xuất hiện ở chân trang (Footer), trang liên hệ và thông báo hệ
              thống
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
                onChange={(e) =>
                  updateSection("general", "contactEmail", e.target.value)
                }
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
                  isDark
                    ? "border-white/10 text-slate-400"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                Chưa có liên kết mạng xã hội nào. Nhấn nút{" "}
                <strong>"Thêm mạng xã hội"</strong> ở trên để bổ sung.
              </div>
            ) : (
              formData.general.socialLinks?.map((link, idx) => {
                const preset = SOCIAL_PRESETS.find(
                  (p) => p.name === link.platform,
                );
                return (
                  <div
                    key={link.id || idx}
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl border transition-all ${
                      isDark
                        ? "bg-[#0b1329]/60 border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {/* Chọn Nền tảng với CustomSelect đồng bộ */}
                    <CustomSelect
                      options={SOCIAL_PRESETS.map((p) => ({
                        value: p.name,
                        label: p.name,
                      }))}
                      value={link.platform}
                      onChange={(val) =>
                        handleSocialChange(link.id, "platform", val)
                      }
                      isDark={isDark}
                      size="sm"
                      className="w-full sm:w-36 shrink-0"
                      buttonClassName="py-2 px-3 text-xs"
                    />

                    {/* Nhập URL liên kết */}
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleSocialChange(link.id, "url", e.target.value)
                      }
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
                          isDark
                            ? "hover:bg-white/10 text-cyan-400"
                            : "hover:bg-slate-100 text-blue-600"
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
                        isDark
                          ? "hover:bg-white/10 text-rose-400"
                          : "hover:bg-rose-50 text-rose-500"
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
  );
}
