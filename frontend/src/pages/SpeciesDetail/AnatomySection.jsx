import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Brain,
  Activity,
  Waves,
  Shield,
  Box,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { Interactive3DAnatomyViewer } from "../../components/species/Interactive3DAnatomyViewer";

// Hồ sơ sinh lý học & cấu trúc giải phẫu học thuật tự nhiên, tinh gọn, không lạm dụng chữ hoa và từ trong ngoặc
function getSpeciesAnatomyProfile(species) {
  const name = (species?.nameVi || species?.commonName || "").toLowerCase();
  const cat = (species?.category || species?.categoryVi || "").toLowerCase();
  const sciName = (species?.sciName || species?.scientificName || "").toLowerCase();

  // Phân loại sinh vật đơn bào & rãnh thẳm biển sâu
  if (
    name.includes("trùng") ||
    sciName.includes("syringammina") ||
    sciName.includes("foram") ||
    name.includes("đơn bào") ||
    cat.includes("biển sâu") ||
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
          headline: "Sinh vật đơn bào lớn nhất hành tinh với mạng lưới tế bào chất đa nhân phân nhánh (granellare)",
          details: [
            {
              title: "Tế bào chất hợp bào đa nhân",
              desc: "Toàn bộ cơ thể khổng lồ thực chất là một tế bào duy nhất chứa hàng triệu nhân tế bào, kết nối thành mạng lưới ống tế bào chất phân nhánh xuyên suốt cơ thể.",
            },
            {
              title: "Vỏ kết dính hạt khoáng (Test)",
              desc: "Tiết ra chất hữu cơ kết dính các hạt cát, khoáng vật barit và vỏ vi sinh vật đáy biển thành khung giàn tổ ong cứng cáp chống chịu áp suất biển sâu nghìn mét.",
            },
          ],
        },
        {
          id: "nutrition",
          nameVi: "Cơ chế bắt mồi & chuỗi dinh dưỡng đáy thẳm",
          nameEn: "Benthic Filter Feeding",
          icon: Brain,
          color: "indigo",
          headline: "Hấp thụ vật chất hữu cơ chìm lắng và vi khuẩn trong lớp bùn đáy đại dương",
          details: [
            {
              title: "Lọc tuyết biển (Marine Snow)",
              desc: "Mở rộng các chân giả (pseudopodia) ra ngoài vỏ để bắt giữ các hạt vụn hữu cơ trôi dạt từ các tầng nước trên rơi xuống đáy biển.",
            },
            {
              title: "Môi trường sống đáy vực sâu",
              desc: "Tạo nơi trú ẩn và giá thể bám cho nhiều loài giun nhiều tơ, giáp xác nhỏ và vi khuẩn đáy thẳm tại các rãnh sâu Biển Đông.",
            },
          ],
        },
      ],
    };
  }

  // Phân loại thân mềm
  if (
    cat.includes("mollusk") ||
    cat.includes("thân mềm") ||
    name.includes("bạch tuộc") ||
    name.includes("mực") ||
    name.includes("ốc") ||
    name.includes("trai") ||
    sciName.includes("octopus") ||
    sciName.includes("enteroctopus")
  ) {
    return {
      groupLabel: "Động vật thân mềm",
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

  // Phân loại động vật có vú biển
  if (
    cat.includes("mammal") ||
    cat.includes("vú") ||
    name.includes("cá voi") ||
    name.includes("cá heo") ||
    name.includes("dugong") ||
    name.includes("bò biển")
  ) {
    return {
      groupLabel: "Động vật có vú biển",
      metrics: [
        { label: "Nín thở tối đa", value: "60 - 90 phút", sub: "Dung tích nạp oxy trong cơ bắp", color: "text-cyan-400" },
        { label: "Lớp mỡ dưới da", value: "15 - 30 cm", sub: "Cách nhiệt và tích trữ năng lượng", color: "text-amber-400" },
        { label: "Định vị âm thanh", value: "Hơn 150 kHz", sub: "Sóng siêu âm qua khối mỡ trán", color: "text-indigo-400" },
        { label: "Dung tích phổi", value: "90% dung tích", sub: "Hiệu suất trao đổi khí mỗi lần thở", color: "text-emerald-400" },
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

  // Phân loại cá có xương
  if (
    cat.includes("fish") ||
    cat.includes("cá") ||
    name.includes("cá ngừ") ||
    name.includes("cá hề") ||
    name.includes("cá vẹt") ||
    name.includes("cá trích")
  ) {
    return {
      groupLabel: "Cá xương biển",
      metrics: [
        { label: "Hiệu suất lọc mang", value: "80 - 85%", sub: "Dòng chảy đối lưu ngược dòng", color: "text-cyan-400" },
        { label: "Bóng khí điều phù", value: "Tự cân bằng", sub: "Kiểm soát độ nổi chính xác", color: "text-emerald-400" },
        { label: "Đường bên cảm nhận", value: "360 độ", sub: "Cảm ứng vi rung động nước", color: "text-indigo-400" },
        { label: "Cơ thịt đỏ bền bỉ", value: "Tuần hoàn kín", sub: "Duy trì bơi liên tục không mệt", color: "text-rose-400" },
      ],
      systems: [
        {
          id: "gills",
          nameVi: "Hô hấp mang & trao đổi khí",
          nameEn: "Gills & Gas Exchange",
          icon: Activity,
          color: "cyan",
          headline: "Cơ chế trích xuất oxy hòa tan với hiệu suất cao trong môi trường nước",
          details: [
            {
              title: "Nguyên lý dòng chảy ngược dòng",
              desc: "Nước biển chảy qua phiến mang ngược chiều với dòng máu trong mao mạch, đảm bảo oxy luôn khuếch tán liên tục và đồng đều vào hệ tuần hoàn.",
            },
            {
              title: "Bóng khí kiểm soát độ nổi",
              desc: "Bóng khí tự nhiên giúp cá giữ thăng bằng ở bất kỳ độ sâu mong muốn nào mà không phải tiêu tốn nhiều năng lượng quẫy bơi liên tục.",
            },
          ],
        },
        {
          id: "lateral-line",
          nameVi: "Hệ thống cảm nhận đường bên",
          nameEn: "Lateral Line Sensory System",
          icon: Brain,
          color: "indigo",
          headline: "Giác quan phát hiện chuyển động nước và áp suất bầy đàn",
          details: [
            {
              title: "Hàng tế bào thụ thể chuyên biệt",
              desc: "Dải ống chạy dọc thân chứa các tế bào lông cảm nhận vi dao động của nước, giúp đàn cá bơi đồng bộ hàng vạn con mà không va chạm.",
            },
            {
              title: "Phát hiện kẻ săn mồi trong bóng tối",
              desc: "Ngay cả khi tầm nhìn bị hạn chế, cá vẫn cảm nhận được chính xác khoảng cách và hướng di chuyển của vật thể xung quanh nhờ sóng chấn động nước.",
            },
          ],
        },
        {
          id: "hydrodynamics",
          nameVi: "Thủy động lực & lớp nhầy giảm ma sát",
          nameEn: "Hydrodynamics & Skin Mucus",
          icon: Waves,
          color: "emerald",
          headline: "Thân hình thoi thuôn dài giảm thiểu lực cản ma sát của dòng nước",
          details: [
            {
              title: "Lớp nhầy bề mặt bảo vệ",
              desc: "Bề mặt da được phủ một lớp nhầy trơn mịn giúp triệt tiêu các xoáy nước ma sát, đồng thời bảo vệ cá trước vi khuẩn và ký sinh trùng biển.",
            },
            {
              title: "Vây đuôi tạo lực đẩy phản hồi",
              desc: "Cấu trúc vây đuôi chắc khỏe tạo lực đẩy phản hồi mạnh, giúp cá bứt tốc tức thì để săn bắt con mồi hoặc thoát khỏi nguy hiểm.",
            },
          ],
        },
      ],
    };
  }

  // Phân loại bò sát biển
  if (
    cat.includes("reptile") ||
    cat.includes("bò sát") ||
    name.includes("rùa") ||
    name.includes("vích") ||
    name.includes("đồi mồi") ||
    name.includes("rắn biển")
  ) {
    return {
      groupLabel: "Bò sát biển",
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
          headline: "Cơ chế đào thải muối sinh học giúp duy trì cân bằng điện giải khi sống trong nước mặn",
          details: [
            {
              title: "Hiện tượng rùa đào thải muối",
              desc: "Tuyến muối sau hốc mắt liên tục bơm lượng muối dư thừa ra khỏi máu dưới dạng dịch mặn đậm đặc, bảo đảm cơ thể không bị mất nước nội bào.",
            },
          ],
        },
        {
          id: "shell",
          nameVi: "Cấu trúc mai xương lướt nước",
          nameEn: "Hydrodynamic Shell & Skeleton",
          icon: Shield,
          color: "emerald",
          headline: "Bộ giáp sinh học tiến hóa thành hình dạng thuôn dẹt lướt sóng",
          details: [
            {
              title: "Mai dẹt hình giọt nước",
              desc: "Mai dẹt giúp rùa biển lướt êm trong các dòng hải lưu dài hàng ngàn cây số mà ít tiêu hao sức lực.",
            },
            {
              title: "Vây bơi trước hình mái chèo",
              desc: "Các xương chi trước kéo dài và liên kết màng cơ bắp chắc khỏe, hoạt động như đôi cánh tàu ngầm tạo lực nâng và điều hướng linh hoạt.",
            },
          ],
        },
      ],
    };
  }

  // Phân loại san hô & động vật thích ty bào (Cnidaria)
  if (
    cat.includes("san hô") ||
    cat.includes("thực vật") ||
    name.includes("san hô") ||
    name.includes("hải quỳ") ||
    name.includes("sứa") ||
    sciName.includes("acropora")
  ) {
    return {
      groupLabel: "San hô & Thích ty bào",
      metrics: [
        { label: "Quần thể polyp", value: "Hàng triệu cá thể", sub: "Cấu trúc khuẩn lạc liên kết", color: "text-rose-400" },
        { label: "Cộng sinh tảo", value: "Zooxanthellae", sub: "Cung cấp 90% năng lượng qua quang hợp", color: "text-emerald-400" },
        { label: "Bộ khung đá vôi", value: "Canxi cacbonat", sub: "Kiến tạo rạn san hô đại dương", color: "text-amber-400" },
        { label: "Tế bào thích ty", value: "Nematocyst", sub: "Phóng nọc độc tự vệ và săn mồi", color: "text-cyan-400" },
      ],
      systems: [
        {
          id: "symbiosis",
          nameVi: "Cộng sinh tảo & quang hợp",
          nameEn: "Zooxanthellae Symbiosis",
          icon: Activity,
          color: "emerald",
          headline: "Mối quan hệ cộng sinh kỳ diệu giữa polyp động vật và tảo quang hợp Zooxanthellae",
          details: [
            {
              title: "Trao đổi chất nội bào",
              desc: "Tảo đơn bào Zooxanthellae cư ngụ bên trong tế bào san hô, hấp thụ ánh sáng mặt trời để tạo ra đường glucose và oxy nuôi sống san hô, đổi lại nhận chất dinh dưỡng và môi trường bảo vệ an toàn.",
            },
            {
              title: "Nhạy cảm với nhiệt độ nước",
              desc: "Khi nhiệt độ nước biển tăng quá 1 - 2 độ C trong thời gian dài, san hô bị stress và trục xuất tảo cộng sinh, dẫn đến hiện tượng tẩy trắng san hô (coral bleaching).",
            },
          ],
        },
        {
          id: "calcification",
          nameVi: "Lắng đọng khung xương đá vôi",
          nameEn: "CaCO3 Skeleton Calcification",
          icon: Shield,
          color: "amber",
          headline: "Quá trình sinh hóa kết tủa Canxi cacbonat kiến tạo các rạn san hô kỳ vĩ",
          details: [
            {
              title: "Xây dựng khung xương canxi",
              desc: "Các tế bào đáy liên tục chiết xuất ion canxi và cacbonat từ nước biển để tạo thành các chén đá vôi vững chắc, đóng vai trò nền móng cho toàn bộ hệ sinh thái biển nhiệt đới.",
            },
          ],
        },
      ],
    };
  }

  // Phân loại cá sụn (Cá mập, Cá đuối)
  if (
    cat.includes("sụn") ||
    name.includes("cá mập") ||
    name.includes("cá đuối") ||
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
          headline: "Mạng lưới lỗ thụ cảm chứa gel dẫn điện cảm nhận điện thế nano-volt của sinh vật",
          details: [
            {
              title: "Bầu cảm giác Ampullae of Lorenzini",
              desc: "Hàng ngàn lỗ nhỏ tập trung quanh đầu và mõm cá mập/cá đuối chứa gel glycoprotein dẫn điện cao, giúp định vị chính xác vị trí con mồi ẩn mình dưới đáy cát.",
            },
            {
              title: "Định vị từ trường trái đất",
              desc: "Giúp chúng cảm nhận từ trường của đại dương để định hướng bơi xuyên các đại dương trong các chuyến hải trình di cư hàng ngàn kilomet.",
            },
          ],
        },
        {
          id: "buoyancy",
          nameVi: "Cơ chế độ nổi & gan chứa dầu squalene",
          nameEn: "Buoyancy & Squalene Liver",
          icon: Activity,
          color: "emerald",
          headline: "Gan khổng lồ chiếm tới 25% khối lượng cơ thể giúp giữ độ nổi trung tính",
          details: [
            {
              title: "Không sở hữu bóng khí",
              desc: "Khác với cá xương, cá sụn không có bóng khí nên không gặp nguy hiểm chấn thương khi thay đổi độ sâu đột ngột.",
            },
            {
              title: "Dầu squalene nhẹ hơn nước",
              desc: "Lượng dầu squalene tỷ trọng thấp trong gan khổng lồ tạo lực nâng tự nhiên, kết hợp vây ngực như cánh máy bay giữ cá nổi khi bơi.",
            },
          ],
        },
      ],
    };
  }

  // Phân loại các nhóm sinh vật biển khác
  return {
    groupLabel: "Cấu trúc sinh học biển sâu",
    metrics: [
      { label: "Thích nghi áp suất", value: "Tự nhiên", sub: "Cân bằng nội bào ổn định", color: "text-cyan-400" },
      { label: "Trao đổi chất", value: "Tối ưu hóa", sub: "Tiết kiệm năng lượng vùng nước tối", color: "text-emerald-400" },
      { label: "Cảm ứng môi trường", value: "Thụ thể hóa học", sub: "Nhận biết dòng chảy và dinh dưỡng", color: "text-indigo-400" },
      { label: "Cơ chế sinh tồn", value: "Đặc hữu", sub: "Tiến hóa thích nghi bền bỉ", color: "text-amber-400" },
    ],
    systems: [
      {
        id: "cellular",
        nameVi: "Cấu trúc tế bào & cân bằng nội môi",
        nameEn: "Cellular Structure & Homeostasis",
        icon: Activity,
        color: "cyan",
        headline: "Cơ chế chuyển hóa năng lượng thích nghi ổn định với áp lực và độ mặn",
        details: [
          {
            title: "Trao đổi chất qua màng thẩm thấu",
            desc: "Các tế bào biểu mô có màng bán thấm điều tiết nồng độ ion muối và khoáng chất, đảm bảo hoạt động sinh lý bình thường dưới áp suất cao.",
          },
          {
            title: "Thích nghi nhiệt độ nước biển",
            desc: "Thành phần lipid màng tế bào linh động giúp duy trì trao đổi chất ngay cả ở nhiệt độ gần đóng băng.",
          },
        ],
      },
      {
        id: "defense",
        nameVi: "Cơ chế phòng vệ sinh thái",
        nameEn: "Ecological Defense & Adaptation",
        icon: Shield,
        color: "emerald",
        headline: "Phối hợp sinh thái và cơ chế tự vệ trước môi trường khắc nghiệt",
        details: [
          {
            title: "Cộng sinh và tuần hoàn dinh dưỡng",
            desc: "Đóng vai trò mắt xích trong chuỗi thức ăn đại dương, trao đổi vật chất với các sinh vật phù du và vi sinh vật biển sâu.",
          },
        ],
      },
    ],
  };
}

export function AnatomySection({ species }) {
  const { language, t } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeSystemTab, setActiveSystemTab] = useState(0);

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
    return getSpeciesAnatomyProfile(species);
  }, [species]);

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
              {t("speciesDetail.anatomyTitle") || "Cấu trúc giải phẫu & sinh lý học"}
            </h2>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {anatomyProfile.groupLabel}
            </span>
          </div>
        </div>

        {/* Trạng thái mô hình 3D */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200/80 text-xs font-medium shrink-0">
          <Box size={14} className="text-cyan-400" />
          <span>Mô hình 3D: Đang cập nhật</span>
        </span>
      </div>

      {/* ── 4 Chỉ số sinh lý nổi bật ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {anatomyProfile.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#12233f]/75 hover:bg-[#162c4e]/85 border border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-xl shadow-md shadow-cyan-950/20 transition-all duration-300"
          >
            <p className="text-xs text-slate-400">
              {m.label}
            </p>
            <p className={`text-base md:text-lg font-bold mt-1 ${m.color || "text-white"}`}>
              {m.value}
            </p>
            <p className="text-[11px] text-slate-400/80 mt-0.5">
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
              onClick={() => setActiveSystemTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-sm shadow-cyan-500/20"
                  : "bg-[#10233e]/50 hover:bg-[#152e50]/75 border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <Icon size={14} className={isActive ? "text-cyan-400" : "text-slate-400"} />
              <span>{language === "en" ? sys.nameEn : sys.nameVi}</span>
            </button>
          );
        })}
      </div>

      {/* ── Nội dung chi tiết của hệ cơ quan được chọn ── */}
      <div className="space-y-4">
        {/* Khối tóm tắt cơ chế chính */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#12233f]/80 to-blue-950/40 border border-cyan-500/30 backdrop-blur-xl flex items-center gap-3 shadow-md shadow-cyan-950/20">
          <div className="p-2.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shrink-0">
            <SystemIcon size={20} />
          </div>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            {currentSystem.headline}
          </p>
        </div>

        {/* 3 Khối phân tích giải phẫu chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentSystem.details.map((detail, idx) => (
            <div
              key={idx}
              className="p-4 md:p-5 rounded-xl bg-[#12233f]/70 hover:bg-[#162c4e]/85 border border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-xl flex flex-col transition-all duration-300 shadow-md shadow-cyan-950/15"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {detail.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed pl-7 flex-1">
                {detail.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Ghi chú đặc trưng sinh học */}
        {species?.fullBioHighlightsVi && species.fullBioHighlightsVi.length > 0 && (
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-xs text-slate-300">
            <Info size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-slate-300/90">
              <span className="font-semibold text-cyan-300 mr-1.5">Ghi nhận sinh học:</span>
              "{species.fullBioHighlightsVi[activeSystemTab % species.fullBioHighlightsVi.length]?.content || species.descVi}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
