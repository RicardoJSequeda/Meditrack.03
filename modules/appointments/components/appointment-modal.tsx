"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, MapPin, User, FileText, Bell } from "lucide-react"
import { createAppointment } from '@/hooks/use-appointments'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    doctor: "",
    date: "",
    time: "",
    location: "",
    reason: "",
    urgent: false,
    reminders: {
      day: false,
      hour: false,
      minutes: false,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const appointmentTypes = [
    "Consulta General",
    "Especialista",
    "Pruebas de Laboratorio",
    "Radiología",
    "Vacunación",
    "Consulta Urgente",
    "Telemedicina",
    "Seguimiento",
  ]

  const doctors = [
    "Dr. García Martínez - Cardiología",
    "Dra. López Hernández - Medicina General",
    "Dr. Rodríguez Silva - Dermatología",
    "Dra. Martínez Torres - Endocrinología",
    "Dr. Morales Vega - Medicina General",
  ]

  const locations = [
    "Hospital Central",
    "Clínica San José",
    "Centro Médico Norte",
    "Clínica Urgencias",
    "Laboratorio Central",
    "Centro de Radiología",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.type) newErrors.type = "Selecciona un tipo de consulta"
    if (!formData.doctor) newErrors.doctor = "Selecciona un doctor"
    if (!formData.date) newErrors.date = "Selecciona una fecha"
    if (!formData.time) newErrors.time = "Selecciona una hora"
    if (!formData.location) newErrors.location = "Selecciona una ubicación"

    // Validar que la fecha no sea en el pasado
    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date} ${formData.time}`)
      const now = new Date()
      if (selectedDateTime <= now) {
        newErrors.date = "La fecha y hora deben ser futuras"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Extraer nombre y especialidad
      const [doctorName, specialty] = formData.doctor.split(" - ")
      await createAppointment({
        title: formData.type || formData.reason || "Cita médica",
        date: new Date(`${formData.date}T${formData.time}`).toISOString(), // ISO string
        duration: 30, // número
        doctor: doctorName || formData.doctor,
        specialty: specialty || "",
        location: formData.location,
        notes: formData.reason,
        urgent: formData.urgent,
      })
      // Refrescar la lista de citas (puedes llamar mutate desde el padre si lo pasas como prop)
      alert("¡Cita programada exitosamente!")
      setFormData({
        type: "",
        doctor: "",
        date: "",
        time: "",
        location: "",
        reason: "",
        urgent: false,
        reminders: { day: false, hour: false, minutes: false },
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error("Error al programar cita:", error)
      alert("Error al programar la cita. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      type: "",
      doctor: "",
      date: "",
      time: "",
      location: "",
      reason: "",
      urgent: false,
      reminders: {
        day: false,
        hour: false,
        minutes: false,
      },
    })
    setErrors({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Crear Nueva Cita Médica
          </DialogTitle>
          <DialogDescription>Completa la información para programar tu nueva cita médica</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Consulta */}
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tipo de Consulta *
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Doctor */}
          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Doctor *
            </Label>
            <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
              <SelectTrigger className={errors.doctor ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona o busca un doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctor && <p className="text-sm text-red-500">{errors.doctor}</p>}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? "border-red-500" : ""}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hora *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={errors.time ? "border-red-500" : ""}
                required
              />
              {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación *
            </Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona la ubicación" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Urgencia */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    urgent: checked as boolean,
                  })
                }
              />
              <Label htmlFor="urgent" className="text-sm font-medium text-red-600">
                Marcar como consulta urgente
              </Label>
            </div>
            {formData.urgent && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ Las consultas urgentes tienen prioridad y pueden reprogramar otras citas.
              </p>
            )}
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la Consulta</Label>
            <Textarea
              id="reason"
              placeholder="Describe brevemente el motivo de tu consulta..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
            />
          </div>

          {/* Recordatorios */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Recordatorios
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-day"
                  checked={formData.reminders.day}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, day: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="reminder-day" className="text-sm">
                  1 día antes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-hour"
                  checked={formData.reminders.hour}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, hour: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="reminder-hour" className="text-sm">
                  1 hora antes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-minutes"
                  checked={formData.reminders.minutes}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      reminders: { ...formData.reminders, minutes: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="reminder-minutes" className="text-sm">
                  15 minutos antes
                </Label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm} 
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!formData.type || !formData.doctor || !formData.date || !formData.time || isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Programando...
                </>
              ) : (
                "Crear Cita"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
