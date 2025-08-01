"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Heart,
  Activity,
  Calendar,
  Pill,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  Plus,
  Search,
  Bell,
  FileText,
  Star,
  Filter,
  AlertTriangle,
  Settings,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useHealthMetrics } from '@/hooks/use-health-metrics'
import { useMedicationAdherence } from '@/hooks/use-medication-adherence'
import { useRecommendations } from '@/hooks/use-recommendations'
import { useAppointments } from '@/hooks/use-appointments'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface HealthMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  change: number
  category?: string
  notes?: string
}

interface MedicationAdherence {
  id: string
  medication: string
  prescribed: number
  taken: number
  adherence: number
  status: "excellent" | "good" | "poor"
  period?: string
  notes?: string
}

interface Appointment {
  id: string
  title: string
  date: string
  doctor: string
  specialty: string
  status: "completed" | "upcoming" | "missed" | "confirmed" | "pending"
  notes?: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
  type: string
  category?: string
  details?: string[]
  timeline?: string
  progress?: number
  isCompleted?: boolean
}

export default function ReportsPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewPeriod, setViewPeriod] = useState<"week" | "month" | "quarter" | "year">("week")
  const [isLoading, setIsLoading] = useState(true)

  // Usar hooks para obtener datos de la base de datos
  const { metrics: healthMetrics, isLoading: metricsLoading } = useHealthMetrics()
  const { adherence: medicationAdherence, isLoading: adherenceLoading } = useMedicationAdherence()
  const { recommendations, isLoading: recommendationsLoading } = useRecommendations()
  const { appointments, isLoading: appointmentsLoading } = useAppointments()

  // Datos para gráficos (calculados desde los datos reales)
  const chartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    healthMetrics: {
      presionArterial: healthMetrics.filter((m: HealthMetric) => m.name === 'Presión Arterial').map((m: HealthMetric) => m.value) || [120, 118, 125, 122, 119, 121, 123],
      frecuenciaCardiaca: healthMetrics.filter((m: HealthMetric) => m.name === 'Frecuencia Cardíaca').map((m: HealthMetric) => m.value) || [72, 70, 75, 73, 71, 74, 72],
      glucosa: healthMetrics.filter((m: HealthMetric) => m.name === 'Glucosa').map((m: HealthMetric) => m.value) || [95, 92, 98, 94, 91, 96, 93],
      peso: healthMetrics.filter((m: HealthMetric) => m.name === 'Peso').map((m: HealthMetric) => m.value) || [70.2, 70.1, 70.5, 70.3, 70.4, 70.6, 70.5],
    },
          adherence: medicationAdherence.map((m: MedicationAdherence) => m.adherence) || [85, 90, 88, 92, 87, 89, 91],
    appointments: appointments.length > 0 ? [appointments.length, 0, 1, 0, 1, 0, 0] : [1, 0, 1, 0, 1, 0, 0],
  }

  // Configuración de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  }

  // Estado de carga combinado
  const isLoadingData = metricsLoading || adherenceLoading || recommendationsLoading || appointmentsLoading

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [currentWeek, viewPeriod, isLoadingData])

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return `${startOfWeek.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} - ${endOfWeek.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}`
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setIsLoading(true)
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "excellent":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "critical":
      case "poor":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  // Funciones helper para métricas de salud
  const getNormalRange = (metricName: string) => {
    const ranges = {
      "Presión Arterial": { min: 120, max: 140, unit: "mmHg" },
      "Frecuencia Cardíaca": { min: 60, max: 100, unit: "bpm" },
      "Glucosa": { min: 70, max: 100, unit: "mg/dL" },
      "Peso": { min: 60, max: 80, unit: "kg" },
    }
    return ranges[metricName as keyof typeof ranges] || { min: 0, max: 100, unit: "" }
  }

  const getNormalizedValue = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100"
      case "warning":
        return "bg-yellow-100"
      case "critical":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Normal"
      case "warning":
        return "Atención"
      case "critical":
        return "Crítico"
      default:
        return "Desconocido"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-red-600"
      case "down":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5 text-blue-600" />
      case "lifestyle":
        return <Heart className="h-5 w-5 text-green-600" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-600" />
      case "monitoring":
        return <Activity className="h-5 w-5 text-orange-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-gray-600" />
    }
  }

  const exportReport = (format: "pdf" | "excel") => {
    const reportData = {
      period: formatWeekRange(currentWeek),
      healthMetrics,
      medicationAdherence,
      appointments,
      recommendations,
      exportDate: new Date().toISOString(),
      format,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `informe-salud-${format}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const overallHealthScore = Math.round(
    (healthMetrics.filter((m) => m.status === "good").length / healthMetrics.length) * 100,
  )

  const averageAdherence = Math.round(
    medicationAdherence.reduce((sum, med) => sum + med.adherence, 0) / medicationAdherence.length,
  )

  const completedAppointments = appointments.filter((apt) => apt.status === "completed").length

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      {/* Header Rediseñado con Gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-bl-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-white/80" />
              Informe de Salud
            </h1>
            <p className="text-blue-100 mt-2 text-lg font-medium drop-shadow-sm">
              Análisis inteligente de tu bienestar semanal
            </p>
        </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-md" onClick={() => exportReport("pdf")}> <Download className="h-4 w-4 mr-2" /> Exportar PDF </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-md" onClick={() => exportReport("excel")}> <Download className="h-4 w-4 mr-2" /> Exportar Excel </Button>
        </div>
      </div>
      </div>
      {/* Fin Header */}

      {/* Navegación de Período */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{formatWeekRange(currentWeek)}</h3>
                <p className="text-sm text-gray-600">Semana seleccionada</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
                className="flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              {(["week", "month", "quarter", "year"] as const).map((period) => (
                <Button
                  key={period}
                  variant={viewPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewPeriod(period)}
                  className="capitalize"
                >
                  {period === "week"
                    ? "Semana"
                    : period === "month"
                      ? "Mes"
                      : period === "quarter"
                        ? "Trimestre"
                        : "Año"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis Avanzado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              Análisis de Tendencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Tendencia General</span>
                <Badge className="bg-green-100 text-green-800">Mejorando</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Indicadores Positivos</span>
                <span className="font-semibold text-blue-800">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Cambio vs. Semana Anterior</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              Evaluación de Riesgos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-700">Riesgo General</span>
                <Badge className="bg-yellow-100 text-yellow-800">Bajo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-700">Factores de Riesgo</span>
                <span className="font-semibold text-orange-800">2 de 8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-700">Recomendaciones</span>
                <span className="font-semibold text-orange-800">4 activas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Zap className="h-5 w-5" />
              Análisis Predictivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Predicción 30 días</span>
                <Badge className="bg-green-100 text-green-800">Estable</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Probabilidad Mejora</span>
                <span className="font-semibold text-purple-800">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Confianza Modelo</span>
                <span className="font-semibold text-purple-800">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Ejecutivo Mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Adherencia a Medicación */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-blue-200 bg-blue-50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 animate-fade-in-up">{averageAdherence}%</div>
                <div className="text-sm text-gray-600">Adherencia</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={averageAdherence} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Meta: 90%</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600 animate-bounce" />
                  <span className="text-green-600 font-medium">+5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citas Médicas */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-green-200 bg-green-50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 animate-fade-in-up">{completedAppointments}</div>
                <div className="text-sm text-gray-600">Citas completadas</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completadas</span>
                <span className="text-green-600 font-semibold">{completedAppointments}</span>
                </div>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Próximas</span>
                <span className="text-blue-600 font-semibold">{appointments.filter((apt) => apt.status === "upcoming").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores de Salud */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-purple-200 bg-purple-50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 animate-fade-in-up">{overallHealthScore}%</div>
                <div className="text-sm text-gray-600">Salud general</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={overallHealthScore} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Normales</span>
                <span className="text-purple-600 font-semibold">{healthMetrics.filter((m) => m.status === "good").length} de {healthMetrics.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(overallHealthScore >= 80 ? "good" : "warning") + " px-3 py-1 text-xs"}>
                  {overallHealthScore >= 80 ? "Bueno" : "Regular"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Pestañas */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Métricas</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medicación</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Citas</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Recomendaciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Análisis Comparativo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Análisis Comparativo
              </CardTitle>
              <CardDescription>Comparación con el período anterior y tendencias identificadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{metric.name}</h4>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        {metric.value} <span className="text-sm font-normal text-gray-600">{metric.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status === "good" ? "Normal" : metric.status === "warning" ? "Atención" : "Crítico"}
                        </Badge>
                        <span
                          className={`text-sm ${metric.change > 0 ? "text-red-600" : metric.change < 0 ? "text-green-600" : "text-gray-600"}`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Tendencias Interactivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencias de Salud
              </CardTitle>
              <CardDescription>Evolución de tus indicadores principales durante la semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: 'Presión Arterial (mmHg)',
                        data: chartData.healthMetrics.presionArterial,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      },
                      {
                        label: 'Frecuencia Cardíaca (bpm)',
                        data: chartData.healthMetrics.frecuenciaCardiaca,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgb(239, 68, 68)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      },
                      {
                        label: 'Glucosa (mg/dL)',
                        data: chartData.healthMetrics.glucosa,
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgb(34, 197, 94)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        display: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {healthMetrics.map((metric, index) => {
              const normalRange = getNormalRange(metric.name)
              const normalizedValue = getNormalizedValue(metric.value, normalRange.min, normalRange.max)
              
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusBgColor(metric.status)}`}>
                      <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{metric.name}</div>
                          <div className="text-sm text-gray-600">Última medición</div>
                        </div>
                      </div>
                    <Badge className={getStatusColor(metric.status)}>
                        {getStatusText(metric.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {metric.value}
                        <span className="text-lg font-normal text-gray-600 ml-1">{metric.unit}</span>
                      </div>
                    </div>
                      
                      {/* Rango normal */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Rango normal:</span>
                          <span className="font-medium">{normalRange.min}-{normalRange.max} {normalRange.unit}</span>
                        </div>
                        <div className="relative">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                metric.status === 'good' ? 'bg-green-500' : 
                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${normalizedValue}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{normalRange.min}</span>
                            <span>{normalRange.max}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tendencia */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tendencia</span>
                        <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                      
                      {/* Gráfico */}
                      <div className="h-32">
                        <Bar
                          data={{
                            labels: chartData.labels,
                            datasets: [
                              {
                                label: metric.name,
                                data: chartData.healthMetrics[metric.name.toLowerCase().replace(/\s+/g, '') as keyof typeof chartData.healthMetrics] || [metric.value, metric.value, metric.value, metric.value, metric.value, metric.value, metric.value],
                                backgroundColor: metric.status === 'good' ? 'rgba(34, 197, 94, 0.8)' : metric.status === 'warning' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                                borderColor: metric.status === 'good' ? 'rgb(34, 197, 94)' : metric.status === 'warning' ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)',
                                borderWidth: 1,
                                borderRadius: 4,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                display: false,
                              },
                              x: {
                                ...chartOptions.scales.x,
                                display: false,
                              },
                            },
                          }}
                        />
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          {/* Header de Gamificación */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Pill className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">🏆 Tu Progreso de Adherencia</h3>
                    <p className="text-blue-700">Mantén tu racha y alcanza tus metas de salud</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{averageAdherence}%</div>
                  <div className="text-sm text-blue-600">Promedio general</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adherencia por Medicamento con Gamificación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Adherencia por Medicamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {medicationAdherence.map((med, index) => {
                    const isExcellent = med.adherence >= 90
                    const isGood = med.adherence >= 80 && med.adherence < 90
                    const isPoor = med.adherence < 80
                    
                    return (
                      <div key={index} className="bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              isExcellent ? 'bg-green-100' : 
                              isGood ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <Pill className={`h-5 w-5 ${
                                isExcellent ? 'text-green-600' : 
                                isGood ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{med.medication}</h4>
                              <p className="text-sm text-gray-600">{med.taken} de {med.prescribed} tomadas</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{med.adherence}%</div>
                            <Badge className={`${
                              isExcellent ? 'bg-green-100 text-green-800' : 
                              isGood ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isExcellent ? '🏆 Excelente' : isGood ? '👍 Bueno' : '⚠️ Mejorable'}
                        </Badge>
                      </div>
                      </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium">{med.adherence}%</span>
                    </div>
                          <Progress value={med.adherence} className="h-3" />
                          
                          {/* Motivación y Recordatorios */}
                          {isExcellent && (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                              <CheckCircle className="h-4 w-4" />
                              <span>¡Excelente! Mantén este ritmo para tu salud</span>
                            </div>
                          )}
                          
                          {isGood && (
                            <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg">
                              <Clock className="h-4 w-4" />
                              <span>¡Casi perfecto! Solo necesitas mejorar un poco más</span>
                            </div>
                          )}
                          
                          {isPoor && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                              <Activity className="h-4 w-4" />
                              <span>Configura recordatorios para mejorar tu adherencia</span>
                            </div>
                          )}
                          
                          {/* Acciones rápidas */}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              📅 Configurar recordatorios
                            </Button>
                            <Button size="sm" variant="outline">
                              📊 Ver historial
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Adherencia Semanal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Adherencia Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: 'Adherencia (%)',
                          data: chartData.adherence,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                          pointBackgroundColor: 'rgb(59, 130, 246)',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
                          min: 0,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Distribución de Adherencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Adherencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <Doughnut
                    data={{
                      labels: medicationAdherence.map(med => med.medication),
                      datasets: [
                        {
                          data: medicationAdherence.map(med => med.adherence),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                          ],
                          borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(34, 197, 94)',
                            'rgb(239, 68, 68)',
                          ],
                          borderWidth: 2,
                          hoverOffset: 4,
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: 'bottom' as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logros y Metas */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Target className="h-5 w-5" />
                  Logros y Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Logros actuales */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">🏆 Logros Actuales</h4>
                    <div className="space-y-2">
                      {medicationAdherence.filter(med => med.adherence >= 90).length > 0 && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>Excelente adherencia en {medicationAdherence.filter(med => med.adherence >= 90).length} medicamento(s)</span>
                        </div>
                      )}
                      {averageAdherence >= 85 && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>Promedio general excelente ({averageAdherence}%)</span>
                        </div>
                      )}
                      {medicationAdherence.filter(med => med.adherence >= 80).length === medicationAdherence.length && (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>Todos los medicamentos con buena adherencia</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metas próximas */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">🎯 Metas Próximas</h4>
                    <div className="space-y-2">
                      {medicationAdherence.filter(med => med.adherence < 90).map((med, index) => (
                        <div key={index} className="flex items-center gap-2 text-green-700">
                          <Target className="h-4 w-4" />
                          <span>Llevar {med.medication} al 90% (actual: {med.adherence}%)</span>
                        </div>
                      ))}
                      {averageAdherence < 90 && (
                        <div className="flex items-center gap-2 text-green-700">
                          <Target className="h-4 w-4" />
                          <span>Alcanzar 90% de adherencia general</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consejos */}
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">💡 Consejos para Mejorar</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Configura recordatorios diarios</li>
                      <li>• Mantén tus medicamentos visibles</li>
                      <li>• Establece rutinas consistentes</li>
                      <li>• Usa un pastillero organizado</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {/* Header de Citas Médicas */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">📅 Gestión de Citas Médicas</h3>
                    <p className="text-purple-700">Organiza y da seguimiento a tus consultas médicas</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{appointments.length}</div>
                  <div className="text-sm text-purple-600">Citas programadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline de Citas */}
            <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline de Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
                  <div className="space-y-6">
                    {appointments.map((appointment, index) => {
                      const isToday = new Date(appointment.date).toDateString() === new Date().toDateString()
                      const isUpcoming = new Date(appointment.date) > new Date()
                      const isPast = new Date(appointment.date) < new Date()
                      
                      return (
                        <div key={index} className="relative">
                          {/* Línea de tiempo */}
                          {index < appointments.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                          )}
                          
                          <div className={`flex gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                            isToday ? 'border-blue-300 bg-blue-50' :
                            isUpcoming ? 'border-green-300 bg-green-50' :
                            'border-gray-200 bg-gray-50'
                          }`}>
                            {/* Indicador de tiempo */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                              isToday ? 'bg-blue-500 text-white' :
                              isUpcoming ? 'bg-green-500 text-white' :
                              'bg-gray-400 text-white'
                            }`}>
                              {isToday ? (
                                <Calendar className="h-6 w-6" />
                              ) : isUpcoming ? (
                                <Clock className="h-6 w-6" />
                              ) : (
                                <CheckCircle className="h-6 w-6" />
                        )}
                      </div>
                            
                            {/* Contenido de la cita */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                      <div>
                                  <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-medium ${
                                    isToday ? 'text-blue-600' :
                                    isUpcoming ? 'text-green-600' :
                                    'text-gray-500'
                                  }`}>
                                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                      </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(appointment.date).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                    </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                                                 <Badge className={`${
                                   appointment.status === "confirmed" || appointment.status === "completed" ? 'bg-green-100 text-green-800' :
                                   appointment.status === "pending" || appointment.status === "upcoming" ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800'
                                 }`}>
                                   {appointment.status === "confirmed" || appointment.status === "completed" ? '✅ Confirmada' :
                                    appointment.status === "pending" || appointment.status === "upcoming" ? '⏳ Pendiente' : '❌ Cancelada'}
                    </Badge>
                                {isToday && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    🎯 Hoy
                                  </Badge>
                                )}
                  </div>
                              
                              {/* Acciones rápidas */}
                              <div className="flex gap-2 pt-2">
                                {isUpcoming && (
                                  <>
                                    <Button size="sm" variant="outline" className="flex-1">
                                      📞 Confirmar
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      📅 Reprogramar
                                    </Button>
                                  </>
                                )}
                                {isToday && (
                                  <>
                                    <Button size="sm" variant="outline" className="flex-1">
                                      🚗 Direcciones
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      📋 Preparar
                                    </Button>
                                  </>
                                )}
                                {isPast && (
                                  <Button size="sm" variant="outline" className="flex-1">
                                    📊 Ver resumen
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Panel lateral con estadísticas y acciones */}
            <div className="space-y-6">
              {/* Estadísticas rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Hoy</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {appointments.filter(apt => 
                          new Date(apt.date).toDateString() === new Date().toDateString()
                        ).length}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Próximas</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {appointments.filter(apt => 
                          new Date(apt.date) > new Date()
                        ).length}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Completadas</span>
                      </div>
                      <div className="text-lg font-bold text-gray-600">
                        {appointments.filter(apt => 
                          new Date(apt.date) < new Date()
                        ).length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Cita
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Doctor
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Recordatorios
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Historial
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Próxima cita destacada */}
              {appointments.filter(apt => new Date(apt.date) > new Date()).length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Star className="h-5 w-5" />
                      Próxima Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const nextAppointment = appointments
                        .filter(apt => new Date(apt.date) > new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
                      
                      if (!nextAppointment) return null
                      
                      const daysUntil = Math.ceil((new Date(nextAppointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      
                      return (
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{nextAppointment.doctor}</div>
                            <div className="text-sm text-blue-700">{nextAppointment.specialty}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-900">
                              {new Date(nextAppointment.date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-blue-700">
                              {new Date(nextAppointment.date).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Badge className="bg-blue-100 text-blue-800">
                              {daysUntil === 0 ? 'Hoy' : 
                               daysUntil === 1 ? 'Mañana' : 
                               `En ${daysUntil} días`}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              📞 Confirmar
                            </Button>
                            <Button size="sm" variant="outline">
                              📅 Cambiar
                            </Button>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Header de Recomendaciones */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Lightbulb className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900">💡 Recomendaciones Personalizadas</h3>
                    <p className="text-orange-700">Acciones específicas para mejorar tu salud</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{recommendations.length}</div>
                  <div className="text-sm text-orange-600">Recomendaciones activas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Recomendaciones Priorizadas */}
            <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                    Recomendaciones por Prioridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                    {recommendations.map((rec, index) => {
                      const isHigh = rec.priority === "high"
                      const isMedium = rec.priority === "medium"
                      const isLow = rec.priority === "low"
                      
                      return (
                        <div key={index} className={`border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
                          isHigh ? 'border-red-300 bg-red-50' :
                          isMedium ? 'border-yellow-300 bg-yellow-50' :
                          'border-green-300 bg-green-50'
                        }`}>
                    <div className="flex items-start gap-4">
                            {/* Indicador de prioridad */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                              isHigh ? 'bg-red-500 text-white' :
                              isMedium ? 'bg-yellow-500 text-white' :
                              'bg-green-500 text-white'
                            }`}>
                              {isHigh ? (
                                <AlertTriangle className="h-6 w-6" />
                              ) : isMedium ? (
                                <Clock className="h-6 w-6" />
                              ) : (
                                <CheckCircle className="h-6 w-6" />
                              )}
                            </div>
                            
                            {/* Contenido de la recomendación */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${
                                    isHigh ? 'bg-red-100 text-red-800' :
                                    isMedium ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {isHigh ? '🔥 Alta' : isMedium ? '⚡ Media' : '✅ Baja'}
                                  </Badge>
                                  {rec.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {rec.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {/* Detalles adicionales */}
                              {rec.details && (
                                <div className="bg-white p-3 rounded-lg border">
                                  <h5 className="font-medium text-gray-900 mb-2">📋 Detalles:</h5>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {rec.details.map((detail, detailIndex) => (
                                      <li key={detailIndex} className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">•</span>
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Acciones concretas */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-900">🎯 Acciones Sugeridas:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {rec.actions?.map((action, actionIndex) => (
                                    <Button 
                                      key={actionIndex} 
                                      size="sm" 
                            variant="outline"
                                      className={`${
                                        isHigh ? 'border-red-300 text-red-700 hover:bg-red-50' :
                                        isMedium ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' :
                                        'border-green-300 text-green-700 hover:bg-green-50'
                                      }`}
                                    >
                                      {action.icon} {action.text}
                                    </Button>
                                  ))}
                        </div>
                        </div>
                              
                              {/* Timeline y progreso */}
                              {rec.timeline && (
                                <div className="bg-white p-3 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900">⏰ Timeline:</h5>
                                    <span className="text-sm text-gray-600">{rec.timeline}</span>
                      </div>
                                  <Progress 
                                    value={rec.progress || 0} 
                                    className="h-2"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Inicio</span>
                                    <span>{rec.progress || 0}% completado</span>
                                    <span>Meta</span>
                    </div>
                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Panel lateral con filtros y estadísticas */}
            <div className="space-y-6">
              {/* Filtros de prioridad */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtrar por Prioridad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-900">Alta Prioridad</span>
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        {recommendations.filter(rec => rec.priority === "high").length}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Media Prioridad</span>
                      </div>
                      <div className="text-lg font-bold text-yellow-600">
                        {recommendations.filter(rec => rec.priority === "medium").length}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Baja Prioridad</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {recommendations.filter(rec => rec.priority === "low").length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Recomendación
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programar Recordatorio
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Historial
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Personalizar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de progreso */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <BarChart3 className="h-5 w-5" />
                    Progreso General
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                                         <div className="text-center">
                       <div className="text-3xl font-bold text-blue-600">
                         {Math.round((recommendations.filter(rec => (rec.progress || 0) >= 100).length / recommendations.length) * 100)}%
                       </div>
                       <div className="text-sm text-blue-700">Completadas</div>
                     </div>
                    
                                         <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-blue-900">Completadas</span>
                         <span className="font-medium text-blue-600">
                           {recommendations.filter(rec => (rec.progress || 0) >= 100).length}
                         </span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-blue-900">En progreso</span>
                         <span className="font-medium text-blue-600">
                           {recommendations.filter(rec => (rec.progress || 0) > 0 && (rec.progress || 0) < 100).length}
                         </span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-blue-900">Pendientes</span>
                         <span className="font-medium text-blue-600">
                           {recommendations.filter(rec => (rec.progress || 0) === 0).length}
                         </span>
                       </div>
                     </div>
                    
                                         <Progress 
                       value={(recommendations.filter(rec => (rec.progress || 0) >= 100).length / recommendations.length) * 100} 
                       className="h-3"
                     />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
