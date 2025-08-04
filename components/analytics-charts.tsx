"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  ScatterChart,
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
  Activity as ActivityIcon
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ZAxis
} from "recharts"

interface AnalyticsData {
  date: string
  healthScore: number
  adherenceRate: number
  bloodPressure: number
  heartRate: number
  weight: number
  glucose: number
}

interface SpecialtyData {
  name: string
  value: number
  color: string
}

interface AdherenceData {
  medication: string
  adherence: number
  target: number
  status: string
}

interface CorrelationData {
  factor1: number
  factor2: number
  category: string
  size: number
}

interface AnalyticsChartsProps {
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
  orange: '#ff9800',
  gray: '#9e9e9e'
}

export default function AnalyticsCharts({ userId }: AnalyticsChartsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [specialtyData, setSpecialtyData] = useState<SpecialtyData[]>([])
  const [adherenceData, setAdherenceData] = useState<AdherenceData[]>([])
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [userId])

  const fetchAnalyticsData = async () => {
    try {
      // Datos de evolución temporal
      const mockAnalyticsData: AnalyticsData[] = [
        { date: 'Ene', healthScore: 85, adherenceRate: 92, bloodPressure: 120, heartRate: 72, weight: 70, glucose: 95 },
        { date: 'Feb', healthScore: 88, adherenceRate: 94, bloodPressure: 118, heartRate: 70, weight: 69, glucose: 92 },
        { date: 'Mar', healthScore: 82, adherenceRate: 85, bloodPressure: 125, heartRate: 75, weight: 71, glucose: 98 },
        { date: 'Abr', healthScore: 90, adherenceRate: 95, bloodPressure: 115, heartRate: 68, weight: 68, glucose: 88 },
        { date: 'May', healthScore: 87, adherenceRate: 88, bloodPressure: 122, heartRate: 73, weight: 70, glucose: 94 },
        { date: 'Jun', healthScore: 92, adherenceRate: 96, bloodPressure: 118, heartRate: 69, weight: 69, glucose: 90 },
        { date: 'Jul', healthScore: 89, adherenceRate: 93, bloodPressure: 120, heartRate: 71, weight: 70, glucose: 92 },
        { date: 'Ago', healthScore: 91, adherenceRate: 94, bloodPressure: 117, heartRate: 70, weight: 69, glucose: 89 },
        { date: 'Sep', healthScore: 86, adherenceRate: 87, bloodPressure: 124, heartRate: 74, weight: 71, glucose: 96 },
        { date: 'Oct', healthScore: 93, adherenceRate: 97, bloodPressure: 116, heartRate: 68, weight: 68, glucose: 87 },
        { date: 'Nov', healthScore: 88, adherenceRate: 91, bloodPressure: 121, heartRate: 72, weight: 70, glucose: 93 },
        { date: 'Dic', healthScore: 94, adherenceRate: 98, bloodPressure: 115, heartRate: 67, weight: 67, glucose: 86 }
      ]

      // Datos de distribución por especialidad
      const mockSpecialtyData: SpecialtyData[] = [
        { name: 'Cardiología', value: 25, color: COLORS.danger },
        { name: 'Endocrinología', value: 20, color: COLORS.warning },
        { name: 'Medicina General', value: 30, color: COLORS.primary },
        { name: 'Traumatología', value: 15, color: COLORS.info },
        { name: 'Psiquiatría', value: 10, color: COLORS.purple }
      ]

      // Datos de adherencia a medicamentos
      const mockAdherenceData: AdherenceData[] = [
        { medication: 'Metformina', adherence: 95, target: 100, status: 'Excelente' },
        { medication: 'Losartán', adherence: 88, target: 100, status: 'Bueno' },
        { medication: 'Sertralina', adherence: 85, target: 100, status: 'Bueno' },
        { medication: 'Ibuprofeno', adherence: 100, target: 100, status: 'Completado' },
        { medication: 'Antibióticos', adherence: 92, target: 100, status: 'Completado' },
        { medication: 'Fisioterapia', adherence: 78, target: 100, status: 'Necesita Mejora' }
      ]

      // Datos de correlación de factores
      const mockCorrelationData: CorrelationData[] = [
        { factor1: 120, factor2: 72, category: 'Normal', size: 20 },
        { factor1: 118, factor2: 70, category: 'Normal', size: 18 },
        { factor1: 125, factor2: 75, category: 'Elevado', size: 25 },
        { factor1: 115, factor2: 68, category: 'Óptimo', size: 15 },
        { factor1: 122, factor2: 73, category: 'Elevado', size: 22 },
        { factor1: 118, factor2: 69, category: 'Normal', size: 19 },
        { factor1: 120, factor2: 71, category: 'Normal', size: 20 },
        { factor1: 117, factor2: 70, category: 'Normal', size: 18 },
        { factor1: 124, factor2: 74, category: 'Elevado', size: 24 },
        { factor1: 116, factor2: 68, category: 'Óptimo', size: 16 },
        { factor1: 121, factor2: 72, category: 'Normal', size: 21 },
        { factor1: 115, factor2: 67, category: 'Óptimo', size: 14 }
      ]

      setAnalyticsData(mockAnalyticsData)
      setSpecialtyData(mockSpecialtyData)
      setAdherenceData(mockAdherenceData)
      setCorrelationData(mockCorrelationData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excelente': return COLORS.success
      case 'Bueno': return COLORS.primary
      case 'Completado': return COLORS.info
      case 'Necesita Mejora': return COLORS.warning
      default: return COLORS.gray
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Óptimo': return COLORS.success
      case 'Normal': return COLORS.primary
      case 'Elevado': return COLORS.warning
      default: return COLORS.info
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span>Cargando gráficos de análisis...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Evolución de Salud */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Evolución de Salud
          </CardTitle>
          <CardDescription>
            Seguimiento de la puntuación de salud a lo largo del año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="healthScore" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                name="Puntuación de Salud (%)"
              />
              <Line 
                type="monotone" 
                dataKey="adherenceRate" 
                stroke={COLORS.success} 
                strokeWidth={3}
                name="Adherencia (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Distribución por Especialidad */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-teal-600" />
            Distribución por Especialidad
          </CardTitle>
          <CardDescription>
            Porcentaje de consultas por especialidad médica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={specialtyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {specialtyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Métricas de Adherencia */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Métricas de Adherencia
          </CardTitle>
          <CardDescription>
            Porcentaje de adherencia a los tratamientos médicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="medication" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="adherence" fill={COLORS.success} name="Adherencia (%)" />
              <Bar dataKey="target" fill={COLORS.primary} name="Objetivo (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Correlación de Factores */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScatterChart className="w-5 h-5 text-teal-600" />
            Correlación de Factores
          </CardTitle>
          <CardDescription>
            Correlación entre presión arterial y frecuencia cardíaca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="factor1" 
                name="Presión Arterial" 
                domain={[110, 130]}
                label={{ value: 'Presión Arterial (mmHg)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="factor2" 
                name="Frecuencia Cardíaca" 
                domain={[65, 80]}
                label={{ value: 'Frecuencia Cardíaca (lpm)', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis type="number" range={[60, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="Mediciones" 
                data={correlationData} 
                fill={COLORS.primary}
              >
                {correlationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Scatter>
            </RechartsScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 