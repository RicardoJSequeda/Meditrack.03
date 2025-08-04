"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus,
  Activity,
  Heart,
  Pill,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Award,
  Star,
  Zap,
  Shield,
  Brain,
  Eye,
  Activity as ActivityIcon,
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart
} from "lucide-react"
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts"

interface ComparisonData {
  period: string
  healthScore: number
  adherenceRate: number
  bloodPressure: number
  heartRate: number
  weight: number
  glucose: number
  events: number
  appointments: number
  medications: number
}

interface HealthComparisonProps {
  userId: string
}

const COLORS = {
  primary: '#26a69a',
  secondary: '#80cbc4',
  success: '#81c784',
  warning: '#ffb74d',
  danger: '#e57373',
  info: '#64b5f6',
  purple: '#9c27b0',
  orange: '#ff9800'
}

export default function HealthComparison({ userId }: HealthComparisonProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['Último Mes', 'Últimos 3 Meses'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComparisonData()
  }, [userId])

  const fetchComparisonData = async () => {
    try {
      // Simular datos de comparación
      const mockData: ComparisonData[] = [
        {
          period: 'Último Mes',
          healthScore: 85,
          adherenceRate: 92,
          bloodPressure: 120,
          heartRate: 72,
          weight: 70,
          glucose: 95,
          events: 3,
          appointments: 2,
          medications: 4
        },
        {
          period: 'Últimos 3 Meses',
          healthScore: 78,
          adherenceRate: 85,
          bloodPressure: 125,
          heartRate: 75,
          weight: 71,
          glucose: 98,
          events: 8,
          appointments: 5,
          medications: 3
        },
        {
          period: 'Último Año',
          healthScore: 92,
          adherenceRate: 98,
          bloodPressure: 115,
          heartRate: 67,
          weight: 67,
          glucose: 86,
          events: 25,
          appointments: 12,
          medications: 6
        }
      ]

      setComparisonData(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching comparison data:', error)
      setLoading(false)
    }
  }

  const getChangeIndicator = (current: number, previous: number) => {
    const change = current - previous
    const percentage = ((change / previous) * 100).toFixed(1)
    
    if (change > 0) {
      return { icon: <TrendingUp className="w-4 h-4 text-green-600" />, text: `+${percentage}%`, color: 'text-green-600' }
    } else if (change < 0) {
      return { icon: <TrendingDown className="w-4 h-4 text-red-600" />, text: `${percentage}%`, color: 'text-red-600' }
    } else {
      return { icon: <Minus className="w-4 h-4 text-gray-600" />, text: '0%', color: 'text-gray-600' }
    }
  }

  const getMetricColor = (metric: string, value: number) => {
    switch (metric) {
      case 'healthScore':
        return value >= 80 ? COLORS.success : value >= 60 ? COLORS.warning : COLORS.danger
      case 'adherenceRate':
        return value >= 90 ? COLORS.success : value >= 70 ? COLORS.warning : COLORS.danger
      case 'bloodPressure':
        return value <= 120 ? COLORS.success : value <= 140 ? COLORS.warning : COLORS.danger
      case 'heartRate':
        return value >= 60 && value <= 100 ? COLORS.success : COLORS.warning
      case 'glucose':
        return value >= 70 && value <= 100 ? COLORS.success : COLORS.warning
      default:
        return COLORS.primary
    }
  }

  const filteredData = comparisonData.filter(data => selectedPeriods.includes(data.period))

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span>Cargando datos de comparación...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles de Selección */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Comparación de Períodos
          </CardTitle>
          <CardDescription>
            Selecciona los períodos que deseas comparar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {comparisonData.map((data) => (
              <Button
                key={data.period}
                variant={selectedPeriods.includes(data.period) ? 'default' : 'outline'}
                onClick={() => {
                  if (selectedPeriods.includes(data.period)) {
                    setSelectedPeriods(selectedPeriods.filter(p => p !== data.period))
                  } else {
                    setSelectedPeriods([...selectedPeriods, data.period])
                  }
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {data.period}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Comparativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((period, index) => (
          <Card key={period.period} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{period.period}</CardTitle>
              <CardDescription>Análisis de métricas de salud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Puntuación de Salud */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Salud General</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: getMetricColor('healthScore', period.healthScore) }}>
                      {period.healthScore}%
                    </span>
                    {index > 0 && getChangeIndicator(period.healthScore, filteredData[index - 1].healthScore).icon}
                  </div>
                </div>
                <Progress value={period.healthScore} className="h-2" />
              </div>

              {/* Adherencia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adherencia</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: getMetricColor('adherenceRate', period.adherenceRate) }}>
                      {period.adherenceRate}%
                    </span>
                    {index > 0 && getChangeIndicator(period.adherenceRate, filteredData[index - 1].adherenceRate).icon}
                  </div>
                </div>
                <Progress value={period.adherenceRate} className="h-2" />
              </div>

              {/* Métricas Corporales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Presión Arterial</p>
                  <p className="text-lg font-bold" style={{ color: getMetricColor('bloodPressure', period.bloodPressure) }}>
                    {period.bloodPressure}
                  </p>
                  <p className="text-xs text-gray-500">mmHg</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Frecuencia Cardíaca</p>
                  <p className="text-lg font-bold" style={{ color: getMetricColor('heartRate', period.heartRate) }}>
                    {period.heartRate}
                  </p>
                  <p className="text-xs text-gray-500">lpm</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Peso</p>
                  <p className="text-lg font-bold text-gray-900">
                    {period.weight}
                  </p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Glucosa</p>
                  <p className="text-lg font-bold" style={{ color: getMetricColor('glucose', period.glucose) }}>
                    {period.glucose}
                  </p>
                  <p className="text-xs text-gray-500">mg/dL</p>
                </div>
              </div>

              {/* Actividad Médica */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Actividad Médica:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-lg font-bold text-blue-600">{period.events}</p>
                    <p className="text-xs text-blue-600">Eventos</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">{period.appointments}</p>
                    <p className="text-xs text-green-600">Citas</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-600">{period.medications}</p>
                    <p className="text-xs text-purple-600">Medicamentos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos Comparativos */}
      {filteredData.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Líneas */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-teal-600" />
                Evolución de Salud
              </CardTitle>
              <CardDescription>
                Comparación de puntuación de salud y adherencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="healthScore" 
                    stroke={COLORS.primary} 
                    strokeWidth={3}
                    name="Salud General (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="adherenceRate" 
                    stroke={COLORS.success} 
                    strokeWidth={3}
                    name="Adherencia (%)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Métricas Corporales
              </CardTitle>
              <CardDescription>
                Comparación de presión arterial y frecuencia cardíaca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bloodPressure" fill={COLORS.danger} name="Presión Arterial" />
                  <Bar dataKey="heartRate" fill={COLORS.orange} name="Frecuencia Cardíaca" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumen de Cambios */}
      {filteredData.length >= 2 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Resumen de Cambios
            </CardTitle>
            <CardDescription>
              Análisis de las tendencias entre períodos seleccionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['healthScore', 'adherenceRate', 'bloodPressure', 'heartRate'].map((metric) => {
                const current = filteredData[filteredData.length - 1]
                const previous = filteredData[filteredData.length - 2]
                const change = getChangeIndicator(current[metric as keyof ComparisonData] as number, previous[metric as keyof ComparisonData] as number)
                
                return (
                  <div key={metric} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {change.icon}
                      <span className={`text-sm font-medium ${change.color}`}>
                        {change.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      {metric === 'healthScore' ? 'Salud General' :
                       metric === 'adherenceRate' ? 'Adherencia' :
                       metric === 'bloodPressure' ? 'Presión Arterial' :
                       'Frecuencia Cardíaca'}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 