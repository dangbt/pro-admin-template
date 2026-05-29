import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Users, Settings, CreditCard,
  Moon, Sun, LogOut, Search, ArrowRight, Keyboard,
} from 'lucide-react'
import { useTheme } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'

/* ────────────────────────────────────────────
   Types
──────────────────────────────────────────── */
interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  section: 'navigate' | 'action'
  action: () => void
}

/* ────────────────────────────────────────────
   Match highlight — bold matching chars
──────────────────────────────────────────── */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-primary font-bold">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ────────────────────────────────────────────
   CommandPalette component
──────────────────────────────────────────── */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const go = useCallback((item: CommandItem) => {
    item.action()
    close()
  }, [close])

  // Build items (memoized by deps)
  const allItems = useCallback((): CommandItem[] => [
    { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard className="w-4 h-4" />, shortcut: 'G D', section: 'navigate', action: () => navigate('/dashboard') },
    { id: 'analytics', label: 'Analytics',  icon: <BarChart2 className="w-4 h-4" />,       shortcut: 'G A', section: 'navigate', action: () => navigate('/analytics') },
    { id: 'users',     label: 'Users',       icon: <Users className="w-4 h-4" />,           shortcut: 'G U', section: 'navigate', action: () => navigate('/users') },
    { id: 'billing',   label: 'Billing',     icon: <CreditCard className="w-4 h-4" />,      shortcut: 'G B', section: 'navigate', action: () => navigate('/billing') },
    { id: 'settings',  label: 'Settings',   icon: <Settings className="w-4 h-4" />,         shortcut: 'G S', section: 'navigate', action: () => navigate('/settings') },
    { id: 'theme',   label: isDark ? 'Switch to Light mode' : 'Switch to Dark mode',
      icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      section: 'action', action: () => setTheme(isDark ? 'light' : 'dark') },
    { id: 'logout', label: 'Sign out',  icon: <LogOut className="w-4 h-4" />,  section: 'action', action: logout },
  ], [navigate, isDark, setTheme, logout])

  const filtered = allItems().filter(item =>
    !query || item.label.toLowerCase().includes(query.toLowerCase())
  )

  const navItems    = filtered.filter(i => i.section === 'navigate')
  const actionItems = filtered.filter(i => i.section === 'action')
  const flat = [...navItems, ...actionItems]

  // Keyboard: open / navigate / select
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
        return
      }
      if (!open) return
      if (e.key === 'Escape') { close(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && flat[selected]) { go(flat[selected]) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, flat, selected, close, go])

  // Reset selection on query change
  useEffect(() => { setSelected(0) }, [query])

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-canvas/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'cmdEnter 150ms ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-fg-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages and actions…"
            className="flex-1 bg-transparent text-fg placeholder:text-fg-muted text-sm outline-none"
          />
          <kbd className="text-[10px] text-fg-disabled border border-border rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {flat.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-fg-muted">No results for <span className="font-medium text-fg">"{query}"</span></p>
            </div>
          )}

          {navItems.length > 0 && (
            <Section label="Navigate">
              {navItems.map((item) => {
                const idx = flat.indexOf(item)
                return <ItemRow key={item.id} item={item} active={idx === selected} query={query} onHover={() => setSelected(idx)} onSelect={() => go(item)} />
              })}
            </Section>
          )}

          {actionItems.length > 0 && (
            <Section label="Actions">
              {actionItems.map((item) => {
                const idx = flat.indexOf(item)
                return <ItemRow key={item.id} item={item} active={idx === selected} query={query} onHover={() => setSelected(idx)} onSelect={() => go(item)} />
              })}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-[11px] text-fg-disabled">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1">↵</kbd> select</span>
          </div>
          <span className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" /> ⌘K
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cmdEnter {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-fg-disabled px-2 py-1.5">{label}</p>
      {children}
    </div>
  )
}

function ItemRow({ item, active, query, onHover, onSelect }: {
  item: CommandItem; active: boolean; query: string
  onHover: () => void; onSelect: () => void
}) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onSelect}
      className={[
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
        active ? 'bg-primary text-white' : 'text-fg hover:bg-surface-subtle',
      ].join(' ')}
    >
      <span className={active ? 'text-white' : 'text-fg-muted'}>{item.icon}</span>
      <span className="flex-1 text-sm">
        <HighlightMatch text={item.label} query={query} />
      </span>
      {item.shortcut && (
        <span className={`text-[10px] font-mono flex items-center gap-0.5 ${active ? 'text-white/70' : 'text-fg-disabled'}`}>
          {item.shortcut.split(' ').map((k, i) => (
            <kbd key={i} className={`border rounded px-1 ${active ? 'border-white/30' : 'border-border'}`}>{k}</kbd>
          ))}
        </span>
      )}
      <ArrowRight className={`w-3 h-3 ${active ? 'opacity-70' : 'opacity-0'}`} />
    </button>
  )
}
