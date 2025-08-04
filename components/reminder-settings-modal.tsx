"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  Settings, 
  Clock, 
  Smartphone, 
  Mail, 
  Volume2, 
  Calendar,
  Zap,
  Shield,
  Palette,
  Globe,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface ReminderSettings {
  notifications: {
    push: boolean
    email: boolean
    sound: boolean
    vibration: boolean
    desktop: boolean
  }
  timing: {
    defaultAdvanceTime: number // minutos antes del recordatorio
    snoozeOptions: number[] // opciones de posposición en minutos
    timezone: string
    workHours: {
      start: string
      end: string
    }
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    accentColor: string
    showCompleted: boolean
    showOverdue: boolean
  }
  privacy: {
    shareWithFamily: boolean
    emergencyContacts: string[]
    dataRetention: number // días
  }
  integrations: {
    calendarSync: boolean
    healthApps: boolean
    backupEnabled: boolean
  }
}

interface ReminderSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: ReminderSettings) => Promise<void>
}

export default function ReminderSettingsModal({
  isOpen,
  onClose,
  onSave
}: ReminderSettingsModalProps) {
  const [settings, setSettings] = useState<ReminderSettings>({
    notifications: {
      push: true,
      email: false,
      sound: true,
      vibration: true,
      desktop: false
    },
    timing: {
      defaultAdvanceTime: 15,
      snoozeOptions: [5, 15, 30, 60, 120],
      timezone: 'America/Bogota',
      workHours: {
        start: '08:00',
        end: '18:00'
      }
    },
    appearance: {
      theme: 'auto',
      accentColor: '#8b5cf6',
      showCompleted: true,
      showOverdue: true
    },
    privacy: {
      shareWithFamily: false,
      emergencyContacts: [],
      dataRetention: 365
    },
    integrations: {
      calendarSync: false,
      healthApps: false,
      backupEnabled: true
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(settings)
      onClose()
    } catch (error) {
      console.error('Error guardando configuraciones:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = (section: keyof ReminderSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const updateNestedSettings = (section: keyof ReminderSettings, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [key]: value
        }
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Recordatorios
          </DialogTitle>
          <DialogDescription>
            Personaliza el comportamiento y apariencia de tus recordatorios médicos
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacidad
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Integraciones
            </TabsTrigger>
          </TabsList>

          {/* Notificaciones */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Controla cómo y cuándo recibir notificaciones de tus recordatorios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Notificaciones Push</p>
                        <p className="text-sm text-gray-500">En el dispositivo móvil</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Correo Electrónico</p>
                        <p className="text-sm text-gray-500">Notificaciones por email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Sonido</p>
                        <p className="text-sm text-gray-500">Alertas sonoras</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) => updateSettings('notifications', 'sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Vibración</p>
                        <p className="text-sm text-gray-500">Vibración del dispositivo</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.vibration}
                      onCheckedChange={(checked) => updateSettings('notifications', 'vibration', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="advanceTime">Tiempo de Anticipación (minutos)</Label>
                  <Select
                    value={settings.timing.defaultAdvanceTime.toString()}
                    onValueChange={(value) => updateSettings('timing', 'defaultAdvanceTime', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Horarios */}
          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Configuración de Horarios
                </CardTitle>
                <CardDescription>
                  Define tus horarios de trabajo y opciones de posposición
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={settings.timing.timezone}
                      onValueChange={(value) => updateSettings('timing', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Bogota">Colombia (GMT-5)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Horario de Trabajo</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="workStart" className="text-xs">Inicio</Label>
                        <Input
                          id="workStart"
                          type="time"
                          value={settings.timing.workHours.start}
                          onChange={(e) => updateNestedSettings('timing', 'workHours', 'start', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="workEnd" className="text-xs">Fin</Label>
                        <Input
                          id="workEnd"
                          type="time"
                          value={settings.timing.workHours.end}
                          onChange={(e) => updateNestedSettings('timing', 'workHours', 'end', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Opciones de Posposición</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[5, 15, 30, 60, 120].map((minutes) => (
                      <Button
                        key={minutes}
                        variant={settings.timing.snoozeOptions.includes(minutes) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newOptions = settings.timing.snoozeOptions.includes(minutes)
                            ? settings.timing.snoozeOptions.filter(m => m !== minutes)
                            : [...settings.timing.snoozeOptions, minutes]
                          updateSettings('timing', 'snoozeOptions', newOptions.sort((a, b) => a - b))
                        }}
                      >
                        {minutes} min
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apariencia */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Configuración de Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) => updateSettings('appearance', 'theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Color de Acento</Label>
                    <div className="flex gap-2">
                      {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            settings.appearance.accentColor === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateSettings('appearance', 'accentColor', color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mostrar Completados</p>
                      <p className="text-sm text-gray-500">Mostrar recordatorios completados en la lista</p>
                    </div>
                    <Switch
                      checked={settings.appearance.showCompleted}
                      onCheckedChange={(checked) => updateSettings('appearance', 'showCompleted', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Destacar Vencidos</p>
                      <p className="text-sm text-gray-500">Resaltar recordatorios vencidos</p>
                    </div>
                    <Switch
                      checked={settings.appearance.showOverdue}
                      onCheckedChange={(checked) => updateSettings('appearance', 'showOverdue', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacidad */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configuración de Privacidad
                </CardTitle>
                <CardDescription>
                  Controla quién puede ver tus recordatorios y datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Compartir con Familia</p>
                    <p className="text-sm text-gray-500">Permitir que familiares vean tus recordatorios</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareWithFamily}
                    onCheckedChange={(checked) => updateSettings('privacy', 'shareWithFamily', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Contactos de Emergencia</Label>
                  <Textarea
                    placeholder="Agrega contactos separados por comas..."
                    value={settings.privacy.emergencyContacts.join(', ')}
                    onChange={(e) => updateSettings('privacy', 'emergencyContacts', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="dataRetention">Retención de Datos (días)</Label>
                  <Select
                    value={settings.privacy.dataRetention.toString()}
                    onValueChange={(value) => updateSettings('privacy', 'dataRetention', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="180">6 meses</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                      <SelectItem value="730">2 años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integraciones */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Integraciones
                </CardTitle>
                <CardDescription>
                  Conecta con otras aplicaciones y servicios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Sincronizar con Calendario</p>
                        <p className="text-sm text-gray-500">Google Calendar, Outlook</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.integrations.calendarSync}
                      onCheckedChange={(checked) => updateSettings('integrations', 'calendarSync', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Apps de Salud</p>
                        <p className="text-sm text-gray-500">Apple Health, Google Fit</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.integrations.healthApps}
                      onCheckedChange={(checked) => updateSettings('integrations', 'healthApps', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Save className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Respaldo Automático</p>
                        <p className="text-sm text-gray-500">Guardar datos en la nube</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.integrations.backupEnabled}
                      onCheckedChange={(checked) => updateSettings('integrations', 'backupEnabled', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Información de Integraciones</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Las integraciones te permiten sincronizar tus recordatorios con otras aplicaciones 
                        y servicios para una mejor experiencia de usuario.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 