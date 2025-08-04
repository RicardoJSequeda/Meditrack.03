"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Heart,
  Pill,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  MessageCircle,
  Video,
  Phone,
  AlertTriangle,
  Target,
  BarChart3,
  CalendarIcon,
  Thermometer,
  Droplets,
  Weight,
  Eye,
  Stethoscope,
  X,
} from "lucide-react"
import HealthMetricsModal from "@/components/health-metrics-modal"
import DetailedReportModal from "@/components/detailed-report-modal"
import DoctorChatModal from "@/components/doctor-chat-modal"
import TelemedicineModal from "@/components/telemedicine-modal"
import AppointmentModal from "@/modules/appointments/components/appointment-modal"
import HealthCalendar from "@/components/health-calendar"
import { useHydration } from "@/hooks/use-hydration"
import { WelcomeMessage } from "@/components/welcome-message"

interface Doctor {
  id: number
  name: string
  specialty: string
  avatar: string
  online: boolean
  lastMessage: string
  timestamp: string
}

export default function Dashboard() {
  const mounted = useHydration()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMetricsModal, setShowMetricsModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState("")
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  useEffect(() => {
    if (!mounted) return
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [mounted])



  // Datos simulados
  const healthMetrics = {
    bloodPressure: { systolic: 120, diastolic: 80, timestamp: "Hace 2 horas" },
    glucose: { value: 95, timestamp: "Hace 4 horas" },
    weight: { value: 68.5, timestamp: "Esta mañana" },
    temperature: { value: 36.8, timestamp: "Hace 1 hora" },
    oxygen: { value: 98, timestamp: "Hace 3 horas" },
  }

  const adherenceData = { percentage: 95, taken: 19, total: 20 }
  const bloodPressureData = [
    { day: "Lun", systolic: 118, diastolic: 78 },
    { day: "Mar", systolic: 122, diastolic: 82 },
    { day: "Mié", systolic: 120, diastolic: 80 },
    { day: "Jue", systolic: 115, diastolic: 75 },
    { day: "Vie", systolic: 119, diastolic: 79 },
    { day: "Sáb", systolic: 121, diastolic: 81 },
    { day: "Dom", systolic: 120, diastolic: 80 },
  ]

  const activityData = [
    { day: "Lun", steps: 8500, calories: 320 },
    { day: "Mar", steps: 7200, calories: 280 },
    { day: "Mié", steps: 9100, calories: 350 },
    { day: "Jue", steps: 6800, calories: 260 },
    { day: "Vie", steps: 8900, calories: 340 },
    { day: "Sáb", steps: 10200, calories: 390 },
    { day: "Dom", steps: 7500, calories: 290 },
  ]

  const healthTrends = {
    bloodPressure: { change: -5, status: "mejorando" },
    weight: { change: -2.3, status: "perdiendo" },
    activity: { change: -8, status: "bajando" },
    sleep: { change: 12, status: "mejorando" },
  }

  const alerts = [
    { id: 1, type: "high", message: "Glucosa elevada detectada", priority: "Alta" },
    { id: 2, type: "medium", message: "Presión arterial en aumento", priority: "Media" },
    { id: 3, type: "info", message: "Actividad física por debajo del objetivo", priority: "Info" },
  ]

  const healthPredictions = [
    { condition: "Riesgo de hipertensión", percentage: 25, level: "bajo" },
    { condition: "Riesgo de diabetes", percentage: 60, level: "medio" },
    { condition: "Salud cardiovascular", percentage: 85, level: "excelente" },
  ]

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dra. García",
      specialty: "Cardiología",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      lastMessage: "Sus resultados se ven bien",
      timestamp: "Hace 2h",
    },
    {
      id: 2,
      name: "Dr. López",
      specialty: "Medicina General",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      lastMessage: "Recuerde tomar su medicamento",
      timestamp: "Ayer",
    },
    {
      id: 3,
      name: "Dra. Martínez",
      specialty: "Endocrinología",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      lastMessage: "Programemos una cita",
      timestamp: "Hace 1h",
    },
  ]

  const openDetailedReport = (reportType: string) => {
    if (reportType === "reportes") {
      // Navegar a la página completa de reportes
      router.push("/reports")
    } else {
      // Abrir modal de reporte específico
    setSelectedReport(reportType)
    setShowReportModal(true)
    }
  }

  const openDoctorChat = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowChatModal(true)
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPredictionColor = (level: string) => {
    switch (level) {
      case "bajo":
        return "text-green-600"
      case "medio":
        return "text-yellow-600"
      case "alto":
        return "text-red-600"
      case "excelente":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6 w-full">
      <div className="max-w-none mx-auto space-y-6">
        {/* Header Personalizado Mejorado */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
            <div>
                  <WelcomeMessage className="text-white" />
                  <p className="text-white/80 text-sm">
                    {mounted ? currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                    }) : "Cargando fecha..."}
              </p>
            </div>
              </div>
              
              {/* Estado de salud con animación */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Estado: Saludable</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Última actualización: {mounted ? currentTime.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "--:--"}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-4">
              {/* Acciones rápidas mejoradas */}
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowMetricsModal(true)} 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Medición
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() => setShowAppointmentModal(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar Cita
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() => openDetailedReport("reportes")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Reportes
                </Button>
              </div>
              
              {/* Indicadores de salud rápida */}
              <div className="flex space-x-2">
                <div className="bg-white/20 px-3 py-2 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-xs text-white/80">Ritmo Cardíaco</p>
                  <p className="text-lg font-bold">72 BPM</p>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-xs text-white/80">Pasos Hoy</p>
                  <p className="text-lg font-bold">8,547</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Salud - Mediciones Recientes Mejoradas */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              Resumen de Tu Salud
            </CardTitle>
            <CardDescription className="text-gray-600">Tus mediciones más recientes con análisis inteligente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Presión Arterial */}
              <div 
                className="group relative bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openDetailedReport("presion")}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-200">
                    <X className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-700">Presión Arterial</p>
                  <p className="text-2xl font-bold text-red-900">
                    {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
                  </p>
                  <div className="text-xs text-red-600 flex items-center">
                    <div className="w-1 h-1 bg-red-500 rounded-full mr-1"></div>
                    {healthMetrics.bloodPressure.timestamp}
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Normal</span>
                  </div>
                </div>
              </div>

              {/* Glucosa */}
              <div 
                className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openDetailedReport("glucosa")}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-200">
                    <X className="w-3 h-3 text-blue-600" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">Glucosa</p>
                  <p className="text-2xl font-bold text-blue-900">{healthMetrics.glucose.value} mg/dL</p>
                  <div className="text-xs text-blue-600 flex items-center">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                    {healthMetrics.glucose.timestamp}
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-yellow-600">Elevada</span>
                  </div>
                </div>
              </div>

              {/* Peso */}
              <div 
                className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openDetailedReport("peso")}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-200">
                    <X className="w-3 h-3 text-purple-600" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Weight className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-700">Peso</p>
                  <p className="text-2xl font-bold text-purple-900">{healthMetrics.weight.value} kg</p>
                  <div className="text-xs text-purple-600 flex items-center">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mr-1"></div>
                    {healthMetrics.weight.timestamp}
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Perdiendo</span>
                  </div>
                </div>
              </div>

              {/* Temperatura */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-orange-200">
                    <X className="w-3 h-3 text-orange-600" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-700">Temperatura</p>
                  <p className="text-2xl font-bold text-orange-900">{healthMetrics.temperature.value}°C</p>
                  <div className="text-xs text-orange-600 flex items-center">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mr-1"></div>
                    {healthMetrics.temperature.timestamp}
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Normal</span>
                  </div>
                </div>
              </div>

              {/* Oxígeno */}
              <div className="group relative bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-200">
                    <X className="w-3 h-3 text-green-600" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-700">Oxígeno</p>
                  <p className="text-2xl font-bold text-green-900">{healthMetrics.oxygen.value}%</p>
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                    {healthMetrics.oxygen.timestamp}
                  </div>
                  <div className="mt-2 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Excelente</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos Pequeños Mejorados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Adherencia a Medicamentos */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50"
            onClick={() => openDetailedReport("adherencia")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                Adherencia a Medicamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#greenGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${adherenceData.percentage * 2.51} 251`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">{adherenceData.percentage}%</span>
                    <span className="text-xs text-gray-500">Completado</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dosis tomadas</span>
                  <span className="text-sm font-semibold text-green-600">{adherenceData.taken}/{adherenceData.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${adherenceData.percentage}%` }}
                  ></div>
              </div>
              <p className="text-center text-sm text-gray-600">
                  Esta semana
              </p>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-green-600 hover:bg-green-50">
                Ver informe detallado →
              </Button>
            </CardContent>
          </Card>

          {/* Presión Arterial */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50"
            onClick={() => openDetailedReport("presion")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                Presión Arterial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {bloodPressureData.slice(-4).map((day, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{day.day}</span>
                      <span className="text-sm font-bold text-red-600">
                        {day.systolic}/{day.diastolic}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out group-hover:scale-105"
                        style={{ width: `${(day.systolic / 160) * 100}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Promedio semanal</span>
                  <span className="text-lg font-bold text-red-600">119/79 mmHg</span>
                </div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">Dentro del rango normal</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-red-600 hover:bg-red-50">
                Ver informe detallado →
              </Button>
            </CardContent>
          </Card>

          {/* Actividad Física */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50"
            onClick={() => openDetailedReport("actividad")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Actividad Física
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {activityData.slice(-4).map((day, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{day.day}</span>
                      <span className="text-sm font-bold text-blue-600">{day.steps.toLocaleString()}</span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out group-hover:scale-105"
                          style={{ width: `${(day.steps / 12000) * 100}%` }}
                        />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{day.calories} cal</span>
                      <span className="text-xs text-blue-600">
                        {day.steps >= 10000 ? "🎯 Meta alcanzada" : `${Math.round((day.steps / 10000) * 100)}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Total semanal</span>
                  <span className="text-lg font-bold text-blue-600">58,200 pasos</span>
                </div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12% vs semana anterior</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:bg-blue-50">
                Ver informe detallado →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Métricas Avanzadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tendencias de Salud */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Tendencias de Salud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(healthTrends).map(([key, trend]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <div className="flex items-center space-x-2">
                    {trend.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {trend.change > 0 ? "+" : ""}
                      {trend.change}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertas Inteligentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Alertas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant="outline" className="text-xs">
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Predicciones de Salud */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Predicciones de Salud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthPredictions.map((prediction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{prediction.condition}</span>
                    <span className={`text-sm font-medium ${getPredictionColor(prediction.level)}`}>
                      {prediction.percentage}%
                    </span>
                  </div>
                  <Progress value={prediction.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Calendario de Salud y Comunicación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendario de Salud */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Calendario de Salud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HealthCalendar />
            </CardContent>
          </Card>

          {/* Chat con Médicos Mejorado */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                Chat con Médicos
              </CardTitle>
              <CardDescription className="text-gray-600">Comunícate directamente con tu equipo médico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group relative bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                  <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                      <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          doctor.online ? "bg-green-500 animate-pulse" : "bg-gray-400"
                        }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{doctor.name}</p>
                        <Badge 
                          variant={doctor.online ? "default" : "secondary"} 
                          className={`text-xs ${doctor.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {doctor.online ? "En línea" : "Desconectado"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{doctor.specialty}</p>
                      <p className="text-sm text-gray-700 truncate mb-1">{doctor.lastMessage}</p>
                      <div className="text-xs text-gray-400 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-1"></div>
                        {doctor.timestamp}
                      </div>
                  </div>
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation()
                          openDoctorChat(doctor)
                        }}
                        className="bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 transition-colors"
                      >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors"
                      >
                      <Phone className="w-3 h-3 mr-1" />
                      Llamar
                    </Button>
                  </div>
                  </div>
                  
                  {/* Indicador de mensajes no leídos */}
                  {doctor.online && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
              
              {/* Botón para agregar nuevo médico */}
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center justify-center space-x-2 text-gray-500 group-hover:text-green-600">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Agregar nuevo médico</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Telemedicina Mejorada */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              Telemedicina
            </CardTitle>
            <CardDescription className="text-gray-600">Consultas virtuales y seguimiento médico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Próxima Consulta Virtual */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  <div>
                      <h3 className="font-semibold text-purple-900 text-lg">Próxima Consulta Virtual</h3>
                    <p className="text-sm text-purple-700">Dra. García - En 2 horas</p>
                    <p className="text-xs text-purple-600">Cardiología - Seguimiento</p>
                  </div>
                </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-700">Tiempo restante:</span>
                      <span className="text-lg font-bold text-purple-900">01:47:32</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => setShowTelemedicineModal(true)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Unirse Ahora
                </Button>
                </div>
              </div>

              {/* Consultas Programadas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Consultas Programadas
                </h3>
              <div className="space-y-3">
                  <div className="group bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">DL</span>
                        </div>
                    <div>
                          <p className="text-sm font-semibold text-gray-900">Dr. López</p>
                          <p className="text-xs text-gray-600">Medicina General</p>
                          <p className="text-xs text-blue-600 font-medium">Mañana 10:00 AM</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Video className="w-3 h-3 mr-1" />
                        Unirse
                      </Button>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">DM</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Dra. Martínez</p>
                          <p className="text-xs text-gray-600">Endocrinología</p>
                          <p className="text-xs text-green-600 font-medium">Viernes 3:00 PM</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                      <Video className="w-3 h-3 mr-1" />
                      Unirse
                    </Button>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">DP</span>
                        </div>
                    <div>
                          <p className="text-sm font-semibold text-gray-900">Dr. Pérez</p>
                          <p className="text-xs text-gray-600">Dermatología</p>
                          <p className="text-xs text-orange-600 font-medium">Lunes 11:30 AM</p>
                        </div>
                    </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white hover:bg-orange-50 border-orange-200 text-orange-700 hover:text-orange-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                      <Video className="w-3 h-3 mr-1" />
                      Unirse
                    </Button>
                    </div>
                  </div>
                </div>
                
                {/* Botón para programar nueva consulta */}
                <div className="mt-4 p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-center space-x-2 text-purple-600 group-hover:text-purple-700">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Programar nueva consulta</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      <HealthMetricsModal isOpen={showMetricsModal} onClose={() => setShowMetricsModal(false)} />

      <DetailedReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType={selectedReport}
      />

      <DoctorChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} doctor={selectedDoctor} />

      <TelemedicineModal isOpen={showTelemedicineModal} onClose={() => setShowTelemedicineModal(false)} />

      <AppointmentModal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />
    </div>
  )
}
