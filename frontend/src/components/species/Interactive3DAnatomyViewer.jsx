import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  RotateCcw,
  Eye,
  Layers,
  Info,
  Scissors,
  ZoomIn,
  ZoomOut,
  Tag,
  Crosshair,
  Copy,
  Check,
  X,
} from "lucide-react";
import { ORGAN_SYSTEMS } from "./anatomy/organSystems";
import {
  createMarineSnow,
  createPilotFishSchool,
} from "./anatomy/environment/oceanEnvironment";
import { getAnatomyPreset } from "./anatomy/anatomyRegistry";

export function Interactive3DAnatomyViewer({
  species = {},
  language = "vi",
  onSelectPart,
  selectedPartId = null,
  model3dUrl,
}) {
  const anatomyPreset = useMemo(() => getAnatomyPreset(species), [species]);
  const partsMetadata = useMemo(
    () => anatomyPreset?.partsMetadata || [],
    [anatomyPreset],
  );
  const partsMetadataRef = useRef(partsMetadata);
  useEffect(() => {
    partsMetadataRef.current = partsMetadata;
  }, [partsMetadata]);

  const resolvedModelUrl =
    model3dUrl ||
    species?.model3dUrl ||
    species?.model3D ||
    anatomyPreset?.defaultModelUrl ||
    "/models/shark.glb";
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const partsRef = useRef([]); // Toàn bộ các part bóc tách
  const interactivePartsRef = useRef([]); // Chỉ nội tạng (để raycast siêu nhẹ)
  const sharkMeshRef = useRef(null);
  const vertMatRef = useRef(null);
  const vesselMatRef = useRef(null);
  const heartBeatingRef = useRef(null);
  const ampMatRef = useRef(null);
  const bloodSimRef = useRef(null);
  const marineSnowRef = useRef(null);
  const fishSchoolRef = useRef(null);
  const isXRayRef = useRef(false);
  const explodePercentRef = useRef(0);
  const activePartRef = useRef(null);
  const activeSystemRef = useRef("all");
  const showPinsRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isOrbitingRef = useRef(false);
  const pinsContainerRef = useRef(null);

  // Focus mode camera lerp (Idea 1)
  const targetCameraPosRef = useRef(new THREE.Vector3(0, 0.8, 6.0));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const isFocusLerpingRef = useRef(false);

  const [explodePercent, setExplodePercent] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isClipping, setIsClipping] = useState(false);
  const [clipX, setClipX] = useState(0);
  const [showPins, setShowPins] = useState(false); // Idea 3: 3D Callout Pins (mặc định tắt để tránh rối mắt)
  const [activeSystem, setActiveSystem] = useState("all"); // Idea 2: Organ Systems Filter
  const [hoveredPart, setHoveredPart] = useState(null);
  const hoveredPartRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isHoveringModalRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [internalActivePart, setInternalActivePart] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(true);

  useEffect(() => {
    hoveredPartRef.current = hoveredPart;
  }, [hoveredPart]);

  const handleCopyText = useCallback((e) => {
    e?.stopPropagation();
    const currentPart = hoveredPartRef.current;
    if (!currentPart) return;
    const title = language === "vi" ? currentPart.nameVi : currentPart.nameEn;
    const desc = language === "vi" ? currentPart.descVi : currentPart.descEn;
    const textToCopy = `${title}: ${desc}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [language]);

  // Đồng bộ props & state cho ref
  useEffect(() => {
    explodePercentRef.current = explodePercent;
  }, [explodePercent]);

  useEffect(() => {
    showPinsRef.current = showPins;
  }, [showPins]);

  useEffect(() => {
    activeSystemRef.current = activeSystem;
  }, [activeSystem]);

  // Tính toán bộ phận đang được chọn: ưu tiên selectedPartId từ prop cha, hoặc click trong 3D
  const activePart = useMemo(() => {
    if (selectedPartId) {
      const found = partsMetadata.find((p) => p.id === selectedPartId);
      if (found) return found;
    }
    return internalActivePart;
  }, [selectedPartId, internalActivePart, partsMetadata]);

  useEffect(() => {
    activePartRef.current = activePart;
  }, [activePart]);

  // Mặt cắt 3D
  const clipPlaneRef = useRef(
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1.0),
  );
  const originalPositionsRef = useRef(new Map());

  // Lựa chọn cơ quan & bay camera lấy nét (Focus Mode - Idea 1)
  const handleSelectPartDirectly = useCallback(
    (partMeta) => {
      if (!partMeta) {
        setInternalActivePart(null);
        onSelectPart?.(null);
        // KHÔNG tự động quay về vị trí ban đầu! Giữ nguyên góc nhìn người dùng đang chọn!
        isFocusLerpingRef.current = false;
        return;
      }

      setInternalActivePart(partMeta);
      onSelectPart?.(partMeta);

      if (partMeta.id === "part_heart" || partMeta.id === "part_vessels") {
        anatomyPreset?.playSound?.();
      }

      // Camera bay tới cơ quan được chọn từ chính hướng nhìn hiện tại
      const anchor = partMeta.pinAnchor || [0, 0, 0];
      const partGroup = partsRef.current.find((p) => p.name === partMeta.id);
      const worldPos = new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
      if (partGroup) {
        worldPos.add(partGroup.position);
      }

      targetLookAtRef.current.copy(worldPos);
      if (cameraRef.current && controlsRef.current) {
        const camDir = cameraRef.current.position
          .clone()
          .sub(controlsRef.current.target)
          .normalize();
        targetCameraPosRef.current
          .copy(worldPos)
          .addScaledVector(camDir, 1.85);
        isFocusLerpingRef.current = true;
      }
    },
    [onSelectPart, anatomyPreset],
  );

  // Phản ứng khi prop selectedPartId từ trang cha thay đổi (chỉ điều khiển camera)
  useEffect(() => {
    if (selectedPartId) {
      const found = partsMetadata.find((p) => p.id === selectedPartId);
      if (found) {
        const anchor = found.pinAnchor || [0, 0, 0];
        const partGroup = partsRef.current.find((p) => p.name === found.id);
        const worldPos = new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
        if (partGroup) {
          worldPos.add(partGroup.position);
        }
        targetLookAtRef.current.copy(worldPos);
        if (cameraRef.current && controlsRef.current) {
          const camDir = cameraRef.current.position
            .clone()
            .sub(controlsRef.current.target)
            .normalize();
          targetCameraPosRef.current
            .copy(worldPos)
            .addScaledVector(camDir, 1.85);
          isFocusLerpingRef.current = true;
        }
      }
    }
  }, [selectedPartId, partsMetadata]);

  // ── Khởi tạo Three.js Studio Scene ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene Đại dương sâu thẳm
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020b17);
    scene.fog = new THREE.FogExp2(0x020b17, 0.038);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.0);
    cameraRef.current = camera;

    // 3. Renderer tối ưu: pixelRatio 1.5 để 60fps mượt mà
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

    // 4. OrbitControls
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
      isFocusLerpingRef.current = false; // Dừng lerp nếu người dùng tự xoay camera
      setHoveredPart(null);
      container.style.cursor = "grabbing";
    };
    const onOrbitEnd = () => {
      isOrbitingRef.current = false;
      container.style.cursor = "grab";
    };
    controls.addEventListener("start", onOrbitStart);
    controls.addEventListener("end", onOrbitEnd);

    // 5. Ánh sáng Studio Đại dương huyền ảo
    const ambientLight = new THREE.AmbientLight(0x0c2744, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.8);
    keyLight.position.set(6, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 2.4);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.6);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    // Vòng phát quang đáy đại dương sâu thẳm dịu nhẹ (thay cho sàn lưới cứng)
    const oceanFloorGeo = new THREE.RingGeometry(1.5, 6.5, 36);
    oceanFloorGeo.rotateX(-Math.PI / 2);
    const oceanFloorMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const oceanFloorMesh = new THREE.Mesh(oceanFloorGeo, oceanFloorMat);
    oceanFloorMesh.position.y = -2.0;
    scene.add(oceanFloorMesh);

    // 6. Xây dựng các cơ quan nội tạng 3D
    const {
      organGroup,
      parts,
      vesselMat,
      vertMat,
      ventricle,
      atrium,
      aortaCurve,
      ampMat,
    } = anatomyPreset.buildOrgans();
    scene.add(organGroup);
    partsRef.current = [...parts];
    interactivePartsRef.current = [...parts]; // Chỉ raycast nội tạng nhỏ gọn
    vertMatRef.current = vertMat;
    vesselMatRef.current = vesselMat;
    heartBeatingRef.current = { ventricle, atrium };
    ampMatRef.current = ampMat;

    // Idea 4: Dòng chảy hạt máu sinh học dọc động mạch chủ
    const bloodSim = anatomyPreset.buildBloodSim ? anatomyPreset.buildBloodSim(aortaCurve) : null;
    if (bloodSim) {
      organGroup.add(bloodSim.instMesh);
      bloodSimRef.current = bloodSim;
    }

    // Idea 4 & Môi trường nước biển: Marine snow (bụi biển)
    const marineSnow = createMarineSnow();
    scene.add(marineSnow.points);
    marineSnowRef.current = marineSnow;

    // Idea 4 & Sinh vật bơi xung quanh: Đàn cá hoa tiêu bơi lượn
    const { schoolGroup, fishList } = createPilotFishSchool();
    scene.add(schoolGroup);
    fishSchoolRef.current = { schoolGroup, fishList };

    // Ghi nhận vị trí gốc của nội tạng
    parts.forEach((p) => {
      originalPositionsRef.current.set(p.name, p.position.clone());
    });

    // 7. Nạp con cá mập 3D thực thụ từ file GLB (public/models/shark.glb)
    const loader = new GLTFLoader();
    loader.load(
      resolvedModelUrl,
      (gltf) => {
        const sharkModel = gltf.scene;

        const sharkGroup = new THREE.Group();
        sharkGroup.name = "part_skin";

        sharkModel.rotation.set(0, -Math.PI / 2, 0);
        sharkModel.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(sharkModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = 5.8 / maxDim;
        sharkModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        sharkModel.position.set(
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor,
        );

        sharkModel.traverse((child) => {
          if (child.isMesh) {
            child.frustumCulled = true;
            if (child.material) {
              child.material.transparent = false;
              child.material.opacity = 0.92; // Da cá mập dày, đặc thực tế ở trạng thái mặc định
              child.material.roughness = 0.35;
              child.material.metalness = 0.2;
              child.material.color = new THREE.Color(0x38bdf8);
              child.material.emissive = new THREE.Color(0x0284c7);
              child.material.emissiveIntensity = 0.06;
              child.material.depthWrite = true;
            }
          }
        });

        sharkGroup.add(sharkModel);

        sharkGroup.userData = {
          id: "part_skin",
          nameVi: "Lớp da vảy nhám Placoid & Thân ngoài",
          nameEn: "Dermal Denticles & Hydrodynamic Skin",
          system: "skeletal",
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

    // 8. Render Loop siêu tối ưu 60 FPS
    const clock = new THREE.Clock();
    const tempProjVec = new THREE.Vector3();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Nhịp tim co bóp 2 pha sinh học
      if (heartBeatingRef.current) {
        const { ventricle: vent, atrium: atr } = heartBeatingRef.current;
        const phase = (elapsedTime * 4.2) % (Math.PI * 2);
        const aScale = 1 + Math.sin(phase) * 0.08;
        atr.scale.set(aScale, aScale, aScale);
        const vScale = 1 + Math.sin(phase - 0.9) * 0.12;
        vent.scale.set(vScale, vScale, vScale);
      }

      // Xung nhịp mạch máu
      if (vesselMatRef.current) {
        const pulse = Math.sin(elapsedTime * 4.2);
        vesselMatRef.current.emissiveIntensity = isXRayRef.current
          ? 0.9 + pulse * 0.3
          : 0.4 + pulse * 0.18;
      }

      // Idea 4: Xung điện trường sinh học Ampullae of Lorenzini
      if (ampMatRef.current) {
        const ampPulse = Math.sin(elapsedTime * 5.5);
        ampMatRef.current.emissiveIntensity = 0.4 + ampPulse * 0.28;
      }

      // Idea 4: Dòng chảy hạt máu dọc động mạch chủ (Physiological Blood Flow)
      if (bloodSimRef.current) {
        const { instMesh, count, aortaCurve: curve, dummy } =
          bloodSimRef.current;
        for (let i = 0; i < count; i++) {
          const t = (elapsedTime * 0.35 + i / count) % 1.0;
          const pt = curve.getPointAt(t);
          dummy.position.copy(pt);
          dummy.scale.setScalar(0.7 + Math.sin(t * Math.PI) * 0.45);
          dummy.updateMatrix();
          instMesh.setMatrixAt(i, dummy.matrix);
        }
        instMesh.instanceMatrix.needsUpdate = true;
      }

      // Idea 4 & Nước biển: Phù du đại dương trôi dạt lơ lửng êm dịu trong dòng nước sâu
      if (marineSnowRef.current) {
        const { points, positions, speeds, count } = marineSnowRef.current;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] -= speeds[i];
          positions[i * 3] += Math.sin(elapsedTime * 0.3 + i) * 0.0006;
          if (positions[i * 3 + 1] < -3.5) {
            positions[i * 3 + 1] = 3.5;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      }

      // Idea 4 & Sinh vật bơi xung quanh: Đàn cá hoa tiêu bơi lượn uốn khúc nền xa
      if (fishSchoolRef.current) {
        const { schoolGroup, fishList } = fishSchoolRef.current;
        // Ẩn cá nhỏ khi bật X-Ray, khi đang soi kỹ 1 cơ quan, hoặc khi đang kéo bóc tách để không làm sao nhãng
        const shouldShow =
          !isXRayRef.current &&
          !activePartRef.current &&
          explodePercentRef.current < 12;

        schoolGroup.visible = shouldShow;

        if (shouldShow) {
          fishList.forEach((f) => {
            const angle = elapsedTime * f.speed + f.phaseOffset;
            const x = Math.cos(angle) * f.orbitRadiusX;
            const z = Math.sin(angle) * f.orbitRadiusZ;
            const y = f.baseY + Math.sin(angle * 2.0) * 0.18;
            f.group.position.set(x, y, z);
            f.group.rotation.y = -angle + Math.PI / 2;
            f.group.rotation.z = Math.sin(angle) * 0.08;
            f.tailGroup.rotation.y = Math.sin(elapsedTime * f.wagSpeed) * 0.35;
          });
        }
      }

      // Nhịp bơi uốn mình tự nhiên của thân cá mập khi ở mức 0% bóc tách
      if (
        sharkMeshRef.current &&
        explodePercentRef.current === 0 &&
        !activePartRef.current
      ) {
        sharkMeshRef.current.rotation.y =
          -Math.PI / 2 + Math.sin(elapsedTime * 1.6) * 0.025;
      } else if (sharkMeshRef.current) {
        sharkMeshRef.current.rotation.y = -Math.PI / 2;
      }

      // Idea 1: Camera Smooth Lerp tới cơ quan đang lấy nét
      if (
        isFocusLerpingRef.current &&
        cameraRef.current &&
        controlsRef.current
      ) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.06);
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.06);
        if (
          cameraRef.current.position.distanceTo(targetCameraPosRef.current) <
            0.03 &&
          controlsRef.current.target.distanceTo(targetLookAtRef.current) < 0.03
        ) {
          isFocusLerpingRef.current = false;
        }
      }

      // Idea 3: Cập nhật vị trí các ghim nhãn 3D trong không gian chính xác tại từng cơ quan
      if (
        pinsContainerRef.current &&
        showPinsRef.current &&
        cameraRef.current
      ) {
        const pinNodes = pinsContainerRef.current.children;
        const w = container.clientWidth;
        const h = container.clientHeight;
        for (let i = 0; i < pinNodes.length; i++) {
          const node = pinNodes[i];
          const pid = node.getAttribute("data-part-id");
          const meta = partsMetadataRef.current.find((p) => p.id === pid);
          const pGroup = partsRef.current.find((p) => p.name === pid);
          if (meta && meta.pinAnchor && pGroup) {
            tempProjVec.set(
              meta.pinAnchor[0],
              meta.pinAnchor[1],
              meta.pinAnchor[2],
            );
            tempProjVec.add(pGroup.position);
            tempProjVec.project(camera);
            if (
              tempProjVec.z < 1.0 &&
              tempProjVec.x >= -1.05 &&
              tempProjVec.x <= 1.05 &&
              tempProjVec.y >= -1.05 &&
              tempProjVec.y <= 1.05
            ) {
              const sx = (tempProjVec.x * 0.5 + 0.5) * w;
              const sy = (-(tempProjVec.y * 0.5) + 0.5) * h;
              node.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
              node.style.display = "block";
            } else {
              node.style.display = "none";
            }
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. LĂN CON LĂN CHUỘT: Điều khiển mượt mà độ bóc tách
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
    container.addEventListener("wheel", handleWheelExplode, {
      passive: false,
    });

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
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
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
  }, [resolvedModelUrl, anatomyPreset]);

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

  // ── Đồng bộ cờ isXRay vào ref ──
  useEffect(() => {
    isXRayRef.current = isXRay;
  }, [isXRay]);

  // ── Bóc tách 3D theo tỷ lệ explodePercent (vị trí không gian) ──
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
  }, [explodePercent]);

  // ── IDEA 1 (Focus/Solo Mode) & IDEA 2 (Organ Systems Filter) & X-Ray Opacities ──
  useEffect(() => {
    const f = explodePercent / 100;

    // 1. Nếu đang có cơ quan được chọn (Solo Focus Mode - Idea 1)
    if (activePart) {
      partsRef.current.forEach((group) => {
        const isSelected = group.name === activePart.id;
        group.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = isSelected ? 1.0 : 0.08;
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = isSelected ? 0.6 : 0.05;
            }
            child.material.needsUpdate = true;
          }
        });
      });

      if (sharkMeshRef.current) {
        sharkMeshRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = 0.04;
            child.material.needsUpdate = true;
          }
        });
      }
      return;
    }

    // 2. Nếu đang lọc theo hệ cơ quan (Organ Systems Filter - Idea 2)
    if (activeSystem !== "all") {
      partsRef.current.forEach((group) => {
        const pData = group.userData;
        const isMatch = pData?.system === activeSystem;
        group.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = isMatch ? 1.0 : 0.12;
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = isMatch ? 0.45 : 0.08;
            }
            child.material.needsUpdate = true;
          }
        });
      });

      if (sharkMeshRef.current) {
        const isSkinSystem = activeSystem === "skeletal";
        sharkMeshRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = isSkinSystem ? 0.45 : 0.08;
            child.material.needsUpdate = true;
          }
        });
      }
      return;
    }

    // 3. Chế độ mặc định (Hiển thị đầy đủ hoặc X-Ray)
    partsRef.current.forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          if (group.name !== "part_skin") {
            child.material.transparent = isXRay
              ? true
              : child.material.name === "cranium" || false;
            child.material.opacity = 1.0;
          }
          child.material.needsUpdate = true;
        }
      });
    });

    if (sharkMeshRef.current) {
      sharkMeshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isXRay) {
            // Chế độ X-Ray: Thân da chuyển thành màng bán trong suốt viền quang học đặc trưng
            child.material.transparent = true;
            child.material.opacity = 0.12;
            child.material.color = new THREE.Color(0x38bdf8);
            child.material.emissive = new THREE.Color(0x0ea5e9);
            child.material.emissiveIntensity = 0.45;
            child.material.depthWrite = false;
          } else {
            // Chế độ giải phẫu thông thường (không X-Ray):
            if (f <= 0.02) {
              // Mức 0% bóc tách: Da cá nguyên vẹn, dày dặn, che phủ tự nhiên như cá thật
              child.material.transparent = false;
              child.material.opacity = 0.92;
              child.material.color = new THREE.Color(0x38bdf8);
              child.material.emissive = new THREE.Color(0x0284c7);
              child.material.emissiveIntensity = 0.06;
              child.material.depthWrite = true;
            } else {
              // Khi tăng thanh trượt bóc tách: Da cá tách ra và mờ dần để lộ rõ cơ quan bên trong
              child.material.transparent = true;
              child.material.opacity = Math.max(0.18, 0.92 - f * 0.74);
              child.material.color = new THREE.Color(0x38bdf8);
              child.material.emissive = new THREE.Color(0x0284c7);
              child.material.emissiveIntensity = 0.12;
              child.material.depthWrite = false;
            }
          }
          child.material.needsUpdate = true;
        }
      });
    }

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
  }, [activePart, activeSystem, explodePercent, isXRay]);

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

  // ── Raycasting Hover & Phân biệt Kéo xoay và Click ──
  const pointerDownPosRef = useRef({ x: 0, y: 0, time: 0 });
  const didDragRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    pointerDownPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    didDragRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e) => {
    const dist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y,
    );
    if (dist > 6) {
      didDragRef.current = true;
    }

    if (isOrbitingRef.current || didDragRef.current) {
      if (!isHoveringModalRef.current) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHoveredPart(null);
      }
      return;
    }

    // Nếu da cá đang liền khối (không X-Ray, không bóc tách, xem tất cả), không kích hoạt hover cơ quan ẩn bên trong
    if (
      !isXRayRef.current &&
      explodePercentRef.current === 0 &&
      activeSystemRef.current === "all"
    ) {
      if (!isHoveringModalRef.current && hoveredPartRef.current) {
        if (!hoverTimeoutRef.current) {
          hoverTimeoutRef.current = setTimeout(() => {
            if (!isHoveringModalRef.current) {
              setHoveredPart(null);
            }
            hoverTimeoutRef.current = null;
          }, 800);
        }
      }
      return;
    }

    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
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
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHoveredPart(targetGroup.userData);
        container.style.cursor = "pointer";
        return;
      }
    }

    // Khi di chuột ra khoảng trống ngoài cơ quan
    container.style.cursor = "grab";
    if (isHoveringModalRef.current) return;

    // Giữ độ trễ 1.2s trước khi ẩn để người dùng kịp di chuyển chuột lên modal để bôi đen/copy chữ
    if (hoveredPartRef.current && !hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHoveringModalRef.current) {
          setHoveredPart(null);
        }
        hoverTimeoutRef.current = null;
      }, 1200);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (mountRef.current) {
      mountRef.current.style.cursor = "grab";
    }
    if (isHoveringModalRef.current) return;

    // Giữ độ trễ 1.2s khi rời khỏi canvas
    if (hoveredPartRef.current && !hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHoveringModalRef.current) {
          setHoveredPart(null);
        }
        hoverTimeoutRef.current = null;
      }, 1200);
    }
  }, []);

  const handleClick = useCallback(() => {
    // Nếu vừa thực hiện thao tác kéo xoay camera thì BỎ QUA, không kích hoạt click hay reset camera!
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (hoveredPart) {
      handleSelectPartDirectly(hoveredPart);
    }
  }, [hoveredPart, handleSelectPartDirectly]);

  const handleResetCamera = () => {
    handleSelectPartDirectly(null);
    if (cameraRef.current && controlsRef.current) {
      targetCameraPosRef.current.set(0, 0.8, 6.0);
      targetLookAtRef.current.set(0, 0, 0);
      isFocusLerpingRef.current = true;
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

  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      {/* ── 3D STUDIO CANVAS CONTAINER ── */}
      <div
        onPointerLeave={handlePointerLeave}
        className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] min-h-[520px] md:min-h-[560px] bg-gradient-to-b from-[#020b17] via-[#02182e] to-[#010915]"
      >
        {/* Three.js Canvas Mount Point */}
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          className="w-full h-[520px] md:h-[560px] cursor-grab active:cursor-grabbing"
        />

        {/* ── IDEA 3: 3D Callout Pins (Ghim nhãn 3D trong không gian tại từng cơ quan) ── */}
        {showPins && (
          <div
            ref={pinsContainerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10"
          >
            {partsMetadata.filter(
              (part) => part.id !== "part_skin" && part.pinAnchor !== null,
            ).map((part) => {
              const isMajorPart = [
                "part_heart",
                "part_brain",
                "part_liver",
                "part_stomach",
                "part_gills",
                "part_ampullae",
                "part_spiral_valve",
                "part_chassis",
              ].includes(part.id);
              const isCurrentSystem =
                activeSystem === "all"
                  ? isMajorPart
                  : part.system === activeSystem;

              if (!isCurrentSystem) return null;
              const isActive = activePart?.id === part.id;
              return (
                <div
                  key={part.id}
                  data-part-id={part.id}
                  style={{ display: "none" }}
                  className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPartDirectly(part);
                  }}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl backdrop-blur-md transition-all ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold border-white ring-2 ring-cyan-400/70 scale-110"
                        : "bg-slate-950/80 text-cyan-200 border-cyan-500/40 hover:bg-cyan-900/90 hover:border-cyan-300 hover:scale-105"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive
                          ? "bg-slate-950 animate-ping"
                          : "bg-cyan-400 animate-pulse"
                      }`}
                    />
                    <span className="text-[11px] font-semibold whitespace-nowrap">
                      {language === "vi" ? part.nameVi : part.nameEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Loading Overlay ── */}
        {isLoading3D && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm z-20 pointer-events-none transition-all">
            <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-2.5" />
            <span className="text-xs text-cyan-300 font-medium tracking-wide">
              {language === "vi"
                ? "Đang nạp mô hình giải phẫu 3D..."
                : "Loading 3D Anatomy Model..."}
            </span>
          </div>
        )}

        {/* ── Floating 3D Control Action Bar (Góc trên bên phải) ── */}
        <div
          onPointerEnter={handlePointerLeave}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/15 backdrop-blur-md shadow-xl z-10"
        >
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

          {/* Idea 3: Bật/Tắt Ghim Nhãn 3D */}
          <button
            onClick={() => setShowPins((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              showPins
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-semibold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
            }`}
            title="Bật/Tắt ghim nhãn 3D trong không gian"
          >
            <Tag size={14} className={showPins ? "text-cyan-300" : ""} />
            <span>{showPins ? "Nhãn: Bật" : "Nhãn"}</span>
          </button>

          {/* X-Ray Mode */}
          <button
            onClick={() => setIsXRay((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
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
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
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
            <span>{isClipping ? "Cắt: Bật" : "Cắt"}</span>
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

        {/* ── IDEA 2: Organ Systems Filter Dock (Thanh phân loại hệ cơ quan dưới đáy) ── */}
        <div
          onPointerEnter={handlePointerLeave}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-cyan-500/25 shadow-2xl z-10 max-w-[94%] overflow-x-auto scrollbar-none"
        >
          {ORGAN_SYSTEMS.map((sys) => {
            const IconComp = sys.icon;
            const isSelected = activeSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => {
                  setActiveSystem(sys.id);
                  if (
                    activePart &&
                    activePart.system !== sys.id &&
                    sys.id !== "all"
                  ) {
                    handleSelectPartDirectly(null);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title={`Lọc: ${sys.nameVi}`}
              >
                <IconComp
                  size={13}
                  className={isSelected ? "text-slate-950" : "text-cyan-400"}
                />
                <span>{language === "vi" ? sys.nameVi : sys.nameEn}</span>
              </button>
            );
          })}
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

        {/* ── Hovered Part Floating Modal (Không biến mất ngay, cho phép bôi đen & copy thủ công) ── */}
        {hoveredPart && !activePart && (
          <div
            onPointerEnter={() => {
              isHoveringModalRef.current = true;
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            }}
            onPointerLeave={() => {
              isHoveringModalRef.current = false;
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = setTimeout(() => {
                if (!isHoveringModalRef.current) {
                  setHoveredPart(null);
                }
                hoverTimeoutRef.current = null;
              }, 800);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ userSelect: "text", WebkitUserSelect: "text" }}
            className="absolute top-4 left-4 max-w-sm bg-slate-950/95 border border-cyan-400/50 p-4 rounded-2xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] pointer-events-auto select-text z-20 transition-all animate-fadeIn"
          >
            {/* Header: Tiêu đề & Nút thao tác copy / đóng */}
            <div className="flex items-start justify-between gap-3 mb-2 border-b border-white/10 pb-2.5">
              <div className="flex-1 pr-2">
                <h4 className="text-sm font-bold text-white select-text cursor-text selection:bg-cyan-500/40 selection:text-white leading-snug">
                  {language === "vi" ? hoveredPart.nameVi : hoveredPart.nameEn}
                </h4>
                {hoveredPart.system && (
                  <span className="inline-block text-[10px] text-cyan-300 font-medium mt-0.5">
                    {ORGAN_SYSTEMS.find((s) => s.id === hoveredPart.system)
                      ? language === "vi"
                        ? ORGAN_SYSTEMS.find((s) => s.id === hoveredPart.system).nameVi
                        : ORGAN_SYSTEMS.find((s) => s.id === hoveredPart.system).nameEn
                      : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Nút Sao chép nhanh */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  title={language === "vi" ? "Sao chép mô tả cơ quan" : "Copy organ info"}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-300">
                        {language === "vi" ? "Đã chép" : "Copied"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{language === "vi" ? "Sao chép" : "Copy"}</span>
                    </>
                  )}
                </button>
                {/* Nút đóng modal */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    isHoveringModalRef.current = false;
                    setHoveredPart(null);
                  }}
                  title={language === "vi" ? "Đóng" : "Close"}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Nội dung mô tả cho phép người dùng bôi đen và copy thủ công bằng chuột */}
            <p className="text-xs text-slate-200 leading-relaxed select-text cursor-text selection:bg-cyan-500/40 selection:text-white">
              {language === "vi" ? hoveredPart.descVi : hoveredPart.descEn}
            </p>

            {/* Footer chỉ dẫn & Lấy nét */}
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-[10px] text-slate-400 select-none">
                {language === "vi"
                  ? "Dùng chuột bôi đen để copy thủ công"
                  : "Highlight text with mouse to copy"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPartDirectly(hoveredPart);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 cursor-pointer"
              >
                {language === "vi" ? "Lấy nét 3D →" : "Focus 3D →"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── IDEA 1: Active Part Detail Card with Solo Focus Exit ── */}
      {activePart && (
        <div className="w-full mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white font-heading">
                  {language === "vi" ? activePart.nameVi : activePart.nameEn}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium flex items-center gap-1">
                  <Crosshair size={11} className="text-cyan-400 animate-spin" />
                  {language === "vi"
                    ? "Đang lấy nét & cô lập"
                    : "Solo Focus Active"}
                </span>
                {species?.nameVi && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-medium">
                    {language === "vi"
                      ? species.nameVi
                      : species.commonName || species.nameVi}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {language === "vi" ? activePart.descVi : activePart.descEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelectPartDirectly(null)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/40 transition-all shrink-0 font-medium"
          >
            {language === "vi" ? "Thoát lấy nét" : "Exit Focus"}
          </button>
        </div>
      )}
    </div>
  );
}
export default Interactive3DAnatomyViewer;
