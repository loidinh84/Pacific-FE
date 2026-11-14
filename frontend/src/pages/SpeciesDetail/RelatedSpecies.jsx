import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Gauge } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { fetchRelatedSpecies } from "../../services/speciesApi";
import { formatSizeRange, formatDepthRange } from "../../utils/speciesFormatters";

export function RelatedSpecies({ currentSpeciesId }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [relatedState, setRelatedState] = useState({ targetId: null, items: [] });

  useEffect(() => {
    if (!currentSpeciesId) return;
    let isMounted = true;
    const requestedId = String(currentSpeciesId);

    fetchRelatedSpecies(requestedId).then((items) => {
      if (!isMounted) return;
      setRelatedState({ targetId: requestedId, items });
    });

    return () => {
      isMounted = false;
    };
  }, [currentSpeciesId]);

  const requestedId = currentSpeciesId ? String(currentSpeciesId) : null;
  const related = relatedState.targetId === requestedId ? relatedState.items : [];
  const isLoading = Boolean(requestedId) && relatedState.targetId !== requestedId;

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans">
      {/* Tiêu đề mục */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
              {t("speciesDetail.relatedTitle") || "Sinh vật tương tự"}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
        >
          <span>{isEn ? "View all catalog" : "Xem tất cả"}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Grid thẻ sinh vật tương tự từ dữ liệu thực tế */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-[#183c66]/60 border border-white/10 animate-pulse"
              />
            ))
          : related.map((s) => {
              const name = s.commonName;
              const category = s.group?.name || null;
              const statusCode =
                s.conservationStatus?.code || s.vietnamRedListStatus || null;
              const sizeText = formatSizeRange(s.sizeMinCm, s.sizeMaxCm);
              const depthText = formatDepthRange(s.depthMinM, s.depthMaxM);

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    navigate(`/species/${s.slug || s.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group bg-[#183c66] hover:bg-[#1f4a7d] border border-white/15 hover:border-sky-400/50 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  {/* Ảnh sinh vật */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 select-none"
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.style.opacity = "0";
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#183c66] via-transparent to-black/30 pointer-events-none" />

                    {/* Huy hiệu phân loại */}
                    {category && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-md text-cyan-300 border border-white/10 max-w-[70%] truncate">
                        {category}
                      </span>
                    )}

                    {/* Huy hiệu mã bảo tồn chuẩn */}
                    {statusCode && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/25 backdrop-blur-md text-rose-200 border border-rose-500/40 uppercase">
                        {statusCode}
                      </span>
                    )}
                  </div>

                  {/* Thông tin mô tả */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-snug">
                        {name}
                      </h3>
                      <p className="text-slate-400 text-xs font-serif italic mt-0.5 line-clamp-1">
                        {s.scientificName}
                      </p>
                    </div>

                    {/* Thông số nhanh: Kích thước & Độ sâu */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Gauge size={12} className="text-cyan-400 shrink-0" />
                        <span className="truncate">
                          {sizeText || (isEn ? "Updating" : "Đang cập nhật")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Compass size={12} className="text-indigo-400 shrink-0" />
                        <span className="truncate">
                          {depthText || (isEn ? "Updating" : "Đang cập nhật")}
                        </span>
                      </div>
                    </div>

                    {/* Nút khám phá */}
                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                      <span>{isEn ? "Learn more" : "Khám phá"}</span>
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}

export default RelatedSpecies;
