import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import {
  LayoutDashboard, Command, Palette, BarChart2, PanelLeft, Bell,
  DollarSign, Users, Activity, ShoppingCart, CheckCircle2, Zap,
  TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react'
import { Badge, Avatar, AvatarGroup, Statistic } from '@dangbt/pro-ui'
import { useAuth } from '../contexts/AuthContext'
import { useCountUp } from '../hooks/useCountUp'
import logoIconUrl from '../assets/logo-icon.svg'

/* ────────────────────────────────────────────
   Constants
──────────────────────────────────────────── */
const LEMON_URL  = 'https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967'
const GITHUB_URL = 'https://github.com/dangbt/pro-admin-template'

const HERO_CHART_DATA = Array.from({ length: 14 }, (_, i) => ({
  i,
  v: Math.round(3200 + Math.sin(i * 0.7) * 900 + (i % 3 === 0 ? 400 : -100)),
}))

const HERO_KPIS = [
  { title: 'Monthly Revenue', value: 124820, formatter: (v: number) => `$${v.toLocaleString()}`, trend: { direction: 'up' as const, value: '+12.5%' }, color: '#6366f1', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { title: 'Total Users',     value: 12430,  formatter: (v: number) => v.toLocaleString(),       trend: { direction: 'up' as const, value: '+8.2%'  }, color: '#10b981', icon: <Users      className="w-3.5 h-3.5" /> },
  { title: 'Active Sessions', value: 842,    formatter: (v: number) => v.toLocaleString(),       trend: { direction: 'down' as const, value: '-3.1%' }, color: '#f59e0b', icon: <Activity   className="w-3.5 h-3.5" /> },
  { title: 'New Orders',      value: 156,    formatter: (v: number) => v.toLocaleString(),       trend: { direction: 'up' as const, value: '+24.7%' }, color: '#06b6d4', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
]

const FEATURES = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: 'Animated Dashboard',
    desc: 'KPI counters count up on mount, sparklines per card, a live revenue chart that ticks every 3s, and a real-time activity feed.',
  },
  {
    icon: <Command className="w-5 h-5" />,
    title: 'Command Palette ⌘K',
    desc: 'Navigate to any page or run actions in milliseconds. Fuzzy search, arrow-key navigation, keyboard shortcut hints.',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Theme Customizer',
    desc: '9 accent colors, 5 border-radius presets, 3 font families, 3 density modes — all persisted to localStorage. Try the FAB →',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Rich Analytics',
    desc: 'Stacked gradient area charts, animated donut with center total, date-range filter (7d/30d/90d), top-pages table.',
  },
  {
    icon: <PanelLeft className="w-5 h-5" />,
    title: 'Dual Layout Mode',
    desc: 'Switch between top navigation and a collapsible sidebar at runtime. Layout preference is persisted between sessions.',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: 'Notifications Drawer',
    desc: 'Slide-in bell panel with typed notifications, unread badge counter, per-item dismiss, and mark-all-read action.',
  },
]

const SHOWCASE_AVATARS = [
  { name: 'Alice Nguyen' },
  { name: 'Bob Tran' },
  { name: 'Carol Le' },
  { name: 'David Pham' },
  { name: 'Emma Hoang' },
]

const FREE_FEATURES  = ['Core dashboard pages', 'Light + dark mode', 'ThemeIsland customizer', 'Tailwind CSS v4', 'React 18 + TypeScript', 'MIT License']
const PRO_FEATURES   = ['Everything in Starter', 'Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom domain', 'Team collaboration', 'API access']

/* ────────────────────────────────────────────
   useInView — fade in once on scroll
──────────────────────────────────────────── */
function useInView(ref: React.RefObject<Element | null>, threshold = 0.12): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])

  return inView
}

/* ────────────────────────────────────────────
   LandingNav
──────────────────────────────────────────── */
function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <nav className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoIconUrl} alt="Pro Admin" className="w-7 h-7" />
          <span className="font-semibold text-fg text-sm">Pro Admin</span>
        </Link>

        {/* Anchor nav (desktop) */}
        <div className="hidden sm:flex items-center gap-5 flex-1">
          <a href="#features" className="text-sm text-fg-muted hover:text-fg transition-colors">Features</a>
          <a href="#pricing"  className="text-sm text-fg-muted hover:text-fg transition-colors">Pricing</a>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[var(--base-radius)] bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-[var(--base-radius)] border border-border text-fg-muted text-xs font-semibold hover:bg-surface-subtle transition-colors"
              >
                Try Demo
              </Link>
              <a
                href={LEMON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-[var(--base-radius)] bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Get Pro — $39
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ────────────────────────────────────────────
   Hero KPI card
──────────────────────────────────────────── */
function HeroKpiCard({ kpi, inView }: { kpi: typeof HERO_KPIS[number]; inView: boolean }) {
  const animated = useCountUp(inView ? kpi.value : 0, 1200)
  const display = kpi.formatter(animated)
  const isUp = kpi.trend.direction === 'up'

  return (
    <div className="bg-surface border border-border rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-fg-muted mb-2">
        <span style={{ color: kpi.color }}>{kpi.icon}</span>
        <span className="text-[11px] font-medium truncate">{kpi.title}</span>
      </div>
      <div className="flex items-end justify-between gap-1">
        <span className="text-lg font-bold text-fg tabular-nums leading-none">{display}</span>
        <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${isUp ? 'text-success' : 'text-danger'}`}>
          {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {kpi.trend.value}
        </span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   HeroSection
──────────────────────────────────────────── */
function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const mockupRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mockupRef)

  return (
    <section className="px-4 sm:px-6 pt-20 pb-16 flex flex-col items-center text-center bg-canvas">
      <div className="max-w-3xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          Built with @dangbt/pro-ui · React 18 · Tailwind CSS v4
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold text-fg leading-tight mb-4">
          The React Admin Template<br />
          That <span className="text-primary">Ships Fast.</span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed mb-8">
          Production-ready dashboard, analytics, user management, and billing —
          wired up with pro-ui, Recharts, and Tailwind CSS v4.
          Clone once, ship forever.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-[var(--base-radius)] bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              Open Dashboard
            </Link>
          ) : (
            <>
              <a
                href={LEMON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-[var(--base-radius)] bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Zap className="w-4 h-4" />
                Get Pro — $39
              </a>
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3 rounded-[var(--base-radius)] border border-border text-fg-muted font-semibold text-sm hover:bg-surface-subtle transition-colors"
              >
                Try Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Browser chrome mockup */}
      <div
        ref={mockupRef}
        className="mt-14 w-full max-w-4xl mx-auto bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 32px 80px -12px rgba(0,0,0,0.18)' }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-subtle shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-danger" />
          <span className="w-2.5 h-2.5 rounded-full bg-warning" />
          <span className="w-2.5 h-2.5 rounded-full bg-success" />
          <div className="flex-1 mx-4 bg-canvas border border-border rounded-md h-5 flex items-center px-2.5 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            <span className="text-[10px] text-fg-disabled font-mono">pro-admin.pages.dev/dashboard</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 sm:p-5 bg-canvas">
          {/* Fake nav bar */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
            <img src={logoIconUrl} alt="" className="w-5 h-5 opacity-70" />
            <div className="flex items-center gap-3">
              {['Dashboard', 'Analytics', 'Users', 'Billing'].map(label => (
                <div key={label} className={`text-[10px] font-medium px-2 py-1 rounded ${label === 'Dashboard' ? 'bg-primary/10 text-primary' : 'text-fg-muted'}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {HERO_KPIS.map(kpi => (
              <HeroKpiCard key={kpi.title} kpi={kpi} inView={inView} />
            ))}
          </div>

          {/* Chart */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-fg">Revenue (30 days)</p>
                <p className="text-[10px] text-fg-muted">vs $4,000/day target</p>
              </div>
              <span className="text-[10px] text-success font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={HERO_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary,#6366f1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary,#6366f1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-primary,#6366f1)"
                  strokeWidth={2}
                  fill="url(#heroGrad)"
                  dot={false}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   FeaturesSection
──────────────────────────────────────────── */
function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)

  return (
    <section
      id="features"
      ref={ref}
      className={`px-4 sm:px-6 py-20 bg-canvas transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-fg-disabled mb-3">What's included</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">
            Everything you need to ship
          </h2>
          <p className="text-fg-muted mt-3 max-w-xl mx-auto">
            A fully wired admin template with real components, real interactions, and real data patterns — not just a mockup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-fg mb-1.5">{f.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   ComponentShowcaseStrip
──────────────────────────────────────────── */
function ComponentShowcaseStrip() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)

  return (
    <section
      ref={ref}
      className={`bg-surface-subtle border-y border-border py-14 px-4 sm:px-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-xs font-semibold uppercase tracking-widest text-fg-disabled mb-6 text-center">
          Design System Components
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left — Badges + Avatars */}
          <div className="space-y-5">
            <div>
              <p className="text-xs text-fg-disabled uppercase tracking-widest mb-3">Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge color="primary">primary</Badge>
                <Badge color="success">success</Badge>
                <Badge color="warning">warning</Badge>
                <Badge color="danger">danger</Badge>
                <Badge color="info">info</Badge>
                <Badge>default</Badge>
                <Badge color="primary" size="lg">large</Badge>
                <Badge color="success" size="sm">small</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-fg-disabled uppercase tracking-widest mb-3">Avatar Group</p>
              <div className="flex items-center gap-3">
                <AvatarGroup avatars={SHOWCASE_AVATARS} max={4} />
                <span className="text-xs text-fg-muted">+ 40 more components</span>
              </div>
            </div>
          </div>

          {/* Right — Statistic */}
          <div className="flex gap-8 flex-wrap">
            <Statistic
              title="Monthly Revenue"
              value={124820}
              formatter={v => `$${Number(v).toLocaleString()}`}
              prefix={<DollarSign className="w-4 h-4" />}
              trend={{ value: '+12.5%', direction: 'up' }}
            />
            <Statistic
              title="Total Users"
              value={12430}
              formatter={v => Number(v).toLocaleString()}
              prefix={<Users className="w-4 h-4" />}
              trend={{ value: '+8.2%', direction: 'up' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   PricingSection
──────────────────────────────────────────── */
interface PricingCardProps {
  name: string
  price: string
  priceLabel: string
  description: string
  features: string[]
  cta: { label: string; href: string; external?: boolean; primary: boolean }
  featured?: boolean
}

function PricingCard({ name, price, priceLabel, description, features, cta, featured }: PricingCardProps) {
  return (
    <div
      className={[
        'rounded-2xl overflow-hidden flex flex-col',
        featured
          ? 'border-2 border-primary shadow-2xl shadow-primary/10'
          : 'border border-border',
      ].join(' ')}
    >
      {featured && (
        <div className="bg-primary px-6 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-semibold">Most Popular</span>
          <Zap className="w-3.5 h-3.5 text-white/80" />
        </div>
      )}
      <div className="bg-surface p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-bold text-fg text-lg">{name}</h3>
          <p className="text-sm text-fg-muted mt-0.5">{description}</p>
        </div>
        <div className="flex items-baseline gap-1.5 mb-6">
          <span className="text-4xl font-bold text-fg">{price}</span>
          <span className="text-sm text-fg-muted">{priceLabel}</span>
        </div>
        <div className="space-y-2.5 flex-1 mb-6">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-fg-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              {f}
            </div>
          ))}
        </div>
        {cta.external ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'flex items-center justify-center gap-2 w-full py-2.5 rounded-[var(--base-radius)] font-semibold text-sm transition-colors',
              cta.primary
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                : 'border border-border text-fg-muted hover:bg-surface-subtle',
            ].join(' ')}
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <Link
            to={cta.href}
            className={[
              'flex items-center justify-center gap-2 w-full py-2.5 rounded-[var(--base-radius)] font-semibold text-sm transition-colors',
              cta.primary
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                : 'border border-border text-fg-muted hover:bg-surface-subtle',
            ].join(' ')}
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

function PricingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)

  return (
    <section
      id="pricing"
      ref={ref}
      className={`px-4 sm:px-6 py-20 bg-canvas transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-fg-disabled mb-3">Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">Simple, honest pricing</h2>
          <p className="text-fg-muted mt-3">Get the template, own it forever. No subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingCard
            name="Starter"
            price="Free"
            priceLabel="open source"
            description="Everything you need to get started."
            features={FREE_FEATURES}
            cta={{ label: 'Clone on GitHub', href: GITHUB_URL, external: true, primary: false }}
          />
          <PricingCard
            name="Pro"
            price="$39"
            priceLabel="one-time"
            description="The full template, no strings attached."
            features={PRO_FEATURES}
            cta={{ label: 'Get Pro — $39', href: LEMON_URL, external: true, primary: true }}
            featured
          />
        </div>

        <p className="text-center text-xs text-fg-disabled mt-6">
          One-time payment · Lifetime updates · Cancel-anytime satisfaction guarantee
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────
   LandingFooter
──────────────────────────────────────────── */
const FOOTER_LINKS = [
  { label: 'pro-ui ↗',    href: 'https://pro-ui.pages.dev' },
  { label: 'Docs ↗',      href: 'https://pro-ui-docs.pages.dev' },
  { label: 'GitHub ↗',    href: 'https://github.com/dangbt/pro-ui' },
  { label: 'npm ↗',       href: 'https://www.npmjs.com/package/@dangbt/pro-ui' },
  { label: 'Sponsor ☕',  href: 'https://github.com/sponsors/dangbt' },
]

function LandingFooter() {
  return (
    <footer className="bg-surface border-t border-border py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <img src={logoIconUrl} alt="Pro Admin" className="w-6 h-6" />
            <span className="font-semibold text-fg text-sm">Pro Admin</span>
          </div>
          <p className="text-xs text-fg-muted">The production-ready React admin template.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-fg-disabled hover:text-fg-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-6 pt-5 border-t border-border-subtle text-center">
        <p className="text-xs text-fg-disabled">© 2026 Pro Admin Template · MIT License · Built with @dangbt/pro-ui</p>
      </div>
    </footer>
  )
}

/* ────────────────────────────────────────────
   Landing (root export)
──────────────────────────────────────────── */
export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-canvas">
      <LandingNav isAuthenticated={isAuthenticated} />
      <main>
        <HeroSection isAuthenticated={isAuthenticated} />
        <FeaturesSection />
        <ComponentShowcaseStrip />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
