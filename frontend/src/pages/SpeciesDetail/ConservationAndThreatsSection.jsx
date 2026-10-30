import { useMemo } from "react";
import {
  Scale,
  HeartHandshake,
  FishOff,
  Flame,
  Trash2,
  Anchor,
  CheckCircle2,
} from "lucide-react";

const RED_LIST_DETAILED_INFO = {
  EX: {
    code: "EX",
    labelVi: "Tuyệt chủng",
    labelEn: "Extinct",
    descVi:
      "Không còn nghi ngờ gì về việc cá thể cuối cùng của loài đã chết trên toàn cầu.",
    descEn:
      "Beyond reasonable doubt that the last individual of this species has died.",
    badgeColor: "bg-zinc-700/50 text-zinc-200 border-zinc-500/50",
    cardBorder:
      "border-zinc-500/40 from-[#1f1f23]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-zinc-200",
  },
  EW: {
    code: "EW",
    labelVi: "Tuyệt chủng trong tự nhiên",
    labelEn: "Extinct in the Wild",
    descVi:
      "Chỉ còn tồn tại trong điều kiện nuôi nhốt hoặc ngoài vùng phân bố lịch sử, đã biến mất hoàn toàn ngoài tự nhiên.",
    descEn:
      "Surviving only in captivity, cultivation, or outside historic native range.",
    badgeColor: "bg-purple-900/40 text-purple-300 border-purple-500/50",
    cardBorder:
      "border-purple-600/40 from-[#26152a]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-purple-300",
  },
  CR: {
    code: "CR",
    labelVi: "Cực kỳ nguy cấp",
    labelEn: "Critically Endangered",
    descVi:
      "Nguy cơ tuyệt chủng rất cao ngoài tự nhiên, cần có biện pháp bảo vệ và phục hồi khẩn cấp.",
    descEn:
      "Facing an extremely high extinction risk in the wild without immediate conservation action.",
    badgeColor: "bg-red-500/25 text-red-300 border-red-400/40",
    cardBorder:
      "border-red-500/40 from-[#2a131b]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-red-400",
  },
  EN: {
    code: "EN",
    labelVi: "Nguy cấp",
    labelEn: "Endangered",
    descVi:
      "Số lượng cá thể suy giảm nghiêm trọng do khai thác quá mức và sinh cảnh sống bị thu hẹp.",
    descEn:
      "High extinction risk due to severe population decline and rapid habitat loss.",
    badgeColor: "bg-orange-500/25 text-orange-300 border-orange-400/40",
    cardBorder:
      "border-orange-500/40 from-[#271813]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-orange-400",
  },
  VU: {
    code: "VU",
    labelVi: "Sắp nguy cấp",
    labelEn: "Vulnerable",
    descVi:
      "Có nguy cơ đe dọa cao trong tương lai gần do áp lực đánh bắt và biến đổi môi trường biển.",
    descEn:
      "Facing endangerment in the medium term due to heavy fishing pressure and habitat stress.",
    badgeColor: "bg-amber-500/25 text-amber-300 border-amber-400/40",
    cardBorder:
      "border-amber-500/40 from-[#261e12]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-amber-400",
  },
  NT: {
    code: "NT",
    labelVi: "Gần bị đe dọa",
    labelEn: "Near Threatened",
    descVi:
      "Hiện chưa nguy cấp nhưng đang cận kề ngưỡng bị đe dọa nếu không quản lý nguồn lợi tốt.",
    descEn:
      "Close to qualifying for threatened status without continued resource protection.",
    badgeColor: "bg-emerald-500/25 text-emerald-300 border-emerald-400/40",
    cardBorder:
      "border-emerald-500/40 from-[#122622]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-emerald-400",
  },
  LC: {
    code: "LC",
    labelVi: "Ít quan tâm",
    labelEn: "Least Concern",
    descVi:
      "Quần thể sinh học tương đối ổn định, song vẫn cần giám sát đánh bắt bền vững.",
    descEn:
      "Widespread and stable populations, monitored to ensure sustainable fisheries.",
    badgeColor: "bg-teal-500/25 text-teal-300 border-teal-400/40",
    cardBorder:
      "border-teal-500/40 from-[#12242a]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-teal-400",
  },
  DD: {
    code: "DD",
    labelVi: "Thiếu dữ liệu",
    labelEn: "Data Deficient",
    descVi:
      "Chưa có đủ thông tin sinh học và phân bố để đánh giá trực tiếp hoặc gián tiếp nguy cơ tuyệt chủng.",
    descEn:
      "Inadequate information to make a direct or indirect assessment of extinction risk.",
    badgeColor: "bg-slate-500/25 text-slate-300 border-slate-400/40",
    cardBorder:
      "border-slate-500/40 from-[#151c28]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-slate-300",
  },
  NE: {
    code: "NE",
    labelVi: "Chưa đánh giá",
    labelEn: "Not Evaluated",
    descVi:
      "Chưa được đối chiếu và thẩm định theo các tiêu chí của Danh lục Đỏ IUCN.",
    descEn: "Has not yet been evaluated against the IUCN Red List criteria.",
    badgeColor: "bg-zinc-600/25 text-zinc-300 border-zinc-500/40",
    cardBorder:
      "border-zinc-500/40 from-[#151821]/90 via-[#181d33]/90 to-[#0a182e]/90",
    statusColor: "text-zinc-400",
  },
};

export function ConservationAndThreatsSection({ species, language = "vi" }) {
  const isEn = language === "en";

  // Lấy mã tình trạng bảo tồn
  const statusCode = useMemo(() => {
    const raw = (
      species.vietnamRedListStatus ||
      species.redList ||
      species.statusVi ||
      "VU"
    ).toUpperCase();
    if (raw.includes("EX")) return "EX";
    if (raw.includes("EW")) return "EW";
    if (raw.includes("CR")) return "CR";
    if (raw.includes("EN")) return "EN";
    if (raw.includes("VU")) return "VU";
    if (raw.includes("NT")) return "NT";
    if (raw.includes("LC")) return "LC";
    if (raw.includes("DD")) return "DD";
    if (raw.includes("NE")) return "NE";
    return "VU";
  }, [species]);

  const redListMeta =
    RED_LIST_DETAILED_INFO[statusCode] || RED_LIST_DETAILED_INFO.VU;

  // Khung pháp lý Việt Nam - Bỏ chuỗi lặp lại
  const vnProtectionText = useMemo(() => {
    if (species.vietnamProtectionGroup) {
      return species.vietnamProtectionGroup.replace(
        /^Nghị định 26\/2019\/NĐ-CP:\s*/i,
        "",
      );
    }
    if (statusCode === "CR" || statusCode === "EN") {
      return "Nhóm I - Nghiêm cấm khai thác vì mục đích thương mại";
    }
    return "Nhóm II - Hạn chế khai thác, bảo vệ theo mùa";
  }, [species, statusCode]);

  const citesText = useMemo(() => {
    if (species.citesAppendix) return `Phụ lục ${species.citesAppendix}`;
    if (statusCode === "CR" || statusCode === "EN")
      return "Phụ lục I - Nghiêm cấm buôn bán quốc tế";
    return "Phụ lục II - Kiểm soát nghiêm ngặt lưu thông";
  }, [species, statusCode]);

  // 4 mối đe dọa chính: Rút ngắn câu chữ, bỏ ngoặc đơn
  const threats = useMemo(
    () => [
      {
        titleVi: "Đánh bắt ngẫu nhiên & lưới cào",
        titleEn: "Bycatch & Trawling",
        descVi:
          "Dễ bị mắc vào lưới kéo đáy và dây câu thương mại khi bơi săn mồi.",
        descEn:
          "Vulnerable to commercial driftnets and bottom trawlers during foraging.",
        icon: FishOff,
        accent: "text-rose-300 bg-rose-500/20 border-rose-400/35",
      },
      {
        titleVi: "Rác nhựa & lưới ma trôi nổi",
        titleEn: "Plastics & Ghost Gear",
        descVi:
          "Mảnh nhựa gây tắc ruột và lưới ma bỏ hoang bẫy giữ sinh vật biển.",
        descEn:
          "Ingestion of plastic debris and entanglement in discarded nylon nets.",
        icon: Trash2,
        accent: "text-amber-300 bg-amber-500/20 border-amber-400/35",
      },
      {
        titleVi: "Biến đổi khí hậu & ấm nước biển",
        titleEn: "Warming Seas & Bleaching",
        descVi:
          "Nhiệt độ nước tăng làm tẩy trắng rạn san hô và thu hẹp bãi kiếm ăn.",
        descEn:
          "Marine heatwaves trigger coral bleaching and disrupt historic biomes.",
        icon: Flame,
        accent: "text-orange-300 bg-orange-500/20 border-orange-400/35",
      },
      {
        titleVi: "Suy thoái bãi đẻ ven biển",
        titleEn: "Coastal Habitat Loss",
        descVi:
          "Xây dựng ven biển và tiếng ồn tàu thuyền làm mất bãi cát đẻ tự nhiên.",
        descEn:
          "Maritime traffic noise and coastal construction disrupt breeding grounds.",
        icon: Anchor,
        accent: "text-cyan-300 bg-cyan-500/20 border-cyan-400/35",
      },
    ],
    [],
  );

  // Lời kêu gọi hành động: Ngắn gọn, dễ đọc
  const actionTips = useMemo(
    () => [
      {
        titleVi: "Từ chối sản phẩm từ loài nguy cấp",
        titleEn: "Boycott Endangered Wildlife Products",
        descVi:
          "Không mua vi cá mập, mai đồi mồi, vỏ ốc quý hay trứng rùa biển.",
        descEn:
          "Refuse shark fins, sea turtle shells, or protected marine souvenirs.",
      },
      {
        titleVi: "Giảm rác nhựa khi du lịch biển",
        titleEn: "Minimize Coastal Plastic Waste",
        descVi:
          "Thu gom và mang rác về đất liền, không xả túi ni-lông xuống biển.",
        descEn:
          "Pack out waste, avoid disposable plastics, and protect clean beaches.",
      },
      {
        titleVi: "Lặn biển có ý thức & không giẫm san hô",
        titleEn: "Practice Responsible Diving",
        descVi:
          "Không đứng lên san hô, giữ khoảng cách tối thiểu 3m với sinh vật biển.",
        descEn:
          "Do not touch corals; maintain at least 3m safe space from wild animals.",
      },
      {
        titleVi: "Báo cáo hành vi khai thác trái phép",
        titleEn: "Report Exploitation Violations",
        descVi:
          "Báo cho cơ quan chức năng khi thấy đánh bắt bằng mìn hay kích điện.",
        descEn:
          "Notify marine authorities when spotting illegal explosive or electric fishing.",
      },
    ],
    [],
  );

  return (
    <section className="relative py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans overflow-hidden">
      {/* Ambient background glow: Tạo ánh sáng nền ấm, không còn bị chìm tối */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-rose-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ─── 1. HEADER KHỐI ──────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
          {isEn
            ? "Conservation Status & Threats"
            : "Bảo tồn & Mối đe dọa"}
        </h2>
      </div>

      {/* ─── 2. HÀNG 1: THẺ BẢO TỒN SÁCH ĐỎ & KHUNG PHÁP LÝ VIỆT NAM ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Thẻ Sách Đỏ Việt Nam - Kính mờ phản quang có màu sáng nổi bật */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br ${redListMeta.cardBorder} border flex flex-col justify-between backdrop-blur-xl`}
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl font-black font-mono px-3 py-1 rounded-xl border ${redListMeta.badgeColor}`}
                >
                  {redListMeta.code}
                </span>
                <div>
                  <span className="text-xs font-medium text-slate-300">
                    {isEn ? "Vietnam Red Data Book" : "Sách Đỏ Việt Nam"}
                  </span>
                  <h3
                    className={`text-lg sm:text-xl font-bold ${redListMeta.statusColor}`}
                  >
                    {isEn ? redListMeta.labelEn : redListMeta.labelVi}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
              {isEn ? redListMeta.descEn : redListMeta.descVi}
            </p>
          </div>

          {/* Dải tiến trình đầy đủ 9 bậc Sách Đỏ chuẩn IUCN & Việt Nam */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="grid grid-cols-9 gap-1 text-center text-[11px] sm:text-xs font-mono font-bold">
              {[
                { code: "NE", label: isEn ? "Not Evaluated" : "Chưa đánh giá" },
                { code: "DD", label: isEn ? "Data Deficient" : "Thiếu dữ liệu" },
                { code: "LC", label: isEn ? "Least Concern" : "Ít quan tâm" },
                { code: "NT", label: isEn ? "Near Threatened" : "Gần đe dọa" },
                { code: "VU", label: isEn ? "Vulnerable" : "Sắp nguy cấp" },
                { code: "EN", label: isEn ? "Endangered" : "Nguy cấp" },
                { code: "CR", label: isEn ? "Critically Endangered" : "Cực kỳ nguy cấp" },
                {
                  code: "EW",
                  label: isEn
                    ? "Extinct in the Wild"
                    : "Tuyệt chủng trong tự nhiên",
                },
                { code: "EX", label: isEn ? "Extinct" : "Tuyệt chủng" },
              ].map((tier) => {
                const isActive = statusCode === tier.code;
                const colors = {
                  NE: "text-zinc-300",
                  DD: "text-slate-300",
                  LC: "text-teal-300",
                  NT: "text-emerald-300",
                  VU: "text-amber-300",
                  EN: "text-orange-300",
                  CR: "text-rose-400",
                  EW: "text-purple-400",
                  EX: "text-red-500",
                };
                return (
                  <span
                    key={tier.code}
                    className={`transition-colors py-0.5 cursor-default ${
                      isActive
                        ? `${colors[tier.code]} underline font-black`
                        : "text-slate-500 hover:text-slate-400"
                    }`}
                    title={tier.label}
                  >
                    {tier.code}
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-9 gap-1 h-2 rounded-full overflow-hidden bg-slate-900/90 border border-white/10">
              <div
                className={`rounded-l-full ${statusCode === "NE" ? "bg-zinc-400" : "bg-zinc-500/20"}`}
              />
              <div
                className={
                  statusCode === "DD" ? "bg-slate-400" : "bg-slate-500/20"
                }
              />
              <div
                className={
                  statusCode === "LC" ? "bg-teal-400" : "bg-teal-500/20"
                }
              />
              <div
                className={
                  statusCode === "NT" ? "bg-emerald-400" : "bg-emerald-500/20"
                }
              />
              <div
                className={
                  statusCode === "VU" ? "bg-amber-400" : "bg-amber-500/20"
                }
              />
              <div
                className={
                  statusCode === "EN" ? "bg-orange-400" : "bg-orange-500/20"
                }
              />
              <div
                className={
                  statusCode === "CR" ? "bg-rose-500" : "bg-rose-500/20"
                }
              />
              <div
                className={
                  statusCode === "EW" ? "bg-purple-500" : "bg-purple-500/20"
                }
              />
              <div
                className={`rounded-r-full ${statusCode === "EX" ? "bg-red-600" : "bg-red-600/20"}`}
              />
            </div>
          </div>
        </div>

        {/* Thẻ Khung bảo vệ pháp lý Việt Nam & CITES - Bỏ uppercase */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#122647]/90 via-[#0e1f3a]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between space-y-4 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Scale size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">
                {isEn ? "Legal Protection Framework" : "Cơ chế bảo vệ pháp lý"}
              </h4>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-sky-500/[0.07] border border-sky-400/20">
                <span className="block text-xs font-semibold text-slate-300">
                  {isEn ? "Decree 26/2019/ND-CP" : "Nghị định 26/2019/NĐ-CP"}
                </span>
                <p className="text-xs sm:text-sm font-medium text-cyan-200 mt-1">
                  {vnProtectionText}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/[0.07] border border-amber-400/20">
                <span className="block text-xs font-semibold text-slate-300">
                  {isEn ? "CITES Convention" : "Công ước quốc tế CITES"}
                </span>
                <p className="text-xs sm:text-sm font-medium text-amber-200 mt-1">
                  {citesText}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic">
            *{" "}
            {isEn
              ? "Illegal hunting, trading, or possession of protected marine species is penalized under Vietnam law."
              : "Hành vi săn bắt, buôn bán hoặc tàng trữ loài được bảo vệ bị xử phạt nghiêm theo Điều 244 Bộ luật Hình sự."}
          </p>
        </div>
      </div>

      {/* ─── 3. HÀNG 2: 4 MỐI ĐE DỌA CHÍNH TẠI BIỂN ĐÔNG ─── */}
      <div className="mb-10">
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {isEn
              ? "Major Threats"
              : "Các mối đe dọa chính"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {threats.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#122647]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div
                    className={`p-2.5 rounded-xl w-fit mb-3 border ${t.accent}`}
                  >
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    {isEn ? t.titleEn : t.titleVi}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {isEn ? t.descEn : t.descVi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 4. HÀNG 3: BẠN CÓ THỂ LÀM GÌ ĐỂ BẢO VỆ? ───────── */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#103158]/90 via-[#0c2340]/90 to-[#08192e]/90 border border-cyan-400/35 relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <HeartHandshake size={20} className="text-cyan-300" />
          <span className="text-xs font-semibold text-cyan-300">
            {isEn ? "Call to Action" : "Hành động vì đại dương"}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6">
          {isEn
            ? "How each of us can safeguard the East Sea's marine wonders"
            : "Mỗi chúng ta có thể làm gì để bảo vệ sinh vật biển Biển Đông?"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionTips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.05] border border-white/15"
            >
              <CheckCircle2
                size={18}
                className="text-cyan-400 shrink-0 mt-0.5"
              />
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white mb-1">
                  {isEn ? tip.titleEn : tip.titleVi}
                </h5>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isEn ? tip.descEn : tip.descVi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
