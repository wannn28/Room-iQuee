import { DeviceGlyph } from './Devices'
import type { StepId } from './types'

type RackProps = {
  step: StepId
  canAdvance: boolean
  onAdvance: () => void
}

export function BottomRack({ step, canAdvance, onAdvance }: RackProps) {
  const label = step === 'lampu' ? 'Lampu' : step === 'keamanan' ? 'Keamanan' : 'Selesai'
  const deviceKind = step === 'keamanan' || step === 'selesai' ? 'keamanan' : 'lampu'
  const cta = step === 'keamanan' ? 'Selesai' : step === 'selesai' ? 'Ulangi' : 'Lanjut'
  const disabled = step !== 'selesai' && !canAdvance

  return (
    <aside className="rack" aria-label="Rak konfigurasi">
      <div className="rack-left">
        <p className="rack-kicker">Langkah</p>
        <h2 className="rack-step">{label}</h2>
      </div>

      <div className="rack-center" aria-label={deviceKind === 'lampu' ? 'Lampu langit-langit' : 'Kamera dinding'}>
        <div className={`device-chip${step === 'selesai' ? ' is-done' : ''}`}>
          <DeviceGlyph kind={deviceKind === 'lampu' ? 'lampu' : 'keamanan'} />
          <span className="device-chip-name">
            {deviceKind === 'lampu' ? 'Lampu plafon' : 'Kamera dinding'}
          </span>
        </div>
      </div>

      <div className="rack-right">
        <button
          type="button"
          className="rack-cta"
          disabled={disabled}
          onClick={onAdvance}
        >
          {cta}
        </button>
      </div>
    </aside>
  )
}
