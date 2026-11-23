// 10 phân vùng biển và khu bảo tồn trọng điểm Biển Đông (Dữ liệu địa lý chuẩn)
export const EAST_SEA_ZONES = [
  {
    id: "hoang-sa",
    nameVi: "Quần đảo Hoàng Sa",
    nameEn: "Paracel Islands",
    lat: 16.5333,
    lng: 112.0333,
    coordText: "16°32' B, 112°02' Đ",
    depth: "1.322 m",
    categoryVi: "Quần đảo & Rạn san hô ngoài khơi",
    categoryEn: "Archipelago & Offshore Coral Reefs",
    descVi:
      "Vùng rạn san hô trù phú giữa Biển Đông, là nơi sinh sản và kiếm ăn quan trọng của hàng trăm loài cá biển nhiệt đới.",
    descEn:
      "Vibrant oceanic reef complex in the central East Sea hosting over 200 coral species and vital spawning grounds for tropical marine fish.",
    residentSpecies: [],
  },
  {
    id: "truong-sa",
    nameVi: "Quần đảo Trường Sa",
    nameEn: "Spratly Islands",
    lat: 8.6447,
    lng: 111.9194,
    coordText: "8°38' B, 111°55' Đ",
    depth: "5.016 m",
    categoryVi: "Quần đảo & Vùng biển sâu",
    categoryEn: "Archipelago & Deep Sea Waters",
    descVi:
      "Vùng biển nhiệt đới rộng lớn với các rạn san hô bao quanh vực sâu, là hành lang di cư của rùa biển, cá heo và cá voi.",
    descEn:
      "Expansive tropical marine archipelago bordered by 5,000m oceanic trenches, a critical migratory corridor for cetaceans and pelagic tuna.",
    residentSpecies: [],
  },
  {
    id: "con-dao",
    nameVi: "Vườn Quốc gia Côn Đảo",
    nameEn: "Con Dao National Park MPA",
    lat: 8.6833,
    lng: 106.6000,
    coordText: "8°41' B, 106°36' Đ",
    depth: "35 m",
    categoryVi: "Vùng bảo tồn đất ngập nước Ramsar",
    categoryEn: "Ramsar Marine Wetland Reserve",
    descVi:
      "Khu bảo tồn biển sinh thái mẫu mực của Việt Nam, nơi bảo vệ đàn bò biển (Dugong) quý hiếm và bãi đẻ lớn nhất của rùa biển xanh.",
    descEn:
      "Model marine protected area in southern Vietnam safeguarding endangered Dugongs and the nation's largest green turtle nesting rookeries.",
    residentSpecies: [],
  },
  {
    id: "phu-quoc",
    nameVi: "Khu Bảo tồn Biển Phú Quốc",
    nameEn: "Phu Quoc Marine Reserve",
    lat: 10.1500,
    lng: 103.9500,
    coordText: "10°09' B, 103°57' Đ",
    depth: "20 m",
    categoryVi: "Khu dự trữ sinh quyển ven đảo",
    categoryEn: "Island Biosphere Reserve",
    descVi:
      "Hệ sinh thái thảm cỏ biển lớn nhất Vịnh Thái Lan, sinh cảnh kiếm ăn của bò biển Dugong, cá heo và hơn 100 loài san hô cứng.",
    descEn:
      "Largest seagrass ecosystem in the Gulf of Thailand, crucial forage habitat for dugongs and over 100 scleractinian coral species.",
    residentSpecies: [],
  },
  {
    id: "nha-trang",
    nameVi: "Vịnh Nha Trang & Hòn Mun",
    nameEn: "Nha Trang Bay & Hon Mun MPA",
    lat: 12.2167,
    lng: 109.2833,
    coordText: "12°13' B, 109°17' Đ",
    depth: "45 m",
    categoryVi: "Khu bảo tồn biển rạn san hô",
    categoryEn: "Coral Reef Sanctuary",
    descVi:
      "Khu bảo tồn biển đầu tiên của Việt Nam với độ đa dạng sinh học san hô cao nhất, quy tụ cá hề, cá thiên thần và đồi mồi.",
    descEn:
      "Vietnam's premier marine protected area featuring exceptional coral biodiversity, clownfish colonies, and hawksbill turtle foraging grounds.",
    residentSpecies: [],
  },
  {
    id: "cu-lao-cham",
    nameVi: "Khu BTTB Cù Lao Chàm",
    nameEn: "Cu Lao Cham Biosphere Reserve",
    lat: 15.9600,
    lng: 108.5100,
    coordText: "15°57' B, 108°31' Đ",
    depth: "45 m",
    categoryVi: "Khu dự trữ sinh quyển thế giới",
    categoryEn: "UNESCO Biosphere Reserve",
    descVi:
      "Cụm đảo đá granit ngoài khơi Quảng Nam nổi tiếng với rạn san hô nguyên vẹn, sinh cảnh của cua đá đặc hữu và các loài thân mềm quý hiếm.",
    descEn:
      "Granitic archipelago off Quang Nam renowned for intact fringing reefs, endemic land crabs, and abundant benthic invertebrates.",
    residentSpecies: [],
  },
  {
    id: "ha-long",
    nameVi: "Vịnh Hạ Long & Bái Tử Long",
    nameEn: "Ha Long & Bai Tu Long Bays",
    lat: 20.8800,
    lng: 107.1500,
    coordText: "20°52' B, 107°09' Đ",
    depth: "25 m",
    categoryVi: "Vịnh đảo đá vôi & Rừng ngập mặn",
    categoryEn: "Karst Islands & Mangroves",
    descVi:
      "Hệ thống đảo đá vôi và hang ngập nước đặc sắc, nơi trú ngụ của nhiều loài hải sản quý và hệ sinh thái rừng ngập mặn ven bờ.",
    descEn:
      "Unique drowned Karst limestone archipelago with mangrove mudflats, submerged sea caves, and diverse marine mollusks.",
    residentSpecies: [],
  },
  {
    id: "bach-long-vi",
    nameVi: "Đảo Bạch Long Vĩ",
    nameEn: "Bach Long Vi Island MPA",
    lat: 20.1333,
    lng: 107.7167,
    coordText: "20°08' B, 107°43' Đ",
    depth: "55 m",
    categoryVi: "Vùng biển đảo Vịnh Bắc Bộ",
    categoryEn: "Gulf of Tonkin Outpost",
    descVi:
      "Đảo xa bờ trung tâm Vịnh Bắc Bộ, là ngư trường giàu có với bào ngư chín lỗ, hải sâm và nhiều loài cá tầng đáy.",
    descEn:
      "Central outpost island in the Gulf of Tonkin, preserving nine-hole abalones, sea cucumbers, and valuable demersal fish stocks.",
    residentSpecies: [],
  },
  {
    id: "hon-cau",
    nameVi: "Khu bảo tồn Hòn Cau",
    nameEn: "Hon Cau Marine Reserve",
    lat: 11.2333,
    lng: 108.8333,
    coordText: "11°14' B, 108°50' Đ",
    depth: "30 m",
    categoryVi: "Vùng biển trồi & Thềm san hô cổ",
    categoryEn: "Upwelling Zone & Ancient Reefs",
    descVi:
      "Vùng hiện tượng nước trồi dinh dưỡng cao tại Bình Thuận, sở hữu các rạn san hô ngầm nguyên sơ dài hơn 2 km và bãi đẻ rùa biển.",
    descEn:
      "Nutrient-rich coastal upwelling zone in Binh Thuan with 2km of untouched submerged coral reefs and vital sea turtle nesting grounds.",
    residentSpecies: [],
  },
  {
    id: "manila-trench",
    nameVi: "Vực thẳm Manila Biển Đông",
    nameEn: "Manila Trench Oceanic Abyss",
    lat: 14.3500,
    lng: 117.5000,
    coordText: "14°21' B, 117°30' Đ",
    depth: "5.353 m",
    categoryVi: "Vực thẳm biển sâu Hadal Zone",
    categoryEn: "Deep Sea Hadal Trench",
    descVi:
      "Điểm sâu nhất Biển Đông (5.353m) với áp suất trên 500 atm, bóng tối tuyệt đối, sinh cảnh của cá ốc rãnh sâu, giáp xác khổng lồ và miệng phun thủy nhiệt Haima.",
    descEn:
      "Deepest abyss in the East Sea (5,353m) under extreme hydrostatic pressure, home to hadal snailfish, supergiant amphipods, and Haima cold seeps.",
    residentSpecies: [],
  },
];

// Danh mục phân loại sinh vật trên bản đồ đồng bộ 100% với CSDL
export const CREATURE_MAP_CATEGORIES = [
  { id: "all", labelVi: "Tất cả", labelEn: "All", color: "#0284c7" },
  { id: "ca-bien", labelVi: "Cá biển", labelEn: "Fishes", color: "#0284c7" },
  { id: "than-mem-khong-xuong-song", labelVi: "Thân mềm", labelEn: "Mollusks", color: "#d97706" },
  { id: "san-ho-thuc-vat-bien", labelVi: "San hô", labelEn: "Corals", color: "#e11d48" },
  { id: "dong-vat-co-vu-bien", labelVi: "Thú biển", labelEn: "Mammals", color: "#059669" },
  { id: "bo-sat-bien", labelVi: "Bò sát", labelEn: "Reptiles", color: "#10b981" },
  { id: "sinh-vat-bien-sau", labelVi: "Biển sâu", labelEn: "Deep Sea", color: "#6366f1" },
];

export const CATEGORY_COLORS = {
  "ca-bien": "#0284c7",
  "than-mem-khong-xuong-song": "#d97706",
  "san-ho-thuc-vat-bien": "#e11d48",
  "dong-vat-co-vu-bien": "#059669",
  "bo-sat-bien": "#10b981",
  "sinh-vat-bien-sau": "#6366f1",
};

// Nguồn bản đồ chuẩn với zoom ceiling an toàn
export const BASEMAP_PROVIDERS = {
  ocean: {
    labelVi: "Độ sâu & Đáy biển",
    labelEn: "Ocean Depth & Terrain",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, GEBCO, NOAA",
    maxNativeZoom: 9,
    maxZoom: 10,
  },
  satellite: {
    labelVi: "Ảnh Vệ tinh",
    labelEn: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
    maxNativeZoom: 10,
    maxZoom: 11,
  },
  topo: {
    labelVi: "Bản đồ Địa lý",
    labelEn: "Geographic Map",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, USGS",
    maxNativeZoom: 11,
    maxZoom: 12,
  },
};
