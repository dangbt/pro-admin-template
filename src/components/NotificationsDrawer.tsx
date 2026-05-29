import { createPortal } from 'react-dom'
import { X, Bell, CheckCheck, Trash2, ShoppingCart, UserPlus, AlertCircle, Zap, Info } from 'lucide-react'

/* ────────────────────────────────────────────
   Types
──────────────────────────────────────────── */
export type NotifType = 'order' | 'user' | 'warning' | 'system' | 'info'

export interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: number // ms
  read: boolean
}

/* ────────────────────────────────────────────
   Seed data
──────────────────────────────────────────── */
export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'warning', read: false,
    title: 'Payment failed',
    body: 'The charge for Emma Hoang (Pro Plan) failed. Please retry.',
    time: Date.now() - 2 * 60_000,
  },
  {
    id: 'n2', type: 'order', read: false,
    title: 'New order received',
    body: 'Alice Nguyen placed an order for $199.',
    time: Date.now() - 12 * 60_000,
  },
  {
    id: 'n3', type: 'user', read: false,
    title: 'New user signed up',
    body: 'david@example.com just created an account.',
    time: Date.now() - 28 * 60_000,
  },
  {
    id: 'n4', type: 'system', read: true,
    title: 'System update complete',
    body: 'Platform updated to v2.4.1 with improved performance.',
    time: Date.now() - 3 * 60 * 60_000,
  },
  {
    id: 'n5', type: 'info', read: true,
    title: 'Weekly report ready',
    body: 'Your performance summary for the week is available.',
    time: Date.now() - 24 * 60 * 60_000,
  },
]

/* ────────────────────────────────────────────
   Helpers
──────────────────────────────────────────── */
function timeAgo(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60)          return `${s}s ago`
  if (s < 3600)        return `${Math.floor(s / 60)}m ago`
  if (s < 86400)       return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  order:   <ShoppingCart className="w-3.5 h-3.5" />,
  user:    <UserPlus className="w-3.5 h-3.5" />,
  warning: <AlertCircle className="w-3.5 h-3.5" />,
  system:  <Zap className="w-3.5 h-3.5" />,
  info:    <Info className="w-3.5 h-3.5" />,
}

const TYPE_COLOR: Record<NotifType, string> = {
  order:   'bg-primary/10 text-primary',
  user:    'bg-success/10 text-success',
  warning: 'bg-danger/10 text-danger',
  system:  'bg-warning/10 text-warning',
  info:    'bg-info/10 text-info',
}

/* ────────────────────────────────────────────
   NotificationsDrawer
──────────────────────────────────────────── */
interface Props {
  open: boolean
  notifications: Notification[]
  onClose: () => void
  onMarkAllRead: () => void
  onClearAll: () => void
  onDismiss: (id: string) => void
}

export function NotificationsDrawer({ open, notifications, onClose, onMarkAllRead, onClearAll, onDismiss }: Props) {
  const unread = notifications.filter(n => !n.read).length

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-[9997] bg-black/20 backdrop-blur-[1px] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={[
          'fixed inset-y-0 right-0 z-[9997] w-80 bg-surface border-l border-border shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-fg-muted" />
            <h2 className="text-sm font-semibold text-fg">Notifications</h2>
            {unread > 0 && (
              <span className="text-[10px] font-bold bg-danger text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle shrink-0">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[11px] text-fg-muted hover:text-fg transition-colors"
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
            <span className="text-fg-disabled">·</span>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-[11px] text-fg-muted hover:text-danger transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center">
                <Bell className="w-5 h-5 text-fg-disabled" />
              </div>
              <p className="text-sm text-fg-muted">All caught up!</p>
              <p className="text-xs text-fg-disabled text-center px-8">No notifications right now.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={[
                  'flex items-start gap-3 px-4 py-3.5 border-b border-border-subtle hover:bg-surface-subtle transition-colors group',
                  !notif.read && 'bg-primary/[0.03]',
                ].join(' ')}
              >
                {/* Unread dot */}
                <div className="relative mt-1 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${TYPE_COLOR[notif.type]}`}>
                    {TYPE_ICON[notif.type]}
                  </div>
                  {!notif.read && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary border border-surface" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-tight ${notif.read ? 'text-fg-2' : 'text-fg'}`}>
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-fg-muted mt-0.5 leading-relaxed">{notif.body}</p>
                  <p className="text-[10px] text-fg-disabled mt-1">{timeAgo(notif.time)}</p>
                </div>

                <button
                  onClick={() => onDismiss(notif.id)}
                  className="shrink-0 p-1 rounded text-fg-disabled hover:text-fg-muted opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
