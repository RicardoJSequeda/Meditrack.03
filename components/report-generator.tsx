"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Activity,
  Heart,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Star,
  Award,
  Plus,
  Settings,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'GENERAL' | 'ESPECIALIZADO' | 'EMERGENCIA' | 'SEGUIMIENTO'
  icon: React.ReactNode
  duration: string
  sections: string[]
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Informe General de Salud',
    description: 'Evaluación completa del estado de salud general',
    type: 'GENERAL',
    icon: <Activity className="w-5 h-5" />,
    duration: '15-20 min',
    sections: ['Historial médico', 'Examen físico', 'Análisis de laboratorio', 'Recomendaciones']
  },
  {
    id: '2',
    name: 'Informe Cardiológico',
    description: 'Análisis especializado del sistema cardiovascular',
    type: 'ESPECIALIZADO',
    icon: <Heart className="w-5 h-5" />,
    duration: '30-45 min',
    sections: ['Electrocardiograma', 'Ecocardiograma', 'Pruebas de esfuerzo', 'Evaluación de riesgo']
  },
  {
    id: '3',
    name: 'Informe de Emergencia',
    description: 'Evaluación rápida en situaciones de emergencia',
    type: 'EMERGENCIA',
    icon: <AlertTriangle className="w-5 h-5" />,
    duration: '5-10 min',
    sections: ['Evaluación inicial', 'Estabilización', 'Tratamiento inmediato', 'Seguimiento']
  },
  {
    id: '4',
    name: 'Informe de Seguimiento',
    description: 'Control de evolución de tratamientos en curso',
    type: 'SEGUIMIENTO',
    icon: <TrendingUp className="w-5 h-5" />,
    duration: '20-30 min',
    sections: ['Evolución clínica', 'Adherencia al tratamiento', 'Ajustes terapéuticos', 'Próximos controles']
  },
  {
    id: '5',
    name: 'Informe Nutricional',
    description: 'Evaluación del estado nutricional y dietético',
    type: 'ESPECIALIZADO',
    icon: <Target className="w-5 h-5" />,
    duration: '25-35 min',
    sections: ['Evaluación nutricional', 'Análisis de dieta', 'Recomendaciones dietéticas', 'Plan de seguimiento']
  },
  {
    id: '6',
    name: 'Informe Psicológico',
    description: 'Evaluación del estado mental y emocional',
    type: 'ESPECIALIZADO',
    icon: <Brain className="w-5 h-5" />,
    duration: '45-60 min',
    sections: ['Evaluación psicológica', 'Análisis conductual', 'Diagnóstico', 'Plan terapéutico']
  }
]

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState<any[]>([])

  const generateReport = async (template: ReportTemplate) => {
    setGenerating(true)
    
    // Simular generación de informe
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newReport = {
      id: Date.now().toString(),
      template: template,
      generatedAt: new Date().toISOString(),
      status: 'COMPLETADO',
      downloadUrl: '#'
    }
    
    setGeneratedReports(prev => [newReport, ...prev])
    setGenerating(false)
    
    toast({
      title: "Informe generado",
      description: `${template.name} ha sido generado exitosamente`,
    })
  }

  const downloadReport = (report: any) => {
    toast({
      title: "Descargando informe",
      description: `Descargando ${report.template.name}`,
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ESPECIALIZADO': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'EMERGENCIA': return 'bg-red-100 text-red-800 border-red-200'
      case 'SEGUIMIENTO': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Plantillas de Informes */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Generador de Informes Automáticos
          </CardTitle>
          <CardDescription>
            Selecciona una plantilla para generar informes médicos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate?.id === template.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Duración: {template.duration}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Secciones incluidas:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {template.sections.slice(0, 2).map((section, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                          {section}
                        </li>
                      ))}
                      {template.sections.length > 2 && (
                        <li className="text-gray-500">+{template.sections.length - 2} más</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración del Informe */}
      {selectedTemplate && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-600" />
              Configuración del Informe
            </CardTitle>
            <CardDescription>
              Personaliza los parámetros para {selectedTemplate.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período de Análisis
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>Último mes</option>
                    <option>Últimos 3 meses</option>
                    <option>Último año</option>
                    <option>Personalizado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incluir Gráficos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Evolución temporal</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Comparativas</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Análisis predictivo</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Salida
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" defaultChecked className="rounded" />
                      <span className="text-sm">PDF (Recomendado)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" className="rounded" />
                      <span className="text-sm">Word (.docx)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" className="rounded" />
                      <span className="text-sm">Excel (.xlsx)</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incluir Datos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Métricas de salud</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Historial médico</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Recomendaciones</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 border-t mt-6">
              <Button 
                onClick={() => generateReport(selectedTemplate)}
                disabled={generating}
                className="flex-1"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generar Informe
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informes Generados */}
      {generatedReports.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-teal-600" />
              Informes Generados
            </CardTitle>
            <CardDescription>
              Historial de informes generados automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      {report.template.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.template.name}</p>
                      <p className="text-sm text-gray-600">
                        Generado el {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {report.status}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report)}>
                      <Download className="w-4 h-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente Brain para el icono psicológico
function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.44 2.5 2.5 0 0 1-.54-3.44 2.5 2.5 0 0 1 1.46-3.44A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.44 2.5 2.5 0 0 0 .54-3.44 2.5 2.5 0 0 0-1.46-3.44A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  )
} 