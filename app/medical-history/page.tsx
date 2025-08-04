"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Plus,
  FileText,
  Stethoscope,
  Pill,
  Calendar,
  User,
  Heart,
  Activity,
  AlertTriangle,
  Clock,
  Download,
  Edit,
  Eye,
  BarChart3,
  FileImage,
  Syringe,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  CalendarDays,
  FileCheck,
} from "lucide-react"
import MedicalRecordModal from "@/components/medical-record-modal"
import { useDiagnoses } from '@/hooks/use-diagnoses'
import { useTreatments } from '@/hooks/use-treatments'
import { useMedicalEvents } from '@/hooks/use-medical-events'
import { useMedicalDocuments } from '@/hooks/use-medical-documents'
import { useMedicalStats } from '@/hooks/use-medical-stats'
import { usePatientInfo } from '@/hooks/use-patient-info'
import { MedicalStatsCard } from '@/components/medical-stats-card'
import { MedicalStatsSkeleton } from '@/components/medical-stats-skeleton'
import { PatientInfoSkeleton } from '@/components/patient-info-skeleton'
import PatientInfoEditModal from '@/components/patient-info-edit-modal'

interface PatientInfo {
  name: string
  age: number
  gender: string
  bloodType: string
  medicalId: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  stats: {
    diagnoses: number
    treatments: number
    events: number
    documents: number
  }
}

interface Diagnosis {
  id: string
  condition: string
  diagnosedDate: string
  doctor: string
  specialty: string
  severity: "Leve" | "Moderada" | "Grave"
  status: "Activa" | "Controlada" | "Resuelta"
  lastReading: string
  nextCheckup: string
  notes: string
  relatedTreatments: string[]
}

interface Treatment {
  id: string
  medication: string
  diagnosis: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  adherence: number
  status: "Activo" | "Suspendido" | "Completado"
  sideEffects: string[]
  doctorNotes: string
  prescribedBy: string
}

interface MedicalEvent {
  id: string
  type: "Cirugía" | "Emergencia" | "Vacuna" | "Consulta" | "Hospitalización" | "Procedimiento"
  title: string
  date: string
  location: string
  doctor: string
  description: string
  outcome: string
  documents: string[]
  followUp?: string
}

interface MedicalDocument {
  id: string
  type: "Análisis" | "Radiografía" | "Informe" | "Receta" | "Certificado" | "Nota"
  title: string
  date: string
  doctor: string
  category: string
  description: string
  fileUrl?: string
  results?: string
  recommendations?: string
}

export default function MedicalHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [filterDoctor, setFilterDoctor] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditPatientModal, setShowEditPatientModal] = useState(false)

  // Datos dinámicos del paciente
  const { patientInfo, isLoading: loadingPatientInfo, error: patientError, mutate: mutatePatientInfo } = usePatientInfo()

  // Datos simulados de diagnósticos
  const { diagnoses, isLoading: loadingDiagnoses } = useDiagnoses()
  const { treatments, isLoading: loadingTreatments } = useTreatments()
  const { medicalEvents, isLoading: loadingEvents } = useMedicalEvents()
  const { medicalDocuments, isLoading: loadingDocuments } = useMedicalDocuments()

  // Estadísticas de salud
  const stats = {
    diagnoses: diagnoses.length,
    treatments: treatments.length,
    events: medicalEvents.length,
    documents: medicalDocuments.length,
    medicationAdherence: treatments.length
      ? Math.round(
          treatments.reduce((acc: number, t: any) => acc + (t.adherence || 0), 0) / treatments.length
        )
      : 0,
    overallHealth: 85, // Puedes calcularlo según tus reglas o dejarlo fijo
    controlledConditions: diagnoses.filter((d: any) => d.status === "Controlada" || d.status === "Controlado").length,
    toMonitor: diagnoses.filter((d: any) => d.status === "Activa" || d.status === "Activo").length,
    completedTreatments: treatments.filter((t: any) => t.status === "Completado").length,
    activeTreatments: treatments.filter((t: any) => t.status === "Activo").length,
    analysisDocs: medicalDocuments.filter((d: any) => d.type === "Análisis").length,
    otherDocs: medicalDocuments.filter((d: any) => d.type !== "Análisis").length,
  }

  // Función para guardar información del paciente
  const handleSavePatientInfo = async (data: Partial<PatientInfo>) => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if (!token || !userId) {
        throw new Error('No hay token de autenticación o userId')
      }

      const response = await fetch(`/api/patient-info?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error actualizando información del paciente')
      }

      // Recargar datos del paciente
      await mutatePatientInfo()
    } catch (error) {
      console.error('Error guardando información del paciente:', error)
      throw error
    }
  }

  // Filtrar datos según búsqueda y filtros (optimizado con useCallback)
  const filterData = useCallback((data: any[], type: string) => {
    let filtered = data

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) => 
          value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ),
      )
    }

    // Filtro por tipo
    if (filterType !== "all" && filterType !== type) {
      return []
    }

    // Filtro por fecha
    if (filterDate !== "all") {
      const now = new Date()

      switch (filterDate) {
        case "today":
          filtered = filtered.filter((item) => {
            const dateStr = item.date || item.diagnosedDate || item.startDate
            if (!dateStr) return false
            const date = new Date(dateStr)
            return date.toDateString() === now.toDateString()
          })
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((item) => {
            const dateStr = item.date || item.diagnosedDate || item.startDate
            if (!dateStr) return false
            const date = new Date(dateStr)
            return date >= weekAgo
          })
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((item) => {
            const dateStr = item.date || item.diagnosedDate || item.startDate
            if (!dateStr) return false
            const date = new Date(dateStr)
            return date >= monthAgo
          })
          break
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((item) => {
            const dateStr = item.date || item.diagnosedDate || item.startDate
            if (!dateStr) return false
            const date = new Date(dateStr)
            return date >= yearAgo
          })
          break
      }
    }

    return filtered
  }, [searchTerm, filterType, filterDate])

  // Datos filtrados memoizados
  const filteredDiagnoses = useMemo(() => filterData(diagnoses, "diagnoses"), [filterData, diagnoses])
  const filteredTreatments = useMemo(() => filterData(treatments, "treatments"), [filterData, treatments])
  const filteredEvents = useMemo(() => filterData(medicalEvents, "events"), [filterData, medicalEvents])
  const filteredDocuments = useMemo(() => filterData(medicalDocuments, "documents"), [filterData, medicalDocuments])

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case "Leve":
        return "bg-green-100 text-green-800 border-green-200"
      case "Moderada":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Grave":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Activa":
      case "Activo":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Controlada":
      case "Controlado":
        return "bg-green-100 text-green-800 border-green-200"
      case "Resuelta":
      case "Completado":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Suspendido":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }, [])

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "Cirugía":
        return <Stethoscope className="w-4 h-4" />
      case "Emergencia":
        return <AlertTriangle className="w-4 h-4" />
      case "Vacuna":
        return <Syringe className="w-4 h-4" />
      case "Consulta":
        return <User className="w-4 h-4" />
      case "Hospitalización":
        return <Heart className="w-4 h-4" />
      case "Procedimiento":
        return <Activity className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "Análisis":
        return <BarChart3 className="w-4 h-4" />
      case "Radiografía":
        return <FileImage className="w-4 h-4" />
      case "Informe":
        return <FileText className="w-4 h-4" />
      case "Receta":
        return <Pill className="w-4 h-4" />
      case "Certificado":
        return <Shield className="w-4 h-4" />
      case "Nota":
        return <Edit className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleViewDetails = useCallback((record: any, type: string) => {
    setSelectedRecord({ ...record, type })
    setShowDetailsModal(true)
  }, [])

  const handleExportData = useCallback((format: string) => {
    const data = {
      patient: patientInfo,
      diagnoses: diagnoses,
      treatments: treatments,
      events: medicalEvents,
      documents: medicalDocuments,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `historial-medico-${patientInfo?.name?.replace(/\s+/g, "-") || "usuario"}-${new Date().toISOString().split("T")[0]}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }, [patientInfo, diagnoses, treatments, medicalEvents, medicalDocuments])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header Mejorado con Gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">📋 Historial Médico</h1>
                <p className="text-blue-100 mt-1">Tu biblioteca médica personal completa</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowAddModal(true)} 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Registro
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportData("json")}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard de Salud con Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {(() => {
          const { stats, isLoading, error } = useMedicalStats()
          
          if (isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
              <MedicalStatsSkeleton key={index} />
            ))
          }
          
          if (error || !stats) {
            return (
              <div className="col-span-full text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Error al cargar las estadísticas</p>
              </div>
            )
          }
          
          return (
            <>
              {/* Salud General */}
              <MedicalStatsCard
                title="Salud General"
                icon={Heart}
                mainValue={`${stats.generalHealth.percentage}%`}
                subtitle="Estado general de salud"
                percentage={stats.generalHealth.percentage}
                status={stats.generalHealth.status}
                statusColor={
                  stats.generalHealth.status === 'Excelente' ? 'success' :
                  stats.generalHealth.status === 'Bueno' ? 'info' :
                  stats.generalHealth.status === 'Regular' ? 'warning' : 'danger'
                }
                subMetrics={[
                  {
                    label: 'Controladas',
                    value: stats.generalHealth.controlled,
                    color: 'text-green-600'
                  },
                  {
                    label: 'Monitorear',
                    value: stats.generalHealth.monitoring,
                    color: 'text-orange-600'
                  }
                ]}
              />

              {/* Adherencia */}
              <MedicalStatsCard
                title="Adherencia"
                icon={Pill}
                mainValue={`${stats.adherence.percentage}%`}
                subtitle="Cumplimiento de tratamientos"
                percentage={stats.adherence.percentage}
                status={stats.adherence.status}
                statusColor={
                  stats.adherence.status === 'Activo' ? 'success' :
                  stats.adherence.status === 'Regular' ? 'warning' : 'danger'
                }
                subMetrics={[
                  {
                    label: 'Activos',
                    value: stats.adherence.active,
                    color: 'text-blue-600'
                  },
                  {
                    label: 'Completados',
                    value: stats.adherence.completed,
                    color: 'text-gray-600'
                  }
                ]}
              />

              {/* Eventos */}
              <MedicalStatsCard
                title="Eventos"
                icon={Activity}
                mainValue={stats.events.total}
                subtitle="Actividad médica reciente"
                status={stats.events.status}
                statusColor={
                  stats.events.status === 'Reciente' ? 'success' :
                  stats.events.status === 'Actualizado' ? 'info' : 'warning'
                }
                details={[
                  {
                    label: 'Última cita',
                    value: stats.events.lastAppointment,
                    icon: CalendarDays,
                    color: 'text-green-600'
                  },
                  {
                    label: 'Próximo control',
                    value: stats.events.nextCheckup,
                    icon: Clock,
                    color: 'text-blue-600'
                  }
                ]}
              />

              {/* Documentos */}
              <MedicalStatsCard
                title="Documentos"
                icon={FileCheck}
                mainValue={stats.documents.total}
                subtitle="Documentación médica"
                status={stats.documents.status}
                statusColor={
                  stats.documents.status === 'Completo' ? 'success' :
                  stats.documents.status === 'Actualizado' ? 'info' : 'warning'
                }
                subMetrics={[
                  {
                    label: 'Análisis',
                    value: stats.documents.analysis,
                    color: 'text-orange-600'
                  },
                  {
                    label: 'Otros',
                    value: stats.documents.others,
                    color: 'text-orange-600'
                  }
                ]}
              />
            </>
          )
        })()}
      </div>

      {/* Información del Paciente Mejorada */}
      <Card className="bg-gradient-to-r from-white to-blue-50 border-blue-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
                Información del Paciente
              </CardTitle>
              <CardDescription className="text-blue-100">Tu tarjeta de identidad médica personalizada</CardDescription>
            </div>
            {patientInfo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditPatientModal(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loadingPatientInfo ? (
            <PatientInfoSkeleton />
          ) : patientError ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Error al cargar la información del paciente</p>
            </div>
          ) : patientInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Perfil Principal */}
              <div className="lg:col-span-1">
                <div className="text-center space-y-4">
                  <div className="relative mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{patientInfo.name}</h3>
                    <p className="text-gray-600 mb-3">
                      {patientInfo.age} años • {patientInfo.gender}
                    </p>
                    <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 text-sm">
                      🩸 Tipo: {patientInfo.bloodType}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Información de Contacto
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{patientInfo.phone}</p>
                        <p className="text-xs text-gray-500">Teléfono principal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <Mail className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{patientInfo.email}</p>
                        <p className="text-xs text-gray-500">Correo electrónico</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{patientInfo.address}</p>
                        <p className="text-xs text-gray-500">Dirección</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Identificación Médica */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Identificación Médica
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">ID Médico</p>
                      <p className="font-mono text-sm bg-white p-2 rounded border">{patientInfo.medicalId}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Contacto de Emergencia</p>
                      <p className="font-medium text-gray-900">{patientInfo.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Estadísticas Rápidas
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg text-center border border-green-200 hover:shadow-md transition-shadow">
                      <p className="text-2xl font-bold text-green-600">{stats.diagnoses}</p>
                      <p className="text-xs text-green-700 font-medium">Diagnósticos</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center border border-blue-200 hover:shadow-md transition-shadow">
                      <p className="text-2xl font-bold text-blue-600">{stats.treatments}</p>
                      <p className="text-xs text-blue-700 font-medium">Tratamientos</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg text-center border border-purple-200 hover:shadow-md transition-shadow">
                      <p className="text-2xl font-bold text-purple-600">{stats.events}</p>
                      <p className="text-xs text-purple-700 font-medium">Eventos</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg text-center border border-orange-200 hover:shadow-md transition-shadow">
                      <p className="text-2xl font-bold text-orange-600">{stats.documents}</p>
                      <p className="text-xs text-orange-700 font-medium">Documentos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontró información del paciente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Búsqueda Inteligente Mejorada */}
      <Card className="bg-gradient-to-r from-white to-gray-50 border-gray-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Search className="w-6 h-6 text-white" />
            </div>
            Búsqueda Inteligente
          </CardTitle>
          <CardDescription className="text-gray-200">Encuentra cualquier información en tu historial médico con filtros avanzados</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Barra de búsqueda principal */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar diagnósticos, tratamientos, eventos, documentos, médicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSearchTerm("")}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>

            {/* Filtros Avanzados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Registro</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📋 Todos los tipos</SelectItem>
                    <SelectItem value="diagnoses">🩺 Diagnósticos</SelectItem>
                    <SelectItem value="treatments">💊 Tratamientos</SelectItem>
                    <SelectItem value="events">📅 Eventos</SelectItem>
                    <SelectItem value="documents">📄 Documentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Período de Tiempo</label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📅 Todas las fechas</SelectItem>
                    <SelectItem value="today">🕐 Hoy</SelectItem>
                    <SelectItem value="week">📆 Esta semana</SelectItem>
                    <SelectItem value="month">📅 Este mes</SelectItem>
                    <SelectItem value="year">📅 Este año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Médico</label>
                <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar médico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">👨‍⚕️ Todos los médicos</SelectItem>
                    <SelectItem value="Dr. García Martínez">👨‍⚕️ Dr. García Martínez</SelectItem>
                    <SelectItem value="Dra. López Hernández">👩‍⚕️ Dra. López Hernández</SelectItem>
                    <SelectItem value="Dr. Rodríguez Silva">👨‍⚕️ Dr. Rodríguez Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Acciones</label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-2 border-gray-200 hover:border-blue-500">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-500">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Resultados de búsqueda en tiempo real */}
            {searchTerm && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium">
                      🔍 Buscando: "<strong>{searchTerm}</strong>"
                    </p>
                    <p className="text-blue-600 text-sm">
                      Filtros: {filterType !== "all" ? filterType : "todos"} • {filterDate !== "all" ? filterDate : "todas las fechas"}
                    </p>
                  </div>
                </div>
                
                {/* Sugerencias de búsqueda */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/50 text-blue-700 border-blue-300">
                    💊 {searchTerm} medicamentos
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 text-green-700 border-green-300">
                    🩺 {searchTerm} diagnósticos
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 text-purple-700 border-purple-300">
                    📅 {searchTerm} eventos
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 text-orange-700 border-orange-300">
                    📄 {searchTerm} documentos
                  </Badge>
                </div>
              </div>
            )}

            {/* Eliminar el bloque de botones de filtros rápidos */}
          </div>
        </CardContent>
      </Card>

      {/* Pestañas Organizadas Mejoradas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 p-1">
            <TabsTrigger 
              value="diagnoses" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnósticos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="treatments" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Tratamientos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Diagnósticos Mejorados */}
        <TabsContent value="diagnoses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">🩺 Diagnósticos Médicos</h3>
              <p className="text-gray-600 mt-1">Condiciones médicas diagnosticadas y su seguimiento</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              {filteredDiagnoses.length} registros
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredDiagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <Stethoscope className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{diagnosis.condition}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(diagnosis.severity)}>{diagnosis.severity}</Badge>
                            <Badge className={getStatusColor(diagnosis.status)}>{diagnosis.status}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 mb-1">📅 Diagnosticado</p>
                          <p className="font-semibold text-blue-900">{new Date(diagnosis.diagnosedDate).toLocaleDateString("es-ES")}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 mb-1">👨‍⚕️ Médico</p>
                          <p className="font-semibold text-green-900">{diagnosis.doctor}</p>
                          <p className="text-xs text-green-700">{diagnosis.specialty}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600 mb-1">📊 Última lectura</p>
                          <p className="font-semibold text-purple-900">{diagnosis.lastReading}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm text-orange-600 mb-1">⏰ Próximo control</p>
                          <p className="font-semibold text-orange-900">{new Date(diagnosis.nextCheckup).toLocaleDateString("es-ES")}</p>
                        </div>
                      </div>

                      {diagnosis.notes && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700">
                            <strong className="text-blue-900">📝 Notas médicas:</strong> {diagnosis.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 ml-6">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDetails(diagnosis, "diagnosis")}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tratamientos */}
        <TabsContent value="treatments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tratamientos y Medicamentos</h3>
            <Badge variant="outline">{filteredTreatments.length} registros</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTreatments.map((treatment: any) => (
              <Card key={treatment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Pill className="w-5 h-5 text-blue-500" />
                        <h4 className="text-lg font-semibold text-gray-900">{treatment.medication}</h4>
                        <Badge className={getStatusColor(treatment.status)}>{treatment.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Para:</span>
                          <p className="font-medium">{treatment.diagnosis}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Dosis:</span>
                          <p className="font-medium">
                            {treatment.dosage} • {treatment.frequency}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Inicio:</span>
                          <p className="font-medium">{new Date(treatment.startDate).toLocaleDateString("es-ES")}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Prescrito por:</span>
                          <p className="font-medium text-xs">{treatment.prescribedBy}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Adherencia:</span>
                            <span className="font-medium">{treatment.adherence}%</span>
                          </div>
                          <Progress value={treatment.adherence} className="h-2" />
                        </div>
                      </div>

                      {Array.isArray(treatment.sideEffects) && treatment.sideEffects.length > 0 && (
                        <div className="mb-4">
                          <span className="text-gray-600 text-sm">Efectos secundarios:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {treatment.sideEffects.map((effect: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {treatment.doctorNotes && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Instrucciones:</strong> {treatment.doctorNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(treatment, "treatment")}>
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Eventos */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Eventos Médicos</h3>
            <Badge variant="outline">{filteredEvents.length} registros</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((event: any) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getEventTypeIcon(event.type)}
                        <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Fecha:</span>
                          <p className="font-medium">{new Date(event.date).toLocaleDateString("es-ES")}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Ubicación:</span>
                          <p className="font-medium">{event.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Médico:</span>
                          <p className="font-medium">{event.doctor}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">Descripción:</span>
                          <p className="text-sm text-gray-800 mt-1">{event.description}</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <span className="text-green-700 text-sm font-medium">Resultado:</span>
                          <p className="text-sm text-green-800 mt-1">{event.outcome}</p>
                        </div>

                        {event.followUp && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <span className="text-blue-700 text-sm font-medium">Seguimiento:</span>
                            <p className="text-sm text-blue-800 mt-1">{event.followUp}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(event, "event")}>
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Documentos Médicos</h3>
            <Badge variant="outline">{filteredDocuments.length} registros</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((document: any) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getDocumentTypeIcon(document.type)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{document.title}</h4>
                        <p className="text-sm text-gray-600">{document.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{document.type}</Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Fecha:</span>
                        <p className="font-medium">{new Date(document.date).toLocaleDateString("es-ES")}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Médico:</span>
                        <p className="font-medium">{document.doctor}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600">Descripción:</span>
                      <p className="text-gray-800 mt-1">{document.description}</p>
                    </div>

                    {document.results && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-700 font-medium">Resultados:</span>
                        <p className="text-blue-800 mt-1">{document.results}</p>
                      </div>
                    )}

                    {document.recommendations && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <span className="text-green-700 font-medium">Recomendaciones:</span>
                        <p className="text-green-800 mt-1">{document.recommendations}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(document, "document")}>
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timeline Visual Mejorado */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">⏰ Línea de Tiempo Médica</h3>
              <p className="text-gray-600 mt-1">Cronología completa de tu historial médico</p>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
              Cronológico
            </Badge>
          </div>

          <div className="relative">
            {/* Línea de tiempo principal */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>

            <div className="space-y-8">
              {/* Combinar todos los eventos y ordenar por fecha */}
              {[
              ...diagnoses.map((d: any) => ({ ...d, date: d.diagnosedDate, type: "diagnosis" as const })),
              ...treatments.map((t: any) => ({ ...t, date: t.startDate, type: "treatment" as const })),
              ...medicalEvents.map((e: any) => ({ ...e, type: "event" as const })),
              ...medicalDocuments.map((d: any) => ({ ...d, type: "document" as const })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((item, index) => (
                  <div key={`${item.type}-${item.id}`} className="relative flex items-start gap-6 group">
                    {/* Indicador de tiempo */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 group-hover:scale-110 ${
                        item.type === "diagnosis" ? 'bg-gradient-to-br from-red-400 to-red-600' :
                        item.type === "treatment" ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                        item.type === "event" ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                        'bg-gradient-to-br from-green-400 to-green-600'
                      }`}>
                        {item.type === "diagnosis" && <Stethoscope className="w-6 h-6 text-white" />}
                        {item.type === "treatment" && <Pill className="w-6 h-6 text-white" />}
                        {item.type === "event" && <Calendar className="w-6 h-6 text-white" />}
                        {item.type === "document" && <FileText className="w-6 h-6 text-white" />}
                      </div>
                      
                      {/* Fecha */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                          {new Date(item.date).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <Card className="flex-1 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 group-hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-xl font-bold text-gray-900">
                              {'condition' in item ? item.condition : 
                               'medication' in item ? item.medication : 
                               'title' in item ? item.title : 'Sin título'}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${
                                item.type === "diagnosis" ? 'border-red-300 text-red-700 bg-red-50' :
                                item.type === "treatment" ? 'border-blue-300 text-blue-700 bg-blue-50' :
                                item.type === "event" ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                'border-green-300 text-green-700 bg-green-50'
                              }`}>
                                {item.type === "diagnosis" && "🩺 Diagnóstico"}
                                {item.type === "treatment" && "💊 Tratamiento"}
                                {item.type === "event" && "📅 Evento"}
                                {item.type === "document" && "📄 Documento"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">📅 Fecha</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(item.date).toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">👨‍⚕️ Médico</p>
                              <p className="font-semibold text-gray-900">
                                {'doctor' in item ? item.doctor : 'No especificado'}
                              </p>
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-700">
                              {'notes' in item ? item.notes : 
                               'description' in item ? item.description : 
                               'doctorNotes' in item ? item.doctorNotes : 
                               "Sin descripción adicional"}
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewDetails(item, item.type)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <MedicalRecordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
        recordType="diagnosis"
      />

      {selectedRecord && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedRecord.type === "diagnosis" && <Stethoscope className="w-5 h-5 text-red-500" />}
                {selectedRecord.type === "treatment" && <Pill className="w-5 h-5 text-blue-500" />}
                {selectedRecord.type === "event" && <Calendar className="w-5 h-5 text-purple-500" />}
                {selectedRecord.type === "document" && <FileText className="w-5 h-5 text-green-500" />}
                {selectedRecord.condition || selectedRecord.medication || selectedRecord.title}
              </DialogTitle>
              <DialogDescription>Detalles completos del registro médico • {selectedRecord.type}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información específica según el tipo */}
              {selectedRecord.type === "diagnosis" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Condición:</span>
                      <p className="font-semibold">{selectedRecord.condition}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Severidad:</span>
                      <Badge className={getSeverityColor(selectedRecord.severity)}>{selectedRecord.severity}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Estado:</span>
                      <Badge className={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Fecha de diagnóstico:</span>
                      <p className="font-medium">
                        {new Date(selectedRecord.diagnosedDate).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Médico responsable:</span>
                      <p className="font-medium">{selectedRecord.doctor}</p>
                      <p className="text-xs text-gray-500">{selectedRecord.specialty}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Última lectura:</span>
                      <p className="font-medium">{selectedRecord.lastReading}</p>
                    </div>
                  </div>

                  {selectedRecord.notes && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Notas médicas:</span>
                      <p className="text-gray-800 mt-2">{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Más tipos de registros... */}
              {selectedRecord.type === "treatment" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Medicamento:</span>
                      <p className="font-semibold">{selectedRecord.medication}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Estado:</span>
                      <Badge className={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Dosis:</span>
                      <p className="font-medium">{selectedRecord.dosage}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Frecuencia:</span>
                      <p className="font-medium">{selectedRecord.frequency}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Adherencia al tratamiento:</span>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={selectedRecord.adherence} className="flex-1 h-3" />
                      <span className="font-bold text-blue-800">{selectedRecord.adherence}%</span>
                    </div>
                  </div>

                  {selectedRecord.doctorNotes && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Instrucciones del médico:</span>
                      <p className="text-gray-800 mt-2">{selectedRecord.doctorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="flex-1">
                Cerrar
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Edit className="w-4 h-4 mr-2" />
                Editar Registro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Notificaciones y Alertas Contextuales */}
      <div className="space-y-4 mt-8">
        {/* Alertas importantes */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-1">⚠️ Próximo Control Médico</h4>
              <p className="text-orange-800 text-sm">
                Tienes un control de diabetes programado para el <strong>30 de enero de 2024</strong>. 
                Recuerda llevar tus análisis recientes.
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              Ver detalles
            </Button>
          </div>
        </div>

        {/* Notificaciones informativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">📄 Nuevo Documento</h4>
                <p className="text-blue-800 text-sm">
                  Se ha agregado un nuevo análisis de sangre a tu historial médico.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">✅ Tratamiento Completado</h4>
                <p className="text-green-800 text-sm">
                  Has completado exitosamente el tratamiento de antibióticos prescrito.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de actividad reciente */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900">📊 Actividad Reciente</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-purple-800">Última cita: Hace 3 días</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-purple-800">Último análisis: Hace 1 semana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-purple-800">Próximo control: En 2 semanas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar información del paciente */}
      <PatientInfoEditModal
        isOpen={showEditPatientModal}
        onClose={() => setShowEditPatientModal(false)}
        patientInfo={patientInfo}
        onSave={handleSavePatientInfo}
      />
    </div>
  )
}
