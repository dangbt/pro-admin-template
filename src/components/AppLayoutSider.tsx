import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Users, Settings, CreditCard as BillingIcon,
  Bell, LogOut, UserCircle, Moon, Sun, CreditCard, Shield, LayoutTemplate, ChevronLeft, Zap,
} from 'lucide-react'
import { Avatar, Badge, useTheme } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'
import logoIconUrl from '../assets/logo-icon.svg'
import { CommandPalette } from './CommandPalette'
import { NotificationsDrawer, SEED_NOTIFICATIONS } from './NotificationsDrawer'
import type { Notification } from './NotificationsDrawer'

/* ── ThemeToggle ── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

/* ── Page title map ── */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/users':     'Users',
  '/billing':   'Billing',
  '/settings':  'Settings',
}

/* ── UserMenu — plain custom dropdown, no react-aria Popover/inert ── */
interface UserMenuProps {
  name?: string
  email?: string
  collapsed: boolean
  onNavigate: (path: string) => void
  onLogout: () => void
}

function UserMenu({ name, email, collapsed, onNavigate, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  const menuItems = [
    { label: 'Profile',  icon: <UserCircle className="w-4 h-4" />, onClick: () => { onNavigate('/settings'); setOpen(false) } },
    { label: 'Billing',  icon: <CreditCard className="w-4 h-4" />, onClick: () => { onNavigate('/settings'); setOpen(false) } },
    { label: 'Security', icon: <Shield     className="w-4 h-4" />, onClick: () => { onNavigate('/settings'); setOpen(false) } },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center w-full rounded-[var(--base-radius)] hover:bg-surface-subtle transition-colors text-left',
          collapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2',
        ].join(' ')}
      >
        <Avatar name={name} size="sm" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-fg truncate leading-tight">{name}</p>
            <p className="text-xs text-fg-muted truncate leading-tight">{email}</p>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1 min-w-44 bg-surface-raised border border-border rounded-[var(--base-radius)] shadow-lg py-1 z-50">
          {menuItems.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-fg-2 hover:bg-primary-50 hover:text-primary transition-colors text-left"
            >
              <span className="w-4 h-4 shrink-0">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="my-1 border-t border-border-subtle" />
          <button
            type="button"
            onClick={() => { onLogout(); setOpen(false) }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-danger hover:bg-danger-50 transition-colors text-left"
          >
            <span className="w-4 h-4 shrink-0"><LogOut className="w-4 h-4" /></span>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

/* ── AppLayoutSider ── */
interface Props { onSwitchLayout: () => void }

export default function AppLayoutSider({ onSwitchLayout }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const w = collapsed ? 56 : 220

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS)
  const unreadCount = notifications.filter(n => !n.read).length
  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const handleClearAll    = () => setNotifications([])
  const handleDismiss     = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id))

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/analytics', label: 'Analytics',  icon: <BarChart2      className="w-4 h-4" /> },
    { path: '/users',     label: 'Users',       icon: <Users          className="w-4 h-4" />, badge: <Badge size="sm" color="primary">24</Badge> },
    { path: '/billing',   label: 'Billing',     icon: <BillingIcon    className="w-4 h-4" /> },
    { path: '/settings',  label: 'Settings',    icon: <Settings       className="w-4 h-4" /> },
  ]

  return (
    /* Root: locks to viewport — nothing overflows the page */
    <>
    <CommandPalette />
    <NotificationsDrawer
      open={notifOpen}
      notifications={notifications}
      onClose={() => setNotifOpen(false)}
      onMarkAllRead={handleMarkAllRead}
      onClearAll={handleClearAll}
      onDismiss={handleDismiss}
    />
    <div className="flex h-screen overflow-hidden bg-canvas">

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col bg-surface border-r border-border shrink-0 overflow-hidden transition-[width,min-width] duration-300 ease-in-out"
        style={{ width: w, minWidth: w }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-3.5 border-b border-border-subtle shrink-0">
          <img src={logoIconUrl} alt="pro-ui" className="w-7 h-7 shrink-0" />
          {!collapsed && <span className="font-semibold text-fg text-sm whitespace-nowrap">Pro Admin</span>}
        </div>

        {/* Nav — scrollable, takes all remaining height */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3">
          <ul className="space-y-0.5 px-2">
            {navItems.map(item => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={[
                      'flex items-center w-full rounded-[var(--base-radius)] transition-colors text-sm',
                      collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
                      isActive
                        ? 'bg-primary-50 text-primary font-medium'
                        : 'text-fg-muted hover:bg-surface-subtle hover:text-fg-2',
                    ].join(' ')}
                  >
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                        {item.badge && <span className="shrink-0">{item.badge}</span>}
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section — always at bottom */}
        <div className="shrink-0 border-t border-border-subtle p-2">
          <UserMenu
            name={user?.name}
            email={user?.email}
            collapsed={collapsed}
            onNavigate={navigate}
            onLogout={logout}
          />
        </div>

        {/* Upgrade banner */}
        {collapsed ? (
          <div className="shrink-0 border-t border-border-subtle p-2 flex justify-center">
            <button
              type="button"
              title="Upgrade to Pro — $39/mo"
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="shrink-0 border-t border-border-subtle p-3">
            <div className="rounded-xl bg-primary-50 border border-primary-100 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary">Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-fg-muted leading-relaxed">
                Unlock advanced features and priority support.
              </p>
              <a
                href="https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary text-white text-xs font-semibold py-1.5 hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-3 h-3" />
                Get Pro — $39
              </a>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className={[
            'shrink-0 flex items-center border-t border-border-subtle px-4 py-3 text-fg-disabled hover:bg-surface-subtle hover:text-fg-muted transition-colors',
            collapsed ? 'justify-center' : 'gap-2',
          ].join(' ')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="text-xs whitespace-nowrap">Collapse</span>}
        </button>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Topbar */}
        <header className="h-14 flex items-center shrink-0 bg-surface border-b border-border px-5 gap-3">
          <p className="flex-1 text-sm font-semibold text-fg">
            {PAGE_TITLES[pathname] ?? ''}
          </p>
          <div className="flex items-center gap-1">
            {/* Back to pro-ui ecosystem */}
            <a
              href="https://pro-ui.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-lg transition-colors"
            >
              pro-ui ↗
            </a>
            <a
              href="https://pro-ui-docs.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Docs ↗
            </a>
            <button
              type="button"
              className="relative p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
              onClick={() => setNotifOpen(v => !v)}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={onSwitchLayout}
              className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
              title="Switch to top navigation"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content — only this scrolls */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 bg-canvas">
          <Outlet />
          <footer className="mt-12 pt-5 border-t border-border-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {[
                  { label: 'pro-ui',     href: 'https://pro-ui.pages.dev' },
                  { label: 'Docs',       href: 'https://pro-ui-docs.pages.dev' },
                  { label: 'GitHub',     href: 'https://github.com/dangbt/pro-ui' },
                  { label: 'npm',        href: 'https://www.npmjs.com/package/@dangbt/pro-ui' },
                  { label: 'Sponsor ☕', href: 'https://github.com/sponsors/dangbt' },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-fg-disabled hover:text-fg-muted transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
              <p className="text-xs text-fg-disabled">
                Built with <a href="https://pro-ui.pages.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">pro-ui</a> · MIT
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
    </>
  )
}
