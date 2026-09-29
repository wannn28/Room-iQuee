"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import * as THREE from "three";
import { BottomRack } from "@/components/BottomRack";
import { ROOM, type Placement, type StepId, type SurfaceKind } from "@/lib/types";
import styles from "./RoomConfigurator.module.css";

const RoomCanvas = dynamic(
  () => import("@/components/RoomCanvas").then((m) => m.RoomCanvas),
  { ssr: false },
);

function clampToCeiling(point: THREE.Vector3): Placement {
  const halfW = ROOM.width / 2 - 0.25;
  const halfD = ROOM.depth / 2 - 0.25;
  return {
    position: [
      THREE.MathUtils.clamp(point.x, -halfW, halfW),
      ROOM.height,
      THREE.MathUtils.clamp(point.z, -halfD, halfD),
    ],
  };
}

function clampToWall(point: THREE.Vector3, normal: THREE.Vector3): Placement | null {
  const n = normal.clone().normalize();
  if (Math.abs(n.y) > 0.35) return null;

  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;

  const distPosX = Math.abs(point.x - halfW);
  const distNegX = Math.abs(point.x + halfW);
  const distPosZ = Math.abs(point.z - halfD);
  const distNegZ = Math.abs(point.z + halfD);
  const nearest = Math.min(distPosX, distNegX, distPosZ, distNegZ);

  let x = point.x;
  let z = point.z;
  let nx = 0;
  let nz = 0;

  if (nearest === distPosX) {
    x = halfW;
    nx = 1;
    z = THREE.MathUtils.clamp(point.z, -halfD + 0.2, halfD - 0.2);
  } else if (nearest === distNegX) {
    x = -halfW;
    nx = -1;
    z = THREE.MathUtils.clamp(point.z, -halfD + 0.2, halfD - 0.2);
  } else if (nearest === distPosZ) {
    z = halfD;
    nz = 1;
    x = THREE.MathUtils.clamp(point.x, -halfW + 0.2, halfW - 0.2);
  } else {
    z = -halfD;
    nz = -1;
    x = THREE.MathUtils.clamp(point.x, -halfW + 0.2, halfW - 0.2);
  }

  const y = THREE.MathUtils.clamp(point.y, 0.9, ROOM.height - 0.35);

  return {
    position: [x, y, z],
    normal: [nx, 0, nz],
  };
}

export function RoomConfigurator() {
  const [step, setStep] = useState<StepId>("lampu");
  const [lamp, setLamp] = useState<Placement | null>(null);
  const [camera, setCamera] = useState<Placement | null>(null);
  const [hint, setHint] = useState("Ketuk langit-langit untuk memasang lampu.");

  const onPlace = useCallback(
    (kind: SurfaceKind, point: THREE.Vector3, normal: THREE.Vector3) => {
      if (step === "lampu") {
        if (kind !== "ceiling") {
          setHint("Langit-langit saja — klik itu diabaikan.");
          return;
        }
        setLamp(clampToCeiling(point));
        setHint("Lampu terpasang. Tekan Lanjut untuk langkah keamanan.");
        return;
      }
      if (step === "keamanan") {
        if (kind !== "wall") {
          setHint("Dinding saja — klik itu diabaikan.");
          return;
        }
        const placement = clampToWall(point, normal);
        if (!placement) return;
        setCamera(placement);
        setHint("Kamera terpasang. Tekan Selesai untuk menyelesaikan.");
      }
    },
    [step],
  );

  const canAdvance =
    (step === "lampu" && lamp !== null) ||
    (step === "keamanan" && camera !== null) ||
    step === "selesai";

  const onAdvance = () => {
    if (step === "lampu" && lamp) {
      setStep("keamanan");
      setHint("Ketuk dinding untuk memasang kamera.");
      return;
    }
    if (step === "keamanan" && camera) {
      setStep("selesai");
      setHint("Konfigurasi selesai. Ruangan siap.");
      return;
    }
    if (step === "selesai") {
      setStep("lampu");
      setLamp(null);
      setCamera(null);
      setHint("Ketuk langit-langit untuk memasang lampu.");
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.brandBar}>
        <div className={styles.brandMark} aria-hidden="true" />
        <div>
          <p className={styles.brandName}>Aruna</p>
          <p className={styles.brandTag}>Konfigurator perangkat rumah</p>
        </div>
      </header>

      <p className={styles.hint} role="status">
        {hint}
      </p>

      <div className={styles.viewport}>
        <RoomCanvas step={step} lamp={lamp} camera={camera} onPlace={onPlace} />
      </div>

      <BottomRack step={step} canAdvance={canAdvance} onAdvance={onAdvance} />
    </div>
  );
}
