import { useState } from 'react'

export type LayoutMode = 'topnav' | 'sider'

const STORAGE_KEY = 'pro-admin-layout'

export function useLayoutMode() {
  const [mode, setMode] = useState<LayoutMode>(
    () => (localStorage.getItem(STORAGE_KEY) as LayoutMode) ?? 'topnav',
  )

  const toggle = () => {
    const next: LayoutMode = mode === 'topnav' ? 'sider' : 'topnav'
    setMode(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { mode, toggle }
}
