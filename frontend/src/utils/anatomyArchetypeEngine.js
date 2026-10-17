export const MASTER_ARCHETYPES = {
  osteichthyes: {
    id: "osteichthyes",
    nameVi: "Cá có xương điển hình",
    nameEn: "Bony Fish (Osteichthyes)",
    taxaGroup: "Lớp Cá vây tia & Cá xương (Actinopterygii / Osteichthyes)",
    coverageVi:
      "Phủ sóng hơn 34,000+ loài cá biển (Cá hề, cá mú, cá ngừ, cá hồng, cá chuồn...)",
    badgeColor: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Biểu bì & Vảy",
        labelEn: "Epidermis & Scales",
        descVi:
          "Hình thái ngoại quan — vảy tròn ctenoid/cycloid bọc chất nhầy giảm ma sát nước.",
        descEn:
          "External contour — hydrodynamic scales coated with mucus to reduce water friction.",
        accent: "cyan",
        hotspots: [
          {
            id: "ost_e1",
            x: 14,
            y: 48,
            labelVi: "Mõm & Hàm dưới",
            labelEn: "Terminal Mouth & Premaxilla",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Os praemaxillare",
            descVi: "Khung hàm xương có thể nhô ra để hút con mồi nhanh chóng.",
            descEn:
              "Protrusible premaxilla creating suction to capture prey instantly.",
            medicalData: {
              weightEstimate: "~4% thể trọng",
              functionVi: "Tạo áp suất âm hút con mồi trong 1/50 giây",
              functionEn:
                "Generates negative suction pressure within 20 milliseconds",
              medicalUseVi:
                "Mô phỏng cơ cấu hút mẫu sinh học trong ống nội soi vi phẫu",
              medicalUseEn:
                "Biomimetic high-speed fluid suction in micro-endoscopy",
              source: "Fish Biomechanics Compendium",
            },
          },
          {
            id: "ost_e2",
            x: 28,
            y: 50,
            labelVi: "Nắp mang (Operculum)",
            labelEn: "Bony Operculum",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Operculum branchiale",
            descVi:
              "Tấm xương linh hoạt đậy khe mang, chủ động bơm hút nước qua mang ngay cả khi đứng yên.",
            descEn:
              "Bony flap protecting delicate gills and pumping water actively even when motionless.",
            medicalData: {
              weightEstimate: "~2% thể trọng",
              functionVi: "Chủ động bơm đẩy dòng nước qua cung mang",
              functionEn: "Dual-phase buccal-opercular respiratory pumping",
              medicalUseVi:
                "Nghiên cứu van một chiều chịu dao động áp suất liên tục",
              medicalUseEn:
                "High-cycle biological passive flap-valve mechanics",
              source: "Functional Morphology of Teleosts",
            },
          },
          {
            id: "ost_e3",
            x: 50,
            y: 22,
            labelVi: "Vây lưng gai",
            labelEn: "Spiny Dorsal Fin",
            sys: "muscular",
            system: "muscular",
            latinName: "Pinna dorsalis spinosa",
            descVi:
              "Các gai vây cứng tự vệ và giữ thăng bằng hướng bơi trong dòng chảy.",
            descEn:
              "Rigid fin spines providing defensive armor and directional stability.",
            medicalData: {
              weightEstimate: "~1.5% thể trọng",
              functionVi:
                "Khóa góc bơi và triệt tiêu dao động xoay lật (roll stability)",
              functionEn: "Yaw and roll stabilization in turbulent currents",
              medicalUseVi:
                "Thiết kế vây ổn định cho tàu lặn không người lái AUV",
              medicalUseEn:
                "Stabilizing hydrofoils for Autonomous Underwater Vehicles (AUVs)",
              source: "Marine Hydrodynamics & Fish Propulsion",
            },
          },
          {
            id: "ost_e4",
            x: 38,
            y: 66,
            labelVi: "Vây ngực & Vây bụng",
            labelEn: "Pectoral & Pelvic Fins",
            sys: "muscular",
            system: "muscular",
            latinName: "Pinnae pectorales et ventrales",
            descVi:
              "Cặp vây cơ động giúp xoay trở góc hẹp trong rạn san hô Biển Đông.",
            descEn:
              "Paired fins offering agile turning maneuverability in coral reef matrices.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi: "Phanh hãm và định hướng đa chiều góc hẹp",
              functionEn: "Precision hovering and multi-axis vector steering",
              medicalUseVi:
                "Khớp cánh vẫy linh hoạt trong robot y tế thám hiểm lòng ống",
              medicalUseEn: "Bio-inspired multi-axis undulating propulsors",
              source: "Fish Locomotion Mechanics",
            },
          },
          {
            id: "ost_e5",
            x: 86,
            y: 50,
            labelVi: "Vây đuôi đồng quy",
            labelEn: "Homocercal Tail",
            sys: "muscular",
            system: "muscular",
            latinName: "Pinna caudalis homocerca",
            descVi:
              "Cấu trúc vây đuôi đối xứng tạo lực đẩy bơi tiến liên tục mà không gây lệch góc.",
            descEn:
              "Symmetrical tail delivering continuous linear forward propulsion.",
            medicalData: {
              weightEstimate: "~5% thể trọng",
              functionVi: "Tạo lực đẩy tiến tuyến tính chính",
              functionEn:
                "Symmetrical thrust delivery with zero parasitic pitch",
              medicalUseVi:
                "Chân vịt mềm mô phỏng đuôi cá tiết kiệm 30% năng lượng",
              medicalUseEn:
                "Energy-efficient biomimetic oscillating foil propulsion",
              source: "Journal of Fluid Mechanics",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Da & Giác quan",
        labelEn: "Sensory & Skin",
        descVi:
          "Hệ thống đường bên cảm ứng rung động và túi khứu giác phát hiện mùi con mồi.",
        descEn: "Lateral line pressure-wave receptor and dual olfactory pits.",
        accent: "amber",
        hotspots: [
          {
            id: "ost_s1",
            x: 20,
            y: 40,
            labelVi: "Hố khứu giác kép",
            labelEn: "Dual Olfactory Pits",
            sys: "nervous",
            system: "nervous",
            latinName: "Fovea olfactoria",
            descVi:
              "Hai lỗ mũi mù lọc nước biển để nhận diện pheromone đồng loại và hóa chất con mồi.",
            descEn:
              "Blind nasal pits sensing chemical cues, prey odors, and schooling pheromones.",
            medicalData: {
              weightEstimate: "Màng khứu giác vi mô",
              functionVi: "Thụ cảm hóa học phân tử mùi nồng độ pico-molar",
              functionEn: "Pico-molar chemical cue and amino acid sensing",
              medicalUseVi:
                "Cảm biến sinh học phát hiện độc chất nước biển siêu nhạy",
              medicalUseEn:
                "Ultra-sensitive aquatic biosensors for contaminant tracing",
              source: "Sensory Biology of Fishes",
            },
          },
          {
            id: "ost_s2",
            x: 55,
            y: 46,
            labelVi: "Đường bên thụ cảm",
            labelEn: "Lateral Line System",
            sys: "nervous",
            system: "nervous",
            latinName: "Linea lateralis",
            descVi:
              "Dãy tế bào lông thần kinh chạy dọc thân cảm nhận vi dao động áp suất nước biển.",
            descEn:
              "Linear row of neuromast hair cells detecting low-frequency water turbulence.",
            medicalData: {
              weightEstimate: "Mạng tế bào lông thần kinh",
              functionVi:
                "Cảm biến dòng chảy thủy động học và tránh va chạm đàn cá",
              functionEn: "Hydrodynamic pressure wave and wake navigation",
              medicalUseVi:
                "Hệ thống cảm biến áp suất vi cơ điện tử gắn trên thân tàu ngầm",
              medicalUseEn:
                "Artificial neuromast arrays for underwater flow sensing",
              source: "Nature: Artificial Lateral Line Technology",
            },
          },
          {
            id: "ost_s3",
            x: 26,
            y: 42,
            labelVi: "Mắt cầu lồi & Thủy tinh thể tròn",
            labelEn: "Spherical Lens Eye",
            sys: "nervous",
            system: "nervous",
            latinName: "Lens crystallina sphaerica",
            descVi:
              "Thủy tinh thể hình cầu cứng tối ưu góc nhìn rộng dưới tán xạ quang học nước biển.",
            descEn:
              "Dense spherical lens maximizing wide focal range in refractive seawater.",
            medicalData: {
              weightEstimate: "~0.8% thể trọng",
              functionVi:
                "Hội tụ quang học góc rộng trong môi trường chiết suất nước",
              functionEn: "High-refractive index focal correction underwater",
              medicalUseVi:
                "Ống kính quang học fisheye không méo biên cho máy dò ngầm",
              medicalUseEn:
                "Non-distorting wide-angle lenses for subsea photography",
              source: "Aquatic Optics",
            },
          },
        ],
      },
      {
        percent: 50,
        labelVi: "Hệ cơ vận động",
        labelEn: "Myomere Muscles",
        descVi:
          "Các khối cơ vân hình chữ W (Myomeres) xếp so le tạo sóng chuyển động bơi.",
        descEn:
          "W-shaped myomere muscle blocks producing undulating swimming waves.",
        accent: "rose",
        hotspots: [
          {
            id: "ost_m1",
            x: 45,
            y: 40,
            labelVi: "Khối cơ lưng (Epaxial)",
            labelEn: "Epaxial Muscle Block",
            sys: "muscular",
            system: "muscular",
            latinName: "Myomeri epaxiales",
            descVi:
              "Cơ lưng co thắt nhịp nhàng uốn cong thân cá sang hai bên tạo lực bơi vọt.",
            descEn:
              "Dorsal muscle segments generating rapid burst acceleration.",
            medicalData: {
              weightEstimate: "~28% khối lượng cơ thể",
              functionVi: "Uốn cong thân tạo sóng vận động hình sin",
              functionEn: "Sinusoidal body undulation producing forward drive",
              medicalUseVi:
                "Nghiên cứu cơ chế tiêu thụ glucose trong vận động bền",
              medicalUseEn:
                "Metabolic glycogen utilization in sustained locomotion",
              source: "Comparative Muscle Physiology",
            },
          },
          {
            id: "ost_m2",
            x: 52,
            y: 60,
            labelVi: "Khối cơ bụng (Hypaxial)",
            labelEn: "Hypaxial Muscle Block",
            sys: "muscular",
            system: "muscular",
            latinName: "Myomeri hypaxiales",
            descVi:
              "Cơ bụng nâng đỡ khoang nội tạng và phối hợp vẫy đuôi chuyển hướng.",
            descEn:
              "Ventral muscular foundation stabilizing visceral cavity and tail steering.",
            medicalData: {
              weightEstimate: "~22% khối lượng cơ thể",
              functionVi: "Cân bằng trọng tâm và nén khoang nội tạng",
              functionEn:
                "Visceral wall stabilization and caudal steering coordination",
              medicalUseVi: "Mô hình cơ quan phát lực mềm phân đoạn",
              medicalUseEn:
                "Segmented soft actuator design for underwater robotics",
              source: "Fish Biomechanics",
            },
          },
          {
            id: "ost_m3",
            x: 75,
            y: 50,
            labelVi: "Cơ cuống đuôi",
            labelEn: "Caudal Peduncle Muscles",
            sys: "muscular",
            system: "muscular",
            latinName: "Musculi pedunculi caudalis",
            descVi:
              "Vùng hội tụ gân cơ chịu ứng suất cơ học cao nhất khi bơi đối kháng dòng hải lưu.",
            descEn:
              "High-tensile tendon matrix translating body flex into maximum water displacement.",
            medicalData: {
              weightEstimate: "~8% khối lượng",
              functionVi: "Truyền dẫn ứng suất lực từ thân ra vây đuôi",
              functionEn: "Tensile stress transfer to caudal propulsive blade",
              medicalUseVi: "Gân sợi nhân tạo composite chịu mỏi chu kỳ cao",
              medicalUseEn:
                "High-cycle fatigue-resistant artificial tendon composites",
              source: "Bio-Tendon Research",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Nội tạng & Hô hấp",
        labelEn: "Visceral Organs",
        descVi:
          "Bóng hơi điều chỉnh độ nổi, tim 2 ngăn và hệ tiêu hóa tối ưu hóa năng lượng.",
        descEn:
          "Hydrostatic swim bladder, two-chambered heart and high-efficiency digestion.",
        accent: "blue",
        hotspots: [
          {
            id: "ost_o1",
            x: 30,
            y: 55,
            labelVi: "Tim 2 ngăn & Hành động mạch",
            labelEn: "Two-Chambered Heart",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Cor bipartitum",
            descVi:
              "Gồm 1 tâm nhĩ và 1 tâm thất bơm máu tĩnh mạch lên các cung mang để lấy oxy.",
            descEn:
              "Single-circuit heart pumping deoxygenated blood through gill arches for gas exchange.",
            medicalData: {
              weightEstimate: "~0.2% thể trọng",
              functionVi: "Duy trì dòng tuần hoàn đơn áp suất liên tục",
              functionEn: "Single-circuit branchial blood perfusion",
              medicalUseVi:
                "Mô hình nghiên cứu tái sinh mô cơ tim sau tổn thương",
              medicalUseEn:
                "Zebrafish and teleost cardiac regeneration research",
              source: "Comparative Cardiology",
            },
          },
          {
            id: "ost_o2",
            x: 28,
            y: 48,
            labelVi: "Các cung mang đỏ",
            labelEn: "Filamentous Gills",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Branchiae filiformes",
            descVi:
              "Hàng trăm phiến mang siêu mỏng trao đổi khí ngược dòng (*counter-current exchange*).",
            descEn:
              "Feathery gill lamellae utilizing counter-current oxygen exchange with seawater.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi: "Hấp thụ oxy với hiệu suất 80% qua cơ chế ngược dòng",
              functionEn:
                "Counter-current exchange extracting up to 80% dissolved O2",
              medicalUseVi:
                "Hệ thống màng trao đổi khí nhân tạo ECMO trong hồi sức cấp cứu",
              medicalUseEn:
                "Microfluidic artificial lung oxygenators inspired by gill lamellae",
              source: "Respiratory Physiology of Marine Teleosts",
            },
          },
          {
            id: "ost_o3",
            x: 50,
            y: 42,
            labelVi: "Bóng hơi thủy tĩnh (Swim Bladder)",
            labelEn: "Hydrostatic Swim Bladder",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Vesica natatoria",
            descVi:
              "Túi chứa khí nitơ/oxy giúp cá giữ lơ lửng ở mọi tầng nước mà không tốn công bơi.",
            descEn:
              "Gas-filled organ controlling neutral buoyancy across varying ocean depths.",
            medicalData: {
              weightEstimate: "~5% thể tích thân",
              functionVi:
                "Cân bằng thủy tĩnh trung tính và khuếch đại âm thanh",
              functionEn: "Neutral buoyancy regulation and acoustic resonance",
              medicalUseVi:
                "Hệ thống kiểm soát độ nổi tự động cho phao trôi quan trắc biển",
              medicalUseEn:
                "Autonomous buoyancy engines for oceanic profiling floats",
              source: "Fish Acoustics & Buoyancy Biology",
            },
          },
          {
            id: "ost_o4",
            x: 44,
            y: 58,
            labelVi: "Dạ dày & Manh tràng môn vị",
            labelEn: "Stomach & Pyloric Caeca",
            sys: "digestive",
            system: "digestive",
            latinName: "Ventriculus et Appendices pyloricae",
            descVi:
              "Túi tiêu hóa co bóp mạnh kết hợp các manh tràng tăng cường tiết enzyme phân giải thức ăn.",
            descEn:
              "Muscular stomach paired with finger-like pyloric caeca for rapid enzyme digestion.",
            medicalData: {
              weightEstimate: "~2.5% thể trọng",
              functionVi: "Tiêu hóa protein nhanh chóng và hấp thụ lipid",
              functionEn: "Rapid proteolytic breakdown and nutrient uptake",
              medicalUseVi:
                "Enzyme Protease biển chịu kiềm dùng trong công nghệ giặt sinh học và y tế",
              medicalUseEn:
                "Cold-active marine proteases for pharmaceutical formulation",
              source: "Comparative Digestive Physiology",
            },
          },
          {
            id: "ost_o5",
            x: 38,
            y: 60,
            labelVi: "Gan mật & Tụy tạng",
            labelEn: "Liver & Gallbladder",
            sys: "digestive",
            system: "digestive",
            latinName: "Hepar et Vesica biliaris",
            descVi:
              "Gan lọc độc tố, dự trữ glycogen và tiết dịch mật nhũ hóa chất béo từ phù du.",
            descEn:
              "Metabolic powerhouse storing energy reserves and producing fat-emulsifying bile.",
            medicalData: {
              weightEstimate: "~2% thể trọng",
              functionVi: "Giải độc máu, chuyển hóa lipid và dự trữ năng lượng",
              functionEn:
                "Detoxification, lipid synthesis and glycogen storage",
              medicalUseVi:
                "Nghiên cứu dầu cá Omega-3 và lipid biển chống xơ vữa động mạch",
              medicalUseEn:
                "Marine Omega-3 PUFA formulations for cardiovascular health",
              source: "Fish Biochemistry & Metabolism",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Khung xương canxi",
        labelEn: "Bony Skeleton",
        descVi:
          "Cột sống xương cứng chịu lực, cung xương đầu và các tia vây nâng đỡ.",
        descEn:
          "Calcified vertebral column, cranium and articulated bony fin rays.",
        accent: "slate",
        hotspots: [
          {
            id: "ost_b1",
            x: 22,
            y: 44,
            labelVi: "Hộp sọ xương (Neurocranium)",
            labelEn: "Neurocranium & Braincase",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Neurocranium",
            descVi:
              "Khối xương bảo vệ não bộ và các hốc mắt, kết nối cơ hàm linh hoạt.",
            descEn:
              "Rigid protective casing safeguarding brain and sensory apparatus.",
            medicalData: {
              weightEstimate: "~6% thể trọng",
              functionVi:
                "Bảo vệ các trung tâm giác quan thần kinh và neo cơ hàm",
              functionEn:
                "Cephalic brain protection and masticatory muscle anchor",
              medicalUseVi:
                "Vật liệu sinh học Hydroxyapatite chiết xuất xương cá làm xi măng ghép xương",
              medicalUseEn:
                "Fish-derived nano-hydroxyapatite in bone tissue engineering",
              source: "Biomaterials: Teleost Bone Hydroxyapatite",
            },
          },
          {
            id: "ost_b2",
            x: 54,
            y: 45,
            labelVi: "Cột sống & Gai thần kinh",
            labelEn: "Vertebrae & Neural Spines",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Columna vertebralis",
            descVi:
              "Trục xương chính chạy từ sọ tới đuôi với các gai xương bảo vệ tủy sống.",
            descEn:
              "Segmented calcified spine protecting dorsal spinal cord under swimming loads.",
            medicalData: {
              weightEstimate: "~8% thể trọng",
              functionVi: "Chịu tải uốn dọc trục thân mà không bị gãy vỡ",
              functionEn:
                "Axial compression and lateral bending load resistance",
              medicalUseVi: "Khớp nối uốn linh hoạt trong cơ điện tử y sinh",
              medicalUseEn:
                "Articulated bio-mechanic spine models in surgical robotics",
              source: "Osteology of Modern Fishes",
            },
          },
          {
            id: "ost_b3",
            x: 50,
            y: 55,
            labelVi: "Xương sườn bảo vệ nội tạng",
            labelEn: "Pleural Ribs",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Costae pleurales",
            descVi:
              "Các nhánh xương vòng ôm bảo vệ tim, bóng hơi và khoang tiêu hóa.",
            descEn:
              "Curved bony ribs shielding vital cardiac and hydrostatic organs from water pressure.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi: "Bảo vệ khoang màng bụng khỏi áp lực nén nước",
              functionEn:
                "Visceral cavity protection from external water compression",
              medicalUseVi:
                "Cấu trúc nan chịu lực bảo vệ thiết bị điện tử ngập nước",
              medicalUseEn:
                "Pressure-tolerant rib-frame housings for submersibles",
              source: "Fish Anatomy Atlas",
            },
          },
        ],
      },
    ],
  },

  chondrichthyes: {
    id: "chondrichthyes",
    nameVi: "Cá sụn",
    nameEn: "Cartilaginous Fish",
    taxaGroup: "Lớp cá sụn",
    coverageVi: "Cá mập voi, cá mập trắng, cá đuối ó, cá nhám búa...",
    badgeColor: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Biểu bì & Răng cưa",
        labelEn: "Dermal Denticles",
        descVi:
          "Lớp da bao phủ bởi vảy gai dạng răng (Placoid scales) triệt tiêu tiếng ồn thủy động học.",
        descEn:
          "Skin coated with placoid dermal denticles canceling acoustic noise and hydro-drag.",
        accent: "cyan",
        hotspots: [
          {
            id: "ch_e1",
            x: 14,
            y: 50,
            labelVi: "Mõm nhọn thủy động học",
            labelEn: "Hydrodynamic Rostrum",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Rostrum cartilagineum",
            descVi: "Chóp mõm giảm thiểu lực cản nước, định vị con mồi từ xa.",
            descEn:
              "Hydrodynamic snout minimizing drag and directing fluid flows.",
            medicalData: {
              weightEstimate: "~5% thể trọng",
              functionVi:
                "Cắt dòng nước và nâng đỡ các túi thụ cảm điện trường",
              functionEn:
                "Streamlined water shearing and housing electroreceptors",
              medicalUseVi:
                "Mô phỏng mũi tàu siêu tốc giảm sóng chấn và lực cản nhớt",
              medicalUseEn:
                "Biomimetic low-drag bulbous bows in naval engineering",
              source: "Elasmobranch Biomechanics",
            },
          },
          {
            id: "ch_e2",
            x: 44,
            y: 22,
            labelVi: "Vây lưng đứng sụn",
            labelEn: "Cartilaginous Dorsal Fin",
            sys: "muscular",
            system: "muscular",
            latinName: "Pinna dorsalis anterior",
            descVi: "Vây lưng ổn định trục bơi khi lượn vòng tốc độ cao.",
            descEn:
              "Stabilizing dorsal fin preventing roll during sudden predatory turns.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi: "Chống lật nghiêng khi bơi săn mồi góc ngoặt gấp",
              functionEn:
                "Anti-roll stabilization during acute high-speed turns",
              medicalUseVi:
                "Sụn cá mập chứa Chondroitin Sulfate ứng dụng trong điều trị thoái hóa khớp",
              medicalUseEn:
                "Chondroitin sulfate from shark cartilage for joint arthritis therapy",
              source: "Marine Pharmacology: Chondroitin",
            },
          },
          {
            id: "ch_e3",
            x: 86,
            y: 46,
            labelVi: "Vây đuôi bất đối xứng",
            labelEn: "Heterocercal Tail",
            sys: "muscular",
            system: "muscular",
            latinName: "Pinna caudalis heterocerca",
            descVi:
              "Thùy đuôi trên lớn hơn thùy dưới tạo góc lực nâng bơi chúi.",
            descEn:
              "Asymmetrical caudal fin providing forward thrust and upward pitch lift.",
            medicalData: {
              weightEstimate: "~7% thể trọng",
              functionVi: "Tạo lực đẩy tiến kèm vector nâng chúc đầu",
              functionEn:
                "Combined linear thrust and negative pitch compensation",
              medicalUseVi: "Thiết kế cánh đẩy dưới nước hiệu suất cao",
              medicalUseEn:
                "Asymmetrical subsea thrusters for heavy marine ROVs",
              source: "Hydrodynamics of Heterocercal Tails",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Điện thụ cảm & Giác quan",
        labelEn: "Ampullae & Senses",
        descVi:
          "Hệ thống lỗ điện thụ cảm Lorenzini phát hiện xung điện tim con mồi ở khoảng cách xa.",
        descEn:
          "Ampullae of Lorenzini electroreceptors sensing microvolt heartbeats.",
        accent: "amber",
        hotspots: [
          {
            id: "ch_s1",
            x: 18,
            y: 46,
            labelVi: "Bóng điện Lorenzini",
            labelEn: "Ampullae of Lorenzini",
            sys: "nervous",
            system: "nervous",
            latinName: "Ampullae Lorenzini",
            descVi:
              "Hàng trăm ống chứa gel dẫn điện dò tìm xung thần kinh của sinh vật ẩn nấp dưới cát.",
            descEn:
              "Electro-conductive jelly canals locating hidden buried prey via bioelectricity.",
            medicalData: {
              weightEstimate: "Gel dẫn điện sinh học",
              functionVi:
                "Cảm nhận biến thiên điện trường cực nhỏ cỡ nanovolt/cm",
              functionEn: "Nanovolt/cm gradient electroreception",
              medicalUseVi:
                "Vật liệu proton-conductive hydrogel nhạy điện ứng dụng trong chip sinh học",
              medicalUseEn:
                "Proton-conductive bio-hydrogels in bio-electronic sensors",
              source: "Nature: Lorenzini Jelly Conductivity",
            },
          },
          {
            id: "ch_s2",
            x: 28,
            y: 55,
            labelVi: "5 - 7 Khe mang trần",
            labelEn: "Exposed Gill Slits",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Rimae branchiales apertae",
            descVi:
              "Không có nắp mang xương; nước tự động xả qua khe mang khi bơi tiến (*ram ventilation*).",
            descEn:
              "Exposed slits relying on ram-ventilation forward swimming to flush oxygenated water.",
            medicalData: {
              weightEstimate: "~4% thể trọng",
              functionVi: "Hô hấp thụ động tốc độ cao khi bơi lội liên tục",
              functionEn:
                "Passive high-flow ram ventilation during constant locomotion",
              medicalUseVi:
                "Thiết kế khe khuếch tán dòng xả giảm tiếng ồn công nghiệp",
              medicalUseEn:
                "Acoustically dampened passive fluid diffusion slits",
              source: "Physiology of Elasmobranch Fishes",
            },
          },
        ],
      },
      {
        percent: 50,
        labelVi: "Hệ cơ vận động",
        labelEn: "Propulsive Musculature",
        descVi:
          "Khối cơ đỏ kỵ khí dọc hai bên thân tạo lực bơi bền bỉ qua hàng ngàn hải lý.",
        descEn:
          "Red and white myomere muscle bundles driving high-speed pursuit.",
        accent: "rose",
        hotspots: [
          {
            id: "ch_m1",
            x: 45,
            y: 44,
            labelVi: "Khối cơ lưng (Epaxial)",
            labelEn: "Epaxial Muscle Block",
            sys: "muscular",
            system: "muscular",
            latinName: "Myomeri epaxiales",
            descVi:
              "Cơ lưng cá mập co thắt nhịp nhàng tạo lực bơi bùng nổ lên tới 56 km/h.",
            descEn:
              "Powerful dorsal muscles driving explosive speed strikes up to 56 km/h.",
            medicalData: {
              weightEstimate: "~32% thể trọng",
              functionVi: "Tạo lực vẫy thân bơi tốc độ cao",
              functionEn: "Rapid body flexion and cruising thrust",
              medicalUseVi:
                "Nghiên cứu cơ chế chuyển hóa năng lượng axit lactic không mỏi",
              medicalUseEn:
                "Lactate clearance models in high-endurance marine muscle",
              source: "Comparative Muscle Physiology",
            },
          },
          {
            id: "ch_m2",
            x: 70,
            y: 50,
            labelVi: "Cơ cuống đuôi gia cường",
            labelEn: "Caudal Keel Muscles",
            sys: "muscular",
            system: "muscular",
            latinName: "Musculi pedunculi caudalis",
            descVi:
              "Gờ cơ cuống đuôi cứng chắc chịu lực uốn gập liên tục khi rượt đuổi con mồi.",
            descEn:
              "Rigid lateral keels minimizing drag and stabilizing high-speed tail beats.",
            medicalData: {
              weightEstimate: "~10% thể trọng",
              functionVi: "Truyền động năng từ thân vào vây đuôi lưỡi liềm",
              functionEn: "Kinetic energy transfer to crescent caudal blade",
              medicalUseVi: "Mô phỏng gân composite chịu mỏi đàn hồi",
              medicalUseEn: "Elastic fatigue-resistant biomimetic tendons",
              source: "Shark Propulsion Dynamics",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Gan dầu & Van xoắn",
        labelEn: "Squalene Liver & Spiral Valve",
        descVi:
          "Không có bóng hơi; gan tích dầu squalene khổng lồ đóng vai trò túi phao sinh học.",
        descEn:
          "Lacks swim bladder; enormous lipid-rich squalene liver acts as natural float.",
        accent: "blue",
        hotspots: [
          {
            id: "ch_o1",
            x: 45,
            y: 54,
            labelVi: "Gan squalene khổng lồ",
            labelEn: "Hyper-Lipid Liver",
            sys: "digestive",
            system: "digestive",
            latinName: "Hepar squaleniferum",
            descVi:
              "Chiếm tới 25 - 28% trọng lượng cơ thể, chứa dầu nhẹ hơn nước biển tạo sức nổi tự nhiên.",
            descEn:
              "Occupies up to 28% body mass; rich in low-density squalene oil for neutral buoyancy.",
            medicalData: {
              weightEstimate: "~25% - 28% tổng trọng lượng cá",
              functionVi:
                "Cân bằng lực nổi thủy tĩnh và dự trữ năng lượng sinh hóa",
              functionEn:
                "Neutral buoyancy floatation and biochemical energy vault",
              medicalUseVi:
                "Hợp chất Squalene tinh khiết làm tá dược tăng cường miễn dịch vắc-xin",
              medicalUseEn:
                "High-purity Squalene emulsion adjuvants in modern human vaccines",
              source: "Vaccine Adjuvants & Marine Lipids",
            },
          },
          {
            id: "ch_o2",
            x: 60,
            y: 56,
            labelVi: "Van xoắn ốc ruột",
            labelEn: "Spiral Valve Intestine",
            sys: "digestive",
            system: "digestive",
            latinName: "Valvula spiralis intestinalis",
            descVi:
              "Đoạn ruột xoắn vặn ốc tăng diện tích hấp thu dinh dưỡng gấp 5 lần mà không cần ruột dài.",
            descEn:
              "Internal spiral baffles maximizing nutrient absorption in compact body length.",
            medicalData: {
              weightEstimate: "~2% thể trọng",
              functionVi:
                "Kéo dài hành trình lưu giữ thức ăn trong khoang ruột ngắn",
              functionEn:
                "Multiplies absorptive surface area in short abdominal cavity",
              medicalUseVi:
                "Ống trao đổi nhiệt dạng xoắn ốc hiệu suất cực cao (Compact spiral exchangers)",
              medicalUseEn:
                "Compact helical flow mixers and microfluidic gradient columns",
              source: "Gut Morphology in Chondrichthyes",
            },
          },
          {
            id: "ch_o3",
            x: 34,
            y: 54,
            labelVi: "Tim sụn 2 ngăn",
            labelEn: "Two-Chamber Branchial Heart",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Cor branchiale bipartitum",
            descVi:
              "Bơm máu qua nón động mạch có nhiều van túi chịu áp lực cao.",
            descEn:
              "Contractile conus arteriosus with multi-tier valves pumping against systemic resistance.",
            medicalData: {
              weightEstimate: "~0.15% thể trọng",
              functionVi: "Bơm máu chịu sức cản mao mạch lớn ở các cung mang",
              functionEn:
                "High-pressure cardiac output through conus arteriosus",
              medicalUseVi: "Nghiên cứu van tim sinh học đa tầng chống hở van",
              medicalUseEn:
                "Multi-tier biological heart valve designs resisting regurgitation",
              source: "Comparative Cardiovascular Dynamics",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Bộ khung sụn linh hoạt",
        labelEn: "Cartilage Chondrocranium",
        descVi:
          "Toàn bộ khung sọ và cột sống cấu tạo bằng sụn nhẹ dẻo hơn xương cứng 50%.",
        descEn:
          "100% cartilaginous skeleton offering half the weight and double the elasticity of bone.",
        accent: "slate",
        hotspots: [
          {
            id: "ch_b1",
            x: 22,
            y: 44,
            labelVi: "Hộp sọ sụn (Chondrocranium)",
            labelEn: "Chondrocranium",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Chondrocranium",
            descVi:
              "Sọ liền khối bằng sụn nâng đỡ não bộ và mắt, đàn hồi khi va đập.",
            descEn:
              "Seamless flexible cartilage box protecting delicate neural faculties.",
            medicalData: {
              weightEstimate: "~5% thể trọng",
              functionVi:
                "Hấp thụ lực va đập đàn hồi không có đường khớp nối nứt gãy",
              functionEn:
                "Seamless elastic shock absorption with zero suture lines",
              medicalUseVi:
                "Màng sụn nhân tạo cấy ghép tái tạo sụn vành tai và sụn mũi",
              medicalUseEn:
                "Engineered biomimetic cartilage for reconstructive surgery",
              source: "Cartilage Tissue Engineering",
            },
          },
          {
            id: "ch_b2",
            x: 54,
            y: 46,
            labelVi: "Cột sống sụn vôi hóa",
            labelEn: "Calcified Cartilage Column",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Columna vertebralis cartilaginea",
            descVi:
              "Các đốt sụn được gia cường bằng tinh thể muối canxi tạo độ cứng vừa đủ mà nhẹ.",
            descEn:
              "Lightweight cartilage segments reinforced with mineralized calcium prismatic tiles.",
            medicalData: {
              weightEstimate: "~7% thể trọng",
              functionVi: "Đàn hồi uốn cong góc hẹp mà không sợ gãy xương",
              functionEn:
                "High-flexure bending endurance without mechanical fracture",
              medicalUseVi:
                "Vật liệu composite lai sụn - gốm sinh học chống mỏi cơ học",
              medicalUseEn:
                "Hybrid ceramic-cartilage biomaterials for spinal disc replacement",
              source: "Mineralized Cartilage Biomechanics",
            },
          },
        ],
      },
    ],
  },

  marine_mammals: {
    id: "marine_mammals",
    nameVi: "Thú biển có vú (Cá voi & Cá heo)",
    nameEn: "Marine Mammals (Cetacea & Sirenia)",
    taxaGroup: "Lớp Thú (Mammalia: Cetacea / Sirenia)",
    coverageVi: "Cá voi xanh, cá heo đốm, cá nhà táng, bò biển Dugong...",
    badgeColor: "text-sky-300 bg-sky-500/10 border-sky-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Lớp mỡ Blubber & Lỗ thở",
        labelEn: "Blubber & Blowhole",
        descVi:
          "Lớp mỡ dày giữ nhiệt trong nước lạnh và lỗ thở có van đóng mở trên đỉnh đầu.",
        descEn:
          "Thick insulating blubber layer and muscular dorsal blowhole valve.",
        accent: "cyan",
        hotspots: [
          {
            id: "mam_e1",
            x: 24,
            y: 24,
            labelVi: "Lỗ thở đỉnh đầu (Blowhole)",
            labelEn: "Dorsal Blowhole",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Spiraculum dorsale",
            descVi:
              "Lỗ mũi tiến hóa dời lên đỉnh sọ, đóng kín bằng cơ vòng khi lặn sâu để chống tràn nước.",
            descEn:
              "Dorsal nostril sealed by powerful muscular valves to prevent water ingestion.",
            medicalData: {
              weightEstimate: "~1.5% thể trọng",
              functionVi: "Khóa kín đường thở khi lặn chịu áp suất 200 atm",
              functionEn:
                "Hermetic sealing under high hydrostatic water pressure",
              medicalUseVi:
                "Van cơ học tự đóng áp suất cao trong thiết bị lặn biển sâu",
              medicalUseEn:
                "Pressure-actuated passive hermetic valves in hyperbaric gear",
              source: "Marine Mammal Physiology",
            },
          },
          {
            id: "mam_e2",
            x: 45,
            y: 65,
            labelVi: "Lớp mỡ cách nhiệt (Blubber)",
            labelEn: "Insulating Blubber Layer",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Panniculus adiposus (Blubber)",
            descVi:
              "Lớp mỡ dày tới 30cm giữ thân nhiệt hằng định 37°C và dự trữ năng lượng di cư.",
            descEn:
              "Dense subcutaneous adipose tissue maintaining 37°C core temperature in freezing depths.",
            medicalData: {
              weightEstimate: "~30% - 40% trọng lượng cơ thể",
              functionVi:
                "Cách nhiệt tuyệt đối và khoang dự trữ năng lượng trao đổi chất",
              functionEn: "Thermal insulation and metabolic energy reservoir",
              medicalUseVi:
                "Vật liệu cách nhiệt mỏng sinh học ứng dụng trong đồ lặn vùng cực",
              medicalUseEn:
                "Phase-change bio-insulation textiles for sub-zero maritime suits",
              source: "Thermal Biology of Cetaceans",
            },
          },
          {
            id: "mam_e3",
            x: 88,
            y: 48,
            labelVi: "Đuôi vẫy ngang (Flukes)",
            labelEn: "Horizontal Tail Flukes",
            sys: "muscular",
            system: "muscular",
            latinName: "Flukes caudales",
            descVi:
              "Vây đuôi nằm ngang đập lên xuống (khác với cá đập đuôi qua lại hai bên).",
            descEn:
              "Horizontal tail blades oscillating dorso-ventrally (unlike lateral fish tails).",
            medicalData: {
              weightEstimate: "~8% thể trọng",
              functionVi:
                "Tạo lực đẩy khổng lồ hàng chục kilo-Newton đưa thân thể bơi vọt",
              functionEn:
                "High-efficiency vertical oscillating hydrofoil propulsion",
              medicalUseVi:
                "Cánh quạt dao động dạng đuôi cá voi cho tàu vận tải biển xanh",
              medicalUseEn: "Zero-emission oscillating wing marine propulsors",
              source: "Cetacean Hydrodynamic Efficiency",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Cơ quan dội âm Melon",
        labelEn: "Echolocation Melon",
        descVi:
          "Khối mỡ trán tập trung phát chùm sóng siêu âm định vị sinh học (*Echolocation*).",
        descEn:
          "Acoustic fatty forehead organ focusing ultrasonic clicks for sonar navigation.",
        accent: "amber",
        hotspots: [
          {
            id: "mam_s1",
            x: 18,
            y: 38,
            labelVi: "Khối dội âm Melon",
            labelEn: "Acoustic Melon Organ",
            sys: "nervous",
            system: "nervous",
            latinName: "Organum melon",
            descVi:
              "Thấu kính âm học bằng lipid định hướng sóng siêu âm quét địa hình và tìm con mồi bóng tối.",
            descEn:
              "Lipid acoustic lens focusing echolocation beams into tight directional pulses.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi: "Định hình chùm sóng siêu âm tần số 20 - 150 kHz",
              functionEn: "Acoustic impedance matching and beam steering",
              medicalUseVi:
                "Đầu dò siêu âm y tế độ phân giải cao mô phỏng thấu kính lipid",
              medicalUseEn:
                "High-resolution biomimetic ultrasonic transducers for medical scans",
              source: "Journal of the Acoustical Society of America",
            },
          },
          {
            id: "mam_s2",
            x: 26,
            y: 42,
            labelVi: "Xương hàm dưới bắt âm",
            labelEn: "Auditory Lower Jaw",
            sys: "nervous",
            system: "nervous",
            latinName: "Mandibula acustica",
            descVi:
              "Hàm dưới rỗng chứa mỡ dẫn sóng âm phản hồi thẳng về tai giữa.",
            descEn:
              "Fat-filled acoustic channel in lower mandible channeling returning echoes to inner ear.",
            medicalData: {
              weightEstimate: "~4% thể trọng",
              functionVi: "Thu nhận tín hiệu âm vang phản xạ dưới nước 3 chiều",
              functionEn:
                "3D acoustic receiving pathway to tympanoperiotic complex",
              medicalUseVi:
                "Thiết bị dẫn truyền âm thanh qua xương sọ cho người khiếm thính",
              medicalUseEn:
                "Bone-conduction acoustic hearing aids inspired by cetacean jaw paths",
              source: "Auditory Systems in Aquatic Mammals",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Phổi dung tích lớn & Tim 4 ngăn",
        labelEn: "Lungs & 4-Chambered Heart",
        descVi:
          "Phổi có phế nang xếp nếp chịu xẹp khi lặn áp suất cao; tim 4 ngăn duy trì trao đổi chất mạnh.",
        descEn:
          "Collapsible reinforced lungs and high-capacity mammalian 4-chambered heart.",
        accent: "blue",
        hotspots: [
          {
            id: "mam_o1",
            x: 38,
            y: 48,
            labelVi: "Tim 4 ngăn hoàn chỉnh",
            labelEn: "Four-Chambered Heart",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Cor quadricameratum",
            descVi:
              "2 tâm nhĩ và 2 tâm thất tách biệt hoàn toàn; nhịp tim tự động hạ từ 60 xuống 4 nhịp/phút khi lặn sâu (*bradycardia*).",
            descEn:
              "Divided circulation with adaptive diving bradycardia dropping heart rate to 4 bpm.",
            medicalData: {
              weightEstimate: "~0.6% thể trọng",
              functionVi:
                "Điều tiết nhịp tim chậm thích nghi khi thiếu oxy sâu",
              functionEn:
                "Extreme diving bradycardia and peripheral vasoconstriction",
              medicalUseVi:
                "Nghiên cứu cơ chế bảo vệ cơ tim chống thiếu máu cục bộ (Ischemia protection)",
              medicalUseEn:
                "Myocardial ischemia protection and reperfusion injury models",
              source: "Mammalian Diving Physiology",
            },
          },
          {
            id: "mam_o2",
            x: 48,
            y: 44,
            labelVi: "Phổi đàn hồi chịu nén",
            labelEn: "Elastic Collapsible Lungs",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Pulmones elastici compressibiles",
            descVi:
              "Hấp thụ tới 90% oxy mỗi lần thở (con người chỉ 15%); phế nang có thể xẹp an toàn dưới 100 atm.",
            descEn:
              "Extracts 90% oxygen per breath; cartilaginous airways withstand crushing hydrostatic compression.",
            medicalData: {
              weightEstimate: "~3% thể trọng",
              functionVi:
                "Trao đổi khí siêu tốc và chịu xẹp phế nang không chấn thương",
              functionEn:
                "Rapid 90% tidal volume exchange and safe collapse under pressure",
              medicalUseVi:
                "Liệu pháp màng hoạt động bề mặt Surfactant điều trị suy hô hấp sơ sinh",
              medicalUseEn:
                "High-efficiency surfactant formulations for acute respiratory distress (ARDS)",
              source: "Comparative Pulmonology",
            },
          },
          {
            id: "mam_o3",
            x: 55,
            y: 52,
            labelVi: "Hệ cơ giàu Myoglobin",
            labelEn: "Myoglobin-Rich Muscle Mass",
            sys: "muscular",
            system: "muscular",
            latinName: "Massa muscularis myoglobinifera",
            descVi:
              "Lượng myoglobin dự trữ oxy trong cơ gấp 10 lần động vật trên cạn, cho phép nín thở hơn 90 phút.",
            descEn:
              "Extreme myoglobin concentration storing cellular oxygen for 90+ minute dives.",
            medicalData: {
              weightEstimate: "~45% tổng trọng lượng cơ thể",
              functionVi:
                "Kho chứa oxy tế bào khổng lồ duy trì hoạt động hiếu khí sâu",
              functionEn:
                "Stores up to 50% of total body oxygen in muscle tissue",
              medicalUseVi:
                "Vận chuyển oxy nhân tạo và dung dịch bảo quản nội tạng ghép",
              medicalUseEn:
                "Engineered high-density oxygen-carrying proteins for organ preservation",
              source: "Science: Molecular Basis of Diving Adaptations",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Khung xương có ngón tay",
        labelEn: "Homologous Limb Skeleton",
        descVi:
          "Vây ngực vẫn giữ đủ 5 ngón xương minh chứng cho nguồn gốc tổ tiên 4 chân trên cạn.",
        descEn:
          "Pectoral flippers retain 5 pentadactyl digits from terrestrial quadruped ancestors.",
        accent: "slate",
        hotspots: [
          {
            id: "mam_b1",
            x: 36,
            y: 64,
            labelVi: "Xương 5 ngón vây ngực",
            labelEn: "Pentadactyl Flippers",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Skeleton pentadactylum flipper",
            descVi:
              "Cấu trúc tương đồng xương bàn tay người (xương cánh tay, xương quay, xương trụ, 5 ngón).",
            descEn:
              "Homologous hand bones (humerus, radius, ulna, phalanges) adapted into hydrodynamic paddle.",
            medicalData: {
              weightEstimate: "~4% thể trọng",
              functionVi: "Điểm tựa chịu lực rẽ nước cho vây ngực",
              functionEn:
                "Structural framework for hydrodynamic lift and roll control",
              medicalUseVi:
                "Chân tay giả sinh học mô phỏng khớp phân bố tải trọng",
              medicalUseEn:
                "Load-distributing prosthetic limbs inspired by cetacean flippers",
              source: "Evolutionary Morphology of Marine Mammals",
            },
          },
          {
            id: "mam_b2",
            x: 58,
            y: 44,
            labelVi: "Cột sống uốn dọc",
            labelEn: "Flexible Spinal Column",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Columna vertebralis flexibilis",
            descVi:
              "Các đĩa đệm dày dặn cho phép cơ thể uốn cong theo mặt phẳng thẳng đứng nhịp nhàng.",
            descEn:
              "Robust intervertebral discs enabling powerful vertical wave oscillations.",
            medicalData: {
              weightEstimate: "~12% thể trọng",
              functionVi:
                "Tích trữ và giải phóng động năng cơ học trong chu kỳ bơi",
              functionEn:
                "Elastic energy storage and transmission during dorsoventral flexion",
              medicalUseVi:
                "Vật liệu đĩa đệm nhân tạo chống thoái hóa cột sống",
              medicalUseEn:
                "High-compliance artificial spinal discs for human orthopedic surgery",
              source: "Vertebral Mechanics in Cetaceans",
            },
          },
        ],
      },
    ],
  },

  marine_reptiles: {
    id: "marine_reptiles",
    nameVi: "Bò sát biển (Rùa biển & Đồi mồi)",
    nameEn: "Marine Reptiles (Cheloniidae)",
    taxaGroup: "Lớp Bò sát (Reptilia: Testudines)",
    coverageVi: "Rùa xanh, đồi mồi dứa, rùa da, vích Côn Đảo...",
    badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Mai sừng & Vảy phiến",
        labelEn: "Carapace & Scutes",
        descVi:
          "Mai giáp phẳng khí động học bao phủ bởi các phiến sừng keratin chống va đập và kẻ thù.",
        descEn:
          "Streamlined carapace covered in durable keratin scutes resisting apex predators.",
        accent: "cyan",
        hotspots: [
          {
            id: "rep_e1",
            x: 50,
            y: 35,
            labelVi: "Mai lưng thủy động học",
            labelEn: "Streamlined Carapace",
            sys: "skeletal",
            descVi:
              "Mai dẹp và nhẹ hơn nhiều so với rùa cạn, tối ưu lướt sóng biển.",
            descEn:
              "Hydrodynamically depressed shell adapted for open-ocean cruising.",
          },
          {
            id: "rep_e2",
            x: 26,
            y: 65,
            labelVi: "Chân chèo vỗ cánh",
            labelEn: "Flipper Forelimbs",
            sys: "muscular",
            descVi:
              "Chi trước kéo dài thành mái chèo khỏe khoắn vỗ như cánh chim trong nước.",
            descEn:
              "Elongated paddle limbs beating with synchronous wing-like underwater flight.",
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Tuyến bài tiết muối lệ",
        labelEn: "Salt Excretion Glands",
        descVi:
          "Tuyến lọc muối đặc biệt nằm sau hốc mắt đào thải lượng muối thừa khi uống nước biển.",
        descEn:
          "Post-orbital salt glands excreting brine twice as salty as ocean water.",
        accent: "amber",
        hotspots: [
          {
            id: "rep_s1",
            x: 20,
            y: 38,
            labelVi: "Tuyến muối lệ (Lachrymal Gland)",
            labelEn: "Crying Salt Gland",
            sys: "nervous",
            descVi:
              "Thải dung dịch muối đậm đặc ra mắt khiến rùa trông như đang khóc khi lên bãi đẻ.",
            descEn:
              "Eliminates concentrated brine through tear ducts, giving the illusion of crying on beaches.",
          },
          {
            id: "rep_s2",
            x: 18,
            y: 46,
            labelVi: "Mỏ sừng nhọn (Rhamphotheca)",
            labelEn: "Keratinous Beak",
            sys: "skeletal",
            descVi:
              "Mỏ cứng sắc như dao cạo bẻ gãy san hô, hải quỳ và vỏ cua ốc biển.",
            descEn:
              "Sharp beak adapted to shear sponges, crabs, jellyfish and coral fragments.",
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Phổi lớn & Tim 3 ngăn",
        labelEn: "Hyper-Lung & Septated Heart",
        descVi:
          "Phổi thể tích lớn trải dọc mặt dưới mai; nín thở lặn liên tục 4 - 7 giờ khi ngủ dưới đáy biển.",
        descEn:
          "High-volume dorsal lungs permitting 4 - 7 hour submerged breath-holding while resting.",
        accent: "blue",
        hotspots: [
          {
            id: "rep_o1",
            x: 42,
            y: 42,
            labelVi: "Phổi bọt biển gắn mai",
            labelEn: "Dorsal Spongy Lungs",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Pulmones spongiosi",
            descVi:
              "Gắn cố định vào mặt dưới mai; điều chỉnh luồng khí qua cơ ngực đặc thù.",
            descEn:
              "Anchored directly beneath carapace; breathing driven by specialized pectoral muscle pumping.",
            medicalData: {
              weightEstimate: "~2.5% thể trọng",
              functionVi: "Dung tích trao đổi khí oxy cao, co giãn khi lặn sâu",
              functionEn:
                "High-capacity gas exchange, resilient to pressure collapses",
              medicalUseVi:
                "Mô hình nghiên cứu bẫy nitơ và chống ngạt khí khi lặn dài hạn",
              medicalUseEn:
                "Prolonged apnea and nitrogen narcosis resilience research",
              source: "Chelonian Respiratory Biology",
            },
          },
          {
            id: "rep_o2",
            x: 34,
            y: 52,
            labelVi: "Tim 3 ngăn có vách hụt",
            labelEn: "Three-Chambered Heart",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Cor triloculare",
            descVi:
              "Vách ngăn tâm thất không hoàn toàn cho phép chuyển hướng máu bỏ qua phổi khi lặn sâu.",
            descEn:
              "Incomplete ventricular septum allowing cardiac right-to-left shunting during prolonged dives.",
            medicalData: {
              weightEstimate: "~0.4% thể trọng",
              functionVi:
                "Chuyển hướng shunt máu bảo toàn năng lượng khi ở đáy biển",
              functionEn:
                "Right-to-left cardiac shunting conserving metabolic oxygen",
              medicalUseVi:
                "Nghiên cứu huyết động học và dị tật vách ngăn tim bẩm sinh",
              medicalUseEn: "Cardiac hemodynamics and septal shunt models",
              source: "Comparative Cardiovascular Physiology",
            },
          },
          {
            id: "rep_o3",
            x: 55,
            y: 56,
            labelVi: "Dạ dày có gai sừng ngược",
            labelEn: "Esophageal Papillae",
            sys: "digestive",
            system: "digestive",
            latinName: "Papillae oesophageae",
            descVi:
              "Hàng trăm gai nhọn chỉ về phía sau giữ sứa trơn trượt không bị trào ngược khi ép nước ra ngoài.",
            descEn:
              "Hundreds of backward-pointing conical spikes trapping slippery jellyfish while purging seawater.",
            medicalData: {
              weightEstimate: "~1.2% thể trọng",
              functionVi:
                "Bắt giữ thức ăn nhầy trơn và tống khứ nước biển thừa",
              functionEn: "Retains slippery prey while purging excess seawater",
              medicalUseVi:
                "Nghiên cứu cơ chế chống trào ngược sinh học và mô phỏng van cơ học",
              medicalUseEn:
                "Biological anti-reflux mechanism and passive one-way valve engineering",
              source: "Marine Turtle Anatomy & Necropsy Guide",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Xương sườn dính liền mai",
        labelEn: "Fused Ribcage & Shell",
        descVi:
          "Xương sườn và đốt sống biến đổi hoàn toàn gắn liền vĩnh viễn tạo nên mai giáp.",
        descEn:
          "Vertebrae and ribcage structurally fused into solid bone plating carapace.",
        accent: "slate",
        hotspots: [
          {
            id: "rep_b1",
            x: 50,
            y: 38,
            labelVi: "Xương sườn dính mai",
            labelEn: "Fused Costal Bones",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Costae carapacis",
            descVi:
              "Khác với các loài khác, xương sườn rùa nằm bên ngoài đai vai và đai hông.",
            descEn:
              "Unique vertebrate architecture where shoulder girdle sits inside fused ribcage.",
            medicalData: {
              weightEstimate: "~28% - 35% tổng trọng lượng cơ thể",
              functionVi:
                "Áo giáp chịu lực va đập và bảo vệ tuyệt đối cơ quan nội tạng",
              functionEn:
                "Heavy-duty structural shell resisting crushing impact",
              medicalUseVi:
                "Vật liệu sinh học composite mô phỏng cấu trúc chống va chạm chịu áp",
              medicalUseEn:
                "Bio-inspired impact-resistant composite material studies",
              source: "Osteology of Marine Cheloniidae",
            },
          },
        ],
      },
    ],
  },

  cephalopods: {
    id: "cephalopods",
    nameVi: "Thân mềm chân đầu (Mực & Bạch tuộc)",
    nameEn: "Cephalopods (Octopus & Squid)",
    taxaGroup: "Ngành Thân mềm (Mollusca: Cephalopoda)",
    coverageVi: "Bạch tuộc đốm xanh, mực ống Biển Đông, mực nang khổng lồ...",
    badgeColor: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Tế bào sắc tố Chromatophore",
        labelEn: "Chromatophores & Skin",
        descVi:
          "Hàng triệu túi sắc tố co giãn biến đổi màu da và hoa văn ngụy trang trong 200 mili-giây.",
        descEn:
          "Millions of neuromuscular chromatophore sacs altering camouflage in 200 milliseconds.",
        accent: "cyan",
        hotspots: [
          {
            id: "cep_e1",
            x: 20,
            y: 50,
            labelVi: "Túi đổi màu tức thời",
            labelEn: "Chromatophore Cells",
            sys: "nervous",
            system: "nervous",
            latinName: "Chromatophori",
            descVi:
              "Mỗi tế bào nối trực tiếp với neuron thần kinh để mô phỏng chính xác san hô và cát biển.",
            descEn:
              "Direct neurological control reproducing surrounding coral textures and light patterns.",
            medicalData: {
              weightEstimate: "Biểu bì vi mô",
              functionVi:
                "Ngụy trang tức thì và truyền tín hiệu giao tiếp thị giác",
              functionEn:
                "Millisecond dynamic camouflage and visual communication",
              medicalUseVi:
                "Vật liệu tàng hình quang học mô phỏng sinh học (Adaptive Camouflage)",
              medicalUseEn:
                "Biomimetic adaptive camouflage and photonic skin displays",
              source: "Cephalopod Vision and Camouflage Compendium",
            },
          },
          {
            id: "cep_e2",
            x: 42,
            y: 62,
            labelVi: "Ống phễu phản lực (Siphon)",
            labelEn: "Hydraulic Siphon",
            sys: "muscular",
            system: "muscular",
            latinName: "Sipho muscularis",
            descVi:
              "Phun luồng nước áp lực cao giúp phóng giật lùi thoát hiểm thần tốc.",
            descEn:
              "Expels high-pressure water jets delivering explosive backward escape acceleration.",
            medicalData: {
              weightEstimate: "~3% khối lượng",
              functionVi:
                "Định hướng vector lực đẩy phản lực nước thủy động học",
              functionEn: "Hydrodynamic thrust vectoring for high-speed escape",
              medicalUseVi:
                "Mô phỏng động cơ đẩy phản lực mềm trong robot lặn không tiếng ồn",
              medicalUseEn:
                "Soft-robotics biomimetic silent waterjet propulsion",
              source: "Cephalopod Hydrodynamics",
            },
          },
          {
            id: "cep_e3",
            x: 15,
            y: 70,
            labelVi: "Tua cuốn giác hút",
            labelEn: "Suction-Cup Arms",
            sys: "muscular",
            system: "muscular",
            latinName: "Acetabula brachiorum",
            descVi:
              "Mỗi giác hút có thụ thể xúc giác và vị giác độc lập tự nếm thức ăn khi chạm vào.",
            descEn:
              "Each sucker features independent tactile and gustatory receptors tasting prey on contact.",
            medicalData: {
              weightEstimate: "~25% khối lượng thân",
              functionVi:
                "Cầm nắm đa hướng và phân tích hóa học môi trường đáy biển",
              functionEn:
                "Omni-directional adhesion and chemical receptor tasting",
              medicalUseVi:
                "Giác hút phẫu thuật vi phẫu mô mềm không làm rách mô người",
              medicalUseEn:
                "Atraumatic surgical suction grippers for delicate organ handling",
              source: "Neurobiology of Cephalopod Arms",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Mắt ống kính & Não phân tán",
        labelEn: "Lens Eye & Distributed Brain",
        descVi:
          "Não bộ phân tán với 60% neuron nằm trong 8 cánh tay; mắt hội tụ không có điểm mù.",
        descEn:
          "Decentralized nervous architecture with 60% neurons in tentacles; lens eye with zero blind spots.",
        accent: "amber",
        hotspots: [
          {
            id: "cep_s1",
            x: 26,
            y: 44,
            labelVi: "Mắt thấu kính hoàn hảo",
            labelEn: "High-Resolution Eye",
            sys: "nervous",
            system: "nervous",
            latinName: "Oculus lenticularis",
            descVi:
              "Tiến hóa hội tụ tương tự mắt người nhưng tế bào thụ cảm quay ra phía trước nên không có điểm mù.",
            descEn:
              "Convergent evolution with vertebrate eyes, but optic nerves emerge behind retina avoiding blind spot.",
            medicalData: {
              weightEstimate: "~1.5% thể trọng",
              functionVi:
                "Thị giác phân cực phát hiện con mồi trong suốt dưới nước",
              functionEn:
                "Polarized light sensitivity detecting transparent prey",
              medicalUseVi:
                "Cảm biến thị giác máy học và kính hiển vi phân cực y tế",
              medicalUseEn:
                "Polarization medical imaging and high-contrast optical sensors",
              source: "Journal of Marine Neuro-Ophthalmology",
            },
          },
          {
            id: "cep_s2",
            x: 24,
            y: 52,
            labelVi: "Não bộ hình vành khuyên",
            labelEn: "Circum-Esophageal Brain",
            sys: "nervous",
            system: "nervous",
            latinName: "Cerebrum circulare",
            descVi:
              "Não hình nhẫn bao quanh thực quản; nếu nuốt mồi quá lớn có thể chèn ép não.",
            descEn:
              "Doughnut-shaped brain encircling esophagus; food must be sheared finely before swallowing.",
            medicalData: {
              weightEstimate: "~500 triệu tế bào thần kinh",
              functionVi:
                "Điều phối học tập không gian, giải đố và trí nhớ dài hạn",
              functionEn:
                "Spatial memory coordination and decentralized tentacle autonomy",
              medicalUseVi:
                "Kiến trúc mạng thần kinh phân tán phi tập trung trong AI và Robot",
              medicalUseEn:
                "Decentralized neural architecture models for edge AI",
              source: "Octopus Cognition & Neuroscience",
            },
          },
        ],
      },
      {
        percent: 50,
        labelVi: "Cơ lớp áo & Vây bơi",
        labelEn: "Mantle Musculature",
        descVi:
          "Hệ cơ vân tròn và hướng tâm đan xen bóp xả thể tích khoang màng áo liên tục.",
        descEn:
          "Circular and radial muscle matrix contracting the mantle cavity for cyclic propulsion.",
        accent: "rose",
        hotspots: [
          {
            id: "cep_m1",
            x: 60,
            y: 48,
            labelVi: "Cơ khoang áo Mantle",
            labelEn: "Mantle Wall Muscle",
            sys: "muscular",
            system: "muscular",
            latinName: "Musculi pallii",
            descVi:
              "Vỏ cơ đàn hồi cao tích trữ năng lượng co bóp bơm tia nước áp suất lớn.",
            descEn:
              "High-elasticity muscle matrix building pressure for cyclic water expulsion.",
            medicalData: {
              weightEstimate: "~40% trọng lượng thân",
              functionVi: "Nén ép tuần hoàn và tạo lực phản lực bơi",
              functionEn:
                "Cyclic volume compression driving waterjet locomotion",
              medicalUseVi:
                "Vật liệu elastomeric nhân tạo có khả năng phục hồi cơ học",
              medicalUseEn: "Resilient elastomeric soft actuators",
              source: "Biomechanics of Molluscs",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "3 Quả tim & Túi mực",
        labelEn: "3 Hearts & Ink Sac",
        descVi:
          "1 tim chính bơm máu xanh gốc đồng (Hemocyanin) và 2 tim phụ ép máu qua mang; túi mực tự vệ.",
        descEn:
          "1 systemic heart, 2 branchial hearts pumping blue copper-based hemocyanin blood; defensive ink sac.",
        accent: "blue",
        hotspots: [
          {
            id: "cep_o1",
            x: 48,
            y: 46,
            labelVi: "Tim chính & 2 Tim mang",
            labelEn: "Three-Heart System",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Tria corda (systemicum et branchialia)",
            descVi:
              "2 tim mang phụ tăng áp lực máu qua mang trước khi tim chính bơm máu nuôi cơ thể.",
            descEn:
              "Dual branchial hearts pressurize deoxygenated blood through gills before systemic distribution.",
            medicalData: {
              weightEstimate: "~0.3% thể trọng",
              functionVi:
                "Duy trì áp lực máu ổn định đối với dịch máu hemocyanin có độ nhớt cao",
              functionEn:
                "Stabilizes arterial pressure for high-viscosity hemocyanin",
              medicalUseVi:
                "Huyết sắc tố Hemocyanin dùng trong dẫn thuốc điều trị ung thư bàng quang",
              medicalUseEn:
                "Hemocyanin carriers in immunotherapy and bladder cancer treatment",
              source: "Cephalopod Cardiovascular Physiology",
            },
          },
          {
            id: "cep_o2",
            x: 44,
            y: 54,
            labelVi: "Túi mực hắc tố (Ink Sac)",
            labelEn: "Melanin Ink Reservoir",
            sys: "digestive",
            system: "digestive",
            latinName: "Bursa atramenti",
            descVi:
              "Chứa sắc tố melanin và tyrosinase làm mù tạm thời khứu giác của cá săn mồi khi tháo chạy.",
            descEn:
              "Discharges dark melanin decoy cloud and tyrosinase enzyme paralyzing predator olfaction.",
            medicalData: {
              weightEstimate: "~1.5% thể trọng",
              functionVi: "Phun màn khói tự vệ và ức chế khứu giác kẻ săn mồi",
              functionEn:
                "Defensive smokescreen and chemical chemosensory blocker",
              medicalUseVi:
                "Chiết xuất mực chứa melanin kháng khuẩn và ức chế gốc tự do chống oxy hóa",
              medicalUseEn:
                "Melanin nanoparticles for free-radical scavenging and antimicrobial drugs",
              source: "Marine Bio-Products Journal",
            },
          },
          {
            id: "cep_o3",
            x: 20,
            y: 54,
            labelVi: "Mỏ vẹt kitin sắc bén",
            labelEn: "Chitinous Beak & Radula",
            sys: "digestive",
            system: "digestive",
            latinName: "Rostrum chitinaceum",
            descVi:
              "Mỏ giống mỏ vẹt cấu tạo từ protein và kitin cứng, tiết nọc độc melittin làm tê liệt con mồi.",
            descEn:
              "Razor-sharp beak delivering paralytic venom and breaking crustacean exoskeletons.",
            medicalData: {
              weightEstimate: "Khối sừng kitin cứng",
              functionVi:
                "Cắn vỡ lớp vỏ giáp xác và tiêm men tiêu hóa làm nhũn con mồi",
              functionEn:
                "Shears crustacean carapace and injects digestive proteases",
              medicalUseVi:
                "Vật liệu chuyển tiếp độ cứng gradient (từ mềm sang siêu cứng không có điểm gãy)",
              medicalUseEn:
                "Stiffness-gradient materials for dental implants and prosthetics",
              source: "Science: Mechanical Gradient of Cephalopod Beaks",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Không có xương (Thân mềm)",
        labelEn: "Hydrostatic Skeleton",
        descVi:
          "Cơ thể hoàn toàn mềm dẻo không xương, có thể lọt qua mọi kẽ đá nhỏ chỉ bằng kích thước con ngươi.",
        descEn:
          "100% bone-free hydrostatic muscle matrix squeezing through any crevice larger than its beak.",
        accent: "slate",
        hotspots: [
          {
            id: "cep_b1",
            x: 50,
            y: 50,
            labelVi: "Bộ nâng cơ thủy tĩnh",
            labelEn: "Muscular Hydrostat",
            sys: "muscular",
            system: "muscular",
            latinName: "Hydrostatum musculare",
            descVi:
              "Cơ bắp vừa là động cơ vừa là khung chống chịu nhờ áp suất thể dịch không thể nén.",
            descEn:
              "Pressurized fluid muscle bundles serving simultaneously as motor and skeletal framework.",
            medicalData: {
              weightEstimate: "Toàn bộ cấu trúc cơ thể",
              functionVi:
                "Chịu nén áp lực nước tầng biển sâu mà không sợ gãy xương",
              functionEn:
                "Infinite degrees of freedom with zero risk of skeletal fracture",
              medicalUseVi:
                "Mô hình chế tạo robot phẫu thuật mềm nội soi lách qua mạch máu",
              medicalUseEn:
                "Soft robotic endoscopic manipulators for minimally invasive surgery",
              source: "Bio-inspired Hydrostatic Mechanics",
            },
          },
        ],
      },
    ],
  },

  crustaceans: {
    id: "crustaceans",
    nameVi: "Giáp xác mười chân (Tôm & Cua)",
    nameEn: "Crustaceans (Decapoda)",
    taxaGroup: "Ngành Chân khớp (Arthropoda: Decapoda)",
    coverageVi: "Tôm hùm bông, cua hoàng đế, tôm tít, ghẹ xanh...",
    badgeColor: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Vỏ giáp kitin canxi hóa",
        labelEn: "Calcified Exoskeleton",
        descVi:
          "Bộ giáp ngoài kiên cố bằng kitin ngấm tinh thể canxi cacbonat bảo vệ toàn thân.",
        descEn:
          "Rigid armor carapace reinforced with calcium carbonate crystals.",
        accent: "cyan",
        hotspots: [
          {
            id: "cru_e1",
            x: 18,
            y: 35,
            labelVi: "Đôi càng kẹp nghiền mồi",
            labelEn: "Chelipeds (Claws)",
            sys: "muscular",
            system: "muscular",
            latinName: "Chelae anteriores",
            descVi:
              "Càng to tạo lực bẻ vỏ sò ốc; càng nhỏ cắt xé thịt con mồi linh hoạt.",
            descEn:
              "Crushing and cutting claws generating immense mechanical fracture pressure.",
            medicalData: {
              weightEstimate: "~20% thể trọng",
              functionVi: "Tạo áp lực kẹp gãy vỏ sò ốc cứng",
              functionEn: "Crushing and shearing mechanical gripping",
              medicalUseVi:
                "Vật liệu sinh học Chitosan chiết xuất từ vỏ giáp dùng làm chỉ phẫu thuật tự tiêu",
              medicalUseEn:
                "Medical grade Chitosan for dissolvable surgical sutures and wound dressings",
              source: "Crustacean Biomechanics & Chitin Tech",
            },
          },
          {
            id: "cru_e2",
            x: 45,
            y: 40,
            labelVi: "Giáp đầu ngực (Carapace)",
            labelEn: "Cephalothorax Shell",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Carapax cephalothoracis",
            descVi:
              "Tấm khiên xương liền khối che phủ toàn bộ tim, mang và dạ dày.",
            descEn:
              "Fused dorsal shield protecting cardiac, digestive and branchial chambers.",
            medicalData: {
              weightEstimate: "~15% trọng lượng",
              functionVi: "Lá chắn chịu lực và khoang giữ ẩm cho mang",
              functionEn:
                "Protective shell maintaining moisture in gill chambers",
              medicalUseVi:
                "Cấu trúc vi xếp lớp chống nứt gãy ứng dụng trong áo giáp chống đạn",
              medicalUseEn:
                "Bouligand micro-architecture in impact-tolerant armor",
              source: "Materials Science in Arthropods",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Mắt kép & Râu xúc giác",
        labelEn: "Compound Eyes & Antennae",
        descVi:
          "Mắt kép gồm hàng ngàn tế bào ommatidia quan sát 360 độ và cặp râu cảm thụ hóa học.",
        descEn:
          "Thousands of ommatidia providing 360-degree vision and sensitive chemoreceptive antennae.",
        accent: "amber",
        hotspots: [
          {
            id: "cru_s1",
            x: 22,
            y: 30,
            labelVi: "Mắt kép cuống động",
            labelEn: "Stalked Compound Eyes",
            sys: "nervous",
            system: "nervous",
            latinName: "Oculi compositi",
            descVi:
              "Nằm trên hai cuống cử động độc lập, nhận biết chuyển động nhạy bén trong nước mờ đục.",
            descEn:
              "Movable stalks detecting fast micro-movements even in turbid reef waters.",
            medicalData: {
              weightEstimate: "~0.5% thể trọng",
              functionVi: "Thị giác quang học phản xạ cực nhanh",
              functionEn:
                "Wide-field movement tracking under low-light conditions",
              medicalUseVi:
                "Mô phỏng ống kính quang học góc cực rộng cho nội soi y tế",
              medicalUseEn:
                "Wide-field artificial ommatidia for endoscopic cameras",
              source: "Visual Systems in Crustacea",
            },
          },
          {
            id: "cru_s2",
            x: 12,
            y: 22,
            labelVi: "Râu khứu giác & xúc giác",
            labelEn: "Antennae & Antennules",
            sys: "nervous",
            system: "nervous",
            latinName: "Antennae sensoriales",
            descVi:
              "Chứa các thụ thể thẩm thấu hóa học nếm vị con mồi trôi dạt theo dòng nước biển từ xa.",
            descEn:
              "Chemosensory hairs sampling dissolved metabolites in moving ocean currents.",
            medicalData: {
              weightEstimate: "Sợi cảm biến vi mô",
              functionVi: "Định vị mùi vị con mồi và nhận diện kẻ săn mồi",
              functionEn: "Pheromone and chemical gradient localization",
              medicalUseVi:
                "Cảm biến sinh học điện tử (Bio-electronic nose) tầm soát độc chất",
              medicalUseEn:
                "Bio-electronic chemical sensor arrays for toxin monitoring",
              source: "Chemoreception in Marine Decapods",
            },
          },
        ],
      },
      {
        percent: 50,
        labelVi: "Cơ bụng Pleon bơi lùi",
        labelEn: "Abdominal Flexor Muscles",
        descVi:
          "Khối cơ bụng dày đặc giúp tôm uốn cong đuôi búng giật lùi với gia tốc cực lớn.",
        descEn:
          "Massive fast-twitch abdominal flexor muscles driving explosive tail-flip escape.",
        accent: "rose",
        hotspots: [
          {
            id: "cru_m1",
            x: 68,
            y: 55,
            labelVi: "Cơ uốn đuôi búng lùi",
            labelEn: "Tail-Flip Abdominal Muscle",
            sys: "muscular",
            system: "muscular",
            latinName: "Musculus flexor abdominis",
            descVi:
              "Sợi cơ co giật nhanh phát huy 100% công suất tức thì để tháo chạy khi gặp nguy hiểm.",
            descEn:
              "Fast-glycolytic muscle bundle powering tail-flip escape locomotion.",
            medicalData: {
              weightEstimate: "~35% khối lượng cơ thể",
              functionVi: "Tạo lực đẩy búng lùi thoát hiểm siêu tốc",
              functionEn: "Generates explosive backwards thrust",
              medicalUseVi:
                "Nghiên cứu cơ chế chuyển hóa năng lượng ATP yếm khí trong cơ vân",
              medicalUseEn:
                "Anaerobic energy flux and muscle twitch kinetic models",
              source: "Muscle Biology of Decapod Crustaceans",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Mang ngực & Dạ dày nghiền",
        labelEn: "Branchial Gills & Gastric Mill",
        descVi:
          "Dạ dày có các răng cưa kitin tự nghiền thức ăn bên trong cơ thể.",
        descEn:
          "Gastric mill with internal chitinous teeth grinding food inside stomach.",
        accent: "blue",
        hotspots: [
          {
            id: "cru_o1",
            x: 40,
            y: 45,
            labelVi: "Dạ dày nghiền (Gastric Mill)",
            labelEn: "Internal Gastric Mill",
            sys: "digestive",
            system: "digestive",
            latinName: "Mola gastrica",
            descVi:
              "Có 3 răng kitin cứng chắc cọ xát vào nhau để nghiền nát thức ăn trước khi vào ruột.",
            descEn:
              "Three chitinous calcified teeth mechanically grinding prey within cardiac stomach.",
            medicalData: {
              weightEstimate: "~1.8% thể trọng",
              functionVi: "Xay nhuyễn cơ học mảnh xương và vỏ sò ốc cứng",
              functionEn: "Internal mechanical breakdown of hard shelled food",
              medicalUseVi:
                "Mô phỏng máy nghiền siêu âm kích thước vi mô trong điều chế dược phẩm",
              medicalUseEn:
                "Micro-milling biomimetics for pharmaceutical pellet pulverization",
              source: "Gastric Mill Morphology",
            },
          },
          {
            id: "cru_o2",
            x: 46,
            y: 55,
            labelVi: "Mang lông tơ dưới giáp",
            labelEn: "Feathered Thoracic Gills",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Branchiae phyllobranchiatae",
            descVi:
              "Nằm trong buồng mang kín hai bên sườn, quạt nước liên tục nhờ vảy chân miệng.",
            descEn:
              "Enclosed gills ventilated by scaphognathite bailer plates pumping water across filaments.",
            medicalData: {
              weightEstimate: "~1.2% thể trọng",
              functionVi: "Hô hấp trao đổi khí và điều hòa thẩm thấu muối ion",
              functionEn: "Gas exchange and active ion osmoregulation",
              medicalUseVi:
                "Màng lọc thẩm thấu ngược mô phỏng sinh học lọc muối nước biển",
              medicalUseEn: "Biomimetic low-energy desalination membranes",
              source: "Gill Osmoregulation in Marine Fauna",
            },
          },
          {
            id: "cru_o3",
            x: 50,
            y: 38,
            labelVi: "Tim lưng một ngăn",
            labelEn: "Dorsal Single-Chamber Heart",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Cor dorsale",
            descVi:
              "Hệ tuần hoàn hở; tim hút máu qua lỗ tim (ostia) rồi bơm vào khoang dịch cơ thể.",
            descEn:
              "Open circulatory heart suspended in pericardium pumping hemolymph through open hemocoel.",
            medicalData: {
              weightEstimate: "~0.1% thể trọng",
              functionVi:
                "Bơm dòng dịch thể máu hemolymph nuôi dưỡng khoang cơ thể",
              functionEn: "Pumps hemolymph into open sinuses",
              medicalUseVi:
                "Nghiên cứu áp suất dịch hở và chất đông máu LAL (Limulus Amebocyte Lysate) thử độc tố vi khuẩn",
              medicalUseEn:
                "Endotoxin testing bioassays derived from arthropod hemolymph",
              source: "Open Circulatory Mechanics",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Khung nội xương kitin ngấm canxi",
        labelEn: "Endophragmal Skeleton",
        descVi:
          "Các mấu lồi bên trong vỏ giáp tạo thành khung giá đỡ cho các khối cơ vận động khớp.",
        descEn: "Internal skeletal apodemes anchoring walking leg muscles.",
        accent: "slate",
        hotspots: [
          {
            id: "cru_b1",
            x: 48,
            y: 48,
            labelVi: "Khung gân xương ngực",
            labelEn: "Endophragmal Apodemes",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Skeleton endophragmale",
            descVi:
              "Trục khung liên kết giữa các chân ngực và khoang giáp bảo vệ tủy thần kinh bụng.",
            descEn:
              "Internal skeletal bridges anchoring limb musculature and protecting ventral nerve cord.",
            medicalData: {
              weightEstimate: "~8% trọng lượng",
              functionVi:
                "Điểm tựa chịu ứng suất cơ học cao cho các khớp chân di chuyển",
              functionEn:
                "Load-bearing anchoring matrix for locomotory appendages",
              medicalUseVi:
                "Khung in 3D sinh học mô phỏng độ cứng cấu trúc mạng rỗng",
              medicalUseEn:
                "Bio-inspired porous lightweight structural scaffolding",
              source: "Comparative Arthropod Anatomy",
            },
          },
        ],
      },
    ],
  },

  cnidarians: {
    id: "cnidarians",
    nameVi: "Thích ty bào (San hô & Sứa)",
    nameEn: "Cnidarians (Corals & Jellyfish)",
    taxaGroup: "Ngành Thích ty bào (Cnidaria)",
    coverageVi: "San hô sừng hươu, sứa lửa, hải quỳ cộng sinh cá hề...",
    badgeColor: "text-purple-300 bg-purple-500/10 border-purple-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Tế bào gai thích ty (Nematocyst)",
        labelEn: "Stinging Nematocysts",
        descVi:
          "Hàng triệu tế bào gai chứa mũi lao vi mô bắn chất độc làm tê liệt con mồi.",
        descEn:
          "Microscopic pressurized harpoon capsules discharging neurotoxins upon contact.",
        accent: "cyan",
        hotspots: [
          {
            id: "cni_e1",
            x: 30,
            y: 65,
            labelVi: "Tua gai bắt mồi",
            labelEn: "Stinging Tentacles",
            sys: "muscular",
            system: "muscular",
            latinName: "Tentacula cnidariana",
            descVi:
              "Tua cuốn bắn thích ty với gia tốc cực đại 5,000,000 g xuyên thủng giáp con mồi.",
            descEn:
              "Tentacles firing nematocyst harpoons with 5,000,000 g acceleration into prey.",
            medicalData: {
              weightEstimate: "Mật độ hàng triệu tế bào gai/cm²",
              functionVi: "Bắt mồi thụ động và tự vệ chống kẻ thù",
              functionEn:
                "Prey capture and predator defense via micro-harpoons",
              medicalUseVi:
                "Hệ thống vi kim tiêm thuốc không đau xuyên qua da người (Painless microneedles)",
              medicalUseEn:
                "Painless microneedle drug delivery arrays inspired by nematocyst discharge",
              source: "Cnidocyte Biophysics & Medicine",
            },
          },
          {
            id: "cni_e2",
            x: 50,
            y: 40,
            labelVi: "Khoang vị trung tâm",
            labelEn: "Gastrovascular Cavity",
            sys: "digestive",
            system: "digestive",
            latinName: "Coelenteron",
            descVi:
              "Khoang tiêu hóa kiêm tuần hoàn độc nhất; thức ăn vào và cặn bã thải ra cùng một lỗ miệng.",
            descEn:
              "Single central cavity performing both digestion and circulatory distribution.",
            medicalData: {
              weightEstimate: "~60% thể tích thân",
              functionVi: "Tiêu hóa nội bào và phân phối dưỡng chất toàn thân",
              functionEn:
                "Internal digestion and nutrient transport without blood vessels",
              medicalUseVi:
                "Mô hình tế bào gốc tái sinh toàn phần mô cơ thể (Total Body Regeneration)",
              medicalUseEn:
                "Whole-body stem cell regeneracy models in regenerative medicine",
              source: "Cellular Biology of Cnidaria",
            },
          },
          {
            id: "cni_e3",
            x: 45,
            y: 50,
            labelVi: "Tảo cộng sinh Zooxanthellae",
            labelEn: "Endosymbiotic Algae",
            sys: "digestive",
            system: "digestive",
            latinName: "Zooxanthellae symbiotica",
            descVi:
              "Ở san hô, tảo quang hợp cung cấp 90% nhu cầu năng lượng và kiến tạo rạn vôi Biển Đông.",
            descEn:
              "Photosynthetic algae providing up to 90% coral energy and precipitating CaCO3 reef rock.",
            medicalData: {
              weightEstimate: "~15% khối lượng mô sống",
              functionVi:
                "Quang hợp chuyển đổi ánh sáng mặt trời thành đường và axit amin",
              functionEn:
                "Photosynthetic organic carbon delivery to coral host",
              medicalUseVi:
                "Hợp chất Mycosporine-like amino acids (MAA) làm kem chống nắng sinh học an toàn",
              medicalUseEn:
                "Natural UV-absorbing compounds for coral-safe pharmaceuticals",
              source: "Marine Coral Reef Ecology",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Mạng lưới thần kinh & Cảm quan Rhopalia",
        labelEn: "Nerve Net & Rhopalia",
        descVi:
          "Hệ thần kinh dạng mạng lưới tỏa khắp cơ thể; các cơ quan cảm ứng thăng bằng và thụ cảm ánh sáng.",
        descEn:
          "Diffuse neural net with marginal rhopalia sensing light and gravity orientation.",
        accent: "amber",
        hotspots: [
          {
            id: "cni_s1",
            x: 65,
            y: 45,
            labelVi: "Cảm quan thăng bằng (Rhopalia)",
            labelEn: "Marginal Rhopalia & Statocysts",
            sys: "nervous",
            system: "nervous",
            latinName: "Rhopalia sensoria",
            descVi:
              "Chứa các viên đá sỏi vôi thạch (statolith) cảm nhận phương hướng trọng lực và mảng mắt cảm quang.",
            descEn:
              "Statocyst gravity sensors and simple photoreceptors guiding swimming orientation.",
            medicalData: {
              weightEstimate: "Cụm vi giác quan vành chuông",
              functionVi:
                "Cân bằng trọng lực và định hướng bơi theo chu kỳ ánh sáng",
              functionEn:
                "Gravitational equilibrium and phototactic navigation",
              medicalUseVi:
                "Cảm biến gia tốc vi cơ điện tử MEMS định vị không gian 3 chiều",
              medicalUseEn:
                "Bio-inspired MEMS accelerometers and equilibrium gyro sensors",
              source: "Neurosensory Mechanisms in Jellyfish",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Túi tiêu hóa & Ống xuyên tâm",
        labelEn: "Radial Canals & Gastric Pouches",
        descVi:
          "Mạng lưới các ống dẫn phân nhánh đưa enzyme tiêu hóa và hấp thụ dưỡng chất đến từng tế bào.",
        descEn:
          "Branching radial canal network circulating digestive enzymes to marginal tissues.",
        accent: "blue",
        hotspots: [
          {
            id: "cni_o1",
            x: 50,
            y: 35,
            labelVi: "Hệ thống ống phóng xạ (Radial Canals)",
            labelEn: "Radial Canal Circulatory System",
            sys: "circulatory",
            system: "circulatory",
            latinName: "Canales radiales",
            descVi:
              "Các kênh phân nhánh dẫn thể dịch giàu oxy và dưỡng chất từ khoang vị ra vành ngoài cơ thể.",
            descEn:
              "Fluid channels pumping nutrient-rich fluid from central coelenteron outward.",
            medicalData: {
              weightEstimate: "Mạng vi kênh thể dịch",
              functionVi:
                "Tuần hoàn thể dịch thay thế tim mạch ở động vật nguyên thủy",
              functionEn:
                "Primitive circulatory distribution via fluid pulsation",
              medicalUseVi:
                "Kênh dẫn vi lưu chất sinh học (Microfluidics) xét nghiệm phân tích máu",
              medicalUseEn:
                "Microfluidic chip designs inspired by cnidarian vascular channels",
              source: "Fluid Dynamics in Primitive Metazoa",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Khung vôi canxi / Thủy tĩnh Mesoglea",
        labelEn: "Corallite Skeleton / Mesoglea Matrix",
        descVi:
          "Bộ xương đá vôi canxi cacbonat (ở san hô) hoặc lớp đệm gelatin Mesoglea áp suất cao (ở sứa).",
        descEn:
          "Rigid aragonite calcium carbonate corallite skeleton or dense gelatinous mesoglea.",
        accent: "slate",
        hotspots: [
          {
            id: "cni_b1",
            x: 50,
            y: 55,
            labelVi: "Bộ khung đá vôi Aragonite",
            labelEn: "Aragonite Corallite Matrix",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Corallitum calcareum",
            descVi:
              "Được các polyp tiết ra liên tục qua hàng ngàn năm, tạo nên rạn san hô bảo vệ bờ cõi Biển Đông.",
            descEn:
              "Extracellular calcium carbonate matrix building colossal biogenic reef barriers.",
            medicalData: {
              weightEstimate: ">90% khối lượng rạn san hô",
              functionVi:
                "Khung chịu lực bão biển và nơi cư trú của 25% sinh vật đại dương",
              functionEn:
                "Storm breakwater and foundation habitat for marine biodiversity",
              medicalUseVi:
                "Khung ghép xương sinh học (Coral bone grafts) tương thích sinh học cao với xương người",
              medicalUseEn:
                "Biocompatible coral grafts for human orthopedic and cranial bone repair",
              source: "Biomaterials: Natural Coral in Bone Regeneration",
            },
          },
        ],
      },
    ],
  },

  echinoderms: {
    id: "echinoderms",
    nameVi: "Động vật da gai (Sao biển & Cầu gai)",
    nameEn: "Echinoderms (Echinodermata)",
    taxaGroup: "Ngành Da gai (Echinodermata)",
    coverageVi: "Sao biển gai, cầu gai nhím biển, hải sâm cát...",
    badgeColor: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30",
    layers: [
      {
        percent: 100,
        labelVi: "Hệ thống chân ống thủy lực",
        labelEn: "Water Vascular System",
        descVi:
          "Mạng lưới ống dẫn nước biển thủy lực điều khiển hàng ngàn chân ống tí hon di chuyển và bám đá.",
        descEn:
          "Hydraulic vascular canal network operating thousands of suction tube-feet.",
        accent: "cyan",
        hotspots: [
          {
            id: "ech_e1",
            x: 50,
            y: 50,
            labelVi: "Tấm rây lọc nước (Madreporite)",
            labelEn: "Sieve Madreporite",
            sys: "respiratory",
            system: "respiratory",
            latinName: "Madreporitum",
            descVi:
              "Tấm xốp canxi lọc nước biển đưa vào hệ thống ống thủy lực.",
            descEn:
              "Perforated plate taking in and filtering seawater to pressurize hydraulic vascular system.",
            medicalData: {
              weightEstimate: "Đĩa xốp canxi trung tâm",
              functionVi: "Áp suất đầu vào và lọc cặn cho hệ mạch nước",
              functionEn:
                "Hydraulic intake filter maintaining internal vascular pressure",
              medicalUseVi:
                "Màng lọc xốp vi mô không bị bám bẩn (Anti-biofouling porous filters)",
              medicalUseEn: "Anti-biofouling microporous filtration technology",
              source: "Echinoderm Physiology",
            },
          },
          {
            id: "ech_e2",
            x: 35,
            y: 65,
            labelVi: "Chân ống giác hút",
            labelEn: "Hydraulic Tube Feet",
            sys: "muscular",
            system: "muscular",
            latinName: "Podia ambulacralia",
            descVi:
              "Bơm nén nước phồng xẹp giúp cạy mở vỏ sò ốc và bò trên mặt đá gồ ghề.",
            descEn:
              "Hydraulic ampullae expanding and retracting to exert immense sustained prying force.",
            medicalData: {
              weightEstimate: "~10% trọng lượng",
              functionVi:
                "Di chuyển thủy lực và bám dính dưới sóng vỗ cực mạnh",
              functionEn:
                "Hydraulic locomotion and high-shear adhesion under wave action",
              medicalUseVi:
                "Keo dính y tế sinh học hoạt động hiệu quả trong môi trường nước và dịch cơ thể",
              medicalUseEn:
                "Wet-setting bio-adhesives for internal surgical tissue repair",
              source: "Nature: Underwater Bio-adhesion in Echinoderms",
            },
          },
          {
            id: "ech_e3",
            x: 50,
            y: 45,
            labelVi: "Dạ dày lộn ra ngoài",
            labelEn: "Eversible Cardiac Stomach",
            sys: "digestive",
            system: "digestive",
            latinName: "Ventriculus eversibilis",
            descVi:
              "Có thể lộn dạ dày ra ngoài cơ thể để tiêu hóa trực tiếp mô san hô hoặc thịt ốc từ bên ngoài.",
            descEn:
              "Everts stomach outside mouth to digest coral polyps and clam tissue externally.",
            medicalData: {
              weightEstimate: "~4% thể trọng",
              functionVi: "Tiêu hóa ngoại bào bề mặt con mồi",
              functionEn: "External chemical digestion of prey tissues",
              medicalUseVi:
                "Enzyme phân giải mô hoại tử dùng trong băng gạc trị vết thương bỏng sâu",
              medicalUseEn:
                "Debriding enzymes for wound healing and necrotizing tissue clearance",
              source: "Echinoderm Digestive Enzymes",
            },
          },
        ],
      },
      {
        percent: 75,
        labelVi: "Vòng thần kinh trung ương & Điểm mắt",
        labelEn: "Nerve Ring & Radial Nerves",
        descVi:
          "Vòng thần kinh bao quanh miệng phân thành 5 dây thần kinh phóng xạ chạy dọc 5 cánh.",
        descEn:
          "Circumoral nerve ring branching into five radial nerves with terminal optic ocelli.",
        accent: "amber",
        hotspots: [
          {
            id: "ech_s1",
            x: 18,
            y: 50,
            labelVi: "Điểm mắt đầu cánh",
            labelEn: "Terminal Optical Ocellus",
            sys: "nervous",
            system: "nervous",
            latinName: "Ocellus terminalis",
            descVi:
              "Cụm tế bào sắc tố đỏ ở chóp mỗi cánh tay phát hiện ánh sáng và bóng kẻ săn mồi lướt qua.",
            descEn:
              "Cluster of pigment-cup photoreceptors sensing shadows of oncoming predators.",
            medicalData: {
              weightEstimate: "Cụm vi tế bào quang học",
              functionVi:
                "Thị giác định hướng quang kỳ và tìm nơi ẩn náu trong rạn đá",
              functionEn:
                "Phototactic orientation and finding rock reef shelter",
              medicalUseVi: "Cảm biến quang học siêu nhỏ phân tán",
              medicalUseEn:
                "Distributed miniature optical sensors for ambient navigation",
              source: "Sensory Biology of Sea Stars",
            },
          },
        ],
      },
      {
        percent: 50,
        labelVi: "Cơ co bóp bóng thủy lực",
        labelEn: "Hydraulic Ampullae Musculature",
        descVi:
          "Hàng trăm túi bóng ampullae có màng cơ tròn co bóp nén thể tích nước vào chân ống.",
        descEn: "Ampullary muscle domes pumping hydraulic fluid into podia.",
        accent: "rose",
        hotspots: [
          {
            id: "ech_m1",
            x: 42,
            y: 60,
            labelVi: "Bóng cơ thủy lực (Ampullae)",
            labelEn: "Hydraulic Ampullae Domes",
            sys: "muscular",
            system: "muscular",
            latinName: "Ampullae ambulacrales",
            descVi:
              "Các túi bóng thủy lực co bóp tạo áp suất thủy tĩnh đẩy chân ống vươn dài bám đá.",
            descEn:
              "Muscular fluid reservoirs building hydraulic pressure to extend podia.",
            medicalData: {
              weightEstimate: "~6% khối lượng",
              functionVi: "Điều tiết áp suất thủy lực nội tại linh hoạt",
              functionEn: "Precision hydraulic pressure regulation",
              medicalUseVi:
                "Hệ thống bơm thủy lực vi cơ học (Micro-hydraulic pumps) trong robot mềm",
              medicalUseEn:
                "Soft robotic micro-hydraulic drives and artificial muscles",
              source: "Biomechanics of Echinoderm Locomotion",
            },
          },
        ],
      },
      {
        percent: 25,
        labelVi: "Túi tiêu hóa Pyloric caeca & Ruột",
        labelEn: "Pyloric Caeca & Digestion",
        descVi:
          "Mỗi cánh tay chứa 2 nhánh túi tiêu hóa lớn tiết dịch phân giải chất béo và dự trữ năng lượng.",
        descEn:
          "Pair of branched digestive caeca in each arm producing enzymes and storing glycogen.",
        accent: "blue",
        hotspots: [
          {
            id: "ech_o1",
            x: 62,
            y: 35,
            labelVi: "Nhánh tiêu hóa cánh tay",
            labelEn: "Pyloric Caeca in Arms",
            sys: "digestive",
            system: "digestive",
            latinName: "Caeca pylorica",
            descVi:
              "Tuyến enzyme tiêu hóa và dự trữ glycogen nuôi cơ thể trong thời gian đói ăn dài hạn.",
            descEn:
              "Digestive enzyme factory and energy storage reservoir extending into each ray.",
            medicalData: {
              weightEstimate: "~18% thể trọng",
              functionVi: "Chế tiết enzyme phân hủy protein và dự trữ mỡ",
              functionEn:
                "Proteolytic enzyme secretion and lipid reserve accumulation",
              medicalUseVi:
                "Nghiên cứu hoạt tính sinh học của saponin biển chống viêm và ức chế khối u",
              medicalUseEn:
                "Marine asterosaponins with anti-inflammatory and cytotoxic bioactivity",
              source: "Journal of Natural Products in Marine Science",
            },
          },
        ],
      },
      {
        percent: 0,
        labelVi: "Khung gai đá vôi Stereom",
        labelEn: "Endoskeletal Stereom Plates",
        descVi:
          "Bộ khung trong gồm hàng ngàn phiến canxit xốp rỗng kết nối bằng mô liên kết biến đổi độ cứng (MCT).",
        descEn:
          "Thousands of calcitic porous stereom plates bound by mutable collagenous tissue (MCT).",
        accent: "slate",
        hotspots: [
          {
            id: "ech_b1",
            x: 50,
            y: 50,
            labelVi: "Mạng tinh thể Stereom & Gai canxit",
            labelEn: "Stereom Endoskeleton & Spines",
            sys: "skeletal",
            system: "skeletal",
            latinName: "Ossicula stereomatis",
            descVi:
              "Cấu trúc tinh thể canxit xốp siêu nhẹ nhưng chịu lực bẻ gãy cực lớn; mô collagen có thể hóa cứng trong vài giây.",
            descEn:
              "Micro-porous single-crystal calcite architecture with mutable collagen hardening on demand.",
            medicalData: {
              weightEstimate: "~45% tổng khối lượng",
              functionVi:
                "Chuyển đổi trạng thái từ mềm dẻo sang cứng như đá để chống cạy mở",
              functionEn:
                "Mutable collagen switching instantaneously between flexible and rigid states",
              medicalUseVi:
                "Vật liệu polymer biến đổi cơ tính ứng dụng trong cố định chấn thương chỉnh hình",
              medicalUseEn:
                "Smart materials with switchable mechanical stiffness for orthopedic stabilization",
              source: "Acta Biomaterialia: Mutable Collagenous Tissues",
            },
          },
        ],
      },
    ],
  },
};

/**
 * Resolve any species to its corresponding Master Archetype
 * and generate dynamic adaptive anatomy layers.
 */
export function resolveSpeciesAnatomy(species) {
  if (!species) return null;

  // 1. Identify taxonomic group from species attributes
  const combinedText = `
    ${species.nameVi || ""} 
    ${species.nameEn || ""} 
    ${species.commonName || ""} 
    ${species.sciName || species.scientificName || ""} 
    ${species.genus || ""}
    ${species.species || ""}
    ${species.family || ""} 
    ${species.order || ""} 
    ${species.class || species.taxonomyClass || species.taxonomicClass || ""} 
    ${species.phylum || ""} 
    ${species.group || species.speciesGroup || ""} 
    ${species.category || ""}
    ${species.taxonomyClass || ""}
    ${species.taxonomicClass || ""}
  `.toLowerCase();

  let targetKey = "osteichthyes"; // Default to Bony Fish (covers 90% of fish species)

  if (
    combinedText.includes("cá mập") ||
    combinedText.includes("cá đuối") ||
    combinedText.includes("cá nhám") ||
    combinedText.includes("shark") ||
    combinedText.includes("ray") ||
    combinedText.includes("chondrichthyes") ||
    combinedText.includes("elasmobranch") ||
    combinedText.includes("rhincodon")
  ) {
    targetKey = "chondrichthyes";
  } else if (
    combinedText.includes("rùa") ||
    combinedText.includes("vích") ||
    combinedText.includes("đồi mồi") ||
    combinedText.includes("turtle") ||
    combinedText.includes("reptil") ||
    combinedText.includes("cheloni") ||
    combinedText.includes("rắn biển") ||
    combinedText.includes("testudines")
  ) {
    targetKey = "marine_reptiles";
  } else if (
    combinedText.includes("cá voi") ||
    combinedText.includes("cá heo") ||
    combinedText.includes("bò biển") ||
    combinedText.includes("dugong") ||
    combinedText.includes("whale") ||
    combinedText.includes("dolphin") ||
    combinedText.includes("mammal") ||
    combinedText.includes("cetacea") ||
    combinedText.includes("sirenia") ||
    combinedText.includes("dugongidae") ||
    combinedText.includes("trichechidae") ||
    combinedText.includes("odontoceti") ||
    combinedText.includes("mysticeti") ||
    combinedText.includes("pinniped") ||
    combinedText.includes("hải cẩu") ||
    combinedText.includes("sư tử biển")
  ) {
    targetKey = "marine_mammals";
  } else if (
    combinedText.includes("bạch tuộc") ||
    combinedText.includes("mực") ||
    combinedText.includes("octopus") ||
    combinedText.includes("squid") ||
    combinedText.includes("cuttlefish") ||
    combinedText.includes("cephalopod") ||
    combinedText.includes("mollus")
  ) {
    targetKey = "cephalopods";
  } else if (
    combinedText.includes("tôm") ||
    combinedText.includes("cua") ||
    combinedText.includes("ghẹ") ||
    combinedText.includes("lobster") ||
    combinedText.includes("crab") ||
    combinedText.includes("shrimp") ||
    combinedText.includes("crustacean") ||
    combinedText.includes("decapod")
  ) {
    targetKey = "crustaceans";
  } else if (
    combinedText.includes("san hô") ||
    combinedText.includes("sứa") ||
    combinedText.includes("hải quỳ") ||
    combinedText.includes("coral") ||
    combinedText.includes("jellyfish") ||
    combinedText.includes("anemone") ||
    combinedText.includes("cnidaria")
  ) {
    targetKey = "cnidarians";
  } else if (
    combinedText.includes("sao biển") ||
    combinedText.includes("cầu gai") ||
    combinedText.includes("nhím biển") ||
    combinedText.includes("hải sâm") ||
    combinedText.includes("starfish") ||
    combinedText.includes("urchin") ||
    combinedText.includes("sea cucumber") ||
    combinedText.includes("echinoderm")
  ) {
    targetKey = "echinoderms";
  }

  const archetype = MASTER_ARCHETYPES[targetKey];

  // 3. Clone and adapt archetype dynamically for this specific species
  const speciesName = species.nameVi || species.commonName || "Sinh vật biển";
  const depthText = species.depth || "";
  const isDeepSea =
    depthText.toLowerCase().includes("1000") ||
    depthText.toLowerCase().includes("2000") ||
    depthText.toLowerCase().includes("vực");

  const adaptedLayers = archetype.layers.map((layer) => {
    return {
      ...layer,
      hotspots: layer.hotspots.map((hs) => {
        let dynamicDescVi = hs.descVi;
        let dynamicDescEn = hs.descEn;

        // Dynamic depth adaptation rule
        if (isDeepSea && hs.sys === "respiratory" && hs.id.includes("swim")) {
          dynamicDescVi += ` (Đặc thù độ sâu: Ở vùng biển sâu của ${speciesName}, bóng hơi được phủ mỡ dày hoặc tiêu giảm để tránh nổ vỡ dưới áp suất cực lớn).`;
          dynamicDescEn += ` (Deep-sea adaptation: In ${speciesName}, swim bladder is heavily lipid-invested or reduced to prevent rupture under extreme pressures).`;
        }

        return {
          ...hs,
          descVi: dynamicDescVi,
          descEn: dynamicDescEn,
        };
      }),
    };
  });

  const isFlagship = Boolean(
    species.isFlagship ||
    species.hasCustom3DModel ||
    combinedText.includes("cá mập trắng") ||
    combinedText.includes("white shark") ||
    combinedText.includes("cá voi xanh") ||
    combinedText.includes("blue whale"),
  );

  return {
    archetypeId: archetype.id,
    archetypeNameVi: archetype.nameVi,
    archetypeNameEn: archetype.nameEn,
    isFlagship,
    badgeTextVi: isFlagship
      ? `Mô hình giải phẫu cá sụn tiêu chuẩn`
      : `Mô hình phân loại học lớp ${archetype.nameVi.toLowerCase()}`,
    badgeTextEn: isFlagship
      ? `Dedicated cartilaginous model`
      : `${archetype.nameEn} taxonomic model`,
    badgeColor: archetype.badgeColor,
    coverageVi: archetype.coverageVi,
    layers: adaptedLayers,
  };
}
