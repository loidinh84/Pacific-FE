import { CREATURE_PNGS } from "../assets/creatures";
import * as Images from "../assets/Images";

export const SPECIES_DATA = [
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
    descVi: `Bạch tuộc khổng lồ (loài Enteroctopus dofleini) là một trong những loài bạch tuộc lớn nhất thế giới. Chúng sống chủ yếu ở vùng biển sâu, nổi tiếng với trí thông minh cao, khả năng giải quyết vấn đề và ngụy trang vi diệu.`,
    descEn: `The giant octopus (Enteroctopus dofleini) is one of the largest octopus species in the world. Inhabiting deep ocean waters, they are renowned for high intelligence, problem-solving skills, and remarkable camouflage abilities.`,
    reverse: true,
    aos: "fade-left",
  },
];

export const CATEGORIES_DATA = [
  { value: "", labelVi: "Tất cả nhóm sinh vật", labelEn: "All Species Groups" },
  { value: "ca-bien", labelVi: "Cá biển", labelEn: "Marine Fishes" },
  { value: "dong-vat-co-vu-bien", labelVi: "Động vật có vú biển", labelEn: "Marine Mammals" },
  { value: "bo-sat-bien", labelVi: "Bò sát biển", labelEn: "Marine Reptiles" },
  { value: "than-mem-khong-xuong-song", labelVi: "Thân mềm & Không xương sống", labelEn: "Mollusks & Invertebrates" },
  { value: "san-ho-thuc-vat-bien", labelVi: "San hô & Thực vật biển", labelEn: "Corals & Marine Plants" },
  { value: "sinh-vat-bien-sau", labelVi: "Sinh vật biển sâu & Phát quang", labelEn: "Deep Sea Life" },
];

export const HABITATS_DATA = [
  { value: "", labelVi: "Môi trường sống", labelEn: "Habitat Environment" },
  { value: "deep", labelVi: "Đại dương sâu thẳm", labelEn: "Deep Ocean Abyss" },
  {
    value: "shallow",
    labelVi: "Vùng nước nông ven biển",
    labelEn: "Coastal Shallow Waters",
  },
  { value: "reef", labelVi: "Rạn san hô", labelEn: "Coral Reefs" },
  { value: "polar", labelVi: "Vùng cực lạnh giá", labelEn: "Polar Ice Waters" },
];

export const SEARCH_SPECIES_CATALOG = [

  // ── 32 Sinh vật Biển Đông (OceanDepth) ──
  {
    id: "dugong",
    slug: "bo-bien-dugong",
    category: "marine-mammal",
    categoryVi: "Thú biển",
    categoryEn: "Marine Mammals",
    statusVi: "Cực kỳ nguy cấp",
    statusEn: "Critically Endangered",
    statusType: "danger",
    nameVi: "Bò Biển (Dugong)",
    nameEn: "Dugong (Sea Cow)",
    sciName: "Dugong dugon",
    introHeaderVi: "Biểu tượng quý hiếm gắn liền với các thảm cỏ biển tại Côn Đảo và Phú Quốc; nguồn gốc của truyền thuyết 'mỹ nhân ngư'.",
    introHeaderEn: "Rare icon associated with seagrass meadows in Con Dao and Phu Quoc; mythical origin of the mermaid legend.",
    descVi: "Biểu tượng quý hiếm gắn liền với các thảm cỏ biển tại Côn Đảo và Phú Quốc; nguồn gốc của truyền thuyết 'mỹ nhân ngư'.",
    descEn: "Rare icon associated with seagrass meadows in Con Dao and Phu Quoc; mythical origin of the mermaid legend.",
    depth: "0m - 20m",
    size: "2.4m - 3.0m",
    weight: "250kg - 400kg",
    diet: "Cỏ biển (Halophila ovalis, Enhalus)",
    image: CREATURE_PNGS["dugong"],
    gallery: [
      CREATURE_PNGS["dugong"],
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Dugong.JPG/330px-Dugong.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Dugong.JPG"
    ],
    facts: [
      {
            title: "Nàng tiên cá biển cả",
            content: "Dáng bơi khoan thai và cách ôm con nhỏ cho bú của dugong là nguồn gốc truyện mỹ nhân ngư."
      },
      {
            title: "Kẻ ăn cỏ đại dương",
            content: "Mỗi ngày một con bò biển trưởng thành tiêu thụ tới 30-40kg cỏ biển tươi."
      }
],
    isFeatured: false,
  },

  {
    id: "clownfish",
    slug: "ca-he-ocellaris-nemo",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Hề Nemo & Hải Quỳ",
    nameEn: "Clownfish & Sea Anemone",
    sciName: "Amphiprion ocellaris",
    introHeaderVi: "Cư dân quen thuộc tại các rạn san hô vịnh Nha Trang và quần đảo Trường Sa, sống cộng sinh bảo vệ lẫn nhau với hải quỳ.",
    introHeaderEn: "Familiar resident of coral reefs in Nha Trang Bay and Spratly Islands, living symbiotically with venomous sea anemones.",
    descVi: "Cư dân quen thuộc tại các rạn san hô vịnh Nha Trang và quần đảo Trường Sa, sống cộng sinh bảo vệ lẫn nhau với hải quỳ.",
    descEn: "Familiar resident of coral reefs in Nha Trang Bay and Spratly Islands, living symbiotically with venomous sea anemones.",
    depth: "1m - 30m",
    size: "0.08m - 0.15m",
    weight: "0.05kg - 0.15kg",
    diet: "Tảo biển, giáp xác nhỏ, xúc tu hải quỳ rụng",
    image: CREATURE_PNGS["clownfish"],
    gallery: [
      CREATURE_PNGS["clownfish"],
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/330px-Clown_fish_in_the_Andaman_Coral_Reef.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg"
    ],
    facts: [
      {
            title: "Lớp nhầy miễn dịch",
            content: "Nhờ lớp chất nhầy đặc biệt phủ khắp vảy, cá hề không bị chất độc tế bào châm của hải quỳ làm tổn thương."
      },
      {
            title: "Chuyển đổi giới tính",
            content: "Tất cả cá hề sinh ra đều là giống đực; khi con cái đầu đàn chết đi, con đực lớn nhất sẽ đổi giới tính thành con cái."
      }
],
    isFeatured: false,
  },

  {
    id: "hawksbill-turtle",
    slug: "doi-moi-rua-bien",
    category: "reptile",
    categoryVi: "Bò sát biển",
    categoryEn: "Marine Reptiles",
    statusVi: "Cực kỳ nguy cấp",
    statusEn: "Critically Endangered",
    statusType: "danger",
    nameVi: "Đồi Mồi",
    nameEn: "Hawksbill Turtle",
    sciName: "Eretmochelys imbricata",
    introHeaderVi: "Loài rùa biển có mai ngũ sắc tuyệt đẹp thường làm tổ ở các bãi cát miền Trung và các đảo san hô ngoài khơi Biển Đông.",
    introHeaderEn: "Magnificent sea turtle with iridescent shells nesting on pristine central beaches and offshore coral islands.",
    descVi: "Loài rùa biển có mai ngũ sắc tuyệt đẹp thường làm tổ ở các bãi cát miền Trung và các đảo san hô ngoài khơi Biển Đông.",
    descEn: "Magnificent sea turtle with iridescent shells nesting on pristine central beaches and offshore coral islands.",
    depth: "0m - 60m",
    size: "0.7m - 1.0m",
    weight: "50kg - 80kg",
    diet: "Bọt biển (hải miên), sứa, giáp xác",
    image: CREATURE_PNGS["hawksbill-turtle"],
    gallery: [
      CREATURE_PNGS["hawksbill-turtle"],
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Eretmochelys-imbricata-K%C3%A9lonia-2.JPG/330px-Eretmochelys-imbricata-K%C3%A9lonia-2.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/Eretmochelys-imbricata-K%C3%A9lonia-2.JPG"
    ],
    facts: [
      {
            title: "Chiếc mỏ chim ưng",
            content: "Chiếc mỏ khoằm sắc nhọn giúp chúng dễ dàng cạy và gặm nhấm bọt biển bám sâu trong kẽ rạn san hô."
      },
      {
            title: "Mai ngũ sắc quý hiếm",
            content: "Mai đồi mồi từng bị săn lùng làm đồ trang mỹ nghệ, nay được pháp luật Việt Nam và quốc tế bảo vệ tuyệt đối."
      }
],
    isFeatured: false,
  },

  {
    id: "bigfin-squid",
    slug: "muc-la-dai-duong",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Mực Lá Biển Đông",
    nameEn: "Bigfin Reef Squid",
    sciName: "Sepioteuthis lessoniana",
    introHeaderVi: "Loài động vật thân mềm thông minh có khả năng đổi màu ngụy trang tức thì, đối tượng đánh bắt đêm nổi tiếng của ngư dân duyên hải Việt Nam.",
    introHeaderEn: "Highly intelligent cephalopod capable of instantaneous camouflage, celebrated target of nighttime offshore fisheries.",
    descVi: "Loài động vật thân mềm thông minh có khả năng đổi màu ngụy trang tức thì, đối tượng đánh bắt đêm nổi tiếng của ngư dân duyên hải Việt Nam.",
    descEn: "Highly intelligent cephalopod capable of instantaneous camouflage, celebrated target of nighttime offshore fisheries.",
    depth: "0m - 100m",
    size: "0.2m - 0.45m",
    weight: "0.5kg - 2.5kg",
    diet: "Cá nhỏ tầng mặt, tôm tép",
    image: CREATURE_PNGS["bigfin-squid"],
    gallery: [
      CREATURE_PNGS["bigfin-squid"],
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Calamar_de_arrecifes_%28Sepioteuthis_lessoniana%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_134.jpg"
    ],
    facts: [
      {
            title: "Vua đổi màu",
            content: "Tế bào sắc tố chromatophore trên da cho phép mực lá biến đổi màu sắc và vân hoa trong chớp mắt."
      }
],
    isFeatured: false,
  },

  {
    id: "whale-shark",
    slug: "ca-map-voi-nham-voi",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Nguy cấp",
    statusEn: "Endangered",
    statusType: "danger",
    nameVi: "Cá Mập Voi (Cá Ông)",
    nameEn: "Whale Shark",
    sciName: "Rhincodon typus",
    introHeaderVi: "Loài cá lớn nhất hành tinh (dài tới 12–15m), hiền lành chỉ ăn phù du, được ngư dân miền Trung tôn kính phụng thờ là Cá Ông.",
    introHeaderEn: "The largest fish on Earth (12-15m), gentle plankton feeder revered as 'Ca Ong' by Vietnamese coastal fishermen.",
    descVi: "Loài cá lớn nhất hành tinh (dài tới 12–15m), hiền lành chỉ ăn phù du, được ngư dân miền Trung tôn kính phụng thờ là Cá Ông.",
    descEn: "The largest fish on Earth (12-15m), gentle plankton feeder revered as 'Ca Ong' by Vietnamese coastal fishermen.",
    depth: "0m - 200m",
    size: "9m - 14m",
    weight: "12,000kg - 19,000kg",
    diet: "Sinh vật phù du, nhuyễn thể, cá con",
    image: CREATURE_PNGS["whale-shark"],
    gallery: [
      CREATURE_PNGS["whale-shark"],
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Similan_Dive_Center_-_great_whale_shark.jpg"
    ],
    facts: [
      {
            title: "Vân đốm độc bản",
            content: "Họa tiết đốm trắng trên lưng cá mập voi là duy nhất cho mỗi cá thể, giống như vân tay ở con người."
      }
],
    isFeatured: false,
  },

  {
    id: "spotted-dolphin",
    slug: "ca-heo-dom-nhiet-doi",
    category: "marine-mammal",
    categoryVi: "Thú biển",
    categoryEn: "Marine Mammals",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Heo Đốm Nhiệt Đới",
    nameEn: "Pantropical Spotted Dolphin",
    sciName: "Stenella attenuata",
    introHeaderVi: "Nhóm động vật có vú đại dương năng động, thường nhảy nhào lộn theo mũi tàu thuyền di chuyển qua bồn trũng Biển Đông.",
    introHeaderEn: "Acrobatic marine mammal frequently seen bow-riding and leaping alongside vessels crossing the East Sea basin.",
    descVi: "Nhóm động vật có vú đại dương năng động, thường nhảy nhào lộn theo mũi tàu thuyền di chuyển qua bồn trũng Biển Đông.",
    descEn: "Acrobatic marine mammal frequently seen bow-riding and leaping alongside vessels crossing the East Sea basin.",
    depth: "0m - 250m",
    size: "1.8m - 2.5m",
    weight: "90kg - 120kg",
    diet: "Mực ống, cá chuồn tầng mặt",
    image: CREATURE_PNGS["spotted-dolphin"],
    gallery: [
      CREATURE_PNGS["spotted-dolphin"],
      "https://upload.wikimedia.org/wikipedia/commons/0/06/Pantropical_spotted_dolphin_swimming_off_the_coast_of_Costa_Rica.jpg"
    ],
    facts: [
      {
            title: "Đốm tăng theo tuổi",
            content: "Khi mới sinh ra cá con không có đốm; các đốm trắng xám xuất hiện dần và đậm nét khi trưởng thành."
      }
],
    isFeatured: false,
  },

  {
    id: "sailfish",
    slug: "ca-co-gon",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Buồm (Cá Cờ Gòn)",
    nameEn: "Indo-Pacific Sailfish",
    sciName: "Istiophorus platypterus",
    introHeaderVi: "'Vận động viên điền kinh' nhanh nhất biển cả với tốc độ bơi rút lên tới 110 km/h, thợ săn thượng thặng ở thềm lục địa ngoài khơi.",
    introHeaderEn: "Fastest sprinter of the oceans reaching speeds up to 110 km/h, elite apex predator along the outer continental shelf.",
    descVi: "'Vận động viên điền kinh' nhanh nhất biển cả với tốc độ bơi rút lên tới 110 km/h, thợ săn thượng thặng ở thềm lục địa ngoài khơi.",
    descEn: "Fastest sprinter of the oceans reaching speeds up to 110 km/h, elite apex predator along the outer continental shelf.",
    depth: "0m - 200m",
    size: "2.0m - 3.2m",
    weight: "45kg - 90kg",
    diet: "Cá trích, cá thu, mực ống",
    image: CREATURE_PNGS["sailfish"],
    gallery: [
      CREATURE_PNGS["sailfish"],
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Istiophorus_platypterus_101956558.jpg"
    ],
    facts: [
      {
            title: "Tốc độ tên lửa",
            content: "Vây lưng hình cánh buồm có thể gập sát lưng để giảm tối đa lực cản khi phóng nước với tốc độ 110 km/h."
      }
],
    isFeatured: false,
  },

  {
    id: "hammerhead-shark",
    slug: "ca-nham-bua-dau-bua",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Cực kỳ nguy cấp",
    statusEn: "Critically Endangered",
    statusType: "danger",
    nameVi: "Cá Nhám Búa",
    nameEn: "Scalloped Hammerhead Shark",
    sciName: "Sphyrna lewini",
    introHeaderVi: "Chiếc đầu hình búa hoạt động như một ăng-ten cảm ứng điện trường cực nhạy để săn cá đuối vùi dưới đáy cát thềm lục địa.",
    introHeaderEn: "Cephalofoil head operates as a hyper-sensitive electro-receptor array to detect rays buried beneath shelf sands.",
    descVi: "Chiếc đầu hình búa hoạt động như một ăng-ten cảm ứng điện trường cực nhạy để săn cá đuối vùi dưới đáy cát thềm lục địa.",
    descEn: "Cephalofoil head operates as a hyper-sensitive electro-receptor array to detect rays buried beneath shelf sands.",
    depth: "0m - 275m",
    size: "2.5m - 4.2m",
    weight: "80kg - 160kg",
    diet: "Cá đuối, mực ống, cá tầng đáy",
    image: CREATURE_PNGS["hammerhead-shark"],
    gallery: [
      CREATURE_PNGS["hammerhead-shark"],
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Scalloped_hammerhead_shark_%28Sphyrna_lewini%29_Costa_Rica_%28cropped%29.jpg"
    ],
    facts: [
      {
            title: "Tầm nhìn 360 độ",
            content: "Hai mắt ở hai đầu búa cho phép chúng quan sát toàn cảnh phía trên và phía dưới cùng một lúc."
      }
],
    isFeatured: false,
  },

  {
    id: "yellowfin-tuna",
    slug: "ca-ngu-vay-vang-dai-duong",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Sắp bị đe dọa",
    statusEn: "Near Threatened",
    statusType: "warning",
    nameVi: "Cá Ngừ Vây Vàng",
    nameEn: "Yellowfin Tuna",
    sciName: "Thunnus albacares",
    introHeaderVi: "Kẻ du mục đại dương bơi không ngừng nghỉ dọc bồn trũng sâu, là nguồn hải sản xuất khẩu chủ lực của ngư dân miền Trung.",
    introHeaderEn: "Relentless oceanic nomad roaming the deep basin, prized flagship catch of Central Vietnam's pelagic fleets.",
    descVi: "Kẻ du mục đại dương bơi không ngừng nghỉ dọc bồn trũng sâu, là nguồn hải sản xuất khẩu chủ lực của ngư dân miền Trung.",
    descEn: "Relentless oceanic nomad roaming the deep basin, prized flagship catch of Central Vietnam's pelagic fleets.",
    depth: "1m - 250m",
    size: "1.2m - 2.1m",
    weight: "40kg - 180kg",
    diet: "Cá trích, cá chuồn, mực",
    image: CREATURE_PNGS["yellowfin-tuna"],
    gallery: [
      CREATURE_PNGS["yellowfin-tuna"],
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Thunnus_albacares.png"
    ],
    facts: [
      {
            title: "Bơi liên tục cả đời",
            content: "Cá ngừ phải bơi liên tục không ngừng để dòng nước luân chuyển qua mang lấy oxy, ngay cả khi ngủ."
      }
],
    isFeatured: false,
  },

  {
    id: "ocean-sunfish",
    slug: "ca-mat-trang-mola-mola",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Sắp nguy cấp",
    statusEn: "Vulnerable",
    statusType: "warning",
    nameVi: "Cá Mặt Trăng (Mola Mola)",
    nameEn: "Ocean Sunfish",
    sciName: "Mola mola",
    introHeaderVi: "Cá xương nặng nhất thế giới; thi thoảng ngư dân vịnh Bắc Bộ và biển Quy Nhơn phát hiện chúng nổi nghiêng người phơi nắng ở tầng mặt.",
    introHeaderEn: "Heaviest bony fish on Earth, occasionally spotted basking horizontally at the surface in the Gulf of Tonkin and Quy Nhon.",
    descVi: "Cá xương nặng nhất thế giới; thi thoảng ngư dân vịnh Bắc Bộ và biển Quy Nhơn phát hiện chúng nổi nghiêng người phơi nắng ở tầng mặt.",
    descEn: "Heaviest bony fish on Earth, occasionally spotted basking horizontally at the surface in the Gulf of Tonkin and Quy Nhon.",
    depth: "0m - 400m",
    size: "1.8m - 3.1m",
    weight: "500kg - 2,000kg",
    diet: "Sứa biển, động vật phù du thân mềm",
    image: CREATURE_PNGS["ocean-sunfish"],
    gallery: [
      CREATURE_PNGS["ocean-sunfish"],
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Mola_mola.jpg"
    ],
    facts: [
      {
            title: "Kỷ lục đẻ trứng",
            content: "Một con cá mặt trăng cái có thể đẻ tới 300 triệu quả trứng mỗi lần sinh sản, nhiều nhất thế giới động vật."
      }
],
    isFeatured: false,
  },

  {
    id: "spotted-eagle-ray",
    slug: "ca-duoi-o-hoa",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Nguy cấp",
    statusEn: "Endangered",
    statusType: "danger",
    nameVi: "Cá Đuối Ó Sao",
    nameEn: "Spotted Eagle Ray",
    sciName: "Aetobatus narinari",
    introHeaderVi: "Lướt đi như cánh chim trên ranh giới cuối cùng của ánh sáng mặt trời trước khi bước vào màn đêm thăm thẳm.",
    introHeaderEn: "Glides like a winged specter along the final frontiers of sunlight before descending into the permanent dark.",
    descVi: "Lướt đi như cánh chim trên ranh giới cuối cùng của ánh sáng mặt trời trước khi bước vào màn đêm thăm thẳm.",
    descEn: "Glides like a winged specter along the final frontiers of sunlight before descending into the permanent dark.",
    depth: "1m - 80m",
    size: "1.5m - 3.0m",
    weight: "80kg - 230kg",
    diet: "Sò, ốc, nghêu, cua đáy biển",
    image: CREATURE_PNGS["spotted-eagle-ray"],
    gallery: [
      CREATURE_PNGS["spotted-eagle-ray"],
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Eagle_Ray_Turks_and_Caicos_Dec_15_2006.JPG"
    ],
    facts: [
      {
            title: "Phi thân khỏi mặt nước",
            content: "Cá đuối ó sao có thói quen nhảy vút lên khỏi mặt biển tới vài mét để rũ sạch ký sinh trùng trên da."
      }
],
    isFeatured: false,
  },

  {
    id: "lanternfish",
    slug: "ca-den-long-bien-sau",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Đèn Lồng Biển Sâu",
    nameEn: "Lanternfish",
    sciName: "Diaphus sp. / Myctophidae",
    introHeaderVi: "Chiếm sinh khối cực lớn trong lớp phản xạ âm thanh (DSL) của Biển Đông; ban đêm hàng triệu con bơi lên 50m để ăn phù du, rạng sáng lặn về vùng tối.",
    introHeaderEn: "Dominates the Deep Scattering Layer biomass; millions migrate upwards each night to feed before retreating at dawn.",
    descVi: "Chiếm sinh khối cực lớn trong lớp phản xạ âm thanh (DSL) của Biển Đông; ban đêm hàng triệu con bơi lên 50m để ăn phù du, rạng sáng lặn về vùng tối.",
    descEn: "Dominates the Deep Scattering Layer biomass; millions migrate upwards each night to feed before retreating at dawn.",
    depth: "200m - 1000m",
    size: "0.05m - 0.15m",
    weight: "0.01kg - 0.05kg",
    diet: "Giáp xác chân chèo, giun phù du",
    image: CREATURE_PNGS["lanternfish"],
    gallery: [
      CREATURE_PNGS["lanternfish"],
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Myctophum_punctatum1.jpg"
    ],
    facts: [
      {
            title: "Cuộc đại di cư lớn nhất hành tinh",
            content: "Cùng hàng tỷ sinh vật tầng chạng vạng, chúng tạo nên cuộc di cư thẳng đứng tính theo sinh khối lớn nhất Trái Đất mỗi đêm."
      }
],
    isFeatured: false,
  },

  {
    id: "giant-isopod",
    slug: "bo-bien-khong-lo-giant-isopod",
    category: "crustacean",
    categoryVi: "Giáp xác",
    categoryEn: "Crustaceans",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Bọ Biển Khổng Lồ",
    nameEn: "Giant Isopod",
    sciName: "Bathynomus jamesi",
    introHeaderVi: "'Quái vật tí hon' giáp xác đáy sâu cực kỳ nổi tiếng tại vùng biển Quảng Ngãi, Bình Định; ngư dân phải dùng bẫy đáy sâu chuyên biệt để đánh bắt.",
    introHeaderEn: "Famed deep-sea benthic crustacean harvested by deep-trap fishermen off the coast of Quang Ngai and Binh Dinh.",
    descVi: "'Quái vật tí hon' giáp xác đáy sâu cực kỳ nổi tiếng tại vùng biển Quảng Ngãi, Bình Định; ngư dân phải dùng bẫy đáy sâu chuyên biệt để đánh bắt.",
    descEn: "Famed deep-sea benthic crustacean harvested by deep-trap fishermen off the coast of Quang Ngai and Binh Dinh.",
    depth: "300m - 800m",
    size: "0.2m - 0.45m",
    weight: "0.8kg - 1.8kg",
    diet: "Xác cá voi, xác cá chìm xuống bùn đáy",
    image: CREATURE_PNGS["giant-isopod"],
    gallery: [
      CREATURE_PNGS["giant-isopod"],
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Bathynomus_giganteus_as_seen_by_remotely_operated_vehicle_%28ROV%29_Deep_Discoverer_at_a_depth_of_816_meters_at_South_Reed%2C_Gulf_of_Mexico%2C_2017-11-30.webm"
    ],
    facts: [
      {
            title: "Nhịn ăn 5 năm",
            content: "Trong điều kiện nuôi nhốt tại Nhật Bản, một cá thể bọ biển đã nhịn ăn ròng rã suốt hơn 5 năm mà vẫn sống sót."
      }
],
    isFeatured: false,
  },

  {
    id: "hatchetfish",
    slug: "ca-riu-bac-bien-sau",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Rìu Biển Sâu",
    nameEn: "Half-naked Hatchetfish",
    sciName: "Argyropelecus hemigymnus",
    introHeaderVi: "Thân mỏng dẹt như lưỡi búa, dưới bụng có hàng đèn phát quang sinh học mô phỏng ánh sáng mặt trời rọi xuống nhằm 'tàng hình' khỏi kẻ săn mồi bên dưới.",
    introHeaderEn: "Hatchet-thin silver body with counter-illuminating photophores on its belly that mimic downwelling sunlight to vanish.",
    descVi: "Thân mỏng dẹt như lưỡi búa, dưới bụng có hàng đèn phát quang sinh học mô phỏng ánh sáng mặt trời rọi xuống nhằm 'tàng hình' khỏi kẻ săn mồi bên dưới.",
    descEn: "Hatchet-thin silver body with counter-illuminating photophores on its belly that mimic downwelling sunlight to vanish.",
    depth: "200m - 1000m",
    size: "0.04m - 0.08m",
    weight: "0.01kg - 0.03kg",
    diet: "Giáp xác phù du, ấu trùng biển sâu",
    image: CREATURE_PNGS["hatchetfish"],
    gallery: [
      CREATURE_PNGS["hatchetfish"],
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/ArgyropelecusAculeatus.jpg"
    ],
    facts: [
      {
            title: "Áo tàng hình quang học",
            content: "Bằng cách điều chỉnh độ sáng dưới bụng trùng khít với ánh sáng le lói từ mặt trời chiếu xuống, bóng của chúng biến mất hoàn toàn."
      }
],
    isFeatured: false,
  },

  {
    id: "cockeyed-squid",
    slug: "muc-mat-choi-lac",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Mực Mắt Chọi Lác",
    nameEn: "Cockeyed Squid (Jewel Squid)",
    sciName: "Histioteuthis pacifica",
    introHeaderVi: "Sở hữu hai mắt bất đối xứng độc nhất: mắt trái to lồi màu vàng hướng lên để soi bóng con mồi ngược ánh sáng tầng mặt, mắt phải nhỏ màu xanh hướng xuống quét đáy đại dương tăm tối.",
    introHeaderEn: "Indo-West Pacific representative of the asymmetric-eyed Histioteuthis: enormous yellow left eye scans upward for prey silhouettes, while the smaller right eye scans the dark depths below.",
    descVi: "Sở hữu hai mắt bất đối xứng độc nhất: mắt trái to lồi màu vàng hướng lên để soi bóng con mồi ngược ánh sáng tầng mặt, mắt phải nhỏ màu xanh hướng xuống quét đáy đại dương tăm tối.",
    descEn: "Indo-West Pacific representative of the asymmetric-eyed Histioteuthis: enormous yellow left eye scans upward for prey silhouettes, while the smaller right eye scans the dark depths below.",
    depth: "300m - 1000m",
    size: "0.15m - 0.35m",
    weight: "0.15kg - 0.6kg",
    diet: "Cá đèn lồng, tôm giáp xác biển sâu",
    image: CREATURE_PNGS["cockeyed-squid"],
    gallery: [
      CREATURE_PNGS["cockeyed-squid"],
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Histioteuthis_NOAA.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Histioteuthis_reversa_%28Michael_Vecchione%2C_NOAA%29.JPG",
      "https://static.inaturalist.org/photos/12259849/large.jpg"
    ],
    facts: [
      {
            title: "Đôi mắt bất đối xứng độc nhất vô nhị",
            content: "Mắt trái to gấp đôi mắt phải và có sắc tố vàng nhạy cảm, giúp phát hiện ánh sáng sinh học và bóng mồi ngược sáng cực tốt."
      },
      {
            title: "Đèn phát quang toàn thân",
            content: "Toàn bộ mặt bụng được nạm hàng trăm chấm phát quang photophore lấp lánh như trang sức."
      }
],
    isFeatured: false,
  },

  {
    id: "deepsea-crab",
    slug: "cua-da-bien-sau",
    category: "crustacean",
    categoryVi: "Giáp xác",
    categoryEn: "Crustaceans",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cua Đá Đỏ Sâu",
    nameEn: "Deep-Sea Golden/Red Crab",
    sciName: "Chaceon granulatus",
    introHeaderVi: "Cua nước sâu vỏ gai sần sùi sống dọc sườn dốc lục địa Biển Đông, chuyên rà bùn tìm mảnh vụn thức ăn rơi từ tầng trên.",
    introHeaderEn: "Rugged deep-water crab inhabiting the continental slopes of the East Sea, scavenging organic detritus falling from above.",
    descVi: "Cua nước sâu vỏ gai sần sùi sống dọc sườn dốc lục địa Biển Đông, chuyên rà bùn tìm mảnh vụn thức ăn rơi từ tầng trên.",
    descEn: "Rugged deep-water crab inhabiting the continental slopes of the East Sea, scavenging organic detritus falling from above.",
    depth: "400m - 1200m",
    size: "0.15m - 0.3m",
    weight: "0.5kg - 1.5kg",
    diet: "Mảnh vụn hữu cơ, xác động vật chìm",
    image: CREATURE_PNGS["deepsea-crab"],
    gallery: [
      CREATURE_PNGS["deepsea-crab"],
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Chaceon_affinis.jpg"
    ],
    facts: [
      {
            title: "Bộ giáp chịu áp suất cao",
            content: "Vỏ của cua đá biển sâu chứa nhiều khoáng chất vôi hóa đặc biệt giúp chúng không bị giòn gãy dưới áp lực nước hàng trăm atm."
      }
],
    isFeatured: false,
  },

  {
    id: "ghost-shark",
    slug: "ca-nham-ma-ghost-shark",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Nhám Ma (Cá Mập Thỏ)",
    nameEn: "Chimaera / Ghost Shark",
    sciName: "Hydrolagus mitsukurii",
    introHeaderVi: "'Hóa thạch sống' cổ xưa không xương cứng; có đôi mắt phát sáng phản chiếu màu xanh lục ma quái và cơ quan cảm thụ chuyển động ở đầu.",
    introHeaderEn: "Ancient chimaera living fossil with eerie iridescent emerald eyes and complex lateral sensory lines across its skull.",
    descVi: "'Hóa thạch sống' cổ xưa không xương cứng; có đôi mắt phát sáng phản chiếu màu xanh lục ma quái và cơ quan cảm thụ chuyển động ở đầu.",
    descEn: "Ancient chimaera living fossil with eerie iridescent emerald eyes and complex lateral sensory lines across its skull.",
    depth: "400m - 1500m",
    size: "0.6m - 1.2m",
    weight: "2kg - 8kg",
    diet: "Động vật thân mềm đáy, cua, giun biển sâu",
    image: CREATURE_PNGS["ghost-shark"],
    gallery: [
      CREATURE_PNGS["ghost-shark"],
      "https://static.inaturalist.org/photos/468799518/large.png",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/388493602/large.jpg"
    ],
    facts: [
      {
            title: "Hóa thạch sống 400 triệu năm",
            content: "Nhóm cá toàn đầu (Holocephali) tách khỏi nhánh cá mập từ kỷ Devon, lưu giữ nhiều đặc điểm cổ sinh học nguyên thủy."
      }
],
    isFeatured: false,
  },

  {
    id: "black-dragonfish",
    slug: "ca-rong-den-bien-sau",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Rồng Đen",
    nameEn: "Black Dragonfish",
    sciName: "Stomias nebulosus",
    introHeaderVi: "Răng nanh trong suốt dài đến mức không khép vừa miệng, dưới cằm đung đưa sợi râu phát quang để bẫy những con cá tò mò.",
    introHeaderEn: "Terrifying transparent needle fangs protruding past its jaws, dangling a glowing chin barbel to lure unsuspecting prey.",
    descVi: "Răng nanh trong suốt dài đến mức không khép vừa miệng, dưới cằm đung đưa sợi râu phát quang để bẫy những con cá tò mò.",
    descEn: "Terrifying transparent needle fangs protruding past its jaws, dangling a glowing chin barbel to lure unsuspecting prey.",
    depth: "500m - 1500m",
    size: "0.25m - 0.4m",
    weight: "0.1kg - 0.35kg",
    diet: "Cá con, giáp xác biển sâu",
    image: CREATURE_PNGS["black-dragonfish"],
    gallery: [
      CREATURE_PNGS["black-dragonfish"],
      "https://inaturalist-open-data.s3.amazonaws.com/photos/184592314/large.jpg"
    ],
    facts: [
      {
            title: "Răng nano trong suốt",
            content: "Răng nanh của cá rồng đen cấu tạo từ các hạt nano hydroxyapatite tán xạ ánh sáng, giúp răng vô hình trước con mồi."
      }
],
    isFeatured: false,
  },

  {
    id: "glass-squid",
    slug: "muc-thuy-tinh-glass-squid",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Mực Thủy Tinh",
    nameEn: "Glass Squid",
    sciName: "Cranchia scabra",
    introHeaderVi: "Toàn thân gần như trong suốt như pha lê để vô hình trước kẻ thù, chỉ phát sáng đôi mắt để giao tiếp và định hướng.",
    introHeaderEn: "Crystal-clear transparent body rendering it nearly invisible in twilight waters, utilizing luminous ocular photophores.",
    descVi: "Toàn thân gần như trong suốt như pha lê để vô hình trước kẻ thù, chỉ phát sáng đôi mắt để giao tiếp và định hướng.",
    descEn: "Crystal-clear transparent body rendering it nearly invisible in twilight waters, utilizing luminous ocular photophores.",
    depth: "500m - 2000m",
    size: "0.1m - 0.25m",
    weight: "0.05kg - 0.2kg",
    diet: "Sinh vật phù du, giáp xác nhỏ",
    image: CREATURE_PNGS["glass-squid"],
    gallery: [
      CREATURE_PNGS["glass-squid"],
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Cranchia_scabra.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Cranchia_scabra_-_NHM_1.jpg",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/174546799/large.jpg"
    ],
    facts: [
      {
            title: "Túi amoniac nổi",
            content: "Khoang cơ thể chứa dung dịch amoniac loãng nhẹ hơn nước biển, giúp mực thủy tinh trôi nổi không cần tốn năng lượng bơi."
      }
],
    isFeatured: false,
  },

  {
    id: "gigantocypris",
    slug: "giap-xac-boi-khong-lo-gigantocypris",
    category: "crustacean",
    categoryVi: "Giáp xác",
    categoryEn: "Crustaceans",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Giáp Xác Bơi Khổng Lồ",
    nameEn: "Giant Pelagic Ostracod",
    sciName: "Gigantocypris agassizii",
    introHeaderVi: "Kích thước bằng quả bóng bàn, toàn thân hình cầu cam hổ phách trong suốt với đôi mắt gương cầu lồi lớn nhất giới sinh vật để bắt trọn những photon ánh sáng le lói cuối cùng.",
    introHeaderEn: "Orange ping-pong sized spherical ostracod equipped with enormous mirror parabolic eyes to capture the very last photons of light.",
    descVi: "Kích thước bằng quả bóng bàn, toàn thân hình cầu cam hổ phách trong suốt với đôi mắt gương cầu lồi lớn nhất giới sinh vật để bắt trọn những photon ánh sáng le lói cuối cùng.",
    descEn: "Orange ping-pong sized spherical ostracod equipped with enormous mirror parabolic eyes to capture the very last photons of light.",
    depth: "800m - 2000m",
    size: "0.02m - 0.035m",
    weight: "0.005kg - 0.015kg",
    diet: "Giáp xác chân chèo, giun mũi tên",
    image: CREATURE_PNGS["gigantocypris"],
    gallery: [
      CREATURE_PNGS["gigantocypris"],
      "https://upload.wikimedia.org/wikipedia/commons/b/b2/Gigantocypris.jpg",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/586467985/large.jpg"
    ],
    facts: [
      {
            title: "Đôi mắt gương parabol",
            content: "Thay vì dùng thấu kính thủy tinh thể, Gigantocypris dùng gương cầu lồi phản xạ bên trong để hội tụ ánh sáng mờ nhạt."
      }
],
    isFeatured: false,
  },

  {
    id: "anglerfish",
    slug: "ca-can-cau-bien-sau-anglerfish",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Cần Câu Quỷ (Anglerfish)",
    nameEn: "Humpback Anglerfish",
    sciName: "Melanocetus johnsonii",
    introHeaderVi: "Chiếc mồi nhử phát quang sinh học (chứa vi khuẩn phát sáng) đung đưa trên đỉnh đầu; con đực có tập tính sống bám ký sinh vĩnh viễn vào con cái.",
    introHeaderEn: "Bioluminescent esca lure glowing above its razor jaws; dwarfed males fuse permanently as parasites onto females.",
    descVi: "Chiếc mồi nhử phát quang sinh học (chứa vi khuẩn phát sáng) đung đưa trên đỉnh đầu; con đực có tập tính sống bám ký sinh vĩnh viễn vào con cái.",
    descEn: "Bioluminescent esca lure glowing above its razor jaws; dwarfed males fuse permanently as parasites onto females.",
    depth: "1000m - 3000m",
    size: "0.15m - 0.25m",
    weight: "0.2kg - 0.7kg",
    diet: "Cá biển sâu, mực con",
    image: CREATURE_PNGS["anglerfish"],
    gallery: [
      CREATURE_PNGS["anglerfish"],
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Humpback_anglerfish.png/330px-Humpback_anglerfish.png"
    ],
    facts: [
      {
            title: "Ký sinh sinh sản",
            content: "Con đực nhỏ bé cắn vào bụng con cái, dần dần hợp nhất hệ tuần hoàn và trở thành một túi chứa tinh trùng bám suốt đời."
      }
],
    isFeatured: false,
  },

  {
    id: "haima-tubeworm",
    slug: "giun-ong-mieng-lanh-haima",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Hiếm gặp",
    statusEn: "Rare",
    statusType: "warning",
    nameVi: "Giun Ống Miệng Lạnh Haima",
    nameEn: "Haima Cold Seep Tubeworm",
    sciName: "Paraescarpia echinospica",
    introHeaderVi: "Phát hiện chấn động tại hệ sinh thái Miệng phun lạnh Hải Mã (Haima Cold Seep) ở đáy Biển Đông; loài giun này không có miệng hay ruột, sống hoàn toàn nhờ vi khuẩn hóa tổng hợp khí mê-tan.",
    introHeaderEn: "Groundbreaking discovery at the Haima Cold Seep in the East Sea; gutless tubeworms thriving purely on methane-synthesizing symbionts.",
    descVi: "Phát hiện chấn động tại hệ sinh thái Miệng phun lạnh Hải Mã (Haima Cold Seep) ở đáy Biển Đông; loài giun này không có miệng hay ruột, sống hoàn toàn nhờ vi khuẩn hóa tổng hợp khí mê-tan.",
    descEn: "Groundbreaking discovery at the Haima Cold Seep in the East Sea; gutless tubeworms thriving purely on methane-synthesizing symbionts.",
    depth: "1200m - 3000m",
    size: "0.5m - 2.0m",
    weight: "0.1kg - 0.4kg",
    diet: "Vi khuẩn hóa tổng hợp khí methane",
    image: CREATURE_PNGS["haima-tubeworm"],
    gallery: [
      CREATURE_PNGS["haima-tubeworm"],
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Nur04505.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Champ_de_vers_siboglinid%C3%A9s_%28Siboglinidae%29_%28Ifremer_00558-67007_-_20629%29.jpg"
    ],
    facts: [
      {
            title: "Sinh vật không ruột",
            content: "Trong cơ thể có một cơ quan gọi là trophosome chứa hàng tỷ vi khuẩn ô-xy hóa khí methane nuôi sống cơ thể."
      }
],
    isFeatured: false,
  },

  {
    id: "haima-mussel",
    slug: "trai-bien-sau-haima",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Hiếm gặp",
    statusEn: "Rare",
    statusType: "warning",
    nameVi: "Trai Biển Sâu Bồn Trũng",
    nameEn: "Haima Deep-Sea Mussel",
    sciName: "Gigantidas haimaensis",
    introHeaderVi: "Quần tụ thành từng thảm lớn ken đặc quanh các vết nứt rỉ khí mê-tan ở đáy sâu Biển Đông, phát triển tươi tốt mà không cần một tia nắng mặt trời nào.",
    introHeaderEn: "Forms vast dense colonies around methane fissures on the deep seafloor, prospering independently of any sunlight.",
    descVi: "Quần tụ thành từng thảm lớn ken đặc quanh các vết nứt rỉ khí mê-tan ở đáy sâu Biển Đông, phát triển tươi tốt mà không cần một tia nắng mặt trời nào.",
    descEn: "Forms vast dense colonies around methane fissures on the deep seafloor, prospering independently of any sunlight.",
    depth: "1000m - 3000m",
    size: "0.08m - 0.18m",
    weight: "0.05kg - 0.2kg",
    diet: "Vi khuẩn cộng sinh ăn methane và hydro sulfide",
    image: CREATURE_PNGS["haima-mussel"],
    gallery: [
      CREATURE_PNGS["haima-mussel"],
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Gigantidas_tangaroa.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Bathymodiolus_childressi.jpg"
    ],
    facts: [
      {
            title: "Thảm sinh vật đáy biển",
            content: "Hàng nghìn con xếp chồng lớp lên nhau tạo thành sinh cảnh cho tôm, cua và giáp xác biển sâu trú ẩn."
      }
],
    isFeatured: false,
  },

  {
    id: "viperfish",
    slug: "ca-rong-bien-sau-viperfish",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Hổ Lục Biển Sâu (Viperfish)",
    nameEn: "Sloane's Viperfish",
    sciName: "Chauliodus sloani",
    introHeaderVi: "Răng nanh nhọn hoắt uốn cong chạm đỉnh sọ, đốt sống cổ đầu tiên được tiến hóa thành lớp đệm hấp thụ xung lực khi đớp mồi với tốc độ cao.",
    introHeaderEn: "Protruding curved fangs curving past its eyes, backed by a shock-absorbing modified first vertebra for violent strikes.",
    descVi: "Răng nanh nhọn hoắt uốn cong chạm đỉnh sọ, đốt sống cổ đầu tiên được tiến hóa thành lớp đệm hấp thụ xung lực khi đớp mồi với tốc độ cao.",
    descEn: "Protruding curved fangs curving past its eyes, backed by a shock-absorbing modified first vertebra for violent strikes.",
    depth: "1000m - 2800m",
    size: "0.2m - 0.35m",
    weight: "0.1kg - 0.3kg",
    diet: "Cá lồng đèn nhỏ, tôm biển sâu",
    image: CREATURE_PNGS["viperfish"],
    gallery: [
      CREATURE_PNGS["viperfish"],
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Messina_Straits_Chauliodus_sloani.jpg/330px-Messina_Straits_Chauliodus_sloani.jpg"
    ],
    facts: [
      {
            title: "Răng nanh dài nhất theo tỉ lệ",
            content: "Răng nanh của viperfish dài tới mức nó phải mở toạc hàm hơn 90 độ mới có thể ngậm mồi."
      }
],
    isFeatured: false,
  },

  {
    id: "vampire-squid",
    slug: "muc-ma-ca-rong-bien-sau",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Mực Ma Cà Rồng Biển Đông",
    nameEn: "South China Sea Vampire Squid",
    sciName: "Vampyroteuthis pseudoinfernalis",
    introHeaderVi: "Loài mới được Viện Hải Dương học Biển Đông (CAS) mô tả năm 2024, tách biệt khỏi V. infernalis qua phân tích ADN và hình thái. Giữa các xúc tu có lớp màng đen như áo choàng; không săn mồi sống mà thu nhặt 'tuyết biển' (mùn bã hữu cơ chìm từ tầng mặt) bằng tua xúc tu dài.",
    introHeaderEn: "New species described by the South China Sea Institute of Oceanology (CAS) in 2024, split from V. infernalis via DNA and morphological analysis. Black webbed cloak between arms; passively collects sinking marine snow rather than actively hunting.",
    descVi: "Loài mới được Viện Hải Dương học Biển Đông (CAS) mô tả năm 2024, tách biệt khỏi V. infernalis qua phân tích ADN và hình thái. Giữa các xúc tu có lớp màng đen như áo choàng; không săn mồi sống mà thu nhặt 'tuyết biển' (mùn bã hữu cơ chìm từ tầng mặt) bằng tua xúc tu dài.",
    descEn: "New species described by the South China Sea Institute of Oceanology (CAS) in 2024, split from V. infernalis via DNA and morphological analysis. Black webbed cloak between arms; passively collects sinking marine snow rather than actively hunting.",
    depth: "600m - 3000m",
    size: "0.15m - 0.3m",
    weight: "0.15kg - 0.5kg",
    diet: "Tuyết biển (mùn bã hữu cơ chìm)",
    image: CREATURE_PNGS["vampire-squid"],
    gallery: [
      CREATURE_PNGS["vampire-squid"],
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Vampyroteuthis_illustration.jpg/330px-Vampyroteuthis_illustration.jpg"
    ],
    facts: [
      {
            title: "Áo choàng gai nhọn",
            content: "Khi bị tấn công, mực ma cà rồng lộn ngược lớp màng che kín đầu, để lộ hàng gai giả nhọn hoắt dọa kẻ săn mồi."
      }
],
    isFeatured: false,
  },

  {
    id: "dumbo-octopus",
    slug: "bach-tuoc-dumbo",
    category: "mollusk",
    categoryVi: "Thân mềm",
    categoryEn: "Mollusks",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Bạch Tuộc Tai Voi Dumbo",
    nameEn: "Dumbo Octopus",
    sciName: "Grimpoteuthis sp.",
    introHeaderVi: "Hai vây bên đầu đập nhẹ nhàng như tai chú voi bay Dumbo, trôi lơ lửng sát lớp trầm tích mịn của bồn trũng trung tâm Biển Đông.",
    introHeaderEn: "Flaps ear-like fins like Disney's flying elephant, hovering serenely above fine sediments of the central deep basin.",
    descVi: "Hai vây bên đầu đập nhẹ nhàng như tai chú voi bay Dumbo, trôi lơ lửng sát lớp trầm tích mịn của bồn trũng trung tâm Biển Đông.",
    descEn: "Flaps ear-like fins like Disney's flying elephant, hovering serenely above fine sediments of the central deep basin.",
    depth: "1000m - 4000m",
    size: "0.2m - 0.4m",
    weight: "0.3kg - 1.2kg",
    diet: "Giun biển sâu, giáp xác nhỏ",
    image: CREATURE_PNGS["dumbo-octopus"],
    gallery: [
      CREATURE_PNGS["dumbo-octopus"],
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Grimpoteuthis_discoveryi.jpg"
    ],
    facts: [
      {
            title: "Bạch tuộc bơi sâu nhất",
            content: "Chi Grimpoteuthis là nhóm bạch tuộc sống sâu nhất từng được tàu ngầm ghi nhận (đạt tới hơn 4,000m)."
      }
],
    isFeatured: false,
  },

  {
    id: "tripod-fish",
    slug: "ca-ba-chan-tripod-fish",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Ba Chân",
    nameEn: "Tripod Fish",
    sciName: "Bathypterois grallator",
    introHeaderVi: "Đứng bất động trên 3 tia vây dài như chiếc kiềng 3 chân cắm vào nền bùn lỏng, quay mặt ngược dòng hải lưu ngầm để đợi thức ăn trôi vào miệng.",
    introHeaderEn: "Stands motionless on three elongated fins propped like a tripod in fluid mud, facing deep currents to intercept drifting prey.",
    descVi: "Đứng bất động trên 3 tia vây dài như chiếc kiềng 3 chân cắm vào nền bùn lỏng, quay mặt ngược dòng hải lưu ngầm để đợi thức ăn trôi vào miệng.",
    descEn: "Stands motionless on three elongated fins propped like a tripod in fluid mud, facing deep currents to intercept drifting prey.",
    depth: "1500m - 4700m",
    size: "0.3m - 0.45m",
    weight: "0.2kg - 0.5kg",
    diet: "Giáp xác phù du trôi theo dòng đối lưu",
    image: CREATURE_PNGS["tripod-fish"],
    gallery: [
      CREATURE_PNGS["tripod-fish"],
      "https://static.inaturalist.org/photos/394043196/large.png"
    ],
    facts: [
      {
            title: "Chiếc kiềng ba chân tự nhiên",
            content: "Tia vây bụng và vây đuôi kéo dài tới 1 mét, đóng vai trò như chân chống đỡ cơ thể không bị chìm vào lớp bùn nhão."
      }
],
    isFeatured: false,
  },

  {
    id: "grenadier-fish",
    slug: "ca-duoi-chuot-bien-sau",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Đuôi Chuột Vực Sâu",
    nameEn: "Abyssal Grenadier / Rattail",
    sciName: "Coryphaenoides sp.",
    introHeaderVi: "Kẻ dọn xác thấu thính của vùng bồn trũng; có khứu giác siêu nhạy ngửi được mùi xác cá voi hay động vật chìm xuống từ cách xa nhiều kilomet.",
    introHeaderEn: "Keen-scented scavenger of the deep abyss, pinpointing whale falls and sunken organic matter across miles of barren ocean floor.",
    descVi: "Kẻ dọn xác thấu thính của vùng bồn trũng; có khứu giác siêu nhạy ngửi được mùi xác cá voi hay động vật chìm xuống từ cách xa nhiều kilomet.",
    descEn: "Keen-scented scavenger of the deep abyss, pinpointing whale falls and sunken organic matter across miles of barren ocean floor.",
    depth: "1000m - 4000m",
    size: "0.4m - 0.85m",
    weight: "0.8kg - 3.5kg",
    diet: "Xác cá, động vật thân mềm, tôm biển sâu",
    image: CREATURE_PNGS["grenadier-fish"],
    gallery: [
      CREATURE_PNGS["grenadier-fish"],
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Coryphaenoides_acrolepis.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/65/Coryphaenoides_armatus_Puerto_Rico_April_2015.png"
    ],
    facts: [
      {
            title: "Khứu giác đại dương siêu việt",
            content: "Mũi cá đuối chuột có cấu tạo đặc biệt phát hiện mùi đạm hữu cơ chìm từ cự ly hàng chục hải lý."
      }
],
    isFeatured: false,
  },

  {
    id: "sea-pig",
    slug: "heo-bien-sau-sea-pig",
    category: "echinoderm",
    categoryVi: "Da gai",
    categoryEn: "Echinoderms",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Heo Biển Sâu (Sea Pig)",
    nameEn: "Sea Pig",
    sciName: "Scotoplanes globosa",
    introHeaderVi: "Một dạng hải sâm nước sâu có thân tròn mọng nước và các 'chân' ống bơm phồng bằng dịch lỏng, bước chậm chạp trên bùn đáy rãnh để hút chất hữu cơ.",
    introHeaderEn: "Plump benthic sea cucumber strolling on hydraulic tube feet across abyssal mud plains to extract nutrient-rich sediments.",
    descVi: "Một dạng hải sâm nước sâu có thân tròn mọng nước và các 'chân' ống bơm phồng bằng dịch lỏng, bước chậm chạp trên bùn đáy rãnh để hút chất hữu cơ.",
    descEn: "Plump benthic sea cucumber strolling on hydraulic tube feet across abyssal mud plains to extract nutrient-rich sediments.",
    depth: "3000m - 5016m",
    size: "0.1m - 0.18m",
    weight: "0.05kg - 0.15kg",
    diet: "Chất hữu cơ trong bùn trầm tích",
    image: CREATURE_PNGS["sea-pig"],
    gallery: [
      CREATURE_PNGS["sea-pig"],
      "https://upload.wikimedia.org/wikipedia/commons/a/a3/Scotoplanes_globosa_and_crab_%28cropped%29.jpg",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/11309347/large.jpg"
    ],
    facts: [
      {
            title: "Chân thủy lực bơm dịch",
            content: "Chân ống của heo biển di chuyển hoàn toàn bằng cách bơm nén dịch thể thủy tĩnh bên trong."
      }
],
    isFeatured: false,
  },

  {
    id: "brittle-star",
    slug: "sao-gion-vuc-tham",
    category: "echinoderm",
    categoryVi: "Da gai",
    categoryEn: "Echinoderms",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Sao Giòn Vực Thẳm",
    nameEn: "Abyssal Brittle Star",
    sciName: "Ophiura sarsii",
    introHeaderVi: "Bám trên vách đá bazan dựng đứng của Rãnh Manila; cơ thể mềm dẻo với hàm lượng canxi đặc biệt giúp chúng không bị hòa tan dưới áp suất nước cực cao.",
    introHeaderEn: "Clings to sheer basalt escarpments of the Manila Trench; unique mineralized calcite arms resist dissolution under extreme pressure.",
    descVi: "Bám trên vách đá bazan dựng đứng của Rãnh Manila; cơ thể mềm dẻo với hàm lượng canxi đặc biệt giúp chúng không bị hòa tan dưới áp suất nước cực cao.",
    descEn: "Clings to sheer basalt escarpments of the Manila Trench; unique mineralized calcite arms resist dissolution under extreme pressure.",
    depth: "2500m - 5016m",
    size: "0.05m - 0.12m",
    weight: "0.02kg - 0.08kg",
    diet: "Vụn xác sinh vật, mùn hữu cơ",
    image: CREATURE_PNGS["brittle-star"],
    gallery: [
      CREATURE_PNGS["brittle-star"],
      "https://upload.wikimedia.org/wikipedia/commons/3/31/Ophiura_sarsii.jpg",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/154202786/large.jpg"
    ],
    facts: [
      {
            title: "Tự rụng cánh để trốn",
            content: "Khi bị kẻ thù tóm lấy cánh, sao giòn sẵn sàng bẻ gãy nhánh đó để chạy thoát và sau đó tái sinh lại nhánh mới."
      }
],
    isFeatured: false,
  },

  {
    id: "hadal-snailfish",
    slug: "ca-oc-ranh-sau-hadal-snailfish",
    category: "deep-sea",
    categoryVi: "Sinh vật biển sâu",
    categoryEn: "Deep Sea Life",
    statusVi: "Hiếm gặp",
    statusEn: "Rare",
    statusType: "warning",
    nameVi: "Cá Ốc Rãnh Sâu (Hadal Snailfish)",
    nameEn: "Hadal Snailfish",
    sciName: "Pseudoliparis amblystomopsis",
    introHeaderVi: "Động vật có xương sống thích nghi ở độ sâu giới hạn của sự sống; thân mềm nhũn dạng thạch trong suốt không vảy, không bóng hơi và xương xốp để chịu áp lực nghẹt thở.",
    introHeaderEn: "Deepest known vertebrate family; scaleless gelatinous body devoid of swim bladders and possessing porous bones to withstand crushing pressure.",
    descVi: "Động vật có xương sống thích nghi ở độ sâu giới hạn của sự sống; thân mềm nhũn dạng thạch trong suốt không vảy, không bóng hơi và xương xốp để chịu áp lực nghẹt thở.",
    descEn: "Deepest known vertebrate family; scaleless gelatinous body devoid of swim bladders and possessing porous bones to withstand crushing pressure.",
    depth: "4000m - 5016m",
    size: "0.15m - 0.25m",
    weight: "0.1kg - 0.3kg",
    diet: "Tôm giáp xác amphipod rãnh sâu",
    image: CREATURE_PNGS["hadal-snailfish"],
    gallery: [
      CREATURE_PNGS["hadal-snailfish"],
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Pseudoliparis_swirei.png",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/18324426/large.jpeg"
    ],
    facts: [
      {
            title: "Giới hạn độ sâu của động vật có xương sống",
            content: "Ở độ sâu quá 8,200m, áp lực thẩm thấu làm protein trong tế bào cá bị biến tính, khiến cá ốc là đỉnh cao giới hạn chịu đựng của cá."
      }
],
    isFeatured: false,
  },

  {
    id: "hadal-amphipod",
    slug: "giap-xac-chan-hai-ranh-manila",
    category: "crustacean",
    categoryVi: "Giáp xác",
    categoryEn: "Crustaceans",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Giáp Xác Chân Hai Rãnh Manila",
    nameEn: "Hadal Amphipod (Manila Trench)",
    sciName: "Paralicella caperesca",
    introHeaderVi: "Chạm đáy Rãnh Manila – Điểm sâu nhất Biển Đông (5,016m)! Các loài Amphipoda thuộc họ Lysianassidae là những sinh vật đa dạng nhất ở vùng rãnh sâu Tây Thái Bình Dương, chịu áp suất trên 500 atm nhờ TMAO bảo vệ tế bào, gặm nhấm xác chết và mảnh hữu cơ chìm xuống đáy rãnh.",
    introHeaderEn: "Touchdown at Manila Trench floor (5,016m) — Deepest Point of East Sea! Lysianassid amphipods (Paralicella spp.) are the dominant hadal scavengers of the western Pacific, surviving 500+ atm via TMAO piezolytes, devouring organic falls and carrion.",
    descVi: "Chạm đáy Rãnh Manila – Điểm sâu nhất Biển Đông (5,016m)! Các loài Amphipoda thuộc họ Lysianassidae là những sinh vật đa dạng nhất ở vùng rãnh sâu Tây Thái Bình Dương, chịu áp suất trên 500 atm nhờ TMAO bảo vệ tế bào, gặm nhấm xác chết và mảnh hữu cơ chìm xuống đáy rãnh.",
    descEn: "Touchdown at Manila Trench floor (5,016m) — Deepest Point of East Sea! Lysianassid amphipods (Paralicella spp.) are the dominant hadal scavengers of the western Pacific, surviving 500+ atm via TMAO piezolytes, devouring organic falls and carrion.",
    depth: "4500m - 5016m",
    size: "0.03m - 0.08m",
    weight: "0.005kg - 0.02kg",
    diet: "Xác động vật, cá chết chìm đáy rãnh",
    image: CREATURE_PNGS["hadal-amphipod"],
    gallery: [
      CREATURE_PNGS["hadal-amphipod"],
      "https://inaturalist-open-data.s3.amazonaws.com/photos/175894123/large.jpg"
    ],
    facts: [
      {
            title: "Chất chống áp lực TMAO",
            content: "Tế bào tích tụ nồng độ Trimethylamine N-oxide (TMAO) cực cao để chống lại hiện tượng biến dạng phân tử protein dưới 500 atm."
      }
],
    isFeatured: false,
  },
];

/* Fun Facts Ocean Data */
export const OCEAN_FUN_FACTS = [
  {
    id: "fact-1",
    titleVi: "Biển Đông – Vùng biển đa dạng sinh học hàng đầu thế giới",
    titleEn: "East Sea – A global marine biodiversity hotspot",
    descVi:
      "Biển Đông có diện tích khoảng 3.5 triệu km², là một trong những vùng biển nửa kín lớn nhất hành tinh, nuôi dưỡng hơn 3.000 loài sinh vật biển và hệ sinh thái rạn san hô vô cùng phong phú.",
    descEn:
      "The East Sea spans approximately 3.5 million km² as one of the world's largest semi-enclosed seas, nurturing over 3,000 marine species and vibrant coral ecosystems.",
    statVal: "3.5 triệu km²",
    statTitleVi: "DIỆN TÍCH BIỂN ĐÔNG",
    statTitleEn: "EAST SEA AREA",
    badgeVi: "Địa lý",
    badgeEn: "Geography",
    image: Images.BanDo5DaiDuong,
    emoji: "🌊",
  },
  {
    id: "fact-2",
    titleVi: "Point Nemo – nơi gần nhất là Trạm Vũ Trụ ISS",
    titleEn: "Point Nemo – closest humans are in space on ISS",
    descVi:
      "Vùng biển Point Nemo là nơi xa đất liền nhất trên Trái Đất, cách bờ gần nhất tới 2,688 km. Nơi kỳ lạ đến mức con người ở gần nó nhất chính là các phi hành gia trên trạm vũ trụ khi bay ngang qua phía trên.",
    descEn:
      "Point Nemo is the oceanic pole of inaccessibility, 2,688 km from any land. The closest humans are often astronauts aboard the ISS orbiting 400 km above.",
    statVal: "2,688 km",
    statTitleVi: "KHOẢNG CÁCH TỚI ĐẤT LIỀN GẦN NHẤT",
    statTitleEn: "DISTANCE TO NEAREST LAND",
    badgeVi: "Bí ẩn",
    badgeEn: "Mystery",
    image: Images.CaMapVoi,
    emoji: "🚀",
  },
  {
    id: "fact-3",
    titleVi: "Vành đai Lửa chứa 75% núi lửa toàn thế giới",
    titleEn: "Ring of Fire contains 75% of world's volcanoes",
    descVi:
      "Bao quanh lòng chảo đại dương là một vòng cung núi lửa dài 40,000 km gọi là Vành đai Lửa, tập trung 75% núi lửa đang hoạt động và 90% các trận động đất mạnh nhất thế giới đều xảy ra tại đây.",
    descEn:
      "Surrounding the ocean basin is a 40,000 km volcanic arc called the Ring of Fire, hosting 75% of Earth's active volcanoes and 90% of all major earthquakes.",
    statVal: "90%",
    statTitleVi: "ĐỘNG ĐẤT MẠNH XẢY RA TẠI ĐÂY",
    statTitleEn: "MAJOR EARTHQUAKES OCCUR HERE",
    badgeVi: "Địa chất",
    badgeEn: "Geology",
    image: Images.BachTuotKhongLo,
    emoji: "🌋",
  },
];
