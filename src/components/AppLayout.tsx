import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Users, Settings, CreditCard as BillingIcon,
  Bell, LogOut, UserCircle, Moon, Sun, CreditCard, Shield, PanelLeft, Zap,
} from 'lucide-react'
import { Layout, Avatar, Badge, useTheme } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'
import logoIconUrl from '../assets/logo-icon.svg'
import { CommandPalette } from './CommandPalette'
import { NotificationsDrawer, SEED_NOTIFICATIONS } from './NotificationsDrawer'
import type { Notification } from './NotificationsDrawer'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
      title={isDark ? 'Switch to light' : 'Switch to dark'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

interface Props {
  onSwitchLayout: () => void
}

export default function AppLayout({ onSwitchLayout }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS)
  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const handleClearAll    = () => setNotifications([])
  const handleDismiss     = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id))

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/analytics', label: 'Analytics',  icon: <BarChart2 className="w-4 h-4" /> },
    { path: '/users',     label: 'Users',       icon: <Users className="w-4 h-4" />, badge: <Badge size="sm" color="primary">24</Badge> },
    { path: '/billing',   label: 'Billing',     icon: <BillingIcon className="w-4 h-4" /> },
    { path: '/settings',  label: 'Settings',    icon: <Settings className="w-4 h-4" /> },
  ]

  return (
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

      <Layout className="min-h-screen">
        <Layout.TopNav>
          <Layout.TopNav.Brand>
            <img src={logoIconUrl} alt="pro-ui" className="w-7 h-7 shrink-0" />
            <span className="font-semibold text-fg text-sm hidden sm:block">Pro Admin</span>
          </Layout.TopNav.Brand>

          <Layout.TopNav.Menu>
            {navItems.map(item => (
              <Layout.TopNav.Item
                key={item.path}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                active={pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))}
                onClick={() => navigate(item.path)}
              />
            ))}
          </Layout.TopNav.Menu>

          <Layout.TopNav.Actions>
            {/* Back to pro-ui ecosystem */}
            <div className="hidden sm:flex items-center gap-1 mr-1">
              <a
                href="https://pro-ui.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-lg transition-colors"
              >
                pro-ui ↗
              </a>
              <a
                href="https://pro-ui-docs.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-lg transition-colors"
              >
                Docs ↗
              </a>
            </div>

            {/* ⌘K hint */}
            <button
              onClick={() => {
                const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
                document.dispatchEvent(evt)
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-fg-muted border border-border hover:bg-surface-subtle transition-colors"
              title="Open command palette (⌘K)"
            >
              <span>Search</span>
              <kbd className="text-[10px] font-mono text-fg-disabled">⌘K</kbd>
            </button>

            <a
              href="https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Get Pro — $39
            </a>

            {/* Bell with unread badge */}
            <button
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

            {/* Layout switcher */}
            <button
              onClick={onSwitchLayout}
              className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
              title="Switch to sidebar layout"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <Layout.TopNav.Item
              label={user?.name ?? 'Account'}
              icon={<Avatar name={user?.name} size="sm" />}
              items={[
                { label: 'Profile',   icon: <UserCircle className="w-4 h-4" />,  onClick: () => navigate('/settings') },
                { label: 'Billing',   icon: <CreditCard className="w-4 h-4" />,  onClick: () => navigate('/billing') },
                { label: 'Security',  icon: <Shield className="w-4 h-4" />,      onClick: () => navigate('/settings') },
                { divider: true },
                { label: 'Sign out',  icon: <LogOut className="w-4 h-4" />,      onClick: logout, danger: true },
              ]}
            />
          </Layout.TopNav.Actions>
        </Layout.TopNav>

        <Layout.Content padding scrollable className="bg-canvas">
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
        </Layout.Content>
      </Layout>
    </>
  )
}
