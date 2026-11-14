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

    // Kiểm tra dữ liệu đặc điểm sinh học
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

    // 4. Sinh sự thật khoa học bám sát nhóm phân loại & thông số thực tế của từng loài
    const displayName = species.nameVi || species.commonName || "Loài sinh vật này";
    const nameLower = displayName.toLowerCase();
    const sciLower = (
      species.sciName ||
      species.scientificName ||
      ""
    ).toLowerCase();
    const catLower = `${species.category || ""} ${species.categoryVi || ""} ${
      species.taxonomy?.phylum || ""
    } ${species.taxonomy?.class || ""} ${species.taxonomy?.order || ""} ${
      species.taxonomy?.family || ""
    }`.toLowerCase();

    const taxFamily = species.taxonomy?.family || null;
    const taxOrder = species.taxonomy?.order || null;
    const depthLabel = species.depth || null;
    const sizeLabel = species.size || null;
    const tempRange =
      species.temperatureMinC !== null &&
      species.temperatureMinC !== undefined &&
      species.temperatureMaxC !== null &&
      species.temperatureMaxC !== undefined
        ? `${species.temperatureMinC}°C – ${species.temperatureMaxC}°C`
        : null;

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
      nameLower.includes("cá đuối") ||
      catLower.includes("elasmobranchii") ||
      catLower.includes("chondrichthyes")
    ) {
      return [
        {
          title: isEn
            ? "Bioelectric Sixth Sense"
            : "Giác quan cảm nhận điện trường",
          text: isEn
            ? "Tiny jelly-filled pores across its snout detect electrical fields as faint as one-billionth of a volt."
            : `${displayName} sở hữu mạng lưới lỗ cảm biến quanh mõm giúp phát hiện dòng điện sinh học siêu nhỏ từ con mồi.`,
        },
        {
          title: isEn
            ? "Cartilaginous Skeleton"
            : "Khung xương sụn nhẹ linh hoạt",
          text: isEn
            ? `Members of ${taxFamily || "cartilaginous fishes"} replace heavy calcified bone with flexible cartilage enriched by a buoyant oil-filled liver.`
            : `Khung xương 100% bằng sụn đàn hồi của họ ${taxFamily || "cá sụn"} giúp tiết kiệm năng lượng khi bơi đường dài ở dải độ sâu ${depthLabel || "tự nhiên"}.`,
        },
        {
          title: isEn
            ? "Skin of Dermal Denticles"
            : "Lớp da phủ vảy tấm giảm xoáy nước",
          text: isEn
            ? "Covered in microscopic tooth-like denticles that minimize water drag and deter parasites."
            : "Lớp da phủ vô số vảy gai siêu nhỏ giúp triệt tiêu xoáy nước ma sát và giảm tiếng ồn khi áp sát con mồi.",
        },
        {
          title: isEn
            ? "Ancient Ocean Lineage"
            : "Dòng tiến hóa hơn 400 triệu năm",
          text: isEn
            ? "Cartilaginous fishes have patrolled Earth's oceans since before trees existed."
            : "Tổ tiên nhóm cá sụn đã xuất hiện trước cả thực vật thân gỗ trên cạn và vượt qua nhiều cuộc đại tuyệt chủng.",
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

    if (
      catLower.includes("echinodermata") ||
      catLower.includes("asteroidea") ||
      nameLower.includes("sao biển") ||
      nameLower.includes("cầu gai") ||
      nameLower.includes("nhum") ||
      nameLower.includes("hải sâm")
    ) {
      return [
        {
          title: isEn ? "Hydraulic Tube Feet" : "Di chuyển bằng áp suất nước biển",
          text: isEn
            ? `${displayName} moves hundreds of tube feet by pumping seawater rather than relying on blood circulation.`
            : `${displayName} vận hành hàng trăm chân ống giác bám bằng cách bơm nước biển qua hệ thống mạch thủy lực.`,
        },
        {
          title: isEn ? "Remarkable Regeneration" : "Tái sinh cơ thể ấn tượng",
          text: isEn
            ? "Damaged arms or spines can regrow over months from the central nerve ring."
            : "Các phần chi hoặc mô bị tổn thương có thể tái sinh hoàn chỉnh nhờ tế bào gốc quanh vòng thần kinh trung tâm.",
        },
        {
          title: isEn ? "No Central Brain Needed" : "Phản xạ qua vòng thần kinh tỏa tròn",
          text: isEn
            ? "A decentralized nerve ring coordinates movement in all directions simultaneously."
            : "Cơ thể đối xứng tỏa tròn giúp cảm nhận hóa chất và ánh sáng đồng đều từ mọi phía mà không cần não tập trung.",
        },
        {
          title: isEn ? "Ecological Niche & Range" : "Hồ sơ phân bố sinh thái",
          text: isEn
            ? `Recorded size ${sizeLabel || "verified in field"}, inhabiting ${depthLabel || "coastal reefs"}${tempRange ? ` (${tempRange})` : ""}.`
            : `${taxFamily ? `Thuộc họ ${taxFamily}, ` : ""}kích thước ghi nhận ${sizeLabel || "ngoài tự nhiên"} tại dải độ sâu ${depthLabel || "ven bờ"}${tempRange ? ` (nhiệt độ ${tempRange})` : ""}.`,
        },
      ];
    }

    if (
      catLower.includes("malacostraca") ||
      catLower.includes("arthropoda") ||
      nameLower.includes("tôm") ||
      nameLower.includes("cua") ||
      nameLower.includes("ghẹ") ||
      nameLower.includes("sam biển") ||
      nameLower.includes("so biển") ||
      nameLower.includes("bọ biển")
    ) {
      return [
        {
          title: isEn ? "Periodic Exoskeleton Molting" : "Lột xác để phát triển kích thước",
          text: isEn
            ? `${displayName} sheds its hardened chitin shell periodically to grow before calcifying a larger armor.`
            : `${displayName} định kỳ tách bỏ lớp giáp kitin cứng bên ngoài và kết cứng bộ vỏ mới lớn hơn chỉ trong vài ngày.`,
        },
        {
          title: isEn ? "Copper-Based Blue Hemolymph" : "Huyết tương xanh chứa gốc đồng",
          text: isEn
            ? "Instead of iron hemoglobin, crustaceans transport oxygen with copper-based hemocyanin."
            : "Sử dụng protein hemocyanin chứa đồng thay cho sắt để vận chuyển oxy hiệu quả trong nước biển nhiều biến động.",
        },
        {
          title: isEn ? "Stalked Compound Eyes" : "Mắt kép & râu dò hóa chất nhạy bén",
          text: isEn
            ? "Hundreds of optical units detect rapid motion while antennae taste dissolved nutrients in sediment."
            : "Hệ thống râu cảm giác hóa học giúp lần theo dấu vết thức ăn trong lớp cát bùn ngay cả vào ban đêm.",
        },
        {
          title: isEn ? "Field Measurements" : "Thông số sinh học ghi nhận",
          text: isEn
            ? `${taxFamily ? `Family ${taxFamily}: ` : ""}measured size ${sizeLabel || "documented"} across ${depthLabel || "marine habitats"}.`
            : `${taxOrder ? `Bộ ${taxOrder}${taxFamily ? `, họ ${taxFamily}` : ""}: ` : ""}kích thước ${sizeLabel || "thực địa"}, phân bố tại tầng ${depthLabel || "biển tự nhiên"}.`,
        },
      ];
    }

    if (
      catLower.includes("san-ho") ||
      catLower.includes("cnidaria") ||
      nameLower.includes("san hô") ||
      nameLower.includes("sứa") ||
      nameLower.includes("hải quỳ") ||
      sciLower.includes("plankton") ||
      nameLower.includes("phù du")
    ) {
      return [
        {
          title: isEn ? "Foundation of Ocean Life" : "Mắt xích nền tảng đại dương",
          text: isEn
            ? `${displayName} forms vital structure or primary biomass supporting coastal marine biodiversity.`
            : `${displayName} góp phần kiến tạo nơi trú ẩn hoặc nguồn sinh khối sơ cấp nuôi sống hàng trăm loài cá rạn và sinh vật biển.`,
        },
        {
          title: isEn ? "Microscopic Defense or Symbiosis" : "Cộng sinh & tế bào phòng vệ vi mô",
          text: isEn
            ? "Relies on specialized stinging cells, lipid buoyancy, or algal symbionts instead of swimming chase."
            : "Thay vì săn đuổi tốc độ cao, nhóm sinh vật này thích nghi bằng cộng sinh quang hợp, lơ lửng theo dòng hoặc tế bào gai tự vệ.",
        },
        {
          title: isEn ? "Environmental Bio-Indicator" : "Chỉ thị nhạy cảm môi trường biển",
          text: isEn
            ? `Sensitive to thermal anomalies and water quality shifts${tempRange ? ` beyond ${tempRange}` : ""}.`
            : `Nhạy cảm với biến đổi nhiệt độ và pH đại dương${tempRange ? `, ngưỡng thích nghi ghi nhận khoảng ${tempRange}` : ""}.`,
        },
        {
          title: isEn ? "Depth & Distribution Profile" : "Phạm vi tầng nước & địa lý",
          text: isEn
            ? `Documented across ${depthLabel || "sunlit marine layers"} (${species.eastSeaZone || "Indo-Pacific"}).`
            : `Phân bố tập trung ở độ sâu ${depthLabel || "tầng nước mặt"} tại ${species.eastSeaZone || "vùng biển nhiệt đới Biển Đông"}.`,
        },
      ];
    }

    // Dữ liệu động dành cho cá xương, thú biển và các loài có thông số thực nghiệm từ DB
    const isFish =
      catLower.includes("ca-bien") ||
      catLower.includes("actinopter") ||
      nameLower.includes("cá ");
    return [
      {
        title: isEn
          ? isFish
            ? "Lateral Line Motion Sensor"
            : "Biological Adaptation Profile"
          : isFish
            ? "Đường bên cảm nhận dao động nước"
            : `Hồ sơ phân loại học ${taxFamily || ""}`.trim(),
        text: isEn
          ? `${displayName} (${species.sciName || ""}) is documented under ${taxFamily || "marine taxonomy"} and adapts precisely to local currents.`
          : `${displayName} (${species.sciName || ""})${taxFamily ? ` thuộc họ ${taxFamily}` : ""}, thích nghi với dòng chảy và điều kiện thủy văn đặc trưng vùng phân bố.`,
      },
      {
        title: isEn ? "Verified Size & Depth Range" : "Thông số kích thước & độ sâu thực tế",
        text: isEn
          ? `Adults measure ${sizeLabel || "varying sizes"} and inhabit depths of ${depthLabel || "coastal to pelagic zones"}.`
          : `Kích thước trưởng thành ghi nhận ${sizeLabel || "đang cập nhật"}, sinh sống ở dải độ sâu ${depthLabel || "tự nhiên"}.`,
      },
      {
        title: isEn ? "Thermal & Habitat Envelope" : "Dải nhiệt độ & vùng phân bố",
        text: tempRange
          ? isEn
            ? `Oceanographic occurrence records show preferred sea temperatures around ${tempRange} in ${species.eastSeaZone || "regional waters"}.`
            : `Dữ liệu quan trắc hải dương học OBIS ghi nhận ngưỡng nhiệt độ thích hợp khoảng ${tempRange}${species.eastSeaZone ? ` tại ${species.eastSeaZone}` : ""}.`
          : isEn
            ? `Recorded habitat zone: ${species.eastSeaZone || species.localDistribution || "tropical East Sea waters"}.`
            : `Khu vực ghi nhận phân bố: ${species.eastSeaZone || species.localDistribution || "vùng biển nhiệt đới và Biển Đông"}.`,
      },
      {
        title: isEn ? "Diet & Conservation Context" : "Tập tính dinh dưỡng & bảo tồn",
        text: isEn
          ? `${species.diet ? `Diet profile: ${species.diet}. ` : ""}Conservation rating: ${species.statusEn || species.statusVi || "Evaluated"}.`
          : `${species.diet ? `Nguồn thức ăn chính: ${species.diet}. ` : ""}Mức độ bảo tồn hiện tại: ${species.statusVi || "Đang theo dõi"}.`,
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

      {/* Danh sách thẻ thông tin khoa học */}
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
