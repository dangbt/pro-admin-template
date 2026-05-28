import { useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ProForm, ProFormInput, Alert } from '@dangbt/pro-ui'
import { Mail } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)

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
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-success" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">Check your email</h1>
                <p className="text-sm text-fg-muted mt-2">
                  We've sent a password reset link. Check your inbox and follow the instructions.
                </p>
              </div>
              <Alert variant="info">Didn't receive it? Check your spam folder or try again.</Alert>
              <Link to="/login" className="block text-sm text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-xl font-bold text-fg">Forgot password?</h1>
                <p className="text-sm text-fg-muted mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <ProForm
                schema={schema}
                onFinish={async () => {
                  await new Promise(r => setTimeout(r, 800))
                  setSent(true)
                }}
                submitText="Send reset link"
              >
                <ProFormInput name="email" label="Email address" placeholder="you@example.com" type="email" />
              </ProForm>

              <p className="text-center text-sm text-fg-muted">
                Remember it?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
