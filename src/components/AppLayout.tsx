import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Users, Settings, CreditCard as BillingIcon,
  Bell, LogOut, UserCircle, Moon, Sun, CreditCard, Shield, PanelLeft, Zap,
} from 'lucide-react'
import { Layout, Avatar, Badge, useTheme } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'
import logoIconUrl from '../assets/logo-icon.svg'

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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/analytics', label: 'Analytics',  icon: <BarChart2 className="w-4 h-4" /> },
    { path: '/users',     label: 'Users',       icon: <Users className="w-4 h-4" />, badge: <Badge size="sm" color="primary">24</Badge> },
    { path: '/billing',   label: 'Billing',     icon: <BillingIcon className="w-4 h-4" /> },
    { path: '/settings',  label: 'Settings',    icon: <Settings className="w-4 h-4" /> },
  ]

  return (
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
          <a
            href="https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Get Pro — $39
          </a>
          <button className="relative p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full" />
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
              { label: 'Billing',   icon: <CreditCard className="w-4 h-4" />,  onClick: () => navigate('/settings') },
              { label: 'Security',  icon: <Shield className="w-4 h-4" />,      onClick: () => navigate('/settings') },
              { divider: true },
              { label: 'Sign out',  icon: <LogOut className="w-4 h-4" />,      onClick: logout, danger: true },
            ]}
          />
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content padding scrollable className="bg-canvas">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
