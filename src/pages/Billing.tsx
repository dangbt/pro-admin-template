import { CreditCard, Download, Zap, CheckCircle2, AlertCircle } from 'lucide-react'
import { ProTable, Button, Badge, Alert, toast } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface Invoice {
  id: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

const INVOICES: Invoice[] = [
  { id: 'INV-2026-05', date: '2026-05-01', description: 'Pro Plan — May 2026',   amount: 39, status: 'paid'    },
  { id: 'INV-2026-04', date: '2026-04-01', description: 'Pro Plan — Apr 2026',   amount: 39, status: 'paid'    },
  { id: 'INV-2026-03', date: '2026-03-01', description: 'Pro Plan — Mar 2026',   amount: 39, status: 'paid'    },
  { id: 'INV-2026-02', date: '2026-02-01', description: 'Pro Plan — Feb 2026',   amount: 39, status: 'paid'    },
  { id: 'INV-2026-01', date: '2026-01-01', description: 'Pro Plan — Jan 2026',   amount: 39, status: 'paid'    },
  { id: 'INV-2025-12', date: '2025-12-01', description: 'Pro Plan — Dec 2025',   amount: 39, status: 'failed'  },
  { id: 'INV-2025-11', date: '2025-11-01', description: 'Pro Plan — Nov 2025',   amount: 39, status: 'paid'    },
]

const invoiceColumns: ProColumnType<Invoice>[] = [
  { title: 'Invoice',     dataIndex: 'id',          key: 'id',          render: v => <span className="font-mono text-sm text-fg">{v as string}</span> },
  { title: 'Description', dataIndex: 'description', key: 'description', render: v => <span className="text-sm text-fg-2">{v as string}</span> },
  { title: 'Date',        dataIndex: 'date',        key: 'date',        valueType: 'date', sortable: true },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    sortable: true,
    render: v => <span className="text-sm font-semibold text-fg">${v as number}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    valueType: 'select',
    valueEnum: { paid: 'Paid', pending: 'Pending', failed: 'Failed' },
    render: v => (
      <Badge size="sm" color={(v as string) === 'paid' ? 'success' : (v as string) === 'pending' ? 'warning' : 'danger'}>
        {(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}
      </Badge>
    ),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'download',
    hideInSearch: true,
    disableHiding: true,
    align: 'right',
    render: (_, row) => (
      <Button
        size="sm" variant="ghost"
        onPress={() => toast.info(`Downloading ${row.id}…`)}
        isDisabled={row.status === 'failed'}
      >
        <Download className="w-3.5 h-3.5" />
        PDF
      </Button>
    ),
  },
]

const PLAN_FEATURES = [
  'Unlimited projects',
  'Priority support',
  'Advanced analytics',
  'Custom domain',
  'Team collaboration',
  'API access',
]

export default function Billing() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-fg">Billing</h1>
        <p className="text-sm text-fg-muted mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Failed payment alert */}
      <Alert variant="danger" title="Payment failed — December 2025">
        Your payment of $39 on Dec 1, 2025 failed.{' '}
        <button className="underline font-medium" onClick={() => toast.info('Update payment method')}>
          Update your payment method
        </button>{' '}
        to avoid service interruption.
      </Alert>

      {/* Current plan */}
      <section className="rounded-xl overflow-hidden border border-primary-200">
        <div className="bg-primary px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Pro Plan — Active</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white">$39</span>
              <span className="text-sm text-white/70">/mo</span>
            </div>
            <p className="text-xs text-white/60 mt-1">Next billing: June 1, 2026 · Auto-renews monthly</p>
          </div>
          <Button variant="secondary" size="sm" onPress={() => toast.info('Manage plan')}>
            Manage plan
          </Button>
        </div>
        <div className="bg-surface px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PLAN_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span className="text-sm text-fg-2">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment method */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-fg">Payment method</h2>
          <Button size="sm" variant="secondary" onPress={() => toast.info('Update card')}>
            Update
          </Button>
        </div>
        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-canvas">
          <div className="w-10 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-fg">Visa ending in 4242</p>
            <p className="text-xs text-fg-muted">Expires 08/2028</p>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs text-warning font-medium">Verify required</span>
          </div>
        </div>
      </section>

      {/* Invoice history */}
      <section className="space-y-3">
        <h2 className="font-semibold text-fg">Invoice history</h2>
        <ProTable<Invoice>
          columns={invoiceColumns}
          dataSource={INVOICES}
          rowKey="id"
          pagination={{ defaultPageSize: 5 }}
        />
      </section>

      {/* Cancel subscription */}
      <section className="bg-surface border border-border-subtle rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-fg">Cancel subscription</p>
            <p className="text-xs text-fg-muted mt-0.5">You'll keep Pro access until end of billing period</p>
          </div>
          <Button variant="secondary" size="sm" onPress={() => toast.error('Cancellation requires confirmation')}>
            Cancel plan
          </Button>
        </div>
      </section>
    </div>
  )
}
