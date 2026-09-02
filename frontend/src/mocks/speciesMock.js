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
    descVi: `Bạch tuộc khổng lồ (loài Enteroctopus dofleini, hay bạch tuộc khổng lồ Thái Bình Dương) là một trong những loài bạch tuộc lớn nhất thế giới. Chúng sống chủ yếu ở vùng biển lạnh của Thái Bình Dương, nổi tiếng với trí thông minh cao, khả năng giải quyết vấn đề và ngụy trang vi diệu.`,
    descEn: `The giant Pacific octopus (Enteroctopus dofleini) is one of the largest octopus species in the world. Inhabiting the cold waters of the Pacific, they are renowned for high intelligence, problem-solving skills, and remarkable camouflage abilities.`,
    reverse: true,
    aos: "fade-left",
  },
];

export const CATEGORIES_DATA = [
  { value: "", labelVi: "Nhóm sinh vật", labelEn: "Species Group" },
  { value: "mammal", labelVi: "Động vật có vú", labelEn: "Mammals" },
  { value: "bony-fish", labelVi: "Cá xương", labelEn: "Bony Fish" },
  { value: "cartilage-fish", labelVi: "Cá sụn", labelEn: "Cartilaginous Fish" },
  { value: "mollusk", labelVi: "Động vật thân mềm", labelEn: "Mollusks" },
  { value: "shellfish", labelVi: "Sò ốc", labelEn: "Shellfish" },
  { value: "turtle", labelVi: "Rùa biển", labelEn: "Sea Turtles" },
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
  {
    id: "great-white-shark-1",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Sắp nguy cấp",
    statusEn: "Vulnerable",
    statusType: "warning",
    nameVi: "Cá Mập Trắng Lớn",
    nameEn: "Great White Shark",
    sciName: "Carcharodon carcharias",
    introHeaderVi:
      'Tên khoa học: Carcharodon carcharias là loài cá săn mồi lớn nhất thế giới hiện nay, được mệnh danh là một trong những "hung thần" đỉnh cao của đại dương.',
    introHeaderEn:
      "Scientific name: Carcharodon carcharias is the largest predatory fish in the world today, known as one of the ultimate apex predators of the ocean.",
    descVi:
      "Cá mập trắng lớn là loài cá săn mồi đỉnh cao với khứu giác siêu nhạy và tốc độ bơi vượt trội.",
    descEn:
      "The great white shark is an apex predator with acute sense of smell and formidable speed.",
    image: Images.SharkGallery1,
    gallery: [
      Images.SharkGallery1,
      Images.SharkGallery2,
      Images.SharkGallery3,
      Images.SharkGallery4,
    ],
    anatomyImage: Images.SharkAnatomy,
    fullBioHighlightsVi: [
      {
        title: "Cơ chế máu nóng",
        content:
          "Thuộc họ cá mập Lamnidae, chúng có khả năng duy trì nhiệt độ cơ thể ấm hơn môi trường nước xung quanh. Đặc tính này giúp chúng di chuyển nhanh và săn mồi hiệu quả ở vùng nước lạnh.",
      },
      {
        title: "Kích thước khổng lồ",
        content:
          "Chiều dài cơ thể có thể đạt tới 6 mét và trọng lượng lên đến 2 tấn.",
      },
      {
        title: "Cấu tạo không xương",
        content:
          "Giống như các loài cá mập khác, toàn bộ hệ khung xương của cá mập trắng được cấu tạo từ sụn chứ không phải xương cứng. Da của chúng rất nhám do được phủ một lớp vảy nhỏ như răng sáp.",
      },
      {
        title: "Hàm răng vô tận",
        content:
          "Chúng sở hữu bộ hàm có lực cắn cực mạnh với nhiều hàng răng sắc nhọn. Trong suốt vòng đời, một cá thể có thể thay thế tới 50.000 chiếc răng.",
      },
      {
        title: "Tuổi thọ cao",
        content:
          "Các nghiên cứu khoa học cho thấy cá mập trắng có thể sống vượt quá 70 năm.",
      },
      {
        title: "Địa bàn phân bố",
        content:
          "Tập trung chủ yếu tại các vùng biển ôn đới ven bờ tại Hoa Kỳ, Nam Phi, Úc, Nhật Bản, Chile và Địa Trung Hải. Chúng ưa thích nhiệt độ nước từ 12°C đến 24°C.",
      },
      {
        title: "Săn mồi độc lập",
        content:
          "Thức ăn ưa thích của chúng là các loài động vật có vú biển giàu mỡ như hải cẩu, sư tử biển và cá voi nhỏ.",
      },
      {
        title: "Khắc tinh duy nhất",
        content:
          "Dù là kẻ săn mồi hàng đầu, cá mập trắng vẫn phải khiếp sợ trước cá voi sát thủ (Orca). Orca với trí thông minh và chiến thuật săn mồi theo bầy đàn là loài duy nhất có thể hạ gục cá mập trắng.",
      },
    ],
    fullBioHighlightsEn: [
      {
        title: "Regional Endothermy",
        content:
          "Belonging to the Lamnidae family, they maintain body temperatures higher than surrounding waters, enabling rapid bursts of speed.",
      },
      {
        title: "Massive Size",
        content:
          "Can reach lengths of up to 6 meters (20 ft) and weights exceeding 2 metric tons.",
      },
      {
        title: "Cartilaginous Skeleton",
        content:
          "Full skeletal structure is built of flexible cartilage rather than bone, with dermal denticles providing hydrodynamic skin texture.",
      },
      {
        title: "Endless Teeth Replacement",
        content:
          "Powerful jaws with serrated triangular teeth, capable of cycling through up to 50,000 teeth in a lifetime.",
      },
      {
        title: "Long Lifespan",
        content:
          "Scientific studies show Great White Sharks can live upwards of 70 years.",
      },
      {
        title: "Global Distribution",
        content:
          "Inhabits coastal temperate oceans worldwide, preferring water temperatures between 12°C and 24°C.",
      },
      {
        title: "Apex Hunting",
        content:
          "Prefers fatty marine mammals such as sea lions, seals, and small cetaceans.",
      },
      {
        title: "Only Natural Predator",
        content:
          "Orcas (Killer Whales) are their only known natural predators, using coordinated team tactics.",
      },
    ],
    anatomy: [
      {
        id: "a1",
        x: 18,
        y: 52,
        labelVi: "Hàm răng cưa",
        labelEn: "Serrated Jaws",
        descVi:
          "Bộ hàm có lực cắn cực đại với nhiều lớp răng hình tam giác sắc lẹm.",
        descEn:
          "Jaws with immense bite force and rows of serrated triangular teeth.",
      },
      {
        id: "a2",
        x: 23,
        y: 44,
        labelVi: "Não bộ & Thị giác",
        labelEn: "Brain & Optic Lobe",
        descVi:
          "Thùy thị giác và khứu giác phát triển vượt trội, phát hiện giọt máu từ hàng km.",
        descEn:
          "Highly developed optic and olfactory lobes, detecting blood from miles away.",
      },
      {
        id: "a3",
        x: 29,
        y: 56,
        labelVi: "Khe mang",
        labelEn: "Gill Slits",
        descVi: "5 khe mang lớn lọc oxy liên tục khi bơi qua các dòng hải lưu.",
        descEn:
          "5 large gill slits extracting oxygen continuously while swimming.",
      },
      {
        id: "a4",
        x: 42,
        y: 58,
        labelVi: "Gan tích dầu ",
        labelEn: "Liver ",
        descVi:
          "Gan chiếm tới 28% trọng lượng cơ thể, chứa dầu squalene giúp nổi tự nhiên.",
        descEn:
          "Huge oil-rich liver accounting for up to 28% body mass for buoyancy.",
      },
      {
        id: "a5",
        x: 53,
        y: 59,
        labelVi: "Dạ dày & Van xoắn",
        labelEn: "Stomach & Spiral Valve",
        descVi:
          "Hệ tiêu hóa thích ứng tiêu hóa nhanh các con mồi giàu chất béo.",
        descEn:
          "Digestive system optimized for energy absorption from high-fat marine prey.",
      },
      {
        id: "a6",
        x: 52,
        y: 42,
        labelVi: "Cột sống sụn",
        labelEn: "Vertebral Column",
        descVi: "Cột sống bằng sụn đàn hồi dẻo dai giúp tăng tốc tức thời.",
        descEn:
          "Flexible cartilaginous spinal cord allowing rapid acceleration.",
      },
      {
        id: "a7",
        x: 86,
        y: 52,
        labelVi: "Vây đuôi hình lưỡi liềm",
        labelEn: "Caudal Fin",
        descVi:
          "Vây đuôi đối xứng tạo lực đẩy bùng nổ lên tới 56 km/h khi phóng lên mặt nước.",
        descEn:
          "Symmetrical tail fin delivering explosive propulsion for surface breaches.",
      },
    ],
    anatomyLayers: [
      {
        percent: 100,
        labelVi: "Ngoại hình",
        labelEn: "Exterior",
        descVi: "Hình dạng bên ngoài — da, vây và đường nét cơ thể.",
        descEn: "External appearance — skin, fins and body contour.",
        filter: "none",
        accent: "cyan",
        hotspots: [
          { id: "e1", x: 12, y: 50, labelVi: "Mõm nhọn", labelEn: "Pointed Snout", descVi: "Mõm hình nón nhọn tối ưu hóa khí động học, giảm lực cản nước khi lao vào con mồi.", descEn: "Cone-shaped snout minimizes hydrodynamic drag for high-speed strikes." },
          { id: "e2", x: 32, y: 25, labelVi: "Vây lưng", labelEn: "Dorsal Fin", descVi: "Vây lưng lớn giúp ổn định hướng bơi và là dấu hiệu nhận dạng cá nhân.", descEn: "Large dorsal fin stabilizes swimming trajectory and enables individual ID." },
          { id: "e3", x: 50, y: 65, labelVi: "Vây ngực", labelEn: "Pectoral Fins", descVi: "Cặp vây ngực dài tạo lực nâng như cánh máy bay, kiểm soát độ sâu lặn.", descEn: "Long pectoral fins generate lift like aircraft wings to control diving depth." },
          { id: "e4", x: 88, y: 48, labelVi: "Vây đuôi", labelEn: "Caudal Fin", descVi: "Vây đuôi đối xứng hình lưỡi liềm tạo lực đẩy bùng nổ tới 56 km/h.", descEn: "Symmetrical crescent tail delivers explosive thrust up to 56 km/h." },
          { id: "e5", x: 65, y: 55, labelVi: "Da vảy răng cưa", labelEn: "Dermal Denticles", descVi: "Bề mặt da phủ hàng triệu vảy nhỏ hình răng cưa giảm lực cản và tiếng ồn khi bơi.", descEn: "Millions of tooth-like denticles reduce drag and turbulence noise." }
        ]
      },
      {
        percent: 75,
        labelVi: "Da & Giác quan",
        labelEn: "Skin & Senses",
        descVi: "Lớp da và hệ thống giác quan siêu nhạy bên dưới.",
        descEn: "Skin layer and hyper-sensitive sensory systems beneath.",
        filter: "sepia(0.55) saturate(1.4) brightness(1.05)",
        accent: "amber",
        hotspots: [
          { id: "s1", x: 18, y: 44, labelVi: "Lỗ điện thụ cảm", labelEn: "Ampullae of Lorenzini", descVi: "Hàng trăm lỗ thụ cảm quanh mõm phát hiện điện sinh học cực nhỏ từ tim con mồi.", descEn: "Hundreds of jelly pores detect micro-volt bioelectric fields from prey heartbeats." },
          { id: "s2", x: 50, y: 50, labelVi: "Đường bên", labelEn: "Lateral Line", descVi: "Hệ thống cơ quan nhận rung động áp suất nước kéo dài từ đầu đến đuôi.", descEn: "Pressure-wave receptor system running head to tail detects movement in water." },
          { id: "s3", x: 30, y: 58, labelVi: "Khe mang", labelEn: "Gill Slits", descVi: "5 khe mang lớn trích xuất oxy từ nước biển liên tục trong khi bơi.", descEn: "5 large gill slits extract dissolved oxygen continuously while swimming." },
          { id: "s4", x: 22, y: 38, labelVi: "Mắt & Màng mờ", labelEn: "Eye & Nictitating Membrane", descVi: "Mắt lớn thích nghi nhìn dưới nước, có màng mờ bảo vệ khi tấn công.", descEn: "Large eyes adapted for low-light vision, protected by nictitating membrane during attack." }
        ]
      },
      {
        percent: 50,
        labelVi: "Cơ bắp",
        labelEn: "Muscle Layer",
        descVi: "Hệ cơ bắp mạnh mẽ tạo ra lực bơi và tốc độ tấn công.",
        descEn: "Powerful muscle systems generating propulsion and attack velocity.",
        filter: "hue-rotate(320deg) saturate(2.2) brightness(0.88) contrast(1.1)",
        accent: "rose",
        hotspots: [
          { id: "m1", x: 20, y: 50, labelVi: "Cơ hàm", labelEn: "Jaw Muscles", descVi: "Cơ hàm cực mạnh tạo lực cắn ước tính 18,000 Newton — đủ xuyên qua thép mỏng.", descEn: "Massive jaw muscles deliver an estimated 18,000 N bite force — enough to pierce thin steel." },
          { id: "m2", x: 45, y: 45, labelVi: "Cơ hông bơi", labelEn: "Epaxial Muscles", descVi: "Khối cơ epaxial dọc lưng cung cấp lực đẩy chính khi vẫy đuôi.", descEn: "Dorsal epaxial muscle blocks provide primary propulsive power during tail oscillation." },
          { id: "m3", x: 72, y: 52, labelVi: "Cơ đuôi", labelEn: "Caudal Peduncle Muscles", descVi: "Cơ cuống đuôi đặc biệt cứng chắc, chuyển đổi năng lượng thành lực đẩy tối đa.", descEn: "Rigid caudal peduncle muscles convert stored energy into maximum thrust." },
          { id: "m4", x: 50, y: 60, labelVi: "Cơ vây ngực", labelEn: "Pectoral Muscles", descVi: "Cơ vây ngực điều chỉnh góc vây để kiểm soát hướng lặn và độ sâu.", descEn: "Pectoral fin muscles adjust fin angle for precise depth and direction control." }
        ]
      },
      {
        percent: 25,
        labelVi: "Nội tạng",
        labelEn: "Internal Organs",
        descVi: "Hệ thống nội tạng phức tạp duy trì sự sống và săn mồi.",
        descEn: "Complex organ systems sustaining life and predatory function.",
        filter: "hue-rotate(185deg) saturate(1.9) brightness(0.82) contrast(1.15)",
        accent: "blue",
        hotspots: [
          { id: "o1", x: 18, y: 52, labelVi: "Hàm & Răng", labelEn: "Jaws & Teeth", descVi: "Hàm không gắn vào hộp sọ, đẩy ra ngoài khi đớp mồi. Trong vòng đời thay tới 50,000 răng.", descEn: "Jaws protrude during biting. Up to 50,000 teeth replaced over a lifetime." },
          { id: "o2", x: 28, y: 42, labelVi: "Não & Khứu giác", labelEn: "Brain & Olfactory Lobe", descVi: "Thùy khứu giác chiếm 2/3 não bộ, phát hiện 1 giọt máu trong 100 lít nước biển.", descEn: "Olfactory lobe makes up 2/3 of brain; detects 1 blood drop in 100L seawater." },
          { id: "o3", x: 42, y: 56, labelVi: "Gan tích dầu", labelEn: "Oil-Rich Liver", descVi: "Gan khổng lồ chiếm 28% khối lượng cơ thể, chứa dầu squalene giúp nổi tự nhiên.", descEn: "Massive liver (28% body mass) filled with squalene oil for natural buoyancy." },
          { id: "o4", x: 55, y: 58, labelVi: "Dạ dày & Van xoắn", labelEn: "Stomach & Spiral Valve", descVi: "Van xoắn ruột tăng diện tích hấp thụ gấp 5 lần, tiêu hóa con mồi lớn trong vài ngày.", descEn: "Spiral intestinal valve quintuples absorption area; digests large prey over days." },
          { id: "o5", x: 38, y: 48, labelVi: "Tim 2 ngăn", labelEn: "Two-Chamber Heart", descVi: "Tim 2 ngăn bơm máu giàu oxy qua mạng Rete Mirabile duy trì nhiệt độ cơ thể.", descEn: "Two-chamber heart pumps oxygenated blood through Rete Mirabile heat-exchange network." }
        ]
      },
      {
        percent: 0,
        labelVi: "Xương sụn",
        labelEn: "Cartilage Skeleton",
        descVi: "Bộ khung xương sụn dẻo dai thay thế hoàn toàn xương cứng.",
        descEn: "Flexible cartilaginous skeleton fully replacing rigid bone.",
        filter: "grayscale(1) contrast(1.7) brightness(1.25) invert(0.08)",
        accent: "slate",
        hotspots: [
          { id: "b1", x: 16, y: 48, labelVi: "Hộp sọ sụn", labelEn: "Chondrocranium", descVi: "Hộp sọ sụn bảo vệ não nhẹ hơn xương cứng 30%, giúp tăng tốc linh hoạt hơn.", descEn: "Cartilaginous braincase is 30% lighter than bone, enabling sharper acceleration." },
          { id: "b2", x: 18, y: 56, labelVi: "Xương hàm sụn", labelEn: "Cartilage Jaw", descVi: "Hàm trên (palatoquadrate) và hàm dưới (Meckel's) làm từ sụn cứng hóa khoáng.", descEn: "Upper (palatoquadrate) and lower (Meckel's) jaws of mineralized cartilage." },
          { id: "b3", x: 50, y: 42, labelVi: "Cột sống sụn", labelEn: "Vertebral Column", descVi: "Cột sống gồm hàng trăm đốt sụn xếp chồng, đàn hồi dẻo dai hơn xương cứng.", descEn: "Hundreds of stacked cartilage vertebrae — more elastic and flexible than bone." },
          { id: "b4", x: 30, y: 28, labelVi: "Vòm mang sụn", labelEn: "Gill Arches", descVi: "5 cung mang sụn nâng đỡ khe mang và kiểm soát luồng nước qua hệ hô hấp.", descEn: "5 cartilage gill arches support gill slits and regulate respiratory water flow." }
        ]
      }
    ],
    hasAudio: true,
    audioLabelVi: "Tiếng rền săn mồi thủy âm",
    audioLabelEn: "Hydroacoustic predatory rumble",
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Chondrichthyes",
      order: "Lamniformes",
      family: "Lamnidae",
      genus: "Carcharodon",
      species: "C. carcharias",
    },
    scientificDossierVi: [
      {
        category: "Sinh lý học thích nghi nhiệt",
        title: "Cơ chế máu nóng vùng",
        desc: "Sở hữu mạng lưới mạch máu trao đổi nhiệt ngược dòng (Rete Mirabile), giúp duy trì nhiệt độ cơ bắp và dạ dày cao hơn môi trường nước từ 10°C - 14°C, tăng cường sức bền khi truy đuổi con mồi tại vùng nước sâu lạnh giá.",
      },
      {
        category: "Hệ thống giác quan siêu nhạy",
        title: "Thụ cảm điện trường & Đường bên",
        desc: "Các lỗ thụ cảm điện trường phân bố dày đặc quanh mõm có thể phát hiện dòng điện sinh học cực nhỏ (chỉ 1 phần tỷ volt) phát ra từ cơ bắp hoặc nhịp tim của con mồi đang ẩn mình dưới đáy cát.",
      },
      {
        category: "Cơ học hàm & Nha khoa sinh học",
        title: "Bộ hàm động lực học",
        desc: "Bộ hàm không gắn liền với hộp sọ mà liên kết bằng các dây chằng đàn hồi, cho phép cá mập đẩy hàm ra ngoài khi đớp mồi với lực cắn ước tính lên đến 18,000 Newton (~1.8 tấn lực).",
      },
      {
        category: "Chiến thuật săn mồi & Sinh thái",
        title: "Chiến thuật tấn công Polaris Breach",
        desc: "Thường ẩn mình dưới vùng nước tối sâu thẳm, quan sát bóng con mồi ngược sáng trên mặt nước rồi phóng thẳng đứng với vận tốc lên tới 56 km/h, hất tung con mồi lên khỏi mặt nước.",
      },
    ],
    scientificDossierEn: [
      {
        category: "Thermal Physiology",
        title: "Regional Endothermy (Rete Mirabile)",
        desc: "Counter-current heat exchange vascular network maintains internal muscle and stomach temperatures 10°C - 14°C above ambient water, maximizing power output in cold depths.",
      },
      {
        category: "Advanced Sensory System",
        title: "Electro-reception (Ampullae of Lorenzini)",
        desc: "Hundreds of jelly-filled sensory pores detect microvolt bioelectric fields emitted by prey heartbeats and muscle twitches buried in sand.",
      },
      {
        category: "Jaw Biomechanics",
        title: "Kinetic Jaw Protrusion & Dentition",
        desc: "Jaws dislocate and protrude forward during strikes, delivering an estimated bite force of 18,000 Newtons through rows of serrated enameloid teeth.",
      },
      {
        category: "Trophic Ecology",
        title: "Polaris Breach Ambush Strategy",
        desc: "Stalks from deep oceanic darkness before executing vertical high-speed rushes up to 56 km/h to strike surface pinnipeds.",
      },
    ],
    depth: "0 - 1200m",
    size: "Kích thước: 6m",
    sizeEn: "Size: 6m",
    weight: "2 tấn",
    weightEn: "2 tons",
    lifespan: "70+ năm",
    lifespanEn: "70+ years",
    swimSpeed: "56 km/h",
    isFeatured: true,
  },
  {
    id: "bluefin-tuna-1",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Nguy cấp",
    statusEn: "Endangered",
    statusType: "danger",
    nameVi: "Cá Ngừ Vây Xanh",
    nameEn: "Pacific Bluefin Tuna",
    sciName: "Thunnus orientalis",
    introHeaderVi:
      "Tên khoa học: Thunnus orientalis là loài cá ngừ lớn nhất thế giới, một trong những tay bơi cự phách và bền bỉ nhất của Thái Bình Dương.",
    introHeaderEn:
      "Scientific name: Thunnus orientalis is the largest tuna species in the world, one of the Pacific's fastest and most enduring swimmers.",
    descVi:
      "Loài cá ngừ lớn nhất, di cư xuyên Thái Bình Dương và có giá trị kinh tế cao.",
    descEn:
      "Largest tuna species migrating across the Pacific with high economic value.",
    image: Images.CaMapVoi,
    gallery: [Images.SharkGallery1, Images.SharkGallery2, Images.SharkGallery3],
    anatomyImage: Images.SharkAnatomy,
    fullBioHighlightsVi: [
      {
        title: "Tốc độ đáng kinh ngạc",
        content:
          "Có thể bơi với tốc độ lên tới 70 km/h — một trong những loài cá bơi nhanh nhất đại dương.",
      },
      {
        title: "Hành trình di cư nghìn dặm",
        content:
          "Di cư quãng đường dài hàng ngàn km qua Thái Bình Dương mỗi năm từ Nhật Bản đến bờ biển Bắc Mỹ.",
      },
      {
        title: "Cơ chế máu nóng từng phần",
        content:
          "Duy trì thân nhiệt cao hơn nước xung quanh để cơ bắp hoạt động hiệu quả tối đa ở vùng nước lạnh.",
      },
      {
        title: "Tầm quan trọng sinh thái",
        content:
          "Đóng vai trò quan trọng trong chuỗi thức ăn đại dương và đang được bảo vệ nghiêm ngặt.",
      },
    ],
    fullBioHighlightsEn: [
      {
        title: "Blistering Speed",
        content:
          "Capable of swimming at speeds up to 70 km/h, among the fastest open-ocean fish.",
      },
      {
        title: "Epic Migration",
        content:
          "Migrates thousands of miles across the Pacific between Asian and North American coasts.",
      },
      {
        title: "Partial Warm-Bloodedness",
        content:
          "Maintains elevated muscle temperatures for peak swimming performance in cold depths.",
      },
      {
        title: "Ecological Value",
        content:
          "Plays a vital top-tier predator role in open pelagic ecosystems.",
      },
    ],
    depth: "0 - 550m",
    size: "Kích thước: 3m",
    sizeEn: "Size: 3m",
    weight: "450kg",
    weightEn: "450kg",
    lifespan: "15-20 năm",
    lifespanEn: "15-20 years",
    isFeatured: true,
  },
  {
    id: "whale-shark-2",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Nguy cấp",
    statusEn: "Endangered",
    statusType: "danger",
    nameVi: "Cá Mập Voi Thái Bình Dương",
    nameEn: "Whale Shark",
    sciName: "Rhincodon typus",
    introHeaderVi:
      "Tên khoa học: Rhincodon typus là loài cá lớn nhất còn tồn tại trên hành tinh, gã khổng lồ hiền lành của các đại dương ấm áp.",
    introHeaderEn:
      "Scientific name: Rhincodon typus is the largest known living fish species, a gentle giant of warm tropical oceans.",
    descVi: "Gã khổng lồ hiền lành ăn vi sinh vật phù du lớn nhất đại dương.",
    descEn:
      "Gentle giant filter feeder and the largest fish species in the ocean.",
    image: Images.CaMapVoi,
    gallery: [Images.CaMapVoi, Images.SharkGallery1, Images.SharkGallery4],
    anatomyImage: Images.SharkAnatomy,
    fullBioHighlightsVi: [
      {
        title: "Kích thước vô địch",
        content:
          "Chiều dài lên đến 18-20 mét và nặng tới hơn 20 tấn — lớn hơn cả một chiếc xe buýt hai tầng.",
      },
      {
        title: "Chế độ ăn hiền lành",
        content:
          "Mặc dù là cá mập, chúng chỉ ăn sinh vật phù du, tép và cá nhỏ bằng cách lọc nước qua mang.",
      },
      {
        title: "Vân đốm độc nhất",
        content:
          "Hoa văn đốm trắng trên lưng mỗi con cá mập voi là duy nhất, không trùng lặp như dấu vân tay của con người.",
      },
      {
        title: "Tuổi thọ thế kỷ",
        content:
          "Có thể sống từ 70 đến 150 năm, di chuyển chậm rãi qua các rạn san hô nhiệt đới.",
      },
    ],
    fullBioHighlightsEn: [
      {
        title: "Colossal Dimensions",
        content:
          "Reaches lengths up to 18-20 meters and weighs over 20 metric tons.",
      },
      {
        title: "Gentle Filter Feeding",
        content:
          "Feeds exclusively on plankton, krill, and small fish by filtering thousands of liters of seawater.",
      },
      {
        title: "Unique Pattern Fingerprint",
        content:
          "Distinct star-like spot patterns on their back identify each individual uniquely.",
      },
      {
        title: "Centennial Lifespan",
        content:
          "Can live 70 to 150 years, cruising peacefully across tropical reef habitats.",
      },
    ],
    anatomy: [
      {
        id: "a1",
        x: 78,
        y: 42,
        labelVi: "Miệng lọc",
        labelEn: "Filter mouth",
        descVi:
          "Miệng rộng tới 1.5m, lọc hàng ngàn lít nước mỗi giờ để lấy thức ăn.",
        descEn:
          "Mouth up to 1.5m wide, filtering thousands of liters per hour for food.",
      },
      {
        id: "a2",
        x: 55,
        y: 30,
        labelVi: "Mang cá",
        labelEn: "Gill slits",
        descVi: "5 cặp mang lớn giúp lọc oxy và thức ăn cùng lúc.",
        descEn:
          "5 pairs of large gill slits filter oxygen and food simultaneously.",
      },
      {
        id: "a3",
        x: 35,
        y: 50,
        labelVi: "Vây lưng",
        labelEn: "Dorsal fin",
        descVi: "Vây lưng cao giúp ổn định khi bơi và nhận biết loài.",
        descEn:
          "Tall dorsal fin aids stability during swimming and species identification.",
      },
      {
        id: "a4",
        x: 18,
        y: 38,
        labelVi: "Vây đuôi",
        labelEn: "Caudal fin",
        descVi: "Vây đuôi hình lưỡi liềm tạo lực đẩy mạnh dù bơi chậm.",
        descEn:
          "Crescent-shaped tail fin generates strong thrust despite slow swimming.",
      },
      {
        id: "a5",
        x: 65,
        y: 62,
        labelVi: "Hoa văn đốm",
        labelEn: "Spot pattern",
        descVi:
          "Hoa văn đốm trắng độc nhất vô nhị như vân tay, giúp nhận dạng cá thể.",
        descEn:
          "Unique white spot patterns like fingerprints enable individual identification.",
      },
    ],
    anatomyLayers: [
      {
        percent: 100,
        labelVi: "Ngoại hình",
        labelEn: "Exterior",
        descVi: "Hình dạng bên ngoài — da, vây và đường nét cơ thể.",
        descEn: "External appearance — skin, fins and body contour.",
        filter: "none",
        accent: "cyan",
        hotspots: [
          { id: "e1", x: 78, y: 42, labelVi: "Miệng lọc khổng lồ", labelEn: "Giant Filter Mouth", descVi: "Miệng rộng 1.5m, lọc hàng ngàn lít nước mỗi giờ để lấy sinh vật phù du.", descEn: "1.5m-wide mouth filters thousands of liters per hour for plankton." },
          { id: "e2", x: 35, y: 30, labelVi: "Vây lưng", labelEn: "Dorsal Fin", descVi: "Vây lưng cao đặc trưng giúp ổn định khi bơi và nhận dạng cá thể.", descEn: "Distinctive tall dorsal fin aids stability and individual identification." },
          { id: "e3", x: 18, y: 38, labelVi: "Vây đuôi lưỡi liềm", labelEn: "Crescent Caudal Fin", descVi: "Vây đuôi hình lưỡi liềm tạo lực đẩy ổn định dù bơi tốc độ chậm.", descEn: "Crescent-shaped caudal fin generates steady thrust at low speeds." },
          { id: "e4", x: 65, y: 62, labelVi: "Hoa văn đốm trắng", labelEn: "White Spot Pattern", descVi: "Mỗi cá thể có hoa văn đốm độc nhất như dấu vân tay con người.", descEn: "Each individual has unique white spot patterns like human fingerprints." }
        ]
      },
      {
        percent: 75,
        labelVi: "Da & Giác quan",
        labelEn: "Skin & Senses",
        descVi: "Lớp da đặc biệt và hệ giác quan dưới da.",
        descEn: "Specialized skin and sub-dermal sensory systems.",
        filter: "sepia(0.5) saturate(1.3) brightness(1.05)",
        accent: "amber",
        hotspots: [
          { id: "s1", x: 70, y: 44, labelVi: "Tấm lược mang", labelEn: "Gill Rakers", descVi: "Tấm lược dạng lưới tại mang giữ lại sinh vật phù du khi lọc nước.", descEn: "Mesh-like gill rakers trap plankton and small fish from filtered water." },
          { id: "s2", x: 55, y: 30, labelVi: "Khe mang", labelEn: "Gill Slits", descVi: "5 cặp mang khổng lồ xử lý lượng nước khổng lồ liên tục khi bơi.", descEn: "5 massive gill pairs process enormous water volumes while swimming." },
          { id: "s3", x: 40, y: 55, labelVi: "Da nhám vi tảo", labelEn: "Rough Denticled Skin", descVi: "Da phủ vảy răng cưa nhỏ (dermal denticles) giảm lực cản khi bơi.", descEn: "Skin covered in tiny dermal denticles that reduce hydrodynamic drag." }
        ]
      },
      {
        percent: 50,
        labelVi: "Cơ bắp",
        labelEn: "Muscle Layer",
        descVi: "Hệ cơ bắp vận động mạnh mẽ bên dưới lớp da.",
        descEn: "Powerful locomotion muscle system beneath the skin.",
        filter: "hue-rotate(320deg) saturate(2) brightness(0.88) contrast(1.1)",
        accent: "rose",
        hotspots: [
          { id: "m1", x: 50, y: 45, labelVi: "Cơ bơi lưng", labelEn: "Epaxial Swimming Muscles", descVi: "Khối cơ epaxial dọc sống lưng tạo chuyển động vẫy đuôi nhịp nhàng.", descEn: "Dorsal epaxial muscle blocks drive rhythmic tail oscillation for propulsion." },
          { id: "m2", x: 25, y: 50, labelVi: "Cơ ngực", labelEn: "Pectoral Muscles", descVi: "Cơ vây ngực điều chỉnh góc vây để kiểm soát độ sâu và hướng bơi.", descEn: "Pectoral fin muscles adjust angle for precise depth and direction control." },
          { id: "m3", x: 75, y: 50, labelVi: "Cơ cuống đuôi", labelEn: "Peduncle Muscles", descVi: "Cơ cuống đuôi cứng chắc chuyển đổi lực cơ thành lực đẩy hiệu quả.", descEn: "Rigid peduncle muscles efficiently convert muscle force to propulsion." }
        ]
      },
      {
        percent: 25,
        labelVi: "Nội tạng",
        labelEn: "Internal Organs",
        descVi: "Hệ thống nội tạng duy trì cơ thể gã khổng lồ đại dương.",
        descEn: "Organ systems sustaining this ocean giant.",
        filter: "hue-rotate(185deg) saturate(1.8) brightness(0.82) contrast(1.15)",
        accent: "blue",
        hotspots: [
          { id: "o1", x: 60, y: 52, labelVi: "Gan khổng lồ", labelEn: "Massive Liver", descVi: "Gan rất lớn lưu trữ dầu squalene giúp cơ thể nổi không tốn năng lượng.", descEn: "Enormous liver stores squalene oil enabling effortless passive buoyancy." },
          { id: "o2", x: 45, y: 58, labelVi: "Dạ dày lọc", labelEn: "Filter Stomach", descVi: "Dạ dày xử lý lượng lớn sinh khối phù du được nuốt cùng nước biển.", descEn: "Stomach processes huge biomass of plankton swallowed with seawater." },
          { id: "o3", x: 35, y: 44, labelVi: "Tim 2 ngăn", labelEn: "Two-Chamber Heart", descVi: "Tim bơm máu oxy đến toàn bộ cơ thể khổng lồ dài tới 18 mét.", descEn: "Heart pumps oxygenated blood throughout a body reaching 18 meters." }
        ]
      },
      {
        percent: 0,
        labelVi: "Xương sụn",
        labelEn: "Cartilage Skeleton",
        descVi: "Bộ khung xương sụn nhẹ nâng đỡ cơ thể khổng lồ.",
        descEn: "Lightweight cartilage skeleton supporting the giant body.",
        filter: "grayscale(1) contrast(1.7) brightness(1.25) invert(0.08)",
        accent: "slate",
        hotspots: [
          { id: "b1", x: 75, y: 45, labelVi: "Hộp sọ sụn", labelEn: "Chondrocranium", descVi: "Hộp sọ sụn nhẹ bảo vệ não và hệ giác quan của loài lớn nhất đại dương.", descEn: "Lightweight cartilage cranium protects the brain of the ocean's largest fish." },
          { id: "b2", x: 50, y: 40, labelVi: "Cột sống sụn", labelEn: "Vertebral Column", descVi: "Hàng trăm đốt sụn tạo cột sống dẻo dai chịu được áp lực bơi liên tục.", descEn: "Hundreds of cartilage vertebrae form a flexible spine for continuous swimming." },
          { id: "b3", x: 28, y: 38, labelVi: "Vây sụn", labelEn: "Fin Cartilage", descVi: "Các vây được nâng đỡ bởi tia sụn (ceratotrichia) linh hoạt thay cho xương.", descEn: "Fins supported by flexible ceratotrichia cartilage rays instead of bone." }
        ]
      }
    ],
    depth: "0 - 1900m",
    size: "Kích thước: 18m",
    sizeEn: "Size: 18m",
    weight: "20 tấn",
    weightEn: "20 tons",
    lifespan: "70-150 năm",
    lifespanEn: "70-150 years",
    isFeatured: true,
  },
  {
    id: "giant-octopus-3",
    category: "mollusk",
    categoryVi: "Động vật thân mềm",
    categoryEn: "Mollusk",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Bạch Tuộc Khổng Lồ",
    nameEn: "Giant Pacific Octopus",
    sciName: "Enteroctopus dofleini",
    introHeaderVi:
      "Tên khoa học: Enteroctopus dofleini là loài bạch tuộc lớn và thông minh nhất thế giới, bậc thầy ngụy trang dưới đáy biển Thái Bình Dương.",
    introHeaderEn:
      "Scientific name: Enteroctopus dofleini is the largest and most intelligent octopus species, the master of camouflage in the Pacific abyss.",
    descVi: "Loài bạch tuộc thông minh bậc nhất với sải tay dài tới 6 mét.",
    descEn:
      "Highly intelligent octopus species with arm spans reaching up to 6 meters.",
    image: Images.BachTuotKhongLo,
    gallery: [Images.BachTuotKhongLo, Images.FishHidden],
    fullBioHighlightsVi: [
      {
        title: "Trí thông minh siêu việt",
        content:
          "Có khả năng mở nắp lọ, giải mê cung, sử dụng công cụ và nhận diện từng người chăm sóc khác nhau.",
      },
      {
        title: "Bậc thầy biến hình",
        content:
          "Có thể thay đổi màu sắc và kết cấu bề mặt da chỉ trong một phần mười giây để hòa lẫn vào san hô và đá ngầm.",
      },
      {
        title: "Hệ tuần hoàn 3 trái tim",
        content:
          "Sở hữu 3 trái tim và dòng máu màu xanh lam do chứa đồng (hemocyanin) giúp vận chuyển oxy tối ưu trong nước lạnh.",
      },
      {
        title: "Sải tay khổng lồ",
        content:
          "Sải tay vươn dài tới 6 mét, trang bị hàng trăm giác hút có khả năng nếm và giữ chặt con mồi.",
      },
    ],
    fullBioHighlightsEn: [
      {
        title: "Advanced Problem-Solving",
        content:
          "Capable of opening childproof jars, navigating complex mazes, and recognizing individual human handlers.",
      },
      {
        title: "Dynamic Camouflage",
        content:
          "Can transform color and 3D skin texture within fractions of a second to match surroundings.",
      },
      {
        title: "Three Hearts & Blue Blood",
        content:
          "Possesses three hearts and copper-rich blue hemocyanin blood for efficient oxygen transport in cold depths.",
      },
      {
        title: "Massive Arm Reach",
        content:
          "Arm span reaching over 6 meters with hundreds of sensitive chemical-sensing suction cups.",
      },
    ],
    depth: "0 - 1500m",
    size: "Kích thước: 6m",
    sizeEn: "Size: 6m",
    weight: "50kg",
    weightEn: "50kg",
    lifespan: "3-5 năm",
    lifespanEn: "3-5 years",
    isFeatured: true,
  },
  {
    id: "clownfish-4",
    category: "bony-fish",
    categoryVi: "Cá xương",
    categoryEn: "Bony Fish",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Hề San Hô",
    nameEn: "Clown Anemonefish",
    sciName: "Amphiprion ocellaris",
    descVi:
      "Sống cộng sinh tuyệt vời bên trong các bụi hải quỳ độc tại các rạn san hô.",
    descEn:
      "Symbiotic fish living safely among venomous sea anemones in coral reefs.",
    depth: "1 - 15m",
    size: "Kích thước: 11cm",
    sizeEn: "Size: 11cm",
    image: Images.CaMapVoi,
    isFeatured: false,
  },
  {
    id: "sea-turtle-5",
    category: "turtle",
    categoryVi: "Rùa biển",
    categoryEn: "Sea Turtle",
    statusVi: "Sắp nguy cấp",
    statusEn: "Vulnerable",
    statusType: "warning",
    nameVi: "Rùa Xanh Biển Honu",
    nameEn: "Green Sea Turtle",
    sciName: "Chelonia mydas",
    descVi:
      "Biểu tượng may mắn của biển Thái Bình Dương, di cư hàng ngàn dặm để đẻ trứng.",
    descEn:
      "Symbol of good luck in the Pacific, migrating thousands of miles to nest.",
    depth: "0 - 100m",
    size: "Kích thước: 1.5m",
    sizeEn: "Size: 1.5m",
    image: Images.BachTuotKhongLo,
    isFeatured: false,
  },
  {
    id: "dolphin-6",
    category: "mammal",
    categoryVi: "Động vật có vú",
    categoryEn: "Mammal",
    statusVi: "Ít quan tâm",
    statusEn: "Least Concern",
    statusType: "safe",
    nameVi: "Cá Heo Mỏ Vịt Thái Bình Dương",
    nameEn: "Pacific Bottlenose Dolphin",
    sciName: "Tursiops gilli",
    descVi:
      "Loài động vật biển thông minh và thân thiện với khả năng định vị bằng siêu âm.",
    descEn:
      "Intelligent and friendly marine mammal capable of echolocation navigation.",
    depth: "0 - 300m",
    size: "Kích thước: 3.8m",
    sizeEn: "Size: 3.8m",
    image: Images.CaMapVoi,
    isFeatured: false,
  },
  {
    id: "blue-whale-7",
    category: "mammal",
    categoryVi: "Động vật có vú",
    categoryEn: "Mammal",
    statusVi: "Nguy cấp",
    statusEn: "Endangered",
    statusType: "danger",
    nameVi: "Cá Voi Xanh Khổng Lồ",
    nameEn: "Pacific Blue Whale",
    sciName: "Balaenoptera musculus",
    descVi:
      "Động vật lớn nhất từng tồn tại trên Trái Đất với trái tim to bằng một chiếc ô tô.",
    descEn:
      "The largest animal ever known to have lived on Earth with a heart the size of a car.",
    depth: "0 - 500m",
    size: "Kích thước: 30m",
    sizeEn: "Size: 30m",
    image: Images.CaMapVoi,
    isFeatured: false,
  },
  {
    id: "chambered-nautilus-8",
    category: "shellfish",
    categoryVi: "Sò ốc",
    categoryEn: "Shellfish",
    statusVi: "Sắp nguy cấp",
    statusEn: "Vulnerable",
    statusType: "warning",
    nameVi: "Ốc Vòi Voi Hóa Thạch Sống",
    nameEn: "Chambered Nautilus",
    sciName: "Nautilus pompilius",
    descVi:
      "Hóa thạch sống tồn tại suốt 500 triệu năm với vỏ xoắn ốc đối xứng hoàn hảo.",
    descEn:
      "Living fossil existing for 500 million years with a perfectly spiral shell.",
    depth: "100 - 700m",
    size: "Kích thước: 20cm",
    sizeEn: "Size: 20cm",
    image: Images.BachTuotKhongLo,
    isFeatured: false,
  },
  {
    id: "mantaray-9",
    category: "cartilage-fish",
    categoryVi: "Cá sụn",
    categoryEn: "Cartilaginous Fish",
    statusVi: "Sắp nguy cấp",
    statusEn: "Vulnerable",
    statusType: "warning",
    nameVi: "Cá Đuối Khổng Lồ Manta",
    nameEn: "Oceanic Manta Ray",
    sciName: "Mobula birostris",
    descVi:
      "Loài cá đuối lớn nhất thế giới bơi lượn như cánh chim trong nước đại dương.",
    descEn:
      "The world's largest ray species gliding gracefully like underwater wings.",
    depth: "0 - 1000m",
    size: "Kích thước: 7m",
    sizeEn: "Size: 7m",
    image: Images.CaMapVoi,
    isFeatured: false,
  },
];

/* Fun Facts Ocean Data */
export const OCEAN_FUN_FACTS = [
  {
    id: "fact-1",
    titleVi: "Thái Bình Dương lớn hơn tổng diện tích đất liền",
    titleEn: "Pacific is larger than all landmass combined",
    descVi:
      "Thái Bình Dương có diện tích khoảng 165.2 triệu km² — lớn hơn tổng diện tích tất cả lục địa trên Trái Đất cộng lại. Có thể chứa toàn bộ lục địa mà vẫn còn thừa không gian!",
    descEn:
      "The Pacific Ocean covers about 165.2 million km² — larger than all Earth's landmasses combined. It could easily contain all continents with space to spare!",
    statVal: "165 triệu km²",
    statTitleVi: "DIỆN TÍCH THÁI BÌNH DƯƠNG",
    statTitleEn: "PACIFIC OCEAN AREA",
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
      "Bao quanh Thái Bình Dương là một vòng cung núi lửa dài 40,000 km gọi là Vành đai Lửa, tập trung 75% núi lửa đang hoạt động và 90% các trận động đất mạnh nhất thế giới đều xảy ra tại đây.",
    descEn:
      "Surrounding the Pacific is a 40,000 km volcanic arc called the Ring of Fire, hosting 75% of Earth's active volcanoes and 90% of all major earthquakes.",
    statVal: "90%",
    statTitleVi: "ĐỘNG ĐẤT MẠNH XẢY RA TẠI ĐÂY",
    statTitleEn: "MAJOR EARTHQUAKES OCCUR HERE",
    badgeVi: "Địa chất",
    badgeEn: "Geology",
    image: Images.BachTuotKhongLo,
    emoji: "🌋",
  },
];
