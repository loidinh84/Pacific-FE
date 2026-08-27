import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SYSTEM_CONFIG } from "../SpeciesDetail/anatomyConfig";

// Preload GLB model
useGLTF.preload("/models/shark.glb");

// Anatomically accurate surface coordinates on the realistic GLB shark model
const ORGAN_3D_CONFIG = {
  a1: { pos3D: [-2.0, -0.3, 0] },     // Jaws & Dentition (mouth area)
  a2: { pos3D: [-1.7, 0.32, 0] },     // Brain & Optic Lobe (cranium)
  a3: { pos3D: [-1.1, -0.05, 0.45] },  // Gill Slits (side gills)
  a4: { pos3D: [-0.65, -0.28, 0] },   // Heart & Vessels (chest cavity)
  a5: { pos3D: [-0.1, -0.35, 0.35] },  // Squalene Liver (belly side)
  a6: { pos3D: [0.55, -0.25, 0] },    // Stomach & Spiral Valve (center abdomen)
  a7: { pos3D: [-0.2, 0.65, 0] },     // Cartilaginous Spine (dorsal ridge)
  a8: { pos3D: [1.25, 0.22, 0] },     // Kidney & Rectal Gland (upper back)
  a9: { pos3D: [2.35, 0.1, 0] },      // Caudal Fin & Myomeres (tail base)
};

// Realistic 3D Shark Model with Clean Studio Lighting & Realistic Skin
function RealisticSharkModel({ xrayMode }) {
  const { scene } = useGLTF("/models/shark.glb");
  const sharkRef = useRef();

  const { scaleFactor, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? 6.0 / maxDim : 1;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = xrayMode ? 0.65 : 1.0;
        child.material.roughness = 0.3;
        child.material.metalness = 0.15;
      }
    });

    return { scaleFactor, centerOffset: center };
  }, [scene, xrayMode]);

  useFrame((state) => {
    if (!sharkRef.current) return;
    // Gentle floating motion
    sharkRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    sharkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
  });

  return (
    <group ref={sharkRef} position={[0, -0.1, 0]}>
      <primitive
        object={scene}
        scale={scaleFactor}
        position={[
          -centerOffset.x * scaleFactor,
          -centerOffset.y * scaleFactor,
          -centerOffset.z * scaleFactor,
        ]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}

// Minimalist Sleek 3D Hotspot Pin
function SleekHotspotPin({
  spot,
  isSelected,
  isHovered,
  onHover,
  onClick,
  language,
}) {
  const meshRef = useRef();
  const basePos = spot.pos3D || [0, 0, 0];
  const sysCfg = SYSTEM_CONFIG[spot.system] || SYSTEM_CONFIG.nervous;
  const color = sysCfg.color;
  const label = language === "en" ? spot.labelEn || spot.labelVi : spot.labelVi;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 10
    );
  });

  return (
    <group position={basePos}>
      {/* Outer Pulse Ring */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(spot.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(spot);
        }}
      >
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.4 : 0.8}
          roughness={0.1}
          metalness={0.2}
        />
        <pointLight color={color} intensity={isSelected ? 1.5 : 0.4} distance={0.9} />
      </mesh>

      {/* Show Label ONLY when Hovered or Selected to keep view pristine */}
      {(isHovered || isSelected) && (
        <Html position={[0, 0.25, 0]} center zIndexRange={[100, 0]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(spot);
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer select-none flex items-center gap-2 ${
              isSelected ? "ring-2 ring-white scale-105" : "scale-100"
            }`}
            style={{
              backgroundColor: "rgba(7, 16, 35, 0.95)",
              color: color,
              border: `1px solid ${color}80`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px ${color}40`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main 3D Canvas Scene Component
export function DissectionScene3D({
  hotspots,
  activeSystem,
  selectedOrgan,
  onSelectOrgan,
  language,
  xrayMode = false,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const spots3D = useMemo(() => {
    return hotspots.map((spot) => {
      const cfg = ORGAN_3D_CONFIG[spot.id] || { pos3D: [0, 0, 0] };
      return { ...spot, ...cfg };
    });
  }, [hotspots]);

  const filteredSpots = useMemo(() => {
    return spots3D.filter(
      (spot) => activeSystem === "all" || spot.system === activeSystem
    );
  }, [spots3D, activeSystem]);

  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.2], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Studio Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 15, 10]} intensity={2.4} color="#FFFFFF" />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#38BDF8" />
      <pointLight position={[0, 4, 3]} intensity={1.5} color="#38BDF8" />

      <group>
        {/* Realistic Shark Model */}
        <Suspense
          fallback={
            <Html center zIndexRange={[100, 0]}>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-bold text-xs backdrop-blur-md shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Đang tải mô hình 3D Cá Mập...</span>
              </div>
            </Html>
          }
        >
          <RealisticSharkModel xrayMode={xrayMode} />
        </Suspense>

        {/* Clean Hotspot Pins (Labels display ONLY on Hover/Click) */}
        {filteredSpots.map((spot) => (
          <SleekHotspotPin
            key={spot.id}
            spot={spot}
            isSelected={selectedOrgan?.id === spot.id}
            isHovered={hoveredId === spot.id}
            onHover={setHoveredId}
            onClick={onSelectOrgan}
            language={language}
          />
        ))}
      </group>

      {/* 360 Orbit Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
        makeDefault
      />
    </Canvas>
  );
}
