import { useState } from "react";
import { X, RefreshCw, CheckCircle2, Loader2, Radio } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function ApiSyncModal({ isOpen, onClose, onSyncAll }) {
  const { isDark } = useTheme();
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  const [apiStatuses] = useState([
    { name: "GBIF API", status: "ok", desc: "Hoạt động bình thường" },
    { name: "iNaturalist API", status: "ok", desc: "Hoạt động bình thường" },
    { name: "OBIS API", status: "error", desc: "Lỗi kết nối - 1 giờ trước" },
  ]);

  const [failedSpecies, setFailedSpecies] = useState([
    {
      id: "err-1",
      name: "Cá voi lưng gù",
      error: "Không tải được từ GBIF",
      image: "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "err-2",
      name: "Bạch tuộc khổng lồ",
      error: "Thiếu hình ảnh từ iNaturalist",
      image: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=150&q=80",
    },
  ]);

  if (!isOpen) return null;

  const handleRetryItem = (id) => {
    setRetryingId(id);
    setTimeout(() => {
      setFailedSpecies((prev) => prev.filter((item) => item.id !== id));
      setRetryingId(null);
    }, 1000);
  };

  const handleSyncAllClick = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      setFailedSpecies([]);
      if (onSyncAll) onSyncAll();
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
      isDark ? "bg-black/75 text-white" : "bg-slate-900/50 text-slate-800"
    }`}>
      {/* Theme-Aware Glassmorphism Modal Card */}
      <div className={`w-full max-w-xl backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-[#0d1730]/90 border-cyan-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(6,182,212,0.15)]"
          : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl"
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              isDark
                ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"
                : "bg-cyan-50 border-cyan-200 text-cyan-600"
            }`}>
              <Radio size={16} />
            </div>
            <h2 className={`text-lg font-bold font-heading tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>Đồng bộ API</h2>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? "bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: API Connection Health Status */}
          <div>
            <h3 className={`text-sm font-bold mb-3 ${
              isDark ? "text-cyan-300" : "text-cyan-700"
            }`}>
              Trạng thái kết nối API
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {apiStatuses.map((api, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 shadow-sm transition-all ${
                    isDark
                      ? "bg-white/5 border-white/15 hover:border-white/30"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{api.name}</span>
                  <div className="flex items-center gap-2">
                    {api.status === "ok" ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium leading-tight ${
                        api.status === "ok"
                          ? isDark ? "text-emerald-300" : "text-emerald-600"
                          : isDark ? "text-rose-300" : "text-rose-600"
                      }`}
                    >
                      {api.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Sync Error Species List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}>
                Sinh vật có dữ liệu lỗi từ API
              </h3>
              <button
                type="button"
                onClick={handleSyncAllClick}
                disabled={isSyncingAll}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
              >
                {isSyncingAll ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <RefreshCw size={13} />
                )}
                <span>Đồng bộ tất cả</span>
              </button>
            </div>

            {failedSpecies.length > 0 ? (
              <div className="space-y-2.5">
                {failedSpecies.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                      isDark
                        ? "bg-white/5 border-white/15 hover:border-white/30"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm"
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</h4>
                        <span className="text-xs text-rose-500 font-medium">
                          {item.error}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRetryItem(item.id)}
                      disabled={retryingId === item.id}
                      className={`px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm active:scale-95 ${
                        isDark
                          ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                          : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {retryingId === item.id ? (
                        <Loader2 size={12} className="animate-spin text-cyan-400" />
                      ) : (
                        <span>Thử lại</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-1 shadow-md ${
                isDark
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                <CheckCircle2 size={24} className={`mx-auto ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <p className="text-sm font-bold">
                  Tất cả sinh vật đã được đồng bộ dữ liệu thành công!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3.5 border-t flex justify-end backdrop-blur-md ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${
              isDark
                ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
