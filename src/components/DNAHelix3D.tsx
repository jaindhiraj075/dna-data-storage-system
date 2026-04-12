import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const BASES = ["A", "T", "C", "G"] as const;
const BASE_COLORS: Record<string, string> = {
  A: "#ef4444",
  T: "#3b82f6",
  C: "#22c55e",
  G: "#eab308",
};

function HelixStrand() {
  const groupRef = useRef<THREE.Group>(null);
  const steps = 30;
  const radius = 1.2;
  const height = 12;
  const turns = 3;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1: { pos: THREE.Vector3; base: string }[] = [];
    const s2: { pos: THREE.Vector3; base: string }[] = [];
    const r: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const y = t * height - height / 2;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const base = BASES[i % 4];
      const complementBase = BASES[(i + 2) % 4];

      s1.push({ pos: new THREE.Vector3(x1, y, z1), base });
      s2.push({ pos: new THREE.Vector3(x2, y, z2), base: complementBase });

      if (i % 2 === 0) {
        r.push({
          start: new THREE.Vector3(x1, y, z1),
          end: new THREE.Vector3(x2, y, z2),
        });
      }
    }
    return { strand1: s1, strand2: s2, rungs: r };
  }, []);

  const strandCurve1 = useMemo(() => {
    return new THREE.CatmullRomCurve3(strand1.map((s) => s.pos));
  }, [strand1]);

  const strandCurve2 = useMemo(() => {
    return new THREE.CatmullRomCurve3(strand2.map((s) => s.pos));
  }, [strand2]);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Strand backbones */}
        <mesh>
          <tubeGeometry args={[strandCurve1, 120, 0.07, 8, false]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} transparent opacity={0.9} />
        </mesh>
        <mesh>
          <tubeGeometry args={[strandCurve2, 120, 0.07, 8, false]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} transparent opacity={0.9} />
        </mesh>

        {/* Nodes */}
        {strand1.map((s, i) => (
          <mesh key={`s1-${i}`} position={s.pos}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={BASE_COLORS[s.base]}
              emissive={BASE_COLORS[s.base]}
              emissiveIntensity={2}
            />
          </mesh>
        ))}
        {strand2.map((s, i) => (
          <mesh key={`s2-${i}`} position={s.pos}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={BASE_COLORS[s.base]}
              emissive={BASE_COLORS[s.base]}
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        {/* Rungs */}
        {rungs.map((rung, i) => {
          const mid = new THREE.Vector3().lerpVectors(rung.start, rung.end, 0.5);
          const dir = new THREE.Vector3().subVectors(rung.end, rung.start);
          const len = dir.length();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.normalize()
          );
          return (
            <mesh key={`r-${i}`} position={mid} quaternion={quat}>
              <cylinderGeometry args={[0.025, 0.025, len, 6]} />
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={0.8}
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

const DNAHelix3D = () => {
  return (
    <div className="hidden md:block absolute right-0 top-0 w-[35%] lg:w-[40%] h-[60vh] pointer-events-auto" style={{ zIndex: 2 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00f0ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#a855f7" />
        <pointLight position={[0, -6, 4]} intensity={0.4} color="#3b82f6" />
        <hemisphereLight args={["#00f0ff", "#0f172a", 0.3]} />
        <HelixStrand />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
    </div>
  );
};

export default DNAHelix3D;
