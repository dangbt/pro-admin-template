import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useLayoutMode } from './hooks/useLayoutMode'
import { ThemeIsland } from './components/ThemeIsland'
import AppLayout from './components/AppLayout'
import AppLayoutSider from './components/AppLayoutSider'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Billing from './pages/Billing'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AppRoutes() {
  const { mode, toggle } = useLayoutMode()
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  const layoutElement = mode === 'sider'
    ? <AppLayoutSider onSwitchLayout={toggle} />
    : <AppLayout onSwitchLayout={toggle} />

  return (
    <>
      <Routes>
        {/* Landing — public, always accessible */}
        <Route path="/" element={<Landing />} />

        {/* Public auth pages */}
        <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* Protected — layout is swappable */}
        <Route element={<ProtectedRoute>{layoutElement}</ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/users"      element={<Users />} />
          <Route path="/billing"    element={<Billing />} />
          <Route path="/settings"   element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Theme island — show on landing page too so visitors can try it */}
      {(isAuthenticated || pathname === '/') && <ThemeIsland />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
