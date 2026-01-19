export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200/50 rounded w-24 animate-pulse" />
            <div className="h-3 bg-gray-100/50 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gray-100/50 animate-pulse" />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-sm bg-gray-100/50 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
