import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor'
}

interface AuthCtxValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthCtx = createContext<AuthCtxValue>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pro-admin-user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('pro-admin-user', JSON.stringify(user))
    else localStorage.removeItem('pro-admin-user')
  }, [user])

  const login = async (email: string, _password: string) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800))
    const mockUser: User = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: 'admin',
    }
    setUser(mockUser)
  }

  const logout = () => setUser(null)

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
