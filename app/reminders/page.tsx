"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  Plus,
  Search,
  Calendar,
  Clock,
  Pill,
  Activity,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Edit,
  Trash2,
  Target,
  Zap,
  Volume2,
  Mail,
  Smartphone,
  Settings,
} from "lucide-react"
import { useReminders, createReminder, removeReminder, completeReminder, updateReminder } from '@/hooks/use-reminders'
import { useReminderSettings, saveReminderSettings, ReminderSettings } from '@/hooks/use-reminder-settings'
import ReminderSettingsModal from '@/components/reminder-settings-modal'

interface Reminder {
  id: string
  title: string
  description: string
  type: "medicacion" | "cita" | "ejercicio" | "medicion" | "general"
  priority: "baja" | "media" | "alta" | "critica"
  frequency: "una-vez" | "diario" | "semanal" | "mensual"
  time: string
  date: string
  isActive: boolean
  isCompleted: boolean
  notifications: {
    push: boolean
    email: boolean
    sound: boolean
  }
  completedDates: string[]
  createdAt: string
  nextDue: string
}

const reminderTypes = [
  { id: "medicacion", name: "Medicación", icon: Pill, color: "bg-blue-100 text-blue-800" },
  { id: "cita", name: "Cita Médica", icon: Calendar, color: "bg-green-100 text-green-800" },
  { id: "ejercicio", name: "Ejercicio", icon: Activity, color: "bg-orange-100 text-orange-800" },
  { id: "medicion", name: "Medición", icon: Stethoscope, color: "bg-purple-100 text-purple-800" },
  { id: "general", name: "General", icon: Bell, color: "bg-gray-100 text-gray-800" },
]

const priorityLevels = [
  { id: "baja", name: "Baja", color: "bg-gray-100 text-gray-800", icon: "🔵" },
  { id: "media", name: "Media", color: "bg-yellow-100 text-yellow-800", icon: "🟡" },
  { id: "alta", name: "Alta", color: "bg-orange-100 text-orange-800", icon: "🟠" },
  { id: "critica", name: "Crítica", color: "bg-red-100 text-red-800", icon: "🔴" },
]

const frequencies = [
  { id: "una-vez", name: "Una vez", description: "Solo una vez en la fecha especificada" },
  { id: "diario", name: "Diario", description: "Todos los días a la misma hora" },
  { id: "semanal", name: "Semanal", description: "Una vez por semana" },
  { id: "mensual", name: "Mensual", description: "Una vez por mes" },
]

const typeMap: Record<string, string> = {
  medicacion: 'MEDICATION',
  cita: 'APPOINTMENT',
  ejercicio: 'EXERCISE',
  medicion: 'TEST',
  general: 'OTHER'
}

const reverseTypeMap: Record<string, string> = {
  MEDICATION: 'medicacion',
  APPOINTMENT: 'cita',
  EXERCISE: 'ejercicio',
  TEST: 'medicion',
  OTHER: 'general'
}

export default function RemindersPage() {
  const { reminders, isLoading, isError, mutate } = useReminders()
  const { settings, isLoading: settingsLoading } = useReminderSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    type: "general" as Reminder["type"],
    priority: "media" as Reminder["priority"],
    frequency: "una-vez" as Reminder["frequency"],
    time: "09:00",
    date: new Date().toISOString().split("T")[0],
    notifications: {
      push: true,
      email: false,
      sound: true,
    },
  })

  // Función mejorada de filtrado
  const filteredReminders = reminders.filter((reminder: Reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || reminder.type === selectedType
    const matchesPriority = selectedPriority === "all" || reminder.priority === selectedPriority
    
    // Lógica simplificada: mostrar activos no completados O completados (si showCompleted está activo)
    const matchesStatus = showCompleted ? reminder.isCompleted : !reminder.isCompleted

    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const now = new Date()
  const upcomingReminders = filteredReminders
    .filter((r: Reminder) => !r.isCompleted && new Date(r.nextDue) > now)
    .sort((a: Reminder, b: Reminder) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
    .slice(0, 5)

  const handleCreateReminder = async () => {
    try {
      const reminder = {
        title: newReminder.title,
        description: newReminder.description,
        type: typeMap[newReminder.type], // Mapear tipo al enum de Prisma
        date: `${newReminder.date}T${newReminder.time}:00Z`,
      }
      await createReminder(reminder)
      await mutate() // Forzar actualización de datos
      setNewReminder({
        title: "",
        description: "",
        type: "general",
        priority: "media",
        frequency: "una-vez",
        time: "09:00",
        date: new Date().toISOString().split("T")[0],
        notifications: { push: true, email: false, sound: true },
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creando recordatorio:', error)
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setNewReminder({
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      priority: reminder.priority,
      frequency: reminder.frequency,
      time: reminder.time,
      date: reminder.date,
      notifications: reminder.notifications,
    })
    setIsCreateModalOpen(true)
  }

  const handleUpdateReminder = async () => {
    if (!editingReminder) return
    
    try {
      await updateReminder(editingReminder.id, {
        title: newReminder.title,
        description: newReminder.description,
        type: typeMap[newReminder.type],
        date: `${newReminder.date}T${newReminder.time}:00Z`,
      })
      await mutate() // Forzar actualización de datos
      setEditingReminder(null)
      setNewReminder({
        title: "",
        description: "",
        type: "general",
        priority: "media",
        frequency: "una-vez",
        time: "09:00",
        date: new Date().toISOString().split("T")[0],
        notifications: { push: true, email: false, sound: true },
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error actualizando recordatorio:', error)
    }
  }

  const markCompleted = async (id: string) => {
    try {
      await completeReminder(id)
      await mutate() // Forzar actualización de datos
    } catch (error) {
      console.error('Error completando recordatorio:', error)
    }
  }

  const markIncomplete = async (id: string) => {
    try {
      await updateReminder(id, { isCompleted: false })
      await mutate() // Forzar actualización de datos
    } catch (error) {
      console.error('Error marcando recordatorio como incompleto:', error)
    }
  }

  const snoozeReminder = async (id: string, minutes: number) => {
    try {
      const newTime = new Date(Date.now() + minutes * 60000).toISOString()
      await updateReminder(id, { date: newTime })
      await mutate() // Forzar actualización de datos
    } catch (error) {
      console.error('Error posponiendo recordatorio:', error)
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      await removeReminder(id)
      await mutate() // Forzar actualización de datos
    } catch (error) {
      console.error('Error eliminando recordatorio:', error)
    }
  }

  const handleSaveSettings = async (newSettings: ReminderSettings) => {
    try {
      await saveReminderSettings(newSettings)
      console.log('✅ Configuración guardada exitosamente')
    } catch (error) {
      console.error('❌ Error guardando configuración:', error)
      throw error
    }
  }

  const getTypeInfo = (typeId: string) => {
    return reminderTypes.find((type) => type.id === typeId) || reminderTypes[4]
  }

  const getPriorityInfo = (priorityId: string) => {
    return priorityLevels.find((priority) => priority.id === priorityId) || priorityLevels[1]
  }

  const getStats = () => {
    const activeCount = reminders.filter((r: Reminder) => !r.isCompleted).length
    const completedCount = reminders.filter((r: Reminder) => r.isCompleted).length
    const overdueCount = reminders.filter((r: Reminder) => !r.isCompleted && new Date(r.nextDue) < new Date()).length
    const todayCount = reminders.filter(
      (r: Reminder) => !r.isCompleted && new Date(r.nextDue).toDateString() === new Date().toDateString(),
    ).length

    return { active: activeCount, completed: completedCount, overdue: overdueCount, today: todayCount }
  }

  const stats = getStats()

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error al cargar recordatorios</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-purple-600" />
                Recordatorios
              </h1>
              <p className="text-gray-600 mt-1">Gestiona tus recordatorios médicos y de salud</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Recordatorio
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingReminder ? "Editar Recordatorio" : "Crear Nuevo Recordatorio"}</DialogTitle>
                    <DialogDescription>
                      {editingReminder
                        ? "Modifica los detalles de tu recordatorio"
                        : "Configura un nuevo recordatorio para tu salud"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newReminder.title}
                          onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                          placeholder="Título del recordatorio..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={newReminder.type}
                          onValueChange={(value) => setNewReminder({ ...newReminder, type: value as Reminder["type"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reminderTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4" />
                                  {type.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newReminder.description}
                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                        placeholder="Descripción del recordatorio..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select
                          value={newReminder.priority}
                          onValueChange={(value) =>
                            setNewReminder({ ...newReminder, priority: value as Reminder["priority"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map((priority) => (
                              <SelectItem key={priority.id} value={priority.id}>
                                <div className="flex items-center gap-2">
                                  <span>{priority.icon}</span>
                                  {priority.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frecuencia</Label>
                        <Select
                          value={newReminder.frequency}
                          onValueChange={(value) =>
                            setNewReminder({ ...newReminder, frequency: value as Reminder["frequency"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencies.map((frequency) => (
                              <SelectItem key={frequency.id} value={frequency.id}>
                                {frequency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newReminder.date}
                          onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Hora</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newReminder.time}
                          onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Notificaciones</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Notificación push</span>
                          </div>
                          <Switch
                            checked={newReminder.notifications.push}
                            onCheckedChange={(checked) =>
                              setNewReminder({
                                ...newReminder,
                                notifications: { ...newReminder.notifications, push: checked },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Correo electrónico</span>
                          </div>
                          <Switch
                            checked={newReminder.notifications.email}
                            onCheckedChange={(checked) =>
                              setNewReminder({
                                ...newReminder,
                                notifications: { ...newReminder.notifications, email: checked },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">Sonido</span>
                          </div>
                          <Switch
                            checked={newReminder.notifications.sound}
                            onCheckedChange={(checked) =>
                              setNewReminder({
                                ...newReminder,
                                notifications: { ...newReminder.notifications, sound: checked },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateModalOpen(false)
                          setEditingReminder(null)
                          setNewReminder({
                            title: "",
                            description: "",
                            type: "general",
                            priority: "media",
                            frequency: "una-vez",
                            time: "09:00",
                            date: new Date().toISOString().split("T")[0],
                            notifications: { push: true, email: false, sound: true },
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={editingReminder ? handleUpdateReminder : handleCreateReminder}>
                        {editingReminder ? "Actualizar" : "Crear"} Recordatorio
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Para Hoy</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximos Recordatorios */}
        {upcomingReminders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Próximos Recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReminders.map((reminder: Reminder) => {
                  const typeInfo = getTypeInfo(reminder.type)
                  const priorityInfo = getPriorityInfo(reminder.priority)
                  const isOverdue = new Date(reminder.nextDue) < new Date()
                  const timeUntil = Math.ceil(
                    (new Date(reminder.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60),
                  )

                  return (
                    <div
                      key={reminder.id}
                      className={`p-4 rounded-lg border-l-4 ${isOverdue ? "border-l-red-500 bg-red-50" : "border-l-blue-500 bg-blue-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <typeInfo.icon className="w-4 h-4" />
                            <h3 className="font-medium">{reminder.title}</h3>
                            <Badge className={priorityInfo.color}>
                              {priorityInfo.icon} {priorityInfo.name}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(reminder.nextDue).toLocaleString()}
                            </span>
                            <span className={isOverdue ? "text-red-600 font-medium" : "text-blue-600"}>
                              {isOverdue ? "Vencido" : `En ${timeUntil}h`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => snoozeReminder(reminder.id, 15)}>
                            <Pause className="w-3 h-3 mr-1" />
                            15min
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => markCompleted(reminder.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros y Búsqueda */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar recordatorios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {reminderTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      <div className="flex items-center gap-2">
                        <span>{priority.icon}</span>
                        {priority.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={showCompleted ? "default" : "outline"}
                  onClick={() => setShowCompleted(!showCompleted)}
                  size="sm"
                >
                  Completados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Recordatorios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReminders.map((reminder: Reminder) => {
            const typeInfo = getTypeInfo(reminder.type)
            const priorityInfo = getPriorityInfo(reminder.priority)
            const isOverdue = new Date(reminder.nextDue) < new Date() && !reminder.isCompleted
            const completionRate = reminder.frequency !== "una-vez" ? (reminder.completedDates.length / 7) * 100 : 0

            return (
              <Card
                key={reminder.id}
                className={`${reminder.isCompleted ? "opacity-75 bg-gray-50" : ""} ${isOverdue ? "border-red-200" : ""} ${
                  reminder.isCompleted ? "border-green-200" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <typeInfo.icon className="w-4 h-4" />
                        <CardTitle className="text-lg">{reminder.title}</CardTitle>
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={typeInfo.color}>{typeInfo.name}</Badge>
                        <Badge className={priorityInfo.color}>
                          {priorityInfo.icon} {priorityInfo.name}
                        </Badge>
                        {reminder.isCompleted && (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{reminder.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Frecuencia:</span>
                      <span className="font-medium">{frequencies.find((f) => f.id === reminder.frequency)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Próximo:</span>
                      <span className={`font-medium ${isOverdue ? "text-red-600" : "text-blue-600"}`}>
                        <span suppressHydrationWarning>{typeof window === 'undefined' ? reminder.nextDue : new Date(reminder.nextDue).toLocaleString()}</span>
                      </span>
                    </div>
                    {reminder.frequency !== "una-vez" && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progreso semanal:</span>
                          <span className="font-medium">{Math.round(completionRate)}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      {reminder.notifications.push && <Smartphone className="w-3 h-3 text-blue-500" />}
                      {reminder.notifications.email && <Mail className="w-3 h-3 text-green-500" />}
                      {reminder.notifications.sound && <Volume2 className="w-3 h-3 text-orange-500" />}
                    </div>
                    <span>Creado: {new Date(reminder.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {!reminder.isCompleted ? (
                        <Button
                          size="sm"
                          onClick={() => markCompleted(reminder.id)}
                          className="bg-green-600 hover:bg-green-700"
                          title="Marcar como completado"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markIncomplete(reminder.id)}
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          title="Marcar como no completado para volver a activar el recordatorio"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Reactivar
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReminder(reminder)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredReminders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recordatorios</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedType !== "all" || selectedPriority !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda"
                  : "Comienza creando tu primer recordatorio"}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Recordatorio
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modal de Configuraciones */}
        <ReminderSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveSettings}
        />
      </div>
    </div>
  )
}
