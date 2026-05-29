import { useState, useMemo } from 'react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Badge } from '@dangbt/pro-ui'
import { Eye, MousePointerClick, Clock, Percent, TrendingUp, TrendingDown } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
const MUTED = '#94a3b8'

/* ── Traffic data (8 weeks) ── */
const ALL_TRAFFIC = [
  { week: 'W1', organic: 1200, direct: 450, referral: 320, social: 180 },
  { week: 'W2', organic: 1580, direct: 520, referral: 290, social: 240 },
  { week: 'W3', organic: 1340, direct: 480, referral: 410, social: 310 },
  { week: 'W4', organic: 1890, direct: 610, referral: 380, social: 420 },
  { week: 'W5', organic: 2100, direct: 700, referral: 460, social: 380 },
  { week: 'W6', organic: 1750, direct: 590, referral: 520, social: 510 },
  { week: 'W7', organic: 2340, direct: 780, referral: 600, social: 620 },
  { week: 'W8', organic: 2680, direct: 850, referral: 680, social: 740 },
]

const revenueByCategory = [
  { name: 'Pro Template',  value: 4230, pct: '42%' },
  { name: 'Sponsorship',   value: 2100, pct: '21%' },
  { name: 'Consulting',    value: 1850, pct: '18%' },
  { name: 'Courses',       value: 1240, pct: '12%' },
  { name: 'Other',         value: 680,  pct: '7%'  },
]

const topPages = [
  { page: '/dashboard',  views: 8420, bounce: '24%', time: '4:32' },
  { page: '/analytics',  views: 5130, bounce: '31%', time: '3:18' },
  { page: '/users',      views: 4280, bounce: '28%', time: '5:14' },
  { page: '/settings',   views: 2190, bounce: '42%', time: '2:07' },
  { page: '/login',      views: 1840, bounce: '18%', time: '1:22' },
]

type Range = '7d' | '30d' | '90d'

const RANGE_WEEKS: Record<Range, number> = { '7d': 1, '30d': 4, '90d': 8 }

const RANGE_KPI: Record<Range, { views: number; clicks: number; time: string; bounce: string }> = {
  '7d':  { views: 18200, clicks: 2840,  time: '3:12', bounce: '31%' },
  '30d': { views: 84200, clicks: 12430, time: '3:47', bounce: '28%' },
  '90d': { views: 243000, clicks: 38100, time: '4:02', bounce: '26%' },
}

/* ── Donut center label ── */
function DonutCenter({ total }: { total: number }) {
  const animated = useCountUp(total)
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-lg font-bold text-fg tabular-nums">${animated.toLocaleString()}</span>
      <span className="text-[10px] text-fg-muted">Total</span>
    </div>
  )
}

/* ── Animated KPI card ── */
function KpiCard({ title, value, icon, trend, suffix = '' }: {
  title: string
  value: number | string
  icon: React.ReactNode
  trend: { direction: 'up' | 'down'; value: string }
  suffix?: string
}) {
  const isNumeric = typeof value === 'number'
  const animated = useCountUp(isNumeric ? value : 0)
  const display = isNumeric ? `${animated.toLocaleString()}${suffix}` : value
  const isUp = trend.direction === 'up'

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-fg-muted mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between gap-1">
        <span className="text-2xl font-bold text-fg tabular-nums leading-none">{display}</span>
        <div className={`flex items-center gap-0.5 text-xs font-semibold mb-0.5 ${isUp ? 'text-success' : 'text-danger'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.value}
        </div>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [range, setRange] = useState<Range>('30d')

  const trafficData = useMemo(() =>
    ALL_TRAFFIC.slice(-RANGE_WEEKS[range]),
    [range]
  )

  const kpi = RANGE_KPI[range]
  const totalRevenue = revenueByCategory.reduce((s, c) => s + c.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Analytics</h1>
          <p className="text-sm text-fg-muted mt-1">Traffic, revenue, and engagement metrics.</p>
        </div>
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-surface">
          {(['7d', '30d', '90d'] as Range[]).map(r => (
            <button key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === r ? 'bg-primary text-white shadow-sm' : 'text-fg-muted hover:text-fg-2'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Page Views"  value={kpi.views}  icon={<Eye className="w-4 h-4" />}              trend={{ direction: 'up', value: '+18%'  }} />
        <KpiCard title="Clicks"      value={kpi.clicks} icon={<MousePointerClick className="w-4 h-4" />} trend={{ direction: 'up', value: '+9.4%' }} />
        <KpiCard title="Avg. Time"   value={kpi.time}   icon={<Clock className="w-4 h-4" />}            trend={{ direction: 'up', value: '+12s'  }} />
        <KpiCard title="Bounce Rate" value={kpi.bounce} icon={<Percent className="w-4 h-4" />}          trend={{ direction: 'down', value: '-4.2%' }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic area chart (stacked gradient) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-fg text-sm mb-1">Traffic by source</h2>
          <p className="text-xs text-fg-muted mb-4">Weekly sessions by channel</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                {COLORS.map((c, i) => (
                  <linearGradient key={i} id={`aGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle, #e2e8f0)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {(['organic', 'direct', 'referral', 'social'] as const).map((key, i) => (
                <Area
                  key={key} type="monotone" dataKey={key}
                  stroke={COLORS[i]} fill={`url(#aGrad${i})`} strokeWidth={2}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  stackId="traffic"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue donut with center total */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-fg text-sm mb-1">Revenue by category</h2>
          <p className="text-xs text-fg-muted mb-2">Current period breakdown</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={80}
                  dataKey="value" paddingAngle={3}
                  strokeWidth={0}
                >
                  {revenueByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter total={totalRevenue} />
          </div>
          <div className="space-y-2 mt-1">
            {revenueByCategory.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-fg-2">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: cat.pct, background: COLORS[i] }}
                    />
                  </div>
                  <span className="font-semibold text-fg w-14 text-right">${cat.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="font-semibold text-fg text-sm">Top pages</h2>
          <span className="text-xs text-fg-muted">Ranked by views</span>
        </div>
        <div className="divide-y divide-border-subtle">
          {topPages.map((p, idx) => (
            <div key={p.page} className="px-5 py-3 flex items-center gap-4 text-sm group hover:bg-surface-subtle transition-colors">
              <span className="text-xs text-fg-disabled font-mono w-5 shrink-0">{idx + 1}</span>
              <code className="flex-1 text-fg font-mono text-xs">{p.page}</code>
              {/* Mini progress bar */}
              <div className="hidden sm:flex items-center gap-2 w-24">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.views / topPages[0].views * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-xs text-fg-2 w-12 text-right">{p.views.toLocaleString()}</span>
              </div>
              <Badge color={parseFloat(p.bounce) < 30 ? 'success' : 'warning'} size="sm">{p.bounce} bounce</Badge>
              <span className="text-fg-muted text-xs w-10 text-right shrink-0">{p.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
