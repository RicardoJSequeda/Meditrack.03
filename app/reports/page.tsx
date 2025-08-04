"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Activity, 
  Heart, 
  Pill, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  LineChart,
  PieChart,
  ScatterChart,
  Filter,
  Search,
  RefreshCw,
  Share2,
  Eye,
  Printer,
  FileSpreadsheet,
  Database,
  Shield,
  Zap,
  Star,
  Award,
  Trophy,
  TrendingDown,
  Minus,
  Plus
} from "lucide-react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { toast } from "@/hooks/use-toast"
import ReportDetailModal from "@/components/report-detail-modal"
import ReportGenerator from "@/components/report-generator"
import HealthCharts from "@/components/health-charts"
import HealthPredictions from "@/components/health-predictions"
import HealthComparison from "@/components/health-comparison"
import AnalyticsCharts from "@/components/analytics-charts"

interface MedicalReport {
  id: string
  type: 'GENERAL' | 'ESPECIALIZADO' | 'EMERGENCIA' | 'SEGUIMIENTO'
  title: string
  description: string
  date: string
  status: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'ARCHIVADO'
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  doctor: string
  specialty: string
  findings: string[]
  recommendations: string[]
  attachments: string[]
  metrics: {
    healthScore: number
    adherenceRate: number
    riskLevel: string
    improvementAreas: string[]
  }
}

interface HealthMetrics {
  generalHealth: {
    percentage: number
    controlled: number
    monitoring: number
    status: string
  }
  adherence: {
    percentage: number
    active: number
    completed: number
    status: string
  }
  events: {
    total: number
    lastAppointment: string
    nextCheckup: string
    status: string
  }
  documents: {
    total: number
    analysis: number
    others: number
    status: string
  }
}

export default function ReportsPage() {
  const { user } = useSupabaseAuth()
  const [reports, setReports] = useState<MedicalReport[]>([])
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('DATE')
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de ejemplo para informes
  const sampleReports: MedicalReport[] = [
    {
      id: '1',
      type: 'GENERAL',
      title: 'Evaluación General de Salud',
      description: 'Análisis completo del estado de salud actual',
      date: '2025-01-15',
      status: 'COMPLETADO',
      priority: 'MEDIA',
      doctor: 'Dr. María García',
      specialty: 'Medicina General',
      findings: [
        'Presión arterial ligeramente elevada',
        'Niveles de colesterol dentro del rango normal',
        'Peso estable en los últimos 3 meses',
        'Adherencia a medicamentos del 85%'
      ],
      recommendations: [
        'Reducir consumo de sal',
        'Mantener ejercicio regular',
        'Continuar con medicación actual',
        'Seguimiento en 3 meses'
      ],
      attachments: ['analisis_sangre.pdf', 'radiografia_torax.pdf'],
      metrics: {
        healthScore: 78,
        adherenceRate: 85,
        riskLevel: 'BAJO',
        improvementAreas: ['Presión arterial', 'Ejercicio físico']
      }
    },
    {
      id: '2',
      type: 'ESPECIALIZADO',
      title: 'Evaluación Cardiológica',
      description: 'Análisis especializado del sistema cardiovascular',
      date: '2025-01-10',
      status: 'COMPLETADO',
      priority: 'ALTA',
      doctor: 'Dr. Carlos Rodríguez',
      specialty: 'Cardiología',
      findings: [
        'Función cardíaca normal',
        'Electrocardiograma sin alteraciones',
        'Ecocardiograma muestra ventrículos normales',
        'No evidencia de enfermedad coronaria'
      ],
      recommendations: [
        'Mantener dieta baja en grasas',
        'Ejercicio aeróbico 30 min/día',
        'Control de presión arterial',
        'Seguimiento anual'
      ],
      attachments: ['ecocardiograma.pdf', 'electrocardiograma.pdf'],
      metrics: {
        healthScore: 92,
        adherenceRate: 90,
        riskLevel: 'BAJO',
        improvementAreas: ['Ejercicio cardiovascular']
      }
    },
    {
      id: '3',
      type: 'SEGUIMIENTO',
      title: 'Seguimiento Diabetes',
      description: 'Control de evolución de diabetes tipo 2',
      date: '2025-01-08',
      status: 'EN_PROCESO',
      priority: 'ALTA',
      doctor: 'Dra. Ana Martínez',
      specialty: 'Endocrinología',
      findings: [
        'Glucosa en ayunas: 120 mg/dL',
        'Hemoglobina glicosilada: 6.8%',
        'Peso reducido 2kg en el último mes',
        'Adherencia a medicación del 95%'
      ],
      recommendations: [
        'Continuar con metformina',
        'Mantener dieta baja en carbohidratos',
        'Ejercicio diario 45 minutos',
        'Control semanal de glucosa'
      ],
      attachments: ['analisis_glucosa.pdf', 'curva_glucosa.pdf'],
      metrics: {
        healthScore: 85,
        adherenceRate: 95,
        riskLevel: 'MEDIO',
        improvementAreas: ['Control glucémico', 'Peso']
      }
    },
    {
      id: '4',
      type: 'EMERGENCIA',
      title: 'Evaluación Post-Accidente',
      description: 'Análisis tras accidente automovilístico',
      date: '2025-01-05',
      status: 'COMPLETADO',
      priority: 'CRITICA',
      doctor: 'Dr. Luis Pérez',
      specialty: 'Traumatología',
      findings: [
        'Fractura de clavícula derecha',
        'Esguince de tobillo izquierdo',
        'Contusiones menores en tórax',
        'No evidencia de lesión craneal'
      ],
      recommendations: [
        'Inmovilización clavícula 6 semanas',
        'Fisioterapia para tobillo',
        'Control del dolor con analgésicos',
        'Seguimiento semanal'
      ],
      attachments: ['radiografia_clavicula.pdf', 'tomografia_torax.pdf'],
      metrics: {
        healthScore: 65,
        adherenceRate: 100,
        riskLevel: 'MEDIO',
        improvementAreas: ['Movilidad', 'Dolor']
      }
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setReports(sampleReports)
      setMetrics({
        generalHealth: {
          percentage: 78,
          controlled: 5,
          monitoring: 10,
          status: 'Estable'
        },
        adherence: {
          percentage: 85,
          active: 14,
          completed: 0,
          status: 'Excelente'
        },
        events: {
          total: 14,
          lastAppointment: '15/1/2025',
          nextCheckup: '15/2/2025',
          status: 'Programado'
        },
        documents: {
          total: 6,
          analysis: 4,
          others: 2,
          status: 'Actualizado'
        }
      })
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'ALL' || report.type === filterType
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'DATE':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'PRIORITY':
        const priorityOrder = { 'CRITICA': 4, 'ALTA': 3, 'MEDIA': 2, 'BAJA': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'STATUS':
        const statusOrder = { 'COMPLETADO': 4, 'EN_PROCESO': 3, 'PENDIENTE': 2, 'ARCHIVADO': 1 }
        return statusOrder[b.status] - statusOrder[a.status]
      default:
        return 0
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA': return 'bg-red-100 text-red-800 border-red-200'
      case 'ALTA': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BAJA': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETADO': return 'bg-green-100 text-green-800 border-green-200'
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ARCHIVADO': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GENERAL': return <Activity className="w-4 h-4" />
      case 'ESPECIALIZADO': return <Heart className="w-4 h-4" />
      case 'EMERGENCIA': return <AlertTriangle className="w-4 h-4" />
      case 'SEGUIMIENTO': return <TrendingUp className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const downloadReport = (report: MedicalReport) => {
    toast({
      title: "Descargando informe",
      description: `Generando PDF para ${report.title}`,
    })
    // Aquí iría la lógica real de descarga
  }

  const shareReport = (report: MedicalReport) => {
    toast({
      title: "Compartiendo informe",
      description: `Enviando ${report.title} por email`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span>Cargando informes médicos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-teal-600" />
              Informes Médicos Avanzados
            </h1>
            <p className="text-gray-600 mt-2">
              Análisis detallado y seguimiento de tu salud
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exportar Todos
            </Button>
          </div>
        </div>

        {/* Métricas Generales */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Salud General</p>
                    <p className="text-3xl font-bold">{metrics.generalHealth.percentage}%</p>
                    <p className="text-blue-100 text-sm">{metrics.generalHealth.status}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Adherencia</p>
                    <p className="text-3xl font-bold">{metrics.adherence.percentage}%</p>
                    <p className="text-green-100 text-sm">{metrics.adherence.status}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Eventos</p>
                    <p className="text-3xl font-bold">{metrics.events.total}</p>
                    <p className="text-purple-100 text-sm">{metrics.events.status}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Documentos</p>
                    <p className="text-3xl font-bold">{metrics.documents.total}</p>
                    <p className="text-orange-100 text-sm">{metrics.documents.status}</p>
                  </div>
                  <FileText className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controles de Filtro */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar informes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">Todos los tipos</option>
                  <option value="GENERAL">General</option>
                  <option value="ESPECIALIZADO">Especializado</option>
                  <option value="EMERGENCIA">Emergencia</option>
                  <option value="SEGUIMIENTO">Seguimiento</option>
                </select>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="DATE">Ordenar por fecha</option>
                  <option value="PRIORITY">Ordenar por prioridad</option>
                  <option value="STATUS">Ordenar por estado</option>
                </select>
              </div>

              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informes */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="generator">Generador</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="comparison">Comparación</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedReports.map((report) => (
                <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription className="text-sm">{report.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{report.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Puntuación de Salud</p>
                        <p className="text-2xl font-bold text-teal-600">{report.metrics.healthScore}%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Adherencia</p>
                        <p className="text-2xl font-bold text-green-600">{report.metrics.adherenceRate}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Hallazgos Principales:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {report.findings.slice(0, 2).map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => downloadReport(report)}>
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => shareReport(report)}>
                        <Share2 className="w-3 h-3 mr-1" />
                        Compartir
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
                      </TabsContent>

            <TabsContent value="generator" className="space-y-6">
              <ReportGenerator />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <HealthCharts userId={user?.id || ''} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <HealthPredictions userId={user?.id || ''} />
            </TabsContent>

                        <TabsContent value="analytics" className="space-y-6">
              <AnalyticsCharts userId={user?.id || ''} />
            </TabsContent>

                      <TabsContent value="comparison" className="space-y-6">
              <HealthComparison userId={user?.id || ''} />
            </TabsContent>
        </Tabs>

        {/* Modal de Detalles del Informe */}
        <ReportDetailModal 
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={(open) => !open && setSelectedReport(null)}
        />
      </div>
    </div>
  )
}
