import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { ProForm, ProFormInput, ProFormCheckbox } from '@dangbt/pro-ui'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
  terms:    z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
})

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
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
            <h1 className="text-xl font-bold text-fg">Create account</h1>
            <p className="text-sm text-fg-muted mt-1">Start your free trial today</p>
          </div>

          <ProForm
            schema={schema}
            onFinish={async (values) => {
              await login(values.email, values.password)
              navigate('/dashboard', { replace: true })
            }}
            submitText="Create account"
          >
            <ProFormInput name="name"     label="Full name"        placeholder="Alice Nguyen" />
            <ProFormInput name="email"    label="Email"            placeholder="you@example.com" type="email" />
            <ProFormInput name="password" label="Password"         placeholder="Min. 8 characters" type="password" />
            <ProFormInput name="confirm"  label="Confirm password" placeholder="Repeat password" type="password" />
            <ProFormCheckbox name="terms" label="I agree to the Terms of Service and Privacy Policy" />
          </ProForm>

          <p className="text-center text-sm text-fg-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
