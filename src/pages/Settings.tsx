import { z } from 'zod'
import {
  ProForm, ProFormRow, ProFormInput, ProFormTextarea, ProFormSelect,
  ProFormSwitch, Button, Alert, toast, Avatar,
} from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'

const profileSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  bio:      z.string().max(200).optional(),
  timezone: z.string(),
  language: z.string(),
})

const notifSchema = z.object({
  emailDigest:      z.boolean(),
  productUpdates:   z.boolean(),
  securityAlerts:   z.boolean(),
  marketingEmails:  z.boolean(),
  weeklyReport:     z.boolean(),
})

export default function Settings() {
  const { user } = useAuth()

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
      <section className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-fg">Notifications</h2>
        <ProForm
          schema={notifSchema}
          defaultValues={{
            emailDigest:     true,
            productUpdates:  true,
            securityAlerts:  true,
            marketingEmails: false,
            weeklyReport:    true,
          }}
          onFinish={async () => {
            await new Promise(r => setTimeout(r, 400))
            toast.success('Notification preferences saved')
          }}
          submitText="Save preferences"
        >
          <ProFormSwitch name="emailDigest"     label="Email digest"      description="Receive a daily summary of activity" />
          <ProFormSwitch name="productUpdates"  label="Product updates"   description="New features and improvements" />
          <ProFormSwitch name="securityAlerts"  label="Security alerts"   description="Login attempts and suspicious activity" />
          <ProFormSwitch name="marketingEmails" label="Marketing emails"  description="Promotions, tips, and surveys" />
          <ProFormSwitch name="weeklyReport"    label="Weekly report"     description="Performance summary every Monday" />
        </ProForm>
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
