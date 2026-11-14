import { Link } from "react-router-dom";
import { Box, Waves, Share2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function CorePillarsSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const pillars = [
    {
      id: "3d",
      icon: Box,
      tag: isEn ? "3D WebGL Engine" : "Công nghệ 3D WebGL",
      tagColor: "text-cyan-300 bg-cyan-500/10 border-cyan-400/30",
      title: isEn ? "Interactive 3D Anatomy & Dissection" : "Giải phẫu sinh học 3D 360°",
      desc: isEn
        ? "Examine marine creatures in 360-degree rotation, dissect biological layers, and explore detailed anatomical structures."
        : "Xoay đa chiều 360 độ, bóc tách từng lớp cơ quan và khám phá chi tiết giải phẫu học chuẩn khoa học của sinh vật biển.",
      link: "/species/ca-map-trang",
      linkText: isEn ? "Explore 3D Model" : "Khám phá mẫu 3D",
      gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
      borderHover: "hover:border-cyan-400/50 hover:shadow-cyan-500/20",
    },
    {
      id: "depth",
      icon: Waves,
      tag: isEn ? "UNESCO OBIS Empirical Data" : "Dữ liệu quan trắc UNESCO OBIS",
      tagColor: "text-blue-300 bg-blue-500/10 border-blue-400/30",
      title: isEn ? "5 Ocean Depth Exploration Layers" : "Thám hiểm 5 tầng độ sâu Biển Đông",
      desc: isEn
        ? "Journey from sunlit surface waters (0-200m) down to the mysterious Hadal trenches (>6,000m) with real-world depth and temperature data."
        : "Hành trình từ tầng mặt ngập tràn ánh sáng (0 - 200m) xuống vực thẳm Hadal (>6,000m) với dữ liệu nhiệt độ và áp suất thực tế từ OBIS.",
      link: "/ocean-depth",
      linkText: isEn ? "Start Deep Dive" : "Bắt đầu lặn sâu",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      borderHover: "hover:border-blue-400/50 hover:shadow-blue-500/20",
    },
    {
      id: "graph",
      icon: Share2,
      tag: isEn ? "Ecosystem Food Web" : "Mạng lưới tương tác sinh thái",
      tagColor: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
      title: isEn ? "Ecosystem Knowledge Graph" : "Đồ thị tri thức & Chuỗi thức ăn",
      desc: isEn
        ? "Visualize complex ecological interactions: predation, symbiosis, and trophic balance across marine habitats."
        : "Khám phá bản đồ tương tác đa loài: quan hệ săn mồi, cộng sinh, cạnh tranh sinh học và cân bằng chuỗi thức ăn đại dương.",
      link: "/knowledge-graph",
      linkText: isEn ? "View Knowledge Graph" : "Xem đồ thị tri thức",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/20",
    },
    {
      id: "conservation",
      icon: ShieldCheck,
      tag: isEn ? "IUCN Red List & Gov Decrees" : "Sách Đỏ IUCN & Nghị định 84",
      tagColor: "text-amber-300 bg-amber-500/10 border-amber-400/30",
      title: isEn ? "Conservation Status & Red List" : "Giám sát bảo tồn & Sách Đỏ IUCN",
      desc: isEn
        ? "Real-time synchronization with IUCN Red List categories and Vietnamese national protection laws for endangered species."
        : "Đối soát trực tiếp cấp độ đe dọa theo Danh lục Đỏ IUCN, Sách Đỏ Việt Nam và các chính sách bảo vệ động vật nguy cấp.",
      link: "/search",
      linkText: isEn ? "Search Protected Species" : "Tra cứu danh mục bảo tồn",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      borderHover: "hover:border-amber-400/50 hover:shadow-amber-500/20",
    },
  ];

  return (
    <section className="bg-pacific-figma-dark pt-20 pb-24 relative overflow-hidden z-20 border-t border-white/5">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-40 bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 uppercase mb-4">
            <Sparkles size={13} />
            <span>{isEn ? "Core Pillars" : "Trụ Cột Cốt Lõi"}</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-4">
            {isEn ? "The Pillars of Ocean Discovery" : "Nền Tảng Trải Nghiệm & Tri Thức Đại Dương"}
          </h2>
          <p className="text-base text-slate-300/80 leading-relaxed font-normal">
            {isEn
              ? "Combining scientific taxonomy, interactive 3D anatomy, and depth exploration into one unified portal."
              : "Tích hợp công nghệ giải phẫu 3D, mô phỏng 5 tầng độ sâu thực tế và dữ liệu bảo tồn chuẩn mực quốc tế."}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className={`relative rounded-3xl p-8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl transition-all duration-300 group shadow-xl ${item.borderHover}`}
              >
                {/* Background ambient lighting */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                  <div>
                    {/* Top row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all duration-300">
                        <Icon size={24} />
                      </div>
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white font-heading mb-3 group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-300/80 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 group-hover:text-cyan-200 group-hover:translate-x-1 transition-all pt-2"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

