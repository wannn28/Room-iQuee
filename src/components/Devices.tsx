"use client";

import type { Placement } from "@/lib/types";

export function CeilingLamp({ placement }: { placement: Placement }) {
  const [x, , z] = placement.position;
  const y = placement.position[1] - 0.18;

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
        <meshStandardMaterial color="#2a2a28" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
        <meshStandardMaterial color="#1a1a18" />
      </mesh>
      <group position={[0, -0.12, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.28, 0.22, 32, 1, true]} />
          <meshStandardMaterial
            color="#f5f0e4"
            side={2}
            roughness={0.7}
            emissive="#fff1c9"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#fff8e7" emissive="#ffe08a" emissiveIntensity={1.2} />
        </mesh>
        <pointLight color="#ffe6a8" intensity={1.4} distance={5} decay={2} />
      </group>
    </group>
  );
}

export function WallCamera({ placement }: { placement: Placement }) {
  const [x, y, z] = placement.position;
  const n = placement.normal ?? [0, 0, 1];
  const ox = x - n[0] * 0.08;
  const oz = z - n[2] * 0.08;
  const yaw = Math.atan2(-n[0], -n[2]);

  return (
    <group position={[ox, y, oz]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshStandardMaterial color="#2c2c2a" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.11, 0.08, 0.14]} />
        <meshStandardMaterial color="#1e1e1c" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.05, 20]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#1a3040" emissive="#3aa0ff" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0.04, 0.03, 0.17]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#ff3030" emissive="#ff2020" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

export function DeviceGlyph({
  kind,
  className,
}: {
  kind: "lampu" | "keamanan";
  className?: string;
}) {
  if (kind === "lampu") {
    return (
      <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 8v10M32 22c-7 0-12 5-12 12 0 5 3 9 8 11v5h8v-5c5-2 8-6 8-11 0-7-5-12-12-12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M26 50h12M28 56h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <rect
        x="10"
        y="18"
        width="36"
        height="28"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="28" cy="32" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="28" cy="32" r="3" fill="currentColor" />
      <path
        d="M46 26h8v12h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
