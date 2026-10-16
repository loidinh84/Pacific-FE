import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Network, ArrowRight, ShieldAlert, MapPin, Zap } from "lucide-react";
import { LightbulbIcon } from "../../assets/Icons";

export function SemanticKnowledgeSection({
  loading,
  data,
  detectedIntent,
  query,
  onClear,
}) {
  if (!query || (!loading && (!data || data.length === 0))) {
    return null;
  }

  const redListColors = {
    CR: "bg-red-500/20 text-red-300 border-red-500/40",
    EN: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    VU: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    NT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    LC: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };

  return (
    <section id="semantic-results" className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0c2444]/90 to-[#08182f]/95 border border-cyan-500/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider mb-2">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>Phân tích tri thức ngữ nghĩa sinh thái</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              <span>Kết quả phân giải cho câu hỏi:</span>
              <span className="text-cyan-300 italic font-medium">"{query}"</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {detectedIntent?.relationshipType && (
              <span className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-medium">
                Kiểu: {detectedIntent.relationshipType}
              </span>
            )}
            {detectedIntent?.zone && (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1">
                <MapPin size={12} /> {detectedIntent.zone}
              </span>
            )}
            {detectedIntent?.redList && (
              <span className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium flex items-center gap-1">
                <ShieldAlert size={12} /> Sách Đỏ {detectedIntent.redList}
              </span>
            )}
            <button
              onClick={onClear}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Đóng kết quả
            </button>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-cyan-200">Đang truy vấn mạng lưới tri thức sinh thái Biển Đông...</p>
          </div>
        )}

        {/* ── RESULTS GRID ── */}
        {!loading && data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 relative z-10">
            {data.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden shadow-lg"
              >
                {/* Top Section: Photo + Basic Meta */}
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.commonName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                          Pacific
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                          {item.code || "VN-MARINE"}
                        </span>
                        {item.redList && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              redListColors[item.redList] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
                            }`}
                          >
                            {item.redList}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {item.commonName}
                      </h3>
                      <p className="text-xs text-slate-400 italic font-serif truncate">
                        {item.scientificName}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                      <Zap size={12} className="text-amber-400" />
                      <span>{item.role || "Mối quan hệ sinh học"}</span>
                    </span>
                  </div>

                  {/* Diễn giải tri thức ngữ nghĩa (Scientific explanation box) */}
                  <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/20 mb-3 text-xs text-slate-300 leading-relaxed font-sans">
                    <p className="text-[11px] text-cyan-400 font-bold tracking-wider mb-1 flex items-center gap-1.5">
                      <LightbulbIcon className="w-3.5 h-3.5 text-amber-400 stroke-current shrink-0" />
                      <span>Diễn giải tri thức sinh thái</span>
                    </p>
                    <p className="line-clamp-3">{item.semanticReason}</p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px] flex items-center gap-1">
                    <MapPin size={11} className="shrink-0 text-cyan-400" />
                    <span className="truncate">{item.zone || "Biển Đông"}</span>
                  </div>

                  <Link
                    to={`/species/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-200 hover:text-white text-xs font-semibold transition-all group-hover:translate-x-0.5"
                  >
                    <span>Xem loài</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SemanticKnowledgeSection;
