"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type * as THREE from "three";
import { RoomShell } from "@/components/RoomShell";
import { CeilingLamp, WallCamera } from "@/components/Devices";
import { ROOM, type Placement, type StepId, type SurfaceKind } from "@/lib/types";
import styles from "./RoomConfigurator.module.css";

type RoomCanvasProps = {
  step: StepId;
  lamp: Placement | null;
  camera: Placement | null;
  onPlace: (kind: SurfaceKind, point: THREE.Vector3, normal: THREE.Vector3) => void;
};

export function RoomCanvas({ step, lamp, camera, onPlace }: RoomCanvasProps) {
  return (
    <Canvas
      className={styles.sceneCanvas}
      shadows
      camera={{ position: [3.8, 1.55, 6.2], fov: 42, near: 0.1, far: 40 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#d9e2dc"]} />
      <fog attach="fog" args={["#d9e2dc", 10, 22]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[3.5, 6, 2.5]}
        intensity={1.15}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2.5, 3, -2]} intensity={0.35} />

      <group>
        <RoomShell step={step} onSurfaceClick={onPlace} />
        {lamp ? <CeilingLamp placement={lamp} /> : null}
        {camera ? <WallCamera placement={camera} /> : null}
      </group>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.28} scale={12} blur={2.4} far={6} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, ROOM.height * 0.42, 0]}
      />
    </Canvas>
  );
}
