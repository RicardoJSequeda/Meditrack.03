import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MedicalHistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header Loading */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full bg-white/20" />
            <div>
              <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-96 bg-white/20" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-32 bg-white/20" />
            <Skeleton className="h-10 w-24 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Info Card Loading */}
      <Card className="bg-gradient-to-r from-white to-blue-50 border-blue-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <Skeleton className="h-6 w-48 bg-white/20" />
          <Skeleton className="h-4 w-80 bg-white/20" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="p-3 bg-gray-50 rounded-lg">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Card Loading */}
      <Card className="bg-gradient-to-r from-white to-gray-50 border-gray-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <Skeleton className="h-6 w-48 bg-white/20" />
          <Skeleton className="h-4 w-80 bg-white/20" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Loading */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="grid w-full grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Content Loading */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="bg-gray-50 p-4 rounded-lg">
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      ))}
                    </div>

                    <Skeleton className="h-16 w-full" />
                  </div>

                  <div className="flex flex-col gap-3 ml-6">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
