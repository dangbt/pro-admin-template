import { useState } from 'react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Statistic, Badge } from '@dangbt/pro-ui'
import { Eye, MousePointerClick, Clock, Percent } from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

const trafficData = [
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

export default function Analytics() {
  const [range, setRange] = useState<Range>('30d')

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
                range === r ? 'bg-primary text-white' : 'text-fg-muted hover:text-fg-2'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Page Views',  value: 84200, icon: <Eye className="w-4 h-4" />,              trend: { direction: 'up'   as const, value: '+18%'  } },
          { title: 'Clicks',      value: 12430, icon: <MousePointerClick className="w-4 h-4" />, trend: { direction: 'up'   as const, value: '+9.4%' } },
          { title: 'Avg. Time',   value: '3:47', icon: <Clock className="w-4 h-4" />,           trend: { direction: 'up'   as const, value: '+12s'  } },
          { title: 'Bounce Rate', value: '28%',  icon: <Percent className="w-4 h-4" />,         trend: { direction: 'down' as const, value: '-4.2%' } },
        ].map(kpi => (
          <div key={kpi.title} className="bg-surface border border-border rounded-xl p-4">
            <Statistic title={kpi.title} value={kpi.value} prefix={kpi.icon} trend={kpi.trend} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic area chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-fg text-sm mb-1">Traffic by source</h2>
          <p className="text-xs text-fg-muted mb-4">Weekly sessions by channel</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                {COLORS.map((c, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle, #e2e8f0)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {['organic', 'direct', 'referral', 'social'].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i]}
                  fill={`url(#grad${i})`} strokeWidth={2}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue pie */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-fg text-sm mb-1">Revenue by category</h2>
          <p className="text-xs text-fg-muted mb-4">Current period breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={3}>
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
          <div className="space-y-2 mt-2">
            {revenueByCategory.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-fg-2">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-fg-muted">{cat.pct}</span>
                  <span className="font-semibold text-fg">${cat.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top pages table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="font-semibold text-fg text-sm">Top pages</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {topPages.map(p => (
            <div key={p.page} className="px-5 py-3 flex items-center gap-4 text-sm">
              <code className="flex-1 text-fg font-mono text-xs">{p.page}</code>
              <span className="text-fg-2 w-20 text-right">{p.views.toLocaleString()} views</span>
              <Badge color={parseFloat(p.bounce) < 30 ? 'success' : 'warning'} size="sm">{p.bounce} bounce</Badge>
              <span className="text-fg-muted w-12 text-right">{p.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
