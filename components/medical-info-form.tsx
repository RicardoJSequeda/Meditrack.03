import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, AlertCircle, CheckCircle, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useEmergencyContacts } from '@/hooks/use-emergency'

interface MedicalInfoFormProps {
  initialData?: any
  onSave: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]

const COMMON_ALLERGIES = [
  'Penicilina', 'Amoxicilina', 'Mariscos', 'Nueces', 'Lácteos', 'Huevos',
  'Soya', 'Trigo', 'Polen', 'Ácaros', 'Látex', 'Polvo', 'Moho', 'Picaduras de insectos'
]

const COMMON_MEDICATIONS = [
  'Aspirina', 'Ibuprofeno', 'Paracetamol', 'Lisinopril', 'Metformina',
  'Atorvastatina', 'Omeprazol', 'Vitamina D', 'Omega 3', 'Calcio',
  'Hierro', 'Ácido fólico', 'Insulina', 'Warfarina', 'Digoxina'
]

const COMMON_CONDITIONS = [
  'Hipertensión', 'Diabetes Tipo 1', 'Diabetes Tipo 2', 'Artritis',
  'Asma', 'EPOC', 'Enfermedad cardíaca', 'Colesterol alto',
  'Obesidad', 'Depresión', 'Ansiedad', 'Epilepsia', 'Cáncer',
  'Enfermedad renal', 'Enfermedad hepática', 'Tiroides'
]

export function MedicalInfoForm({ initialData, onSave, onCancel, isLoading }: MedicalInfoFormProps) {
  const [formData, setFormData] = useState({
    bloodType: '',
    allergies: [] as string[],
    medications: [] as string[],
    conditions: [] as string[],
    emergencyContact: '',
    weight: '',
    height: '',
    insuranceNumber: ''
  })

  const [newAllergy, setNewAllergy] = useState('')
  const [newMedication, setNewMedication] = useState('')
  const [newCondition, setNewCondition] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Obtener contactos de emergencia
  const { contacts: emergencyContacts, isLoading: contactsLoading } = useEmergencyContacts()

  useEffect(() => {
    if (initialData) {
      setFormData({
        bloodType: initialData.bloodType || '',
        allergies: initialData.allergies || [],
        medications: initialData.medications || [],
        conditions: initialData.conditions || [],
        emergencyContact: initialData.emergencyContact || '',
        weight: initialData.weight || '',
        height: initialData.height || '',
        insuranceNumber: initialData.insuranceNumber || ''
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.bloodType) {
      newErrors.bloodType = 'El tipo de sangre es requerido'
    }

    if (!formData.emergencyContact) {
      newErrors.emergencyContact = 'El contacto de emergencia es requerido'
    }

    if (!formData.weight) {
      newErrors.weight = 'El peso es requerido'
    }

    if (!formData.height) {
      newErrors.height = 'La altura es requerida'
    }

    if (!formData.insuranceNumber) {
      newErrors.insuranceNumber = 'El número de seguro es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      })
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error guardando información médica:', error)
    }
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy('')
    }
  }

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications.includes(newMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }))
      setNewMedication('')
    }
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (newCondition.trim() && !formData.conditions.includes(newCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }))
      setNewCondition('')
    }
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  // Generar opciones de contactos para el select
  const contactOptions = emergencyContacts?.map((contact: any) => ({
    value: `${contact.name} - ${contact.relationship}`,
    label: `${contact.name} (${contact.relationship}) - ${contact.phone}`
  })) || []

  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Información Básica
          </CardTitle>
          <CardDescription>Datos personales y de contacto de emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Tipo de Sangre *</Label>
              <Select value={formData.bloodType} onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}>
                <SelectTrigger className={errors.bloodType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona tu tipo de sangre" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodType && <p className="text-sm text-red-500">{errors.bloodType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Contacto de Emergencia *
              </Label>
              <Select value={formData.emergencyContact} onValueChange={(value) => setFormData(prev => ({ ...prev, emergencyContact: value }))}>
                <SelectTrigger className={errors.emergencyContact ? 'border-red-500' : ''}>
                  <SelectValue placeholder={contactsLoading ? "Cargando contactos..." : "Selecciona un contacto de emergencia"} />
                </SelectTrigger>
                <SelectContent>
                  {contactOptions.length > 0 ? (
                    contactOptions.map((contact: { value: string; label: string }) => (
                      <SelectItem key={contact.value} value={contact.value}>
                        {contact.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay contactos disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.emergencyContact && <p className="text-sm text-red-500">{errors.emergencyContact}</p>}
              {contactOptions.length === 0 && !contactsLoading && (
                <p className="text-sm text-orange-600">
                  ⚠️ No hay contactos de emergencia configurados. 
                  <br />
                  Ve a la sección "Contactos de Emergencia" para agregar contactos primero.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso *</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Ej: 70 kg"
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura *</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                placeholder="Ej: 165 cm"
                className={errors.height ? 'border-red-500' : ''}
              />
              {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceNumber">Número de Seguro *</Label>
              <Input
                id="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                placeholder="Ej: INS-123456789"
                className={errors.insuranceNumber ? 'border-red-500' : ''}
              />
              {errors.insuranceNumber && <p className="text-sm text-red-500">{errors.insuranceNumber}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alergias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Alergias Críticas
          </CardTitle>
          <CardDescription>Lista de alergias que pueden ser peligrosas en emergencias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newAllergy} onValueChange={setNewAllergy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona una alergia común" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_ALLERGIES.map(allergy => (
                  <SelectItem key={allergy} value={allergy}>{allergy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="O escribe una alergia personalizada"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addAllergy} disabled={!newAllergy.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeAllergy(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Medicamentos Actuales
          </CardTitle>
          <CardDescription>Lista de medicamentos que tomas regularmente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newMedication} onValueChange={setNewMedication}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona un medicamento común" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_MEDICATIONS.map(medication => (
                  <SelectItem key={medication} value={medication}>{medication}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="O escribe un medicamento personalizado"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addMedication} disabled={!newMedication.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.medications.map((medication, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {medication}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeMedication(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condiciones Médicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Condiciones Médicas
          </CardTitle>
          <CardDescription>Enfermedades o condiciones médicas importantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newCondition} onValueChange={setNewCondition}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona una condición común" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="O escribe una condición personalizada"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addCondition} disabled={!newCondition.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.conditions.map((condition, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {condition}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeCondition(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Información Médica'}
        </Button>
      </div>
    </div>
  )
} 