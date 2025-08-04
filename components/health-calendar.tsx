"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Pill, Thermometer, Activity, Stethoscope } from "lucide-react"

export default function HealthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const events = {
    "2025-01-15": [
      { type: "appointment", title: "Cita con Dr. García", time: "10:00 AM" },
      { type: "medication", title: "Aspirina", time: "8:00 AM" },
    ],
    "2025-01-16": [
      { type: "medication", title: "Lisinopril", time: "8:00 AM" },
      { type: "exercise", title: "Caminata", time: "6:00 PM" },
    ],
    "2025-01-17": [{ type: "symptom", title: "Dolor de cabeza leve", time: "2:00 PM" }],
    "2025-01-18": [
      { type: "test", title: "Análisis de sangre", time: "9:00 AM" },
      { type: "medication", title: "Aspirina", time: "8:00 AM" },
    ],
    "2025-01-20": [{ type: "appointment", title: "Consulta virtual", time: "3:00 PM" }],
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-3 h-3" />
      case "medication":
        return <Pill className="w-3 h-3" />
      case "symptom":
        return <Thermometer className="w-3 h-3" />
      case "exercise":
        return <Activity className="w-3 h-3" />
      case "test":
        return <Stethoscope className="w-3 h-3" />
      default:
        return <Calendar className="w-3 h-3" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800"
      case "medication":
        return "bg-green-100 text-green-800"
      case "symptom":
        return "bg-red-100 text-red-800"
      case "exercise":
        return "bg-purple-100 text-purple-800"
      case "test":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="space-y-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {/* Espacios vacíos para el primer día del mes */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="p-2 h-20"></div>
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
          const dayEvents = (events as Record<string, any[]>)[dateKey] || []
          const isToday =
            new Date().toDateString() ===
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

          return (
            <div
              key={day}
              className={`p-1 h-20 border rounded-lg ${isToday ? "bg-blue-50 border-blue-200" : "border-gray-200"} hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</span>
                {dayEvents.length > 0 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-xs p-1 rounded flex items-center space-x-1 ${getEventColor(event.type)}`}
                  >
                    {getEventIcon(event.type)}
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">+{dayEvents.length - 2} más</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-blue-600" />
          <span>Citas</span>
        </div>
        <div className="flex items-center space-x-1">
          <Pill className="w-3 h-3 text-green-600" />
          <span>Medicamentos</span>
        </div>
        <div className="flex items-center space-x-1">
          <Thermometer className="w-3 h-3 text-red-600" />
          <span>Síntomas</span>
        </div>
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3 text-purple-600" />
          <span>Ejercicio</span>
        </div>
        <div className="flex items-center space-x-1">
          <Stethoscope className="w-3 h-3 text-orange-600" />
          <span>Pruebas</span>
        </div>
      </div>
    </div>
  )
}
