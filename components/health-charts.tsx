"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { 
  TrendingUp, 
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

interface HealthData {
  date: string
  healthScore: number
  adherenceRate: number
  bloodPressure: number
  heartRate: number
  weight: number
  glucose: number
}

interface MedicalEvent {
  id: string
  type: string
  date: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
}

interface Diagnosis {
  id: string
  name: string
  date: string
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC'
  category: string
}

interface Treatment {
  id: string
  name: string
  startDate: string
  endDate: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED'
  adherence: number
}

interface HealthChartsProps {
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

export default function HealthCharts({ userId }: HealthChartsProps) {
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHealthData()
  }, [userId])

  const fetchHealthData = async () => {
    try {
      // Simular datos de la base de datos
      const mockHealthData: HealthData[] = [
        { date: '2024-01', healthScore: 85, adherenceRate: 90, bloodPressure: 120, heartRate: 72, weight: 70, glucose: 95 },
        { date: '2024-02', healthScore: 88, adherenceRate: 92, bloodPressure: 118, heartRate: 70, weight: 69, glucose: 92 },
        { date: '2024-03', healthScore: 82, adherenceRate: 85, bloodPressure: 125, heartRate: 75, weight: 71, glucose: 98 },
        { date: '2024-04', healthScore: 90, adherenceRate: 95, bloodPressure: 115, heartRate: 68, weight: 68, glucose: 88 },
        { date: '2024-05', healthScore: 87, adherenceRate: 88, bloodPressure: 122, heartRate: 73, weight: 70, glucose: 94 },
        { date: '2024-06', healthScore: 92, adherenceRate: 96, bloodPressure: 118, heartRate: 69, weight: 69, glucose: 90 },
        { date: '2024-07', healthScore: 89, adherenceRate: 93, bloodPressure: 120, heartRate: 71, weight: 70, glucose: 92 },
        { date: '2024-08', healthScore: 91, adherenceRate: 94, bloodPressure: 117, heartRate: 70, weight: 69, glucose: 89 },
        { date: '2024-09', healthScore: 86, adherenceRate: 87, bloodPressure: 124, heartRate: 74, weight: 71, glucose: 96 },
        { date: '2024-10', healthScore: 93, adherenceRate: 97, bloodPressure: 116, heartRate: 68, weight: 68, glucose: 87 },
        { date: '2024-11', healthScore: 88, adherenceRate: 91, bloodPressure: 121, heartRate: 72, weight: 70, glucose: 93 },
        { date: '2024-12', healthScore: 94, adherenceRate: 98, bloodPressure: 115, heartRate: 67, weight: 67, glucose: 86 }
      ]

      const mockMedicalEvents: MedicalEvent[] = [
        { id: '1', type: 'Consulta', date: '2024-01-15', description: 'Control rutinario', severity: 'LOW', category: 'General' },
        { id: '2', type: 'Análisis', date: '2024-02-20', description: 'Análisis de sangre', severity: 'LOW', category: 'Laboratorio' },
        { id: '3', type: 'Emergencia', date: '2024-03-10', description: 'Dolor en el pecho', severity: 'HIGH', category: 'Cardiología' },
        { id: '4', type: 'Consulta', date: '2024-04-05', description: 'Seguimiento diabetes', severity: 'MEDIUM', category: 'Endocrinología' },
        { id: '5', type: 'Cirugía', date: '2024-05-12', description: 'Apendicectomía', severity: 'CRITICAL', category: 'Cirugía' },
        { id: '6', type: 'Consulta', date: '2024-06-18', description: 'Control post-operatorio', severity: 'MEDIUM', category: 'General' },
        { id: '7', type: 'Análisis', date: '2024-07-25', description: 'Análisis de control', severity: 'LOW', category: 'Laboratorio' },
        { id: '8', type: 'Consulta', date: '2024-08-30', description: 'Revisión anual', severity: 'LOW', category: 'General' }
      ]

      const mockDiagnoses: Diagnosis[] = [
        { id: '1', name: 'Hipertensión', date: '2023-01-15', status: 'CHRONIC', category: 'Cardiovascular' },
        { id: '2', name: 'Diabetes Tipo 2', date: '2023-03-20', status: 'CHRONIC', category: 'Endocrinología' },
        { id: '3', name: 'Artritis', date: '2023-06-10', status: 'CHRONIC', category: 'Reumatología' },
        { id: '4', name: 'Bronquitis', date: '2024-01-05', status: 'RESOLVED', category: 'Neumología' },
        { id: '5', name: 'Apendicitis', date: '2024-05-12', status: 'RESOLVED', category: 'Cirugía' },
        { id: '6', name: 'Ansiedad', date: '2024-07-15', status: 'ACTIVE', category: 'Psiquiatría' }
      ]

      const mockTreatments: Treatment[] = [
        { id: '1', name: 'Metformina', startDate: '2023-03-20', endDate: null, status: 'ACTIVE', adherence: 95 },
        { id: '2', name: 'Losartán', startDate: '2023-01-15', endDate: null, status: 'ACTIVE', adherence: 88 },
        { id: '3', name: 'Ibuprofeno', startDate: '2024-01-05', endDate: '2024-01-15', status: 'COMPLETED', adherence: 100 },
        { id: '4', name: 'Antibióticos', startDate: '2024-05-12', endDate: '2024-05-22', status: 'COMPLETED', adherence: 92 },
        { id: '5', name: 'Sertralina', startDate: '2024-07-15', endDate: null, status: 'ACTIVE', adherence: 85 },
        { id: '6', name: 'Fisioterapia', startDate: '2024-06-01', endDate: null, status: 'ACTIVE', adherence: 78 }
      ]

      setHealthData(mockHealthData)
      setMedicalEvents(mockMedicalEvents)
      setDiagnoses(mockDiagnoses)
      setTreatments(mockTreatments)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching health data:', error)
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return COLORS.success
      case 'MEDIUM': return COLORS.warning
      case 'HIGH': return COLORS.orange
      case 'CRITICAL': return COLORS.danger
      default: return COLORS.info
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return COLORS.success
      case 'RESOLVED': return COLORS.info
      case 'CHRONIC': return COLORS.warning
      case 'COMPLETED': return COLORS.success
      case 'DISCONTINUED': return COLORS.danger
      default: return COLORS.info
    }
  }

  const eventData = medicalEvents.map(event => ({
    name: event.type,
    value: 1,
    color: getSeverityColor(event.severity)
  }))

  const diagnosisData = diagnoses.map(diagnosis => ({
    name: diagnosis.name,
    value: 1,
    color: getStatusColor(diagnosis.status)
  }))

  const treatmentData = treatments.map(treatment => ({
    name: treatment.name,
    adherence: treatment.adherence,
    color: getStatusColor(treatment.status)
  }))

  const radarData = [
    { subject: 'Salud General', A: healthData[healthData.length - 1]?.healthScore || 0, fullMark: 100 },
    { subject: 'Adherencia', A: healthData[healthData.length - 1]?.adherenceRate || 0, fullMark: 100 },
    { subject: 'Presión Arterial', A: 100 - (healthData[healthData.length - 1]?.bloodPressure || 0), fullMark: 100 },
    { subject: 'Frecuencia Cardíaca', A: 100 - (healthData[healthData.length - 1]?.heartRate || 0), fullMark: 100 },
    { subject: 'Peso', A: 100 - (healthData[healthData.length - 1]?.weight || 0), fullMark: 100 },
    { subject: 'Glucosa', A: 100 - (healthData[healthData.length - 1]?.glucose || 0), fullMark: 100 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span>Cargando gráficos de salud...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Evolución Temporal */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Evolución de Salud (Último Año)
          </CardTitle>
          <CardDescription>
            Seguimiento de las métricas principales de salud a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="healthScore" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                name="Puntuación de Salud"
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

      {/* Gráfico de Métricas Corporales */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-teal-600" />
            Métricas Corporales
          </CardTitle>
          <CardDescription>
            Seguimiento de presión arterial, frecuencia cardíaca, peso y glucosa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="bloodPressure" 
                stackId="1" 
                stroke={COLORS.danger} 
                fill={COLORS.danger} 
                fillOpacity={0.6}
                name="Presión Arterial"
              />
              <Area 
                type="monotone" 
                dataKey="heartRate" 
                stackId="2" 
                stroke={COLORS.orange} 
                fill={COLORS.orange} 
                fillOpacity={0.6}
                name="Frecuencia Cardíaca"
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stackId="3" 
                stroke={COLORS.purple} 
                fill={COLORS.purple} 
                fillOpacity={0.6}
                name="Peso (kg)"
              />
              <Area 
                type="monotone" 
                dataKey="glucose" 
                stackId="4" 
                stroke={COLORS.warning} 
                fill={COLORS.warning} 
                fillOpacity={0.6}
                name="Glucosa (mg/dL)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Eventos Médicos */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            Distribución de Eventos Médicos
          </CardTitle>
          <CardDescription>
            Análisis de los tipos de eventos médicos por severidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Diagnósticos */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Diagnósticos por Estado
          </CardTitle>
          <CardDescription>
            Distribución de diagnósticos según su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diagnosisData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Adherencia a Tratamientos */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Adherencia a Tratamientos
          </CardTitle>
          <CardDescription>
            Porcentaje de adherencia a los tratamientos médicos actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={treatmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="adherence" fill={COLORS.success} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico Radar de Salud General */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            Perfil de Salud General
          </CardTitle>
          <CardDescription>
            Vista radar de las métricas principales de salud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Salud Actual"
                dataKey="A"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 