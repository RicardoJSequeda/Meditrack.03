export default function ReportsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded w-24"></div>
            <div className="h-9 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Period navigation skeleton */}
        <div className="h-16 bg-gray-200 rounded mb-6"></div>

        {/* Advanced analysis cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Executive summary cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="h-12 bg-gray-200 rounded mb-4"></div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
