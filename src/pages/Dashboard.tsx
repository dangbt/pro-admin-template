import { useMemo, useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart,
  UserPlus, CreditCard, Star,
} from 'lucide-react'
import { Badge, Avatar, ProTable } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'
import { useCountUp } from '../hooks/useCountUp'

/* ── Chart palette ── */
const PRIMARY = '#6366f1'
const SUCCESS = '#10b981'
const DANGER  = '#ef4444'
const MUTED   = '#94a3b8'
const WARNING = '#f59e0b'
const INFO    = '#06b6d4'

/* ────────────────────────────────────────────
   Sparkline — tiny 64×32 AreaChart, no axes
──────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }))
  const gradId = `sg-${color.replace('#', '')}`
  return (
    <AreaChart width={64} height={32} data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        fill={`url(#${gradId})`}
        dot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}

/* ────────────────────────────────────────────
   KPI Card
──────────────────────────────────────────── */
interface KpiProps {
  title: string
  value: number
  formatter?: (v: number) => string
  trend: { direction: 'up' | 'down'; value: string }
  icon: React.ReactNode
  sparkData: number[]
  color: string
}

function KpiCard({ title, value, formatter, trend, icon, sparkData, color }: KpiProps) {
  const animated = useCountUp(value)
  const display = formatter ? formatter(animated) : animated.toLocaleString()
  const isUp = trend.direction === 'up'

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-fg-muted">
          <span className="text-primary">{icon}</span>
          <span className="text-xs font-medium">{title}</span>
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-fg tabular-nums leading-none">{display}</span>
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-success' : 'text-danger'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.value}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Mock spark data
──────────────────────────────────────────── */
function wave(base: number, amp: number, len = 14): number[] {
  return Array.from({ length: len }, (_, i) =>
    Math.round(base + amp * Math.sin(i * 0.7 + Math.random() * 0.3))
  )
}

/* ────────────────────────────────────────────
   Live revenue data (30 points, ticks every 3s)
──────────────────────────────────────────── */
function makeRevenuePoint(i: number) {
  const d = new Date(); d.setDate(d.getDate() - i)
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    revenue: Math.floor(3000 + Math.sin(i * 0.4) * 1500 + Math.random() * 800),
    target: 4000,
  }
}

/* ────────────────────────────────────────────
   Activity feed
──────────────────────────────────────────── */
type ActivityType = 'order' | 'user' | 'payment' | 'review'

interface FeedItem {
  id: number
  type: ActivityType
  title: string
  sub: string
  time: number // ms since epoch
}

const ACTIVITY_TEMPLATES: { type: ActivityType; titles: string[]; subs: string[] }[] = [
  { type: 'order',   titles: ['New order placed', 'Order fulfilled', 'Order shipped'],           subs: ['Alice Nguyen · $199', 'Bob Tran · $79', 'Emma Hoang · $299', 'Carol Le · $149'] },
  { type: 'user',    titles: ['New user signed up', 'User upgraded to Pro'],                     subs: ['david@example.com', 'sara@example.com', 'mike@example.com'] },
  { type: 'payment', titles: ['Payment successful', 'Payment failed — retry required'],          subs: ['Pro Plan · $39/mo', 'Team Plan · $99/mo'] },
  { type: 'review',  titles: ['New 5★ review received', 'New feedback submitted'],               subs: ['"Absolutely love this product!"', '"Great onboarding experience"'] },
]

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  order:   <ShoppingCart className="w-3.5 h-3.5" />,
  user:    <UserPlus className="w-3.5 h-3.5" />,
  payment: <CreditCard className="w-3.5 h-3.5" />,
  review:  <Star className="w-3.5 h-3.5" />,
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  order:   'bg-primary/10 text-primary',
  user:    'bg-success/10 text-success',
  payment: 'bg-warning/10 text-warning',
  review:  'bg-info/10 text-info',
}

let feedCounter = 100

function makeFeedItem(): FeedItem {
  const tpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)]
  return {
    id: feedCounter++,
    type: tpl.type,
    title: tpl.titles[Math.floor(Math.random() * tpl.titles.length)],
    sub: tpl.subs[Math.floor(Math.random() * tpl.subs.length)],
    time: Date.now(),
  }
}

function timeAgo(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 5)  return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

/* ────────────────────────────────────────────
   Orders table
──────────────────────────────────────────── */
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

/* ────────────────────────────────────────────
   Custom tooltip
──────────────────────────────────────────── */
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-raised border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-fg-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-fg font-semibold">
          {p.name === 'revenue' ? `Revenue: $${p.value.toLocaleString()}` : `Target: $${p.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   Dashboard
──────────────────────────────────────────── */
export default function Dashboard() {
  // Live revenue chart
  const [revenueData, setRevenueData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => makeRevenuePoint(29 - i))
  )

  // Activity feed
  const [feed, setFeed] = useState<FeedItem[]>(() =>
    Array.from({ length: 5 }, () => {
      const item = makeFeedItem()
      item.time -= Math.floor(Math.random() * 60_000)
      return item
    }).reverse()
  )

  // Relative time re-render
  const [, setTick] = useState(0)

  useEffect(() => {
    // Revenue: new point every 3s
    const revTimer = setInterval(() => {
      setRevenueData(prev => {
        const next = [...prev.slice(1), {
          date: (() => { const d = new Date(); return `${d.getMonth() + 1}/${d.getDate()}` })(),
          revenue: Math.floor(3000 + Math.random() * 2500),
          target: 4000,
        }]
        return next
      })
    }, 3000)

    // Activity: new event every 5s
    const actTimer = setInterval(() => {
      setFeed(prev => [makeFeedItem(), ...prev].slice(0, 8))
    }, 5000)

    // Time display: refresh every 10s
    const tickTimer = setInterval(() => setTick(t => t + 1), 10_000)

    return () => {
      clearInterval(revTimer)
      clearInterval(actTimer)
      clearInterval(tickTimer)
    }
  }, [])

  const totalRevenue = useMemo(() => revenueData.reduce((s, d) => s + d.revenue, 0), [revenueData])

  const sparkRevenue = useMemo(() => revenueData.slice(-14).map(d => d.revenue), [revenueData])

  const usersByMonth = [
    { month: 'Aug', new: 210, churned: 45 },
    { month: 'Sep', new: 340, churned: 60 },
    { month: 'Oct', new: 280, churned: 38 },
    { month: 'Nov', new: 420, churned: 72 },
    { month: 'Dec', new: 390, churned: 55 },
    { month: 'Jan', new: 510, churned: 48 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
          <p className="text-sm text-fg-muted mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-success font-medium px-2.5 py-1 rounded-full bg-success/10">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Monthly Revenue"
          value={totalRevenue}
          formatter={v => `$${v.toLocaleString()}`}
          trend={{ direction: 'up', value: '+12.5%' }}
          icon={<DollarSign className="w-4 h-4" />}
          sparkData={sparkRevenue}
          color={PRIMARY}
        />
        <KpiCard
          title="Total Users"
          value={12430}
          trend={{ direction: 'up', value: '+8.2%' }}
          icon={<Users className="w-4 h-4" />}
          sparkData={wave(12000, 600)}
          color={SUCCESS}
        />
        <KpiCard
          title="Active Sessions"
          value={842}
          trend={{ direction: 'down', value: '-3.1%' }}
          icon={<Activity className="w-4 h-4" />}
          sparkData={wave(850, 120)}
          color={WARNING}
        />
        <KpiCard
          title="New Orders"
          value={156}
          trend={{ direction: 'up', value: '+24.7%' }}
          icon={<ShoppingCart className="w-4 h-4" />}
          sparkData={wave(140, 30)}
          color={INFO}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue area chart (live) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-fg text-sm">Revenue</h2>
              <p className="text-xs text-fg-muted">Live · vs $4,000/day target</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-fg-muted">
                <span className="w-2 h-0.5 bg-primary inline-block rounded-full" /> Revenue
              </div>
              <div className="flex items-center gap-1.5 text-xs text-fg-muted">
                <span className="w-2 h-0.5 bg-border inline-block rounded-full border-dashed" /> Target
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +12.5%
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle,#e2e8f0)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2}
                fill="url(#revGrad)" dot={false} name="revenue"
                isAnimationActive={false}
              />
              <Area
                type="monotone" dataKey="target" stroke={MUTED} strokeWidth={1}
                fill="transparent" dot={false} name="target"
                strokeDasharray="4 4" isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-fg text-sm">Live Activity</h2>
            <div className="flex items-center gap-1 text-xs text-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            {feed.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 py-1.5 transition-all duration-300"
                style={{ opacity: 1 - idx * 0.08 }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ACTIVITY_COLORS[item.type]}`}>
                  {ACTIVITY_ICONS[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg leading-tight truncate">{item.title}</p>
                  <p className="text-[11px] text-fg-muted truncate">{item.sub}</p>
                </div>
                <span className="text-[10px] text-fg-disabled shrink-0 mt-0.5">{timeAgo(item.time)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User growth bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-fg text-sm">User growth</h2>
            <p className="text-xs text-fg-muted">New vs churned (6 months)</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={usersByMonth} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle,#e2e8f0)" vertical={false} />
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

        {/* Quick stats */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-fg text-sm mb-4">Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Avg response time', value: '142ms', sub: '-18ms vs last week', color: 'text-success' },
              { label: 'Uptime', value: '99.98%', sub: 'Last 90 days', color: 'text-success' },
              { label: 'Error rate', value: '0.04%', sub: '+0.01% vs last week', color: 'text-warning' },
              { label: 'Satisfaction score', value: '4.8/5', sub: 'From 1,230 ratings', color: 'text-primary' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-lg bg-canvas">
                <p className="text-xs text-fg-muted mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-fg tabular-nums">{stat.value}</p>
                <p className={`text-xs mt-0.5 ${stat.color}`}>{stat.sub}</p>
              </div>
            ))}
          </div>
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
