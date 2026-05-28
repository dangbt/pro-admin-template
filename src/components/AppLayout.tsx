import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Users, Settings,
  Bell, LogOut, UserCircle, Moon, Sun, CreditCard, Shield,
} from 'lucide-react'
import { Layout, Avatar, Badge, Button } from '@dangbt/pro-ui'
import { useTheme } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'

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

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/analytics', label: 'Analytics',  icon: <BarChart2 className="w-4 h-4" /> },
    { path: '/users',     label: 'Users',       icon: <Users className="w-4 h-4" />, badge: <Badge size="sm" color="primary">24</Badge> },
    { path: '/settings',  label: 'Settings',    icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <Layout className="min-h-screen">
      <Layout.TopNav>
        <Layout.TopNav.Brand>
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
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
          <button className="relative p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full" />
          </button>
          <ThemeToggle />
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
