import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  RotateCcw,
  Eye,
  Box,
  Layers,
  Info,
  Camera,
  Volume2,
  VolumeX,
  Scissors,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/**
 * Âm thanh nhịp tim sinh học bằng Web Audio API
 */
function playHeartbeatSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // First lub
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(75, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.12);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Second dub
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(60, now + 0.16);
    osc2.frequency.exponentialRampToValueAtTime(28, now + 0.28);
    gain2.gain.setValueAtTime(0.35, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.29);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.16);
    osc2.stop(now + 0.3);
  } catch {
    // Ignore audio permission errors
  }
}

// ── DANH MỤC 15 HỆ CƠ QUAN GIẢI PHẪU CÁ MẬP SINH HỌC TOÀN DIỆN ──
const SHARK_PARTS_METADATA = [
  {
    id: "part_chassis",
    nameVi: "Cột sống & Khung sọ sụn",
    nameEn: "Cartilaginous Spine & Cranium",
    descVi:
      "Khung xương sụn đàn hồi gia cố khoáng vôi prismatic, nhẹ hơn xương thật 50% giúp cá mập bơi linh hoạt và tiết kiệm năng lượng",
    descEn:
      "Flexible chondroskeleton reinforced with prismatic calcification, 50% lighter than bone",
    vector: [0, 1.25, 0],
  },
  {
    id: "part_brain",
    nameVi: "Não bộ & Thùy khứu giác",
    nameEn: "Encephalon & Olfactory Bulbs",
    descVi:
      "Bộ não 5 phần phân hóa cao với thùy khứu giác chiếm 2/3 thể tích não, giúp phát hiện 1 giọt máu loãng trong hàng triệu lít nước biển",
    descEn:
      "Five-part brain with massive olfactory bulbs detecting a single drop of blood miles away",
    vector: [-0.6, 1.45, 0.45],
  },
  {
    id: "part_ampullae",
    nameVi: "Bóng cảm biến điện trường",
    nameEn: "Ampullae of Lorenzini",
    descVi:
      "Mạng lưới túi thụ cảm chứa gel bán dẫn sinh học ở mõm, cảm nhận điện trường siêu yếu (0.005 μV/cm) từ nhịp tim con mồi ẩn dưới cát",
    descEn:
      "Subdermal network of jelly-filled pores detecting minute bioelectric fields from prey heartbeats",
    vector: [-1.4, 0.45, 0],
  },
  {
    id: "part_gills",
    nameVi: "Hệ thống lá mang lược",
    nameEn: "Vascular Gill Lamellae",
    descVi:
      "Hàng trăm nếp gấp lá mang mỏng giàu mao mạch đính trên 5 cung mang, trao đổi oxy và giải phóng CO2 trực tiếp vào dòng nước",
    descEn:
      "Hundreds of rich vascular filaments on 5 branchial arches facilitating countercurrent gas exchange",
    vector: [-0.4, -0.65, 0.75],
  },
  {
    id: "part_pectoral_girdle",
    nameVi: "Đai sụn vây ngực",
    nameEn: "Pectoral Coracoid Girdle",
    descVi:
      "Khung sụn cánh cung chữ U nằm ngang dưới ngực, làm điểm tựa cơ học vững chắc cho đôi vây ngực tạo lực nâng thủy động khi bơi",
    descEn:
      "U-shaped cartilaginous hoop supporting pectoral fins to generate crucial hydrodynamic lift",
    vector: [-0.25, -1.05, 0],
  },
  {
    id: "part_heart",
    nameVi: "Tim 2 ngăn cơ bắp",
    nameEn: "Two-Chambered Contractile Heart",
    descVi:
      "Tâm thất dày cơ bắp co bóp 2 pha nhịp nhàng cùng tâm nhĩ, bơm dòng máu khử oxy qua nón động mạch có van bán nguyệt lên các khe mang",
    descEn:
      "Two-chambered muscular pump driving deoxygenated blood through the conus arteriosus to the gills",
    vector: [-0.35, -1.45, 0.35],
  },
  {
    id: "part_vessels",
    nameVi: "Động mạch chủ & Hệ mạch máu",
    nameEn: "Dorsal Aorta & Vascular System",
    descVi:
      "Mạch máu áp lực cao chạy dọc ngay sát dưới sống lưng, phân nhánh nuôi dưỡng toàn bộ cơ quan nội tạng và các khối cơ vân bơi lội",
    descEn:
      "High-pressure tubular trunk running beneath the vertebrae, feeding vital organs and muscle blocks",
    vector: [0.05, 0.8, 0.25],
  },
  {
    id: "part_kidneys",
    nameVi: "Cặp thận dải dẹp",
    nameEn: "Elongated Opisthonephric Kidneys",
    descVi:
      "Hai dải thận dẹp màu nâu sẫm áp sát sống lưng từ ngực đến đuôi, tái hấp thu urê và duy trì áp suất thẩm thấu đẳng trương với nước biển",
    descEn:
      "Dark ribbons beneath the spine retaining urea to maintain osmotic equilibrium with saltwater",
    vector: [0.2, 0.95, -0.3],
  },
  {
    id: "part_liver",
    nameVi: "Gan dầu Squalene & Túi mật",
    nameEn: "Tri-lobed Squalene Liver & Gallbladder",
    descVi:
      "Cơ quan nội tạng lớn nhất chiếm 25% trọng lượng cơ thể, chứa dầu squalene tỷ trọng nhẹ giúp cá mập duy trì sức nổi tự nhiên thay cho bong bóng cá",
    descEn:
      "Massive organ occupying 25% body mass, saturated with low-density squalene oil for hydrostatic buoyancy",
    vector: [0.35, -1.2, -0.75],
  },
  {
    id: "part_stomach",
    nameVi: "Dạ dày hình chữ J & Lá lách",
    nameEn: "J-Shaped Stomach & Spleen",
    descVi:
      "Khoang cơ bắp giãn nở cực lớn tiết acid pH 1.5 tiêu hóa xương, kèm lá lách đỏ thẫm ôm dọc bờ cong lớn lọc và sản xuất hồng cầu",
    descEn:
      "Expandable muscular sac secreting potent pH 1.5 acid to dissolve bones, flanked by lymphoid spleen",
    vector: [0.1, 0.35, -0.6],
  },
  {
    id: "part_pancreas",
    nameVi: "Tuyến tụy tiêu hóa",
    nameEn: "Bilobed Pancreas",
    descVi:
      "Khối tuyến 2 thùy kẹp ngay khúc uốn giữa môn vị dạ dày và ruột tá tràng, tiết các enzyme protease và lipase đậm đặc phân giải thịt mỡ",
    descEn:
      "Two lobes nestled in the duodenal crook secreting enzymes for lipid and protein digestion",
    vector: [0.2, -0.15, -0.85],
  },
  {
    id: "part_spiral_valve",
    nameVi: "Ruột van xoắn ốc",
    nameEn: "Spiral Valve Intestine",
    descVi:
      "Cấu trúc nếp gấp xoắn ốc ốc xoay liên tục giúp tăng gấp 5 lần diện tích hấp thụ dinh dưỡng trong khoang bụng ngắn của loài săn mồi",
    descEn:
      "Remarkable helical folds multiplying mucosal absorption area tenfold within a compact abdominal length",
    vector: [0.75, -0.7, 0.45],
  },
  {
    id: "part_rectal_gland",
    nameVi: "Tuyến trực tràng lọc muối",
    nameEn: "Salt-Secreting Rectal Gland",
    descVi:
      "Tuyến hình ngón tay nhỏ ở cuối ruột, chủ động bơm bài tiết dung dịch muối NaCl nồng độ siêu cao gấp 2 lần nước biển để chống ngộ độc muối",
    descEn:
      "Digital finger-like gland actively pumping out sodium chloride at twice seawater concentration",
    vector: [1.05, -0.85, -0.25],
  },
  {
    id: "part_lateral_line",
    nameVi: "Đường bên thụ cảm cơ học",
    nameEn: "Lateral Line Mechanoreceptive Canals",
    descVi:
      "Hệ thống ống ngầm chứa tế bào lông chạy dọc hai bên mạn sườn, cảm nhận những dao động sóng nước và áp lực rung chấn từ con mồi đang quẫy",
    descEn:
      "Fluid-filled subdermal canals with hair cells registering water vibrations and hydrodynamic wake",
    vector: [0.0, 0.35, 1.8],
  },
  {
    id: "part_skin",
    nameVi: "Lớp da vảy nhám Placoid & Thân ngoài",
    nameEn: "Dermal Denticles & Hydrodynamic Skin",
    descVi:
      "Lớp da bao bọc phủ triệu vi vảy nhám răng placoid giúp triệt tiêu ma sát xoáy nước, bơi lội hoàn toàn tĩnh lặng khi tiếp cận con mồi",
    descEn:
      "Armor of microscopic tooth-like placoid scales disrupting vortex turbulence for silent stealth swimming",
    vector: [0, 0, 2.6],
  },
];

/**
 * Xây dựng các cơ quan nội tạng 3D mềm mại, hữu cơ sinh học
 */
function createOrganicInternalOrgans() {
  const organGroup = new THREE.Group();
  organGroup.name = "Shark_Internal_Organs";

  const parts = [];

  // ── 1. CỘT SỐNG & HỘP SỌ SỤN ──
  const spineGroup = new THREE.Group();
  spineGroup.name = "part_chassis";
  spineGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_chassis",
  );

  const vertMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.15,
  });

  // Hộp sọ sụn Chondrocranium bán trong suốt để thấy bộ não bên trong
  const craniumMat = new THREE.MeshStandardMaterial({
    color: 0xdbeafe,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.62,
  });

  const craniumGeo = new THREE.SphereGeometry(0.19, 24, 24);
  craniumGeo.scale(1.2, 0.55, 0.72);
  const craniumMesh = new THREE.Mesh(craniumGeo, craniumMat);
  craniumMesh.position.set(-1.75, -0.04, 0);
  spineGroup.add(craniumMesh);

  // Mõm sụn Rostrum (thanh sụn hội tụ ở chóp mũi)
  const rostrumCenter = new THREE.CylinderGeometry(0.012, 0.008, 0.45, 8);
  rostrumCenter.rotateZ(Math.PI / 2);
  const rCMesh = new THREE.Mesh(rostrumCenter, craniumMat);
  rCMesh.position.set(-2.05, -0.08, 0);
  spineGroup.add(rCMesh);

  // Hốc mắt sụn hai bên (Optic capsules)
  const opticL = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.012, 8, 16),
    craniumMat,
  );
  opticL.position.set(-1.75, -0.02, 0.17);
  spineGroup.add(opticL);

  const opticR = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.012, 8, 16),
    craniumMat,
  );
  opticR.position.set(-1.75, -0.02, -0.17);
  spineGroup.add(opticR);

  // 5 đôi cung mang sụn (5 Branchial arches) ở vùng hầu họng
  const archMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0x9f1239,
    emissiveIntensity: 0.3,
    roughness: 0.35,
  });
  for (let g = 0; g < 5; g++) {
    const gx = -1.35 + g * 0.065;
    const archG = new THREE.TorusGeometry(
      0.14 - g * 0.008,
      0.01,
      8,
      16,
      Math.PI * 1.1,
    );
    archG.rotateY(Math.PI / 2);
    archG.rotateZ(-Math.PI / 8);
    const archLeft = new THREE.Mesh(archG, archMat);
    archLeft.position.set(gx, -0.22, 0.12);
    spineGroup.add(archLeft);

    const archRight = new THREE.Mesh(archG, archMat);
    archRight.position.set(gx, -0.22, -0.12);
    archRight.rotation.y = -Math.PI / 2;
    spineGroup.add(archRight);
  }

  // Chuỗi 25 đốt sống 3D uốn lượn tự nhiên theo sống lưng bên trong mô cơ
  for (let i = 0; i < 25; i++) {
    const t = i / 24;
    const x = -1.45 + t * 3.4;
    const y = 0.08 - 0.06 * t - 0.18 * t * t;
    const radius = 0.058 * (1 - t * 0.55);

    const vGeo = new THREE.CylinderGeometry(radius, radius, 0.088, 14);
    vGeo.rotateZ(Math.PI / 2);
    const vMesh = new THREE.Mesh(vGeo, vertMat);
    vMesh.position.set(x, y, 0);
    spineGroup.add(vMesh);

    // Cung thần kinh (Neural spines) hướng lên sống lưng, nằm gọn trong cơ
    if (i % 2 === 0 && i < 20) {
      const ribHeight = 0.055 * (1 - t * 0.5);
      const ribGeo = new THREE.CylinderGeometry(0.014, 0.014, ribHeight, 8);
      const ribMesh = new THREE.Mesh(ribGeo, vertMat);
      ribMesh.position.set(x, y + 0.042 * (1 - t * 0.5), 0);
      spineGroup.add(ribMesh);
    }
  }

  organGroup.add(spineGroup);
  parts.push(spineGroup);

  // ── 2. QUẢ TIM CƠ BẮP CÁ MẬP SINH HỌC (Heart) ──
  const heartGroup = new THREE.Group();
  heartGroup.name = "part_heart";
  heartGroup.userData = SHARK_PARTS_METADATA.find((p) => p.id === "part_heart");

  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.35,
    roughness: 0.28,
    metalness: 0.15,
  });

  // Tâm thất dày hình nón cơ bắp (Ventriculus pyramidalis)
  const ventGeo = new THREE.SphereGeometry(0.13, 28, 28);
  const vPos = ventGeo.attributes.position;
  for (let i = 0; i < vPos.count; i++) {
    let x = vPos.getX(i);
    let y = vPos.getY(i);
    let z = vPos.getZ(i);
    const t = (y + 0.13) / 0.26; // 0 ở đỉnh tim, 1 ở đáy tim
    const taper = 0.38 + 0.62 * Math.pow(t, 0.75);
    x *= taper * 0.95;
    z *= taper * 0.85;
    if (z > 0) z *= 1.2;
    if (t > 0.85) {
      x *= 0.94;
      z *= 0.94;
    }
    vPos.setXYZ(i, x, y, z);
  }
  ventGeo.computeVertexNormals();
  const ventricle = new THREE.Mesh(ventGeo, heartMat);
  ventricle.position.set(-1.08, -0.38, 0);
  heartGroup.add(ventricle);

  // Mạch vành đỏ tươi chạy rẽ nhánh trên bề mặt cơ tim
  const coronaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.08, -0.32, 0.08),
    new THREE.Vector3(-1.06, -0.37, 0.07),
    new THREE.Vector3(-1.09, -0.42, 0.04),
  ]);
  const coronaryGeo = new THREE.TubeGeometry(
    coronaryCurve,
    16,
    0.008,
    6,
    false,
  );
  const coronaryMat = new THREE.MeshStandardMaterial({
    color: 0xff0040,
    emissive: 0xff0040,
    emissiveIntensity: 0.8,
  });
  const coronary = new THREE.Mesh(coronaryGeo, coronaryMat);
  heartGroup.add(coronary);

  // Tâm nhĩ vách mỏng hình bán nguyệt ôm sau đáy thất (Atrium cordis)
  const atriumMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239,
    emissive: 0x4c0519,
    emissiveIntensity: 0.2,
    roughness: 0.32,
  });
  const atriumGeo = new THREE.SphereGeometry(0.095, 20, 20);
  atriumGeo.scale(1.3, 0.9, 0.85);
  const atrium = new THREE.Mesh(atriumGeo, atriumMat);
  atrium.position.set(-0.96, -0.31, 0);
  heartGroup.add(atrium);

  // Nón động mạch có van (Conus arteriosus) dẫn máu lên hệ cung mang
  const conusGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.12, 16);
  conusGeo.rotateZ(Math.PI / 2);
  const conus = new THREE.Mesh(conusGeo, heartMat);
  conus.position.set(-1.18, -0.38, 0);
  heartGroup.add(conus);

  // Các vòng van bán nguyệt trên nón động mạch
  for (let r = 0; r < 3; r++) {
    const ringG = new THREE.TorusGeometry(0.042, 0.006, 6, 16);
    ringG.rotateY(Math.PI / 2);
    const ringM = new THREE.Mesh(ringG, heartMat);
    ringM.position.set(-1.14 - r * 0.03, -0.38, 0);
    heartGroup.add(ringM);
  }

  organGroup.add(heartGroup);
  parts.push(heartGroup);

  // ── 3. HỆ THỐNG ĐỘNG MẠCH CHỦ VÀ MAO MẠCH 3D (Vessels) ──
  const vesselsGroup = new THREE.Group();
  vesselsGroup.name = "part_vessels";
  vesselsGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_vessels",
  );

  const vesselMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });

  // Động mạch chủ lưng chạy ngay dưới cột sống
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.4, 0.02, 0),
    new THREE.Vector3(-0.7, 0.05, 0),
    new THREE.Vector3(0.0, 0.02, 0),
    new THREE.Vector3(0.8, -0.04, 0),
    new THREE.Vector3(1.5, -0.13, 0),
    new THREE.Vector3(1.9, -0.19, 0),
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.022, 10, false);
  const aortaMesh = new THREE.Mesh(aortaGeo, vesselMat);
  vesselsGroup.add(aortaMesh);

  // Các nhánh mao mạch phân nhánh xuống tạng và vách cơ thể
  const branches = [-0.5, 0.0, 0.6, 1.2];
  branches.forEach((bx, idx) => {
    const branchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(bx, 0.03 - idx * 0.03, 0),
      new THREE.Vector3(
        bx + 0.05,
        -0.12 - idx * 0.02,
        idx % 2 === 0 ? 0.12 : -0.12,
      ),
      new THREE.Vector3(
        bx + 0.08,
        -0.28 - idx * 0.01,
        idx % 2 === 0 ? 0.08 : -0.08,
      ),
    ]);
    const branchGeo = new THREE.TubeGeometry(branchCurve, 16, 0.014, 8, false);
    const branchMesh = new THREE.Mesh(branchGeo, vesselMat);
    vesselsGroup.add(branchMesh);
  });

  organGroup.add(vesselsGroup);
  parts.push(vesselsGroup);

  // ── 4. GAN DẦU SQUALENE 3 THÙY HỮU CƠ (Tri-lobed Squalene Liver) ──
  const liverGroup = new THREE.Group();
  liverGroup.name = "part_liver";
  liverGroup.userData = SHARK_PARTS_METADATA.find((p) => p.id === "part_liver");

  const liverMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    emissive: 0x78350f,
    emissiveIntensity: 0.22,
    roughness: 0.24,
    metalness: 0.12,
  });

  // Hàm tạo thùy gan uốn lượn hữu cơ hình thuyền (loại bỏ hoàn toàn hình khối nón thô)
  const createOrganicLiverLobe = (isLeft) => {
    const zSign = isLeft ? 1 : -1;
    const cyl = new THREE.CylinderGeometry(0.12, 0.04, 1.25, 24, 20);
    cyl.rotateZ(Math.PI / 2);
    const pos = cyl.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const t = (x + 0.625) / 1.25;

      z *= 0.55;
      const thickness = 0.35 + 0.65 * Math.sin(t * Math.PI * 0.85);
      y *= thickness;
      z *= thickness;
      z += Math.sin(t * Math.PI) * 0.05 * zSign;
      y -= (1 - t) * 0.05;

      pos.setXYZ(i, x, y, z);
    }
    cyl.computeVertexNormals();
    const lobe = new THREE.Mesh(cyl, liverMat);
    lobe.position.set(-0.15, -0.35, zSign * 0.17);
    return lobe;
  };

  const leftLobe = createOrganicLiverLobe(true);
  const rightLobe = createOrganicLiverLobe(false);
  liverGroup.add(leftLobe);
  liverGroup.add(rightLobe);

  // Thùy giữa (Median lobe)
  const medianCyl = new THREE.CylinderGeometry(0.06, 0.03, 0.42, 16, 12);
  medianCyl.rotateZ(Math.PI / 2);
  const medianPos = medianCyl.attributes.position;
  for (let i = 0; i < medianPos.count; i++) {
    medianPos.setZ(i, medianPos.getZ(i) * 0.6);
  }
  medianCyl.computeVertexNormals();
  const medianLobe = new THREE.Mesh(medianCyl, liverMat);
  medianLobe.position.set(-0.42, -0.38, 0);
  liverGroup.add(medianLobe);

  // Túi mật (Gallbladder) hình giọt nước ngọc bích
  const gallMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x065f46,
    emissiveIntensity: 0.35,
    roughness: 0.18,
  });
  const gallGeo = new THREE.SphereGeometry(0.042, 16, 16);
  gallGeo.scale(1.4, 0.8, 0.8);
  const gallbladder = new THREE.Mesh(gallGeo, gallMat);
  gallbladder.position.set(-0.35, -0.41, 0.02);
  liverGroup.add(gallbladder);

  // Ống mật (Bile duct) nối vào tá tràng
  const bileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, -0.41, 0.02),
    new THREE.Vector3(-0.25, -0.38, 0.03),
    new THREE.Vector3(-0.15, -0.34, 0.02),
  ]);
  const bileGeo = new THREE.TubeGeometry(bileCurve, 12, 0.007, 6, false);
  const bileDuct = new THREE.Mesh(bileGeo, gallMat);
  liverGroup.add(bileDuct);

  organGroup.add(liverGroup);
  parts.push(liverGroup);

  // ── 5. DẠ DÀY HÌNH CHỮ J CƠ BẮP (J-Shaped Muscular Stomach) ──
  const stomachGroup = new THREE.Group();
  stomachGroup.name = "part_stomach";
  stomachGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_stomach",
  );

  const stomachMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xd97706,
    emissiveIntensity: 0.18,
    roughness: 0.35,
  });

  // Dạ dày uốn hình chữ J nằm giữa hai thùy gan
  const stomachCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.85, -0.22, 0),
    new THREE.Vector3(-0.45, -0.24, -0.01),
    new THREE.Vector3(-0.1, -0.25, 0.01),
    new THREE.Vector3(0.08, -0.27, 0.02),
    new THREE.Vector3(-0.04, -0.33, 0.05),
  ]);
  const stomachGeo = new THREE.TubeGeometry(stomachCurve, 36, 0.085, 16, false);
  const stomachMesh = new THREE.Mesh(stomachGeo, stomachMat);
  stomachGroup.add(stomachMesh);

  // Vòng cơ môn vị (Pyloric sphincter)
  const pylorusGeo = new THREE.TorusGeometry(0.065, 0.018, 10, 18);
  pylorusGeo.rotateY(Math.PI / 4);
  const pylorus = new THREE.Mesh(pylorusGeo, stomachMat);
  pylorus.position.set(-0.04, -0.33, 0.05);
  stomachGroup.add(pylorus);

  // Lá lách (Spleen) màu đỏ mận sẫm ôm dọc bờ cong lớn dạ dày
  const spleenMat = new THREE.MeshStandardMaterial({
    color: 0x6b21a8,
    emissive: 0x3b0764,
    emissiveIntensity: 0.3,
    roughness: 0.3,
  });
  const spleenGeo = new THREE.SphereGeometry(0.06, 16, 16);
  spleenGeo.scale(1.8, 0.65, 0.7);
  const spleen = new THREE.Mesh(spleenGeo, spleenMat);
  spleen.position.set(0.02, -0.26, -0.06);
  stomachGroup.add(spleen);

  organGroup.add(stomachGroup);
  parts.push(stomachGroup);

  // ── 6. RUỘT VAN XOẮN ỐC LIÊN TỤC (Spiral Valve Intestine) ──
  const valveGroup = new THREE.Group();
  valveGroup.name = "part_spiral_valve";
  valveGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_spiral_valve",
  );

  // Vỏ ruột bán trong suốt để nhìn thấy cấu trúc xoắn ốc tuyệt mỹ bên trong
  const valveSheathMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x047857,
    emissiveIntensity: 0.25,
    roughness: 0.25,
    transparent: true,
    opacity: 0.5,
  });

  const valveCylGeo = new THREE.CylinderGeometry(0.085, 0.07, 0.54, 20);
  valveCylGeo.rotateZ(Math.PI / 2);
  const valveCylinder = new THREE.Mesh(valveCylGeo, valveSheathMat);
  valveCylinder.position.set(0.48, -0.26, 0);
  valveGroup.add(valveCylinder);

  // Trục lõi trung tâm
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x047857,
    roughness: 0.3,
  });
  const coreGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.54, 12);
  coreGeo.rotateZ(Math.PI / 2);
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.set(0.48, -0.26, 0);
  valveGroup.add(coreMesh);

  // Cánh van xoắn ốc liên tục 3D (Helical spiral baffle)
  const spiralMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x059669,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });

  const spiralPoints = [];
  const turns = 4.5;
  const spiralLen = 0.5;
  for (let s = 0; s <= 70; s++) {
    const st = s / 70;
    const angle = st * turns * Math.PI * 2;
    const sx = 0.23 + st * spiralLen;
    const sy = -0.26 + Math.sin(angle) * 0.06;
    const sz = Math.cos(angle) * 0.06;
    spiralPoints.push(new THREE.Vector3(sx, sy, sz));
  }
  const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
  const spiralTube = new THREE.TubeGeometry(spiralCurve, 64, 0.014, 8, false);
  const spiralMesh = new THREE.Mesh(spiralTube, spiralMat);
  valveGroup.add(spiralMesh);

  organGroup.add(valveGroup);
  parts.push(valveGroup);

  // ── 7. BỘ NÃO CÁ MẬP SINH HỌC 5 PHẦN (Encephalon) ──
  const brainGroup = new THREE.Group();
  brainGroup.name = "part_brain";
  brainGroup.userData = SHARK_PARTS_METADATA.find((p) => p.id === "part_brain");

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xca8a04,
    emissiveIntensity: 0.35,
    roughness: 0.25,
  });

  // 1. Thùy khứu giác khổng lồ (Olfactory bulbs) ở 2 bên lỗ mũi
  const bulbGeo = new THREE.SphereGeometry(0.045, 16, 16);
  bulbGeo.scale(1.4, 0.85, 0.85);
  const leftBulb = new THREE.Mesh(bulbGeo, brainMat);
  leftBulb.position.set(-2.0, -0.05, 0.065);
  brainGroup.add(leftBulb);

  const rightBulb = new THREE.Mesh(bulbGeo, brainMat);
  rightBulb.position.set(-2.0, -0.05, -0.065);
  brainGroup.add(rightBulb);

  // 2. Cuống khứu giác (Olfactory tracts)
  const tractGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.16, 8);
  tractGeo.rotateZ(Math.PI / 2);
  const leftTract = new THREE.Mesh(tractGeo, brainMat);
  leftTract.position.set(-1.88, -0.035, 0.055);
  brainGroup.add(leftTract);

  const rightTract = new THREE.Mesh(tractGeo, brainMat);
  rightTract.position.set(-1.88, -0.035, -0.055);
  brainGroup.add(rightTract);

  // 3. Bán cầu đại não (Cerebral hemispheres)
  const hemiGeo = new THREE.SphereGeometry(0.062, 16, 16);
  hemiGeo.scale(1.15, 0.9, 0.9);
  const leftHemi = new THREE.Mesh(hemiGeo, brainMat);
  leftHemi.position.set(-1.76, -0.02, 0.042);
  brainGroup.add(leftHemi);

  const rightHemi = new THREE.Mesh(hemiGeo, brainMat);
  rightHemi.position.set(-1.76, -0.02, -0.042);
  brainGroup.add(rightHemi);

  // 4. Tiểu não hình thoi nhô cao (Cerebellum)
  const cereGeo = new THREE.SphereGeometry(0.055, 14, 14);
  cereGeo.scale(1.3, 1.1, 0.9);
  const cerebellum = new THREE.Mesh(cereGeo, brainMat);
  cerebellum.position.set(-1.64, 0.01, 0);
  brainGroup.add(cerebellum);

  // 5. Hành não (Medulla oblongata) nối liền vào tủy sống
  const medullaGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.14, 10);
  medullaGeo.rotateZ(Math.PI / 2);
  const medulla = new THREE.Mesh(medullaGeo, brainMat);
  medulla.position.set(-1.52, 0.03, 0);
  brainGroup.add(medulla);

  organGroup.add(brainGroup);
  parts.push(brainGroup);

  // ── 8. MẠNG LƯỚI BÓNG ĐIỆN TRƯỜNG LORENZINI (Ampullae of Lorenzini) ──
  const ampullaeGroup = new THREE.Group();
  ampullaeGroup.name = "part_ampullae";
  ampullaeGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_ampullae"
  );

  const ampMat = new THREE.MeshStandardMaterial({
    color: 0xa3e635,
    emissive: 0x4d7c0f,
    emissiveIntensity: 0.5,
    roughness: 0.25,
  });

  const ampPores = [
    [-2.32, -0.11, 0.025],
    [-2.32, -0.11, -0.025],
    [-2.22, -0.07, 0.06],
    [-2.22, -0.07, -0.06],
    [-2.15, -0.14, 0.09],
    [-2.15, -0.14, -0.09],
    [-2.05, -0.17, 0.12],
    [-2.05, -0.17, -0.12],
    [-1.94, -0.03, 0.15],
    [-1.94, -0.03, -0.15],
  ];

  ampPores.forEach(([px, py, pz]) => {
    const bGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const bMesh = new THREE.Mesh(bGeo, ampMat);
    bMesh.position.set(px, py, pz);
    ampullaeGroup.add(bMesh);

    const zInner = pz > 0 ? 0.06 : -0.06;
    const cCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(px, py, pz),
      new THREE.Vector3((px + -1.82) * 0.5, (py + -0.04) * 0.5, (pz + zInner) * 0.5),
      new THREE.Vector3(-1.82, -0.04, zInner),
    ]);
    const cGeo = new THREE.TubeGeometry(cCurve, 8, 0.005, 6, false);
    const cMesh = new THREE.Mesh(cGeo, ampMat);
    ampullaeGroup.add(cMesh);
  });

  organGroup.add(ampullaeGroup);
  parts.push(ampullaeGroup);

  // ── 9. HỆ THỐNG LÁ MANG LƯỢC ĐỎ TƯƠI (Gill Filaments & Lamellae) ──
  const gillsGroup = new THREE.Group();
  gillsGroup.name = "part_gills";
  gillsGroup.userData = SHARK_PARTS_METADATA.find((p) => p.id === "part_gills");

  const gillMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    emissive: 0x881337,
    emissiveIntensity: 0.35,
    roughness: 0.28,
  });

  for (let g = 0; g < 5; g++) {
    const gx = -1.35 + g * 0.07;
    for (let f = 0; f < 6; f++) {
      const ft = f / 5;
      const fy = -0.04 - ft * 0.22;
      const fz = 0.13 + Math.sin(ft * Math.PI) * 0.08;

      const fGeo = new THREE.BoxGeometry(0.026, 0.022, 0.055);
      fGeo.rotateX(0.18);
      const filL = new THREE.Mesh(fGeo, gillMat);
      filL.position.set(gx + (f % 2 === 0 ? 0.008 : -0.008), fy, fz);
      gillsGroup.add(filL);

      const filR = new THREE.Mesh(fGeo, gillMat);
      filR.position.set(gx + (f % 2 === 0 ? 0.008 : -0.008), fy, -fz);
      filR.rotation.y = Math.PI;
      gillsGroup.add(filR);
    }
  }

  organGroup.add(gillsGroup);
  parts.push(gillsGroup);

  // ── 10. ĐAI SỤN VÂY NGỰC (Pectoral Girdle / Coracoid Bar) ──
  const girdleGroup = new THREE.Group();
  girdleGroup.name = "part_pectoral_girdle";
  girdleGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_pectoral_girdle"
  );

  const girdleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.95, -0.22, 0.42),
    new THREE.Vector3(-0.95, -0.38, 0.22),
    new THREE.Vector3(-0.95, -0.42, 0.0),
    new THREE.Vector3(-0.95, -0.38, -0.22),
    new THREE.Vector3(-0.95, -0.22, -0.42),
  ]);
  const girdleGeo = new THREE.TubeGeometry(girdleCurve, 20, 0.026, 8, false);
  const girdleMesh = new THREE.Mesh(girdleGeo, vertMat);
  girdleGroup.add(girdleMesh);

  organGroup.add(girdleGroup);
  parts.push(girdleGroup);

  // ── 11. CẶP THẬN DẢI DẸP (Opisthonephric Kidneys) ──
  const kidneysGroup = new THREE.Group();
  kidneysGroup.name = "part_kidneys";
  kidneysGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_kidneys"
  );

  const kidneyMat = new THREE.MeshStandardMaterial({
    color: 0x581c1c,
    emissive: 0x2d0b0b,
    emissiveIntensity: 0.22,
    roughness: 0.32,
  });

  const createKidneyRibbon = (isLeft) => {
    const zSign = isLeft ? 1 : -1;
    const kPoints = [];
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const x = -0.5 + t * 2.0;
      const y = 0.035 - 0.05 * t - 0.12 * t * t;
      const z = zSign * (0.042 + 0.012 * Math.sin(t * Math.PI));
      kPoints.push(new THREE.Vector3(x, y, z));
    }
    const kCurve = new THREE.CatmullRomCurve3(kPoints);
    const kGeo = new THREE.TubeGeometry(kCurve, 24, 0.022, 8, false);
    kGeo.scale(1.0, 0.55, 1.2);
    return new THREE.Mesh(kGeo, kidneyMat);
  };

  kidneysGroup.add(createKidneyRibbon(true));
  kidneysGroup.add(createKidneyRibbon(false));
  organGroup.add(kidneysGroup);
  parts.push(kidneysGroup);

  // ── 12. TUYẾN TỤY TIÊU HÓA 2 THÙY (Pancreas) ──
  const pancreasGroup = new THREE.Group();
  pancreasGroup.name = "part_pancreas";
  pancreasGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_pancreas"
  );

  const pancMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xca8a04,
    emissiveIntensity: 0.2,
    roughness: 0.38,
  });

  const vLobeGeo = new THREE.SphereGeometry(0.042, 14, 14);
  vLobeGeo.scale(1.4, 0.65, 0.8);
  const vPancMesh = new THREE.Mesh(vLobeGeo, pancMat);
  vPancMesh.position.set(-0.06, -0.32, 0.06);
  pancreasGroup.add(vPancMesh);

  const dLobeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.06, -0.31, 0.06),
    new THREE.Vector3(0.05, -0.29, 0.04),
    new THREE.Vector3(0.18, -0.28, 0.02),
  ]);
  const dLobeGeo = new THREE.TubeGeometry(dLobeCurve, 12, 0.016, 8, false);
  const dPancMesh = new THREE.Mesh(dLobeGeo, pancMat);
  pancreasGroup.add(dPancMesh);

  organGroup.add(pancreasGroup);
  parts.push(pancreasGroup);

  // ── 13. TUYẾN TRỰC TRÀNG BÀI TIẾT MUỐI (Rectal Salt-Secreting Gland) ──
  const rectalGroup = new THREE.Group();
  rectalGroup.name = "part_rectal_gland";
  rectalGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_rectal_gland"
  );

  const rectalMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0x9d174d,
    emissiveIntensity: 0.28,
    roughness: 0.3,
  });

  const rGlandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.72, -0.26, 0.01),
    new THREE.Vector3(0.8, -0.22, 0.03),
    new THREE.Vector3(0.88, -0.19, 0.02),
  ]);
  const rGlandGeo = new THREE.TubeGeometry(rGlandCurve, 12, 0.016, 8, false);
  const rGlandMesh = new THREE.Mesh(rGlandGeo, rectalMat);
  rectalGroup.add(rGlandMesh);

  organGroup.add(rectalGroup);
  parts.push(rectalGroup);

  // ── 14. HỆ THỐNG ĐƯỜNG BÊN (Lateral Line System) ──
  const lateralLineGroup = new THREE.Group();
  lateralLineGroup.name = "part_lateral_line";
  lateralLineGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_lateral_line"
  );

  const latMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });

  const createLateralCanal = (isLeft) => {
    const zSign = isLeft ? 1 : -1;
    const lPoints = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const x = -1.35 + t * 3.3;
      const y = 0.06 - 0.08 * t - 0.16 * t * t;
      const z = zSign * (0.34 * (1 - Math.pow(t - 0.35, 2)) + 0.04);
      lPoints.push(new THREE.Vector3(x, y, z));
    }
    const latCurve = new THREE.CatmullRomCurve3(lPoints);
    const latGeo = new THREE.TubeGeometry(latCurve, 32, 0.008, 6, false);
    return new THREE.Mesh(latGeo, latMat);
  };

  lateralLineGroup.add(createLateralCanal(true));
  lateralLineGroup.add(createLateralCanal(false));
  organGroup.add(lateralLineGroup);
  parts.push(lateralLineGroup);

  return { organGroup, parts, vesselMat, vertMat, ventricle, atrium };
}

export function Interactive3DAnatomyViewer({
  species = {},
  language = "vi",
  onSelectPart,
  selectedPartId = null,
  model3dUrl = "/models/shark.glb",
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const partsRef = useRef([]); // Toàn bộ các part bóc tách
  const interactivePartsRef = useRef([]); // Chỉ nội tạng (để raycast siêu nhẹ, không quét 15MB shark mesh)
  const sharkMeshRef = useRef(null);
  const vertMatRef = useRef(null);
  const vesselMatRef = useRef(null);
  const heartBeatingRef = useRef(null);
  const isXRayRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isOrbitingRef = useRef(false); // Cờ kiểm tra đang xoay camera

  const [explodePercent, setExplodePercent] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAudioPulse, setIsAudioPulse] = useState(true);
  const [isClipping, setIsClipping] = useState(false);
  const [clipX, setClipX] = useState(0);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [internalActivePart, setInternalActivePart] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(true);

  // Tính toán bộ phận đang được chọn: ưu tiên selectedPartId từ prop cha, hoặc click trong 3D
  const activePart = useMemo(() => {
    if (selectedPartId) {
      const found = SHARK_PARTS_METADATA.find((p) => p.id === selectedPartId);
      if (found) return found;
    }
    return internalActivePart;
  }, [selectedPartId, internalActivePart]);

  // Mặt cắt 3D
  const clipPlaneRef = useRef(
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1.0),
  );
  const originalPositionsRef = useRef(new Map());

  // ── Khởi tạo Three.js Studio Scene ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020a16);
    scene.fog = new THREE.FogExp2(0x020a16, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.0);
    cameraRef.current = camera;

    // 3. Renderer tối ưu: pixelRatio 1.5 để 60fps mượt mà trên mọi màn hình
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls: Tắt tự quay, gán cờ isOrbiting để bỏ qua Raycasting khi xoay
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 12.0;
    controls.minDistance = 2.0;
    controls.autoRotate = false;
    controls.enableZoom = false; // Dành con lăn chuột cho bóc tách
    controlsRef.current = controls;

    const onOrbitStart = () => {
      isOrbitingRef.current = true;
      setHoveredPart(null);
      container.style.cursor = "grabbing";
    };
    const onOrbitEnd = () => {
      isOrbitingRef.current = false;
      container.style.cursor = "grab";
    };
    controls.addEventListener("start", onOrbitStart);
    controls.addEventListener("end", onOrbitEnd);

    // 5. Ánh sáng Studio Đại dương
    const ambientLight = new THREE.AmbientLight(0x0f3460, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.6);
    keyLight.position.set(6, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 2.2);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.4);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    // Sàn lưới tọa độ khoa học phát quang
    const gridHelper = new THREE.GridHelper(10, 20, 0x0ea5e9, 0x075985);
    gridHelper.position.y = -1.9;
    gridHelper.material.opacity = 0.22;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 6. Xây dựng các cơ quan nội tạng 3D
    const { organGroup, parts, vesselMat, vertMat, ventricle, atrium } =
      createOrganicInternalOrgans();
    scene.add(organGroup);
    partsRef.current = [...parts];
    interactivePartsRef.current = [...parts]; // Chỉ raycast nội tạng nhỏ gọn
    vertMatRef.current = vertMat;
    vesselMatRef.current = vesselMat;
    heartBeatingRef.current = { ventricle, atrium };

    // Ghi nhận vị trí gốc của nội tạng
    parts.forEach((p) => {
      originalPositionsRef.current.set(p.name, p.position.clone());
    });

    // 7. Nạp con cá mập 3D thực thụ từ file GLB (public/models/shark.glb)
    const loader = new GLTFLoader();
    loader.load(
      model3dUrl || "/models/shark.glb",
      (gltf) => {
        const sharkModel = gltf.scene;

        const sharkGroup = new THREE.Group();
        sharkGroup.name = "part_skin";

        // 1. Xoay cá mập theo trục X (đầu cá mập hướng về -X, đuôi hướng về +X)
        sharkModel.rotation.set(0, -Math.PI / 2, 0);
        sharkModel.updateMatrixWorld(true);

        // 2. Tính toán chính xác bounding box sau khi đã xoay
        const box = new THREE.Box3().setFromObject(sharkModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // 3. Tỉ lệ chuẩn 5.8 units dọc chiều dài
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = 5.8 / maxDim;
        sharkModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // 4. Căn tâm hoàn hảo tại (0, 0, 0)
        sharkModel.position.set(
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor,
        );

        sharkModel.traverse((child) => {
          if (child.isMesh) {
            child.frustumCulled = true;
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 0.85; // Dày dặn nguyên khối khi ở trạng thái 0%
              child.material.roughness = 0.35;
              child.material.metalness = 0.15;
            }
          }
        });

        sharkGroup.add(sharkModel);

        sharkGroup.userData = {
          id: "part_skin",
          nameVi: "Lớp da vảy nhám & Thân ngoài",
          nameEn: "Dermal Denticles & Outer Body Skin",
          descVi:
            "Lớp da bao bọc phủ triệu vi vảy nhám placoid giúp xé nước bơi không gây tiếng động",
          descEn:
            "Hydrodynamic dermal denticles streamlining laminar flow for silent underwater propulsion",
          vector: [0, 0, 2.6],
        };

        scene.add(sharkGroup);
        sharkMeshRef.current = sharkModel;
        partsRef.current.push(sharkGroup);
        originalPositionsRef.current.set(
          "part_skin",
          sharkGroup.position.clone(),
        );

        setIsLoading3D(false);
      },
      undefined,
      (err) => {
        console.warn("[3D Studio] Không nạp được /models/shark.glb:", err);
        setIsLoading3D(false);
      },
    );

    // 8. Render Loop siêu tối ưu (Tránh duyệt .traverse() mỗi frame)
    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Nhịp tim co bóp sinh học 2 pha thực thụ: Tâm nhĩ co -> Tâm thất co bóp
      if (heartBeatingRef.current) {
        const { ventricle: vent, atrium: atr } = heartBeatingRef.current;
        const phase = (elapsedTime * 4.2) % (Math.PI * 2);
        // Tâm nhĩ co bóp
        const aScale = 1 + Math.sin(phase) * 0.08;
        atr.scale.set(aScale, aScale, aScale);
        // Tâm thất co bóp mạnh mẽ (lệch pha)
        const vScale = 1 + Math.sin(phase - 0.9) * 0.12;
        vent.scale.set(vScale, vScale, vScale);
      }

      // Xung nhịp mạch máu cập nhật trực tiếp vật liệu (Không traverse cây DOM)
      if (vesselMatRef.current) {
        const pulse = Math.sin(elapsedTime * 4.2);
        vesselMatRef.current.emissiveIntensity = isXRayRef.current
          ? 0.9 + pulse * 0.3
          : 0.4 + pulse * 0.18;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. LĂN CON LĂN CHUỘT: Điều khiển mượt mà độ bóc tách qua requestAnimationFrame
    let wheelDelta = 0;
    let wheelRaf = null;
    const handleWheelExplode = (e) => {
      e.preventDefault();
      wheelDelta += e.deltaY > 0 ? 3.5 : -3.5;
      if (!wheelRaf) {
        wheelRaf = requestAnimationFrame(() => {
          setExplodePercent((prev) =>
            Math.max(0, Math.min(100, Math.round(prev + wheelDelta))),
          );
          wheelDelta = 0;
          wheelRaf = null;
        });
      }
    };
    container.addEventListener("wheel", handleWheelExplode, { passive: false });

    // 10. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup khi unmount
    return () => {
      container.removeEventListener("wheel", handleWheelExplode);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", onOrbitStart);
      controls.removeEventListener("end", onOrbitEnd);
      cancelAnimationFrame(animId);
      if (wheelRaf) cancelAnimationFrame(wheelRaf);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [model3dUrl]);

  // ── Cập nhật Mặt cắt giải phẫu ──
  useEffect(() => {
    if (rendererRef.current) {
      if (isClipping) {
        clipPlaneRef.current.constant = clipX;
        rendererRef.current.clippingPlanes = [clipPlaneRef.current];
      } else {
        rendererRef.current.clippingPlanes = [];
      }
    }
  }, [isClipping, clipX]);

  // ── Đồng bộ cờ isXRay vào ref để animate() loop truy cập ngay ──
  useEffect(() => {
    isXRayRef.current = isXRay;
  }, [isXRay]);

  // ── Bóc tách 3D theo tỷ lệ explodePercent ──
  useEffect(() => {
    const f = explodePercent / 100;
    partsRef.current.forEach((partGroup) => {
      const orig = originalPositionsRef.current.get(partGroup.name);
      if (!orig) return;
      const vector = partGroup.userData?.vector || [0, 0, 0];
      partGroup.position.set(
        orig.x + vector[0] * f,
        orig.y + vector[1] * f,
        orig.z + vector[2] * f,
      );
    });

    if (sharkMeshRef.current && !isXRay) {
      sharkMeshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = Math.max(0.25, 0.85 - f * 0.55);
          child.material.needsUpdate = true;
        }
      });
    }
  }, [explodePercent, isXRay]);

  // ── Chế độ X-Ray (Chụp X-quang xuyên thấu phát quang huỳnh quang) ──
  useEffect(() => {
    // 1. Phông nền chuẩn buồng chụp X-quang
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(
        isXRay ? 0x010816 : 0x020a16,
      );
      if (sceneRef.current.fog) {
        sceneRef.current.fog.color = new THREE.Color(
          isXRay ? 0x010816 : 0x020a16,
        );
      }
    }

    // 2. Thân da cá mập: Viền phát quang như phim âm bản X-quang (Radiographic Silhouette)
    if (sharkMeshRef.current) {
      const f = explodePercent / 100;
      sharkMeshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isXRay) {
            child.material.opacity = 0.12;
            child.material.color = new THREE.Color(0x38bdf8);
            child.material.emissive = new THREE.Color(0x0ea5e9);
            child.material.emissiveIntensity = 0.45;
          } else {
            child.material.opacity = Math.max(0.25, 0.85 - f * 0.55);
            child.material.color = new THREE.Color(0x7dd3fc);
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          }
          child.material.needsUpdate = true;
        }
      });
    }

    // 3. Hệ xương sụn: Sáng rực huỳnh quang X-quang (Radiographic Phosphorescence)
    if (vertMatRef.current) {
      if (isXRay) {
        vertMatRef.current.color = new THREE.Color(0xe0f2fe);
        vertMatRef.current.emissive = new THREE.Color(0x38bdf8);
        vertMatRef.current.emissiveIntensity = 0.85;
      } else {
        vertMatRef.current.color = new THREE.Color(0xf1f5f9);
        vertMatRef.current.emissive = new THREE.Color(0x000000);
        vertMatRef.current.emissiveIntensity = 0;
      }
      vertMatRef.current.needsUpdate = true;
    }
  }, [isXRay, explodePercent]);

  // ── Chế độ Wireframe ──
  useEffect(() => {
    partsRef.current.forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = isWireframe;
          child.material.needsUpdate = true;
        }
      });
    });
  }, [isWireframe]);

  // ── Raycasting Hover & Click: Bỏ qua khi đang xoay chuột để 60fps mượt mà ──
  const handlePointerMove = useCallback((e) => {
    if (isOrbitingRef.current) return; // Không tính toán khi đang xoay camera

    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    // Chỉ raycast trên mảng nội tạng (nhẹ gấp 100 lần so với quét qua toàn bộ mesh 15MB)
    const intersects = raycasterRef.current.intersectObjects(
      interactivePartsRef.current,
      true,
    );

    if (intersects.length > 0) {
      let targetGroup = intersects[0].object;
      while (
        targetGroup &&
        targetGroup.parent &&
        !interactivePartsRef.current.includes(targetGroup)
      ) {
        targetGroup = targetGroup.parent;
      }
      if (targetGroup && targetGroup.userData?.nameVi) {
        setHoveredPart(targetGroup.userData);
        container.style.cursor = "pointer";
        return;
      }
    }
    setHoveredPart(null);
    container.style.cursor = "grab";
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredPart) {
      setInternalActivePart(hoveredPart);
      onSelectPart?.(hoveredPart);
      if (
        hoveredPart.id === "part_heart" ||
        hoveredPart.id === "part_vessels"
      ) {
        playHeartbeatSound();
      }
    } else {
      setInternalActivePart(null);
      onSelectPart?.(null);
    }
  }, [hoveredPart, onSelectPart]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0.8, 6.0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.85);
      controlsRef.current?.update();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.15);
      controlsRef.current?.update();
    }
  };

  const handleTakeScreenshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    const specimenName =
      species?.nameVi || species?.commonName || "Pacific-Shark-3D";
    link.download = `${specimenName.replace(/\s+/g, "-")}-3D-View.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      {/* ── Studio Top Toolbar (Đã bỏ thanh slider bóc tách) ── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/20 backdrop-blur-xl shadow-lg mb-4">
        {/* Left: Mode Title */}
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
            <Box size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-normal font-heading">
                {language === "vi"
                  ? "Không gian Giải phẫu 3D Thực tế (WebGL)"
                  : "True 3D Interactive Anatomy Studio"}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-medium font-mono">
                {explodePercent === 0
                  ? language === "vi"
                    ? "Lắp ráp 0%"
                    : "Assembled 0%"
                  : `${Math.round(explodePercent)}% 3D Exploded`}
              </span>
              {isLoading3D && (
                <span className="text-[11px] text-cyan-400 animate-pulse font-medium">
                  Đang nạp mô hình 3D...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Trạng thái % bóc tách & Nút Thu gọn */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Badge hiển thị mức độ bóc tách */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs shadow-inner">
            <span className="text-slate-400">
              {language === "vi" ? "Mức bóc tách:" : "Exploded:"}
            </span>
            <span className="font-mono font-bold text-cyan-300">
              {Math.round(explodePercent)}%
            </span>
          </div>

          {/* Quick 0% Reset */}
          <button
            onClick={() => setExplodePercent(0)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
            title="Thu gọn về nguyên vẹn"
          >
            <RotateCcw size={12} />
            <span>{language === "vi" ? "Thu gọn" : "Assemble"}</span>
          </button>
        </div>
      </div>

      {/* ── 3D STUDIO CANVAS CONTAINER ── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] min-h-[520px] md:min-h-[560px] bg-gradient-to-b from-[#020813] via-[#031122] to-[#01050b]">
        {/* Three.js Canvas Mount Point */}
        <div
          ref={mountRef}
          onPointerMove={handlePointerMove}
          onClick={handleClick}
          className="w-full h-[520px] md:h-[560px] cursor-grab active:cursor-grabbing"
        />

        {/* ── Floating 3D Control Action Bar (Góc trên bên phải) ── */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-white/15 backdrop-blur-md shadow-xl z-10">
          {/* Zoom In & Out */}
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="Phóng to"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="Thu nhỏ"
          >
            <ZoomOut size={14} />
          </button>

          {/* X-Ray Mode */}
          <button
            onClick={() => setIsXRay((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isXRay
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-semibold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
            }`}
            title="Chế độ X-Ray nhìn xuyên thấu quang học"
          >
            <Eye size={14} className={isXRay ? "text-cyan-300" : ""} />
            <span>{isXRay ? "X-Ray: Bật" : "X-Ray"}</span>
          </button>

          {/* Wireframe Mode */}
          <button
            onClick={() => setIsWireframe((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isWireframe
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-semibold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
            }`}
            title="Chế độ khung lưới đa giác"
          >
            <Layers size={14} className={isWireframe ? "text-cyan-300" : ""} />
            <span>{isWireframe ? "Lưới: Bật" : "Lưới"}</span>
          </button>

          {/* Mặt cắt vi phẫu 3D (Clipping Plane) */}
          <button
            onClick={() => setIsClipping((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              isClipping
                ? "bg-amber-500/25 text-amber-200 border border-amber-400/50 font-semibold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
            }`}
            title="Mặt cắt ngang giải phẫu (Cross-section)"
          >
            <Scissors
              size={14}
              className={isClipping ? "text-amber-300" : ""}
            />
            <span>{isClipping ? "Mặt cắt: Bật" : "Mặt cắt"}</span>
          </button>

          {/* Âm thanh nhịp tim */}
          <button
            onClick={() => {
              setIsAudioPulse((prev) => !prev);
              playHeartbeatSound();
            }}
            className={`p-2 rounded-lg text-xs transition-all ${
              isAudioPulse
                ? "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
            title="Nghe nhịp đập tim sinh học"
          >
            {isAudioPulse ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Chụp ảnh HD */}
          <button
            onClick={handleTakeScreenshot}
            className="p-2 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="Chụp ảnh góc nhìn 3D độ phân giải cao"
          >
            <Camera size={14} />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-lg text-xs bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="Đặt lại góc nhìn camera"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* ── Thanh trượt vị trí mặt cắt (nếu bật chế độ Clipping) ── */}
        {isClipping && (
          <div className="absolute top-16 right-4 flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-amber-400/40 backdrop-blur-md shadow-lg z-10 animate-fadeIn">
            <Scissors size={13} className="text-amber-400" />
            <span className="text-[11px] text-amber-200">Vị trí cắt:</span>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              value={clipX}
              onChange={(e) => setClipX(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        )}

        {/* ── Hovered Part Floating Tooltip ── */}
        {hoveredPart && (
          <div className="absolute top-4 left-4 bg-slate-950/90 border border-cyan-400/40 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-xl pointer-events-none z-10 transition-all animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="text-sm font-semibold text-white">
                {language === "vi" ? hoveredPart.nameVi : hoveredPart.nameEn}
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              {language === "vi" ? hoveredPart.descVi : hoveredPart.descEn}
            </p>
          </div>
        )}
      </div>

      {/* ── Active Part Detail Card Below ── */}
      {activePart && (
        <div className="w-full mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {language === "vi" ? activePart.nameVi : activePart.nameEn}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {language === "vi" ? activePart.descVi : activePart.descEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setInternalActivePart(null);
              onSelectPart?.(null);
            }}
            className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0"
          >
            {language === "vi" ? "Đóng" : "Close"}
          </button>
        </div>
      )}
    </div>
  );
}
export default Interactive3DAnatomyViewer;
