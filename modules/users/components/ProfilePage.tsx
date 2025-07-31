"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Weight,
  Ruler,
  Droplets,
  Pill,
  Bell,
  Shield,
  Edit,
  Save,
  Camera,
  Download,
  Share2,
  Settings,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Plus,
} from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-api"
import { MedicalInfoForm } from "@/components/medical-info-form"
import { useMedicalInfo, updateMedicalInfo } from "@/hooks/use-medical-info"
import { useEmergencyContacts } from "@/hooks/use-emergency-contacts"
import ChangePasswordModal from "@/components/change-password-modal"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const { put, get, loading, error, data } = useApi()
  const { user, loading: authLoading, initialized } = useAuth()
  const { medicalInfo, isLoading: medicalLoading, mutate } = useMedicalInfo()
  const [showMedicalEdit, setShowMedicalEdit] = useState(false)
  const { contacts, isLoading: contactsLoading } = useEmergencyContacts()
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Mock user data
  const initialUserData = {
    personal: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      emergencyContact: "",
    },
    health: {
      bloodType: "",
    }
  }
  const [userData, setUserData] = useState(initialUserData)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    console.log('🔄 useEffect ejecutándose con:', { user, initialized, authLoading })
    setUserData(initialUserData)
    if (!initialized || authLoading) {
      console.log('⏳ Esperando inicialización o carga de auth...')
      return;
    }
    if (!user) {
      console.log('❌ No hay usuario autenticado')
      return;
    }
    
    console.log('👤 Usuario autenticado:', user)
    
    async function fetchProfile() {
      setLoadingProfile(true)
      try {
        console.log('🔍 Iniciando fetch del perfil...')
        const response = await get("/api/user/profile")
        console.log('🔍 Respuesta completa del perfil:', response)
        
        if (response && response.data) {
          console.log('📝 Datos del usuario recibidos:', response.data)
          console.log('📊 Análisis de campos recibidos:')
          console.log(`  - name: "${response.data.name}" (${response.data.name ? '✅' : '❌'})`)
          console.log(`  - email: "${response.data.email}" (${response.data.email ? '✅' : '❌'})`)
          console.log(`  - phone: "${response.data.phone}" (${response.data.phone ? '✅' : '❌'})`)
          console.log(`  - address: "${response.data.address}" (${response.data.address ? '✅' : '❌'})`)
          console.log(`  - dateOfBirth: "${response.data.dateOfBirth}" (${response.data.dateOfBirth ? '✅' : '❌'})`)
          console.log(`  - gender: "${response.data.gender}" (${response.data.gender ? '✅' : '❌'})`)
          console.log(`  - bloodType: "${response.data.bloodType}" (${response.data.bloodType ? '✅' : '❌'})`)
          console.log(`  - emergencyContact: "${response.data.emergencyContact}" (${response.data.emergencyContact ? '✅' : '❌'})`)
          
          const newUserData = {
            personal: {
              name: response.data.name || "",
              email: response.data.email || "",
              phone: response.data.phone || "",
              dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.slice(0, 10) : "",
              gender: response.data.gender || "",
              address: response.data.address || "",
              emergencyContact: response.data.emergencyContact || "",
            },
            health: {
              bloodType: response.data.bloodType || "",
            }
          }
          console.log('✅ Estado userData actualizado:', newUserData)
          setUserData(newUserData)
        } else {
          console.log('⚠️ No se recibieron datos del perfil')
          console.log('❌ Response:', response)
        }
      } catch (e) {
        console.error('❌ Error cargando perfil:', e)
        // Si falla, mantener vacío
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [user, initialized, authLoading])

// Monitorear cambios en userData
useEffect(() => {
  console.log('🔄 userData actualizado:', userData)
  console.log('📊 Estado actual de los campos:')
  console.log(`  - Nombre: "${userData.personal.name}"`)
  console.log(`  - Email: "${userData.personal.email}"`)
  console.log(`  - Teléfono: "${userData.personal.phone}"`)
  console.log(`  - Fecha Nacimiento: "${userData.personal.dateOfBirth}"`)
  console.log(`  - Género: "${userData.personal.gender}"`)
  console.log(`  - Dirección: "${userData.personal.address}"`)
  console.log(`  - Contacto Emergencia: "${userData.personal.emergencyContact}"`)
  console.log(`  - Tipo Sangre: "${userData.health.bloodType}"`)
}, [userData])

const handleSave = async () => {
    console.log('💾 Iniciando guardado del perfil...')
    setIsEditing(false)
    // Guardar en la base de datos vía API
    const payload = {
      name: userData.personal.name,
      phone: userData.personal.phone,
      address: userData.personal.address,
      bloodType: userData.health.bloodType,
      emergencyContact: userData.personal.emergencyContact,
      dateOfBirth: userData.personal.dateOfBirth,
      gender: userData.personal.gender
    }
    console.log('💾 Guardando perfil con payload:', payload)
    try {
      const result = await put("/api/user/profile", payload)
      console.log('✅ Perfil guardado exitosamente:', result)
      // Aquí podrías mostrar un toast de éxito
    } catch (e) {
      console.error('❌ Error guardando perfil:', e)
      // Aquí podrías mostrar un toast de error
    }
  }

  const handleInputChange = (section: string, field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const healthMetrics = [
    { label: "Tipo de Sangre", value: userData.health.bloodType, icon: Droplets, color: "text-red-600" },
  ]

  // Determinar el contacto de emergencia a mostrar
  const emergencyContactToShow = userData.personal.emergencyContact
    || (contacts && contacts.length > 0 ? contacts.find((c: any) => c.isPrimary)?.name || contacts[0].name : "")

  // Opciones de género
  const genderOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" },
    { value: "Otro", label: "Otro" },
    { value: "Prefiero no decirlo", label: "Prefiero no decirlo" },
  ]

  // Render principal
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">Gestiona tu información personal y médica</p>
      </div>
      {loadingProfile ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-500 text-lg">Cargando información del usuario...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Header */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt={userData.personal.name} />
                    <AvatarFallback className="text-lg">MG</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{userData.personal.name}</h2>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" />
                        {userData.personal.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                          Saludable
                        </Badge>
                        <Badge variant="outline">Paciente Activo</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                        {isEditing ? "Guardar" : "Editar"}
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
                <TabsTrigger value="medical">Información Médica</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={userData.personal.name}
                        onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={userData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth">Fecha de Nacimiento</Label>
                      <Input
                        id="birth"
                        type="date"
                        value={userData.personal.dateOfBirth}
                        onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Género</Label>
                        <select
                        id="gender"
                          className="w-full border rounded px-3 py-2"
                        value={userData.personal.gender}
                        onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                        disabled={!isEditing}
                        >
                          <option value="">Selecciona una opción</option>
                          {genderOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={userData.personal.address}
                        onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contacto de Emergencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                        <Input
                          id="emergencyContact"
                            value={emergencyContactToShow}
                          onChange={(e) => handleInputChange('personal', 'emergencyContact', e.target.value)}
                          disabled={!isEditing}
                        />
                          {contactsLoading && <span className="text-xs text-gray-400">Cargando contactos...</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

              <TabsContent value="medical" className="mt-6">
                {medicalLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">Cargando información médica...</div>
                    </CardContent>
                  </Card>
                ) : showMedicalEdit ? (
                  <MedicalInfoForm
                    initialData={medicalInfo}
                    onSave={async (data) => {
                      if (medicalInfo?.id) {
                        await updateMedicalInfo(medicalInfo.id, data)
                      }
                      setShowMedicalEdit(false)
                      mutate()
                    }}
                    onCancel={() => setShowMedicalEdit(false)}
                    isLoading={medicalLoading}
                  />
                ) : medicalInfo ? (
              <div className="space-y-6">
                    {/* Información Básica Médica */}
                <Card>
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-600" />
                          Información Básica Médica
                        </CardTitle>
                        <CardDescription>Datos médicos esenciales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Droplets className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <p className="text-sm text-gray-600">Tipo de Sangre</p>
                            <p className="text-lg font-semibold text-gray-900">{medicalInfo.bloodType}</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Weight className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-sm text-gray-600">Peso</p>
                            <p className="text-lg font-semibold text-gray-900">{medicalInfo.weight} kg</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Ruler className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="text-sm text-gray-600">Altura</p>
                            <p className="text-lg font-semibold text-gray-900">{medicalInfo.height} cm</p>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm text-gray-600">N° Seguro</p>
                            <p className="text-lg font-semibold text-gray-900">{medicalInfo.insuranceNumber}</p>
                          </div>
                    </div>
                  </CardContent>
                </Card>

                    {/* Alergias y Condiciones */}
                <Card>
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          Alergias y Condiciones
                        </CardTitle>
                        <CardDescription>Información médica importante</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium">Alergias</Label>
                        <div className="mt-2 space-y-2">
                              {medicalInfo.allergies && medicalInfo.allergies.length > 0 ? (
                                medicalInfo.allergies.map((allergy: string, index: number) => (
                                  <Badge key={index} variant="destructive" className="mr-2">
                              {allergy}
                            </Badge>
                                ))
                              ) : (
                                <p className="text-gray-500">Ninguna alergia registrada</p>
                              )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Condiciones Médicas</Label>
                        <div className="mt-2 space-y-2">
                              {medicalInfo.conditions && medicalInfo.conditions.length > 0 ? (
                                medicalInfo.conditions.map((condition: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-2 bg-yellow-50 text-yellow-700">
                              {condition}
                            </Badge>
                                ))
                              ) : (
                                <p className="text-gray-500">Ninguna condición registrada</p>
                              )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Medicamentos Actuales</Label>
                      <div className="mt-2 space-y-2">
                            {medicalInfo.medications && medicalInfo.medications.length > 0 ? (
                              medicalInfo.medications.map((medication: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <Pill className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{medication}</span>
                          </div>
                              ))
                            ) : (
                              <p className="text-gray-500">Ningún medicamento registrado</p>
                            )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => setShowMedicalEdit(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Información Médica
                      </Button>
                    </div>
              </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No hay información médica registrada</h3>
                      <p className="text-gray-600 mb-4">Registra tu información médica para tener un perfil completo</p>
                      <Button onClick={() => setShowMedicalEdit(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Información Médica
                      </Button>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Salud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <p className="text-sm text-gray-600">Salud General</p>
                <Progress value={85} className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-blue-600">12</div>
                  <p className="text-xs text-gray-600">Citas Realizadas</p>
                </div>
                <div>
                  <div className="text-xl font-semibold text-purple-600">3</div>
                  <p className="text-xs text-gray-600">Recordatorios Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowChangePassword(true)}
                >
                <Lock className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      )}
      
      {/* Modales */}
      <ChangePasswordModal 
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  )
} 