"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Pill, Heart, Activity, TrendingUp, Calendar, Target } from "lucide-react"

interface DetailedReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportType: string
}

export default function DetailedReportModal({ isOpen, onClose, reportType }: DetailedReportModalProps) {
  const getReportData = () => {
    switch (reportType) {
      case "adherencia":
        return {
          title: "Reporte Detallado de Adherencia",
          icon: Pill,
          color: "green",
          data: [
            { day: "Lunes", taken: 3, total: 3, percentage: 100 },
            { day: "Martes", taken: 2, total: 3, percentage: 67 },
            { day: "Miércoles", taken: 3, total: 3, percentage: 100 },
            { day: "Jueves", taken: 3, total: 3, percentage: 100 },
            { day: "Viernes", taken: 3, total: 3, percentage: 100 },
            { day: "Sábado", taken: 2, total: 3, percentage: 67 },
            { day: "Domingo", taken: 3, total: 3, percentage: 100 },
          ],
          summary: "Has tomado 19 de 20 dosis esta semana (95%)",
          recommendation:
            "¡Excelente trabajo! Mantén esta consistencia para obtener los mejores resultados de tu tratamiento.",
          motivation: "Tu dedicación al tratamiento es admirable. ¡Sigue así!",
        }
      case "presion":
        return {
          title: "Reporte Detallado de Presión Arterial",
          icon: Heart,
          color: "red",
          data: [
            { day: "Lunes", systolic: 118, diastolic: 78, status: "Normal" },
            { day: "Martes", systolic: 122, diastolic: 82, status: "Normal" },
            { day: "Miércoles", systolic: 120, diastolic: 80, status: "Normal" },
            { day: "Jueves", systolic: 115, diastolic: 75, status: "Óptima" },
            { day: "Viernes", systolic: 119, diastolic: 79, status: "Normal" },
            { day: "Sábado", systolic: 121, diastolic: 81, status: "Normal" },
            { day: "Domingo", systolic: 120, diastolic: 80, status: "Normal" },
          ],
          summary: "Promedio semanal: 119/79 mmHg (Normal)",
          recommendation:
            "Tu presión arterial se mantiene en rangos normales. Continúa con tu medicación y estilo de vida saludable.",
          motivation: "Tus números muestran que estás cuidando bien tu corazón. ¡Felicitaciones!",
        }
      case "actividad":
        return {
          title: "Reporte Detallado de Actividad Física",
          icon: Activity,
          color: "blue",
          data: [
            { day: "Lunes", steps: 8500, calories: 320, goal: 8000 },
            { day: "Martes", steps: 7200, calories: 280, goal: 8000 },
            { day: "Miércoles", steps: 9100, calories: 350, goal: 8000 },
            { day: "Jueves", steps: 6800, calories: 260, goal: 8000 },
            { day: "Viernes", steps: 8900, calories: 340, goal: 8000 },
            { day: "Sábado", steps: 10200, calories: 390, goal: 8000 },
            { day: "Domingo", steps: 7500, calories: 290, goal: 8000 },
          ],
          summary: "Total semanal: 58,200 pasos | 2,230 calorías quemadas",
          recommendation: "Has alcanzado tu objetivo 5 de 7 días. Intenta ser más consistente para mejores resultados.",
          motivation: "¡Cada paso cuenta! Tu esfuerzo por mantenerte activo es inspirador.",
        }
      case "glucosa":
        return {
          title: "Reporte Detallado de Glucosa",
          icon: Activity,
          color: "blue",
          data: [
            { day: "Lunes", value: 92, status: "Normal", meal: "Ayunas" },
            { day: "Martes", value: 95, status: "Normal", meal: "Ayunas" },
            { day: "Miércoles", value: 98, status: "Normal", meal: "Ayunas" },
            { day: "Jueves", value: 89, status: "Óptima", meal: "Ayunas" },
            { day: "Viernes", value: 94, status: "Normal", meal: "Ayunas" },
            { day: "Sábado", value: 97, status: "Normal", meal: "Ayunas" },
            { day: "Domingo", value: 91, status: "Normal", meal: "Ayunas" },
          ],
          summary: "Promedio semanal: 94 mg/dL (Normal)",
          recommendation: "Tus niveles de glucosa están bien controlados. Mantén tu dieta y medicación actual.",
          motivation: "¡Excelente control! Tus hábitos saludables están dando resultados.",
        }
      case "peso":
        return {
          title: "Reporte Detallado de Peso",
          icon: Activity,
          color: "purple",
          data: [
            { day: "Lunes", value: 70.2, change: -0.3, trend: "down" },
            { day: "Martes", value: 70.0, change: -0.2, trend: "down" },
            { day: "Miércoles", value: 69.8, change: -0.2, trend: "down" },
            { day: "Jueves", value: 69.9, change: 0.1, trend: "up" },
            { day: "Viernes", value: 69.7, change: -0.2, trend: "down" },
            { day: "Sábado", value: 69.5, change: -0.2, trend: "down" },
            { day: "Domingo", value: 69.3, change: -0.2, trend: "down" },
          ],
          summary: "Cambio semanal: -1.2 kg | Tendencias positivas",
          recommendation: "Estás perdiendo peso de manera saludable. Continúa con tu rutina de ejercicio y dieta.",
          motivation: "¡Increíble progreso! Tu dedicación está transformando tu salud.",
        }
      default:
        return null
    }
  }

  const reportData = getReportData()

  if (!reportData) return null

  const IconComponent = reportData.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className={`w-5 h-5 text-${reportData.color}-500`} />
            {reportData.title}
          </DialogTitle>
          <DialogDescription>Análisis detallado de los últimos 7 días</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen */}
          <div className={`bg-${reportData.color}-50 p-4 rounded-lg border border-${reportData.color}-200`}>
            <h3 className="font-medium text-gray-900 mb-2">Resumen Semanal</h3>
            <p className={`text-${reportData.color}-800`}>{reportData.summary}</p>
          </div>

          {/* Datos día por día */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Datos Diarios</h3>
            <div className="space-y-2">
              {reportData.data.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 w-20">{item.day}</span>
                    {reportType === "adherencia" && (
                      <div className="flex items-center space-x-2">
                        <Progress value={item.percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">
                          {item.taken}/{item.total}
                        </span>
                      </div>
                    )}
                    {reportType === "presion" && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {item.systolic}/{item.diastolic}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    )}
                    {reportType === "actividad" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{item.steps.toLocaleString()} pasos</span>
                        <span className="text-xs text-gray-500">{item.calories} cal</span>
                      </div>
                    )}
                    {reportType === "glucosa" && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{item.value} mg/dL</span>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.meal}</span>
                      </div>
                    )}
                    {reportType === "peso" && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{item.value} kg</span>
                        <span className={`text-xs ${item.trend === "down" ? "text-green-600" : "text-red-600"}`}>
                          {item.change > 0 ? "+" : ""}{item.change} kg
                        </span>
                      </div>
                    )}
                  </div>
                  {reportType === "adherencia" && (
                    <span
                      className={`text-sm font-medium ${item.percentage === 100 ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {item.percentage}%
                    </span>
                  )}
                  {reportType === "actividad" && (
                    <div className="flex items-center space-x-2">
                      {item.steps >= item.goal ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Target className="w-3 h-3 mr-1" />
                          Objetivo
                        </Badge>
                      ) : (
                        <Badge variant="outline">{Math.round((item.steps / item.goal) * 100)}%</Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recomendaciones
            </h3>
            <p className="text-blue-800 text-sm">{reportData.recommendation}</p>
          </div>

          {/* Mensaje motivacional */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-900 mb-2">💪 Mensaje Motivacional</h3>
            <p className="text-purple-800 text-sm">{reportData.motivation}</p>
          </div>

          {/* Acciones */}
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Programar Seguimiento
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Compartir con Médico
            </Button>
            <Button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
