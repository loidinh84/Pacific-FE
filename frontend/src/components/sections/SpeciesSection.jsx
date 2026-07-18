import * as Images from "../../assets/Images";
import * as Icons from "../../assets/Icons/index";

const SPECIES = [
  {
    id: "whale-shark",
    tag: "Cá biển",
    name: "Cá mập voi",
    sciName: "Rhincodon typus",
    image: Images.CaMapVoi,
    stats: [
      { val: "18m", label: "Chiều dài" },
      { val: "20T", label: "Cân nặng" },
      { val: "70+", label: "Tuổi thọ" },
    ],
    desc: `Cá mập voi (tên khoa học: Rhincodon typus) là loài cá lớn nhất thế giới và cũng là động vật có xương sống không phải thú lớn nhất còn tồn tại.
Chúng sống chủ yếu ở các vùng biển nhiệt đới ấm và có thể sống tới hơn 70 năm.
Mặc dù có kích thước khổng lồ, cá mập voi lại rất hiền lành và kiếm ăn bằng cách lọc sinh vật phù du, cá nhỏ qua nước biển.
Cơ thể chúng có màu xám xanh với các đốm trắng đặc trưng như "dấu vân tay" giúp nhận diện từng cá thể.
Hiện nay, cá mập voi được xếp vào nhóm loài nguy cấp do bị săn bắt và tác động từ môi trường sống.`,
    reverse: false,
    aos: "fade-right",
  },
  {
    id: "octopus",
    tag: "Đầu túc",
    name: "Bạch tuộc khổng lồ",
    sciName: "Enteroctopus dofleini",
    image: Images.BachTuotKhongLo,
    stats: [
      { val: "6m", label: "Sải tay" },
      { val: "15kg", label: "Cân nặng" },
      { val: "3–5", label: "Tuổi thọ" },
    ],
    desc: `Bạch tuộc khổng lồ (thường là loài Enteroctopus dofleini, hay bạch tuộc khổng lồ Thái Bình Dương) là một trong những loài bạch tuộc lớn nhất thế giới.
Chúng sống chủ yếu ở vùng biển lạnh của Thái Bình Dương, đặc biệt là ven bờ Bắc Mỹ và Nhật Bản.
Loài này có thể sải tay dài tới hơn 4–5 mét và nặng hàng chục kilôgam.
Bạch tuộc khổng lồ nổi tiếng với trí thông minh cao, khả năng giải quyết vấn đề và ngụy trang bằng cách thay đổi màu sắc, kết cấu da.
Tuổi thọ của chúng khá ngắn, thường chỉ khoảng 3–5 năm, và chúng chết sau khi sinh sản.`,
    reverse: true,
    aos: "fade-left",
  },
];

export default function SpeciesSection() {
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
            Sinh vật nổi tiếng
          </h2>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-14">
          {SPECIES.map((sp) => (
            <article
              key={sp.id}
              className={`bg-pacific-figma-card rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12`}
              data-aos={sp.aos}
            >
              {/* Image */}
              <div
                className={`relative h-72 lg:h-auto min-h-[320px] lg:col-span-5 ${
                  sp.reverse ? "lg:order-last" : ""
                }`}
              >
                <img
                  src={sp.image}
                  alt={sp.name}
                  className="absolute inset-0 w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center lg:col-span-7 text-white">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                  {sp.name}
                </h3>
                <p className="text-lg text-pacific-blue-light italic mb-4">
                  {sp.sciName}
                </p>
                <div className="w-10 h-1 bg-gradient-to-r from-pacific-blue-bright to-pacific-teal rounded-full mb-6" />

                <p className="text-white/80 leading-relaxed mb-6 text-lg whitespace-pre-line font-light">
                  {sp.desc}
                </p>

                {/* Stats */}
                <div className="flex gap-8 mb-6">
                  {sp.stats.map(({ val, label }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-xl md:text-2xl font-black text-pacific-blue-light font-heading">
                        {val}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-6" data-aos="fade-up">
          <button className="mx-auto flex items-center justify-center gap-2 text-xs text-white/60 hover:text-white transition-all cursor-pointer underline">
            Xem tất cả <Icons.ArrowBackLong className="rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
