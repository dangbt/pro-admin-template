import { useRef, useState, useCallback } from 'react'

/* ── Animated Gradient Border ─────────────────────────── */
export function GradientBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-xl p-px overflow-hidden ${className}`}>
      <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#6366f1,#10b981,#f59e0b,#ef4444,#6366f1)]" />
      <div className="relative bg-surface rounded-[11px] h-full">
        {children}
      </div>
    </div>
  )
}

/* ── Spotlight Card — glows where cursor hovers ───────── */
export function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-300 hover:shadow-xl ${className}`}
    >
      {/* Spotlight glow */}
      {active && (
        <div
          className="pointer-events-none absolute -inset-px opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, var(--color-primary), transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
