"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Stethoscope, Pill, Calendar, FileText, Plus, Save } from "lucide-react"
import { 
  createDiagnosis, 
  createTreatment, 
  createMedicalEvent, 
  createMedicalDocument,
  validateDiagnosisData,
  validateTreatmentData,
  validateMedicalEventData,
  validateMedicalDocumentData,
  uploadFile
} from "@/lib/api-functions"

interface MedicalRecordModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  recordType?: "diagnosis" | "treatment" | "event" | "document"
  existingRecord?: any
}

export default function MedicalRecordModal({
  isOpen,
  onClose,
  mode,
  recordType = "diagnosis",
  existingRecord,
}: MedicalRecordModalProps) {
  const [activeTab, setActiveTab] = useState(recordType)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
  } | null>(null)
  const [formData, setFormData] = useState({
    // Diagnóstico
    condition: "",
    diagnosedDate: "",
    doctor: "",
    specialty: "",
    severity: "",
    status: "",
    lastReading: "",
    nextCheckup: "",
    diagnosisNotes: "",

    // Tratamiento
    medication: "",
    diagnosis: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    prescribedBy: "",
    treatmentNotes: "",
    sideEffects: "",

    // Evento
    eventType: "",
    eventTitle: "",
    eventDate: "",
    location: "",
    eventDoctor: "",
    description: "",
    outcome: "",
    followUp: "",

    // Documento
    documentType: "",
    documentTitle: "",
    documentDate: "",
    documentDoctor: "",
    category: "",
    documentDescription: "",
    results: "",
    recommendations: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    try {
      setIsSubmitting(true)
      setError(null)
      
      const uploadedData = await uploadFile(selectedFile)
      setUploadedFile(uploadedData)
      setSelectedFile(null)
      
      // Limpiar el input de archivo
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Error subiendo archivo:', error)
      setError(error instanceof Error ? error.message : 'Error subiendo archivo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      switch (activeTab) {
        case 'diagnosis':
          const diagnosisData = {
            condition: formData.condition,
            diagnosedDate: formData.diagnosedDate ? new Date(formData.diagnosedDate).toISOString() : '',
            doctor: formData.doctor,
            specialty: formData.specialty,
            severity: formData.severity as 'LEVE' | 'MODERADA' | 'GRAVE',
            status: formData.status as 'ACTIVA' | 'CONTROLADA' | 'RESUELTA',
            lastReading: formData.lastReading || undefined,
            nextCheckup: formData.nextCheckup ? new Date(formData.nextCheckup).toISOString() : undefined,
            notes: formData.diagnosisNotes || undefined
          }
          
          const validatedDiagnosis = validateDiagnosisData(diagnosisData)
          await createDiagnosis(validatedDiagnosis)
          break

        case 'treatment':
          const treatmentData = {
            medication: formData.medication,
            dosage: formData.dosage,
            frequency: formData.frequency,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
            adherence: 0, // Valor por defecto
            status: formData.status as 'ACTIVO' | 'SUSPENDIDO' | 'COMPLETADO',
            sideEffects: formData.sideEffects || undefined,
            doctorNotes: formData.treatmentNotes || undefined,
            prescribedBy: formData.prescribedBy
          }
          
          const validatedTreatment = validateTreatmentData(treatmentData)
          await createTreatment(validatedTreatment)
          break

        case 'event':
          const eventData = {
            type: formData.eventType as 'CIRUGIA' | 'EMERGENCIA' | 'VACUNA' | 'CONSULTA' | 'HOSPITALIZACION' | 'PROCEDIMIENTO',
            title: formData.eventTitle,
            date: formData.eventDate ? new Date(formData.eventDate).toISOString() : '',
            location: formData.location,
            doctor: formData.eventDoctor,
            description: formData.description,
            outcome: formData.outcome,
            followUp: formData.followUp || undefined
          }
          
          const validatedEvent = validateMedicalEventData(eventData)
          await createMedicalEvent(validatedEvent)
          break

        case 'document':
          const documentData = {
            type: formData.documentType as 'ANALISIS' | 'RADIOGRAFIA' | 'INFORME' | 'RECETA' | 'CERTIFICADO' | 'NOTA',
            title: formData.documentTitle,
            date: formData.documentDate ? new Date(formData.documentDate).toISOString() : '',
            doctor: formData.documentDoctor,
            category: formData.category,
            description: formData.documentDescription,
            fileUrl: uploadedFile?.fileUrl,
            fileName: uploadedFile?.fileName,
            fileSize: uploadedFile?.fileSize,
            fileType: uploadedFile?.fileType,
            results: formData.results || undefined,
            recommendations: formData.recommendations || undefined
          }
          
          const validatedDocument = validateMedicalDocumentData(documentData)
          await createMedicalDocument(validatedDocument)
          break

        default:
          throw new Error('Tipo de registro no válido')
      }

      // Si llegamos aquí, el registro se creó exitosamente
      resetForm()
      onClose()
      
      // Opcional: mostrar mensaje de éxito
      alert('Registro creado exitosamente')
      
    } catch (error) {
      console.error('Error creando registro:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      condition: "",
      diagnosedDate: "",
      doctor: "",
      specialty: "",
      severity: "",
      status: "",
      lastReading: "",
      nextCheckup: "",
      diagnosisNotes: "",
      medication: "",
      diagnosis: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      prescribedBy: "",
      treatmentNotes: "",
      sideEffects: "",
      eventType: "",
      eventTitle: "",
      eventDate: "",
      location: "",
      eventDoctor: "",
      description: "",
      outcome: "",
      followUp: "",
      documentType: "",
      documentTitle: "",
      documentDate: "",
      documentDoctor: "",
      category: "",
      documentDescription: "",
      results: "",
      recommendations: "",
    })
    setSelectedFile(null)
    setUploadedFile(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            {mode === "add" ? "Añadir Nuevo Registro Médico" : "Editar Registro Médico"}
          </DialogTitle>
          <DialogDescription>
            Completa la información del registro médico. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "diagnosis" | "treatment" | "event" | "document")} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnosis" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnóstico</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Tratamiento</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Evento</span>
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documento</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Formulario de Diagnóstico */}
            <TabsContent value="diagnosis" className="space-y-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5" />
                  Nuevo Diagnóstico Médico
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condición Médica *</Label>
                    <Input
                      id="condition"
                      placeholder="Ej: Hipertensión Arterial"
                      value={formData.condition}
                      onChange={(e) => handleInputChange("condition", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosedDate">Fecha de Diagnóstico *</Label>
                    <Input
                      id="diagnosedDate"
                      type="date"
                      value={formData.diagnosedDate}
                      onChange={(e) => handleInputChange("diagnosedDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Médico Responsable *</Label>
                    <Input
                      id="doctor"
                      placeholder="Dr. García Martínez"
                      value={formData.doctor}
                      onChange={(e) => handleInputChange("doctor", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidad</Label>
                    <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiologia">Cardiología</SelectItem>
                        <SelectItem value="endocrinologia">Endocrinología</SelectItem>
                        <SelectItem value="neurologia">Neurología</SelectItem>
                        <SelectItem value="reumatologia">Reumatología</SelectItem>
                        <SelectItem value="medicina-general">Medicina General</SelectItem>
                        <SelectItem value="dermatologia">Dermatología</SelectItem>
                        <SelectItem value="gastroenterologia">Gastroenterología</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severidad *</Label>
                    <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEVE">Leve</SelectItem>
                        <SelectItem value="MODERADA">Moderada</SelectItem>
                        <SelectItem value="GRAVE">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado Actual *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVA">Activa</SelectItem>
                        <SelectItem value="CONTROLADA">Controlada</SelectItem>
                        <SelectItem value="RESUELTA">Resuelta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastReading">Última Lectura</Label>
                    <Input
                      id="lastReading"
                      placeholder="Ej: 125/82 mmHg"
                      value={formData.lastReading}
                      onChange={(e) => handleInputChange("lastReading", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextCheckup">Próximo Control</Label>
                    <Input
                      id="nextCheckup"
                      type="date"
                      value={formData.nextCheckup}
                      onChange={(e) => handleInputChange("nextCheckup", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="diagnosisNotes">Notas Médicas</Label>
                  <Textarea
                    id="diagnosisNotes"
                    placeholder="Notas adicionales del médico, instrucciones especiales, observaciones..."
                    value={formData.diagnosisNotes}
                    onChange={(e) => handleInputChange("diagnosisNotes", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Formulario de Tratamiento */}
            <TabsContent value="treatment" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-4">
                  <Pill className="w-5 h-5" />
                  Nuevo Tratamiento o Medicamento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medicamento *</Label>
                    <Input
                      id="medication"
                      placeholder="Ej: Lisinopril"
                      value={formData.medication}
                      onChange={(e) => handleInputChange("medication", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Para Diagnóstico *</Label>
                    <Input
                      id="diagnosis"
                      placeholder="Ej: Hipertensión Arterial"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosis *</Label>
                    <Input
                      id="dosage"
                      placeholder="Ej: 10mg"
                      value={formData.dosage}
                      onChange={(e) => handleInputChange("dosage", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frecuencia *</Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 vez al día">1 vez al día</SelectItem>
                        <SelectItem value="2 veces al día">2 veces al día</SelectItem>
                        <SelectItem value="3 veces al día">3 veces al día</SelectItem>
                        <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                        <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                        <SelectItem value="Según necesidad">Según necesidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Fin (opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prescribedBy">Prescrito por *</Label>
                    <Input
                      id="prescribedBy"
                      placeholder="Dr. García Martínez"
                      value={formData.prescribedBy}
                      onChange={(e) => handleInputChange("prescribedBy", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatmentStatus">Estado del Tratamiento *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                        <SelectItem value="COMPLETADO">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sideEffects">Efectos Secundarios (separados por comas)</Label>
                    <Input
                      id="sideEffects"
                      placeholder="Ej: Náuseas leves, Mareos ocasionales"
                      value={formData.sideEffects}
                      onChange={(e) => handleInputChange("sideEffects", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatmentNotes">Instrucciones del Médico</Label>
                    <Textarea
                      id="treatmentNotes"
                      placeholder="Instrucciones especiales, horarios de toma, precauciones..."
                      value={formData.treatmentNotes}
                      onChange={(e) => handleInputChange("treatmentNotes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Formulario de Evento */}
            <TabsContent value="event" className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  Nuevo Evento Médico
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Tipo de Evento *</Label>
                    <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIRUGIA">Cirugía</SelectItem>
                        <SelectItem value="EMERGENCIA">Emergencia</SelectItem>
                        <SelectItem value="VACUNA">Vacuna</SelectItem>
                        <SelectItem value="CONSULTA">Consulta Especializada</SelectItem>
                        <SelectItem value="HOSPITALIZACION">Hospitalización</SelectItem>
                        <SelectItem value="PROCEDIMIENTO">Procedimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Título del Evento *</Label>
                    <Input
                      id="eventTitle"
                      placeholder="Ej: Apendicectomía Laparoscópica"
                      value={formData.eventTitle}
                      onChange={(e) => handleInputChange("eventTitle", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Fecha del Evento *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      placeholder="Ej: Hospital Central"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="eventDoctor">Médico Responsable *</Label>
                    <Input
                      id="eventDoctor"
                      placeholder="Dr. Morales Vega"
                      value={formData.eventDoctor}
                      onChange={(e) => handleInputChange("eventDoctor", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción del Evento *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe detalladamente qué ocurrió durante el evento..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outcome">Resultado/Desenlace</Label>
                    <Textarea
                      id="outcome"
                      placeholder="Describe el resultado del evento, complicaciones, etc..."
                      value={formData.outcome}
                      onChange={(e) => handleInputChange("outcome", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUp">Seguimiento Requerido</Label>
                    <Textarea
                      id="followUp"
                      placeholder="Instrucciones de seguimiento, próximas citas, cuidados..."
                      value={formData.followUp}
                      onChange={(e) => handleInputChange("followUp", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Formulario de Documento */}
            <TabsContent value="document" className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5" />
                  Nuevo Documento Médico
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Tipo de Documento *</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => handleInputChange("documentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANALISIS">Análisis de Laboratorio</SelectItem>
                        <SelectItem value="RADIOGRAFIA">Radiografía</SelectItem>
                        <SelectItem value="INFORME">Informe Médico</SelectItem>
                        <SelectItem value="RECETA">Receta Médica</SelectItem>
                        <SelectItem value="CERTIFICADO">Certificado Médico</SelectItem>
                        <SelectItem value="NOTA">Nota de Consulta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentTitle">Título del Documento *</Label>
                    <Input
                      id="documentTitle"
                      placeholder="Ej: Perfil Lipídico Completo"
                      value={formData.documentTitle}
                      onChange={(e) => handleInputChange("documentTitle", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentDate">Fecha del Documento *</Label>
                    <Input
                      id="documentDate"
                      type="date"
                      value={formData.documentDate}
                      onChange={(e) => handleInputChange("documentDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentDoctor">Médico Responsable *</Label>
                    <Input
                      id="documentDoctor"
                      placeholder="Dr. García Martínez"
                      value={formData.documentDoctor}
                      onChange={(e) => handleInputChange("documentDoctor", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                        <SelectItem value="Imagenología">Imagenología</SelectItem>
                        <SelectItem value="Cardiología">Cardiología</SelectItem>
                        <SelectItem value="Endocrinología">Endocrinología</SelectItem>
                        <SelectItem value="Neurología">Neurología</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentDescription">Descripción *</Label>
                    <Textarea
                      id="documentDescription"
                      placeholder="Describe el propósito y contenido del documento..."
                      value={formData.documentDescription}
                      onChange={(e) => handleInputChange("documentDescription", e.target.value)}
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="results">Resultados</Label>
                    <Textarea
                      id="results"
                      placeholder="Resultados principales del documento (valores, hallazgos, etc.)"
                      value={formData.results}
                      onChange={(e) => handleInputChange("results", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Recomendaciones</Label>
                    <Textarea
                      id="recommendations"
                      placeholder="Recomendaciones del médico basadas en los resultados..."
                      value={formData.recommendations}
                      onChange={(e) => handleInputChange("recommendations", e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Sección de subida de archivos */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-input">Archivo Adjunto</Label>
                      <div className="flex gap-2">
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.xlsx,.xls,.docx,.doc,.txt,.jpg,.jpeg,.png,.gif,.webp"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={!selectedFile || isSubmitting}
                          size="sm"
                        >
                          {isSubmitting ? 'Subiendo...' : 'Subir'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Formatos permitidos: PDF, Excel, Word, TXT, imágenes (máx. 10MB)
                      </p>
                    </div>

                    {/* Mostrar archivo subido */}
                    {uploadedFile && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Archivo subido exitosamente
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-green-700">
                          <p><strong>Nombre:</strong> {uploadedFile.fileName}</p>
                          <p><strong>Tamaño:</strong> {(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          <p><strong>Tipo:</strong> {uploadedFile.fileType}</p>
                        </div>
                      </div>
                    )}

                    {/* Mostrar archivo seleccionado */}
                    {selectedFile && !uploadedFile && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Archivo seleccionado
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-blue-700">
                          <p><strong>Nombre:</strong> {selectedFile.name}</p>
                          <p><strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <p><strong>Tipo:</strong> {selectedFile.type}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <Separator />

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : (mode === "add" ? "Guardar Registro" : "Actualizar Registro")}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
