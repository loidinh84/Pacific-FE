import { FlaskConical, Activity, Bone, Brain, Zap } from "lucide-react";

/**
 * System configuration for organ classification.
 * Each key maps to display color, labels, and icon for a biological system.
 */
export const SYSTEM_CONFIG = {
  all: {
    color: "#94A3B8",
    labelVi: "Tất cả",
    labelEn: "All Systems",
    Icon: null,
  },
  nervous: {
    color: "#F59E0B",
    labelVi: "Thần kinh",
    labelEn: "Nervous",
    Icon: Brain,
  },
  circulatory: {
    color: "#EF4444",
    labelVi: "Tuần hoàn",
    labelEn: "Circulatory",
    Icon: Activity,
  },
  digestive: {
    color: "#10B981",
    labelVi: "Tiêu hóa",
    labelEn: "Digestive",
    Icon: FlaskConical,
  },
  skeletal: {
    color: "#06B6D4",
    labelVi: "Xương & Sụn",
    labelEn: "Skeletal",
    Icon: Bone,
  },
  muscular: {
    color: "#8B5CF6",
    labelVi: "Cơ & Vây",
    labelEn: "Muscular",
    Icon: Zap,
  },
};
