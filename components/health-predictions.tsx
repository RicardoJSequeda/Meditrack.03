"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Activity,
  Heart,
  Pill,
  Calendar,
  Users,
  FileText,
  Award,
  Star,
  Zap,
  Shield,
  Eye,
  Brain as BrainIcon,
  Lightbulb,
  TrendingDown,
  Minus,
  Plus,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Info
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface HealthPrediction {
  id: string
  type: 'RISK' | 'IMPROVEMENT' | 'MAINTENANCE' | 'ALERT'
  title: string
  description: string
  probability: number
  timeframe: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  recommendations: string[]
  confidence: number
  factors: string[]
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
}

interface PredictionMetrics {
  overallRisk: number
  improvementAreas: number
  maintenanceAreas: number
  criticalAlerts: number
  nextMonthPredictions: HealthPrediction[]
  nextQuarterPredictions: HealthPrediction[]
  nextYearPredictions: HealthPrediction[]
}

interface HealthPredictionsProps {
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

export default function HealthPredictions({ userId }: HealthPredictionsProps) {
  const [predictions, setPredictions] = useState<HealthPrediction[]>([])
  const [metrics, setMetrics] = useState<PredictionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    generatePredictions()
  }, [userId])

  const generatePredictions = async () => {
    setLoading(true)
    
    // Simular análisis de IA
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockPredictions: HealthPrediction[] = [
      {
        id: '1',
        type: 'RISK',
        title: 'Riesgo de Hipertensión',
        description: 'Basado en tus patrones de presión arterial, existe un 75% de probabilidad de desarrollar hipertensión en los próximos 6 meses.',
        probability: 75,
        timeframe: '6 meses',
        severity: 'HIGH',
        confidence: 85,
        impact: 'NEGATIVE',
        factors: ['Presión arterial elevada', 'Historial familiar', 'Estilo de vida sedentario'],
        recommendations: [
          'Reducir consumo de sal',
          'Aumentar actividad física',
          'Monitorear presión arterial semanalmente',
          'Consultar con cardiólogo'
        ]
      },
      {
        id: '2',
        type: 'IMPROVEMENT',
        title: 'Mejora en Control de Diabetes',
        description: 'Con la adherencia actual al tratamiento, se espera una mejora del 15% en el control glucémico.',
        probability: 85,
        timeframe: '3 meses',
        severity: 'LOW',
        confidence: 90,
        impact: 'POSITIVE',
        factors: ['Adherencia al tratamiento del 95%', 'Dieta controlada', 'Ejercicio regular'],
        recommendations: [
          'Mantener dieta baja en carbohidratos',
          'Continuar con ejercicio diario',
          'Monitorear glucosa regularmente',
          'Seguir horario de medicación'
        ]
      },
      {
        id: '3',
        type: 'MAINTENANCE',
        title: 'Mantenimiento de Peso Saludable',
        description: 'Tu peso actual está en rango saludable. Se predice estabilidad con las rutinas actuales.',
        probability: 80,
        timeframe: '12 meses',
        severity: 'LOW',
        confidence: 75,
        impact: 'POSITIVE',
        factors: ['Peso estable', 'Ejercicio regular', 'Dieta balanceada'],
        recommendations: [
          'Mantener rutina de ejercicio',
          'Continuar dieta balanceada',
          'Monitorear peso mensualmente',
          'Ajustar según cambios'
        ]
      },
      {
        id: '4',
        type: 'ALERT',
        title: 'Riesgo de Ansiedad',
        description: 'Se detectan patrones que sugieren un posible aumento en síntomas de ansiedad.',
        probability: 60,
        timeframe: '4 meses',
        severity: 'MEDIUM',
        confidence: 70,
        impact: 'NEGATIVE',
        factors: ['Estrés laboral', 'Patrones de sueño irregulares', 'Cambios recientes'],
        recommendations: [
          'Consultar con psicólogo',
          'Practicar técnicas de relajación',
          'Mejorar higiene del sueño',
          'Considerar terapia'
        ]
      },
      {
        id: '5',
        type: 'IMPROVEMENT',
        title: 'Mejora en Condición Física',
        description: 'Con el ejercicio actual, se espera una mejora del 20% en condición cardiovascular.',
        probability: 90,
        timeframe: '6 meses',
        severity: 'LOW',
        confidence: 85,
        impact: 'POSITIVE',
        factors: ['Ejercicio regular', 'Mejora en frecuencia cardíaca', 'Aumento en resistencia'],
        recommendations: [
          'Mantener rutina de ejercicio',
          'Aumentar intensidad gradualmente',
          'Incluir ejercicios de fuerza',
          'Monitorear progreso'
        ]
      },
      {
        id: '6',
        type: 'RISK',
        title: 'Riesgo de Artritis',
        description: 'Basado en edad y actividad física, existe un 40% de probabilidad de desarrollar artritis.',
        probability: 40,
        timeframe: '5 años',
        severity: 'MEDIUM',
        confidence: 65,
        impact: 'NEGATIVE',
        factors: ['Edad', 'Actividad física intensa', 'Historial familiar'],
        recommendations: [
          'Consultar con reumatólogo',
          'Ajustar actividad física',
          'Considerar suplementos',
          'Monitorear síntomas'
        ]
      }
    ]

    const mockMetrics: PredictionMetrics = {
      overallRisk: 35,
      improvementAreas: 3,
      maintenanceAreas: 2,
      criticalAlerts: 1,
      nextMonthPredictions: mockPredictions.filter(p => p.timeframe.includes('mes')),
      nextQuarterPredictions: mockPredictions.filter(p => p.timeframe.includes('meses')),
      nextYearPredictions: mockPredictions.filter(p => p.timeframe.includes('años') || p.timeframe.includes('12 meses'))
    }

    setPredictions(mockPredictions)
    setMetrics(mockMetrics)
    setLoading(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RISK': return 'bg-red-100 text-red-800 border-red-200'
      case 'IMPROVEMENT': return 'bg-green-100 text-green-800 border-green-200'
      case 'MAINTENANCE': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ALERT': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'HIGH': return 'text-orange-600'
      case 'CRITICAL': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'POSITIVE': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'NEGATIVE': return <ArrowDown className="w-4 h-4 text-red-600" />
      case 'NEUTRAL': return <Minus className="w-4 h-4 text-gray-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RISK': return <AlertTriangle className="w-4 h-4" />
      case 'IMPROVEMENT': return <TrendingUp className="w-4 h-4" />
      case 'MAINTENANCE': return <Shield className="w-4 h-4" />
      case 'ALERT': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const filteredPredictions = predictions.filter(prediction => {
    if (selectedTimeframe === 'month') {
      return prediction.timeframe.includes('mes') && !prediction.timeframe.includes('meses')
    } else if (selectedTimeframe === 'quarter') {
      return prediction.timeframe.includes('meses') && !prediction.timeframe.includes('años')
    } else {
      return prediction.timeframe.includes('años') || prediction.timeframe.includes('12 meses')
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span>Analizando datos de salud con IA...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Predicción */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Riesgo General</p>
                  <p className="text-3xl font-bold">{metrics.overallRisk}%</p>
                  <p className="text-red-100 text-sm">Probabilidad</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Áreas de Mejora</p>
                  <p className="text-3xl font-bold">{metrics.improvementAreas}</p>
                  <p className="text-green-100 text-sm">Identificadas</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Mantenimiento</p>
                  <p className="text-3xl font-bold">{metrics.maintenanceAreas}</p>
                  <p className="text-blue-100 text-sm">Estables</p>
                </div>
                <Shield className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Alertas Críticas</p>
                  <p className="text-3xl font-bold">{metrics.criticalAlerts}</p>
                  <p className="text-orange-100 text-sm">Activas</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controles de Filtro */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-teal-600" />
            Análisis Predictivo de Salud
          </CardTitle>
          <CardDescription>
            Predicciones basadas en IA sobre tu salud futura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('month')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Próximo Mes
            </Button>
            <Button
              variant={selectedTimeframe === 'quarter' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('quarter')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Próximo Trimestre
            </Button>
            <Button
              variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('year')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Próximo Año
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPredictions.map((prediction) => (
          <Card key={prediction.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    {getTypeIcon(prediction.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                    <CardDescription className="text-sm">{prediction.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(prediction.type)}>
                    {prediction.type}
                  </Badge>
                  <Badge className={`${getSeverityColor(prediction.severity)} bg-gray-100 border-gray-200`}>
                    {prediction.severity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Probabilidad:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-teal-600">{prediction.probability}%</span>
                  {getImpactIcon(prediction.impact)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confianza del modelo</span>
                  <span>{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Factores considerados:</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recomendaciones:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {prediction.recommendations.slice(0, 3).map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>En {prediction.timeframe}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>IA Predictiva</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información Adicional */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-teal-600" />
            ¿Cómo Funciona el Análisis Predictivo?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Análisis de Patrones</h3>
              <p className="text-sm text-blue-700 mt-1">
                La IA analiza tus datos históricos para identificar patrones y tendencias
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Predicción de Riesgos</h3>
              <p className="text-sm text-green-700 mt-1">
                Identifica posibles riesgos de salud basados en múltiples factores
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Recomendaciones Personalizadas</h3>
              <p className="text-sm text-purple-700 mt-1">
                Genera recomendaciones específicas para mejorar tu salud
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 