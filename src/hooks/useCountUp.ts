import { useState, useEffect, useRef } from 'react'

/**
 * Animates from 0 → target over `duration` ms using easeOutExpo.
 * Restarts whenever `target` changes.
 */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(target * ease))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}
