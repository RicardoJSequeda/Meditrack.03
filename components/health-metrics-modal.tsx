"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Droplets, Weight, Thermometer, Eye, Activity } from "lucide-react"

interface HealthMetricsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HealthMetricsModal({ isOpen, onClose }: HealthMetricsModalProps) {
  const [selectedMetric, setSelectedMetric] = useState("")
  const [formData, setFormData] = useState<any>({})

  const metrics = [
    { id: "blood-pressure", name: "Presión Arterial", icon: Heart, fields: ["systolic", "diastolic"] },
    { id: "glucose", name: "Glucosa", icon: Droplets, fields: ["value"] },
    { id: "weight", name: "Peso", icon: Weight, fields: ["value"] },
    { id: "temperature", name: "Temperatura", icon: Thermometer, fields: ["value"] },
    { id: "oxygen", name: "Oxígeno", icon: Eye, fields: ["value"] },
    { id: "heart-rate", name: "Frecuencia Cardíaca", icon: Activity, fields: ["value"] },
  ]

  const handleSave = () => {
    // Aquí iría la lógica para guardar la medición
    onClose()
  }

  const selectedMetricData = metrics.find((m) => m.id === selectedMetric)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Medición de Salud</DialogTitle>
          <DialogDescription>Selecciona el tipo de medición y completa los datos</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metric-type">Tipo de Medición</Label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una medición" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    <div className="flex items-center space-x-2">
                      <metric.icon className="w-4 h-4" />
                      <span>{metric.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMetricData && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <selectedMetricData.icon className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{selectedMetricData.name}</span>
              </div>

              {selectedMetricData.fields.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>
                    {field === "systolic"
                      ? "Sistólica"
                      : field === "diastolic"
                        ? "Diastólica"
                        : field === "value"
                          ? "Valor"
                          : field}
                  </Label>
                  <Input
                    id={field}
                    type="number"
                    placeholder={
                      field === "systolic"
                        ? "120"
                        : field === "diastolic"
                          ? "80"
                          : selectedMetric === "glucose"
                            ? "95"
                            : selectedMetric === "weight"
                              ? "68.5"
                              : selectedMetric === "temperature"
                                ? "36.8"
                                : selectedMetric === "oxygen"
                                  ? "98"
                                  : selectedMetric === "heart-rate"
                                    ? "72"
                                    : ""
                    }
                    value={formData[field] || ""}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  placeholder="Agregar notas sobre esta medición..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedMetric} className="flex-1 bg-green-600 hover:bg-green-700">
              Guardar Medición
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
