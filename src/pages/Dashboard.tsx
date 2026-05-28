import { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart } from 'lucide-react'
import { Statistic, ProTable, Badge, Avatar } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

/* ── Mock data ── */
const revenueData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i))
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    revenue: Math.floor(3000 + Math.sin(i * 0.4) * 1500 + Math.random() * 800),
    target: 4000,
  }
})

const usersByMonth = [
  { month: 'Aug', new: 210, churned: 45 },
  { month: 'Sep', new: 340, churned: 60 },
  { month: 'Oct', new: 280, churned: 38 },
  { month: 'Nov', new: 420, churned: 72 },
  { month: 'Dec', new: 390, churned: 55 },
  { month: 'Jan', new: 510, churned: 48 },
]

interface Order { id: string; customer: string; email: string; amount: number; status: string; date: string }

const orders: Order[] = [
  { id: 'ORD-001', customer: 'Alice Nguyen',  email: 'alice@example.com',  amount: 199, status: 'paid',    date: '2026-05-28' },
  { id: 'ORD-002', customer: 'Bob Tran',      email: 'bob@example.com',    amount: 79,  status: 'paid',    date: '2026-05-27' },
  { id: 'ORD-003', customer: 'Carol Le',      email: 'carol@example.com',  amount: 149, status: 'pending', date: '2026-05-27' },
  { id: 'ORD-004', customer: 'David Pham',    email: 'david@example.com',  amount: 79,  status: 'paid',    date: '2026-05-26' },
  { id: 'ORD-005', customer: 'Emma Hoang',    email: 'emma@example.com',   amount: 299, status: 'refunded',date: '2026-05-25' },
]

const orderColumns: ProColumnType<Order>[] = [
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.customer} size="sm" />
        <div>
          <div className="text-sm font-medium text-fg">{row.customer}</div>
          <div className="text-xs text-fg-muted">{row.email}</div>
        </div>
      </div>
    ),
  },
  { title: 'Order ID', dataIndex: 'id', key: 'id', valueType: 'text' },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (v) => <span className="font-semibold text-fg">${v as number}</span>,
    align: 'right',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (v) => (
      <Badge color={(v as string) === 'paid' ? 'success' : (v as string) === 'pending' ? 'warning' : 'danger'} size="sm">
        {v as string}
      </Badge>
    ),
  },
  { title: 'Date', dataIndex: 'date', key: 'date', valueType: 'text' },
]

/* ── Chart colors (CSS vars resolved) ── */
const PRIMARY = '#6366f1'
const SUCCESS = '#10b981'
const DANGER  = '#ef4444'
const MUTED   = '#94a3b8'

export default function Dashboard() {
  const totalRevenue = useMemo(() => revenueData.reduce((s, d) => s + d.revenue, 0), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
        <p className="text-sm text-fg-muted mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <Statistic
            title="Monthly Revenue"
            value={totalRevenue}
            formatter={v => `$${Number(v).toLocaleString()}`}
            prefix={<DollarSign className="w-4 h-4" />}
            trend={{ direction: 'up', value: '+12.5%' }}
          />
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <Statistic
            title="Total Users"
            value={12430}
            formatter={v => Number(v).toLocaleString()}
            prefix={<Users className="w-4 h-4" />}
            trend={{ direction: 'up', value: '+8.2%' }}
          />
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <Statistic
            title="Active Sessions"
            value={842}
            prefix={<Activity className="w-4 h-4" />}
            trend={{ direction: 'down', value: '-3.1%' }}
          />
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <Statistic
            title="New Orders"
            value={156}
            prefix={<ShoppingCart className="w-4 h-4" />}
            trend={{ direction: 'up', value: '+24.7%' }}
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-fg text-sm">Revenue (30 days)</h2>
              <p className="text-xs text-fg-muted">vs target $4,000/day</p>
            </div>
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle, #e2e8f0)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
              />
              <Line type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="target"  stroke={MUTED}   strokeWidth={1} dot={false} name="Target" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User growth */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-fg text-sm">User growth</h2>
            <p className="text-xs text-fg-muted">New vs churned (6 months)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={usersByMonth} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle, #e2e8f0)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="new"     fill={SUCCESS} name="New"     radius={[4, 4, 0, 0]} />
              <Bar dataKey="churned" fill={DANGER}  name="Churned" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="font-semibold text-fg text-sm">Recent Orders</h2>
          <span className="text-xs text-fg-muted">Last 7 days</span>
        </div>
        <ProTable<Order>
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          search={false}
          size="sm"
        />
      </div>
    </div>
  )
}
