import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Waves, Rocket, Flame, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { fetchNews } from "../../services/newsApi";
import { OCEAN_FUN_FACTS } from "../../mocks/speciesMock";

function getFactIcon(fact) {
  const text = `${fact.badgeVi || ""} ${fact.titleVi || ""} ${fact.slug || ""}`.toLowerCase();
  if (text.includes("địa chất") || text.includes("núi lửa") || text.includes("lửa")) {
    return <Flame size={18} className="text-rose-400" />;
  }
  if (text.includes("bí ẩn") || text.includes("nemo") || text.includes("vũ trụ")) {
    return <Rocket size={18} className="text-pink-400" />;
  }
  if (text.includes("địa lý") || text.includes("biển") || text.includes("sóng")) {
    return <Waves size={18} className="text-cyan-400" />;
  }
  return <Sparkles size={18} className="text-amber-400" />;
}

export function OceanFunFacts() {
  const { language, t } = useLanguage();
  const [funFacts, setFunFacts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadFunFacts = async () => {
      try {
        const res = await fetchNews({ category: "fun-facts", limit: 6 });
        const items = res?.articles || [];
        if (items.length > 0 && isMounted) {
          const mapped = items.map((art) => ({
            id: art.id,
            slug: art.slug,
            titleVi: art.title,
            titleEn: art.title,
            descVi: art.excerpt || art.clean_content || art.content || "",
            descEn: art.excerpt || art.clean_content || art.content || "",
            badgeVi: art.badge || "Sự thật đại dương",
            badgeEn: art.badge || "Ocean Fact",
            statVal: art.stat_val || "100%",
            statTitleVi: art.stat_title || "KHÁM PHÁ ĐẠI DƯƠNG",
            statTitleEn: art.stat_title || "OCEAN DISCOVERY",
            image: art.cover_url,
          }));
          setFunFacts(mapped);
          return;
        }
      } catch (err) {
        console.warn("Không thể tải tin tức fun-facts từ API, dùng dữ liệu dự phòng:", err);
      }

      // Dữ liệu dự phòng nếu backend chưa có bài hoặc kết nối tạm thời ngắt
      if (isMounted) {
        setFunFacts(OCEAN_FUN_FACTS);
      }
    };

    loadFunFacts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayFacts = funFacts.length > 0 ? funFacts : OCEAN_FUN_FACTS;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white font-heading">
          {t("searchPage.funFactsTitle")}
        </h2>
        <Link
          to="/news?category=fun-facts"
          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayFacts.slice(0, 3).map((fact) => {
          const title = language === "en" ? fact.titleEn : fact.titleVi;
          const desc = language === "en" ? fact.descEn : fact.descVi;
          const badge = language === "en" ? fact.badgeEn : fact.badgeVi;
          const statTitle = language === "en" ? fact.statTitleEn : fact.statTitleVi;
          const linkTarget = fact.slug ? `/news/${fact.slug}` : "/news";

          return (
            <Link
              key={fact.id || fact.slug}
              to={linkTarget}
              className="bg-[#183c66] hover:bg-[#1f4a7d] border border-white/15 hover:border-sky-400/40 rounded-2xl overflow-hidden transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-1 block cursor-pointer"
            >
              {/* Dải ảnh thu nhỏ */}
              <div className="relative h-36 overflow-hidden bg-[#112d4e] border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12)_0%,transparent_70%)]" />
                {fact.image ? (
                  <img
                    src={fact.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Waves size={32} className="opacity-30" />
                  </div>
                )}
                {/* Biểu tượng đặc trưng - hoàn toàn dùng icon SVG Lucide React, không dùng emoji ký tự */}
                <span className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/50 border border-white/15 select-none shadow-md">
                  {getFactIcon(fact)}
                </span>
              </div>

              {/* Nội dung thẻ */}
              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/12 border border-cyan-500/25 text-cyan-300 text-[10px] font-bold tracking-wider mb-3">
                  {badge}
                </span>

                <h3 className="text-sm font-bold text-white font-heading leading-snug mb-2 group-hover:text-sky-300 transition-colors line-clamp-2">
                  {title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed mb-4 line-clamp-3">
                  {desc}
                </p>

                {/* Khối thông số ấn tượng */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <p className="text-xl md:text-2xl font-black text-cyan-300 font-heading">
                    {fact.statVal}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide mt-1">
                    {statTitle}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
