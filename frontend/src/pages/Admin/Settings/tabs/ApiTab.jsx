import {
  Layers,
  Clock,
  Sparkles,
  Database,
  ShieldCheck,
  Zap,
  Server,
  RefreshCw,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";
import CustomSelect from "../../Dashboard/components/CustomSelect";
import {
  SYNC_FREQUENCY_OPTIONS,
  CACHE_TTL_OPTIONS,
  TIMEOUT_OPTIONS,
} from "../settingsConstants";

export default function ApiTab({
  formData,
  updateSection,
  isDark,
  apiProviders,
  isLoadingProviders,
  testingProviderId,
  isTestingAll,
  providerPings,
  isManualSyncing,
  handleToggleProvider,
  handleTestProvider,
  handleTestAllProviders,
  handleTriggerManualSync,
}) {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header Tab */}
      <div className="border-b pb-4 border-white/10">
        <h1 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2">
          <span>API & Dữ liệu</span>
        </h1>
        <p
          className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Quản lý kết nối các cổng dữ liệu sinh học đại dương quốc tế, chu kỳ
          đồng bộ và bộ nhớ đệm
        </p>
      </div>

      {/* 5.1 Khối Cấu hình đồng bộ & Bộ nhớ đệm dữ liệu */}
      <div
        className={`rounded-2xl border p-5 md:p-6 space-y-5 ${
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Layers size={14} />
            <span>Cấu hình đồng bộ & Bộ nhớ đệm dữ liệu</span>
          </h3>
          <p
            className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Điều khiển chu kỳ cập nhật tự động và tối ưu tốc độ tra cứu danh mục
            sinh vật biển
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
                <h4 className="text-sm font-bold">
                  Tần suất đồng bộ dữ liệu tự động
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Chu kỳ hệ thống tự động kiểm tra và làm mới dữ liệu sinh vật từ
                  các nguồn quốc tế.
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
                <h4 className="text-sm font-bold">
                  Tự động bổ sung thông tin khi tạo loài mới
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Khi nhập tên khoa học, hệ thống tự động tra cứu họ, bộ, mô tả
                  và kích thước từ các nguồn dữ liệu mở.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.api.autoEnrichNewSpecies}
              onClick={() =>
                updateSection(
                  "api",
                  "autoEnrichNewSpecies",
                  !formData.api.autoEnrichNewSpecies,
                )
              }
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
                  formData.api.autoEnrichNewSpecies
                    ? "translate-x-5"
                    : "translate-x-0"
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
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Lưu tạm kết quả tra cứu ngoài máy chủ để tăng tốc độ tải trang
                  và tiết kiệm băng thông.
                </p>
              </div>
            </div>

            <CustomSelect
              options={CACHE_TTL_OPTIONS}
              value={formData.api.cacheTtlHours ?? 24}
              onChange={(val) =>
                updateSection("api", "cacheTtlHours", Number(val))
              }
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
                <h4 className="text-sm font-bold">
                  Tự động chuyển cổng dữ liệu dự phòng
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Khi một cổng dữ liệu bị nghẽn mạng hoặc gián đoạn, tự động
                  chuyển sang nguồn kế tiếp.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={formData.api.enableTaxonomyFallback}
              onClick={() =>
                updateSection(
                  "api",
                  "enableTaxonomyFallback",
                  !formData.api.enableTaxonomyFallback,
                )
              }
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
                  formData.api.enableTaxonomyFallback
                    ? "translate-x-5"
                    : "translate-x-0"
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
                <h4 className="text-sm font-bold">
                  Thời gian chờ tối đa cho mỗi yêu cầu
                </h4>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Hủy yêu cầu và trả về dữ liệu nội bộ nếu nguồn dữ liệu ngoài
                  phản hồi quá thời gian quy định.
                </p>
              </div>
            </div>

            <CustomSelect
              options={TIMEOUT_OPTIONS}
              value={formData.api.timeoutSeconds ?? 5}
              onChange={(val) =>
                updateSection("api", "timeoutSeconds", Number(val))
              }
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
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Server size={14} />
              <span>Các cổng kết nối dữ liệu sinh vật biển quốc tế</span>
            </h3>
            <p
              className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Các nguồn dữ liệu mở phục vụ tra cứu danh pháp, phân loại học và
              hình ảnh sinh học
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
            <span className="text-xs">
              Đang tải danh sách cổng dữ liệu...
            </span>
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
                          <p
                            className={`text-[11px] line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {provider.desc || "Cổng dữ liệu sinh học đại dương"}
                          </p>
                        </div>
                      </div>

                      {/* Công tắc Bật/Tắt cổng */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={provider.isEnabled}
                        onClick={() =>
                          handleToggleProvider(provider.id, provider.isEnabled)
                        }
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
                            provider.isEnabled
                              ? "translate-x-4"
                              : "translate-x-0"
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
                          <span
                            className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {provider.isEnabled
                              ? "Sẵn sàng kết nối"
                              : "Đã tạm dừng"}
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
          isDark
            ? "bg-[#152345] border-white/10"
            : "bg-slate-50 border-slate-200"
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
            <p
              className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Kích hoạt quét và chuẩn hóa toàn bộ dữ liệu phân loại học của các
              loài sinh vật biển hiện có ngay lúc này mà không cần chờ chu kỳ tự
              động.
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
  );
}
