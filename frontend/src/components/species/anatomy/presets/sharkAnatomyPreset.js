import * as THREE from "three";

/**
 * Âm thanh nhịp tim sinh học bằng Web Audio API
 */
export function playHeartbeatSound() {
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

/**
 * DANH MỤC 15 HỆ CƠ QUAN GIẢI PHẪU CÁ MẬP SINH HỌC TOÀN DIỆN
 */
export const SHARK_PARTS_METADATA = [
  {
    id: "part_chassis",
    nameVi: "Cột sống & Khung sọ sụn",
    nameEn: "Cartilaginous Spine & Cranium",
    system: "skeletal",
    pinAnchor: [-0.65, 0.22, 0.0],
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
    system: "nervous",
    pinAnchor: [-1.72, 0.15, 0.0],
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
    system: "nervous",
    pinAnchor: [-2.2, -0.06, 0.14],
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
    system: "circulatory",
    pinAnchor: [-1.16, -0.14, 0.38],
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
    system: "skeletal",
    pinAnchor: [-0.95, -0.48, 0.0],
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
    system: "circulatory",
    pinAnchor: [-1.02, -0.45, 0.14],
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
    system: "circulatory",
    pinAnchor: [0.05, 0.12, 0.0],
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
    system: "excretory",
    pinAnchor: [0.6, 0.06, -0.12],
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
    system: "digestive",
    pinAnchor: [-0.15, -0.48, -0.22],
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
    system: "digestive",
    pinAnchor: [-0.35, -0.18, 0.15],
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
    system: "digestive",
    pinAnchor: [-0.05, -0.38, 0.12],
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
    system: "digestive",
    pinAnchor: [0.38, -0.25, 0.16],
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
    system: "excretory",
    pinAnchor: [0.85, -0.22, 0.08],
    descVi:
      "Tuyến hình ngón tay nhỏ ở cuối ruột, chủ động bơm bài tiết dung dịch muối NaCl nồng độ siêu cao gấp 2 lần nước biển để chống ngộ độc muối",
    descEn:
      "Digital finger-like gland actively pumping out sodium chloride at twice seawater concentration",
    vector: [1.05, -0.85, -0.25],
  },
  {
    id: "part_skin",
    nameVi: "Lớp da vảy nhám Placoid & Thân ngoài",
    nameEn: "Dermal Denticles & Hydrodynamic Skin",
    system: "skeletal",
    pinAnchor: null, // Không ghim nhãn ngoài thân da
    descVi:
      "Lớp da bao bọc phủ triệu vi vảy nhám răng placoid giúp triệt tiêu ma sát xoáy nước, bơi lội hoàn toàn tĩnh lặng khi tiếp cận con mồi",
    descEn:
      "Armor of microscopic tooth-like placoid scales disrupting vortex turbulence for silent stealth swimming",
    vector: [0, 0, 2.6],
  },
];

/**
 * Xây dựng các cơ quan nội tạng 3D mềm mại, hữu cơ sinh học của cá mập
 */
export function createOrganicInternalOrgans() {
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

  // Mõm sụn Rostrum
  const rostrumCenter = new THREE.CylinderGeometry(0.012, 0.008, 0.45, 8);
  rostrumCenter.rotateZ(Math.PI / 2);
  const rCMesh = new THREE.Mesh(rostrumCenter, craniumMat);
  rCMesh.position.set(-2.05, -0.08, 0);
  spineGroup.add(rCMesh);

  // Hốc mắt sụn hai bên
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

  // Cung mang sụn vùng hầu họng
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

    // Cung thần kinh hướng sống lưng
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

  // Quả tim cá mập
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

  // Tâm thất dày hình nón cơ bắp
  const ventGeo = new THREE.SphereGeometry(0.13, 28, 28);
  const vPos = ventGeo.attributes.position;
  for (let i = 0; i < vPos.count; i++) {
    let x = vPos.getX(i);
    let y = vPos.getY(i);
    let z = vPos.getZ(i);
    const t = (y + 0.13) / 0.26;
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

  // Tâm nhĩ vách mỏng hình bán nguyệt
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

  // Nón động mạch có van
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

  // Hệ thống động mạch chủ và mao mạch
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

  // Gan dầu squalene
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

  // Thùy giữa
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

  // Túi mật
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

  // Ống mật nối vào tá tràng
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

  // Dạ dày hình chữ J
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

  // Vòng cơ môn vị
  const pylorusGeo = new THREE.TorusGeometry(0.065, 0.018, 10, 18);
  pylorusGeo.rotateY(Math.PI / 4);
  const pylorus = new THREE.Mesh(pylorusGeo, stomachMat);
  pylorus.position.set(-0.04, -0.33, 0.05);
  stomachGroup.add(pylorus);

  // Lá lách ôm dọc bờ cong lớn dạ dày
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

  // Ruột van xoắn ốc
  const valveGroup = new THREE.Group();
  valveGroup.name = "part_spiral_valve";
  valveGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_spiral_valve",
  );

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

  // Cánh van xoắn ốc
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

  // Bộ não cá mập
  const brainGroup = new THREE.Group();
  brainGroup.name = "part_brain";
  brainGroup.userData = SHARK_PARTS_METADATA.find((p) => p.id === "part_brain");

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xca8a04,
    emissiveIntensity: 0.35,
    roughness: 0.25,
  });

  // Thùy khứu giác hai bên lỗ mũi
  const bulbGeo = new THREE.SphereGeometry(0.045, 16, 16);
  bulbGeo.scale(1.4, 0.85, 0.85);
  const leftBulb = new THREE.Mesh(bulbGeo, brainMat);
  leftBulb.position.set(-2.0, -0.05, 0.065);
  brainGroup.add(leftBulb);

  const rightBulb = new THREE.Mesh(bulbGeo, brainMat);
  rightBulb.position.set(-2.0, -0.05, -0.065);
  brainGroup.add(rightBulb);

  // Cuống khứu giác
  const tractGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.16, 8);
  tractGeo.rotateZ(Math.PI / 2);
  const leftTract = new THREE.Mesh(tractGeo, brainMat);
  leftTract.position.set(-1.88, -0.035, 0.055);
  brainGroup.add(leftTract);

  const rightTract = new THREE.Mesh(tractGeo, brainMat);
  rightTract.position.set(-1.88, -0.035, -0.055);
  brainGroup.add(rightTract);

  // Bán cầu đại não
  const hemiGeo = new THREE.SphereGeometry(0.062, 16, 16);
  hemiGeo.scale(1.15, 0.9, 0.9);
  const leftHemi = new THREE.Mesh(hemiGeo, brainMat);
  leftHemi.position.set(-1.76, -0.02, 0.042);
  brainGroup.add(leftHemi);

  const rightHemi = new THREE.Mesh(hemiGeo, brainMat);
  rightHemi.position.set(-1.76, -0.02, -0.042);
  brainGroup.add(rightHemi);

  // Tiểu não hình thoi
  const cereGeo = new THREE.SphereGeometry(0.055, 14, 14);
  cereGeo.scale(1.3, 1.1, 0.9);
  const cerebellum = new THREE.Mesh(cereGeo, brainMat);
  cerebellum.position.set(-1.64, 0.01, 0);
  brainGroup.add(cerebellum);

  // Hành não nối liền vào tủy sống
  const medullaGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.14, 10);
  medullaGeo.rotateZ(Math.PI / 2);
  const medulla = new THREE.Mesh(medullaGeo, brainMat);
  medulla.position.set(-1.52, 0.03, 0);
  brainGroup.add(medulla);

  organGroup.add(brainGroup);
  parts.push(brainGroup);

  // Mạng lưới bóng điện trường Lorenzini
  const ampullaeGroup = new THREE.Group();
  ampullaeGroup.name = "part_ampullae";
  ampullaeGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_ampullae",
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

  // Hệ thống lá mang lược
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

  // Đai sụn vây ngực
  const girdleGroup = new THREE.Group();
  girdleGroup.name = "part_pectoral_girdle";
  girdleGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_pectoral_girdle",
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

  // Cặp thận dải dẹp
  const kidneysGroup = new THREE.Group();
  kidneysGroup.name = "part_kidneys";
  kidneysGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_kidneys",
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

  // Tuyến tụy tiêu hóa
  const pancreasGroup = new THREE.Group();
  pancreasGroup.name = "part_pancreas";
  pancreasGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_pancreas",
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

  // Tuyến trực tràng bài tiết muối
  const rectalGroup = new THREE.Group();
  rectalGroup.name = "part_rectal_gland";
  rectalGroup.userData = SHARK_PARTS_METADATA.find(
    (p) => p.id === "part_rectal_gland",
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


  return {
    organGroup,
    parts,
    vesselMat,
    vertMat,
    ventricle,
    atrium,
    aortaCurve,
    ampMat,
  };
}

/**
 * Hạt máu di chuyển dọc động mạch chủ
 */
export function createBloodParticles(aortaCurve) {
  if (!aortaCurve) return null;
  const count = 35;
  const geo = new THREE.SphereGeometry(0.014, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff2449,
    transparent: true,
    opacity: 0.85,
  });
  const instMesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  instMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  return { instMesh, count, aortaCurve, dummy };
}

/**
 * Cấu hình giải phẫu cá mập
 */
export const sharkAnatomyPreset = {
  id: "shark",
  nameVi: "Cá mập",
  nameEn: "Shark",
  defaultModelUrl: "/models/shark.glb",
  partsMetadata: SHARK_PARTS_METADATA,
  buildOrgans: createOrganicInternalOrgans,
  buildBloodSim: createBloodParticles,
  playSound: playHeartbeatSound,
};
