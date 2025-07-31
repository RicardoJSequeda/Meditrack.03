"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, Calendar, User, FileText, Clock } from "lucide-react"

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    appointmentType: "",
    status: "",
    doctor: "",
    urgent: false,
    completed: false,
    upcoming: false,
  })

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
    "Dr. García Martínez",
    "Dra. López Hernández",
    "Dr. Rodríguez Silva",
    "Dra. Martínez Torres",
    "Dr. Morales Vega",
  ]

  const statuses = ["Próxima", "Completada", "Cancelada", "Reprogramada"]

  const handleApplyFilters = () => {
    // Aquí iría la lógica para aplicar los filtros
    onClose()
  }

  const handleClearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      appointmentType: "",
      status: "",
      doctor: "",
      urgent: false,
      completed: false,
      upcoming: false,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-500" />
            Filtros Avanzados
          </DialogTitle>
          <DialogDescription>Personaliza tu búsqueda de citas médicas</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rango de Fechas */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Rango de Fechas
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">Desde</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Hasta</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Tipo de Cita */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tipo de Cita
            </Label>
            <Select
              value={filters.appointmentType}
              onValueChange={(value) => setFilters({ ...filters, appointmentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de cita" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estado
            </Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Doctor
            </Label>
            <Select value={filters.doctor} onValueChange={(value) => setFilters({ ...filters, doctor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtros Rápidos */}
          <div className="space-y-3">
            <Label>Filtros Rápidos</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={filters.urgent}
                  onCheckedChange={(checked) => setFilters({ ...filters, urgent: checked as boolean })}
                />
                <Label htmlFor="urgent" className="text-sm">
                  Solo citas urgentes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={filters.completed}
                  onCheckedChange={(checked) => setFilters({ ...filters, completed: checked as boolean })}
                />
                <Label htmlFor="completed" className="text-sm">
                  Solo citas completadas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="upcoming"
                  checked={filters.upcoming}
                  onCheckedChange={(checked) => setFilters({ ...filters, upcoming: checked as boolean })}
                />
                <Label htmlFor="upcoming" className="text-sm">
                  Solo próximas citas
                </Label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClearFilters} className="flex-1 bg-transparent">
              Limpiar Filtros
            </Button>
            <Button type="button" onClick={handleApplyFilters} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
