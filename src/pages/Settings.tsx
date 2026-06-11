import { useState } from 'react'
import { z } from 'zod'
import { LogOut, Zap, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import {
  ProForm, ProFormRow, ProFormInput, ProFormTextarea, ProFormSelect,
  Button, Alert, toast, Avatar,
} from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'

const profileSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  bio:      z.string().max(200).optional(),
  timezone: z.string(),
  language: z.string(),
})

/* ── Simple accessible toggle — no hidden input, no scroll-on-focus ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        checked ? 'bg-primary' : 'bg-border',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-canvas shadow-sm',
          'mt-1 transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}

interface NotifState {
  emailDigest:     boolean
  productUpdates:  boolean
  securityAlerts:  boolean
  marketingEmails: boolean
  weeklyReport:    boolean
}

const NOTIF_ITEMS: { key: keyof NotifState; label: string; description: string }[] = [
  { key: 'emailDigest',     label: 'Email digest',      description: 'Receive a daily summary of activity' },
  { key: 'productUpdates',  label: 'Product updates',   description: 'New features and improvements' },
  { key: 'securityAlerts',  label: 'Security alerts',   description: 'Login attempts and suspicious activity' },
  { key: 'marketingEmails', label: 'Marketing emails',  description: 'Promotions, tips, and surveys' },
  { key: 'weeklyReport',    label: 'Weekly report',     description: 'Performance summary every Monday' },
]

export default function Settings() {
  const { user, logout } = useAuth()
  const [notif, setNotif] = useState<NotifState>({
    emailDigest:     true,
    productUpdates:  true,
    securityAlerts:  true,
    marketingEmails: false,
    weeklyReport:    true,
  })
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-fg">Settings</h1>
        <p className="text-sm text-fg-muted mt-1">Manage your account preferences.</p>
      </div>

      {/* Profile section */}
      <section className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-fg">Profile</h2>

        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <Button size="sm" variant="secondary" onPress={() => toast.info('Upload avatar')}>
              Change photo
            </Button>
            <p className="text-xs text-fg-muted mt-1">JPG, PNG or GIF. Max 1MB.</p>
          </div>
        </div>

        <ProForm
          schema={profileSchema}
          defaultValues={{
            name: user?.name ?? '',
            email: user?.email ?? '',
            timezone: 'Asia/Ho_Chi_Minh',
            language: 'en',
          }}
          onFinish={async (values) => {
            await new Promise(r => setTimeout(r, 600))
            toast.success(`Profile updated for ${values.name}`)
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })
          }}
          submitText="Save profile"
        >
          <ProFormRow>
            <ProFormInput name="name"  label="Full name"     placeholder="Your name" />
            <ProFormInput name="email" label="Email address" placeholder="you@example.com" type="email" />
          </ProFormRow>
          <ProFormTextarea name="bio" label="Bio" placeholder="Tell us about yourself…" />
          <ProFormSelect
            name="timezone"
            label="Timezone"
            options={[
              { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (UTC+7)' },
              { value: 'Asia/Tokyo',       label: 'Tokyo (UTC+9)' },
              { value: 'America/New_York', label: 'New York (UTC-5)' },
              { value: 'Europe/London',    label: 'London (UTC+0)' },
            ]}
          />
          <ProFormSelect
            name="language"
            label="Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'vi', label: 'Tiếng Việt' },
              { value: 'ja', label: '日本語' },
            ]}
          />
        </ProForm>
      </section>

      {/* Notifications section */}
      <section className="bg-surface border border-border rounded-xl p-6 space-y-1">
        <h2 className="font-semibold text-fg mb-4">Notifications</h2>
        {NOTIF_ITEMS.map((item, i) => (
          <div
            key={item.key}
            className={[
              'flex items-center justify-between gap-4 py-3',
              i < NOTIF_ITEMS.length - 1 ? 'border-b border-border-subtle' : '',
            ].join(' ')}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">{item.label}</p>
              <p className="text-xs text-fg-muted mt-0.5">{item.description}</p>
            </div>
            <Toggle
              checked={notif[item.key]}
              onChange={v => setNotif(prev => ({ ...prev, [item.key]: v }))}
            />
          </div>
        ))}
        <div className="pt-3">
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onPress={async () => {
              setSaving(true)
              await new Promise(r => setTimeout(r, 400))
              setSaving(false)
              toast.success('Notification preferences saved')
            }}
          >
            Save preferences
          </Button>
        </div>
      </section>

      {/* Upgrade to Pro */}
      <section className="rounded-xl overflow-hidden border border-primary-200">
        <div className="bg-primary px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Pro Plan</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">$39</span>
              <span className="text-sm text-white/70">/mo</span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">Billed monthly · cancel anytime</p>
          </div>
          <a
            href="https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/30"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade now
          </a>
        </div>
        <div className="bg-surface px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Unlimited projects',
              'Priority support',
              'Advanced analytics',
              'Custom domain',
              'Team collaboration',
              'API access',
            ].map(f => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                </div>
                <span className="text-sm text-fg-2">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign out */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-fg">Sign out</p>
            <p className="text-xs text-fg-muted mt-0.5">Sign out of your account on this device</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onPress={logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-surface border border-danger-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-danger">Danger zone</h2>
        <Alert variant="danger" title="Irreversible actions">
          These actions cannot be undone. Please proceed with caution.
        </Alert>
        <div className="flex items-center justify-between py-3 border-t border-border-subtle">
          <div>
            <p className="text-sm font-medium text-fg">Delete account</p>
            <p className="text-xs text-fg-muted">Permanently delete your account and all data</p>
          </div>
          <Button variant="danger" size="sm" onPress={() => toast.error('Account deletion requires email confirmation')}>
            Delete account
          </Button>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-border-subtle">
          <div>
            <p className="text-sm font-medium text-fg">Export data</p>
            <p className="text-xs text-fg-muted">Download all your data as a ZIP archive</p>
          </div>
          <Button variant="secondary" size="sm" onPress={() => toast.info('Preparing export…')}>
            Export
          </Button>
        </div>
      </section>
    </div>
  )
}
