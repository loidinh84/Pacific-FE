import {
  Sparkles,
  Activity,
  Waves,
  Zap,
  Filter,
  Shield,
  Wind,
} from "lucide-react";

/**
 * 6 Hệ cơ quan giải phẫu sinh học biển chuẩn mực
 */
export const ORGAN_SYSTEMS = [
  { id: "all", nameVi: "Tất cả", nameEn: "All", icon: Sparkles },
  {
    id: "circulatory",
    nameVi: "Tuần hoàn & Mang",
    nameEn: "Circulatory & Gills",
    icon: Activity,
  },
  {
    id: "digestive",
    nameVi: "Hệ Tiêu hóa",
    nameEn: "Digestive",
    icon: Waves,
  },
  {
    id: "nervous",
    nameVi: "Thần kinh & Cảm giác",
    nameEn: "Nervous & Sensory",
    icon: Zap,
  },
  {
    id: "excretory",
    nameVi: "Bài tiết & Thẩm thấu",
    nameEn: "Excretory & Osmotic",
    icon: Filter,
  },
  {
    id: "skeletal",
    nameVi: "Khung sụn & Da",
    nameEn: "Skeletal & Dermal",
    icon: Shield,
  },
  {
    id: "respiratory",
    nameVi: "Hô hấp & Phổi",
    nameEn: "Respiratory & Lungs",
    icon: Wind,
  },
];
