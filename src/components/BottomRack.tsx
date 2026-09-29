"use client";

import { DeviceGlyph } from "@/components/Devices";
import type { StepId } from "@/lib/types";
import styles from "./RoomConfigurator.module.css";

type RackProps = {
  step: StepId;
  canAdvance: boolean;
  onAdvance: () => void;
};

export function BottomRack({ step, canAdvance, onAdvance }: RackProps) {
  const label = step === "lampu" ? "Lampu" : step === "keamanan" ? "Keamanan" : "Selesai";
  const deviceKind = step === "keamanan" || step === "selesai" ? "keamanan" : "lampu";
  const cta = step === "keamanan" ? "Selesai" : step === "selesai" ? "Ulangi" : "Lanjut";
  const disabled = step !== "selesai" && !canAdvance;

  return (
    <aside className={styles.rack} aria-label="Rak konfigurasi">
      <div className={styles.rackLeft}>
        <p className={styles.rackKicker}>Langkah</p>
        <h2 className={styles.rackStep}>{label}</h2>
      </div>

      <div
        className={styles.rackCenter}
        aria-label={deviceKind === "lampu" ? "Lampu langit-langit" : "Kamera dinding"}
      >
        <div
          className={`${styles.deviceChip}${step === "selesai" ? ` ${styles.deviceChipDone}` : ""}`}
        >
          <DeviceGlyph
            kind={deviceKind === "lampu" ? "lampu" : "keamanan"}
            className={styles.deviceGlyph}
          />
          <span className={styles.deviceChipName}>
            {deviceKind === "lampu" ? "Lampu plafon" : "Kamera dinding"}
          </span>
        </div>
      </div>

      <div className={styles.rackRight}>
        <button
          type="button"
          className={styles.rackCta}
          disabled={disabled}
          onClick={onAdvance}
        >
          {cta}
        </button>
      </div>
    </aside>
  );
}
