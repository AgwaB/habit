export function TaskCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-between mb-3">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-gray-200/50 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200/50 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-100/50 rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-100/50 animate-pulse" />
      </div>
    </div>
  );
}
