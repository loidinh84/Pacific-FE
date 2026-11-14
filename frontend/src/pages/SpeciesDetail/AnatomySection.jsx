import { useState, useMemo } from "react";
import {
  Heart,
  Brain,
  Activity,
  Waves,
  Shield,
  Box,
  Sparkles,
  Compass,
  Info,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { Interactive3DAnatomyViewer } from "../../components/species/Interactive3DAnatomyViewer";

// Hồ sơ sinh lý học & cấu trúc giải phẫu học thuật tự nhiên, tinh gọn, không lạm dụng chữ hoa và từ trong ngoặc
function getSpeciesAnatomyProfile(species, isEn = false) {
  const displayName = isEn
    ? species?.nameEn || species?.commonName || "Marine Creature"
    : species?.nameVi || species?.commonName || "Sinh vật biển";
  const name = (species?.nameVi || species?.commonName || "").toLowerCase();
  const cat = `${species?.category || ""} ${species?.categoryVi || ""} ${
    species?.taxonomy?.phylum || ""
  } ${species?.taxonomy?.class || ""} ${species?.taxonomy?.order || ""} ${
    species?.taxonomy?.family || ""
  }`.toLowerCase();
  const sciName = (species?.sciName || species?.scientificName || "").toLowerCase();

  // 1. Sinh vật đơn bào đáy thẳm & chuyên biệt vùng tối sâu
  if (
    name.includes("trùng") ||
    sciName.includes("syringammina") ||
    sciName.includes("foram") ||
    name.includes("đơn bào") ||
    cat.includes("foraminifera") ||
    cat.includes("xenophyophorea") ||
    cat.includes("biển sâu") ||
    cat.includes("sinh-vat-bien-sau") ||
    cat.includes("phát quang")
  ) {
    return {
      groupLabel: "Sinh vật đơn bào & Đáy thẳm",
      metrics: [
        { label: "Cấu trúc vỏ", value: "Xi măng sinh học", sub: "Kết dính trầm tích đáy thẳm", color: "text-amber-400" },
        { label: "Kích thước tế bào", value: "Lên tới 20cm", sub: "Tế bào đơn khổng lồ đa nhân", color: "text-cyan-400" },
        { label: "Áp suất chịu đựng", value: "Hơn 600 atm", sub: "Thích nghi đáy biển 3000-6000m", color: "text-emerald-400" },
        { label: "Phương thức ăn", value: "Lọc tuyết biển", sub: "Hấp thụ cặn hữu cơ chìm lắng", color: "text-indigo-400" },
      ],
      systems: [
        {
          id: "cellular",
          nameVi: "Cấu trúc tế bào đa nhân khổng lồ",
          nameEn: "Syncytial Giant Single Cell",
          icon: Activity,
          color: "cyan",
          headline: `${displayName} sở hữu mạng lưới tế bào chất phân nhánh và phát quang/chống áp suất đặc thù tầng sâu`,
          details: [
            {
              title: "Thích nghi áp suất thủy tĩnh",
              desc: "Màng tế bào chứa tỷ lệ axit béo không bão hòa cao giúp giữ độ linh động của lớp kép lipid dưới áp suất hàng trăm atmosphere.",
            },
            {
              title: "Cấu trúc vỏ & mô nâng đỡ",
              desc: "Tiết hợp chất hữu cơ kết dính khoáng vật đáy biển hoặc phát triển mô gelatin trong suốt để cân bằng lực ép từ cột nước sâu.",
            },
          ],
        },
        {
          id: "nutrition",
          nameVi: "Cơ chế bắt mồi tầng sâu",
          nameEn: "Abyssal Feeding Strategy",
          icon: Brain,
          color: "indigo",
          headline: "Tối ưu hóa tiêu hao năng lượng để săn mồi và lọc tuyết biển trong bóng tối vĩnh cửu",
          details: [
            {
              title: "Lọc vụn hữu cơ hoặc bẫy phát quang",
              desc: "Tận dụng hạt cặn hữu cơ rơi từ tầng mặt (marine snow) hoặc ánh sáng sinh học luciferin để thu hút con mồi ít ỏi dưới đáy thẳm.",
            },
            {
              title: "Trao đổi chất chậm tiết kiệm năng lượng",
              desc: "Nhịp tim và tốc độ tiêu hóa duy trì ở mức cực thấp nhằm kéo dài thời gian tồn tại giữa những lần tìm thấy nguồn thức ăn.",
            },
          ],
        },
      ],
    };
  }

  // 2. Sinh vật phù du, tảo & cỏ biển (Phù du / Thực vật thủy sinh)
  if (
    sciName.includes("plankton") ||
    name.includes("phù du") ||
    name.includes("cỏ biển") ||
    name.includes("rong ") ||
    name.includes("tảo") ||
    cat.includes("copepoda") ||
    cat.includes("halophila")
  ) {
    return {
      groupLabel: "Sinh vật phù du & Thực vật biển",
      metrics: [
        { label: "Tầng hoạt động", value: species?.depth || "0 - 100m", sub: "Vùng ngập nắng giàu ánh sáng", color: "text-cyan-400" },
        { label: "Giọt dầu nổi", value: "Lipid sinh học", sub: "Giữ cơ thể lơ lửng theo hải lưu", color: "text-amber-400" },
        { label: "Vai trò oxy", value: "Quang hợp & Sơ cấp", sub: "Nền tảng lưới thức ăn đại dương", color: "text-emerald-400" },
        { label: "Chu kỳ sinh học", value: "Di cư ngày - đêm", sub: "Trồi lên mặt nước vào ban đêm", color: "text-indigo-400" },
      ],
      systems: [
        {
          id: "buoyancy-oil",
          nameVi: "Cấu trúc nổi & lơ lửng theo dòng",
          nameEn: "Planktonic Buoyancy & Drifting",
          icon: Waves,
          color: "cyan",
          headline: `${displayName} tích trữ giọt lipid và tăng diện tích tiếp xúc vi mô để hạn chế chìm xuống đáy biển`,
          details: [
            {
              title: "Gai phụ & bề mặt giảm tốc chìm",
              desc: "Các nhánh râu hoặc gai vỏ vi mô tạo lực cản nhớt trong nước biển, giữ cơ thể lơ lửng ổn định ở tầng mặt giàu ánh sáng.",
            },
            {
              title: "Tích trữ giọt dầu năng lượng",
              desc: "Giọt lipid nhẹ hơn nước vừa giúp điều chỉnh độ nổi vừa đóng vai trò nguồn dự trữ dinh dưỡng cho mắt xích cá nhỏ phía trên.",
            },
          ],
        },
        {
          id: "primary-chain",
          nameVi: "Trao đổi khí & chuỗi thức ăn sơ cấp",
          nameEn: "Primary Production & Trophic Transfer",
          icon: Sparkles,
          color: "emerald",
          headline: "Hấp thụ trực tiếp khoáng chất và truyền năng lượng mặt trời vào toàn bộ hệ sinh thái biển",
          details: [
            {
              title: "Trao đổi chất qua bề mặt cơ thể",
              desc: "Kích thước siêu nhỏ cho phép oxy và chất dinh dưỡng khuếch tán trực tiếp qua thành tế bào/vỏ mỏng mà không cần hệ hô hấp phức tạp.",
            },
            {
              title: "Bơm sinh học carbon (Biological Pump)",
              desc: "Chuyển hóa CO2 hòa tan thành sinh khối hữu cơ và lắng đọng carbon xuống tầng đáy khi hoàn tất vòng đời ngắn ngủi.",
            },
          ],
        },
      ],
    };
  }

  // 3. Ngành Da gai (Echinodermata: Sao biển, Cầu gai, Hải sâm)
  if (
    cat.includes("echinodermata") ||
    cat.includes("asteroidea") ||
    cat.includes("echinoidea") ||
    cat.includes("holothuroidea") ||
    cat.includes("valvatida") ||
    name.includes("sao biển") ||
    name.includes("cầu gai") ||
    name.includes("nhum") ||
    name.includes("hải sâm") ||
    sciName.includes("acanthaster")
  ) {
    return {
      groupLabel: "Động vật Da gai",
      metrics: [
        { label: "Hệ vận động", value: "Ống nước thủy lực", sub: "Hàng trăm chân ống co giãn nhịp nhàng", color: "text-cyan-400" },
        { label: "Đối xứng cơ thể", value: "Ngũ tia (5+ cánh)", sub: "Cấu trúc tỏa tròn thích nghi đáy biển", color: "text-indigo-400" },
        { label: "Tái sinh mô", value: "Phục hồi hoàn chỉnh", sub: "Tái tạo cánh tay bị tổn thương", color: "text-emerald-400" },
        { label: "Tự vệ hóa học", value: "Gai canxi & Saponin", sub: "Xua đuổi kẻ săn mồi trên rạn đá", color: "text-rose-400" },
      ],
      systems: [
        {
          id: "water-vascular",
          nameVi: "Hệ mạch nước & chân ống thủy lực",
          nameEn: "Water Vascular System & Tube Feet",
          icon: Waves,
          color: "cyan",
          headline: `${displayName} không dùng máu mà bơm nước biển qua hệ thống ống dẫn thủy lực để di chuyển và bám chặt vào đá ngầm`,
          details: [
            {
              title: "Tấm sàng hút nước (Madreporite)",
              desc: "Nước biển được lọc qua tấm sàng đá vôi trên mặt lưng, đi vào vòng ống trung tâm và phân nhánh ra từng cánh tay.",
            },
            {
              title: "Hàng trăm chân ống giác bám",
              desc: "Mỗi chân ống hoạt động nhờ thay đổi áp suất nước trong bầu cơ, vừa giúp bám chắc trước sóng mạnh vừa mở vỏ con mồi.",
            },
          ],
        },
        {
          id: "feeding-regen",
          nameVi: "Cơ chế tiêu hóa & tái sinh mô",
          nameEn: "External Digestion & Tissue Regeneration",
          icon: Activity,
          color: "emerald",
          headline: "Khả năng lộn dạ dày tiêu hóa ngoài cơ thể và tự tái tạo các phần chi bị mất",
          details: [
            {
              title: "Tiêu hóa ngoài trực tiếp",
              desc: "Một số loài da gai có thể lộn túi dạ dày mỏng ra ngoài miệng, tiết enzyme phân hủy mô mềm của san hô hoặc thân mềm rồi mới hấp thụ.",
            },
            {
              title: "Tái sinh tế bào gốc mạnh mẽ",
              desc: "Nếu mất một cánh tay khi tự vệ, vòng thần kinh trung tâm kích hoạt phân chia tế bào để mọc lại hoàn chỉnh phần cơ thể đã mất.",
            },
          ],
        },
        {
          id: "armor-defense",
          nameVi: "Bộ xương đá vôi & gai độc tự vệ",
          nameEn: "Calcareous Ossicles & Saponin Defense",
          icon: Shield,
          color: "rose",
          headline: "Các mảnh xương canxi dưới lớp biểu bì kết hợp hợp chất saponin chống kẻ săn mồi",
          details: [
            {
              title: "Khung mảnh đá vôi linh hoạt",
              desc: "Bên dưới lớp da là hàng ngàn mảnh CaCO3 đan xen bằng sợi collagen đặc biệt có thể chuyển từ mềm dẻo sang cứng cáp tức thì.",
            },
            {
              title: "Gai sắc và hợp chất saponin",
              desc: "Ở các loài như sao biển gai hay cầu gai, gai canxi phủ chất nhầy chứa saponin gây sưng đau và răn đe cá săn mồi rạn san hô.",
            },
          ],
        },
      ],
    };
  }

  // 4. Giáp xác & Chân khớp biển (Crustacea: Tôm, Cua, Ghẹ, Bọ biển, Sam biển)
  if (
    cat.includes("malacostraca") ||
    cat.includes("arthropoda") ||
    cat.includes("decapoda") ||
    cat.includes("stomatopoda") ||
    cat.includes("xiphosura") ||
    name.includes("tôm") ||
    name.includes("cua") ||
    name.includes("ghẹ") ||
    name.includes("bọ biển") ||
    name.includes("sam biển") ||
    name.includes("so biển") ||
    sciName.includes("portunus") ||
    sciName.includes("panulirus") ||
    sciName.includes("charybdis")
  ) {
    return {
      groupLabel: "Giáp xác & Chân khớp biển",
      metrics: [
        { label: "Bộ xương ngoài", value: "Chitin khoáng hóa", sub: "Giáp canxi cứng bảo vệ nội quan", color: "text-amber-400" },
        { label: "Tăng trưởng", value: "Lột xác định kỳ", sub: "Thay lớp vỏ cũ để lớn lên theo chu kỳ", color: "text-cyan-400" },
        { label: "Hô hấp dưới nước", value: "Mang lá trong khoang", sub: "Luân chuyển dòng nước giàu oxy", color: "text-emerald-400" },
        { label: "Thị giác & râu", value: "Mắt kép & Thụ thể mùi", sub: "Nhận diện hóa chất và chuyển động 360°", color: "text-indigo-400" },
      ],
      systems: [
        {
          id: "exoskeleton",
          nameVi: "Giáp ngoài kitin & chu kỳ lột xác",
          nameEn: "Calcified Chitin Exoskeleton & Molting",
          icon: Shield,
          color: "amber",
          headline: `${displayName} được bao bọc bởi bộ giáp kitin tẩm muối canxi vừa chống áp lực vừa bảo vệ trước kẻ săn mồi`,
          details: [
            {
              title: "Lột xác để tăng kích thước",
              desc: "Do lớp giáp ngoài không tự giãn nở, cá thể tiết hormone ecdysteroid tách bỏ vỏ cũ, hút nước làm phồng mô mềm rồi kết cứng vỏ mới trong vài ngày.",
            },
            {
              title: "Khớp chi & càng chuyên hóa",
              desc: "Các đốt chân có khớp bản lề cơ học tối ưu lực kẹp của đôi càng, giúp nghiền vỏ hai mảnh vỏ hoặc đào hang trú ẩn.",
            },
          ],
        },
        {
          id: "gills-sensory",
          nameVi: "Mang lá kép & râu cảm giác hóa học",
          nameEn: "Branchial Gills & Chemosensory Antennae",
          icon: Activity,
          color: "cyan",
          headline: "Hệ mang ẩn dưới mai ngực kết hợp râu dài dò tín hiệu hóa học trong bùn cát",
          details: [
            {
              title: "Tuần hoàn hở với hemocyanin",
              desc: "Tim nằm ở mặt lưng đẩy huyết tương chứa đồng đi qua khoang mang dưới giáp ngực để trao đổi oxy liên tục.",
            },
            {
              title: "Mắt kép trên cuống di động",
              desc: "Hàng trăm ống kính nhỏ (ommatidia) gắn trên cuống xoay giúp phát hiện chuyển động của con mồi hoặc kẻ thù ở nhiều góc khuất.",
            },
          ],
        },
      ],
    };
  }

  // 5. Phân loại thân mềm (Mollusca: Bạch tuộc, Mực, Ốc, Sò, Trai, Điệp)
  if (
    cat.includes("mollusca") ||
    cat.includes("cephalopoda") ||
    cat.includes("bivalvia") ||
    cat.includes("gastropoda") ||
    name.includes("bạch tuộc") ||
    name.includes("mực") ||
    name.includes("ốc") ||
    name.includes("trai") ||
    name.includes("sò") ||
    name.includes("điệp") ||
    name.includes("tu hài") ||
    sciName.includes("octopus") ||
    sciName.includes("enteroctopus") ||
    sciName.includes("loligo")
  ) {
    const isShelled =
      cat.includes("bivalvia") ||
      cat.includes("gastropoda") ||
      name.includes("ốc") ||
      name.includes("sò") ||
      name.includes("trai") ||
      name.includes("điệp") ||
      name.includes("tu hài");

    if (isShelled) {
      return {
        groupLabel: "Thân mềm có vỏ (Ốc & Hai mảnh vỏ)",
        metrics: [
          { label: "Áo & Lớp vỏ", value: "Aragonite CaCO3", sub: "Màng áo tiết khoáng tạo vỏ xoắn hoặc hai mảnh", color: "text-amber-400" },
          { label: "Lớp xà cừ", value: "Phản xạ ngọc", sub: "Bảo vệ mô mềm trước dị vật và ký sinh", color: "text-cyan-400" },
          { label: "Cơ khép / Chân cơ", value: "Áp lực thủy lực", sub: "Đào cát vùi thân hoặc bám chắc vào đá", color: "text-emerald-400" },
          { label: "Dinh dưỡng", value: "Lọc phù du / Lưỡi gai", sub: "Tùy biến theo tập tính ăn lọc hay gặm tảo", color: "text-indigo-400" },
        ],
        systems: [
          {
            id: "mantle-shell",
            nameVi: "Màng áo & cấu trúc vỏ đá vôi",
            nameEn: "Mantle & Calcareous Shell",
            icon: Shield,
            color: "amber",
            headline: `${displayName} sở hữu màng áo chuyên biệt liên tục bồi đắp tinh thể canxi cacbonat theo độ tuổi`,
            details: [
              {
                title: "Hai hoặc một mảnh vỏ bảo vệ",
                desc: "Cấu trúc nhiều lớp gồm màng sừng chống ăn mòn axit nhẹ bên ngoài, lớp lăng trụ chịu lực ở giữa và lớp xà cừ mịn bên trong.",
              },
              {
                title: "Ống hút siphon & chân rìu đào cát",
                desc: "Chân cơ bơm máu trương nở giúp vùi sâu xuống nền cát triều cường, để lộ ống siphon hút nước lọc phù du và hô hấp.",
              },
            ],
          },
          {
            id: "filter-gills",
            nameVi: "Lọc sinh học & làm sạch vùng nước",
            nameEn: "Bio-Filtration & Ctenidia Gills",
            icon: Waves,
            color: "emerald",
            headline: "Hệ mang có lông rung tạo dòng chảy vừa trao đổi oxy vừa giữ lại vi tảo dinh dưỡng",
            details: [
              {
                title: "Lọc hàng chục lít nước mỗi ngày",
                desc: "Đóng góp vai trò bộ lọc tự nhiên giúp cải thiện độ trong và cân bằng phù du tại các vùng đầm phá ven biển.",
              },
              {
                title: "Phản xạ đóng kín khi gặp hiểm nguy",
                desc: "Cơ khép vỏ hoặc nắp sừng (operculum) đóng chặt tức thời khi phát hiện dao động ánh sáng hoặc hóa chất từ kẻ săn mồi.",
              },
            ],
          },
        ],
      };
    }

    return {
      groupLabel: "Động vật thân mềm Chân đầu",
      metrics: [
        { label: "Số lượng tim", value: "3 trái tim", sub: "2 tim mang và 1 tim chính", color: "text-rose-400" },
        { label: "Mạng lưới nơ-ron", value: "500 triệu", sub: "2/3 phân bố ở 8 xúc tu", color: "text-cyan-400" },
        { label: "Sắc tố da", value: "0.2 giây", sub: "Tốc độ biến hình ngụy trang", color: "text-amber-400" },
        { label: "Áp suất chịu đựng", value: "Hơn 150 atm", sub: "Cơ thể hoàn toàn không xương", color: "text-emerald-400" },
      ],
      systems: [
        {
          id: "circulatory",
          nameVi: "Hệ tuần hoàn & 3 trái tim",
          nameEn: "Circulatory System & 3 Hearts",
          icon: Heart,
          color: "rose",
          headline: "Hệ thống bơm máu áp lực kép với máu màu xanh lam chứa sắc tố đồng hemocyanin",
          details: [
            {
              title: "Cấu trúc 3 quả tim riêng biệt",
              desc: "Hai quả tim mang chuyên trách bơm máu nghèo oxy qua các lá mang để hấp thụ oxy hòa tan; sau đó quả tim chính sẽ đẩy máu giàu oxy nuôi toàn bộ mô cơ thể.",
            },
            {
              title: "Máu xanh lam chứa hemocyanin",
              desc: "Khác với huyết sắc tố sắt màu đỏ ở động vật có xương sống, máu loài này chứa protein gốc đồng hemocyanin với hiệu suất vận chuyển oxy vượt trội trong môi trường nước lạnh và áp suất cao dưới đáy biển sâu.",
            },
            {
              title: "Ngừng tim khi bơi nhanh",
              desc: "Khi bơi phản lực tốc độ cao, quả tim chính tạm ngừng co bóp để tối ưu áp suất, khiến loài này dễ kiệt sức nếu phải duy trì tốc độ cao liên tục trong thời gian dài.",
            },
          ],
        },
        {
          id: "nervous",
          nameVi: "Hệ thần kinh & 9 bộ não",
          nameEn: "Nervous System & Distributed Ganglia",
          icon: Brain,
          color: "cyan",
          headline: "Mạng lưới trí tuệ phân tán linh hoạt với khả năng phối hợp độc lập từng cánh tay",
          details: [
            {
              title: "Não bộ trung tâm bao quanh thực quản",
              desc: "Bộ não chính chịu trách nhiệm xử lý thông tin cấp cao, trí nhớ dài hạn và quyết định các hành vi phức tạp như giải mê cung và sử dụng công cụ.",
            },
            {
              title: "8 hạch thần kinh độc lập ở xúc tu",
              desc: "Mỗi cánh tay sở hữu một cụm hạch thần kinh riêng biệt, cho phép xúc tu tự do luồn lách, nếm mùi vị và kiểm tra con mồi mà không cần chờ lệnh từ não trung ương.",
            },
            {
              title: "Hàng ngàn giác hút đa cảm giác",
              desc: "Hơn 2.000 giác hút trên cánh tay được trang bị hàng triệu thụ thể hóa học để nếm và thụ thể cơ học để cảm nhận bề mặt, giúp nhận biết con mồi ngay trong bóng tối tuyệt đối.",
            },
          ],
        },
        {
          id: "camouflage",
          nameVi: "Ngụy trang & tế bào sắc tố",
          nameEn: "Camouflage & Chromatophores",
          icon: Sparkles,
          color: "amber",
          headline: "Kỹ thuật tàng hình sinh học tức thời thông qua điều khiển xung thần kinh trực tiếp",
          details: [
            {
              title: "Tế bào sắc tố chromatophore",
              desc: "Hàng triệu túi sắc tố co giãn dưới da được kết nối trực tiếp với các bó cơ vi mô do não bộ điều khiển, có thể giãn nở hoặc co rút trong tích tắc để tái hiện màu sắc môi trường xung quanh.",
            },
            {
              title: "Lớp phản xạ ánh sáng chuyên sâu",
              desc: "Các tầng tế bào nằm sâu dưới lớp da phản chiếu ánh sáng và tán xạ ánh sáng trắng ngọc trai, giúp hòa trộn hoàn hảo với rạn san hô, sỏi đá hoặc rong biển.",
            },
            {
              title: "Túi mực phòng thủ chứa enzyme tyrosinase",
              desc: "Túi mực chứa melanin đậm đặc kết hợp enzyme làm tê liệt khứu giác của kẻ săn mồi, tạo ra đám mây đen đánh lạc hướng để đào thoát an toàn.",
            },
          ],
        },
        {
          id: "locomotion",
          nameVi: "Áp suất & vận động siphon",
          nameEn: "Hydrodynamics & Siphon Jet Propulsion",
          icon: Waves,
          color: "emerald",
          headline: "Cơ thể hoàn toàn không xương cho phép biến dạng linh hoạt và phản lực nước cực mạnh",
          details: [
            {
              title: "Thân mềm không có khung xương",
              desc: "Bộ phận cứng duy nhất là chiếc mỏ chitin sắc bén như mỏ vẹt. Nhờ đó, sinh vật có thể luồn lách qua bất kỳ khe nứt đá ngầm nào có kích thước lớn hơn nhãn cầu mắt.",
            },
            {
              title: "Cơ chế phản lực qua ống siphon",
              desc: "Hút nước biển vào khoang áo rồi co bóp cơ bắp cực mạnh tống nước ra qua ống siphon định hướng, tạo lực đẩy đưa cơ thể lao vút về phía trước với gia tốc lớn.",
            },
            {
              title: "Khả năng chống chịu áp suất biển sâu",
              desc: "Không sở hữu bóng khí hay xoang kín chứa khí, các mô tế bào lỏng cân bằng áp suất tự nhiên với nước biển xung quanh, giúp sinh vật lặn sâu mà không gặp chấn thương áp lực.",
            },
          ],
        },
      ],
    };
  }

  // 6. Phân loại động vật có vú biển
  if (
    cat.includes("mammal") ||
    cat.includes("mammalia") ||
    cat.includes("dong-vat-co-vu-bien") ||
    cat.includes("vú") ||
    cat.includes("cetacea") ||
    cat.includes("delphinidae") ||
    cat.includes("sirenia") ||
    name.includes("cá voi") ||
    name.includes("cá heo") ||
    name.includes("dugong") ||
    name.includes("bò biển") ||
    name.includes("dolphin") ||
    name.includes("whale") ||
    sciName.includes("delphinus") ||
    sciName.includes("lagenodelphis") ||
    sciName.includes("stenella") ||
    sciName.includes("tursiops") ||
    sciName.includes("sousa") ||
    sciName.includes("orca") ||
    sciName.includes("balaenoptera") ||
    sciName.includes("megaptera")
  ) {
    return {
      groupLabel: isEn ? "Marine Mammals" : "Động vật có vú biển",
      metrics: [
        { label: isEn ? "Max Breath-Hold" : "Nín thở tối đa", value: isEn ? "60 - 90 mins" : "60 - 90 phút", sub: isEn ? "Muscle myoglobin oxygen load" : "Dung tích nạp oxy trong cơ bắp", color: "text-cyan-400" },
        { label: isEn ? "Blubber Layer" : "Lớp mỡ dưới da", value: "15 - 30 cm", sub: isEn ? "Thermal insulation & energy store" : "Cách nhiệt và tích trữ năng lượng", color: "text-amber-400" },
        { label: isEn ? "Biosonar Frequency" : "Định vị âm thanh", value: isEn ? "Over 150 kHz" : "Hơn 150 kHz", sub: isEn ? "Ultrasonic echolocation beam" : "Sóng siêu âm qua khối mỡ trán", color: "text-indigo-400" },
        { label: isEn ? "Lung Exchange" : "Dung tích phổi", value: isEn ? "90% capacity" : "90% dung tích", sub: isEn ? "Gas exchange efficiency per breath" : "Hiệu suất trao đổi khí mỗi lần thở", color: "text-emerald-400" },
      ],
      systems: [
        {
          id: "respiratory",
          nameVi: "Hệ hô hấp & cơ chế lặn sâu",
          nameEn: "Respiratory & Deep-Dive Adaptation",
          icon: Activity,
          color: "cyan",
          headline: "Khả năng tích trữ oxy cực đại trong cơ bắp nhờ myoglobin và cơ chế co xẹp phổi an toàn",
          details: [
            {
              title: "Hàm lượng myoglobin kỷ lục",
              desc: "Động vật có vú biển nén lượng lớn oxy trực tiếp vào các sợi cơ sẫm màu nhờ nồng độ myoglobin cao, giúp duy trì hoạt động trong thời gian dài dưới nước sâu.",
            },
            {
              title: "Cơ chế co xẹp lồng ngực tự nhiên",
              desc: "Khi lặn xuống độ sâu lớn, xương sườn mềm uốn cong giúp phổi co xẹp tự nhiên để đẩy khí nitơ ra đường dẫn khí cứng, ngăn ngừa hội chứng giảm áp khi trồi lên mặt nước.",
            },
            {
              title: "Phản xạ làm chậm nhịp tim",
              desc: "Khi lặn xuống nước lạnh, nhịp tim lập tức giảm từ 60 nhịp mỗi phút xuống chỉ còn 4 đến 8 nhịp mỗi phút, dồn máu nuôi não và tim để tiết kiệm năng lượng tối đa.",
            },
          ],
        },
        {
          id: "echolocation",
          nameVi: "Định vị sóng âm sinh học",
          nameEn: "Biosonar & Sensory Navigation",
          icon: Brain,
          color: "indigo",
          headline: "Hệ thống định vị âm thanh độ phân giải cao xuyên thấu bóng tối đại dương",
          details: [
            {
              title: "Khối mỡ hội tụ âm trên trán",
              desc: "Khối mỡ chuyên biệt nằm ở trán đóng vai trò như thấu kính âm học, tập trung và hội tụ các chùm sóng siêu âm phát ra từ các nếp gấp thanh quản.",
            },
            {
              title: "Thu nhận sóng dội qua xương hàm dưới",
              desc: "Sóng âm phản xạ từ con mồi hoặc địa hình đáy biển được truyền qua khoang mỡ trong xương hàm dưới về tai trong, giúp não bộ dựng bản đồ không gian chuẩn xác.",
            },
          ],
        },
        {
          id: "thermal",
          nameVi: "Lớp mỡ cách nhiệt & điều nhiệt",
          nameEn: "Insulation Layer & Thermoregulation",
          icon: Shield,
          color: "amber",
          headline: "Lớp mỡ dày giữ ấm cốt lõi cơ thể trong làn nước biển băng giá",
          details: [
            {
              title: "Lớp mỡ cách nhiệt dày hàng chục centimet",
              desc: "Mạng lưới sợi collagen đan xen tế bào mỡ bão hòa tạo thành lớp chắn nhiệt, đồng thời đóng vai trò là kho dự trữ năng lượng cho các chuyến di cư xa.",
            },
            {
              title: "Mạch máu trao đổi nhiệt ngược dòng",
              desc: "Máu ấm từ tim truyền nhiệt trực tiếp cho máu lạnh quay về từ vây bơi, ngăn ngừa hiện tượng mất nhiệt cốt lõi khi bơi qua các vùng nước lạnh.",
            },
          ],
        },
      ],
    };
  }

  // 7. Phân loại cá sụn (Cá mập, Cá đuối, Cá nhám — đặt TRƯỚC cá xương)
  if (
    cat.includes("sụn") ||
    cat.includes("elasmobranchii") ||
    cat.includes("chondrichthyes") ||
    name.includes("cá mập") ||
    name.includes("cá đuối") ||
    name.includes("cá nhám") ||
    sciName.includes("carcharodon") ||
    sciName.includes("rhincodon") ||
    sciName.includes("taeniura") ||
    sciName.includes("mobula")
  ) {
    return {
      groupLabel: "Cá sụn biển",
      metrics: [
        { label: "Cảm ứng điện trường", value: "Ampullae of Lorenzini", sub: "Phát hiện nhịp tim con mồi dưới cát", color: "text-amber-400" },
        { label: "Khung xương sụn", value: "100% sụn mềm", sub: "Nhẹ và linh hoạt hơn xương cứng", color: "text-cyan-400" },
        { label: "Kiểm soát độ nổi", value: "Gan giàu dầu squalene", sub: "Không có bóng khí như cá xương", color: "text-emerald-400" },
        { label: "Lớp vảy bì", value: "Vảy tấm răng cưa", sub: "Triệt tiêu xoáy nước tăng tốc", color: "text-indigo-400" },
      ],
      systems: [
        {
          id: "electro",
          nameVi: "Giác quan thụ cảm điện trường",
          nameEn: "Ampullae of Lorenzini",
          icon: Brain,
          color: "amber",
          headline: `${displayName} sở hữu mạng lưới lỗ thụ cảm chứa gel dẫn điện cảm nhận điện thế nano-volt từ cơ bắp con mồi`,
          details: [
            {
              title: "Bầu cảm giác Ampullae of Lorenzini",
              desc: "Hàng ngàn lỗ nhỏ tập trung quanh đầu và mõm chứa gel glycoprotein dẫn điện cao, giúp định vị chính xác vị trí con mồi ẩn mình dưới đáy cát.",
            },
            {
              title: "Định vị từ trường trái đất",
              desc: "Cảm nhận từ trường đại dương để định hướng bơi xuyên qua các vùng biển rộng trong những hành trình di cư hàng ngàn kilômét.",
            },
          ],
        },
        {
          id: "buoyancy",
          nameVi: "Cơ chế độ nổi & gan chứa dầu squalene",
          nameEn: "Buoyancy & Squalene Liver",
          icon: Activity,
          color: "emerald",
          headline: "Gan lớn giàu lipid tỷ trọng thấp giúp duy trì độ nổi trung tính mà không cần bóng khí",
          details: [
            {
              title: "Không sở hữu bóng khí",
              desc: "Khác với cá xương, cá sụn không có bóng khí nên có thể thay đổi độ sâu nhanh chóng mà không gặp chấn thương áp suất.",
            },
            {
              title: "Dầu squalene nhẹ hơn nước",
              desc: "Dầu squalene trong gan tạo lực nâng tự nhiên, kết hợp đôi vây ngực như cánh nâng giúp giữ thăng bằng khi lướt nước.",
            },
          ],
        },
      ],
    };
  }

  // 8. Phân loại rắn biển (Tách riêng khỏi rùa biển)
  if (
    name.includes("rắn biển") ||
    name.includes("đẻn") ||
    sciName.includes("hydrophis") ||
    sciName.includes("laticauda") ||
    sciName.includes("microcephalophis") ||
    cat.includes("elapidae")
  ) {
    return {
      groupLabel: "Rắn biển (Bò sát thích nghi hoàn toàn)",
      metrics: [
        { label: "Vây bơi", value: "Đuôi dẹt dạng mái chèo", sub: "Tạo lực đẩy linh hoạt trong cột nước", color: "text-cyan-400" },
        { label: "Hô hấp kép", value: "Phổi dài + Qua da", sub: "Hấp thụ tới 20% oxy trực tiếp qua da", color: "text-emerald-400" },
        { label: "Tuyến thải muối", value: "Dưới lưỡi chuyên biệt", sub: "Loại bỏ muối NaCl giữ cân bằng dịch", color: "text-amber-400" },
        { label: "Nọc sinh học", value: "Neurotoxin hiệu lực cao", sub: "Làm bất động cá mồi rạn san hô ngay lập tức", color: "text-rose-400" },
      ],
      systems: [
        {
          id: "sea-snake-respiration",
          nameVi: "Phổi kéo dài & hô hấp qua da",
          nameEn: "Elongated Lung & Cutaneous Gas Exchange",
          icon: Waves,
          color: "cyan",
          headline: `${displayName} có một lá phổi kéo dài dọc cơ thể kết hợp trao đổi khí qua da để lặn sâu hàng chục phút`,
          details: [
            {
              title: "Van đóng kín lỗ mũi khi lặn",
              desc: "Lỗ mũi nằm cao ở đỉnh mõm và có van cơ đóng chặt tự động ngay khi rắn chìm xuống nước, ngăn nước biển tràn vào đường thở.",
            },
            {
              title: "Đuôi dẹt bên chuyên hóa bơi lội",
              desc: "Đoạn đuôi ép dẹt như mái chèo cùng thân thuôn giúp uốn lượn nhẹ nhàng len lỏi vào các hốc đá ngầm tìm cá nhỏ và lươn biển.",
            },
          ],
        },
        {
          id: "sea-snake-salt",
          nameVi: "Tuyến muối dưới lưỡi & nọc độc",
          nameEn: "Sublingual Salt Gland & Venom Apparatus",
          icon: Shield,
          color: "rose",
          headline: "Đào thải lượng muối hấp thụ từ nước biển và săn mồi nhanh gọn bằng nọc thần kinh",
          details: [
            {
              title: "Tuyến muối dưới lưỡi",
              desc: "Khác với rùa biển thải muối qua hốc mắt, rắn biển bài tiết muối cô đặc qua tuyến dưới lưỡi mỗi khi thè lưỡi ra ngoài.",
            },
            {
              title: "Răng nanh cố định phía trước",
              desc: "Tiết nọc độc tác động nhanh lên hệ thần kinh cá mồi để con mồi không kịp vùng vẫy làm tổn thương lớp vảy mềm.",
            },
          ],
        },
      ],
    };
  }

  // 9. Phân loại rùa biển (Bò sát có mai)
  if (
    cat.includes("reptile") ||
    cat.includes("bo-sat-bien") ||
    cat.includes("bò sát") ||
    name.includes("rùa") ||
    name.includes("vích") ||
    name.includes("đồi mồi") ||
    sciName.includes("chelonia") ||
    sciName.includes("eretmochelys") ||
    sciName.includes("dermochelys")
  ) {
    return {
      groupLabel: "Rùa biển (Bò sát có mai)",
      metrics: [
        { label: "Tuyến bài tiết muối", value: "Sau hốc mắt", sub: "Thải lượng muối dư thừa hiệu quả", color: "text-amber-400" },
        { label: "Mai sừng bảo vệ", value: "Khung xương sọ & sườn", sub: "Chống chịu va chạm và áp lực", color: "text-emerald-400" },
        { label: "Thời gian lặn sâu", value: "4 - 7 giờ", sub: "Trạng thái nghỉ ngơi dưới rạn đá", color: "text-cyan-400" },
        { label: "Định vị địa từ", value: "Từ trường trái đất", sub: "Định hướng trở về bãi đẻ tự nhiên", color: "text-indigo-400" },
      ],
      systems: [
        {
          id: "salt-gland",
          nameVi: "Tuyến muối sau hốc mắt",
          nameEn: "Salt Glands",
          icon: Activity,
          color: "amber",
          headline: `${displayName} duy trì cân bằng điện giải nhờ tuyến muối sau hốc mắt liên tục lọc muối dư ra khỏi máu`,
          details: [
            {
              title: "Hiện tượng rùa đào thải muối",
              desc: "Tuyến muối sau hốc mắt bơm lượng muối dư thừa ra ngoài dưới dạng dịch mặn đậm đặc, đảm bảo cơ thể không bị mất nước nội bào.",
            },
          ],
        },
        {
          id: "shell",
          nameVi: "Cấu trúc mai xương lướt nước",
          nameEn: "Hydrodynamic Shell & Skeleton",
          icon: Shield,
          color: "emerald",
          headline: "Bộ giáp sinh học tiến hóa thành hình dạng thuôn dẹt giúp lướt sóng ít tốn sức",
          details: [
            {
              title: "Mai dẹt hình giọt nước",
              desc: "Giảm lực cản thủy động lực khi bơi qua các dòng hải lưu dài hàng ngàn kilômét.",
            },
            {
              title: "Chi trước biến đổi thành mái chèo",
              desc: "Các xương bàn kéo dài liên kết cơ ngực khỏe tạo lực nâng như đôi cánh dưới nước.",
            },
          ],
        },
      ],
    };
  }

  // 10. San hô, sứa, hải quỳ & bọt biển (Cnidaria / Porifera)
  if (
    cat.includes("cnidaria") ||
    cat.includes("porifera") ||
    cat.includes("san-ho-thuc-vat-bien") ||
    cat.includes("san hô") ||
    cat.includes("thực vật") ||
    name.includes("san hô") ||
    name.includes("hải quỳ") ||
    name.includes("sứa") ||
    name.includes("bọt biển") ||
    name.includes("hải miên") ||
    sciName.includes("acropora") ||
    sciName.includes("euplectella")
  ) {
    const isCoralReef =
      name.includes("san hô") || cat.includes("anthozoa") || sciName.includes("acropora");
    if (!isCoralReef) {
      return {
        groupLabel: "Thích ty bào & Hải miên",
        metrics: [
          { label: "Tỉ lệ nước", value: "90 - 95% nước", sub: "Cơ thể keo nhẹ nổi trôi hoặc lọc dòng", color: "text-cyan-400" },
          { label: "Tế bào phòng vệ", value: "Nematocyst / Gai", sub: "Tế bào châm hoặc khung gai silica", color: "text-rose-400" },
          { label: "Hô hấp trực tiếp", value: "Khuếch tán bề mặt", sub: "Trao đổi khí trực tiếp với nước biển", color: "text-emerald-400" },
          { label: "Hệ thần kinh", value: "Mạng lưới phân tán", sub: "Phản xạ co bóp nhịp nhàng không cần não", color: "text-indigo-400" },
        ],
        systems: [
          {
            id: "gel-cnida",
            nameVi: "Cấu trúc keo sinh học & tế bào châm",
            nameEn: "Mesoglea & Cnidocytes",
            icon: Waves,
            color: "cyan",
            headline: `${displayName} sở hữu cơ thể đối xứng tỏa tròn với tầng keo đàn hồi hoặc khung mạng lọc dòng nước biển`,
            details: [
              {
                title: "Động lực co bóp dù / Lọc lỗ xốp",
                desc: "Cơ vòng dưới dù tạo xung đẩy nước giúp sứa trôi nhịp nhàng; với hải miên, tế bào cổ áo (choanocyte) quạt nước liên tục qua hàng triệu lỗ nhỏ.",
              },
              {
                title: "Cơ chế tự vệ bằng tế bào gai",
                desc: "Xúc tu mang tế bào châm phóng sợi gai chứa độc tố tức thời khi chạm vào con mồi phù du hoặc kẻ săn mồi.",
              },
            ],
          },
        ],
      };
    }

    return {
      groupLabel: "San hô kiến tạo rạn",
      metrics: [
        { label: "Quần thể polyp", value: "Hàng triệu cá thể", sub: "Cấu trúc khuẩn lạc liên kết", color: "text-rose-400" },
        { label: "Cộng sinh tảo", value: "Zooxanthellae", sub: "Cung cấp tới 90% năng lượng quang hợp", color: "text-emerald-400" },
        { label: "Bộ khung đá vôi", value: "Canxi cacbonat", sub: "Kiến tạo rạn san hô đại dương", color: "text-amber-400" },
        { label: "Tế bào thích ty", value: "Nematocyst", sub: "Phóng nọc độc bắt phù du về đêm", color: "text-cyan-400" },
      ],
      systems: [
        {
          id: "symbiosis",
          nameVi: "Cộng sinh tảo & quang hợp",
          nameEn: "Zooxanthellae Symbiosis",
          icon: Activity,
          color: "emerald",
          headline: `${displayName} cộng sinh chặt chẽ với vi tảo quang hợp Zooxanthellae bên trong tế bào nội bì`,
          details: [
            {
              title: "Trao đổi chất nội bào",
              desc: "Tảo đơn bào hấp thụ ánh sáng mặt trời tạo đường glucose và oxy nuôi sống polyp, đổi lại nhận nitơ và nơi trú ẩn an toàn.",
            },
            {
              title: "Nhạy cảm với nhiệt độ nước",
              desc: "Khi nhiệt độ nước biển tăng bất thường kéo dài, polyp bị stress và đẩy tảo cộng sinh ra ngoài, gây hiện tượng tẩy trắng san hô.",
            },
          ],
        },
        {
          id: "calcification",
          nameVi: "Lắng đọng khung xương đá vôi",
          nameEn: "CaCO3 Skeleton Calcification",
          icon: Shield,
          color: "amber",
          headline: "Quá trình sinh hóa kết tủa Canxi cacbonat kiến tạo cấu trúc rạn vững chắc",
          details: [
            {
              title: "Xây dựng khung xương aragonite",
              desc: "Các tế bào đáy chiết xuất ion canxi và cacbonat từ nước biển tạo chén đá vôi làm nền móng trú ẩn cho hàng ngàn loài sinh vật rạn.",
            },
          ],
        },
      ],
    };
  }

  // 11. Phân loại cá xương (Cá vây tia: Cá Chim Trắng, Cá Ngừ, Cá Hề, Cá Ngựa...)
  if (
    cat.includes("fish") ||
    cat.includes("actinopter") ||
    cat.includes("teleost") ||
    cat.includes("perciformes") ||
    cat.includes("ca-bien") ||
    cat.includes("cá") ||
    name.includes("cá ")
  ) {
    return {
      groupLabel: "Cá xương biển (Actinopterygii)",
      metrics: [
        { label: "Hiệu suất lọc mang", value: "80 - 85%", sub: "Dòng chảy đối lưu ngược dòng", color: "text-cyan-400" },
        { label: "Bóng khí điều phù", value: "Tự cân bằng", sub: `Giữ ổn định ở tầng ${species?.depth || "sống"}`, color: "text-emerald-400" },
        { label: "Đường bên cảm nhận", value: "360 độ", sub: "Cảm ứng vi rung động nước", color: "text-indigo-400" },
        { label: "Kích thước ghi nhận", value: species?.size || "Đang cập nhật", sub: "Cơ thân dẹt/thoi lướt dòng hải lưu", color: "text-rose-400" },
      ],
      systems: [
        {
          id: "gills",
          nameVi: "Hô hấp mang & trao đổi khí",
          nameEn: "Gills & Gas Exchange",
          icon: Activity,
          color: "cyan",
          headline: `${displayName} trích xuất oxy hòa tan hiệu suất cao nhờ cấu trúc phiến mang chảy ngược dòng`,
          details: [
            {
              title: "Nguyên lý dòng chảy ngược dòng",
              desc: "Nước biển đi qua phiến mang ngược chiều dòng máu mao mạch, duy trì chênh lệch áp suất giúp oxy khuếch tán liên tục vào hệ tuần hoàn.",
            },
            {
              title: "Bóng khí kiểm soát độ nổi",
              desc: "Túi khí co giãn tự nhiên giúp cá lơ lửng giữ thăng bằng ở độ sâu mong muốn mà không tốn nhiều năng lượng quẫy vây.",
            },
          ],
        },
        {
          id: "lateral-line",
          nameVi: "Hệ thống cảm nhận đường bên",
          nameEn: "Lateral Line Sensory System",
          icon: Brain,
          color: "indigo",
          headline: "Cơ quan thụ cảm áp suất chạy dọc thân giúp di chuyển theo đàn và né tránh kẻ săn mồi",
          details: [
            {
              title: "Chuỗi tế bào lông cảm ứng rung động",
              desc: "Ống đường bên dọc hai bên sườn nhận biết vi dao động áp suất nước, cho phép đàn cá đổi hướng đồng loạt trong nháy mắt.",
            },
            {
              title: "Định hướng trong vùng nước đục",
              desc: "Khi tầm nhìn hạn chế gần đáy bùn cát hoặc ban đêm, cá vẫn định vị được chướng ngại và dòng chảy xung quanh.",
            },
          ],
        },
        {
          id: "hydrodynamics",
          nameVi: "Thủy động lực & lớp nhầy giảm ma sát",
          nameEn: "Hydrodynamics & Skin Mucus",
          icon: Waves,
          color: "emerald",
          headline: "Cấu trúc vây và vảy xếp lợp giảm thiểu lực cản của nước và chống ký sinh trùng",
          details: [
            {
              title: "Lớp nhầy biểu bì bảo vệ",
              desc: "Chất nhầy trơn trên lớp vảy vừa làm giảm ma sát thủy động lực vừa chứa kháng thể tự nhiên ngăn vi khuẩn và nấm biển.",
            },
            {
              title: "Vây ngực & vây đuôi định hướng",
              desc: "Hệ xương tia vây linh hoạt giúp phanh gấp, xoay trở hẹp hoặc bứt tốc tức thì trước nguy hiểm.",
            },
          ],
        },
      ],
    };
  }

  // Fallback tối giản, gắn trực tiếp dữ liệu loài nếu chưa khớp nhóm nào ở trên
  const updatingLabel = isEn ? "Updating" : "Đang cập nhật";
  return {
    groupLabel: isEn
      ? species?.categoryEn || "Marine Biological Traits"
      : species?.categoryVi || "Đặc điểm sinh học biển",
    metrics: [
      {
        label: isEn ? "Body Size" : "Kích thước cơ thể",
        value: species?.size || updatingLabel,
        sub: isEn ? "Adult size range" : "Biên độ phát triển trưởng thành",
        color: "text-cyan-400",
      },
      {
        label: isEn ? "Depth Range" : "Tầng phân bố",
        value: species?.depth || updatingLabel,
        sub: isEn ? "Observed depth zone" : "Dải độ sâu sinh sống thực tế",
        color: "text-indigo-400",
      },
      {
        label: isEn ? "Taxonomy Group" : "Nhóm phân loại",
        value:
          (isEn
            ? species?.taxonomy?.family || species?.categoryEn
            : species?.taxonomy?.family || species?.categoryVi) || updatingLabel,
        sub: isEn ? "Identification profile" : "Hồ sơ định danh sinh học",
        color: "text-emerald-400",
      },
      {
        label: isEn ? "Diet Strategy" : "Dinh dưỡng",
        value: species?.diet ? (isEn ? "Specialized" : "Tập tính riêng") : updatingLabel,
        sub:
          species?.diet || (isEn ? "Supplementary data" : "Đang bổ sung dữ liệu"),
        color: "text-amber-400",
      },
    ],
    systems: [
      {
        id: "habitat-adaptation",
        nameVi: "Thích nghi sinh cảnh tự nhiên",
        nameEn: "Natural Habitat Adaptation",
        icon: Compass,
        color: "cyan",
        headline: isEn
          ? `${displayName} evolved specialized morphological traits adapted to depth range of ${species?.depth || "natural marine waters"}`
          : `${displayName} phát triển các đặc điểm hình thái phù hợp với dải độ sâu ${species?.depth || "biển tự nhiên"}`,
        details: [
          {
            title: isEn ? "Osmoregulation & Pressure" : "Cân bằng áp suất và độ mặn",
            desc: isEn
              ? `Physiological osmoregulation adapted to ${species?.eastSeaZone || "marine environment"}.`
              : `Cơ thể điều hòa áp suất thẩm thấu phù hợp với môi trường ${species?.eastSeaZone || "nước mặn đại dương"}.`,
          },
          {
            title: isEn ? "Foraging Behavior" : "Chiến lược kiếm ăn",
            desc: species?.diet
              ? (isEn ? `Recorded nutrition: ${species.diet}.` : `Nguồn dinh dưỡng ghi nhận: ${species.diet}.`)
              : (isEn ? "Energy optimization tuned with marine currents." : "Tối ưu hóa tiêu thụ năng lượng theo chu kỳ thủy triều và dòng chảy."),
          },
        ],
      },
    ],
  };
}

export function AnatomySection({ species }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [tabSelection, setTabSelection] = useState({ speciesId: null, idx: 0 });
  const currentSpeciesId = species?.id ?? null;
  const activeSystemTab =
    tabSelection.speciesId === currentSpeciesId ? tabSelection.idx : 0;
  const setActiveSystemTab = (idx) => {
    setTabSelection({ speciesId: currentSpeciesId, idx });
  };

  // Kiểm tra mô hình 3D bóc tách của loài
  const isShark = useMemo(() => {
    if (!species) return false;
    const slug = (species?.slug || "").toLowerCase();
    const id = (species?.id || "").toString().toLowerCase();
    const nameVi = (species?.nameVi || species?.commonName || "").toLowerCase();
    const nameEn = (species?.nameEn || "").toLowerCase();
    const sciName = (species?.sciName || species?.scientificName || "").toLowerCase();

    return (
      slug.includes("shark") ||
      slug.includes("ca-map-trang") ||
      id === "great-white-shark-1" ||
      id === "1" ||
      nameVi.includes("cá mập trắng") ||
      nameVi.includes("ca map trang") ||
      nameEn.includes("great white shark") ||
      sciName.includes("carcharodon")
    );
  }, [species]);

  const hasDedicated3D = Boolean(species?.model3dUrl || species?.model3D || isShark);
  const resolvedModel3dUrl = species?.model3dUrl || species?.model3D || (isShark ? "/models/shark.glb" : null);

  const anatomyProfile = useMemo(() => {
    return getSpeciesAnatomyProfile(species, isEn);
  }, [species, isEn]);

  if (!species) {
    return null;
  }

  // Hiển thị mô hình 3D tương tác
  if (hasDedicated3D && resolvedModel3dUrl) {
    return (
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans">
        {/* Top Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
            {t("speciesDetail.anatomyTitle") || "Phân tích và giải phẫu"}
          </h2>
        </div>

        {/* 3D INTERACTIVE ANATOMY VIEWER */}
        <div className="w-full flex flex-col items-center">
          <Interactive3DAnatomyViewer
            species={species}
            language={language}
            onSelectPart={setActiveHotspot}
            selectedPartId={activeHotspot?.id}
            model3dUrl={resolvedModel3dUrl}
          />
        </div>
      </section>
    );
  }

  // Hiển thị sơ đồ giải phẫu minh họa
  const currentSystem = anatomyProfile.systems[activeSystemTab] || anatomyProfile.systems[0];
  const SystemIcon = currentSystem?.icon || Activity;

  return (
    <section className="py-10 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans">
      {/* ── Tiêu đề & Điều hướng mô hình 3D mẫu ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
              {t("speciesDetail.anatomyTitle") || (isEn ? "Anatomy & Physiology" : "Cấu trúc giải phẫu & sinh lý học")}
            </h2>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {anatomyProfile.groupLabel}
            </span>
          </div>
        </div>

        {/* Trạng thái mô hình 3D */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#112d4e] border border-white/15 text-slate-300 text-xs font-medium shrink-0">
          <Box size={14} className="text-sky-400" />
          <span>
            {t(
              "speciesDetail.model3dUpdating",
              isEn ? "3D Model: Updating" : "Mô hình 3D: Đang cập nhật"
            )}
          </span>
        </span>
      </div>

      {/* ── 4 Chỉ số sinh lý nổi bật ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {anatomyProfile.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#183c66] border border-white/15 shadow-sm"
          >
            <p className="text-xs text-slate-300">
              {m.label}
            </p>
            <p className={`text-base md:text-lg font-bold mt-1 ${m.color || "text-white"}`}>
              {m.value}
            </p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Các tab chọn hệ cơ quan ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none border-b border-white/10">
        {anatomyProfile.systems.map((sys, idx) => {
          const Icon = sys.icon || Activity;
          const isActive = activeSystemTab === idx;
          return (
            <button
              key={sys.id}
              type="button"
              onClick={() => setActiveSystemTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-500 text-white font-bold shadow-sm"
                  : "bg-[#112d4e] hover:bg-[#183c66] border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{language === "en" ? sys.nameEn : sys.nameVi}</span>
            </button>
          );
        })}
      </div>

      {/* ── Nội dung chi tiết của hệ cơ quan được chọn ── */}
      <div className="space-y-4">
        {/* Khối tóm tắt cơ chế chính */}
        <div className="p-4 rounded-xl bg-[#143357] border border-sky-400/30 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 shrink-0">
            <SystemIcon size={20} />
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            {isEn ? (currentSystem.headlineEn || currentSystem.headline) : (currentSystem.headlineVi || currentSystem.headline)}
          </p>
        </div>

        {/* 3 Khối phân tích giải phẫu chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentSystem.details.map((detail, idx) => (
            <div
              key={idx}
              className="p-4 md:p-5 rounded-xl bg-[#183c66] border border-white/15 flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-5 h-5 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {isEn ? (detail.titleEn || detail.title) : (detail.titleVi || detail.title)}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7 flex-1">
                {isEn ? (detail.descEn || detail.desc) : (detail.descVi || detail.desc)}
              </p>
            </div>
          ))}
        </div>

        {/* Ghi chú đặc trưng sinh học */}
        {species?.fullBioHighlightsVi && species.fullBioHighlightsVi.length > 0 && (
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-xs text-slate-300">
            <Info size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-slate-300/90">
              <span className="font-semibold text-cyan-300 mr-1.5">
                {isEn ? "Biological Note:" : "Ghi nhận sinh học:"}
              </span>
              "{isEn
                ? (species.fullBioHighlightsEn?.[activeSystemTab % (species.fullBioHighlightsEn?.length || 1)]?.content || species.descEn || species.description)
                : (species.fullBioHighlightsVi[activeSystemTab % species.fullBioHighlightsVi.length]?.content || species.descVi || species.description)}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
