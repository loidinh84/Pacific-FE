import { useMemo } from "react";
import { HelpCircle } from "lucide-react";

export function SpeciesFacts({ species, language = "vi" }) {
  const isEn = language === "en";

  const factsList = useMemo(() => {
    // 1. Kiểm tra bioFacts từ mock
    const directFacts = isEn ? species.bioFactsEn : species.bioFactsVi;
    if (Array.isArray(directFacts) && directFacts.length > 0) {
      return directFacts.map((f) => ({
        title: isEn ? "Fascinating Trait" : "Đặc điểm kỳ thú",
        text: f,
      }));
    }

    // 2. Kiểm tra fullBioHighlights từ mock (Bạch tuộc, Cá mập voi, Cá ngừ...)
    const highlights = isEn
      ? species.fullBioHighlightsEn || species.fullBioHighlightsVi
      : species.fullBioHighlightsVi || species.fullBioHighlightsEn;
    if (Array.isArray(highlights) && highlights.length > 0) {
      return highlights.map((h) => ({
        title: h.title,
        text: h.content,
      }));
    }

    // 3. Kiểm tra facts từ cơ sở dữ liệu backend
    if (Array.isArray(species.facts) && species.facts.length > 0) {
      return species.facts.map((f, i) => ({
        title: isEn ? `Discovery Fact #${i + 1}` : `Sự thật khoa học #${i + 1}`,
        text: f.content || f,
      }));
    }

    // 4. Sinh sự thật khoa học thông minh theo nhóm loài
    const nameLower = (
      species.nameVi ||
      species.commonName ||
      ""
    ).toLowerCase();
    const sciLower = (
      species.sciName ||
      species.scientificName ||
      ""
    ).toLowerCase();

    if (nameLower.includes("bạch tuộc") || sciLower.includes("octopus")) {
      return [
        {
          title: isEn ? "Three Hearts & Blue Blood" : "Hệ tuần hoàn 3 trái tim",
          text: isEn
            ? "Possesses three hearts and copper-rich blue blood for optimal oxygen transport in cold ocean depths."
            : "Sở hữu 3 trái tim cùng dòng máu xanh lam chứa gốc đồng, giúp vận chuyển oxy tối đa trong tầng nước sâu.",
        },
        {
          title: isEn
            ? "Decentralized Nervous System"
            : "9 Cụm não bộ phân tán",
          text: isEn
            ? "Two-thirds of its neurons are in its tentacles, allowing arms to taste and move independently."
            : "2/3 số lượng nơron thần kinh nằm ở các xúc tu, cho phép mỗi xúc tu có thể tự nếm vị và cử động độc lập.",
        },
        {
          title: isEn ? "Master of Camouflage" : "Đổi màu sắc trong 0.2 giây",
          text: isEn
            ? "Tens of thousands of chromatophores allow it to match sand, coral, and stone textures instantly."
            : "Hàng vạn tế bào sắc tố giúp sinh vật ngụy trang hòa lẫn vào san hô và đá ngầm chỉ trong tích tắc.",
        },
        {
          title: isEn
            ? "High Intelligence & Tool Use"
            : "Trí khôn vượt trội loài thân mềm",
          text: isEn
            ? "Able to open childproof jars, solve complex mazes, and use coconut shells as portable shields."
            : "Có khả năng mở nắp lọ, giải mê cung phức tạp và biết dùng vỏ dừa làm lá chắn tự vệ dưới đáy biển.",
        },
      ];
    }

    if (
      nameLower.includes("mập") ||
      nameLower.includes("nhám") ||
      sciLower.includes("rhincodon") ||
      sciLower.includes("shark")
    ) {
      return [
        {
          title: isEn
            ? "Bioelectric Sixth Sense"
            : "Giác quan cảm nhận điện trường",
          text: isEn
            ? "Tiny jelly-filled pores across its snout detect electrical fields as faint as one-billionth of a volt."
            : "Mạng lưới lỗ cảm biến quanh mõm phát hiện dòng điện sinh học siêu nhỏ phát ra từ cơ bắp con mồi.",
        },
        {
          title: isEn
            ? "Regenerating Teeth"
            : "Hàng ngàn chiếc răng tự thay thế",
          text: isEn
            ? "Can shed and regrow tens of thousands of teeth in continuous conveyor-belt rows throughout life."
            : "Có thể thay thế hàng chục ngàn chiếc răng xếp thành nhiều hàng băng chuyền liên tục trong vòng đời.",
        },
        {
          title: isEn
            ? "Skin of Dermal Denticles"
            : "Lớp da phủ vảy gai sắc bén",
          text: isEn
            ? "Covered in microscopic tooth-like denticles that minimize water drag and deter parasites."
            : "Lớp da bao phủ bởi vô số vảy gai siêu nhỏ giúp giảm ma sát nước và bơi lướt êm ái.",
        },
        {
          title: isEn
            ? "Ancient Ocean Survivors"
            : "Xuất hiện trước cả cây cối",
          text: isEn
            ? "Patrolled Earth's oceans for over 400 million years, surviving four major mass extinctions."
            : "Tổ tiên cá mập đã thống trị biển hơn 400 triệu năm, xuất hiện trước cây cối và qua 4 cuộc đại tuyệt chủng.",
        },
      ];
    }

    if (
      nameLower.includes("rùa") ||
      nameLower.includes("vích") ||
      nameLower.includes("đồi mồi") ||
      sciLower.includes("chelonia")
    ) {
      return [
        {
          title: isEn ? "Geomagnetic Navigation" : "La bàn từ trường bẩm sinh",
          text: isEn
            ? "Possesses an internal geomagnetic map to cross thousands of miles back to its natal nesting beach."
            : "Sở hữu bản đồ từ trường trong não bộ, giúp vượt hàng ngàn hải lý trở về đúng bãi cát nơi sinh ra để đẻ trứng.",
        },
        {
          title: isEn ? "Salt Excretion Glands" : "Tuyến đào thải muối dư thừa",
          text: isEn
            ? "Specialized eye glands pump out excess swallowed salt, appearing as if crying on sandy shores."
            : "Tuyến muối phía sau mắt đào thải muối dư từ nước biển, tạo hiện tượng như đang khóc khi lên bờ.",
        },
        {
          title: isEn
            ? "Temperature-Dependent Sex"
            : "Nhiệt độ quyết định giới tính",
          text: isEn
            ? "Nest sand temperature determines hatchling sex: warmer sand produces females, cooler yields males."
            : "Nhiệt độ cát ấp trứng quyết định giới tính: cát ấm sinh ra rùa cái, trong khi cát mát hơn sinh rùa đực.",
        },
        {
          title: isEn
            ? "Breath-Holding Mastery"
            : "Khả năng nhịn thở nhiều giờ",
          text: isEn
            ? "When resting on reefs, its heart rate slows dramatically, enabling it to hold breath for 4-7 hours."
            : "Khi nghỉ dưới rạn san hô, nhịp tim giảm sâu cho phép chúng nhịn thở liên tục từ 4 đến 7 tiếng đồng hồ.",
        },
      ];
    }

    // Mặc định sinh vật biển Biển Đông
    return [
      {
        title: isEn
          ? "Keystone Ecological Role"
          : "Mắt xích cân bằng sinh thái",
        text: isEn
          ? "Regulates prey populations and maintains biological diversity across East Sea coral reefs."
          : "Đóng vai trò điều hòa chuỗi thức ăn và duy trì độ đa dạng sinh học cho các rạn san hô Biển Đông.",
      },
      {
        title: isEn
          ? "Hydrodynamic Efficiency"
          : "Cấu trúc thủy động lực học tối ưu",
        text: isEn
          ? "Body contours have evolved over millions of years to glide efficiently against monsoon currents."
          : "Hình dáng cơ thể được tiến hóa để lướt êm ái chống lại các dòng hải lưu gió mùa mạnh mẽ.",
      },
      {
        title: isEn
          ? "Tropical Habitat Adaptation"
          : "Thích nghi hoàn hảo với Biển Đông",
        text: isEn
          ? "Thrives under 33-34.5‰ salinity and seasonal tropical monsoonal temperature shifts."
          : "Phát triển lý tưởng trong môi trường độ mặn 33–34.5‰ và dòng hải lưu nhiệt đới Việt Nam.",
      },
      {
        title: isEn
          ? "Acute Sensory Perception"
          : "Cảm biến dao động nước tinh nhạy",
        text: isEn
          ? "Equipped with specialized sensory organs detecting subtle pressure vibrations underwater."
          : "Trang bị cơ quan xúc giác tinh tế giúp nhận biết dao động áp suất nước từ khoảng cách rất xa.",
      },
    ];
  }, [species, isEn]);

  return (
    <section className="relative py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans overflow-hidden">
      {/* Ambient background glow: Tạo ánh sáng nền ấm hổ phách */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ─── 1. HEADER KHỐI ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
            <span>
              {isEn
                ? "Fascinating Biological Facts"
                : "Những sự thật sinh học kỳ thú"}
            </span>
          </h2>
        </div>

        <span className="text-xs font-medium text-slate-300 px-3.5 py-1.5 rounded-full bg-[#10223d]/80 border border-white/15 self-start md:self-auto flex items-center gap-1.5">
          <HelpCircle size={13} className="text-amber-400" />
          <span>
            {factsList.length} {isEn ? "verified facts" : "sự thật ghi nhận"}
          </span>
        </span>
      </div>

      {/* ─── 2. DANH SÁCH THẺ SỰ THẬT KHOA HỌC: SÁNG, KÍNH MỜ NỔI BẬT (Static reading cards, no hover) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {factsList.map((fact, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#122647]/90 via-[#0e1f3a]/90 to-[#0a182e]/90 border border-amber-400/25 relative overflow-hidden flex gap-4 items-start backdrop-blur-xl"
          >
            {/* Số thứ tự sáng màu */}
            <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Nội dung sự thật: Chữ sáng rõ nét */}
            <div className="flex-1 space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-white">
                {fact.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {fact.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
