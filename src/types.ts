export type StepId = 'lampu' | 'keamanan' | 'selesai'

export type SurfaceKind = 'ceiling' | 'wall' | 'floor'

export type Placement = {
  position: [number, number, number]
  /** Wall normal for camera orientation: +x, -x, +z, -z */
  normal?: [number, number, number]
}

export const ROOM = {
  width: 6,
  depth: 5,
  height: 2.8,
} as const

export const STEPS: { id: StepId; label: string }[] = [
  { id: 'lampu', label: 'Lampu' },
  { id: 'keamanan', label: 'Keamanan' },
]
