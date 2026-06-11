/** Skeleton primitives + PageSkeleton for Suspense fallback */

function Bone({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-lg bg-border/50 ${className}`} style={style} />
  )
}

function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <div className="flex justify-between">
        <Bone className="h-3 w-20" />
        <Bone className="h-8 w-16" />
      </div>
      <Bone className="h-7 w-28" />
      <Bone className="h-3 w-16" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <Bone className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-1 h-48">
        {Array.from({ length: 12 }).map((_, i) => (
          <Bone key={i} className="flex-1" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <Bone className="h-4 w-40 mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Bone className="h-4 w-10" />
          <Bone className="h-4 flex-1" />
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-canvas p-6 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Bone className="h-8 w-48" />
        <Bone className="h-8 w-8 rounded-full" />
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      {/* Table */}
      <TableSkeleton />
    </div>
  )
}

export { Bone, CardSkeleton, ChartSkeleton, TableSkeleton }
