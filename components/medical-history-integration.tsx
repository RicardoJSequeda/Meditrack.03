"use client"

import { useEffect, useState } from 'react'
import { useApi, useAuth } from '@/hooks/use-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Heart, 
  Pill, 
  Activity, 
  FileText, 
  User, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react'

interface MedicalData {
  user: any
  diagnoses: any[]
  treatments: any[]
  events: any[]
  documents: any[]
  stats: {
    diagnoses: number
    treatments: number
    events: number
    documents: number
    activeTreatments: number
    controlledConditions: number
    activeConditions: number
  }
}

export default function MedicalHistoryIntegration() {
  const { user, checkAuth } = useAuth()
  const { loading, error, data, get } = useApi<MedicalData>()
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null)

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Cargar datos médicos cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      loadMedicalData()
    }
  }, [user])

  const loadMedicalData = async () => {
    try {
      const result = await get('/api/medical-history')
      if (result.success && result.data) {
        setMedicalData(result.data)
      }
    } catch (error) {
      console.error('Error loading medical data:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Acceso Requerido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Necesitas iniciar sesión para acceder a tu historial médico.
            </p>
            <Button className="w-full" onClick={() => window.location.href = '/auth/login'}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
        <Alert className="max-w-md mx-auto mt-20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Error al cargar los datos médicos: {error}</p>
              <Button onClick={loadMedicalData} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!medicalData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bienvenido, {medicalData.user.name}
              </h1>
              <p className="text-blue-100 mt-1">
                Tu historial médico está sincronizado con la base de datos
              </p>
            </div>
          </div>
          <Button 
            onClick={loadMedicalData}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800">
                {medicalData.stats.controlledConditions} Controladas
              </Badge>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900">
                {medicalData.stats.diagnoses}
              </h3>
              <p className="text-green-700 font-medium">Diagnósticos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {medicalData.stats.activeTreatments} Activos
              </Badge>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900">
                {medicalData.stats.treatments}
              </h3>
              <p className="text-blue-700 font-medium">Tratamientos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Reciente</Badge>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-900">
                {medicalData.stats.events}
              </h3>
              <p className="text-purple-700 font-medium">Eventos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-800">Actualizado</Badge>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-900">
                {medicalData.stats.documents}
              </h3>
              <p className="text-orange-700 font-medium">Documentos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Usuario */}
      <Card className="bg-gradient-to-r from-white to-blue-50 border-blue-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {medicalData.user.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {medicalData.user.email}
                  </p>
                  {medicalData.user.bloodType && (
                    <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 text-sm">
                      🩸 Tipo: {medicalData.user.bloodType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Información de Contacto</h4>
                  <div className="space-y-3">
                    {medicalData.user.phone && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">{medicalData.user.phone}</p>
                          <p className="text-xs text-gray-500">Teléfono</p>
                        </div>
                      </div>
                    )}
                    {medicalData.user.address && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{medicalData.user.address}</p>
                          <p className="text-xs text-gray-500">Dirección</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Información Médica</h4>
                  <div className="space-y-3">
                    {medicalData.user.emergencyContact && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Contacto de Emergencia</p>
                        <p className="font-medium text-gray-900">{medicalData.user.emergencyContact}</p>
                      </div>
                    )}
                    {medicalData.user.gender && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Género</p>
                        <p className="font-medium text-gray-900">{medicalData.user.gender}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Diagnósticos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medicalData.diagnoses.length > 0 ? (
              <div className="space-y-3">
                {medicalData.diagnoses.slice(0, 3).map((diagnosis) => (
                  <div key={diagnosis.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{diagnosis.condition}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(diagnosis.diagnosedDate).toLocaleDateString('es-ES')} • {diagnosis.doctor}
                    </p>
                    <Badge className={`mt-2 ${
                      diagnosis.status === 'CONTROLADA' ? 'bg-green-100 text-green-800' :
                      diagnosis.status === 'ACTIVA' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {diagnosis.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay diagnósticos registrados</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              Tratamientos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medicalData.treatments.filter(t => t.status === 'ACTIVO').length > 0 ? (
              <div className="space-y-3">
                {medicalData.treatments
                  .filter(t => t.status === 'ACTIVO')
                  .slice(0, 3)
                  .map((treatment) => (
                    <div key={treatment.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{treatment.medication}</h4>
                      <p className="text-sm text-gray-600">
                        {treatment.dosage} • {treatment.frequency}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Adherencia: {treatment.adherence}%
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay tratamientos activos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estado de Sincronización */}
      <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Sincronización Activa</h4>
              <p className="text-green-700 text-sm">
                Los datos están sincronizados con la base de datos MySQL en tiempo real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 