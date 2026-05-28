# Pro Admin Template

> A production-ready admin dashboard built with [pro-ui](https://pro-ui.pages.dev) — React Aria + Tailwind CSS v4.

**[Live Demo →](https://pro-admin-demo.pages.dev)**

---

## What's included

| Page | Description |
|------|-------------|
| **Dashboard** | KPI stats, revenue line chart, user growth bar chart, recent orders table |
| **Analytics** | Detailed metrics, session tracking, device breakdown, funnel visualization |
| **Users** | Searchable & filterable user table with bulk actions, role/status badges |
| **Billing** | Subscription plan, invoice history, payment method management |
| **Settings** | Profile form, notification preferences, upgrade prompt, danger zone |
| **Login / Register / Forgot password** | Full auth flow with validation |

### Layout variants (switchable at runtime)
- **Top navigation** — horizontal nav bar with dropdown menus
- **Sidebar** — collapsible sidebar (220px ↔ 56px icon-only mode)

### Features
- 🌙 **Dark / Light mode** — CSS variables, no flash
- 🎨 **Theme Island** — floating customizer for primary color + border radius
- ♿ **Accessible** — powered by React Aria Components
- 📱 **Responsive** — works on mobile, tablet, desktop
- 🔒 **Auth context** — `useAuth()` hook, protected & public routes
- 🧩 **TypeScript** — fully typed throughout
- ⚡ **Vite** — instant HMR, fast production builds

---

## Tech stack

| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 5.x |
| Vite | 6.x |
| Tailwind CSS | v4 |
| pro-ui | latest |
| react-router-dom | v7 |
| recharts | v2 |
| lucide-react | latest |

---

## Quick start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure GitHub Packages (for `@dangbt/pro-ui`)

Create or edit `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@dangbt:registry=https://npm.pkg.github.com
```

Or if you prefer npm registry (public):
```bash
npm install @dangbt/pro-ui
```

### 3. Start dev server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:** any email + any password (auth is mocked)

### 4. Build for production

```bash
pnpm build
```

---

## Project structure

```
src/
├── assets/          # Logo SVG
├── components/
│   ├── AppLayout.tsx         # Top-nav layout
│   ├── AppLayoutSider.tsx    # Sidebar layout  
│   └── ThemeIsland.tsx       # Floating theme customizer
├── contexts/
│   └── AuthContext.tsx       # Auth state + hooks
├── hooks/
│   └── useLayoutMode.ts      # Persists layout preference
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   ├── Users.tsx
│   ├── Billing.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── App.tsx           # Routes
└── main.tsx
```

---

## Customization

### Change primary color
Edit `src/main.tsx` or use the ThemeIsland (floating button, bottom-right):
```css
/* in your CSS */
:root { --primary: #your-color; }
```

### Add a new page
1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav item in `AppLayout.tsx` and `AppLayoutSider.tsx`

### Replace mock auth
Swap `src/contexts/AuthContext.tsx` — the interface is:
```ts
interface AuthContext {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
```

---

## License

One-time purchase license. You may use this template in unlimited personal and commercial projects. You may not redistribute or resell the source code.

---

## Support

- 📧 Email: [infinitee.vn@gmail.com](mailto:infinitee.vn@gmail.com)
- 🐙 Issues: open a GitHub issue
- 📖 Component docs: [pro-ui.pages.dev](https://pro-ui.pages.dev)
