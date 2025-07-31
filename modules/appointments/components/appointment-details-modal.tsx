"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  Bell,
  CalendarDays,
  Share,
  Edit,
  Trash2,
  Navigation,
} from "lucide-react"

interface AppointmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
}

export default function AppointmentDetailsModal({ isOpen, onClose, appointment }: AppointmentDetailsModalProps) {
  if (!appointment) return null

  const getStatusColor = (status: string, urgent: boolean) => {
    if (urgent) return "bg-red-100 text-red-800 border-red-200"
    switch (status) {
      case "próxima":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completada":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelada":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleReschedule = () => {
    // Aquí iría la lógica para reprogramar la cita
    onClose()
  }

  const handleCancel = () => {
    // Aquí iría la lógica para cancelar la cita
    onClose()
  }

  const handleAddToCalendar = () => {
    // Aquí iría la lógica para agregar al calendario
    onClose()
  }

  const handleShare = () => {
    // Aquí iría la lógica para compartir la cita
    onClose()
  }

  const handleGetDirections = () => {
    // Aquí iría la lógica para obtener direcciones
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{appointment.title}</DialogTitle>
              <DialogDescription className="text-lg mt-1">
                {appointment.doctor} - {appointment.specialty}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(appointment.status, appointment.urgent)}>
              {appointment.urgent ? "Urgente" : appointment.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Fecha</p>
                  <p className="text-blue-700">
                    {new Date(appointment.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Hora</p>
                  <p className="text-green-700">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Ubicación</p>
                  <p className="text-red-700">{appointment.location}</p>
                  <p className="text-red-600 text-sm">{appointment.address}</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleGetDirections}>
                  <Navigation className="w-3 h-3 mr-1" />
                  Ruta
                </Button>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Teléfono</p>
                  <p className="text-purple-700">{appointment.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalles Adicionales */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Doctor</p>
                <p className="text-gray-700">{appointment.doctor}</p>
                <p className="text-gray-600 text-sm">{appointment.specialty}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Tipo de Consulta</p>
                <p className="text-gray-700">{appointment.type}</p>
              </div>
            </div>

            {appointment.reason && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-900 mb-2">Motivo de la Consulta</p>
                <p className="text-yellow-800">{appointment.reason}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Recordatorios */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Recordatorios Configurados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">1 día antes</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                <Bell className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">1 hora antes</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
                <Bell className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-800">15 minutos antes</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Acciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleAddToCalendar} className="bg-transparent">
                <CalendarDays className="w-4 h-4 mr-2" />
                Agregar al Calendario
              </Button>
              <Button variant="outline" onClick={handleShare} className="bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                Compartir Cita
              </Button>
              <Button variant="outline" onClick={handleReschedule} className="bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Reprogramar
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar Cita
              </Button>
            </div>
          </div>

          {/* Botón de Cerrar */}
          <div className="pt-4">
            <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
