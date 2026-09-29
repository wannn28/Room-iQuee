import { useCallback, useState } from 'react'
import * as THREE from 'three'
import { BottomRack } from './BottomRack'
import { Scene } from './Scene'
import { ROOM, type Placement, type StepId, type SurfaceKind } from './types'
import './App.css'

function clampToCeiling(point: THREE.Vector3): Placement {
  const halfW = ROOM.width / 2 - 0.25
  const halfD = ROOM.depth / 2 - 0.25
  return {
    position: [
      THREE.MathUtils.clamp(point.x, -halfW, halfW),
      ROOM.height,
      THREE.MathUtils.clamp(point.z, -halfD, halfD),
    ],
  }
}

function clampToWall(point: THREE.Vector3, normal: THREE.Vector3): Placement | null {
  const n = normal.clone().normalize()
  // Only vertical walls (ignore near-horizontal hits)
  if (Math.abs(n.y) > 0.35) return null

  const halfW = ROOM.width / 2
  const halfD = ROOM.depth / 2

  // Snap to the nearest wall plane by hit position (not normal sign)
  const distPosX = Math.abs(point.x - halfW)
  const distNegX = Math.abs(point.x + halfW)
  const distPosZ = Math.abs(point.z - halfD)
  const distNegZ = Math.abs(point.z + halfD)
  const nearest = Math.min(distPosX, distNegX, distPosZ, distNegZ)

  let x = point.x
  let z = point.z
  let nx = 0
  let nz = 0

  if (nearest === distPosX) {
    x = halfW
    nx = 1
    z = THREE.MathUtils.clamp(point.z, -halfD + 0.2, halfD - 0.2)
  } else if (nearest === distNegX) {
    x = -halfW
    nx = -1
    z = THREE.MathUtils.clamp(point.z, -halfD + 0.2, halfD - 0.2)
  } else if (nearest === distPosZ) {
    z = halfD
    nz = 1
    x = THREE.MathUtils.clamp(point.x, -halfW + 0.2, halfW - 0.2)
  } else {
    z = -halfD
    nz = -1
    x = THREE.MathUtils.clamp(point.x, -halfW + 0.2, halfW - 0.2)
  }

  const y = THREE.MathUtils.clamp(point.y, 0.9, ROOM.height - 0.35)

  return {
    position: [x, y, z],
    // Outward from room center toward the wall
    normal: [nx, 0, nz],
  }
}

export default function App() {
  const [step, setStep] = useState<StepId>('lampu')
  const [lamp, setLamp] = useState<Placement | null>(null)
  const [camera, setCamera] = useState<Placement | null>(null)
  const [hint, setHint] = useState('Ketuk langit-langit untuk memasang lampu.')

  const onPlace = useCallback(
    (kind: SurfaceKind, point: THREE.Vector3, normal: THREE.Vector3) => {
      if (step === 'lampu') {
        if (kind !== 'ceiling') {
          // Wrong surface — ignore, place nothing
          return
        }
        setLamp(clampToCeiling(point))
        setHint('Lampu terpasang. Tekan Lanjut untuk langkah keamanan.')
        return
      }
      if (step === 'keamanan') {
        if (kind !== 'wall') {
          return
        }
        const placement = clampToWall(point, normal)
        if (!placement) return
        setCamera(placement)
        setHint('Kamera terpasang. Tekan Selesai untuk menyelesaikan.')
      }
    },
    [step],
  )

  const canAdvance =
    (step === 'lampu' && lamp !== null) ||
    (step === 'keamanan' && camera !== null) ||
    step === 'selesai'

  const onAdvance = () => {
    if (step === 'lampu' && lamp) {
      setStep('keamanan')
      setHint('Ketuk dinding untuk memasang kamera.')
      return
    }
    if (step === 'keamanan' && camera) {
      setStep('selesai')
      setHint('Konfigurasi selesai. Ruangan siap.')
      return
    }
    if (step === 'selesai') {
      setStep('lampu')
      setLamp(null)
      setCamera(null)
      setHint('Ketuk langit-langit untuk memasang lampu.')
    }
  }

  return (
    <div className="app">
      <header className="brand-bar">
        <div className="brand-mark" aria-hidden="true" />
        <div className="brand-text">
          <p className="brand-name">Aruna</p>
          <p className="brand-tag">Konfigurator perangkat rumah</p>
        </div>
      </header>

      <p className="hint" role="status">
        {hint}
      </p>

      <main className="viewport">
        <Scene step={step} lamp={lamp} camera={camera} onPlace={onPlace} />
      </main>

      <BottomRack step={step} canAdvance={canAdvance} onAdvance={onAdvance} />
    </div>
  )
}
