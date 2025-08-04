"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  Plus,
  Search,
  Filter,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Share,
  Bell,
  CalendarDays,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  List,
  Grid,
  ArrowRight,
  Star,
  AlertCircle,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Building,
  Navigation,
} from "lucide-react"
import AppointmentModal from "@/modules/appointments/components/appointment-modal"
import AppointmentDetailsModal from "@/modules/appointments/components/appointment-details-modal"
import FiltersModal from "@/components/filters-modal"
import { useAppointments, createAppointment, updateAppointment, removeAppointment } from '@/hooks/use-appointments'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Appointment {
  id: string
  title: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  address: string
  phone: string
  status: string
  type: string
  reason: string
  urgent: boolean
  completed: boolean
  updatedAt?: string
}

export default function AppointmentsPage() {
  const { appointments, isLoading, isError, mutate } = useAppointments()
  
  // Agregar logging para debuggear
  console.log('🔍 AppointmentPage: Estado del hook:', { 
    appointmentsLength: appointments?.length || 0, 
    isLoading, 
    isError 
  })
  console.log('🔍 AppointmentPage: Citas recibidas:', appointments)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day" | "list">("month")
  const [upcomingView, setUpcomingView] = useState<"carousel" | "list">("carousel")
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null)
  const [newDate, setNewDate] = useState<string>("")
  const [newTime, setNewTime] = useState<string>("")
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string | null>(null)
  const [rescheduleError, setRescheduleError] = useState<string | null>(null)

  // Calcular estadísticas
  const stats = {
    total: appointments.length,
    urgent: appointments.filter((apt: Appointment) => apt.urgent).length,
    completed: appointments.filter((apt: Appointment) => apt.completed).length,
    upcoming: appointments.filter((apt: Appointment) => !apt.completed).length,
  }
  
  console.log('📊 AppointmentPage: Estadísticas calculadas:', stats)

  // Próxima cita
  const nextAppointment = appointments
    .filter((apt: Appointment) => !apt.completed)
    .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    
  console.log('📅 AppointmentPage: Próxima cita:', nextAppointment)

  // Calcular tiempo restante para la próxima cita
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    if (nextAppointment) {
      const updateCountdown = () => {
        const now = new Date()
        const appointmentDate = new Date(`${nextAppointment.date} ${nextAppointment.time}`)
        const diff = appointmentDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

          setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
        } else {
          setTimeRemaining("¡Es hora!")
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 60000) // Actualizar cada minuto

      return () => clearInterval(interval)
    }
  }, [nextAppointment])

  // Citas recientes y próximas para el resumen
  const recentAppointments = appointments.filter((apt: Appointment) => apt.completed).slice(0, 3)
  // Cambia upcomingAppointments para que incluya todas las próximas citas ordenadas por fecha:
  const upcomingAppointments = appointments.filter((apt: Appointment) => !apt.completed).sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Doctores frecuentes
  const frequentDoctors = appointments
    .reduce((acc: Array<{ name: string; specialty: string; location: string; count: number }>, apt: Appointment) => {
      const existing = acc.find((doc) => doc.name === apt.doctor)
      if (existing) {
        existing.count++
      } else {
        acc.push({
          name: apt.doctor,
          specialty: apt.specialty,
          location: apt.location,
          count: 1,
        })
      }
      return acc
    }, [])
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 3)

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const getStatusColor = (status: string, urgent: boolean) => {
    if (urgent) return "bg-red-100 text-red-800 border-red-200"
    if (status === "completada") return "bg-green-100 text-green-800 border-green-200"
        return "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getTypeIcon = (type: string | undefined | null) => {
    if (!type) return CalendarIcon
    switch (type.toLowerCase()) {
      case "consulta":
        return Stethoscope
      case "chequeo":
        return Activity
      case "revisión":
        return Eye
      case "urgente":
        return AlertCircle
      default:
        return CalendarIcon
    }
  }

  const nextCarouselSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % upcomingAppointments.length)
  }

  const prevCarouselSlide = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + upcomingAppointments.length) % upcomingAppointments.length)
  }

  const handleCreateAppointment = async (data: Partial<Appointment>) => {
    await createAppointment(data)
    mutate()
    setShowAppointmentModal(false)
  }

  const handleEditAppointment = async (id: string, data: Partial<Appointment>) => {
    await updateAppointment(id, data)
    mutate()
    setShowDetailsModal(false)
  }

  const handleDeleteAppointment = async (id: string) => {
    await removeAppointment(id)
    mutate()
    setShowDetailsModal(false)
  }

  // Agrupa citas por fecha (YYYY-MM-DD)
  const appointmentsByDate = appointments.reduce((acc: Record<string, any[]>, apt: any) => {
    const dateKey = apt.date.slice(0, 10)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(apt)
    return acc
  }, {})

  // Para la lista de próximas citas:
  const topUpcomingAppointments = upcomingAppointments.slice(0, 4)
  // Para la lista de doctores frecuentes:
  const topFrequentDoctors = frequentDoctors.slice(0, 4)

  // Para la lista de citas recientes:
  const topRecentAppointments = appointments
    .filter((apt: Appointment) => apt.completed)
    .sort((a: Appointment, b: Appointment) => new Date(b.updatedAt || b.date).getTime() - new Date(a.updatedAt || a.date).getTime())
    .slice(0, 4)

  const openReschedule = (apt: Appointment) => {
    setRescheduleAppointment(apt)
    setNewDate(apt.date.slice(0, 10))
    setNewTime(apt.date.slice(11, 16))
    setShowRescheduleModal(true)
  }
  const handleReschedule = async () => {
    if (!rescheduleAppointment) return
    setRescheduleLoading(true)
    setRescheduleSuccess(null)
    setRescheduleError(null)
    try {
      const newDateTime = new Date(`${newDate}T${newTime}`)
      await updateAppointment(rescheduleAppointment.id, { date: newDateTime.toISOString() })
      setRescheduleSuccess("Cita reprogramada exitosamente.")
      mutate()
      setTimeout(() => setShowRescheduleModal(false), 1200)
    } catch (e) {
      setRescheduleError("Error al reprogramar la cita.")
    } finally {
      setRescheduleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-none mx-auto space-y-6">
        {/* Header Mejorado con Animaciones */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
        <div>
                  <h1 className="text-3xl font-bold">¡Hola María! 👋</h1>
                  <p className="text-white/80 text-lg">
                    Tienes <span className="font-bold text-yellow-300">{stats.upcoming}</span> citas próximas programadas
                  </p>
                </div>
              </div>
              
              {/* Estado de citas con animación */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Estado: Organizado</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Última actualización: {new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span>
                </div>
              </div>
        </div>
            
            <div className="flex flex-col items-end space-y-4">
              {/* Acciones rápidas mejoradas */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowAppointmentModal(true)} 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
            <Share className="w-4 h-4 mr-2" />
            Compartir
          </Button>
              </div>
              
              {/* Indicadores rápidos */}
              <div className="flex space-x-3">
                <div className="bg-white/20 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-xs text-white/80">Citas Hoy</p>
                  <p className="text-lg font-bold">2</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-xs text-white/80">Esta Semana</p>
                  <p className="text-lg font-bold">5</p>
                </div>
              </div>
            </div>
        </div>
      </div>

        {/* Próxima Cita Destacada - Mejorada */}
      {nextAppointment && (
  (() => {
    const TypeIcon = getTypeIcon(nextAppointment.type)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-8">
        {/* Info principal */}
        <Card className="flex flex-col justify-between border-0 shadow-xl bg-white/90 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <TypeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">{nextAppointment.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <User className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-700">{nextAppointment.doctor}</span>
                <span className="text-sm text-blue-500">{nextAppointment.specialty}</span>
                {nextAppointment.urgent && (
                  <Badge className="bg-red-500 text-white animate-pulse ml-2">Urgente</Badge>
                )}
                {nextAppointment.completed && (
                  <Badge className="bg-green-500 text-white ml-2">Completada</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-100 bg-blue-50">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-600">Fecha</p>
                <p className="font-semibold text-blue-900">
                  {new Date(nextAppointment.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-100 bg-green-50">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-600">Hora</p>
                <p className="font-semibold text-green-900">{nextAppointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-100 bg-red-50">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-gray-600">Ubicación</p>
                <p className="font-semibold text-red-900">
                  {nextAppointment.location || "—"}
                  {nextAppointment.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextAppointment.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 underline text-xs text-blue-600 hover:text-blue-800"
                    >
                      Ver mapa
                    </a>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-purple-100 bg-purple-50">
              <Phone className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-gray-600">Teléfono</p>
                <p className="font-semibold text-purple-900">
                  {nextAppointment.phone || "—"}
                  {nextAppointment.phone && (
                    <a href={`tel:${nextAppointment.phone}`} className="ml-2 underline text-xs text-blue-600 hover:text-blue-800">Llamar</a>
                  )}
                </p>
              </div>
            </div>
          </div>
          {nextAppointment.reason && (
            <div className="p-4 rounded-lg border border-gray-100 bg-gray-50 mb-4">
              <p className="text-xs text-gray-600 mb-1">Motivo / Notas</p>
              <p className="text-gray-800 text-sm">{nextAppointment.reason}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
            <Button onClick={() => openAppointmentDetails(nextAppointment)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Eye className="w-4 h-4 mr-2" /> Ver Detalles
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => openReschedule(nextAppointment)}>
              <CalendarIcon className="w-4 h-4 mr-2" /> Reprogramar
            </Button>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <Bell className="w-4 h-4 mr-2" /> Recordatorio
            </Button>
            {nextAppointment.location && (
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50" asChild>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextAppointment.location)}`} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4 mr-2" /> Direcciones
                </a>
              </Button>
            )}
          </div>
        </Card>
        {/* Tarjeta de tiempo restante */}
        <Card className="flex flex-col items-center justify-center border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Tiempo Restante</h4>
          <div className="text-4xl font-bold text-blue-600 mb-4">{timeRemaining}</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: timeRemaining === "¡Es hora!" ? "100%" : "75%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-4">¡No olvides llegar 15 minutos antes!</p>
          <div className="flex items-center justify-center space-x-2 text-yellow-600">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Cita confirmada</span>
          </div>
        </Card>
      </div>
    )
  })()
)}

        {/* Estadísticas Mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-sm font-medium text-blue-800">Citas Totales</div>
              <div className="text-xs text-blue-600 mt-1">Último mes</div>
          </CardContent>
        </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.urgent}</div>
              <div className="text-sm font-medium text-red-800">Citas Urgentes</div>
              <div className="text-xs text-red-600 mt-1">Requieren atención</div>
          </CardContent>
        </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
              <div className="text-sm font-medium text-green-800">Completadas</div>
              <div className="text-xs text-green-600 mt-1">Este mes</div>
          </CardContent>
        </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.upcoming}</div>
              <div className="text-sm font-medium text-purple-800">Próximas</div>
              <div className="text-xs text-purple-600 mt-1">Programadas</div>
          </CardContent>
        </Card>
      </div>

        {/* Resumen de Secciones Mejorado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citas Recientes */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              Citas Recientes
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
            {topRecentAppointments.map((appointment: Appointment, idx: number) => (
                <div key={appointment.id} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-xs text-green-600 font-medium">
                      {new Date(appointment.date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completada
                  </Badge>
              </div>
            ))}
              <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50 group">
              Ver todas las citas pasadas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Próximas Citas */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              Próximas Citas
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
            {topUpcomingAppointments.map((appointment: Appointment, idx: number) => {
              const daysUntil = Math.ceil(
                (new Date(appointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              return (
                  <div key={appointment.id} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                  <div className="flex-1">
                      <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-xs text-blue-600 font-medium">En {daysUntil} días</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status, appointment.urgent)}>
                      {appointment.urgent ? (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgente
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Próxima
                        </>
                      )}
                  </Badge>
                </div>
              )
            })}
              <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50 group">
              Ver todas las citas futuras
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Doctores Frecuentes */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              Doctores Frecuentes
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
            {topFrequentDoctors.map((doctor: { name: string; specialty: string; location: string; count: number }, index: number) => (
                <div key={index} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="text-xs text-purple-600 font-medium">{doctor.location}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {doctor.count} citas
                  </Badge>
              </div>
            ))}
              <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50 group">
              Ver todos los doctores
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

        {/* Calendario Mejorado */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-blue-900">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              Calendario de Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Calendario grande y centrado */}
              <div className="flex-1 flex h-full">
                <div className="w-full h-full p-8 bg-white rounded-2xl shadow-md flex items-center justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      hasAppointments: (date: Date) => {
                        const key = date.toISOString().slice(0, 10)
                        return !!appointmentsByDate[key]
                      }
                    }}
                    modifiersClassNames={{
                      hasAppointments: "bg-blue-100 border border-blue-400"
                    }}
                    className="text-lg w-full h-full grid grid-cols-7 gap-2"
                    style={{
                      background: '#fff',
                      borderRadius: '1.25rem',
                      padding: '2rem',
                      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)'
                    }}
                  />
                </div>
              </div>
              {/* Lista de citas del día */}
              <div className="flex-1 w-full">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Citas para el {selectedDate ? selectedDate.toLocaleDateString() : 'día seleccionado'}</h3>
                <div className="space-y-4">
                  {(selectedDate && appointmentsByDate[selectedDate.toISOString().slice(0, 10)]) ? (
                    appointmentsByDate[selectedDate.toISOString().slice(0, 10)].map((apt: any) => (
                      <div key={apt.id} className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-blue-800 mb-1 truncate">{apt.title}</h4>
                          <div className="text-sm text-gray-700 mb-1 truncate">{apt.doctor} - {apt.specialty}</div>
                          <div className="text-xs text-gray-500">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-fit">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{apt.status}</span>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 mt-2" onClick={() => openAppointmentDetails(apt)}>
                            <Eye className="w-4 h-4 mr-1" /> Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-8">No hay citas para este día.</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citas Próximas - Carrusel/Lista Mejorado */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl">Tus Próximas Citas</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={upcomingView === "carousel" ? "default" : "outline"}
                onClick={() => setUpcomingView("carousel")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Grid className="w-4 h-4 mr-1" />
                Carrusel
              </Button>
              <Button
                size="sm"
                variant={upcomingView === "list" ? "default" : "outline"}
                onClick={() => setUpcomingView("list")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <List className="w-4 h-4 mr-1" />
                Lista
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingView === "carousel" ? (
            <div className="relative">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No tienes próximas citas.</div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevCarouselSlide}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      {upcomingAppointments[currentCarouselIndex] && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-lg">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-green-900 mb-2">
                                {upcomingAppointments[currentCarouselIndex].title}
                              </h3>
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-green-800">
                                    {upcomingAppointments[currentCarouselIndex].doctor}
                                  </p>
                                  <p className="text-green-600">
                                    {upcomingAppointments[currentCarouselIndex].specialty}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="w-4 h-4 text-green-500" />
                                  <span className="font-medium">
                                    {new Date(upcomingAppointments[currentCarouselIndex].date).toLocaleDateString("es-ES")}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-green-500" />
                                  <span className="font-medium">{upcomingAppointments[currentCarouselIndex].time}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor("próxima", upcomingAppointments[currentCarouselIndex].urgent)}>
                              {upcomingAppointments[currentCarouselIndex].urgent ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Urgente
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Próxima
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              onClick={() => openAppointmentDetails(upcomingAppointments[currentCarouselIndex])}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Button>
                            <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Reprogramar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextCarouselSlide}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex justify-center space-x-2 mt-6">
                  {upcomingAppointments.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentCarouselIndex
                          ? "bg-green-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => setCurrentCarouselIndex(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No tienes próximas citas.</div>
                ) : (
                  upcomingAppointments.map((appointment: Appointment, idx: number) => (
                    <div
                      key={appointment.id}
                      className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{appointment.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {appointment.doctor} - {appointment.specialty}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          {new Date(appointment.date).toLocaleDateString("es-ES")} a las {appointment.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(appointment.status, appointment.urgent)}>
                          {appointment.urgent ? (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgente
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Próxima
                            </>
                          )}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAppointmentDetails(appointment)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Modales */}
      <AppointmentModal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />

      <AppointmentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        appointment={selectedAppointment}
      />

      <FiltersModal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} />

      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogramar Cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nueva Fecha</label>
              <input type="date" className="border rounded px-3 py-2 w-full" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nueva Hora</label>
              <input type="time" className="border rounded px-3 py-2 w-full" value={newTime} onChange={e => setNewTime(e.target.value)} />
            </div>
            {rescheduleSuccess && <div className="text-green-600 text-sm">{rescheduleSuccess}</div>}
            {rescheduleError && <div className="text-red-600 text-sm">{rescheduleError}</div>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>Cancelar</Button>
              <Button onClick={handleReschedule} disabled={rescheduleLoading}>
                {rescheduleLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
