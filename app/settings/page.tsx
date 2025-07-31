"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  Globe,
  Palette,
  Clock,
  Calendar,
  Heart,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Upload,
  Trash2,
  Save,
  RotateCcw,
  Key,
  UserCheck,
  Database,
  Network,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  RefreshCw,
  Zap,
  Battery,
  Cpu,
  HardDrive,
  Activity,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      sound: true,
      vibration: true,
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "08:00",
      appointmentReminders: true,
      medicationReminders: true,
      healthAlerts: true,
      emergencyAlerts: true,
      weeklyReports: false,
      monthlyReports: true,
    },
    privacy: {
      privacyMode: false,
      dataSharing: true,
      analytics: true,
      locationSharing: false,
      emergencyContacts: true,
      healthData: "private", // private, doctors, family, public
      biometricAuth: false,
      autoLock: true,
      lockTimeout: 5, // minutes
      sessionTimeout: 30, // minutes
    },
    appearance: {
      theme: "system", // light, dark, system
      language: "es",
      fontSize: "medium", // small, medium, large
      colorScheme: "blue", // blue, green, purple, red
      compactMode: false,
      animations: true,
      highContrast: false,
      reducedMotion: false,
    },
    data: {
      autoBackup: true,
      backupFrequency: "daily", // daily, weekly, monthly
      cloudSync: true,
      localStorage: true,
      dataRetention: "2years", // 6months, 1year, 2years, forever
      exportFormat: "pdf", // pdf, csv, json
      importData: false,
    },
    security: {
      twoFactorAuth: false,
      passwordChange: "90days", // 30days, 60days, 90days, never
      sessionManagement: true,
      deviceManagement: true,
      loginHistory: true,
      suspiciousActivity: true,
    },
    performance: {
      cacheSize: 100, // MB
      autoOptimize: true,
      backgroundSync: true,
      offlineMode: true,
      dataCompression: true,
    }
  })

  const handleSettingChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ]

  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: MonitorIcon },
  ]

  const colorSchemes = [
    { value: "blue", label: "Azul", color: "bg-blue-500" },
    { value: "green", label: "Verde", color: "bg-green-500" },
    { value: "purple", label: "Púrpura", color: "bg-purple-500" },
    { value: "red", label: "Rojo", color: "bg-red-500" },
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Personaliza tu experiencia en MediTrack</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        {/* Notificaciones */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Gestiona cómo recibes las notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipos de Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones Push</Label>
                        <p className="text-sm text-gray-500">Alertas en tiempo real</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas por Email</Label>
                        <p className="text-sm text-gray-500">Recordatorios por correo</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas por SMS</Label>
                        <p className="text-sm text-gray-500">Mensajes de texto</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Opciones de Alerta</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sonido</Label>
                        <p className="text-sm text-gray-500">Reproducir sonidos</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sound}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Vibración</Label>
                        <p className="text-sm text-gray-500">Vibrar al recibir</p>
                      </div>
                      <Switch
                        checked={settings.notifications.vibration}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'vibration', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Horas Silenciosas</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activar Horas Silenciosas</Label>
                    <p className="text-sm text-gray-500">No recibir notificaciones en horario nocturno</p>
                  </div>
                  <Switch
                    checked={settings.notifications.quietHours}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'quietHours', checked)}
                  />
                </div>
                {settings.notifications.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inicio</Label>
                      <Input
                        type="time"
                        value={settings.notifications.quietStart}
                        onChange={(e) => handleSettingChange('notifications', 'quietStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fin</Label>
                      <Input
                        type="time"
                        value={settings.notifications.quietEnd}
                        onChange={(e) => handleSettingChange('notifications', 'quietEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recordatorios Específicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios de Citas</Label>
                      <p className="text-sm text-gray-500">Alertas de citas médicas</p>
                    </div>
                    <Switch
                      checked={settings.notifications.appointmentReminders}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'appointmentReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios de Medicación</Label>
                      <p className="text-sm text-gray-500">Alertas de medicamentos</p>
                    </div>
                    <Switch
                      checked={settings.notifications.medicationReminders}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'medicationReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Salud</Label>
                      <p className="text-sm text-gray-500">Notificaciones importantes de salud</p>
                    </div>
                    <Switch
                      checked={settings.notifications.healthAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'healthAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Emergencia</Label>
                      <p className="text-sm text-gray-500">Siempre activas</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emergencyAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'emergencyAlerts', checked)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacidad */}
        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidad y Datos
              </CardTitle>
              <CardDescription>Controla tu privacidad y el uso de datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuración de Privacidad</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo Privado</Label>
                        <p className="text-sm text-gray-500">Oculta información sensible</p>
                      </div>
                      <Switch
                        checked={settings.privacy.privacyMode}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'privacyMode', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compartir Datos</Label>
                        <p className="text-sm text-gray-500">Análisis anónimos</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics</Label>
                        <p className="text-sm text-gray-500">Mejorar la aplicación</p>
                      </div>
                      <Switch
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'analytics', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Acceso a Datos</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Compartir Datos de Salud</Label>
                      <Select
                        value={settings.privacy.healthData}
                        onValueChange={(value) => handleSettingChange('privacy', 'healthData', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Solo yo</SelectItem>
                          <SelectItem value="doctors">Médicos</SelectItem>
                          <SelectItem value="family">Familia</SelectItem>
                          <SelectItem value="public">Público</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Ubicación</Label>
                        <p className="text-sm text-gray-500">Compartir ubicación</p>
                      </div>
                      <Switch
                        checked={settings.privacy.locationSharing}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'locationSharing', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seguridad de Sesión</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticación Biométrica</Label>
                        <p className="text-sm text-gray-500">Huella dactilar o Face ID</p>
                      </div>
                      <Switch
                        checked={settings.privacy.biometricAuth}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'biometricAuth', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Bloqueo Automático</Label>
                        <p className="text-sm text-gray-500">Bloquear al salir</p>
                      </div>
                      <Switch
                        checked={settings.privacy.autoLock}
                        onCheckedChange={(checked) => handleSettingChange('privacy', 'autoLock', checked)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tiempo de Bloqueo (minutos)</Label>
                      <Input
                        type="number"
                        value={settings.privacy.lockTimeout}
                        onChange={(e) => handleSettingChange('privacy', 'lockTimeout', parseInt(e.target.value))}
                        min="1"
                        max="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeout de Sesión (minutos)</Label>
                      <Input
                        type="number"
                        value={settings.privacy.sessionTimeout}
                        onChange={(e) => handleSettingChange('privacy', 'sessionTimeout', parseInt(e.target.value))}
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia y Personalización
              </CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tema</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((theme) => {
                      const IconComponent = theme.icon
                      return (
                        <div
                          key={theme.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            settings.appearance.theme === theme.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                        >
                          <IconComponent className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm text-center">{theme.label}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Esquema de Colores</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          settings.appearance.colorScheme === scheme.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSettingChange('appearance', 'colorScheme', scheme.value)}
                      >
                        <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${scheme.color}`} />
                        <p className="text-sm text-center">{scheme.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Idioma</h3>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tamaño de Fuente</h3>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => handleSettingChange('appearance', 'fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Opciones de Accesibilidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo Compacto</Label>
                      <p className="text-sm text-gray-500">Interfaz más densa</p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animaciones</Label>
                      <p className="text-sm text-gray-500">Efectos visuales</p>
                    </div>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => handleSettingChange('appearance', 'animations', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alto Contraste</Label>
                      <p className="text-sm text-gray-500">Mejor visibilidad</p>
                    </div>
                    <Switch
                      checked={settings.appearance.highContrast}
                      onCheckedChange={(checked) => handleSettingChange('appearance', 'highContrast', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Movimiento Reducido</Label>
                      <p className="text-sm text-gray-500">Menos animaciones</p>
                    </div>
                    <Switch
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleSettingChange('appearance', 'reducedMotion', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Datos */}
        <TabsContent value="data" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestión de Datos
              </CardTitle>
              <CardDescription>Administra tus datos y respaldos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Respaldo Automático</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Respaldo Automático</Label>
                        <p className="text-sm text-gray-500">Guardar datos automáticamente</p>
                      </div>
                      <Switch
                        checked={settings.data.autoBackup}
                        onCheckedChange={(checked) => handleSettingChange('data', 'autoBackup', checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frecuencia de Respaldo</Label>
                      <Select
                        value={settings.data.backupFrequency}
                        onValueChange={(value) => handleSettingChange('data', 'backupFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sincronización</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sincronización en la Nube</Label>
                        <p className="text-sm text-gray-500">Sincronizar entre dispositivos</p>
                      </div>
                      <Switch
                        checked={settings.data.cloudSync}
                        onCheckedChange={(checked) => handleSettingChange('data', 'cloudSync', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Almacenamiento Local</Label>
                        <p className="text-sm text-gray-500">Guardar en el dispositivo</p>
                      </div>
                      <Switch
                        checked={settings.data.localStorage}
                        onCheckedChange={(checked) => handleSettingChange('data', 'localStorage', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Retención de Datos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Período de Retención</Label>
                    <Select
                      value={settings.data.dataRetention}
                      onValueChange={(value) => handleSettingChange('data', 'dataRetention', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">6 meses</SelectItem>
                        <SelectItem value="1year">1 año</SelectItem>
                        <SelectItem value="2years">2 años</SelectItem>
                        <SelectItem value="forever">Para siempre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Formato de Exportación</Label>
                    <Select
                      value={settings.data.exportFormat}
                      onValueChange={(value) => handleSettingChange('data', 'exportFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Acciones de Datos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Datos
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Datos
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Datos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad y Autenticación
              </CardTitle>
              <CardDescription>Protege tu cuenta y datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Autenticación</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticación de Dos Factores</Label>
                        <p className="text-sm text-gray-500">Seguridad adicional</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cambio de Contraseña</Label>
                      <Select
                        value={settings.security.passwordChange}
                        onValueChange={(value) => handleSettingChange('security', 'passwordChange', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">Cada 30 días</SelectItem>
                          <SelectItem value="60days">Cada 60 días</SelectItem>
                          <SelectItem value="90days">Cada 90 días</SelectItem>
                          <SelectItem value="never">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gestión de Sesiones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Gestión de Sesiones</Label>
                        <p className="text-sm text-gray-500">Controlar sesiones activas</p>
                      </div>
                      <Switch
                        checked={settings.security.sessionManagement}
                        onCheckedChange={(checked) => handleSettingChange('security', 'sessionManagement', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Gestión de Dispositivos</Label>
                        <p className="text-sm text-gray-500">Administrar dispositivos</p>
                      </div>
                      <Switch
                        checked={settings.security.deviceManagement}
                        onCheckedChange={(checked) => handleSettingChange('security', 'deviceManagement', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Monitoreo de Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Historial de Inicios de Sesión</Label>
                      <p className="text-sm text-gray-500">Registrar accesos</p>
                    </div>
                    <Switch
                      checked={settings.security.loginHistory}
                      onCheckedChange={(checked) => handleSettingChange('security', 'loginHistory', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Actividad Sospechosa</Label>
                      <p className="text-sm text-gray-500">Alertas de seguridad</p>
                    </div>
                    <Switch
                      checked={settings.security.suspiciousActivity}
                      onCheckedChange={(checked) => handleSettingChange('security', 'suspiciousActivity', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Acciones de Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  <Button variant="outline" className="w-full">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verificar Dispositivos
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Revocar Sesiones
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rendimiento */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rendimiento y Optimización
              </CardTitle>
              <CardDescription>Optimiza el rendimiento de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Optimización</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Optimización Automática</Label>
                        <p className="text-sm text-gray-500">Mejorar rendimiento</p>
                      </div>
                      <Switch
                        checked={settings.performance.autoOptimize}
                        onCheckedChange={(checked) => handleSettingChange('performance', 'autoOptimize', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sincronización en Segundo Plano</Label>
                        <p className="text-sm text-gray-500">Sincronizar automáticamente</p>
                      </div>
                      <Switch
                        checked={settings.performance.backgroundSync}
                        onCheckedChange={(checked) => handleSettingChange('performance', 'backgroundSync', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo Sin Conexión</Label>
                        <p className="text-sm text-gray-500">Funcionar sin internet</p>
                      </div>
                      <Switch
                        checked={settings.performance.offlineMode}
                        onCheckedChange={(checked) => handleSettingChange('performance', 'offlineMode', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Almacenamiento</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tamaño de Caché (MB)</Label>
                      <Slider
                        value={[settings.performance.cacheSize]}
                        onValueChange={(value) => handleSettingChange('performance', 'cacheSize', value[0])}
                        max={500}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500">{settings.performance.cacheSize} MB</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compresión de Datos</Label>
                        <p className="text-sm text-gray-500">Reducir uso de espacio</p>
                      </div>
                      <Switch
                        checked={settings.performance.dataCompression}
                        onCheckedChange={(checked) => handleSettingChange('performance', 'dataCompression', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Sistema</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Battery className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Batería</p>
                    <p className="text-lg font-semibold">85%</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">CPU</p>
                    <p className="text-lg font-semibold">12%</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600">RAM</p>
                    <p className="text-lg font-semibold">2.1GB</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <HardDrive className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-gray-600">Almacenamiento</p>
                    <p className="text-lg font-semibold">45MB</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Acciones de Rendimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpiar Caché
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Optimizar Ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Actualizar Datos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botones de Acción Globales */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Predeterminados
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
} 