"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Chrome, 
  Facebook, 
  Mail, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  User,
  Lock,
  Phone,
  Globe,
  Zap,
  Sparkles,
  Heart,
  Users,
  Calendar,
  Pill
} from "lucide-react"

interface SocialAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register"
  onAuthComplete?: (userData: any) => void
}

interface AuthState {
  provider: string | null
  step: "select" | "authorize" | "permissions" | "loading" | "success" | "error"
  userData: any
  error: string
  permissions: string[]
  requestedPermissions: string[]
}

export default function SocialAuthModal({ isOpen, onClose, mode, onAuthComplete }: SocialAuthModalProps) {
  const [authState, setAuthState] = useState<AuthState>({
    provider: null,
    step: "select",
    userData: null,
    error: "",
    permissions: [],
    requestedPermissions: []
  })

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
  })

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAuthState({
        provider: null,
        step: "select",
        userData: null,
        error: "",
        permissions: [],
        requestedPermissions: []
      })
    }
  }, [isOpen])

  const providers = [
    {
      id: "google",
      name: "Google",
      icon: Chrome,
      color: "hover:bg-red-50 hover:border-red-300",
      bgColor: "bg-white",
      textColor: "text-gray-700",
      description: "Accede con tu cuenta de Google",
      permissions: [
        "Información básica del perfil",
        "Dirección de correo electrónico",
        "Foto de perfil"
      ]
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50 hover:border-blue-300",
      bgColor: "bg-white",
      textColor: "text-gray-700",
      description: "Accede con tu cuenta de Facebook",
      permissions: [
        "Información básica del perfil",
        "Dirección de correo electrónico",
        "Foto de perfil",
        "Lista de amigos"
      ]
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: Mail,
      color: "hover:bg-blue-50 hover:border-blue-300",
      bgColor: "bg-white",
      textColor: "text-gray-700",
      description: "Accede con tu cuenta de Outlook",
      permissions: [
        "Información básica del perfil",
        "Dirección de correo electrónico",
        "Calendario (opcional)"
      ]
    }
  ]

  const handleProviderSelect = (providerId: string) => {
    setAuthState(prev => ({
      ...prev,
      provider: providerId,
      step: "authorize",
      requestedPermissions: providers.find(p => p.id === providerId)?.permissions || []
    }))
  }

  const handleAuthorize = async () => {
    setAuthState(prev => ({ ...prev, step: "loading" }))

    try {
      // Simular proceso de autorización
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simular datos del usuario obtenidos
      const mockUserData = {
        id: `user_${Date.now()}`,
        name: "Usuario Demo",
        email: "usuario@demo.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        provider: authState.provider,
        permissions: authState.requestedPermissions
      }

      setAuthState(prev => ({
        ...prev,
        step: "permissions",
        userData: mockUserData,
        permissions: authState.requestedPermissions
      }))
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: "error",
        error: "Error al conectar con el proveedor de autenticación"
      }))
    }
  }

  const handleAcceptPermissions = async () => {
    setAuthState(prev => ({ ...prev, step: "loading" }))

    try {
      // Simular procesamiento de permisos
      await new Promise(resolve => setTimeout(resolve, 1500))

      setAuthState(prev => ({ ...prev, step: "success" }))

      // Simular éxito y cerrar modal
      setTimeout(() => {
        if (onAuthComplete && authState.userData) {
          onAuthComplete(authState.userData)
        }
    onClose()
      }, 2000)
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        step: "error",
        error: "Error al procesar los permisos"
      }))
    }
  }

  const handleDeclinePermissions = () => {
    setAuthState(prev => ({
      ...prev,
      step: "select",
      provider: null,
      userData: null,
      permissions: [],
      requestedPermissions: []
    }))
  }

  const handleBack = () => {
    if (authState.step === "permissions") {
      setAuthState(prev => ({ ...prev, step: "authorize" }))
    } else if (authState.step === "authorize") {
      setAuthState(prev => ({ ...prev, step: "select", provider: null }))
    }
  }

  const handleErrorRetry = () => {
    setAuthState(prev => ({
      ...prev,
      step: "select",
      provider: null,
      userData: null,
      error: "",
      permissions: [],
      requestedPermissions: []
    }))
  }

  const renderStep = () => {
    switch (authState.step) {
      case "select":
  return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-semibold">MediTrack</h3>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <p className="text-gray-600">
                {mode === "login" 
                  ? "Elige cómo quieres acceder a tu cuenta" 
                  : "Elige cómo quieres crear tu cuenta"
                }
              </p>
            </div>

          <div className="space-y-3">
              {providers.map((provider) => (
            <Button
                  key={provider.id}
              variant="outline"
                  className={`w-full h-14 justify-start border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${provider.color}`}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <provider.icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Continuar con {provider.name}</div>
                      <div className="text-xs text-gray-500">{provider.description}</div>
          </div>
            </div>
                </Button>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">O continúa con email y contraseña</p>
          </div>

              <form className="space-y-3">
            <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
              <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

              <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                      className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </Button>
              </form>
            </div>
          </div>
        )

      case "authorize":
        const selectedProvider = providers.find(p => p.id === authState.provider)
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
                             <div className="flex items-center justify-center space-x-2 mb-4">
                 {selectedProvider?.icon && <selectedProvider.icon className="w-6 h-6" />}
                 <h3 className="text-lg font-semibold">{selectedProvider?.name}</h3>
               </div>
              <h2 className="text-xl font-bold text-gray-900">Autorización Requerida</h2>
              <p className="text-gray-600">
                MediTrack necesita acceso a tu cuenta de {selectedProvider?.name} para continuar
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">Permisos solicitados:</h4>
              <ul className="space-y-2">
                {authState.requestedPermissions.map((permission, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
              </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Tu privacidad está protegida</p>
                  <p className="text-blue-700 mt-1">
                    Solo accedemos a la información necesaria para tu cuenta. 
                    Nunca compartimos tus datos con terceros.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                onClick={handleAuthorize}
              >
                <Globe className="w-4 h-4 mr-2" />
                Autorizar
              </Button>
            </div>
          </div>
        )

      case "permissions":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">¡Autorización Exitosa!</h2>
              <p className="text-gray-600">
                {authState.userData?.name} ha autorizado el acceso a su cuenta
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={authState.userData?.avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{authState.userData?.name}</p>
                  <p className="text-sm text-gray-500">{authState.userData?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Permisos otorgados:</h4>
              <ul className="space-y-1">
                {authState.permissions.map((permission, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-blue-800">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDeclinePermissions}
              >
                Rechazar
            </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                onClick={handleAcceptPermissions}
              >
                <Zap className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>
          </div>
        )

      case "loading":
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {authState.step === "loading" && authState.provider 
                  ? `Conectando con ${providers.find(p => p.id === authState.provider)?.name}...`
                  : "Procesando..."
                }
              </h2>
              <p className="text-gray-600">
                Por favor espera mientras procesamos tu solicitud
              </p>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Bienvenido a MediTrack!</h2>
              <p className="text-gray-600">
                Tu cuenta ha sido configurada exitosamente
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Redirigiendo al dashboard...</span>
              </div>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
              <p className="text-gray-600 mb-4">
                {authState.error || "No se pudo completar la autenticación"}
              </p>
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Verifica tu conexión a internet e intenta nuevamente
              </AlertDescription>
            </Alert>
            <Button
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              onClick={handleErrorRetry}
            >
              Intentar Nuevamente
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {authState.step === "select" && (
            <>
              <DialogTitle className="text-center">
                {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {mode === "login" 
                  ? "Accede a tu cuenta para gestionar tu salud" 
                  : "Únete a MediTrack y comienza a gestionar tu salud"
                }
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {renderStep()}

        {authState.step === "select" && (
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-4">
            <Shield className="h-3 w-3" />
            <span>Tus datos están protegidos con encriptación de extremo a extremo</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
