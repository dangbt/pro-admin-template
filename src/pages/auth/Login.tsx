import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { ProForm, ProFormInput, ProFormCheckbox, Alert } from '@dangbt/pro-ui'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-fg">Pro Admin</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h1 className="text-xl font-bold text-fg">Welcome back</h1>
            <p className="text-sm text-fg-muted mt-1">Sign in to your account</p>
          </div>

          {error && <Alert variant="danger" title="Login failed">{error}</Alert>}

          <ProForm
            schema={schema}
            defaultValues={{ email: 'demo@example.com', password: 'password', remember: false }}
            onFinish={async (values) => {
              setError('')
              try {
                await login(values.email, values.password)
                navigate('/dashboard', { replace: true })
              } catch {
                setError('Invalid email or password. Try any email with password "password".')
              }
            }}
            submitText="Sign in"
          >
            <ProFormInput name="email"    label="Email"    type="email"    placeholder="you@example.com" />
            <ProFormInput name="password" label="Password" type="password" placeholder="••••••••" />
            <div className="flex items-center justify-between">
              <ProFormCheckbox name="remember" label="Remember me" />
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </ProForm>

          <p className="text-center text-sm text-fg-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-xs text-fg-disabled mt-4">
          Built with{' '}
          <a href="https://pro-ui.pages.dev" target="_blank" rel="noopener" className="text-primary hover:underline">
            @dangbt/pro-ui
          </a>
        </p>
      </div>
    </div>
  )
}
