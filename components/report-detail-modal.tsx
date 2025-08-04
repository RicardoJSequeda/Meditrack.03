"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Download, 
  Share2, 
  Printer, 
  FileText, 
  Calendar, 
  User, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Heart,
  X,
  Eye,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Target,
  Award,
  Star,
  Zap,
  Shield,
  Activity as ActivityIcon
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

interface ReportDetailModalProps {
  report: MedicalReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ReportDetailModal({ report, open, onOpenChange }: ReportDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!report) return null

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
      case 'GENERAL': return <Activity className="w-5 h-5" />
      case 'ESPECIALIZADO': return <Heart className="w-5 h-5" />
      case 'EMERGENCIA': return <AlertTriangle className="w-5 h-5" />
      case 'SEGUIMIENTO': return <TrendingUp className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'BAJO': return 'text-green-600 bg-green-50'
      case 'MEDIO': return 'text-yellow-600 bg-yellow-50'
      case 'ALTO': return 'text-orange-600 bg-orange-50'
      case 'CRITICO': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const downloadReport = () => {
    toast({
      title: "Descargando informe",
      description: `Generando PDF para ${report.title}`,
    })
  }

  const shareReport = () => {
    toast({
      title: "Compartiendo informe",
      description: `Enviando ${report.title} por email`,
    })
  }

  const printReport = () => {
    toast({
      title: "Imprimiendo informe",
      description: `Preparando ${report.title} para impresión`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100 rounded-xl">
                {getTypeIcon(report.type)}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{report.title}</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {report.description}
                </DialogDescription>
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Doctor */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Información del Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{report.doctor}</p>
                    <p className="text-sm text-gray-600">{report.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Fecha del Informe</p>
                    <p className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Salud */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600" />
                Métricas de Salud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{report.metrics.healthScore}%</div>
                  <div className="text-sm text-blue-700">Puntuación de Salud</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{report.metrics.adherenceRate}%</div>
                  <div className="text-sm text-green-700">Adherencia</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getRiskLevelColor(report.metrics.riskLevel).split(' ')[0]}`}>
                    {report.metrics.riskLevel}
                  </div>
                  <div className="text-sm text-gray-700">Nivel de Riesgo</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{report.metrics.improvementAreas.length}</div>
                  <div className="text-sm text-purple-700">Áreas de Mejora</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido Detallado */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="findings">Hallazgos</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              <TabsTrigger value="attachments">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-600" />
                    Resumen Ejecutivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Estado Actual</h4>
                      <p className="text-gray-700">
                        El paciente presenta un estado de salud {report.metrics.healthScore >= 80 ? 'excelente' : 
                        report.metrics.healthScore >= 60 ? 'bueno' : 'requiere atención'}, 
                        con una adherencia al tratamiento del {report.metrics.adherenceRate}%.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Áreas de Mejora</h4>
                      <ul className="space-y-1">
                        {report.metrics.improvementAreas.map((area, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Próximos Pasos</h4>
                      <p className="text-gray-700">
                        Se recomienda continuar con el seguimiento médico regular y mantener 
                        las medidas de prevención establecidas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="findings" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5 text-teal-600" />
                    Hallazgos Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.findings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{finding}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    Recomendaciones Médicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    Documentos Adjuntos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">{attachment}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Acciones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={downloadReport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" onClick={shareReport}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 