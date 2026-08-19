import { useLanguage } from "../../context/LanguageContext";
import * as Images from "../../assets/Images";

const SPECIES = [
  {
    id: "whale-shark",
    tagVi: "Cá biển",
    tagEn: "Marine Fish",
    nameVi: "Cá mập voi",
    nameEn: "Whale Shark",
    sciName: "Rhincodon typus",
    image: Images.CaMapVoi,
    stats: [
      { val: "18m", labelVi: "Chiều dài", labelEn: "Length" },
      { val: "20T", labelVi: "Cân nặng", labelEn: "Weight" },
      { val: "70+", labelVi: "Tuổi thọ", labelEn: "Lifespan" },
    ],
    descVi: `Cá mập voi (tên khoa học: Rhincodon typus) là loài cá lớn nhất thế giới và cũng là động vật có xương sống không phải thú lớn nhất còn tồn tại. Chúng sống chủ yếu ở các vùng biển nhiệt đới ấm và có thể sống tới hơn 70 năm. Mặc dù có kích thước khổng lồ, cá mập voi lại rất hiền lành và kiếm ăn bằng cách lọc sinh vật phù du, cá nhỏ qua nước biển.`,
    descEn: `The whale shark (Rhincodon typus) is the largest known extant fish species and the largest non-mammalian vertebrate. They inhabit warm tropical seas and can live over 70 years. Despite their massive size, whale sharks are gentle filter-feeders that consume plankton and small fish.`,
    reverse: false,
    aos: "fade-right",
  },
  {
    id: "octopus",
    tagVi: "Đầu túc",
    tagEn: "Cephalopod",
    nameVi: "Bạch tuộc khổng lồ",
    nameEn: "Giant Pacific Octopus",
    sciName: "Enteroctopus dofleini",
    image: Images.BachTuotKhongLo,
    stats: [
      { val: "6m", labelVi: "Sải tay", labelEn: "Arm Span" },
      { val: "15kg", labelVi: "Cân nặng", labelEn: "Weight" },
      { val: "3–5", labelVi: "Tuổi thọ", labelEn: "Lifespan" },
    ],
    descVi: `Bạch tuộc khổng lồ (loài Enteroctopus dofleini, hay bạch tuộc khổng lồ Thái Bình Dương) là một trong những loài bạch tuộc lớn nhất thế giới. Chúng sống chủ yếu ở vùng biển lạnh của Thái Bình Dương, nổi tiếng với trí thông minh cao, khả năng giải quyết vấn đề và ngụy trang vi diệu.`,
    descEn: `The giant Pacific octopus (Enteroctopus dofleini) is one of the largest octopus species in the world. Inhabiting the cold waters of the Pacific, they are renowned for high intelligence, problem-solving skills, and remarkable camouflage abilities.`,
    reverse: true,
    aos: "fade-left",
  },
];

export default function SpeciesSection() {
  const { language, t } = useLanguage();

  return (
    <section
      id="species"
      className="bg-pacific-figma-dark py-15 relative overflow-hidden"
    >
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-pacific-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-black text-white font-heading">
            {t("species.title")}
          </h2>
          <p className="text-sm md:text-base text-pacific-blue-pale mt-3 max-w-xl mx-auto font-medium">
            {t("species.subtitle")}
          </p>
        </div>

        {/* Species List */}
        <div className="flex flex-col gap-20">
          {SPECIES.map((s) => {
            const tag = language === "en" ? s.tagEn : s.tagVi;
            const name = language === "en" ? s.nameEn : s.nameVi;
            const desc = language === "en" ? s.descEn : s.descVi;

            return (
              <div
                key={s.id}
                className="bg-pacific-figma-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden"
                data-aos={s.aos}
                data-aos-duration="900"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Tag */}
                      <span className="inline-block px-3 py-1 bg-pacific-blue-bright/20 border border-pacific-blue-bright/40 text-pacific-blue-light text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                        {tag}
                      </span>

                      {/* Name & SciName */}
                      <h3 className="text-2xl md:text-3xl font-black text-white font-heading mb-1">
                        {name}
                      </h3>
                      <p className="text-xs text-pacific-blue-pale italic mb-6">
                        {s.sciName}
                      </p>

                      {/* Description */}
                      <p className="text-sm md:text-base text-white/80 leading-relaxed mb-8">
                        {desc}
                      </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                      {s.stats.map((st, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-xl md:text-2xl font-black text-pacific-cyan font-heading">
                            {st.val}
                          </p>
                          <p className="text-xs text-pacific-text-muted mt-1">
                            {language === "en" ? st.labelEn : st.labelVi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Image */}
                  <div className="lg:col-span-5 flex justify-center items-center">
                    <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex justify-center items-center p-6 shadow-inner">
                      <img
                        src={s.image}
                        alt={name}
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14" data-aos="fade-up">
          <button className="px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-pacific-blue-bright to-pacific-teal shadow-[0_4px_20px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.6)] active:translate-y-0.5 transition-all cursor-pointer text-sm">
            {t("species.btnViewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
