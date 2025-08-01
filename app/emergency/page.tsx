"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Phone,
  MapPin,
  User,
  Heart,
  Pill,
  AlertCircle,
  Navigation,
  Clock,
  Shield,
  Users,
  Share2,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Target,
  Stethoscope,
  LigatureIcon as Bandage,
  PhoneCall,
  Edit,
  Save,
  Plus,
  Trash2,
  X,
  Copy,
  MessageSquare,
  Mail,
  Maximize2,
  Minimize2,
} from "lucide-react"
import dynamic from "next/dynamic"
import { saveEmergencyEvent, useEmergencyEvents, useEmergencyContacts, createEmergencyContact, updateEmergencyContact, deleteEmergencyContact } from '@/hooks/use-emergency'
import { useMedicalInfo, createMedicalInfo, updateMedicalInfo } from '@/hooks/use-medical-info'
import { MedicalInfoForm } from '@/components/medical-info-form'
import { MedicalCentersSection } from '@/components/medical-centers-section'
import { EmergencyMap } from '@/components/emergency-map'

// Importación dinámica del mapa para evitar errores de SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Cargando mapa...</div>
    </div>
  ),
})

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  isPrimary: boolean
  isOnline: boolean
  lastSeen: string
}

interface MedicalInfo {
  id: string
  bloodType: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergencyContact: string
  weight: string
  height: string
  insuranceNumber: string
}

interface EmergencyState {
  isActive: boolean
  startTime: Date | null
  duration: number
  location: { lat: number; lng: number; address: string } | null
  contactsNotified: string[]
}

interface Hospital {
  id: string
  name: string
  distance: string
  phone: string
  emergency: boolean
  address: string
  rating: number
  specialties: string[]
  waitTime: string
  isOpen: boolean
  coordinates: { lat: number; lng: number }
}

interface Pharmacy {
  id: string
  name: string
  distance: string
  phone: string
  address: string
  isOpen: boolean
  is24h: boolean
  coordinates: { lat: number; lng: number }
}

export default function EmergencyPage() {
  const { toast } = useToast()
  
  // Usar hooks para obtener datos de la base de datos
  const { events: emergencyEvents, isLoading: eventsLoading, mutate: mutateEvents } = useEmergencyEvents()
  const { contacts: emergencyContacts, isLoading: contactsLoading, mutate: mutateContacts } = useEmergencyContacts()
  const { medicalInfo: medicalInfoData, isLoading: medicalInfoLoading, mutate: mutateMedicalInfo } = useMedicalInfo()
  
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    isActive: false,
    startTime: null,
    duration: 0,
    location: null,
    contactsNotified: [],
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [isContactingEmergency, setIsContactingEmergency] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showCallConfirmation, setShowCallConfirmation] = useState(false)
  const [contactToCall, setContactToCall] = useState<{ phone: string; name: string } | null>(null)
  
  // Estados para edición de información médica
  const [showMedicalInfoModal, setShowMedicalInfoModal] = useState(false)
  const [showEditMedicalInfoModal, setShowEditMedicalInfoModal] = useState(false)
  const [editingMedicalInfo, setEditingMedicalInfo] = useState<MedicalInfo>({
    id: "",
    bloodType: "",
    allergies: [],
    medications: [],
    conditions: [],
    emergencyContact: "",
    weight: "",
    height: "",
    insuranceNumber: "",
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  // Estados para gestión de contactos de emergencia
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [showEditContactModal, setShowEditContactModal] = useState(false)
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [contactToDelete, setContactToDelete] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    isPrimary: false
  })
  const [isSavingContact, setIsSavingContact] = useState(false)
  
  // Estados para modal de mensaje
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageToSend, setMessageToSend] = useState("")
  const [contactForMessage, setContactForMessage] = useState<{ name: string; phone: string } | null>(null)
  
  // Estados para gestión mejorada de ubicación y centros médicos
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showHospitalDetailsModal, setShowHospitalDetailsModal] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [locationHistory, setLocationHistory] = useState<Array<{ lat: number; lng: number; address: string; timestamp: Date }>>([])
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false)
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null)
  const [showNearbyServices, setShowNearbyServices] = useState<'hospitals' | 'pharmacies' | 'all'>('hospitals')
  
  // Estados para el minimapa
  const [showMap, setShowMap] = useState(true)
  const [mapSize, setMapSize] = useState<'small' | 'large'>('small')

  // Información médica (solo desde la base de datos)
  const medicalInfo: MedicalInfo = medicalInfoData || {
    id: "",
    bloodType: "",
    allergies: [],
    medications: [],
    conditions: [],
    emergencyContact: "",
    weight: "",
    height: "",
    insuranceNumber: "",
  }

  // Datos de hospitales y farmacias (por ahora en memoria, pero se pueden obtener de APIs externas)
  const nearbyHospitals: Hospital[] = [
    {
      id: "1",
      name: "Hospital Central de Emergencias",
      distance: "1.2 km",
      phone: "+57 300 123 4567",
      emergency: true,
      address: "Calle 123 #45-67, Centro Médico, Bogotá",
      rating: 4.8,
      specialties: ["Trauma", "Cardiología", "Neurología", "Pediatría"],
      waitTime: "15-30 min",
      isOpen: true,
      coordinates: { lat: 4.6097, lng: -74.0817 }
    },
    {
      id: "2",
      name: "Clínica San José",
      distance: "2.8 km",
      phone: "+57 310 987 6543",
      emergency: false,
      address: "Avenida 68 #45-67, Chapinero, Bogotá",
      rating: 4.5,
      specialties: ["Medicina General", "Ginecología", "Ortopedia"],
      waitTime: "45-60 min",
      isOpen: true,
      coordinates: { lat: 4.6670, lng: -74.0550 }
    },
    {
      id: "3",
      name: "Hospital Universitario",
      distance: "4.1 km",
      phone: "+57 315 555 1234",
      emergency: true,
      address: "Carrera 78 #90-12, Campus Universitario, Bogotá",
      rating: 4.9,
      specialties: ["Oncología", "Transplantes", "Investigación", "Emergencias"],
      waitTime: "10-20 min",
      isOpen: true,
      coordinates: { lat: 4.6480, lng: -74.0780 }
    },
    {
      id: "4",
      name: "Centro Médico Especializado",
      distance: "3.5 km",
      phone: "+57 320 444 5678",
      emergency: true,
      address: "Calle 85 #12-34, Zona T, Bogotá",
      rating: 4.6,
      specialties: ["Dermatología", "Oftalmología", "Odontología"],
      waitTime: "30-45 min",
      isOpen: false,
      coordinates: { lat: 4.6700, lng: -74.0500 }
    }
  ]

  const nearbyPharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "Farmacia 24 Horas Central",
      distance: "0.8 km",
      phone: "+57 300 111 2222",
      address: "Calle 45 #23-12, Centro, Bogotá",
      isOpen: true,
      is24h: true,
      coordinates: { lat: 4.6080, lng: -74.0820 }
    },
    {
      id: "2",
      name: "Droguería San Martín",
      distance: "1.5 km",
      phone: "+57 310 333 4444",
      address: "Avenida 19 #120-45, Chapinero, Bogotá",
      isOpen: true,
      is24h: false,
      coordinates: { lat: 4.6650, lng: -74.0580 }
    },
    {
      id: "3",
      name: "Farmacia Express",
      distance: "2.1 km",
      phone: "+57 315 555 6666",
      address: "Carrera 15 #78-90, Usaquén, Bogotá",
      isOpen: false,
      is24h: false,
      coordinates: { lat: 4.7200, lng: -74.0400 }
    }
  ]

  const firstAidTips = [
    { title: "Mantén la calma", description: "Respira profundamente y evalúa la situación", icon: "🧘‍♀️" },
    { title: "Verifica signos vitales", description: "Pulso, respiración y conciencia cada 30 segundos", icon: "💓" },
    { title: "No muevas al herido", description: "Solo si hay peligro inmediato", icon: "🚫" },
    { title: "Mantén la temperatura", description: "Cubre con manta si hay shock", icon: "🌡️" },
    { title: "Mantén comunicación", description: "Habla con la persona si está consciente", icon: "💬" },
  ]

  // Dentro del componente EmergencyPage, agrega un estado para feedback:
  const [emergencySaveStatus, setEmergencySaveStatus] = useState<string | null>(null)

  // Obtener ubicación
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const accuracy = position.coords.accuracy

          // Simular obtención de dirección usando coordenadas reales
          // En una aplicación real, aquí se usaría un servicio de geocodificación
          let address = "Ubicación no disponible"
          
          // Simular direcciones basadas en coordenadas aproximadas de Bogotá
          if (lat >= 4.5 && lat <= 4.8 && lng >= -74.2 && lng <= -74.0) {
            const addresses = [
              "Calle 123 #45-67, Centro, Bogotá",
              "Avenida 68 #45-67, Chapinero, Bogotá", 
              "Carrera 15 #78-90, Usaquén, Bogotá",
              "Calle 85 #12-34, Zona T, Bogotá",
              "Avenida 19 #120-45, Chapinero, Bogotá"
            ]
            address = addresses[Math.floor(Math.random() * addresses.length)]
          } else {
            address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
          }

          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          setLocationAccuracy(accuracy)
          
          // Agregar a historial
          setLocationHistory(prev => [...prev, { ...newLocation, timestamp: new Date() }])
          
          setLocationError("")
        },
        (error) => {
          let errorMessage = "No se pudo obtener la ubicación."
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado. Verifica los permisos de GPS."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Información de ubicación no disponible."
              break
            case error.TIMEOUT:
              errorMessage = "Tiempo de espera agotado al obtener la ubicación."
              break
            default:
              errorMessage = "Error desconocido al obtener la ubicación."
          }
          
          setLocationError(errorMessage)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
      )
    } else {
      setLocationError("Tu dispositivo no soporta geolocalización")
    }
  }, [])

  // Timer para emergencia activa
  useEffect(() => {
    if (emergencyState.isActive && emergencyState.startTime) {
      timerRef.current = setInterval(() => {
        const now = new Date()
        const duration = Math.floor((now.getTime() - emergencyState.startTime!.getTime()) / 1000)
        setEmergencyState((prev) => ({ ...prev, duration }))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [emergencyState.isActive, emergencyState.startTime])

  const handleEmergencyCall = async () => {
    setIsContactingEmergency(true)

    // Simular llamada de emergencia
    setTimeout(() => {
      setEmergencyState({
        isActive: true,
        startTime: new Date(),
        duration: 0,
        location: location,
        contactsNotified: emergencyContacts?.map((c: EmergencyContact) => c.id) || [],
      })
      setIsContactingEmergency(false)
      setShowConfirmation(false)

      // Notificación de emergencia activada
      toast({
        title: "🚨 EMERGENCIA ACTIVADA",
        description: "Llamando al 123... Ubicación compartida. Contactos notificados. Manténgase en línea, la ayuda está en camino.",
        variant: "destructive",
      })
    }, 2000)
  }

  const handleShareLocation = async () => {
    if (!location) {
      toast({
        title: "❌ Error de ubicación",
        description: "No se pudo obtener la ubicación. Verifica los permisos de GPS.",
        variant: "destructive",
      })
      return
    }

    setIsLocationSharing(true)

    // Simular compartir ubicación
    setTimeout(() => {
      const googleMapsUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`
      const message = `🚨 UBICACIÓN DE EMERGENCIA\n\n📍 ${location.address}\n🗺️ ${googleMapsUrl}\n\n⏰ ${new Date().toLocaleString()}\n\nEnviado desde MediTrack`

      // Copiar al portapapeles
      navigator.clipboard.writeText(message).then(() => {
        toast({
          title: "📍 UBICACIÓN COMPARTIDA",
          description: "Enlace copiado al portapapeles. Listo para compartir por WhatsApp, SMS o email.",
        })
      }).catch(() => {
        toast({
          title: "⚠️ Error al copiar",
          description: "No se pudo copiar al portapapeles, pero la ubicación está disponible.",
          variant: "destructive",
        })
      })

      setIsLocationSharing(false)
    }, 1500)
  }

  const handleAlertContacts = async () => {
    const message = `🚨 ALERTA DE EMERGENCIA\n\n👤 María González necesita ayuda\n📍 ${location?.address || "Ubicación no disponible"}\n🗺️ ${location ? `https://maps.google.com/?q=${location.lat},${location.lng}` : ""}\n\n⏰ ${new Date().toLocaleString()}\n\n🚨 Si recibes este mensaje, por favor:\n1. Llama al 123 si es necesario\n2. Contacta conmigo inmediatamente\n3. Ven a mi ubicación si es posible\n\nEnviado automáticamente desde MediTrack`

    // Simular envío de mensajes
    toast({
      title: "📱 CONTACTOS ALERTADOS",
      description: "Todos tus contactos de emergencia han sido notificados con tu ubicación.",
    })
  }

  const handleCancelEmergency = () => {
    setEmergencyState({
      isActive: false,
      startTime: null,
      duration: 0,
      location: null,
      contactsNotified: [],
    })
    toast({
      title: "✅ Emergencia cancelada",
      description: "Se ha notificado a tus contactos que ya no necesitas ayuda.",
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCallContact = (phone: string, name: string) => {
    setContactToCall({ phone, name })
    setShowCallConfirmation(true)
  }

  const confirmCall = () => {
    if (contactToCall) {
      window.location.href = `tel:${contactToCall.phone}`
    }
    setShowCallConfirmation(false)
    setContactToCall(null)
  }

  const handleMessageContact = (phone: string, name: string) => {
    // Crear mensaje de emergencia con información relevante
    const currentLocation = location?.address || "Ubicación no disponible"
    const emergencyStatus = emergencyState.isActive ? "🚨 EMERGENCIA ACTIVA" : "Información médica"
    
    const message = `Hola ${name}, necesito ayuda. 

${emergencyStatus}
📍 Ubicación: ${currentLocation}
📱 Contacto: ${phone}

Por favor contacta conmigo lo antes posible.`

    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // En dispositivos móviles, intentar abrir SMS nativo
      try {
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`
    window.location.href = smsUrl
        
        toast({
          title: "Aplicación de mensajes abierta",
          description: `Mensaje preparado para ${name}`,
        })
      } catch (error) {
        // Si falla, mostrar modal
        setMessageToSend(message)
        setContactForMessage({ name, phone })
        setShowMessageModal(true)
      }
    } else {
      // En desktop, mostrar modal directamente
      setMessageToSend(message)
      setContactForMessage({ name, phone })
      setShowMessageModal(true)
    }
  }

  const copyMessageToClipboard = async () => {
    if (!messageToSend) return
    
    try {
      await navigator.clipboard.writeText(messageToSend)
      toast({
        title: "Mensaje copiado",
        description: "El mensaje ha sido copiado al portapapeles",
      })
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el mensaje al portapapeles",
        variant: "destructive"
      })
    }
  }

  const sendMessageViaWhatsApp = () => {
    if (!contactForMessage) return
    
    const whatsappUrl = `https://wa.me/${contactForMessage.phone.replace(/\D/g, '')}?text=${encodeURIComponent(messageToSend)}`
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "WhatsApp abierto",
      description: `WhatsApp abierto para ${contactForMessage.name}`,
    })
  }

  const sendMessageViaEmail = () => {
    if (!contactForMessage) return
    
    const subject = "Mensaje de Emergencia"
    const emailBody = messageToSend
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
    
    window.location.href = mailtoUrl
    
    toast({
      title: "Cliente de email abierto",
      description: `Email preparado para ${contactForMessage.name}`,
    })
  }

  // Funciones para edición de información médica
  const handleEditMedicalInfo = () => {
    setEditingMedicalInfo(medicalInfo)
    setShowEditMedicalInfoModal(true)
  }

  const handleSaveMedicalInfo = async (medicalData: any) => {
    setIsSaving(true)
    
    try {
      if (medicalInfo?.id) {
        // Actualizar información médica existente
        await updateMedicalInfo(medicalInfo.id, medicalData)
      } else {
        // Crear nueva información médica
        await createMedicalInfo(medicalData)
      }
      
      // Refrescar los datos
      await mutateMedicalInfo()
      
      setIsSaving(false)
      setShowEditMedicalInfoModal(false)
      
      toast({
        title: "Información médica actualizada",
        description: "Los datos han sido guardados correctamente en la base de datos",
      })
    } catch (error) {
      console.error('Error guardando información médica:', error)
      setIsSaving(false)
      toast({
        title: "Error",
        description: "No se pudo guardar la información médica",
        variant: "destructive"
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingMedicalInfo(medicalInfo)
    setShowEditMedicalInfoModal(false)
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setEditingMedicalInfo(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setEditingMedicalInfo(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      setEditingMedicalInfo(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }))
      setNewMedication("")
    }
  }

  const removeMedication = (index: number) => {
    setEditingMedicalInfo(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setEditingMedicalInfo(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setEditingMedicalInfo(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  // Funciones para gestión de contactos de emergencia
  const handleAddContact = () => {
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      isPrimary: false
    })
    setShowAddContactModal(true)
  }

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact)
    setShowEditContactModal(true)
  }

  const handleDeleteContact = (contact: EmergencyContact) => {
    setContactToDelete(contact)
    setShowDeleteContactModal(true)
  }

  const saveNewContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Error",
        description: "El nombre y teléfono son obligatorios",
        variant: "destructive"
      })
      return
    }

    setIsSavingContact(true)
    
    try {
      const contactData = {
        name: newContact.name.trim(),
        relationship: newContact.relationship.trim(),
        phone: newContact.phone.trim(),
        isPrimary: newContact.isPrimary,
        isOnline: false
      }

      await createEmergencyContact(contactData)
      
      // Refrescar los datos
      await mutateContacts()
      
      setIsSavingContact(false)
      setShowAddContactModal(false)
      setNewContact({
        name: "",
        relationship: "",
        phone: "",
        isPrimary: false
      })
      
      toast({
        title: "Contacto agregado",
        description: `${contactData.name} ha sido agregado a tus contactos de emergencia`,
      })
    } catch (error) {
      console.error('Error creando contacto:', error)
      setIsSavingContact(false)
      toast({
        title: "Error",
        description: "No se pudo agregar el contacto",
        variant: "destructive"
      })
    }
  }

  const saveEditedContact = async () => {
    if (!editingContact || !editingContact.name.trim() || !editingContact.phone.trim()) {
      toast({
        title: "Error",
        description: "El nombre y teléfono son obligatorios",
        variant: "destructive"
      })
      return
    }

    setIsSavingContact(true)
    
    try {
      const contactData = {
        name: editingContact.name.trim(),
        relationship: editingContact.relationship.trim(),
        phone: editingContact.phone.trim(),
        isPrimary: editingContact.isPrimary,
        isOnline: editingContact.isOnline
      }

      await updateEmergencyContact(editingContact.id, contactData)
      
      // Refrescar los datos
      await mutateContacts()
      
      setIsSavingContact(false)
      setShowEditContactModal(false)
      setEditingContact(null)
      
      toast({
        title: "Contacto actualizado",
        description: `${contactData.name} ha sido actualizado`,
      })
    } catch (error) {
      console.error('Error actualizando contacto:', error)
      setIsSavingContact(false)
      toast({
        title: "Error",
        description: "No se pudo actualizar el contacto",
        variant: "destructive"
      })
    }
  }

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return

    setIsSavingContact(true)
    
    try {
      await deleteEmergencyContact(contactToDelete.id)
      
      // Refrescar los datos
      await mutateContacts()
      
      setIsSavingContact(false)
      setShowDeleteContactModal(false)
      setContactToDelete(null)
      
      toast({
        title: "Contacto eliminado",
        description: `${contactToDelete.name} ha sido eliminado de tus contactos`,
      })
    } catch (error) {
      console.error('Error eliminando contacto:', error)
      setIsSavingContact(false)
      toast({
        title: "Error",
        description: "No se pudo eliminar el contacto",
        variant: "destructive"
      })
    }
  }

  const cancelContactOperation = () => {
    setShowAddContactModal(false)
    setShowEditContactModal(false)
    setShowDeleteContactModal(false)
    setEditingContact(null)
    setContactToDelete(null)
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      isPrimary: false
    })
  }

  // Función para refrescar la ubicación
  const refreshLocation = () => {
    setIsRefreshingLocation(true)
    setLocationError("")
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const accuracy = position.coords.accuracy

          // Simular obtención de dirección usando coordenadas reales
          let address = "Ubicación no disponible"
          
          // Simular direcciones basadas en coordenadas aproximadas de Bogotá
          if (lat >= 4.5 && lat <= 4.8 && lng >= -74.2 && lng <= -74.0) {
            const addresses = [
              "Calle 123 #45-67, Centro, Bogotá",
              "Avenida 68 #45-67, Chapinero, Bogotá", 
              "Carrera 15 #78-90, Usaquén, Bogotá",
              "Calle 85 #12-34, Zona T, Bogotá",
              "Avenida 19 #120-45, Chapinero, Bogotá",
              "Carrera 7 #26-20, La Candelaria, Bogotá",
              "Calle 72 #10-07, Chapinero, Bogotá",
              "Avenida 68 #90-92, Chapinero, Bogotá"
            ]
            address = addresses[Math.floor(Math.random() * addresses.length)]
          } else {
            address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
          }

          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          setLocationAccuracy(accuracy)
          
          // Agregar a historial
          setLocationHistory(prev => [...prev, { ...newLocation, timestamp: new Date() }])
          
          setLocationError("")
          setIsRefreshingLocation(false)
          
          toast({
            title: "📍 Ubicación actualizada",
            description: `Precisión: ±${accuracy.toFixed(1)}m - ${address}`,
          })
        },
        (error) => {
          let errorMessage = "No se pudo obtener la ubicación."
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado. Verifica los permisos de GPS."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Información de ubicación no disponible."
              break
            case error.TIMEOUT:
              errorMessage = "Tiempo de espera agotado al obtener la ubicación."
              break
            default:
              errorMessage = "Error desconocido al obtener la ubicación."
          }
          
          setLocationError(errorMessage)
          setIsRefreshingLocation(false)
          
          toast({
            title: "❌ Error de ubicación",
            description: errorMessage,
            variant: "destructive",
          })
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 30000 
        },
      )
    } else {
      setLocationError("Tu dispositivo no soporta geolocalización")
      setIsRefreshingLocation(false)
    }
  }

  const openHospitalDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setShowHospitalDetailsModal(true)
  }

  const openInMaps = (coordinates: { lat: number; lng: number }, name: string) => {
    const mapsUrl = `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`
    window.open(mapsUrl, '_blank')
    
    toast({
      title: "🗺️ Abriendo mapa",
      description: `Navegación a ${name}`,
    })
  }

  const getDirections = (coordinates: { lat: number; lng: number }, name: string) => {
    const directionsUrl = `https://maps.google.com/maps?daddr=${coordinates.lat},${coordinates.lng}&dirflg=d`
    window.open(directionsUrl, '_blank')
    
    toast({
      title: "🧭 Obteniendo direcciones",
      description: `Ruta a ${name}`,
    })
  }

  const shareLocationWithHospital = (hospital: Hospital) => {
    if (!location) return
    
    const message = `🚨 EMERGENCIA MÉDICA

👤 Paciente: ${medicalInfo.emergencyContact || "Usuario MediTrack"}
📍 Mi ubicación: ${location.address}
🗺️ Coordenadas: ${location.lat}, ${location.lng}
🏥 Destino: ${hospital.name}
📱 Teléfono: ${hospital.phone}

⏰ ${new Date().toLocaleString()}
🚨 Enviado desde MediTrack`

    // Intentar abrir SMS con el hospital
    const smsUrl = `sms:${hospital.phone}?body=${encodeURIComponent(message)}`
    window.location.href = smsUrl
    
    toast({
      title: "📱 Contactando hospital",
      description: `Enviando información a ${hospital.name}`,
    })
  }

  // Funciones para el minimapa
  const handleHospitalMapClick = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setShowHospitalDetailsModal(true)
  }

  const handlePharmacyMapClick = (pharmacy: Pharmacy) => {
    handleCallContact(pharmacy.phone, pharmacy.name)
  }

  const toggleMapSize = () => {
    setMapSize(mapSize === 'small' ? 'large' : 'small')
  }

  const toggleMapVisibility = () => {
    setShowMap(!showMap)
  }

  // Función para guardar evento de emergencia:
  const handleSaveEmergency = async (emergencyData: any) => {
    setEmergencySaveStatus(null)
    try {
      await saveEmergencyEvent(emergencyData)
      setEmergencySaveStatus('¡Emergencia guardada exitosamente!')
    } catch (e) {
      setEmergencySaveStatus('Error al guardar emergencia')
    }
  }

  return (
    <div className="p-4 md:pl-6 md:pr-6 md:py-6 space-y-6">
      {/* Header de Emergencia */}
      <div
        className={`${emergencyState.isActive ? "bg-red-100 border-red-300" : "bg-red-50 border-red-200"} border rounded-xl p-6 transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`${emergencyState.isActive ? "bg-red-700 animate-pulse" : "bg-red-600"} p-3 rounded-full transition-all duration-300`}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-900">
                {emergencyState.isActive ? "🚨 EMERGENCIA ACTIVA" : "Emergencia Médica"}
              </h1>
              <p className="text-red-700 mt-1">
                {emergencyState.isActive
                  ? `Tiempo transcurrido: ${formatDuration(emergencyState.duration)}`
                  : "Tu línea de vida digital - Siempre lista para ayudarte"}
              </p>
            </div>
          </div>
          {emergencyState.isActive && (
            <Button
              onClick={handleCancelEmergency}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
            >
              Cancelar Emergencia
            </Button>
          )}
        </div>
      </div>

      {/* Botón Principal de Emergencia */}
      <Card
        className={`${emergencyState.isActive ? "border-red-300 bg-red-100" : "border-red-200 bg-red-50"} transition-all duration-300`}
      >
        <CardContent className="p-8 text-center">
          {!emergencyState.isActive ? (
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogTrigger asChild>
                <Button className="w-40 h-40 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-pulse">
                  <div className="flex flex-col items-center">
                    <Phone className="w-16 h-16 mb-3" />
                    <span>LLAMAR</span>
                    <span>EMERGENCIA</span>
                    <span className="text-lg mt-2">123</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Confirmar Emergencia
                  </DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que necesitas ayuda de emergencia? Esto activará:
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>Llamada automática al 123</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Compartir ubicación con servicios de emergencia</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>Alertar a todos tus contactos de emergencia</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-4 h-4 text-purple-500" />
                    <span>Compartir información médica crítica</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEmergencyCall}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isContactingEmergency}
                  >
                    {isContactingEmergency ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Activando...
                      </div>
                    ) : (
                      "Sí, es una emergencia"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto rounded-full bg-red-700 text-white flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 mb-2 mx-auto" />
                  <div className="text-xl font-bold">EMERGENCIA</div>
                  <div className="text-lg">ACTIVA</div>
                </div>
              </div>
              <div className="text-red-800">
                <p className="font-semibold text-lg">�� Servicios de emergencia contactados</p>
                <p className="text-sm mt-1">Tiempo: {formatDuration(emergencyState.duration)}</p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-red-700 font-medium">
              {emergencyState.isActive
                ? "La ayuda está en camino. Mantén la calma."
                : "Presiona solo en caso de emergencia real"}
            </p>
            <p className="text-red-600 text-sm">
              {emergencyState.isActive
                ? "Se ha notificado tu ubicación y datos médicos"
                : "Se activará automáticamente todo el sistema de emergencia"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Estado del Sistema de Emergencia
          </CardTitle>
          <CardDescription>Monitor en tiempo real de todos los componentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-800">GPS</p>
              <p className="text-sm text-green-600">{location ? "✅ Activo" : "❌ Inactivo"}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-800">Contactos</p>
              <p className="text-sm text-blue-600">✅ {emergencyContacts?.length || 0} configurados</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-800">Info Médica</p>
              <p className="text-sm text-purple-600">✅ Completa</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-orange-800">Sistema</p>
              <p className="text-sm text-orange-600">{emergencyState.isActive ? "🚨 Emergencia" : "✅ Listo"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Acciones Rápidas de Emergencia
          </CardTitle>
          <CardDescription>Herramientas esenciales para situaciones críticas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={handleShareLocation}
              className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLocationSharing || !location}
            >
              {isLocationSharing ? (
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-sm">Compartiendo...</span>
                </div>
              ) : (
                <>
                  <Share2 className="w-6 h-6 mb-2" />
                  <span className="text-sm">Compartir Ubicación</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleAlertContacts}
              className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-6 h-6 mb-2" />
              <span className="text-sm">Alertar Contactos</span>
            </Button>

            <Dialog open={showMedicalInfoModal} onOpenChange={setShowMedicalInfoModal}>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white">
                  <Heart className="w-6 h-6 mb-2" />
                  <span className="text-sm">Info Médica</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                    <Heart className="w-5 h-5" />
                    Información Médica de Emergencia
                    </div>
                    <Button
                      onClick={handleEditMedicalInfo}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTitle>
                  <DialogDescription>Datos críticos para personal médico de emergencia</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Información Básica */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-sm font-medium text-red-700">Tipo de Sangre</p>
                      <p className="text-2xl font-bold text-red-900">{medicalInfo.bloodType}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm font-medium text-blue-700">Peso / Altura</p>
                      <p className="text-lg font-bold text-blue-900">
                        {medicalInfo.weight} / {medicalInfo.height}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Alergias */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      ⚠️ ALERGIAS CRÍTICAS
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {medicalInfo.allergies.map((allergy, index) => (
                        <div key={index} className="bg-red-100 border border-red-300 p-3 rounded-lg">
                          <span className="font-semibold text-red-800">🚨 {allergy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medicamentos */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <Pill className="w-5 h-5 text-green-500" />💊 MEDICAMENTOS ACTUALES
                    </h4>
                    <div className="space-y-2">
                      {medicalInfo.medications.map((medication, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <span className="text-green-800">{medication}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condiciones */}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <Stethoscope className="w-5 h-5 text-purple-500" />🏥 CONDICIONES MÉDICAS
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {medicalInfo.conditions.map((condition, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                          <span className="text-purple-800">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contacto de Emergencia */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                      <User className="w-5 h-5" />👤 CONTACTO DE EMERGENCIA
                    </h4>
                    <p className="text-yellow-700 font-medium">{medicalInfo.emergencyContact}</p>
                    <p className="text-yellow-600 text-sm">
                      Teléfono: {emergencyContacts.length > 0 ? emergencyContacts[0].phone : 'No disponible'}
                    </p>
                  </div>

                  {/* Seguro Médico */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5" />
                      🛡️ SEGURO MÉDICO
                    </h4>
                    <p className="text-gray-700">Número: {medicalInfo.insuranceNumber}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700 text-white">
                  <Bandage className="w-6 h-6 mb-2" />
                  <span className="text-sm">Primeros Auxilios</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-600">
                    <Bandage className="w-5 h-5" />
                    Guía de Primeros Auxilios
                  </DialogTitle>
                  <DialogDescription>Instrucciones básicas mientras llega la ayuda profesional</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {firstAidTips.map((tip, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-1">{tip.title}</h4>
                          <p className="text-orange-700 text-sm">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>⚠️ IMPORTANTE:</strong> Estos consejos no reemplazan la atención médica profesional.
                      Siempre llama al 123 en emergencias graves.
                    </AlertDescription>
                  </Alert>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Emergencia - Temporalmente comentado por problemas de tipos */}
      {/* 
      <EmergencyMap
        userLocation={location ? { ...location, timestamp: Date.now() } : null}
        medicalCenters={[]}
        onCenterClick={() => {}}
        onGetDirections={() => {}}
        onCallCenter={() => {}}
        onShareLocation={() => {}}
      /> 
      */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contactos de Emergencia */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Contactos de Emergencia
            </CardTitle>
            <CardDescription>Tu red de apoyo personal - Siempre listos para ayudarte</CardDescription>
              </div>
              <Button
                onClick={handleAddContact}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Contacto
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!emergencyContacts || emergencyContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contactos de emergencia</h3>
                <p className="text-gray-500 mb-4">Agrega contactos para que puedan ayudarte en caso de emergencia</p>
                <Button
                  onClick={handleAddContact}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Contacto
                </Button>
              </div>
            ) : (
              emergencyContacts.map((contact: EmergencyContact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    {contact.isPrimary && (
                      <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 fill-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          Principal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {contact.isOnline ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500">
                        {contact.isOnline ? "En línea" : "Desconectado"} • {contact.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleCallContact(contact.phone, contact.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Llamar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleMessageContact(contact.phone, contact.name)}
                        variant="outline"
                        className="border-gray-300"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Mensaje
                  </Button>
                </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleEditContact(contact)}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteContact(contact)}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
              </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ubicación y Centros Médicos Optimizados - Temporalmente comentado */}
        {/* 
        <MedicalCentersSection
          onEmergencyCall={(center) => handleCallContact(center.phone, center.name)}
          onShareLocation={(center) => shareLocationWithHospital(center)}
          onGetDirections={(center) => getDirections(center.coordinates, center.name)}
        /> 
        */}
      </div>

      {/* Footer de Emergencia */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
          <Clock className="w-4 h-4" />
          <span>Sistema de emergencia activo 24/7 - Siempre listo para protegerte</span>
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>📍 GPS: {location ? "Activo" : "Inactivo"}</span>
          <span>•</span>
          <span>👥 Contactos: {emergencyContacts?.length || 0}</span>
          <span>•</span>
          <span>🏥 Hospitales: {nearbyHospitals.length}</span>
          <span>•</span>
          <span>⏰ Actualizado: {new Date().toLocaleString("es-ES")}</span>
        </div>

        {emergencyState.isActive && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>🚨 EMERGENCIA ACTIVA:</strong> Tiempo transcurrido {formatDuration(emergencyState.duration)}. La
              ayuda está en camino. Mantén la calma y sigue las instrucciones de los operadores.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Confirmación de Llamada */}
      <Dialog open={showCallConfirmation} onOpenChange={setShowCallConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Phone className="w-5 h-5" />
              Confirmar Llamada
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas llamar a <strong>{contactToCall?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button onClick={() => setShowCallConfirmation(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={confirmCall} className="flex-1 bg-red-600 hover:bg-red-700">
              Sí, Llamar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edición de Información Médica */}
      <Dialog open={showEditMedicalInfoModal} onOpenChange={setShowEditMedicalInfoModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-600">
              <Edit className="w-5 h-5" />
              {medicalInfo?.id ? 'Editar' : 'Crear'} Información Médica
            </DialogTitle>
            <DialogDescription>
              {medicalInfo?.id ? 'Actualiza' : 'Configura'} tu información médica crítica para emergencias
            </DialogDescription>
          </DialogHeader>
          
          <MedicalInfoForm
            initialData={medicalInfo}
            onSave={handleSaveMedicalInfo}
            onCancel={handleCancelEdit}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Gestión de Contactos de Emergencia */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Plus className="w-5 h-5" />
              Agregar Nuevo Contacto de Emergencia
            </DialogTitle>
            <DialogDescription>
              Ingresa los detalles del contacto de emergencia que deseas agregar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newContactName" className="text-sm font-medium text-gray-700">
                Nombre del Contacto *
              </Label>
              <Input
                id="newContactName"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Dr. Juan Pérez"
                className="border-gray-200 focus:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newContactRelationship" className="text-sm font-medium text-gray-700">
                Relación con usted *
              </Label>
              <Input
                id="newContactRelationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="Ej: Médico de cabecera"
                className="border-gray-200 focus:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newContactPhone" className="text-sm font-medium text-gray-700">
                Teléfono *
              </Label>
              <Input
                id="newContactPhone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ej: +57 310 123 4567"
                className="border-gray-200 focus:border-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={newContact.isPrimary}
                onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="isPrimary" className="text-sm text-gray-700">
                Contacto Principal (si es el que siempre llamas primero)
              </Label>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={cancelContactOperation} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={saveNewContact}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSavingContact}
            >
              {isSavingContact ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Contacto
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-600">
              <Edit className="w-5 h-5" />
              Editar Contacto de Emergencia
            </DialogTitle>
            <DialogDescription>
              Modifica los detalles del contacto de emergencia seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editContactName" className="text-sm font-medium text-gray-700">
                Nombre del Contacto *
              </Label>
                             <Input
                 id="editContactName"
                 value={editingContact?.name || ""}
                 onChange={(e) => setEditingContact(prev => prev ? { ...prev, name: e.target.value } : null)}
                 placeholder="Ej: Dr. Juan Pérez"
                 className="border-gray-200 focus:border-gray-500"
               />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editContactRelationship" className="text-sm font-medium text-gray-700">
                Relación con usted *
              </Label>
                             <Input
                 id="editContactRelationship"
                 value={editingContact?.relationship || ""}
                 onChange={(e) => setEditingContact(prev => prev ? { ...prev, relationship: e.target.value } : null)}
                 placeholder="Ej: Médico de cabecera"
                 className="border-gray-200 focus:border-gray-500"
               />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editContactPhone" className="text-sm font-medium text-gray-700">
                Teléfono *
              </Label>
                             <Input
                 id="editContactPhone"
                 value={editingContact?.phone || ""}
                 onChange={(e) => setEditingContact(prev => prev ? { ...prev, phone: e.target.value } : null)}
                 placeholder="Ej: +57 310 123 4567"
                 className="border-gray-200 focus:border-gray-500"
               />
            </div>
            <div className="flex items-center gap-2">
                             <input
                 type="checkbox"
                 id="isPrimaryEdit"
                 checked={editingContact?.isPrimary || false}
                 onChange={(e) => setEditingContact(prev => prev ? { ...prev, isPrimary: e.target.checked } : null)}
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
              <Label htmlFor="isPrimaryEdit" className="text-sm text-gray-700">
                Contacto Principal (si es el que siempre llamas primero)
              </Label>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={cancelContactOperation} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={saveEditedContact}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isSavingContact}
            >
              {isSavingContact ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteContactModal} onOpenChange={setShowDeleteContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el contacto de emergencia <strong>{contactToDelete?.name}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={cancelContactOperation} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={confirmDeleteContact}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSavingContact}
            >
              {isSavingContact ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Contacto
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Mensaje de Emergencia */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <MessageCircle className="w-5 h-5" />
              Mensaje de Emergencia para {contactForMessage?.name}
            </DialogTitle>
            <DialogDescription>
              El mensaje para {contactForMessage?.name} está listo para ser enviado. Elige tu método preferido.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Mensaje:</h4>
              <p className="text-blue-800 whitespace-pre-line">{messageToSend}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={copyMessageToClipboard} 
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar al Portapapeles
              </Button>
              
              <Button 
                onClick={sendMessageViaWhatsApp} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar por WhatsApp
              </Button>
              
              <Button 
                onClick={sendMessageViaEmail} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar por Email
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowMessageModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </Button>
            </div>
            
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>💡 Consejo:</strong> En dispositivos móviles, el mensaje se abrirá automáticamente en tu aplicación de mensajes predeterminada.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalles de Hospital */}
      <Dialog open={showHospitalDetailsModal} onOpenChange={setShowHospitalDetailsModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Target className="w-5 h-5" />
              {selectedHospital?.name}
            </DialogTitle>
            <DialogDescription>
              Información detallada del centro médico
            </DialogDescription>
          </DialogHeader>
          {selectedHospital && (
            <div className="space-y-6 py-4">
              {/* Información Básica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-red-700">Distancia</p>
                  <p className="text-2xl font-bold text-red-900">{selectedHospital.distance}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-blue-700">Tiempo de Espera</p>
                  <p className="text-lg font-bold text-blue-900">{selectedHospital.waitTime}</p>
                </div>
              </div>

              <Separator />

              {/* Detalles del Hospital */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📍 Dirección</h4>
                  <p className="text-gray-700">{selectedHospital.address}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📞 Contacto</h4>
                  <p className="text-gray-700">{selectedHospital.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⭐ Calificación</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(selectedHospital.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700">{selectedHospital.rating}/5.0</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏥 Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Estado</h4>
                  <div className="flex gap-2">
                    {selectedHospital.emergency && (
                      <Badge variant="destructive" className="text-sm">
                        🚨 Emergencias
                      </Badge>
                    )}
                    {selectedHospital.isOpen ? (
                      <Badge variant="default" className="text-sm bg-green-100 text-green-800">
                        ✅ Abierto
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-sm">
                        ❌ Cerrado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <Button
                  onClick={() => getDirections(selectedHospital.coordinates, selectedHospital.name)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Obtener Ruta
                </Button>
                <Button
                  onClick={() => shareLocationWithHospital(selectedHospital)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Información de Ubicación */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <MapPin className="w-5 h-5" />
              Información de Ubicación
            </DialogTitle>
            <DialogDescription>
              Detalles técnicos y historial de ubicación
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* 📍 Ubicación Actual */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />📍 Ubicación Actual
              </h4>
              
              {location ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    {/* Dirección principal */}
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {location.address}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Dirección exacta obtenida por GPS
                        </p>
                      </div>
                    </div>

                    {/* Coordenadas precisas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-gray-700">Latitud</span>
                        </div>
                        <p className="text-sm font-mono text-gray-900">
                          {location.lat.toFixed(8)}°
                        </p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-gray-700">Longitud</span>
                        </div>
                        <p className="text-sm font-mono text-gray-900">
                          {location.lng.toFixed(8)}°
                        </p>
                      </div>
                    </div>

                    {/* Información de precisión */}
                    {locationAccuracy && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-orange-600" />
                            <span className="text-xs font-medium text-gray-700">Precisión GPS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  locationAccuracy <= 5 ? 'bg-green-500' :
                                  locationAccuracy <= 10 ? 'bg-yellow-500' :
                                  locationAccuracy <= 20 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.max(10, Math.min(100, 100 - (locationAccuracy * 5)))}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              ±{locationAccuracy.toFixed(1)}m
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {locationAccuracy <= 5 ? 'Precisión excelente' :
                           locationAccuracy <= 10 ? 'Precisión buena' :
                           locationAccuracy <= 20 ? 'Precisión moderada' : 'Precisión baja'}
                        </p>
                      </div>
                    )}

                    {/* Última actualización */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Última actualización:</span>
                      </div>
                      <span className="font-medium">
                        {new Date().toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={refreshLocation}
                        disabled={isRefreshingLocation}
                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        {isRefreshingLocation ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Target className="w-3 h-3 mr-2" />
                            Actualizar Ubicación
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowLocationModal(true)}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Maximize2 className="w-3 h-3 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ) : locationError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error de ubicación:</strong> {locationError}
                    <br />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refreshLocation}
                      className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Target className="w-3 h-3 mr-2" />
                      Reintentar
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Obteniendo ubicación...</p>
                      <p className="text-xs text-gray-600">Esperando permisos de GPS</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalles de Ubicación */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              📍 Información Detallada de Ubicación
            </DialogTitle>
            <DialogDescription>
              Datos técnicos y precisos de tu ubicación actual
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {location && (
              <>
                {/* Información Técnica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-700">Precisión GPS</p>
                    <p className="text-lg font-bold text-blue-900">
                      ±{locationAccuracy ? locationAccuracy.toFixed(1) : 'N/A'}m
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {locationAccuracy && (
                        locationAccuracy <= 5 ? 'Excelente' :
                        locationAccuracy <= 10 ? 'Buena' :
                        locationAccuracy <= 20 ? 'Moderada' : 'Baja'
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-700">Última Actualización</p>
                    <p className="text-sm font-bold text-green-900">
                      {new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {new Date().toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Coordenadas Detalladas */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Coordenadas GPS Precisas
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Latitud:</span>
                        <p className="font-mono text-gray-900 text-sm mt-1">
                          {location.lat.toFixed(8)}° N
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Longitud:</span>
                        <p className="font-mono text-gray-900 text-sm mt-1">
                          {location.lng.toFixed(8)}° W
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <span className="text-sm font-medium text-gray-700">Dirección:</span>
                      <p className="text-gray-900 text-sm mt-1">{location.address}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Historial de Ubicación */}
                {locationHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      Historial de Ubicación ({locationHistory.length} registros)
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {locationHistory.slice(-5).reverse().map((loc, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {loc.timestamp.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </span>
                            <span className="text-xs text-gray-500">
                              {loc.timestamp.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{loc.address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <Button
                    onClick={() => openInMaps(location, "Mi ubicación")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver en Mapa
                  </Button>
                  
                  <Button
                    onClick={handleShareLocation}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Ejemplo de uso: llama handleSaveEmergency(emergencyState) cuando se active una emergencia.
      Muestra feedback visual: */}
      {emergencySaveStatus && (
        <div className={emergencySaveStatus.startsWith('¡') ? 'text-green-600' : 'text-red-600'}>
          {emergencySaveStatus}
        </div>
      )}
    </div>
  )
}
