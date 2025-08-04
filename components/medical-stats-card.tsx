import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MedicalStatsCardProps {
  title: string
  icon: LucideIcon
  mainValue: string | number
  subtitle: string
  percentage?: number
  status: string
  statusColor: 'success' | 'warning' | 'danger' | 'info'
  subMetrics?: Array<{
    label: string
    value: number
    color: string
  }>
  details?: Array<{
    label: string
    value: string
    icon: LucideIcon
    color: string
  }>
  className?: string
}

const statusColors = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
}

const progressColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500'
}

export function MedicalStatsCard({
  title,
  icon: Icon,
  mainValue,
  subtitle,
  percentage,
  status,
  statusColor,
  subMetrics,
  details,
  className
}: MedicalStatsCardProps) {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
      'bg-gradient-to-br from-white to-gray-50/50',
      className
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs font-medium border',
              statusColors[statusColor]
            )}
          >
            {status}
          </Badge>
        </div>

        {/* Main Value */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {mainValue}
          </div>
          {percentage !== undefined && (
            <div className="space-y-2">
              <Progress 
                value={percentage} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{percentage}%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>

        {/* Sub Metrics */}
        {subMetrics && (
          <div className="flex space-x-4 mb-4">
            {subMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={cn("text-lg font-semibold", metric.color)}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-500">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        {details && (
          <div className="space-y-2 pt-3 border-t border-gray-100">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <detail.icon className={cn("w-4 h-4", detail.color)} />
                <span className="text-gray-600">{detail.label}:</span>
                <span className="font-medium text-gray-900">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
      </CardContent>
    </Card>
  )
} 