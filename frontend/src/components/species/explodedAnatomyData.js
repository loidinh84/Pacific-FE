export const CHONDRICHTHYES_PARTS = [
  {
    id: "part_skin",
    nameVi: "Lớp da vảy gai placoid",
    nameEn: "Placoid Dermal Armor",
    labelVi: "Lớp da vảy gai",
    labelEn: "Dermal Armor",
    sys: "muscular",
    system: "Bảo vệ và thủy động học",
    latinName: "Integumentum squamosum placoidale",
    origin: [500, 225],
    plateCoords: [50, 48],
    vector: [0, -42],
    laser: false,
    color: "#38bdf8",
    descVi:
      "Lớp da phủ hàng triệu vảy gai placoid vi mô có cấu tạo men ngà, giúp định hình dòng xoáy nước, triệt tiêu tiếng ồn thủy âm và hỗ trợ lướt êm tuyệt đối khi săn mồi.",
    descEn:
      "Epidermal armor studded with microscopic placoid scales channeling micro-vortices for silent, zero-cavitation cruising.",
    medicalData: {
      weightEstimate: "~7.5% thể trọng",
      functionVi:
        "Giảm lực cản ma sát biểu bì 8.7% và triệt tiêu tiếng ồn thủy âm",
      functionEn: "Reduces skin friction drag by 8.7% and dampens turbulence",
      medicalUseVi:
        "Công nghệ màng Sharklet phỏng sinh học kháng khuẩn trên bề mặt thiết bị y tế và vỏ tàu lặn.",
      medicalUseEn:
        "Sharklet biomimetic antimicrobial micro-patterning for implants and submersibles.",
      source: "Nature Materials & Marine Biomimetics",
    },
    medicalUseVi:
      "Công nghệ màng Sharklet phỏng sinh học kháng khuẩn trên bề mặt thiết bị y tế và vỏ tàu lặn.",
    medicalUseEn:
      "Sharklet biomimetic antimicrobial micro-patterning for implants and submersibles.",
  },
  {
    id: "part_dorsal_fin",
    nameVi: "Vây lưng ổn định",
    nameEn: "Falcate Dorsal Stabilizer",
    labelVi: "Vây lưng",
    labelEn: "Dorsal Fin",
    sys: "muscular",
    system: "Vận động và cân bằng",
    latinName: "Pinna dorsalis primaria falcata",
    origin: [500, 142],
    plateCoords: [50, 28],
    vector: [0, -115],
    laser: true,
    color: "#0284c7",
    descVi:
      "Cánh vây đứng biên dạng lưỡi liềm triệt tiêu dao động lắc ngang khi bơi tốc độ cao, gắn kết vững chãi với cột sống qua phiến sụn đáy nâng đỡ.",
    descEn:
      "Falcate hydrodynamic vertical foil mounted to spinal pterygiophores, damping roll-yaw instability during high-velocity predatory strikes.",
    medicalData: {
      weightEstimate: "~2.8% thể trọng",
      functionVi: "Ổn định góc lật ngang và triệt tiêu xoáy cuộn bề mặt",
      functionEn: "Yaw-roll stability and vortex shedding minimization",
      medicalUseVi:
        "Hình học cánh vây biến thiên cho tàu lặn thăm dò không người lái chống lật trong dòng hải lưu.",
      medicalUseEn:
        "Passive flow-adaptive foil geometries for autonomous underwater drones.",
      source: "Journal of Experimental Biology",
    },
    medicalUseVi:
      "Hình học cánh vây biến thiên cho tàu lặn thăm dò không người lái chống lật trong dòng hải lưu.",
    medicalUseEn:
      "Passive flow-adaptive foil geometries for autonomous underwater drones.",
  },
  {
    id: "part_pectoral_fin",
    nameVi: "Cặp vây ngực nâng đỡ",
    nameEn: "Paired Pectoral Hydrofoils",
    labelVi: "Cặp vây ngực",
    labelEn: "Pectoral Fins",
    sys: "muscular",
    system: "Vận động và nâng thủy động",
    latinName: "Pinnae pectorales falcatae",
    origin: [385, 245],
    plateCoords: [39, 78],
    vector: [-75, 115],
    laser: true,
    color: "#0ea5e9",
    descVi:
      "Hoạt động như đôi cánh khí động học tạo lực nâng dương liên tục bù đắp việc cá mập không có bóng hơi, gốc vây gắn liền ba tấm sụn đáy cơ động.",
    descEn:
      "Functioning as biological aircraft wings generating continuous positive lift without a swim bladder, articulated via tri-part basal cartilage plates.",
    medicalData: {
      weightEstimate: "~4.5% thể trọng",
      functionVi: "Tạo lực nâng thủy động lực học dương liên tục khi bơi tiến",
      functionEn:
        "Generates continuous hydrodynamic positive lift preventing sinking",
      medicalUseVi:
        "Cánh nâng thích ứng phỏng sinh học cho robot cứu hộ biển sâu và thiết bị lặn tự hành.",
      medicalUseEn:
        "Biomimetic adaptive-camber subsea wings for autonomous buoyancy gliders.",
      source: "Hydrodynamics of Elasmobranch Locomotion",
    },
    medicalUseVi:
      "Cánh nâng thích ứng phỏng sinh học cho robot cứu hộ biển sâu và thiết bị lặn tự hành.",
    medicalUseEn:
      "Biomimetic adaptive-camber subsea wings for autonomous buoyancy gliders.",
  },
  {
    id: "part_caudal_fin",
    nameVi: "Vây đuôi trợ lực đẩy",
    nameEn: "Heterocercal Caudal Propulsor",
    labelVi: "Vây đuôi",
    labelEn: "Caudal Tail",
    sys: "muscular",
    system: "Động lực đẩy chính",
    latinName: "Pinna caudalis heterocerca",
    origin: [880, 220],
    plateCoords: [88, 48],
    vector: [125, -10],
    laser: true,
    color: "#0284c7",
    descVi:
      "Thùy trên kéo dài theo cột sống sụn uốn dẻo có khía đuôi đặc trưng, thùy dưới phối hợp tạo sức đẩy tiến vượt trội đồng thời điều chỉnh góc ngẩng đầu.",
    descEn:
      "Asymmetric crescent tail where spinal column extends into upper lobe, creating massive forward thrust and positive pitch trim.",
    medicalData: {
      weightEstimate: "~8.2% thể trọng",
      functionVi:
        "Tạo lực đẩy tiến tuyến tính cực đại phối hợp kiểm soát góc ngẩng đầu",
      functionEn:
        "Generates massive forward propulsion with upward pitch trim compensation",
      medicalUseVi:
        "Vật liệu composite sợi carbon dẻo mô phỏng tính đàn hồi của sụn đuôi cá mập ứng dụng trên chân vịt sinh học.",
      medicalUseEn:
        "High-yield oscillating carbon-fiber propulsors for subsea biomimetic drones.",
      source: "Bio-Propulsion Laboratory Studies",
    },
    medicalUseVi:
      "Vật liệu composite sợi carbon dẻo mô phỏng tính đàn hồi của sụn đuôi cá mập ứng dụng trên chân vịt sinh học.",
    medicalUseEn:
      "High-yield oscillating carbon-fiber propulsors for subsea biomimetic drones.",
  },
  {
    id: "part_myomeres",
    nameVi: "Khối cơ vận động myomeres",
    nameEn: "Segmented Myomere Blocks",
    labelVi: "Khối cơ vận động",
    labelEn: "Myomere Muscles",
    sys: "muscular",
    system: "Hệ cơ vận động",
    latinName: "Myomeri selachii segmentati",
    origin: [530, 185],
    plateCoords: [55, 42],
    vector: [45, -85],
    laser: true,
    color: "#f43f5e",
    descVi:
      "Khối cơ đỏ giàu sắc tố myoglobin chạy dọc thân uốn lượn hình chữ W đan xen vách myosepta, kết hợp mạng lưới mạch trao đổi nhiệt ngược dòng giữ ấm cơ bắp cao hơn nước biển 14°C.",
    descEn:
      "Interlocking W-shaped chevron muscle blocks with counter-current retia mirabilia heat exchangers elevating muscle temperature 14°C above ambient sea.",
    medicalData: {
      weightEstimate: "~48% khối lượng cơ thể",
      functionVi: "Phát lực uốn thân tuần hoàn và giữ nhiệt cơ bắp nội nhiệt",
      functionEn:
        "High-efficiency undulating torque and regional thermal retention",
      medicalUseVi:
        "Nghiên cứu cơ chế trao đổi nhiệt ngược dòng phòng chống sốc nhiệt trong phẫu thuật hạ thân nhiệt nhân tạo.",
      medicalUseEn:
        "Counter-current biological heat exchanger models for induced therapeutic hypothermia.",
      source: "Comparative Muscle Physiology",
    },
    medicalUseVi:
      "Nghiên cứu cơ chế trao đổi nhiệt ngược dòng phòng chống sốc nhiệt trong phẫu thuật hạ thân nhiệt nhân tạo.",
    medicalUseEn:
      "Counter-current biological heat exchanger models for induced therapeutic hypothermia.",
  },
  {
    id: "part_liver",
    nameVi: "Lá gan dầu squalene",
    nameEn: "Squalene Buoyancy Liver",
    labelVi: "Lá gan dầu",
    labelEn: "Squalene Liver",
    sys: "digestive",
    system: "Tiêu hóa và nổi thủy tĩnh",
    latinName: "Hepar bilobatum squalenicum",
    origin: [490, 235],
    plateCoords: [43, 58],
    vector: [-25, 110],
    laser: true,
    color: "#f59e0b",
    descVi:
      "Chiếm tới gần một phần ba thể trọng và chứa đầy dầu squalene tỷ trọng nhẹ hơn nước biển, đóng vai trò như phao thủy tĩnh tự nhiên thay thế hoàn hảo cho bóng hơi.",
    descEn:
      "Comprising up to 28% of body mass and saturated with low-density squalene oil, functioning as a biological hydrostatic ballast float.",
    medicalData: {
      weightEstimate: "~25-28% khối lượng cơ thể",
      functionVi:
        "Cân bằng độ nổi trung tính thủy tĩnh và dự trữ lipid năng lượng",
      functionEn:
        "Hydrostatic neutral buoyancy and vast metabolic energy store",
      medicalUseVi:
        "Hợp chất squalene tinh khiết làm tá dược tăng cường miễn dịch trong vaccine và hoạt chất bảo vệ màng tế bào.",
      medicalUseEn:
        "Ultra-pure pharmaceutical squalene used as immunological vaccine adjuvant and cellular antioxidant.",
      source: "Marine Pharmacology Journal",
    },
    medicalUseVi:
      "Hợp chất squalene tinh khiết làm tá dược tăng cường miễn dịch trong vaccine và hoạt chất bảo vệ màng tế bào.",
    medicalUseEn:
      "Ultra-pure pharmaceutical squalene used as immunological vaccine adjuvant and cellular antioxidant.",
  },
  {
    id: "part_spiral_valve",
    nameVi: "Dạ dày và ruột van xoắn ốc",
    nameEn: "Stomach & Spiral Valve",
    labelVi: "Dạ dày & van xoắn",
    labelEn: "Spiral Valve",
    sys: "digestive",
    system: "Hệ tiêu hóa",
    latinName: "Ventriculus et Intestinum Valvula Spiralis",
    origin: [630, 235],
    plateCoords: [54, 58],
    vector: [75, 95],
    laser: true,
    color: "#10b981",
    descVi:
      "Dạ dày chữ J co giãn nuốt trọn con mồi lớn, nối với đoạn ruột van xoắn ốc chứa các vách xoắn Archimedes giúp tăng diện tích tiếp xúc hấp thu dinh dưỡng gấp 15 lần trong thể tích bụng gọn gàng.",
    descEn:
      "Elastic J-shaped stomach connected to a compact spiral valve intestine fitted with Archimedean helical baffles multiplying nutrient absorption 15-fold.",
    medicalData: {
      weightEstimate: "~3.2% thể trọng",
      functionVi:
        "Tối ưu hóa bề mặt hấp thu tiêu hóa trong thể tích ổ bụng nhỏ",
      functionEn: "Archimedean helical fluidic surface maximization",
      medicalUseVi:
        "Mô phỏng đường dẫn dòng xoắn ốc trong màng lọc chạy thận nhân tạo và ống sinh học y tế.",
      medicalUseEn:
        "Archimedean helical fluidic pathing for ultra-compact hemodialysis and bioreactor membranes.",
      source: "Comparative Digestive Morphometry",
    },
    medicalUseVi:
      "Mô phỏng đường dẫn dòng xoắn ốc trong màng lọc chạy thận nhân tạo và ống sinh học y tế.",
    medicalUseEn:
      "Archimedean helical fluidic pathing for ultra-compact hemodialysis and bioreactor membranes.",
  },
  {
    id: "part_heart",
    nameVi: "Tim sụn và hành động mạch",
    nameEn: "Branchial Heart & Conus",
    labelVi: "Trái tim",
    labelEn: "Heart",
    sys: "circulatory",
    system: "Hệ tuần hoàn",
    latinName: "Cor branchiale et Conus arteriosus",
    origin: [285, 245],
    plateCoords: [32, 58],
    vector: [-95, 65],
    laser: true,
    color: "#e11d48",
    descVi:
      "Trái tim cơ bắp gồm xoang tĩnh mạch, tâm nhĩ và tâm thất dày dặn, bơm máu qua hành động mạch chứa nhiều tầng van bán nguyệt trực tiếp lên các cung mang.",
    descEn:
      "Muscular pump comprising sinus venosus, atrium, thick ventricle, and conus arteriosus with multi-tiered semilunar valves feeding branchial gill arches.",
    medicalData: {
      weightEstimate: "~0.18% thể trọng",
      functionVi: "Duy trì tuần hoàn đơn áp suất liên tục qua các cung mang",
      functionEn:
        "Continuous single-circuit low-resistance branchial perfusion",
      medicalUseVi:
        "Nghiên cứu cơ chế van một chiều nhiều tầng trong hành động mạch phòng chống trào ngược máu trên van tim nhân tạo.",
      medicalUseEn:
        "Multi-tiered conus valve mechanics informing next-generation prosthetic anti-reflux cardiac valves.",
      source: "Elasmobranch Cardiovascular Biology",
    },
    medicalUseVi:
      "Nghiên cứu cơ chế van một chiều nhiều tầng trong hành động mạch phòng chống trào ngược máu trên van tim nhân tạo.",
    medicalUseEn:
      "Multi-tiered conus valve mechanics informing next-generation prosthetic anti-reflux cardiac valves.",
  },
  {
    id: "part_gills",
    nameVi: "Cung mang và phiến mang hô hấp",
    nameEn: "Branchial Arches & Lamellae",
    labelVi: "Cung mang",
    labelEn: "Gill Arches",
    sys: "respiratory",
    system: "Hệ hô hấp",
    latinName: "Arcus branchiales et Lamellae branchiales",
    origin: [315, 215],
    plateCoords: [28, 52],
    vector: [-55, 30],
    laser: true,
    color: "#f43f5e",
    descVi:
      "Năm vòm sụn mang uốn cong nâng đỡ hàng ngàn phiến mang đỏ rực, vận hành cơ chế trao đổi khí ngược dòng chiết xuất tới 80% lượng oxy hòa tan trong nước biển.",
    descEn:
      "Five naked cartilaginous gill arches bearing blood-rich lamellae utilizing counter-current oxygen exchange to extract up to 80% dissolved O2.",
    medicalData: {
      weightEstimate: "~2.4% thể trọng",
      functionVi: "Trao đổi khí ngược dòng hấp thu oxy và thải khí carbonic",
      functionEn: "Counter-current gas exchange extracting dissolved oxygen",
      medicalUseVi:
        "Màng lọc oxy nhân tạo vi lưu mô phỏng phiến mang cho hệ thống tuần hoàn ngoài cơ thể ECMO.",
      medicalUseEn:
        "Microfluidic artificial oxygenator membranes inspired by branchial counter-current lamellae.",
      source: "Respiratory Physiology of Elasmobranchs",
    },
    medicalUseVi:
      "Màng lọc oxy nhân tạo vi lưu mô phỏng phiến mang cho hệ thống tuần hoàn ngoài cơ thể ECMO.",
    medicalUseEn:
      "Microfluidic artificial oxygenator membranes inspired by branchial counter-current lamellae.",
  },
  {
    id: "part_brain",
    nameVi: "Bộ não và dây thần kinh khứu giác",
    nameEn: "Brain & Olfactory Tracts",
    labelVi: "Bộ não",
    labelEn: "Cephalic Brain",
    sys: "nervous",
    system: "Hệ thần kinh trung ương",
    latinName: "Encephalon et Tractus olfactorii",
    origin: [225, 175],
    plateCoords: [21, 44],
    vector: [-55, -90],
    laser: true,
    color: "#fbbf24",
    descVi:
      "Khối não phát triển với thùy khứu giác chiếm 14% thể tích não nhận tín hiệu mùi nồng độ một phần tỷ, kết hợp thùy thị giác và tiểu não nếp gấp chỉ huy phản xạ săn mồi chớp nhoáng.",
    descEn:
      "Large brain dominated by massive olfactory bulbs detecting amino acids at 1 part per billion, paired optic tecta, and folded cerebellum coordinating sprint attacks.",
    medicalData: {
      weightEstimate: "~0.12% thể trọng",
      functionVi:
        "Tích hợp đa giác quan khứu giác, thị giác, cảm ứng điện trường và ra quyết định săn mồi",
      functionEn:
        "Multi-modal sensory integration and predatory decision-making",
      medicalUseVi:
        "Mô hình xử lý tín hiệu hóa học phân tử pico-molar cho cảm biến sinh học phát hiện độc tố nước biển.",
      medicalUseEn:
        "Pico-molar molecular olfactory processing models for ultra-sensitive biosensors.",
      source: "Brain, Behavior and Evolution Journal",
    },
    medicalUseVi:
      "Mô hình xử lý tín hiệu hóa học phân tử pico-molar cho cảm biến sinh học phát hiện độc tố nước biển.",
    medicalUseEn:
      "Pico-molar molecular olfactory processing models for ultra-sensitive biosensors.",
  },
  {
    id: "part_ampullae",
    nameVi: "Túi cảm ứng điện trường lorenzini",
    nameEn: "Ampullae of Lorenzini",
    labelVi: "Túi thụ cảm lorenzini",
    labelEn: "Electro-Receptors",
    sys: "nervous",
    system: "Hệ giác quan",
    latinName: "Ampullae Lorenzinii",
    origin: [155, 205],
    plateCoords: [11, 50],
    vector: [-105, -50],
    laser: true,
    color: "#f59e0b",
    descVi:
      "Mạng lưới các lỗ chân lông chứa chất gel sinh học dẫn proton, có khả năng phát hiện dòng điện sinh học cực yếu từ nhịp tim của con mồi đang ẩn mình dưới đáy cát.",
    descEn:
      "Pores filled with highly conductive protonic hydrogel detecting electrical gradients as subtle as 5 nV/cm emitted by buried prey muscle twitches.",
    medicalData: {
      weightEstimate: "Hàng trăm hố cảm thụ vi mô",
      functionVi:
        "Định vị thụ động điện trường sinh học con mồi và từ trường Trái Đất",
      functionEn: "Passive bio-electric sensing and geomagnetic navigation",
      medicalUseVi:
        "Vật liệu hydrogel sinh học tự cấp năng lượng ứng dụng cho điện cực não và cảm biến điện tim không xâm lấn.",
      medicalUseEn:
        "Self-powered biomimetic protonic hydrogels for non-invasive neural interface sensors.",
      source: "Nature: Proton Conductivity in Ampullary Gel",
    },
    medicalUseVi:
      "Vật liệu hydrogel sinh học tự cấp năng lượng ứng dụng cho điện cực não và cảm biến điện tim không xâm lấn.",
    medicalUseEn:
      "Self-powered biomimetic protonic hydrogels for non-invasive neural interface sensors.",
  },
  {
    id: "part_chassis",
    nameVi: "Khung sọ sụn và cột sống",
    nameEn: "Cartilaginous Skull & Spine",
    labelVi: "Khung sọ & cột sống",
    labelEn: "Skeleton Chassis",
    sys: "skeletal",
    system: "Bộ xương sụn",
    latinName: "Chondrocranium, Dentes et Columna vertebralis",
    origin: [500, 215],
    plateCoords: [58, 42],
    vector: [0, 0],
    laser: false,
    color: "#e2e8f0",
    descVi:
      "Hộp sọ sụn vôi hóa dẻo dai nhẹ hơn xương cứng một nửa, bộ hàm mang nhiều hàng răng cưa tam giác sắc như dao cạo, cùng hơn 30 đốt sống sụn ôm trọn tủy sống chạy suốt chiều dài thân.",
    descEn:
      "Tessellated calcified cartilage skull, articulated jaws bearing razor-sharp serrated teeth, and articulated vertebrae enclosing the spinal cord.",
    medicalData: {
      weightEstimate: "~10.5% thể trọng",
      functionVi:
        "Trục khung chịu lực đàn hồi, neo cơ bắp và bảo vệ hệ thần kinh trung ương",
      functionEn:
        "Elastic load-bearing chassis, muscle anchor, and neural cord protection",
      medicalUseVi:
        "Vật liệu khung sụn sinh học ghép xương tự thân không gây kích ứng miễn dịch trong phẫu thuật tái tạo.",
      medicalUseEn:
        "Engineered biomimetic cartilage scaffolds for non-immunogenic reconstructive surgery.",
      source: "Acta Biomaterialia: Shark Cartilage Architecture",
    },
    medicalUseVi:
      "Vật liệu khung sụn sinh học ghép xương tự thân không gây kích ứng miễn dịch trong phẫu thuật tái tạo.",
    medicalUseEn:
      "Engineered biomimetic cartilage scaffolds for non-immunogenic reconstructive surgery.",
  },
];

export const OSTEICHTHYES_PARTS = [
  {
    id: "ost_body",
    nameVi: "Lớp vảy & Biểu bì",
    nameEn: "Scales & Epidermis",
    labelVi: "Lớp vảy",
    labelEn: "Scales",
    sys: "muscular",
    system: "Bảo vệ và thủy động học",
    latinName: "Lepidotrichia & Epidermis",
    origin: [500, 220],
    plateCoords: [50, 48],
    vector: [0, -38],
    laser: false,
    color: "#22d3ee",
    descVi:
      "Vảy cycloid/ctenoid xếp chồng lớp ngói kết hợp lớp màng nhầy sinh học giúp giảm 65% lực ma sát nhớt trong nước và ngăn chặn vi sinh vật xâm nhập.",
    descEn:
      "Overlapping cycloid/ctenoid scales coated in biological glycoprotein mucus, reducing hydrodynamic drag by up to 65% while resisting pathogenetic invasion.",
    medicalData: {
      weightEstimate: "~5% thể trọng",
      functionVi:
        "Bảo vệ mô bào, tiết màng nhầy sinh học giảm ma sát và chống nhiễm khuẩn biển",
      functionEn:
        "Protects tissues, secretes biological mucus layer reducing friction and resisting marine infections",
      medicalUseVi:
        "Nghiên cứu cấu trúc vảy xếp lớp và chất nhầy phỏng sinh học chống bám bẩn bề mặt tàu thuyền và cảm biến ngầm.",
      medicalUseEn:
        "Biomimetic imbricated scale matrices and antimicrobial mucus for antifouling coatings on subsea hulls.",
      source: "Comparative Anatomy of Teleost Fishes",
    },
    medicalUseVi:
      "Nghiên cứu cấu trúc vảy xếp lớp và chất nhầy phỏng sinh học chống bám bẩn bề mặt tàu thuyền và cảm biến ngầm.",
    medicalUseEn:
      "Biomimetic imbricated scale matrices and antimicrobial mucus for antifouling coatings on subsea hulls.",
  },
  {
    id: "ost_dorsal_fin",
    nameVi: "Vây lưng gai cứng & mềm",
    nameEn: "Spiny & Soft Dorsal Fin",
    labelVi: "Vây lưng",
    labelEn: "Dorsal Fin",
    sys: "muscular",
    system: "Vận động và cân bằng",
    latinName: "Pinna dorsalis spinosa et mollis",
    origin: [520, 115],
    plateCoords: [52, 22],
    vector: [0, -100],
    laser: true,
    color: "#06b6d4",
    descVi:
      "Phần trước gồm các gai xương cứng nhọn có thể giương thẳng để tự vệ, phần sau là các tia vây mềm uốn lượn ổn định hướng bơi trong dòng chảy xoáy.",
    descEn:
      "Anterior rigid fin spines for defense and stabilization; posterior flexible branched rays for nuanced steering in turbulent currents.",
    medicalData: {
      weightEstimate: "~2.2% thể trọng",
      functionVi:
        "Triệt tiêu dao động chao đảo ngang và ổn định thủy động học khi bơi nước xiết",
      functionEn:
        "Yaw-roll damping and dynamic directional stability during burst swimming",
      medicalUseVi:
        "Thiết kế cánh vi chỉnh ổn định góc nghiêng cho tàu ngầm không người lái.",
      medicalUseEn:
        "Micro-trim stabilization fins for autonomous underwater submersibles.",
      source: "Journal of Fish Biology",
    },
    medicalUseVi:
      "Thiết kế cánh vi chỉnh ổn định góc nghiêng cho tàu ngầm không người lái.",
    medicalUseEn:
      "Micro-trim stabilization fins for autonomous underwater submersibles.",
  },
  {
    id: "ost_swim_bladder",
    nameVi: "Bóng hơi thủy tĩnh",
    nameEn: "Hydrostatic Swim Bladder",
    labelVi: "Bóng hơi",
    labelEn: "Swim Bladder",
    sys: "respiratory",
    system: "Hô hấp và thủy tĩnh",
    latinName: "Vesica natatoria",
    origin: [520, 195],
    plateCoords: [52, 42],
    vector: [0, -65],
    laser: true,
    color: "#60a5fa",
    descVi:
      "Túi màng chứa đầy khí (oxy, nitơ), điều tiết thể tích qua tuyến khí hoặc ống dẫn khí để duy trì trạng thái lơ lửng trung tính ở mọi độ sâu mà không tốn năng lượng bơi.",
    descEn:
      "Gas-filled hydrostatic organ regulating buoyancy via gas gland rete mirabile, maintaining neutral buoyancy at varying depths without kinetic energy.",
    medicalData: {
      weightEstimate: "~4.5% thể tích nội tạng",
      functionVi:
        "Kiểm soát lực nổi thủy tĩnh trung tính và thu nhận khuếch đại âm thanh đáy biển",
      functionEn:
        "Neutral buoyancy control and acoustic resonance transduction to the inner ear",
      medicalUseVi:
        "Vật liệu màng sinh học nano chịu áp suất biến thiên phỏng sinh học và buồng cân bằng nổi cho phao quan trắc đại dương.",
      medicalUseEn:
        "Pressure-resilient biomimetic gas bladders for oceanographic buoyancy engines.",
      source: "Comparative Biochemistry and Physiology",
    },
    medicalUseVi:
      "Vật liệu màng sinh học nano chịu áp suất biến thiên phỏng sinh học và buồng cân bằng nổi cho phao quan trắc đại dương.",
    medicalUseEn:
      "Pressure-resilient biomimetic gas bladders for oceanographic buoyancy engines.",
  },
  {
    id: "ost_gills_operculum",
    nameVi: "Nắp mang & Cung mang xương",
    nameEn: "Operculum & Gill Arches",
    labelVi: "Nắp & Cung mang",
    labelEn: "Operculum & Gills",
    sys: "respiratory",
    system: "Hô hấp và lọc khí",
    latinName: "Operculum et Arcus branchiales",
    origin: [310, 215],
    plateCoords: [31, 48],
    vector: [-65, 30],
    laser: true,
    color: "#38bdf8",
    descVi:
      "Nắp mang xương cứng đóng mở tạo bơm áp suất hai thì chủ động, bảo vệ 4 đôi cung mang đỏ tươi giàu mao mạch trao đổi oxy đối dòng.",
    descEn:
      "Rigid bony opercular flap generating active dual-pump ventilation across 4 pairs of vascularized gill filaments.",
    medicalData: {
      weightEstimate: "~3.8% thể trọng",
      functionVi:
        "Chủ động bơm hút nước qua mang ngay cả khi cá đứng yên dừng bơi",
      functionEn:
        "Active dual-phase buccal-opercular ventilation without continuous swimming",
      medicalUseVi:
        "Màng trao đổi khí nhân tạo và hệ thống bơm vi lưu hiệu suất cao chống tắc nghẽn.",
      medicalUseEn:
        "Microfluidic counter-current oxygenators and self-flushing filtration valves.",
      source: "Respiration Physiology in Aquatic Vertebrates",
    },
    medicalUseVi:
      "Màng trao đổi khí nhân tạo và hệ thống bơm vi lưu hiệu suất cao chống tắc nghẽn.",
    medicalUseEn:
      "Microfluidic counter-current oxygenators and self-flushing filtration valves.",
  },
  {
    id: "ost_liver",
    nameVi: "Gan và túi mật cá xương",
    nameEn: "Liver & Gallbladder",
    labelVi: "Gan & Túi mật",
    labelEn: "Liver & Gallbladder",
    sys: "digestive",
    system: "Tiêu hóa và chuyển hóa",
    latinName: "Hepar et Vesica fellea",
    origin: [410, 245],
    plateCoords: [41, 56],
    vector: [-20, 95],
    laser: true,
    color: "#10b981",
    descVi:
      "Tuyến tiêu hóa đa chức năng tích trữ glycogen, tiết mật tiêu hóa lipid và lọc thải độc tố tuần hoàn máu.",
    descEn:
      "Multi-functional metabolic hub synthesizing bile salts, storing glycogen reserves, and detoxifying metabolic byproducts.",
    medicalData: {
      weightEstimate: "~2.5% thể trọng",
      functionVi:
        "Tổng hợp enzyme tiêu hóa, dự trữ năng lượng và chuyển hóa lipid",
      functionEn: "Enzymatic synthesis, energy storage, and lipid metabolism",
      medicalUseVi:
        "Nghiên cứu hoạt chất sinh học chống oxy hóa và enzyme chuyển hóa mỡ chịu nhiệt độ thấp.",
      medicalUseEn:
        "Cold-adapted metabolic enzymes for cryogenic bio-preservation.",
      source: "Fish Physiology & Biochemistry",
    },
    medicalUseVi:
      "Nghiên cứu hoạt chất sinh học chống oxy hóa và enzyme chuyển hóa mỡ chịu nhiệt độ thấp.",
    medicalUseEn:
      "Cold-adapted metabolic enzymes for cryogenic bio-preservation.",
  },
  {
    id: "ost_stomach",
    nameVi: "Dạ dày & Manh tràng môn vị",
    nameEn: "Stomach & Pyloric Caeca",
    labelVi: "Dạ dày & Manh tràng",
    labelEn: "Stomach & Caeca",
    sys: "digestive",
    system: "Hệ tiêu hóa",
    latinName: "Ventriculus et Appendices pyloricae",
    origin: [490, 240],
    plateCoords: [49, 54],
    vector: [45, 90],
    laser: true,
    color: "#eab308",
    descVi:
      "Dạ dày hình chữ U co bóp kết hợp chùm manh tràng môn vị dạng ngón tay làm tăng diện tích tiết enzyme và hấp thu dinh dưỡng tối đa.",
    descEn:
      "Muscular gastric cavity articulated with finger-like pyloric caeca greatly expanding digestive and nutrient absorption area.",
    medicalData: {
      weightEstimate: "~3.2% thể trọng",
      functionVi:
        "Nghiền nát thức ăn bằng axit pepsin và hấp thu nhanh dưỡng chất qua manh tràng",
      functionEn:
        "Acidic protein digestion and high-surface-area mucosal nutrient absorption",
      medicalUseVi:
        "Mô hình màng lọc hấp phụ diện tích cao và vỏ nang thuốc tự giải phóng theo pH.",
      medicalUseEn:
        "pH-sensitive microencapsulation inspired by pyloric absorption folds.",
      source: "Gastroenterology in Marine Teleosts",
    },
    medicalUseVi:
      "Mô hình màng lọc hấp phụ diện tích cao và vỏ nang thuốc tự giải phóng theo pH.",
    medicalUseEn:
      "pH-sensitive microencapsulation inspired by pyloric absorption folds.",
  },
  {
    id: "ost_heart",
    nameVi: "Tim 2 ngăn & Hành động mạch",
    nameEn: "Two-Chambered Heart & Bulbus Arteriosus",
    labelVi: "Tim 2 ngăn",
    labelEn: "Two-Chambered Heart",
    sys: "circulatory",
    system: "Hệ tuần hoàn",
    latinName: "Cor et Bulbus arteriosus",
    origin: [305, 260],
    plateCoords: [30, 60],
    vector: [-85, 75],
    laser: true,
    color: "#ef4444",
    descVi:
      "Tim gồm một tâm nhĩ mỏng và một tâm thất cơ bắp khỏe, kết hợp hành động mạch bulbus arteriosus có tính đàn hồi cao giúp duy trì dòng máu ổn định qua mang.",
    descEn:
      "Two-chambered systemic pump with an elastic bulbus arteriosus that smooths systolic pressure spikes before blood enters delicate gill capillaries.",
    medicalData: {
      weightEstimate: "~0.8% thể trọng",
      functionVi:
        "Bơm dòng máu đơn vòng qua mang để oxy hóa rồi trực tiếp đến các mô cơ quan",
      functionEn:
        "Single-circuit circulatory pump with elastic arterial pressure buffering",
      medicalUseVi:
        "Mô hình vật liệu đàn hồi giảm chấn xung áp lực dòng chảy trong van tim nhân tạo.",
      medicalUseEn:
        "Biomimetic compliance reservoirs for artificial vascular grafts.",
      source: "American Journal of Physiology",
    },
    medicalUseVi:
      "Mô hình vật liệu đàn hồi giảm chấn xung áp lực dòng chảy trong van tim nhân tạo.",
    medicalUseEn:
      "Biomimetic compliance reservoirs for artificial vascular grafts.",
  },
  {
    id: "ost_brain",
    nameVi: "Não bộ & Thùy thị giác",
    nameEn: "Brain & Optic Lobes",
    labelVi: "Não & Thị giác",
    labelEn: "Brain & Optic Tectum",
    sys: "nervous",
    system: "Hệ thần kinh",
    latinName: "Encephalon et Lobi optici",
    origin: [255, 175],
    plateCoords: [25, 38],
    vector: [-45, -85],
    laser: true,
    color: "#f59e0b",
    descVi:
      "Não cá xương nổi bật với thùy thị giác optic tectum phát triển vượt trội, xử lý tín hiệu thị giác màu sắc độ nét cao và tiểu não giữ thăng bằng ba chiều.",
    descEn:
      "Central nervous system dominated by prominent optic lobes processing multi-spectral visual input and cerebellum coordinating 3D rheotaxis.",
    medicalData: {
      weightEstimate: "~0.3% thể trọng",
      functionVi:
        "Xử lý thị giác màu sắc phức tạp, thăng bằng chuyển động và định vị dòng chảy",
      functionEn:
        "High-resolution color visual processing and rheotaxic balance",
      medicalUseVi:
        "Thuật toán thị giác máy tính phỏng sinh học xử lý hình ảnh tán xạ quang học dưới nước.",
      medicalUseEn:
        "Underwater optical de-scattering algorithms inspired by teleost optic tectum.",
      source: "Brain, Behavior and Evolution",
    },
    medicalUseVi:
      "Thuật toán thị giác máy tính phỏng sinh học xử lý hình ảnh tán xạ quang học dưới nước.",
    medicalUseEn:
      "Underwater optical de-scattering algorithms inspired by teleost optic tectum.",
  },
  {
    id: "ost_pectoral_pelvic_fin",
    nameVi: "Cặp vây ngực & Vây bụng",
    nameEn: "Paired Pectoral & Pelvic Fins",
    labelVi: "Vây ngực & bụng",
    labelEn: "Pectoral & Pelvic",
    sys: "muscular",
    system: "Vận động và vi chỉnh",
    latinName: "Pinnae pectorales et ventrales",
    origin: [380, 260],
    plateCoords: [38, 70],
    vector: [-60, 95],
    laser: true,
    color: "#38bdf8",
    descVi:
      "Đôi vây ngực và vây bụng cơ động độc lập đóng vai trò phanh thủy động học, quay đầu tại chỗ và duy trì thăng bằng ba chiều.",
    descEn:
      "Independently articulated paired fins providing precision braking, hover control, and agile pitch adjustments.",
    medicalData: {
      weightEstimate: "~1.8% thể trọng",
      functionVi: "Hãm phanh, đảo chiều tức thì và giữ thăng bằng vi mô",
      functionEn:
        "Precision station-keeping, reverse thrust, and micro-trim attitude control",
      medicalUseVi:
        "Cơ cấu chân vịt vây cơ động đa hướng cho robot thám hiểm rạn san hô.",
      medicalUseEn:
        "Multi-axis bio-robotic fin thrusters for delicate reef inspection drones.",
      source: "Bioinspiration & Biomimetics",
    },
    medicalUseVi:
      "Cơ cấu chân vịt vây cơ động đa hướng cho robot thám hiểm rạn san hô.",
    medicalUseEn:
      "Multi-axis bio-robotic fin thrusters for delicate reef inspection drones.",
  },
  {
    id: "ost_caudal_fin",
    nameVi: "Vây đuôi đối xứng homocercal",
    nameEn: "Homocercal Caudal Fin",
    labelVi: "Vây đuôi",
    labelEn: "Caudal Fin",
    sys: "muscular",
    system: "Động lực đẩy chính",
    latinName: "Pinna caudalis homocerca",
    origin: [880, 220],
    plateCoords: [88, 48],
    vector: [115, 0],
    laser: true,
    color: "#06b6d4",
    descVi:
      "Dạng vây đuôi đối xứng hai thùy homocercal hoàn hảo tạo lực đẩy tiến thẳng tắp mà không gây mô-men lật nghiêng thân, gắn với phiến xương đuôi hypural khỏe.",
    descEn:
      "Symmetric homocercal tail fin driven by reinforced hypural plates, producing pure forward thrust with zero parasitic pitching moment.",
    medicalData: {
      weightEstimate: "~3.5% thể trọng",
      functionVi: "Tạo hơn 70% lực đẩy bơi tiến nhờ dao động tần số cao",
      functionEn:
        "Generates >70% forward propulsive thrust via high-frequency oscillation",
      medicalUseVi:
        "Bộ đẩy mái chèo dao động phỏng sinh học hiệu suất cao cho tàu thủy sinh thái.",
      medicalUseEn:
        "Biomimetic oscillating foil propulsors with reduced wake turbulence.",
      source: "Journal of Fluid Mechanics: Fish Propulsion",
    },
    medicalUseVi:
      "Bộ đẩy mái chèo dao động phỏng sinh học hiệu suất cao cho tàu thủy sinh thái.",
    medicalUseEn:
      "Biomimetic oscillating foil propulsors with reduced wake turbulence.",
  },
  {
    id: "ost_skeleton",
    nameVi: "Bộ xương cốt hóa & Cột sống",
    nameEn: "Ossified Skull, Spine & Ribs",
    labelVi: "Khung xương cứng",
    labelEn: "Ossified Skeleton",
    sys: "skeletal",
    system: "Khung xương cốt hóa",
    latinName: "Osteocranium et Columna vertebralis ossificata",
    origin: [500, 215],
    plateCoords: [50, 48],
    vector: [0, 0],
    laser: false,
    color: "#06b6d4",
    descVi:
      "Khung xương vôi hóa cứng cáp với hộp sọ xương phức tạp neurocranium, cột sống gồm hàng chục đốt sống xương cứng có xương sườn bảo vệ nội tạng và các gai nâng đỡ vây.",
    descEn:
      "Fully ossified rigid skeletal frame comprising intricate neurocranium, biconcave vertebrae, pleural ribs, and intermuscular bones.",
    medicalData: {
      weightEstimate: "~12.5% thể trọng",
      functionVi:
        "Trục nâng đỡ cơ thể chịu lực uốn gập khi bơi tốc độ cao, điểm tựa cơ myotome",
      functionEn:
        "Structural mechanical chassis resisting bending loads and anchoring myotome musculature",
      medicalUseVi:
        "Vật liệu canxi phosphat sinh học và gốm xốp hydroxyapatite tương thích sinh học phục vụ cấy ghép xương.",
      medicalUseEn:
        "Natural hydroxyapatite bioceramics for porous bone defect grafting.",
      source: "Biomaterials & Bone Biomechanics",
    },
    medicalUseVi:
      "Vật liệu canxi phosphat sinh học và gốm xốp hydroxyapatite tương thích sinh học phục vụ cấy ghép xương.",
    medicalUseEn:
      "Natural hydroxyapatite bioceramics for porous bone defect grafting.",
  },
];

export const CEPHALOPOD_PARTS = [
  {
    id: "cep_mantle",
    nameVi: "Lớp áo cơ bắp & Tế bào sắc tố",
    nameEn: "Muscular Mantle & Chromatophores",
    labelVi: "Lớp áo & Sắc tố",
    labelEn: "Mantle & Pigments",
    sys: "muscular",
    system: "Bảo vệ và tàng hình",
    latinName: "Pallium musculare et Chromatophora",
    origin: [500, 130],
    plateCoords: [65, 20],
    vector: [0, -125],
    laser: true,
    color: "#2dd4bf",
    descVi:
      "Túi cơ bắp dày co bóp đàn hồi bảo vệ toàn bộ khối nội tạng, phủ hàng triệu tế bào sắc tố chromatophore và iridophore đổi màu tàng hình trong 200 mili-giây, co bóp đẩy nước tạo lực phản lực.",
    descEn:
      "Thick muscular dome enclosing visceral organs, studded with millions of neuro-controlled chromatophores and iridophores enabling sub-second camouflage and hydrodynamic mantle contraction.",
    medicalData: {
      weightEstimate: "~32% thể trọng",
      functionVi:
        "Bảo vệ khối nội tạng, ngụy trang thích ứng tức thì và tạo xung lực bơi phản lực",
      functionEn:
        "Visceral protection, dynamic camouflage metamaterials, and jet-propulsion pumping",
      medicalUseVi:
        "Màng phủ phỏng sinh học biến đổi màu sắc quang học tức thời và vật liệu elastomer co giãn đàn hồi nhân tạo.",
      medicalUseEn:
        "Biomimetic optoelectronic camouflage skins and artificial muscle electroactive polymers.",
      source: "Nature Materials: Cephalopod Dynamic Camouflage",
    },
    medicalUseVi:
      "Màng phủ phỏng sinh học biến đổi màu sắc quang học tức thời và vật liệu elastomer co giãn đàn hồi nhân tạo.",
    medicalUseEn:
      "Biomimetic optoelectronic camouflage skins and artificial muscle electroactive polymers.",
  },
  {
    id: "cep_arms_suckers",
    nameVi: "8 Tay xúc tu & Hàng trăm giác hút",
    nameEn: "8 Prehensile Arms & Autonomous Suckers",
    labelVi: "8 Tay xúc tu",
    labelEn: "8 Suckered Arms",
    sys: "muscular",
    system: "Vận động và xúc giác",
    latinName: "Brachia octo et Acetabula",
    origin: [500, 360],
    plateCoords: [28, 65],
    vector: [0, 95],
    laser: true,
    color: "#06b6d4",
    descVi:
      "8 cánh tay cơ bắp linh hoạt không xương với hơn 2,000 giác hút chứa thụ thể hóa học nếm vị và cảm giác xúc giác, chứa 2/3 tổng số nơ-ron thần kinh hoạt động bán tự chủ.",
    descEn:
      "Eight highly articulated hydrostatic appendages armed with chemosensory suckers, containing two-thirds of the peripheral nervous system for distributed autonomous decision-making.",
    medicalData: {
      weightEstimate: "~42% thể trọng",
      functionVi:
        "Bò bám đáy biển, bắt mồi chuẩn xác, nếm vị giác và xử lý vận động phân tán",
      functionEn:
        "Substrate locomotion, prey capture, chemical tasting, and distributed motor autonomy",
      medicalUseVi:
        "Cánh tay robot mềm phỏng sinh học đa bậc tự do cho phẫu thuật nội soi vi mô không tổn thương mô.",
      medicalUseEn:
        "Bio-inspired soft robotic manipulators with infinite degrees of freedom for minimally invasive surgery.",
      source: "Science Robotics: Cephalopod Soft Actuators",
    },
    medicalUseVi:
      "Cánh tay robot mềm phỏng sinh học đa bậc tự do cho phẫu thuật nội soi vi mô không tổn thương mô.",
    medicalUseEn:
      "Bio-inspired soft robotic manipulators with infinite degrees of freedom for minimally invasive surgery.",
  },
  {
    id: "cep_siphon",
    nameVi: "Ống phễu đẩy nước phản lực Siphon",
    nameEn: "Hydrodynamic Funnel Siphon",
    labelVi: "Ống phễu Siphon",
    labelEn: "Funnel Siphon",
    sys: "muscular",
    system: "Phản lực thủy động",
    latinName: "Infundibulum siphonale",
    origin: [405, 275],
    plateCoords: [47, 40],
    vector: [-85, 50],
    laser: true,
    color: "#38bdf8",
    descVi:
      "Ống cơ bắp định hướng 360 độ điều tiết dòng nước áp suất cao tống ra từ khoang áo, cho phép bạch tuộc phóng nhanh với gia tốc cực lớn và đổi hướng tức thì.",
    descEn:
      "Omnidirectional muscular nozzle expelling pressurized water from the mantle cavity, producing explosive jet propulsion and precision vector steering.",
    medicalData: {
      weightEstimate: "~4.5% thể trọng",
      functionVi:
        "Tạo lực đẩy phản lực tốc độ cao và xả mực tự vệ làm mù giác quan kẻ thù",
      functionEn:
        "High-velocity hydro-jet propulsion and defensive ink smoke deployment",
      medicalUseVi:
        "Đầu phun đẩy phản lực vi lưu và van điều hướng dòng chảy thủy lực cho thiết bị lặn thám hiểm biển sâu.",
      medicalUseEn:
        "Microfluidic thrust-vectoring nozzles and pulse-jet thrusters for deep-sea submersibles.",
      source: "Journal of Experimental Biology: Jet Dynamics",
    },
    medicalUseVi:
      "Đầu phun đẩy phản lực vi lưu và van điều hướng dòng chảy thủy lực cho thiết bị lặn thám hiểm biển sâu.",
    medicalUseEn:
      "Microfluidic thrust-vectoring nozzles and pulse-jet thrusters for deep-sea submersibles.",
  },
  {
    id: "cep_three_hearts",
    nameVi: "Hệ tuần hoàn 3 Quả Tim & Máu xanh",
    nameEn: "Three Hearts System & Blue Blood",
    labelVi: "Hệ 3 Quả Tim",
    labelEn: "Three Hearts",
    sys: "circulatory",
    system: "Hệ tuần hoàn kín",
    latinName: "Cor systematis et Corda branchialia",
    origin: [500, 180],
    plateCoords: [68, 26],
    vector: [0, -35],
    laser: true,
    color: "#3b82f6",
    descVi:
      "Gồm một tim chính bơm máu đi khắp cơ thể và hai tim mang phụ bơm máu áp lực cao qua mang. Máu bạch tuộc có màu xanh lam do sắc tố vận chuyển oxy gốc đồng hemocyanin hiệu quả cao trong nước lạnh thiếu khí.",
    descEn:
      "Closed tri-pump circulatory network: a central systemic heart powering somatic tissues and paired branchial hearts boosting perfusion across the gills with copper-based blue hemocyanin blood.",
    medicalData: {
      weightEstimate: "~1.8% thể trọng",
      functionVi:
        "Duy trì huyết áp tuần hoàn kín ổn định và vận chuyển oxy ở nhiệt độ biển sâu gần đóng băng",
      functionEn:
        "Maintains closed high-pressure circulation and cryogenic oxygen transport via hemocyanin",
      medicalUseVi:
        "Chất mang oxy sinh học gốc hemocyanin chống đông máu và thiết bị trợ tim vi lưu đa buồng co bóp độc lập.",
      medicalUseEn:
        "Hemocyanin-based oxygen therapeutic carriers and synchronized multi-chamber micro-pumps.",
      source: "Physiological and Biochemical Zoology",
    },
    medicalUseVi:
      "Chất mang oxy sinh học gốc hemocyanin chống đông máu và thiết bị trợ tim vi lưu đa buồng co bóp độc lập.",
    medicalUseEn:
      "Hemocyanin-based oxygen therapeutic carriers and synchronized multi-chamber micro-pumps.",
  },
  {
    id: "cep_ctenidia",
    nameVi: "Đôi cung mang lông chim Ctenidia",
    nameEn: "Paired Feathery Ctenidia Gills",
    labelVi: "Đôi cung mang",
    labelEn: "Ctenidia Gills",
    sys: "respiratory",
    system: "Hệ hô hấp",
    latinName: "Ctenidia branchialia",
    origin: [430, 165],
    plateCoords: [73, 22],
    vector: [-65, -25],
    laser: true,
    color: "#38bdf8",
    descVi:
      "Hai phiến mang cấu trúc lông vũ đối xứng nằm trong khoang áo, trao đổi khí ngược dòng hiệu suất tới 80% lượng oxy hòa tan trong nước biển.",
    descEn:
      "Paired bipectinate feathery gill plumes within the mantle cavity utilizing counter-current gas exchange to extract up to 80% of dissolved oceanic oxygen.",
    medicalData: {
      weightEstimate: "~2.4% thể trọng",
      functionVi:
        "Trao đổi khí oxy và CO2 hiệu suất cao trong môi trường nước thiếu khí",
      functionEn:
        "High-efficiency counter-current respiratory gas exchange in hypoxic environments",
      medicalUseVi:
        "Màng trao đổi khí mao dẫn vi mô chống đóng cặn sinh học trong máy tim phổi nhân tạo ECMO.",
      medicalUseEn:
        "Anti-fouling micro-capillary gas exchange membranes for artificial lung ECMO devices.",
      source: "Comparative Biochemistry and Physiology",
    },
    medicalUseVi:
      "Màng trao đổi khí mao dẫn vi mô chống đóng cặn sinh học trong máy tim phổi nhân tạo ECMO.",
    medicalUseEn:
      "Anti-fouling micro-capillary gas exchange membranes for artificial lung ECMO devices.",
  },
  {
    id: "cep_ink_sac",
    nameVi: "Túi mực phòng thủ Melanin",
    nameEn: "Melanin Defense Ink Sac",
    labelVi: "Túi mực",
    labelEn: "Ink Sac",
    sys: "digestive",
    system: "Tự vệ sinh học",
    latinName: "Vesica atramenti",
    origin: [535, 185],
    plateCoords: [60, 26],
    vector: [85, 45],
    laser: true,
    color: "#6366f1",
    descVi:
      "Tuyến dự trữ chất lỏng melanin đậm đặc kết hợp enzyme tyrosinase có khả năng gây tê liệt khứu giác và thị giác của kẻ săn mồi, tạo màn khói đánh lạc hướng tẩu thoát.",
    descEn:
      "Alkaloid gland storing dense melanin suspension enriched with tyrosinase enzymes that impair predator olfactory and visual tracking, providing a tactical escape smoke screen.",
    medicalData: {
      weightEstimate: "~1.5% thể trọng",
      functionVi:
        "Tạo màn khói quang học và làm tê liệt thụ thể khứu giác của cá săn mồi",
      functionEn:
        "Deploys visual decoy smoke screens and temporarily numbs predatory chemoreceptors",
      medicalUseVi:
        "Hạt nano melanin sinh học tự nhiên hấp thụ tia bức xạ, ứng dụng trong che chắn quang học và dẫn thuốc trúng đích.",
      medicalUseEn:
        "Natural biogenic melanin nanoparticles for photothermal tumor ablation and radiation shielding.",
      source: "ACS Nano: Cephalopod Melanin Nanomaterials",
    },
    medicalUseVi:
      "Hạt nano melanin sinh học tự nhiên hấp thụ tia bức xạ, ứng dụng trong che chắn quang học và dẫn thuốc trúng đích.",
    medicalUseEn:
      "Natural biogenic melanin nanoparticles for photothermal tumor ablation and radiation shielding.",
  },
  {
    id: "cep_brain_ring",
    nameVi: "Não vành khuyên & Sợi trục khổng lồ",
    nameEn: "Circum-Esophageal Ring Brain & Giant Axons",
    labelVi: "Não vành khuyên",
    labelEn: "Ring Brain",
    sys: "nervous",
    system: "Hệ thần kinh trung ương",
    latinName: "Encephalon annulare et Axona gigantia",
    origin: [500, 245],
    plateCoords: [54, 27],
    vector: [-55, -65],
    laser: true,
    color: "#f59e0b",
    descVi:
      "Bộ não hình vành khuyên ôm trọn ống dẫn thức ăn được bao bọc trong hộp sọ sụn, kết hợp các sợi trục thần kinh khổng lồ giant axons dẫn truyền xung điện vận tốc tới 25 m/s.",
    descEn:
      "Donut-shaped brain encircling the esophagus enclosed within a cartilaginous capsule, connecting to giant axons transmitting reflex signals at 25 m/s.",
    medicalData: {
      weightEstimate: "~0.7% thể trọng",
      functionVi:
        "Điều phối thị giác, nhận thức không gian, giải quyết câu đố và kiểm soát xúc giác phân tán",
      functionEn:
        "Coordinates visual-tactile integration, spatial learning, tool use, and camouflage logic",
      medicalUseVi:
        "Nền tảng thần kinh học kinh điển của y học hiện đại nghiên cứu điện thế hoạt động sợi trục và trí tuệ nhân tạo phi tập trung.",
      medicalUseEn:
        "Classical neurophysiological model for nerve action potentials and edge AI distributed processing.",
      source: "Cell: Cephalopod Neural Architecture",
    },
    medicalUseVi:
      "Nền tảng thần kinh học kinh điển của y học hiện đại nghiên cứu điện thế hoạt động sợi trục và trí tuệ nhân tạo phi tập trung.",
    medicalUseEn:
      "Classical neurophysiological model for nerve action potentials and edge AI distributed processing.",
  },
  {
    id: "cep_eyes",
    nameVi: "Cặp mắt quang học không điểm mù",
    nameEn: "Camera Eyes Zero Blind Spot",
    labelVi: "Mắt quang học",
    labelEn: "Camera Eyes",
    sys: "nervous",
    system: "Hệ giác quan",
    latinName: "Oculi camerae",
    origin: [395, 250],
    plateCoords: [56, 31],
    vector: [-85, -20],
    laser: true,
    color: "#fbbf24",
    descVi:
      "Tiến hóa hội tụ với mắt người nhưng vượt trội hơn nhờ tế bào cảm quang hướng ra phía trước, loại bỏ hoàn toàn điểm mù, đồng tử ngang điều chỉnh độ sâu trường ảnh và cảm thụ phân cực ánh sáng.",
    descEn:
      "Sophisticated camera-type eyes with zero blind spots due to outward-facing photoreceptors, featuring horizontal slit pupils and advanced linear polarization vision.",
    medicalData: {
      weightEstimate: "~1.2% thể trọng",
      functionVi:
        "Thị giác độ phân giải cao toàn cảnh và phát hiện mục tiêu tàng hình qua ánh sáng phân cực",
      functionEn:
        "High-contrast panoramic imaging and polarized light detection of transparent prey",
      medicalUseVi:
        "Cảm biến thị giác phân cực chống chói dưới biển sâu và camera phỏng sinh học trường ảnh siêu rộng.",
      medicalUseEn:
        "Bio-inspired polarimetric underwater navigation sensors and wide-field optical cameras.",
      source: "Nature Photonics: Polarization Cephalopod Vision",
    },
    medicalUseVi:
      "Cảm biến thị giác phân cực chống chói dưới biển sâu và camera phỏng sinh học trường ảnh siêu rộng.",
    medicalUseEn:
      "Bio-inspired polarimetric underwater navigation sensors and wide-field optical cameras.",
  },
  {
    id: "cep_beak_radula",
    nameVi: "Mỏ vẹt Chitin & Lưỡi bào Radula",
    nameEn: "Chitinous Beak & Raspy Radula",
    labelVi: "Mỏ vẹt & Lưỡi bào",
    labelEn: "Beak & Radula",
    sys: "digestive",
    system: "Cơ quan cắn xé mồi",
    latinName: "Rostrum chitinicum et Radula",
    origin: [500, 290],
    plateCoords: [50, 48],
    vector: [0, 55],
    laser: true,
    color: "#f43f5e",
    descVi:
      "Bộ phận cứng duy nhất của cơ thể, gồm hai mảnh mỏ chitin ngậm chặt nhau cứng như đá kết hợp tuyến nước bọt tiết độc tố cephalotoxin làm tê liệt con mồi.",
    descEn:
      "The only rigid structure in the body, composed of highly cross-linked chitin and proteins delivering devastating bite force coupled with paralyzing cephalotoxin secretions.",
    medicalData: {
      weightEstimate: "~0.9% thể trọng",
      functionVi:
        "Nghiền nát vỏ giáp xác cứng cáp và tiêm enzyme tiêu hóa sơ bộ vào con mồi",
      functionEn:
        "Crushes heavily armored crustacean carapaces and delivers neurotoxic digestive enzymes",
      medicalUseVi:
        "Vật liệu sinh học chuyển tiếp độ cứng biến thiên liên tục từ mềm sang cực cứng không gây nứt gãy cơ học.",
      medicalUseEn:
        "Biomimetic gradient-stiffness composites for fracture-resistant surgical implants.",
      source: "Science: Mechanical Gradient in Squid Beaks",
    },
    medicalUseVi:
      "Vật liệu sinh học chuyển tiếp độ cứng biến thiên liên tục từ mềm sang cực cứng không gây nứt gãy cơ học.",
    medicalUseEn:
      "Biomimetic gradient-stiffness composites for fracture-resistant surgical implants.",
  },
  {
    id: "cep_digestive_gland",
    nameVi: "Khối gan tụy & Dạ dày tiêu hóa",
    nameEn: "Digestive Hepatopancreas & Gastric Sac",
    labelVi: "Gan tụy & Dạ dày",
    labelEn: "Digestive Gland",
    sys: "digestive",
    system: "Hệ tiêu hóa",
    latinName: "Hepatopancreas et Ventriculus",
    origin: [500, 110],
    plateCoords: [66, 14],
    vector: [70, -45],
    laser: true,
    color: "#10b981",
    descVi:
      "Tuyến tiêu hóa lớn màu nâu hổ phách đóng vai trò vừa là gan lọc độc vừa là tụy tiết enzyme phân giải nhanh protein và lipid vỏ giáp xác.",
    descEn:
      "Large bilobed metabolic organ fulfilling combined hepatic and pancreatic functions, producing robust proteolytic enzymes that liquefy prey tissue.",
    medicalData: {
      weightEstimate: "~6.8% thể trọng",
      functionVi:
        "Tiết dịch enzyme phân giải thịt cua ốc và lưu trữ năng lượng lipid glycogen",
      functionEn:
        "Enzymatic liquefaction of crustacean meat and central energy storage",
      medicalUseVi:
        "Enzyme phân giải protein biển sâu hoạt tính cao ở nhiệt độ thấp cho công nghệ sinh học xử lý vết thương.",
      medicalUseEn:
        "Cold-active marine proteolytic enzymes for gentle wound debridement in clinical care.",
      source: "Marine Biotechnology: Cephalopod Enzymes",
    },
    medicalUseVi:
      "Enzyme phân giải protein biển sâu hoạt tính cao ở nhiệt độ thấp cho công nghệ sinh học xử lý vết thương.",
    medicalUseEn:
      "Cold-active marine proteolytic enzymes for gentle wound debridement in clinical care.",
  },
];

export const TURTLE_PARTS = [
  {
    id: "tur_carapace",
    nameVi: "Mai rùa xương giáp & Tấm sừng",
    nameEn: "Bony Carapace & Keratin Scutes",
    labelVi: "Mai rùa giáp",
    labelEn: "Bony Carapace",
    sys: "skeletal",
    system: "Bảo vệ & Khung xương giáp",
    latinName: "Carapax osseus et scuta cornea",
    origin: [500, 240],
    plateCoords: [50, 50],
    vector: [0, -65],
    color: "#10b981",
    descVi:
      "Vỏ giáp lưng tạo thành từ sự hợp nhất của khoảng 50 xương (bao gồm xương sườn và đốt sống biến đổi) phủ ngoài bởi các tấm sừng keratin xếp lớp hình học đối xứng, chịu lực nén áp suất nước sâu và va chạm ngoại lực.",
    descEn:
      "Dorsal carapace formed by the fusion of ~50 modified bones (ribs and vertebrae) overlaid with keratinous scutes, optimized for deep hydro-static pressure resistance.",
    medicalData: {
      weightEstimate: "~28% thể trọng",
      functionVi: "Bảo vệ toàn diện cơ quan nội tạng và chịu lực nén cơ học cực đại",
      functionEn: "Complete visceral defense and high-pressure structural resistance",
      medicalUseVi:
        "Vật liệu composite sinh học chống đạn nhẹ và cấu trúc giáp bảo vệ xe tự hành dưới đáy biển sâu.",
      medicalUseEn:
        "Bio-inspired lightweight impact-resistant composites for deep-sea submersibles.",
      source: "Marine Turtle Biology & Biomechanics",
    },
    medicalUseVi:
      "Vật liệu composite sinh học chống đạn nhẹ và cấu trúc giáp bảo vệ xe tự hành dưới đáy biển sâu.",
    medicalUseEn:
      "Bio-inspired lightweight impact-resistant composites for deep-sea submersibles.",
  },
  {
    id: "tur_plastron",
    nameVi: "Yếm giáp bụng (Plastron)",
    nameEn: "Ventral Plastron",
    labelVi: "Yếm bụng",
    labelEn: "Plastron",
    sys: "skeletal",
    system: "Bảo vệ & Khung bụng",
    latinName: "Plastron ventrale",
    origin: [500, 260],
    plateCoords: [50, 56],
    vector: [0, 68],
    color: "#f59e0b",
    descVi:
      "Mặt giáp phẳng phía bụng cấu thành từ 9 xương dẹt hợp nhất (xương đòn, gian đòn và xương bụng), liên kết với mai lưng qua cầu xương bên hông (bridge) tạo thành khoang bảo vệ khép kín.",
    descEn:
      "Rigid ventral shield formed from nine fused flat bones connected to the carapace via lateral bony bridges, providing hydrodynamic shielding.",
    medicalData: {
      weightEstimate: "~16% thể trọng",
      functionVi: "Bảo vệ ổ bụng dưới đáy và hỗ trợ giảm lực cản ma sát khi lướt sóng",
      functionEn: "Ventral protection and ventral flow lamina stabilization",
      medicalUseVi:
        "Nghiên cứu cấu trúc tấm đệm phân tán lực áp suất trong thiết bị y tế cấy ghép xương ngực.",
      medicalUseEn:
        "Pressure-dissipating laminar plate designs for sternal implants.",
      source: "Comparative Chelonian Morphology",
    },
    medicalUseVi:
      "Nghiên cứu cấu trúc tấm đệm phân tán lực áp suất trong thiết bị y tế cấy ghép xương ngực.",
    medicalUseEn:
      "Pressure-dissipating laminar plate designs for sternal implants.",
  },
  {
    id: "tur_flippers_fore",
    nameVi: "Chi bơi trước hình mái chèo",
    nameEn: "Hydrodynamic Fore-Flippers",
    labelVi: "Mái chèo trước",
    labelEn: "Fore-Flippers",
    sys: "muscular",
    system: "Vận động & Lực đẩy thủy động",
    latinName: "Pinnae natatoriae anteriores",
    origin: [500, 185],
    plateCoords: [50, 38],
    vector: [0, -35],
    color: "#06b6d4",
    descVi:
      "Xương bàn tay và ngón tay kéo dài thành dạng cánh chim ngầm (hydrofoil), cơ đai vai mạnh mẽ giúp rùa biển 'bay' lướt dưới nước với lực đẩy liên tục trong cả chu kỳ đập cánh lên và xuống.",
    descEn:
      "Elongated phalanges forming underwater wings (hydrofoils), providing continuous propulsion on both upstroke and downstroke movements.",
    medicalData: {
      weightEstimate: "~12% thể trọng",
      functionVi: "Tạo lực đẩy khí động ngầm và định hướng hải lưu xuyên đại dương",
      functionEn: "Underwater wing lift and trans-oceanic navigation steering",
      medicalUseVi:
        "Cơ cấu cánh đẩy dao động phỏng sinh học cho robot lặn thám hiểm đại dương hiệu suất cao.",
      medicalUseEn:
        "Biomimetic oscillating foil propulsion for long-endurance autonomous marine vehicles.",
      source: "Journal of Experimental Biology: Sea Turtle Locomotion",
    },
    medicalUseVi:
      "Cơ cấu cánh đẩy dao động phỏng sinh học cho robot lặn thám hiểm đại dương hiệu suất cao.",
    medicalUseEn:
      "Biomimetic oscillating foil propulsion for long-endurance autonomous marine vehicles.",
  },
  {
    id: "tur_flippers_hind",
    nameVi: "Chi bơi sau điều hướng",
    nameEn: "Steering Hind-Flippers",
    labelVi: "Chi sau & Bánh lái",
    labelEn: "Hind-Flippers",
    sys: "muscular",
    system: "Điều hướng & Đào tổ sinh sản",
    latinName: "Pinnae natatoriae posteriores",
    origin: [500, 330],
    plateCoords: [50, 72],
    vector: [0, 48],
    color: "#3b82f6",
    descVi:
      "Chi sau ngắn bè rộng hoạt động như bánh lái đuôi máy bay, giúp bẻ cua ngoạn mục và đóng vai trò đào hố cát sâu đẻ trứng ở rùa cái trong mùa sinh sản.",
    descEn:
      "Shorter, paddle-like hind limbs serving as directional rudders for turning and stabilizing, and used by females to excavate sand nests.",
    medicalData: {
      weightEstimate: "~5% thể trọng",
      functionVi: "Kiểm soát góc nghiêng (pitch) và độ xoay (yaw) khi lặn",
      functionEn: "Pitch and yaw hydrodynamic trim control",
      medicalUseVi:
        "Thiết kế bánh lái vi mô cơ động cho thiết bị cứu nạn hàng hải dưới nước.",
      medicalUseEn:
        "Agile micro-rudder control mechanisms for underwater rescue equipment.",
      source: "Reptilian Locomotor Dynamics",
    },
    medicalUseVi:
      "Thiết kế bánh lái vi mô cơ động cho thiết bị cứu nạn hàng hải dưới nước.",
    medicalUseEn:
      "Agile micro-rudder control mechanisms for underwater rescue equipment.",
  },
  {
    id: "tur_skull",
    nameVi: "Hộp sọ & Mỏ sừng rhamphotheca",
    nameEn: "Anapsid Skull & Keratin Beak",
    labelVi: "Hộp sọ & Mỏ",
    labelEn: "Skull & Beak",
    sys: "skeletal",
    system: "Thần kinh & Tiếp nhận thức ăn",
    latinName: "Cranium et rhamphotheca",
    origin: [500, 85],
    plateCoords: [50, 18],
    vector: [0, -40],
    color: "#e2e8f0",
    descVi:
      "Hộp sọ đặc kiểu không hốc thái dương (anapsid) cực kỳ vững chắc, mỏ sừng sắc bén không có răng giúp cắn xé cỏ biển, sứa hoặc nghiền nát vỏ động vật giáp xác dễ dàng.",
    descEn:
      "Rigid anapsid skull with heavy bony arches and sharp keratinized beak (rhamphotheca) lacking teeth, specialized for shearing seagrass and crustaceans.",
    medicalData: {
      weightEstimate: "~6.2% thể trọng",
      functionVi: "Lực cắn xé mạnh mẽ và bảo vệ trung tâm thần kinh não bộ",
      functionEn: "High-shear bite force and encephalic neural protection",
      medicalUseVi:
        "Vật liệu vi cấu trúc keratin tự mài sắc ứng dụng trong dụng cụ phẫu thuật cắt mô mềm.",
      medicalUseEn:
        "Self-sharpening keratinous microstructures for precision soft-tissue surgical instruments.",
      source: "Anatomy of Sea Turtles: NMFS NOAA Technical Memo",
    },
    medicalUseVi:
      "Vật liệu vi cấu trúc keratin tự mài sắc ứng dụng trong dụng cụ phẫu thuật cắt mô mềm.",
    medicalUseEn:
      "Self-sharpening keratinous microstructures for precision soft-tissue surgical instruments.",
  },
  {
    id: "tur_lungs",
    nameVi: "Phổi bò sát dung tích lớn",
    nameEn: "High-Capacity Marine Lungs",
    labelVi: "Phổi lặn sâu",
    labelEn: "Lungs",
    sys: "respiratory",
    system: "Hô hấp & Khí phế quản",
    latinName: "Pulmones spongiosi testudinum",
    origin: [500, 215],
    plateCoords: [50, 44],
    vector: [0, -22],
    color: "#f43f5e",
    descVi:
      "Hai lá phổi xốp nhiều buồng nằm bám sát bên dưới vòm mai lưng. Cấu trúc đàn hồi cao cho phép trao đổi oxy nhanh trên mặt nước và chịu nén khi rùa biển lặn sâu hàng trăm mét trong hơn 5 giờ liên tục.",
    descEn:
      "Multi-chambered spongy lungs attached directly beneath the carapace, highly compliant to resist alveolar collapse during dives exceeding 5 hours.",
    medicalData: {
      weightEstimate: "~4.5% thể trọng",
      functionVi: "Trao đổi 85% thể tích khí trong một lần thở và điều chỉnh độ nổi",
      functionEn: "85% tidal air volume exchange per breath and buoyancy trim",
      medicalUseVi:
        "Nghiên cứu cơ chế trao đổi khí cao tốc cho máy thở hồi sức cấp cứu dung tích nhỏ.",
      medicalUseEn:
        "High-efficiency rapid alveolar gas exchange for compact emergency ventilators.",
      source: "Physiological and Biochemical Zoology: Marine Turtle Respiration",
    },
    medicalUseVi:
      "Nghiên cứu cơ chế trao đổi khí cao tốc cho máy thở hồi sức cấp cứu dung tích nhỏ.",
    medicalUseEn:
      "High-efficiency rapid alveolar gas exchange for compact emergency ventilators.",
  },
  {
    id: "tur_heart",
    nameVi: "Tim 3 ngăn & Quai động mạch thích nghi lặn",
    nameEn: "Three-Chambered Shunting Heart",
    labelVi: "Tim 3 ngăn",
    labelEn: "Three-Chamber Heart",
    sys: "circulatory",
    system: "Tuần hoàn & Điều tiết áp lực",
    latinName: "Cor triloculare cum septo interventriculari",
    origin: [500, 245],
    plateCoords: [50, 52],
    vector: [0, 18],
    color: "#ef4444",
    descVi:
      "Tim gồm 2 tâm nhĩ và 1 tâm thất có vách ngăn chưa hoàn chỉnh. Khi lặn sâu, cơ tim kích hoạt cơ chế rẽ nhánh máu (intracardiac shunt) bỏ qua vòng tuần hoàn phổi để dồn máu giàu oxy nuôi não và cơ tim, giảm nhịp tim xuống chỉ 1-2 nhịp/phút.",
    descEn:
      "Three-chambered heart with an incomplete ventricular septum that shunts blood away from lungs during deep dives, dropping bradycardic heart rate to 1-2 bpm.",
    medicalData: {
      weightEstimate: "~1.8% thể trọng",
      functionVi: "Cơ chế rẽ nhánh máu bảo tồn oxy não và nhịp tim chậm sinh lý (bradycardia)",
      functionEn: "Intracardiac oxygen shunting and extreme physiological bradycardia",
      medicalUseVi:
        "Liệu pháp điều trị thiếu máu cục bộ cơ tim và hồi sức ngừng tuần hoàn hạ thân nhiệt.",
      medicalUseEn:
        "Therapeutic myocardial ischemia preservation and targeted hypothermic resuscitation.",
      source: "Comparative Biochemistry and Physiology: Chelonian Hemodynamics",
    },
    medicalUseVi:
      "Liệu pháp điều trị thiếu máu cục bộ cơ tim và hồi sức ngừng tuần hoàn hạ thân nhiệt.",
    medicalUseEn:
      "Therapeutic myocardial ischemia preservation and targeted hypothermic resuscitation.",
  },
  {
    id: "tur_saltgland",
    nameVi: "Tuyến muối đào thải sau ổ mắt",
    nameEn: "Lachrymal Salt-Secreting Glands",
    labelVi: "Tuyến thải muối",
    labelEn: "Salt Glands",
    sys: "sensory",
    system: "Thẩm thấu & Bài tiết siêu lọc",
    latinName: "Glandula lachrymalis salina",
    origin: [500, 92],
    plateCoords: [50, 19],
    vector: [0, -70],
    color: "#a855f7",
    descVi:
      "Tuyến muối biến đổi từ tuyến lệ nằm phía sau hốc mắt, có kích thước to hơn cả não bộ. Tuyến này bơm bài tiết dung dịch muối cô đặc gấp đôi nồng độ nước biển (giải thích hiện tượng rùa cái 'khóc' khi lên bờ đẻ trứng).",
    descEn:
      "Enlarged lachrymal glands behind the orbits, twice the size of the brain, actively pumping out hyperosmotic brine twice as salty as seawater.",
    medicalData: {
      weightEstimate: "~0.9% thể trọng",
      functionVi: "Siêu lọc và bài tiết ion Na+/Cl- dư thừa giúp rùa uống nước biển trực tiếp",
      functionEn: "Active ionic hyper-filtration allowing direct seawater hydration",
      medicalUseVi:
        "Công nghệ màng lọc sinh học khử muối nano tiêu thụ năng lượng thấp cho lọc nước biển.",
      medicalUseEn:
        "Biomimetic low-energy nano-osmotic desalination membrane technologies.",
      source: "Journal of Comparative Physiology: Reptilian Osmoregulation",
    },
    medicalUseVi:
      "Công nghệ màng lọc sinh học khử muối nano tiêu thụ năng lượng thấp cho lọc nước biển.",
    medicalUseEn:
      "Biomimetic low-energy nano-osmotic desalination membrane technologies.",
  },
  {
    id: "tur_digestive",
    nameVi: "Thực quản gai nhọn & Hệ tiêu hóa",
    nameEn: "Papillated Esophagus & Viscera",
    labelVi: "Thực quản & Tiêu hóa",
    labelEn: "Digestive Tract",
    sys: "digestive",
    system: "Tiêu hóa & Chống trào ngược",
    latinName: "Esophagus papillatus et canalis alimentarius",
    origin: [500, 275],
    plateCoords: [50, 60],
    vector: [0, 42],
    color: "#eab308",
    descVi:
      "Thực quản lót hàng trăm gai nhọn keratin (esophageal papillae) chĩa ngược về dạ dày. Khi rùa tống lượng nước biển thừa ra khỏi miệng, các gai này giữ chặt sứa trơn trượt không bị trôi ra ngoài.",
    descEn:
      "Esophageal lining covered with hundreds of sharp, backward-pointing keratinized papillae that trap slippery jellyfish prey while expelling excess seawater.",
    medicalData: {
      weightEstimate: "~14% thể trọng",
      functionVi: "Bẫy con mồi trơn trượt, ép thoát nước biển và tiêu hóa chất xơ biển",
      functionEn: "Anti-reflux prey trapping, water expulsion, and marine cellulose digestion",
      medicalUseVi:
        "Cơ chế van một chiều chống trào ngược sinh học cho ống thông dạ dày và van tim nhân tạo.",
      medicalUseEn:
        "Anti-reflux biomimetic one-way valves for gastrointestinal catheters and prosthetic valves.",
      source: "Journal of Morphology: Sea Turtle Esophageal Anatomy",
    },
    medicalUseVi:
      "Cơ chế van một chiều chống trào ngược sinh học cho ống thông dạ dày và van tim nhân tạo.",
    medicalUseEn:
      "Anti-reflux biomimetic one-way valves for gastrointestinal catheters and prosthetic valves.",
  },
];

export const MAMMAL_PARTS = [
  {
    id: "mam_blubber",
    nameVi: "Lớp da thủy động học & Mỡ dưới da (Blubber)",
    nameEn: "Hydrodynamic Epidermis & Blubber Layer",
    labelVi: "Lớp da & Mỡ dày",
    labelEn: "Skin & Blubber",
    sys: "muscular",
    system: "Bảo vệ & Cách nhiệt hằng nhiệt",
    latinName: "Integumentum et panniculus adiposus",
    origin: [500, 230],
    plateCoords: [50, 48],
    vector: [0, -65],
    color: "#38bdf8",
    descVi:
      "Lớp biểu bì siêu mịn có các rãnh vi mô triệt tiêu xoáy cuộn nước kết hợp cùng lớp mỡ dày 5–8cm chứa mạng lưới collagen đàn hồi. Cấu trúc này cách nhiệt tuyệt đối trong nước biển lạnh, tích trữ năng lượng và tạo lực nổi tự nhiên.",
    descEn:
      "Ultra-smooth dermal ridge microstructures damping turbulence coupled with a 5-8cm dense collagen-lipid blubber layer providing thermoregulation and energy storage.",
    medicalData: {
      weightEstimate: "~22% thể trọng",
      functionVi: "Duy trì thân nhiệt 37°C ổn định và giảm ma sát thủy động học 15%",
      functionEn: "37°C homeothermy maintenance and 15% hydrodynamic drag reduction",
      medicalUseVi:
        "Vật liệu giả da đàn hồi giảm lực cản cho tàu ngầm và gel lipid y sinh điều trị vết thương bỏng sâu.",
      medicalUseEn:
        "Compliant drag-reducing coatings for submersibles and biomimetic lipid wound healing gels.",
      source: "Marine Mammal Physiology & Functional Morphology",
    },
    medicalUseVi:
      "Vật liệu giả da đàn hồi giảm lực cản cho tàu ngầm và gel lipid y sinh điều trị vết thương bỏng sâu.",
    medicalUseEn:
      "Compliant drag-reducing coatings for submersibles and biomimetic lipid wound healing gels.",
  },
  {
    id: "mam_melon",
    nameVi: "Cơ quan dưa trán & Định vị siêu âm (Melon)",
    nameEn: "Acoustic Melon & Echolocation Complex",
    labelVi: "Dưa trán Sonar",
    labelEn: "Acoustic Melon",
    sys: "sensory",
    system: "Thần kinh & Định vị sinh học",
    latinName: "Corpus adiposum melon",
    origin: [205, 205],
    plateCoords: [21, 42],
    vector: [-35, -35],
    color: "#a855f7",
    descVi:
      "Khối mô mỡ hình bầu dục nằm phía trước hộp sọ chứa các triglyceride và sáp ester đặc biệt với độ dốc khúc xạ âm thanh biến thiên. Nó hoạt động như một thấu kính hội tụ chùm sóng siêu âm định vị (echolocation) phát hiện con mồi xa hàng trăm mét.",
    descEn:
      "Lipid-rich dome anterior to skull acting as an acoustic lens that collimates ultrasonic clicks for spatial echolocation and prey imaging in murky depths.",
    medicalData: {
      weightEstimate: "~2.4% thể trọng",
      functionVi: "Hội tụ chùm sóng âm tần số 40-130 kHz tạo hình ảnh 3D môi trường",
      functionEn: "Acoustic beam collimation at 40-130 kHz for 3D sonic environment mapping",
      medicalUseVi:
        "Cảm biến đầu dò siêu âm y tế phân giải cực cao và thiết bị định vị sonar dưới nước độ chính xác nano.",
      medicalUseEn:
        "High-resolution acoustic metamaterial lenses for biomedical ultrasound imaging.",
      source: "Journal of the Acoustical Society of America: Cetacean Bioacoustics",
    },
    medicalUseVi:
      "Cảm biến đầu dò siêu âm y tế phân giải cực cao và thiết bị định vị sonar dưới nước độ chính xác nano.",
    medicalUseEn:
      "High-resolution acoustic metamaterial lenses for biomedical ultrasound imaging.",
  },
  {
    id: "mam_skeleton",
    nameVi: "Bộ khung xương có vú & Cột sống uốn lượn",
    nameEn: "Mammalian Axial Skeleton & Skull",
    labelVi: "Khung xương thú",
    labelEn: "Axial Skeleton",
    sys: "skeletal",
    system: "Nâng đỡ & Vận động trục dọc",
    latinName: "Skeleton axiale et cranium rostratum",
    origin: [500, 240],
    plateCoords: [50, 50],
    vector: [0, 0],
    color: "#e2e8f0",
    descVi:
      "Khung xương động vật có vú biến đổi cao độ: Hộp sọ có mỏ kéo dài (rostrum) với hàm răng nón đơn nhất; 7 đốt sống cổ hợp nhất giữ đầu ổn định; 60-70 đốt sống uốn sóng cơ học theo phương đứng tạo lực bơi.",
    descEn:
      "Modified mammalian skeleton with telescoping skull, fused cervical vertebrae for head stability, and 60-70 vertebrae driving powerful vertical dorso-ventral undulations.",
    medicalData: {
      weightEstimate: "~14.5% thể trọng",
      functionVi: "Chịu lực uốn cong cơ học dọc trục và chịu nén lồng ngực khi lặn sâu 500m",
      functionEn: "Sagittal flexion torque generation and thoracic compression compliance",
      medicalUseVi:
        "Thiết kế khớp nối cột sống nhân tạo linh hoạt chịu tải chu kỳ cao trong phẫu thuật chấn thương chỉnh hình.",
      medicalUseEn:
        "High-fatigue compliant spinal prosthetic joints for reconstructive orthopedics.",
      source: "Anatomy and Histology of the Bottlenose Dolphin",
    },
    medicalUseVi:
      "Thiết kế khớp nối cột sống nhân tạo linh hoạt chịu tải chu kỳ cao trong phẫu thuật chấn thương chỉnh hình.",
    medicalUseEn:
      "High-fatigue compliant spinal prosthetic joints for reconstructive orthopedics.",
  },
  {
    id: "mam_lungs",
    nameVi: "Hệ hô hấp phổi thú & Lỗ thở đỉnh đầu",
    nameEn: "High-Efficiency Lungs & Blowhole",
    labelVi: "Phổi & Lỗ thở",
    labelEn: "Lungs & Airway",
    sys: "respiratory",
    system: "Hô hấp & Thích nghi giảm áp",
    latinName: "Pulmones mammalis et spiraculum",
    origin: [380, 215],
    plateCoords: [38, 45],
    vector: [0, -28],
    color: "#f43f5e",
    descVi:
      "Phổi có phế nang gia cố vòng sụn sợi và cơ hoành nằm nghiêng. Cho phép xẹp phổi có kiểm soát khi lặn sâu để đẩy khí nito ra khỏi vùng trao đổi máu, triệt tiêu hoàn toàn chứng bệnh giảm áp (bends) chết người.",
    descEn:
      "Lungs reinforced with fibro-cartilaginous rings permitting controlled alveolar collapse at depth, shunting nitrogen away from capillaries to prevent decompression sickness.",
    medicalData: {
      weightEstimate: "~3.8% thể trọng",
      functionVi: "Trao đổi 90% thể tích khí trong 0.3 giây và chống thuyên tắc khí nito",
      functionEn: "90% tidal gas exchange in 0.3s and decompression sickness prevention",
      medicalUseVi:
        "Nghiên cứu cơ chế thông khí bảo vệ phổi và phòng ngừa thuyên tắc mạch trong y học lặn biển sâu.",
      medicalUseEn:
        "Atelectasis-resistant ventilator modes and hyperbaric decompression therapeutics.",
      source: "Experimental Biology: Cetacean Pulmonary Compliance",
    },
    medicalUseVi:
      "Nghiên cứu cơ chế thông khí bảo vệ phổi và phòng ngừa thuyên tắc mạch trong y học lặn biển sâu.",
    medicalUseEn:
      "Atelectasis-resistant ventilator modes and hyperbaric decompression therapeutics.",
  },
  {
    id: "mam_heart",
    nameVi: "Tim 4 ngăn hoàn chỉnh & Mạng Rete Mirabile",
    nameEn: "Four-Chambered Heart & Rete Mirabile",
    labelVi: "Tim 4 ngăn",
    labelEn: "Four-Chamber Heart",
    sys: "circulatory",
    system: "Tuần hoàn & Điều tiết áp lực lặn",
    latinName: "Cor quadricameratum cum rete mirabile",
    origin: [350, 245],
    plateCoords: [35, 51],
    vector: [0, 24],
    color: "#ef4444",
    descVi:
      "Trái tim 4 ngăn hoàn chỉnh của động vật có vú đẳng nhiệt với cơ tim thất trái dày đặc, kết hợp mạng lưới mạch máu kỳ diệu (Rete Mirabile) đóng vai trò bộ tích áp và đệm lưu lượng máu bảo vệ tim não khi nhịp tim giảm 50% trong nước sâu.",
    descEn:
      "Four-chambered homeothermic heart with massive left ventricle paired with extensive retia mirabilia acting as arterial shock absorbers during dive bradycardia.",
    medicalData: {
      weightEstimate: "~1.2% thể trọng",
      functionVi: "Tạo áp lực tuần hoàn hằng nhiệt và điều hòa lưu lượng động mạch não",
      functionEn: "Systemic pressure regulation and cerebral blood perfusion stabilization",
      medicalUseVi:
        "Cơ chế van tim nhân tạo đàn hồi cao và giải pháp bảo vệ tưới máu cơ tim sau ngừng tuần hoàn.",
      medicalUseEn:
        "High-compliance prosthetic heart valves and ischemic reperfusion protection protocols.",
      source: "Comparative Cardiovascular Dynamics: Marine Mammals",
    },
    medicalUseVi:
      "Cơ chế van tim nhân tạo đàn hồi cao và giải pháp bảo vệ tưới máu cơ tim sau ngừng tuần hoàn.",
    medicalUseEn:
      "High-compliance prosthetic heart valves and ischemic reperfusion protection protocols.",
  },
  {
    id: "mam_digestive",
    nameVi: "Dạ dày 3 ngăn & Ống tiêu hóa",
    nameEn: "Three-Chambered Stomach Complex",
    labelVi: "Dạ dày 3 ngăn",
    labelEn: "Digestive Complex",
    sys: "digestive",
    system: "Tiêu hóa & Hấp thu dưỡng chất",
    latinName: "Ventriculus trilocularis cetacei",
    origin: [470, 255],
    plateCoords: [47, 53],
    vector: [0, 45],
    color: "#eab308",
    descVi:
      "Dạ dày chia 3 buồng chuyên biệt: tiền dạ dày cơ học (Forestomach) nghiền cá và xương không cần nhai; dạ dày chính (Main stomach) tiết pepsin và acid cực mạnh; dạ dày môn vị (Pyloric stomach) dẫn vào tá tràng.",
    descEn:
      "Three-compartment stomach featuring a muscular forestomach for mechanical churning of unchewed whole fish, glandular main stomach, and tubular pyloric stomach.",
    medicalData: {
      weightEstimate: "~5.5% thể trọng",
      functionVi: "Nghiền nát và tiêu hóa toàn bộ con mồi gồm xương vảy cá trong môi trường acid mạnh",
      functionEn: "Rapid whole-prey bone demineralization and high-throughput enzymatic digestion",
      medicalUseVi:
        "Enzyme tiêu hóa đạm chịu acid cao ứng dụng trong công nghệ dược sinh học phân giải vi mô.",
      medicalUseEn:
        "Acid-tolerant proteolytic enzymes for biopharmaceutical peptide formulation.",
      source: "Marine Mammal Science: Cetacean Gastric Morphology",
    },
    medicalUseVi:
      "Enzyme tiêu hóa đạm chịu acid cao ứng dụng trong công nghệ dược sinh học phân giải vi mô.",
    medicalUseEn:
      "Acid-tolerant proteolytic enzymes for biopharmaceutical peptide formulation.",
  },
  {
    id: "mam_flippers",
    nameVi: "Vây ngực chi trước (Pectoral Flippers)",
    nameEn: "Forelimb Pectoral Flippers",
    labelVi: "Vây ngực (5 ngón)",
    labelEn: "Pectoral Flippers",
    sys: "muscular",
    system: "Vận động & Cánh lái thủy động",
    latinName: "Pinnae pectorales pentadactylae",
    origin: [340, 275],
    plateCoords: [34, 57],
    vector: [-15, 38],
    color: "#06b6d4",
    descVi:
      "Chi trước tiến hóa thành mái chèo thủy động học thuôn mượt. Bên trong lưu giữ đầy đủ cấu trúc xương chi 5 ngón tay (pentadactyl limb) của động vật có vú tổ tiên, liên kết cơ đai vai giúp điều chỉnh góc lái và phanh gấp.",
    descEn:
      "Streamlined steering hydrofoils retaining the complete ancestral pentadactyl limb bone structure (humerus, radius, ulna, and five finger rays) for agile maneuvering.",
    medicalData: {
      weightEstimate: "~3.1% thể trọng",
      functionVi: "Kiểm soát độ nghiêng lật (roll) và phanh thủy động học tức thời",
      functionEn: "Hydrodynamic roll control, turning moment generation, and braking",
      medicalUseVi:
        "Khung xương cánh vây nhân tạo linh hoạt cho tay gắp robot ngầm hoạt động dưới đáy biển.",
      medicalUseEn:
        "Articulated biomimetic flipper end-effectors for subsea manipulators.",
      source: "Evolutionary Morphology of Marine Mammal Limbs",
    },
    medicalUseVi:
      "Khung xương cánh vây nhân tạo linh hoạt cho tay gắp robot ngầm hoạt động dưới đáy biển.",
    medicalUseEn:
      "Articulated biomimetic flipper end-effectors for subsea manipulators.",
  },
  {
    id: "mam_flukes",
    nameVi: "Vây đuôi ngang & Cơ cuống đuôi (Flukes)",
    nameEn: "Horizontal Flukes & Caudal Peduncle",
    labelVi: "Vây đuôi ngang",
    labelEn: "Horizontal Flukes",
    sys: "muscular",
    system: "Lực đẩy động lực học chính",
    latinName: "Pinna caudalis horizontalis",
    origin: [820, 240],
    plateCoords: [82, 50],
    vector: [45, 0],
    color: "#10b981",
    descVi:
      "Vây đuôi nằm ngang cấu tạo hoàn toàn từ các thớ sợi collagen đặc không xương, liên kết với bó cơ lưng và cơ bụng khổng lồ qua gân cuống đuôi. Chuyển động đập lên xuống tạo lực đẩy khủng khiếp phóng cá heo vút lên không trung.",
    descEn:
      "Non-bony horizontal flukes composed of dense tough collagenous sheets driven by massive axial epaxial and hypaxial muscles, generating massive vertical thrust.",
    medicalData: {
      weightEstimate: "~8.2% thể trọng",
      functionVi: "Tạo lực đẩy chính đạt tốc độ bơi trên 50 km/h và phóng cao khỏi mặt nước",
      functionEn: "Primary propulsive thrust generating burst speeds exceeding 50 km/h",
      medicalUseVi:
        "Cánh đẩy dao động biến thiên tự thích ứng cho tàu cao tốc giảm tiêu hao năng lượng 20%.",
      medicalUseEn:
        "Self-adaptive oscillating hydrofoil thrusters for energy-efficient marine transport.",
      source: "Journal of Fluid Mechanics: Cetacean Fluke Hydrodynamics",
    },
    medicalUseVi:
      "Cánh đẩy dao động biến thiên tự thích ứng cho tàu cao tốc giảm tiêu hao năng lượng 20%.",
    medicalUseEn:
      "Self-adaptive oscillating hydrofoil thrusters for energy-efficient marine transport.",
  },
];
