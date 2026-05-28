import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Palette, X, Check, RotateCcw } from 'lucide-react'

/* ── Presets ── */
const COLORS = [
  { name: 'Indigo',   value: '#6366f1' },
  { name: 'Violet',   value: '#7c3aed' },
  { name: 'Blue',     value: '#2563eb' },
  { name: 'Cyan',     value: '#0891b2' },
  { name: 'Teal',     value: '#0d9488' },
  { name: 'Emerald',  value: '#059669' },
  { name: 'Rose',     value: '#e11d48' },
  { name: 'Orange',   value: '#ea580c' },
  { name: 'Slate',    value: '#475569' },
]

const RADII = [
  { label: '0',  value: '0px'  },
  { label: '4',  value: '4px'  },
  { label: '8',  value: '8px'  },
  { label: '12', value: '12px' },
  { label: '20', value: '20px' },
]

const SIZES = [
  { label: 'Compact',      sz: '1.75rem' },
  { label: 'Default',      sz: '2.25rem' },
  { label: 'Comfortable',  sz: '2.75rem' },
]

const FONTS: { label: string; value: string; url: string }[] = [
  { label: 'System',       value: 'ui-sans-serif, system-ui, -apple-system, sans-serif', url: '' },
  { label: 'Inter',        value: '"Inter", sans-serif',                                  url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  { label: 'DM Sans',      value: '"DM Sans", sans-serif',                                url: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap' },
  { label: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif',                      url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' },
  { label: 'Mono',         value: 'ui-monospace, "Cascadia Code", monospace',             url: '' },
]

const STORAGE_KEY = 'pro-admin-theme-island'

interface Config {
  color:   string
  radius:  string
  size:    string
  font:    string
  fontUrl: string
}

const DEFAULT: Config = {
  color:   '#6366f1',
  radius:  '8px',
  size:    '2.25rem',
  font:    'ui-sans-serif, system-ui, -apple-system, sans-serif',
  fontUrl: '',
}

/* ── Apply config to :root CSS variables ── */
function applyConfig(cfg: Config) {
  const r = document.documentElement
  r.style.setProperty('--primary',     cfg.color)
  r.style.setProperty('--base-radius', cfg.radius)
  r.style.setProperty('--sz-sm',       `calc(${cfg.size} - 0.5rem)`)
  r.style.setProperty('--sz-md',       cfg.size)
  r.style.setProperty('--sz-lg',       `calc(${cfg.size} + 0.5rem)`)
  r.style.setProperty('--sz',          cfg.size)
  r.style.setProperty('--font-sans',   cfg.font)

  // Swap Google Font link
  const prev = document.getElementById('theme-island-font')
  if (cfg.fontUrl) {
    if (prev?.getAttribute('href') !== cfg.fontUrl) {
      prev?.remove()
      const link = document.createElement('link')
      link.id   = 'theme-island-font'
      link.rel  = 'stylesheet'
      link.href = cfg.fontUrl
      document.head.appendChild(link)
    }
  } else {
    prev?.remove()
  }
}

/* ── Tiny reusable segment button ── */
function SegBtn({ active, onClick, style, children }: {
  active: boolean
  onClick: () => void
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={[
        'flex-1 h-8 border text-xs font-medium transition-all',
        active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-surface text-fg-muted border-border hover:border-primary hover:text-primary',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

/* ── Section label ── */
function Label({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-disabled mb-2">{children}</p>
}

/* ── ThemeIsland ── */
export function ThemeIsland() {
  const [open, setOpen] = useState(false)
  const [cfg, setCfg] = useState<Config>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
    } catch { return DEFAULT }
  })
  const ref = useRef<HTMLDivElement>(null)

  // Apply saved config on first render
  useEffect(() => { applyConfig(cfg) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  const update = (patch: Partial<Config>) => {
    const next = { ...cfg, ...patch }
    setCfg(next)
    applyConfig(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const reset = () => update(DEFAULT)

  return createPortal(
    /* pointer-events-none on outer so the invisible collapsed panel never blocks clicks */
    <div ref={ref} className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 select-none pointer-events-none">

      {/* ── Panel ── */}
      <div
        className={[
          'w-72 bg-surface-raised border border-border rounded-2xl shadow-2xl overflow-hidden',
          'transition-all duration-200 origin-bottom-right pointer-events-auto',
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-fg">Theme</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={reset}
              className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-5">

          {/* ── Color ── */}
          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  title={c.name}
                  onClick={() => update({ color: c.value })}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shrink-0"
                  style={{
                    backgroundColor: c.value,
                    outline: cfg.color === c.value ? `2px solid ${c.value}` : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                >
                  {cfg.color === c.value && (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Radius ── */}
          <div>
            <Label>Radius</Label>
            <div className="flex gap-1.5">
              {RADII.map((r, i) => (
                <SegBtn
                  key={r.value}
                  active={cfg.radius === r.value}
                  onClick={() => update({ radius: r.value })}
                  style={{ borderRadius: i === 0 ? '4px' : i === 4 ? '9999px' : `${i * 3}px` }}
                >
                  {r.label}
                </SegBtn>
              ))}
            </div>
            {/* visual preview */}
            <div className="mt-2 h-8 bg-primary-50 border border-primary-200 flex items-center justify-center">
              <div
                className="h-5 w-16 bg-primary"
                style={{ borderRadius: cfg.radius }}
              />
            </div>
          </div>

          {/* ── Density ── */}
          <div>
            <Label>Density</Label>
            <div className="flex gap-1.5 rounded-[var(--base-radius)] overflow-hidden border border-border">
              {SIZES.map(s => (
                <button
                  key={s.sz}
                  onClick={() => update({ size: s.sz })}
                  className={[
                    'flex-1 py-1.5 text-xs font-medium transition-colors border-0',
                    cfg.size === s.sz
                      ? 'bg-primary text-white'
                      : 'text-fg-muted hover:bg-surface-subtle hover:text-fg',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Font ── */}
          <div>
            <Label>Font Family</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {FONTS.map(f => (
                <button
                  key={f.label}
                  onClick={() => update({ font: f.value, fontUrl: f.url })}
                  className={[
                    'py-2 px-3 border rounded-lg text-xs font-medium transition-all text-left leading-tight',
                    cfg.font === f.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-fg-muted border-border hover:border-primary hover:text-primary',
                  ].join(' ')}
                  style={{ fontFamily: f.value }}
                >
                  <span className="block text-[15px] leading-none mb-0.5">Ag</span>
                  <span className="opacity-70">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── FAB ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="pointer-events-auto w-11 h-11 rounded-full text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
        style={{
          background: cfg.color,
          boxShadow: `0 4px 20px 0 ${cfg.color}55`,
        }}
        title="Customize theme"
      >
        <Palette className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-[20deg]' : ''}`} />
      </button>

    </div>,
    document.body,
  )
}
