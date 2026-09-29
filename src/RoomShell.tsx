import { useMemo } from 'react'
import { type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOM, type SurfaceKind } from './types'

type RoomProps = {
  onSurfaceClick: (kind: SurfaceKind, point: THREE.Vector3, normal: THREE.Vector3) => void
}

function Wall({
  position,
  rotation,
  size,
  onHit,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number]
  onHit: (e: ThreeEvent<MouseEvent>) => void
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onHit(e)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'crosshair'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial color="#f2efe8" roughness={0.92} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function RoomShell({ onSurfaceClick }: RoomProps) {
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c4a574',
        roughness: 0.85,
        metalness: 0.05,
      }),
    [],
  )

  const handle =
    (kind: SurfaceKind) =>
    (e: ThreeEvent<MouseEvent>) => {
      const point = e.point.clone()
      const normal = e.face?.normal
        ? e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize()
        : new THREE.Vector3(0, kind === 'ceiling' ? -1 : 1, 0)
      onSurfaceClick(kind, point, normal)
    }

  const { width: w, depth: d, height: h } = ROOM
  const yMid = h / 2

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          handle('floor')(e)
        }}
      >
        <planeGeometry args={[w, d]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Ceiling — clickable for lamp */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, h, 0]}
        onClick={(e) => {
          e.stopPropagation()
          handle('ceiling')(e)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'crosshair'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#ebe7df" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Four walls */}
      <Wall position={[0, yMid, -d / 2]} rotation={[0, 0, 0]} size={[w, h]} onHit={handle('wall')} />
      <Wall position={[0, yMid, d / 2]} rotation={[0, Math.PI, 0]} size={[w, h]} onHit={handle('wall')} />
      <Wall position={[-w / 2, yMid, 0]} rotation={[0, Math.PI / 2, 0]} size={[d, h]} onHit={handle('wall')} />
      <Wall position={[w / 2, yMid, 0]} rotation={[0, -Math.PI / 2, 0]} size={[d, h]} onHit={handle('wall')} />

      {/* Soft baseboard hint */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[w - 0.02, 0.08, d - 0.02]} />
        <meshStandardMaterial color="#d9c4a0" roughness={0.8} />
      </mesh>
    </group>
  )
}
