import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function PatientInfoSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>

        {/* Blood Type Badge */}
        <div className="mb-6">
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>

        {/* Contact Information */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Medical ID */}
        <div className="mb-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded" />
        </div>

        {/* Emergency Contact */}
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  )
} 