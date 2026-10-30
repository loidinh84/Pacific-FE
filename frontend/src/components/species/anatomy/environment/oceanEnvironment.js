import * as THREE from "three";

/**
 * Mô phỏng bụi biển lơ lửng trong nước biển sâu
 * Rất nhẹ nhàng, hữu cơ, không làm phân tâm mắt người xem
 */
export function createMarineSnow() {
  const count = 40; // 40 hạt li ti tự nhiên
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    speeds[i] = 0.0006 + Math.random() * 0.0008; // Trôi dạt cực chậm hữu cơ
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.016,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  return { points, positions, speeds, count };
}

/**
 * Hiệu ứng cá hoa tiêu bơi lượn nền xa
 */
export function createPilotFishSchool() {
  const schoolGroup = new THREE.Group();
  schoolGroup.name = "Pilot_Fish_School";

  const fishCount = 2; // 2 chú cá nhỏ nền xa tinh tế
  const fishList = [];

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    metalness: 0.2,
    emissive: 0x0369a1,
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0.55,
  });

  const finMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x030712 });

  for (let i = 0; i < fishCount; i++) {
    const singleFish = new THREE.Group();
    singleFish.scale.set(0.5, 0.5, 0.5);

    // 1. Thân cá thoi thuôn mượt
    const bodyGeo = new THREE.SphereGeometry(0.06, 16, 12);
    bodyGeo.scale(2.2, 0.8, 0.4);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    singleFish.add(bodyMesh);

    // 2. Mắt cá 2 bên
    const eyeGeo = new THREE.SphereGeometry(0.011, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.1, 0.015, 0.024);
    singleFish.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.set(-0.1, 0.015, -0.024);
    singleFish.add(eyeR);

    // Vây lưng
    const dFinGeo = new THREE.BufferGeometry();
    const dVertices = new Float32Array([
      0.03, 0.045, 0,
      0.08, 0.045, 0,
      0.05, 0.11, 0,
    ]);
    dFinGeo.setAttribute("position", new THREE.BufferAttribute(dVertices, 3));
    dFinGeo.computeVertexNormals();
    const dFin = new THREE.Mesh(dFinGeo, finMat);
    singleFish.add(dFin);

    // Vây đuôi
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0.13, 0, 0);

    const finGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      0.1, 0.07, 0,
      0.05, 0, 0,
      0, 0, 0,
      0.05, 0, 0,
      0.1, -0.07, 0,
    ]);
    finGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    finGeo.computeVertexNormals();
    const tailMesh = new THREE.Mesh(finGeo, finMat);
    tailGroup.add(tailMesh);
    singleFish.add(tailGroup);

    // 5. Vây ngực 2 bên
    const pFinGeo = new THREE.BufferGeometry();
    const pVertices = new Float32Array([
      0, 0, 0,
      0.06, -0.04, 0.04,
      0.02, -0.06, 0.02,
    ]);
    pFinGeo.setAttribute("position", new THREE.BufferAttribute(pVertices, 3));
    pFinGeo.computeVertexNormals();
    const pFinL = new THREE.Mesh(pFinGeo, finMat);
    pFinL.position.set(-0.02, -0.02, 0.02);
    singleFish.add(pFinL);

    const pFinR = pFinL.clone();
    pFinR.scale.set(1, 1, -1);
    pFinR.position.set(-0.02, -0.02, -0.02);
    singleFish.add(pFinR);

    // Quỹ đạo bơi nền đại dương xa hơn và chậm rãi, không cắt ngang thân cá mập
    const fishData = {
      group: singleFish,
      tailGroup,
      orbitRadiusX: 4.8 + i * 0.9,
      orbitRadiusZ: 3.5 + i * 0.7,
      baseY: -0.2 + i * 0.55,
      speed: 0.22 + i * 0.04,
      phaseOffset: i * Math.PI,
      wagSpeed: 6.0 + i * 0.5,
    };

    schoolGroup.add(singleFish);
    fishList.push(fishData);
  }

  return { schoolGroup, fishList };
}
