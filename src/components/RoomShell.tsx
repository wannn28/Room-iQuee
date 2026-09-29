"use client";

import { useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM, type StepId, type SurfaceKind } from "@/lib/types";

type RoomProps = {
  step: StepId;
  onSurfaceClick: (kind: SurfaceKind, point: THREE.Vector3, normal: THREE.Vector3) => void;
};

function surfaceHandlers(
  kind: SurfaceKind,
  onHit: (kind: SurfaceKind, e: ThreeEvent<PointerEvent>) => void,
) {
  return {
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHit(kind, e);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "crosshair";
    },
    onPointerOut: () => {
      document.body.style.cursor = "default";
    },
  };
}

function Wall({
  position,
  rotation,
  size,
  active,
  onHit,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  active: boolean;
  onHit: (e: ThreeEvent<PointerEvent>) => void;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "crosshair";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={active ? "#e8f2ec" : "#f2efe8"}
        roughness={0.92}
        metalness={0.02}
        emissive={active ? "#7cb89a" : "#000000"}
        emissiveIntensity={active ? 0.08 : 0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function RoomShell({ step, onSurfaceClick }: RoomProps) {
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4a574",
        roughness: 0.85,
        metalness: 0.05,
      }),
    [],
  );

  const handle =
    (kind: SurfaceKind) =>
    (e: ThreeEvent<PointerEvent>) => {
      const point = e.point.clone();
      const normal = e.face?.normal
        ? e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize()
        : new THREE.Vector3(0, kind === "ceiling" ? -1 : 1, 0);
      onSurfaceClick(kind, point, normal);
    };

  const { width: w, depth: d, height: h } = ROOM;
  const wallH = h - 0.12;
  const yMid = wallH / 2;
  const ceilingActive = step === "lampu";
  const wallActive = step === "keamanan";

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        {...surfaceHandlers("floor", (kind, e) => handle(kind)(e))}
      >
        <planeGeometry args={[w, d]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      <mesh position={[0, h + 0.02, 0]} {...surfaceHandlers("ceiling", (kind, e) => handle(kind)(e))}>
        <boxGeometry args={[w + 0.08, 0.14, d + 0.08]} />
        <meshStandardMaterial
          color={ceilingActive ? "#f3e6c4" : "#ebe7df"}
          roughness={0.9}
          emissive={ceilingActive ? "#d4a84b" : "#000000"}
          emissiveIntensity={ceilingActive ? 0.28 : 0}
        />
      </mesh>

      <Wall
        position={[0, yMid, -d / 2]}
        rotation={[0, 0, 0]}
        size={[w, wallH]}
        active={wallActive}
        onHit={handle("wall")}
      />
      <Wall
        position={[-w / 2, yMid, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[d, wallH]}
        active={wallActive}
        onHit={handle("wall")}
      />
      <Wall
        position={[w / 2, yMid, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[d, wallH]}
        active={wallActive}
        onHit={handle("wall")}
      />

      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[w - 0.02, 0.08, d - 0.02]} />
        <meshStandardMaterial color="#d9c4a0" roughness={0.8} />
      </mesh>
    </group>
  );
}
