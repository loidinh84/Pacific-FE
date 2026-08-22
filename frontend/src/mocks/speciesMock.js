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
  { value: "fish", labelVi: "Cá biển", labelEn: "Marine Fish" },
  { value: "mollusk", labelVi: "Thân mềm", labelEn: "Mollusks" },
  { value: "crustacean", labelVi: "Giáp xác", labelEn: "Crustaceans" },
];

export const HABITATS_DATA = [
  { value: "", labelVi: "Môi trường sống", labelEn: "Habitat Environment" },
  { value: "deep", labelVi: "Đại dương sâu thẳm", labelEn: "Deep Ocean Abyss" },
  { value: "shallow", labelVi: "Vùng nước nông ven biển", labelEn: "Coastal Shallow Waters" },
  { value: "reef", labelVi: "Rạn san hô", labelEn: "Coral Reefs" },
  { value: "polar", labelVi: "Vùng cực lạnh giá", labelEn: "Polar Ice Waters" },
];
