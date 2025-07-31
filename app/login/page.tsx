"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Eye,
  EyeOff,
  Heart,
  Shield,
  AlertCircle,
  User,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  Smartphone,
  Globe,
  Users,
  ArrowLeft,
  RefreshCw,
  Plus,
  Calendar,
  Pill,
  Activity,
  FileText,
  MessageCircle,
  Phone,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Star,
} from "lucide-react"
import SocialAuthModal from "@/components/social-auth-modal"

type AuthMode = "login" | "register" | "forgot-password" | "verify-code" | "reset-password"

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [selectedSocialProvider, setSelectedSocialProvider] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [enable2FA, setEnable2FA] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const { login, register, loading: authLoading } = useAuth()

  // Estados para diferentes formularios
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  })

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  })

  // Efecto para el bloqueo temporal
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  // Efecto para animaciones de entrada
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [authMode])

  // Efecto para modo oscuro
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(savedMode === "true")
    }
  }, [])

  // Calcular fortaleza de contraseña
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.length >= 12) strength += 10
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 15
    return Math.min(strength, 100)
  }

  useEffect(() => {
    if (authMode === "register") {
      setPasswordStrength(calculatePasswordStrength(registerData.password))
    } else if (authMode === "reset-password") {
      setPasswordStrength(calculatePasswordStrength(resetPasswordData.newPassword))
    }
  }, [registerData.password, resetPasswordData.newPassword, authMode])

  // Validaciones
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUsername = (username: string) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
  }

  const validateFullName = (name: string) => {
    return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name)
  }

  // Manejo de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) return

    setIsLoading(true)
    setError("")

    try {
      // Usar la autenticación real con la base de datos
      const result = await login(loginData.email, loginData.password)

      if (result) {
      // Login exitoso
      if (loginData.rememberMe) {
          localStorage.setItem("rememberUser", loginData.email)
      }

      setSuccess("¡Bienvenido a MediTrack!")
      setTimeout(() => {
        router.push("/")
      }, 1000)
      }
    } catch (error) {
      // Login fallido
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)

      if (newAttempts >= 5) {
        setIsBlocked(true)
        setBlockTimeRemaining(300) // 5 minutos
        setError("Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.")
      } else {
        setError(`Email o contraseña incorrectos. Intentos restantes: ${5 - newAttempts}`)
      }
    } finally {
    setIsLoading(false)
    }
  }

  // Manejo de registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (!validateFullName(registerData.fullName)) {
      setError("El nombre debe contener solo letras y espacios")
      setIsLoading(false)
      return
    }

    if (!validateEmail(registerData.email)) {
      setError("Por favor ingresa un email válido")
      setIsLoading(false)
      return
    }

    if (!validateUsername(registerData.username)) {
      setError("El usuario debe tener al menos 3 caracteres y solo letras, números y guiones bajos")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 60) {
      setError("La contraseña debe ser más segura")
      setIsLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!registerData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      setIsLoading(false)
      return
    }

    try {
      // Usar el registro real con la base de datos
      const userData = {
        name: registerData.fullName, // Usar 'name' en vez de 'fullName'
        email: registerData.email,
        password: registerData.password,
        phone: "",
        address: "",
        bloodType: "",
        emergencyContact: "",
        dateOfBirth: "",
        gender: ""
      }

      const result = await register(userData)

      if (result) {
    setSuccess("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.")
    setTimeout(() => {
      setAuthMode("login")
          setLoginData({ ...loginData, email: registerData.email })
    }, 2000)
      }
    } catch (error) {
      setError("Error al crear la cuenta. Por favor, intenta nuevamente.")
    } finally {
    setIsLoading(false)
    }
  }

  // Manejo de recuperación de contraseña
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateEmail(forgotPasswordData.email)) {
      setError("Por favor ingresa un email válido")
      setIsLoading(false)
      return
    }

    // Simular envío de código
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generar código de verificación
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    localStorage.setItem("verificationCode", code)
    localStorage.setItem("verificationEmail", forgotPasswordData.email)

    setSuccess(`Código de verificación enviado a ${forgotPasswordData.email}`)
    setAuthMode("verify-code")
    setIsLoading(false)
  }

  // Verificar código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const storedCode = localStorage.getItem("verificationCode")

    if (verificationCode !== storedCode) {
      setError("Código de verificación incorrecto")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSuccess("Código verificado correctamente")
    setAuthMode("reset-password")
    setIsLoading(false)
  }

  // Resetear contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (passwordStrength < 60) {
      setError("La nueva contraseña debe ser más segura")
      setIsLoading(false)
      return
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Actualizar contraseña (simulado)
    setSuccess("Contraseña actualizada exitosamente")
    setTimeout(() => {
      setAuthMode("login")
    }, 2000)

    setIsLoading(false)
  }

  // Manejo de login social
  const handleSocialLogin = (provider: string) => {
    setSelectedSocialProvider(provider)
    setShowSocialModal(true)
  }

  const handleSocialAuthComplete = (userData: any) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify({
      username: userData.name,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      provider: userData.provider
    }))
    localStorage.setItem("loginTime", new Date().toISOString())
    localStorage.setItem("socialLogin", userData.provider)

    setSuccess(`¡Bienvenido a MediTrack, ${userData.name}!`)
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  // Funciones auxiliares
  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return "text-green-600"
    if (passwordStrength >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return "Muy fuerte"
    if (passwordStrength >= 60) return "Fuerte"
    if (passwordStrength >= 40) return "Media"
    return "Débil"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleRememberMeChange = (checked: boolean) => {
    setLoginData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleAcceptTermsChange = (checked: boolean) => {
    setRegisterData((prev) => ({ ...prev, acceptTerms: checked }))
  }

  const handleEnable2FAChange = (checked: boolean) => {
    setEnable2FA(checked)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", newMode.toString())
  }

  const generatePasswordSuggestion = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const applyPasswordSuggestion = (suggestion: string) => {
    if (authMode === "register") {
      setRegisterData({ ...registerData, password: suggestion })
    } else if (authMode === "reset-password") {
      setResetPasswordData({ ...resetPasswordData, newPassword: suggestion })
    }
    setShowPasswordSuggestions(false)
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    } flex items-center justify-center p-4 relative overflow-hidden`}>
      
      {/* Partículas flotantes animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full opacity-20 animate-pulse ${
              isDarkMode ? 'bg-blue-400' : 'bg-teal-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
              </div>

      {/* Toggle de modo oscuro */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className={`rounded-full p-2 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white/20 text-gray-700 hover:bg-white/30'
          } backdrop-blur-sm`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
            </div>

      <div className={`w-full max-w-4xl transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white'
      } rounded-2xl shadow-2xl overflow-hidden relative`}>
        
        {/* Efecto de brillo en el borde */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-2xl opacity-20 blur-xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] relative z-10">
          
          {/* Panel Izquierdo - Información y Branding */}
          <div className={`bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 text-white p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-500 ${
            isAnimating ? 'animate-pulse' : ''
          }`}>
            {/* Fondo decorativo animado */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 animate-bounce"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-8 -translate-x-8 animate-pulse"></div>
            
            {/* Elementos flotantes adicionales */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            
            <div className="relative z-10 text-center lg:text-left">
              {/* Logo con animación */}
              <div className={`flex items-center justify-center lg:justify-start space-x-3 mb-6 transition-all duration-500 ${
                isAnimating ? 'scale-110' : 'scale-100'
              }`}>
                <div className="bg-white p-2 rounded-full shadow-lg animate-pulse">
                  <Heart className="w-6 h-6 text-teal-600" />
              </div>
                <h1 className="text-2xl lg:text-3xl font-bold">MediTrack</h1>
            </div>

              {/* Título principal */}
              <h2 className="text-xl lg:text-2xl font-bold mb-4">Bienvenido a MediTrack</h2>
              
              {/* Descripción */}
              <p className="text-base text-white/90 mb-6 leading-relaxed">
                Tu asistente personal de salud. Gestiona tus citas, medicación, historial médico y recibe consejos personalizados para un bienestar óptimo.
              </p>

              {/* Iconos de funcionalidades con hover effects */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                {[
                  { icon: Plus, label: "Citas", color: "hover:bg-white/30" },
                  { icon: Calendar, label: "Calendario", color: "hover:bg-white/30" },
                  { icon: Pill, label: "Medicación", color: "hover:bg-white/30" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 group">
                    <div className={`bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${item.color} cursor-pointer`}>
                      <item.icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
                    <span className="text-xs text-white/80 group-hover:text-white transition-colors duration-300">{item.label}</span>
          </div>
                ))}
        </div>

              {/* Características destacadas con iconos animados */}
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "Datos protegidos con encriptación avanzada", color: "text-teal-300" },
                  { icon: Smartphone, text: "Acceso desde cualquier dispositivo", color: "text-cyan-300" },
                  { icon: Globe, text: "Sincronización en tiempo real", color: "text-blue-300" },
                  { icon: Users, text: "Compartir con familia y médicos", color: "text-purple-300" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 group">
                    <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                    <span className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">{item.text}</span>
                </div>
                ))}
              </div>
            </div>
            </div>

          {/* Panel Derecho - Formulario */}
          <div className={`p-6 lg:p-8 flex items-center justify-center transition-all duration-500 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="w-full max-w-sm space-y-4">

            {/* Alertas */}
            {error && (
                <Alert variant="destructive" className={`border-red-200 transition-all duration-300 ${
                  isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50'
                }`}>
                <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
                <Alert className={`border-green-200 transition-all duration-300 ${
                  isDarkMode ? 'bg-green-900/50 border-green-700' : 'bg-green-50'
                }`}>
                <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>{success}</AlertDescription>
              </Alert>
            )}

            {isBlocked && (
                <Alert variant="destructive" className={isDarkMode ? 'bg-red-900/50 border-red-700' : ''}>
                <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                  Cuenta bloqueada por seguridad. Tiempo restante: {formatTime(blockTimeRemaining)}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulario de Login */}
            {authMode === "login" && (
                <div className={`space-y-4 transition-all duration-500 ${isAnimating ? 'animate-fade-in' : ''}`}>
                  <div className="text-center space-y-1">
                    <h2 className={`text-xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Iniciar Sesión</h2>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Accede a tu cuenta para gestionar tu salud</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="email" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className={`pl-10 h-11 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                          disabled={isBlocked}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="password" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className={`pl-10 pr-12 h-11 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                          disabled={isBlocked}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isBlocked}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={loginData.rememberMe}
                          onCheckedChange={handleRememberMeChange}
                          disabled={isBlocked}
                        />
                        <Label htmlFor="remember" className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Recordarme
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="text-xs text-teal-600 hover:text-teal-700 p-0"
                        onClick={() => setAuthMode("forgot-password")}
                        disabled={isBlocked}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      disabled={authLoading || isBlocked}
                    >
                      {authLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Iniciando sesión...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Iniciar Sesión</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <Separator className={`my-4 transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`} />

                  <div className="space-y-3">
                    <p className={`text-center text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>o continúa con</p>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: "Google", icon: "google", color: "border-red-200 hover:border-red-300 hover:bg-red-50" },
                        { name: "Facebook", icon: "facebook", color: "border-blue-200 hover:border-blue-300 hover:bg-blue-50" },
                        { name: "Outlook", icon: "outlook", color: "border-blue-200 hover:border-blue-300 hover:bg-blue-50" }
                      ].map((provider, index) => (
                      <Button
                          key={index}
                        variant="outline"
                          onClick={() => handleSocialLogin(provider.name)}
                          className={`w-full h-10 border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                              : provider.color
                          }`}
                        disabled={isBlocked}
                      >
                          {provider.icon === "google" && (
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                          )}
                          {provider.icon === "facebook" && (
                        <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                          )}
                          {provider.icon === "outlook" && (
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                          )}
                          {provider.name}
                      </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-xs">
                    <span className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>¿No tienes cuenta? </span>
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 p-0 text-xs font-medium"
                      onClick={() => setAuthMode("register")}
                    >
                      Regístrate aquí
                    </Button>
                  </div>
                    </div>
            )}

            {/* Formulario de Registro */}
            {authMode === "register" && (
                <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'animate-fade-in' : ''}`}>
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Crear Cuenta</h2>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Únete a MediTrack y comienza a gestionar tu salud</p>
                    </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Nombre Completo</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={registerData.fullName}
                          onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                          className={`pl-10 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className={`pl-10 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regUsername" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Usuario</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="regUsername"
                          type="text"
                          placeholder="Tu nombre de usuario"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                          className={`pl-10 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regPassword" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="regPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className={`pl-10 pr-12 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Indicador de fortaleza de contraseña mejorado */}
                      {authMode === "register" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>Fortaleza:</span>
                            <span className={`font-medium ${getPasswordStrengthColor()}`}>{getPasswordStrengthText()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength >= 80 ? 'bg-green-500' :
                                passwordStrength >= 60 ? 'bg-yellow-500' :
                                passwordStrength >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`}>Débil</span>
                            <span className={`transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`}>Fuerte</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Confirmar Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          className={`pl-10 pr-12 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                        id="terms"
                        checked={registerData.acceptTerms}
                        onCheckedChange={handleAcceptTermsChange}
                      />
                      <Label htmlFor="terms" className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Acepto los{" "}
                        <Button variant="link" className="text-teal-600 hover:text-teal-700 p-0 text-sm">
                          términos y condiciones
                        </Button>
                        </Label>
                      </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                        id="2fa"
                        checked={enable2FA}
                        onCheckedChange={handleEnable2FAChange}
                      />
                      <Label htmlFor="2fa" className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Habilitar autenticación de dos factores (recomendado)
                        </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Creando cuenta...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Crear Cuenta</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    <span className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>¿Ya tienes cuenta? </span>
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 p-0 font-medium"
                      onClick={() => setAuthMode("login")}
                    >
                      Inicia sesión aquí
                    </Button>
                  </div>
                </div>
            )}

              {/* Formulario de Contraseña Olvidada */}
            {authMode === "forgot-password" && (
                <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'animate-fade-in' : ''}`}>
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Recuperar Contraseña</h2>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Ingresa tu email para recibir instrucciones</p>
                    </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgotEmail" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="tu@email.com"
                          value={forgotPasswordData.email}
                          onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                          className={`pl-10 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Enviar Instrucciones</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 transition-all duration-300 hover:scale-105"
                      onClick={() => setAuthMode("login")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al login
                    </Button>
                    </div>
                  </div>
              )}

              {/* Formulario de Verificación de Código */}
              {authMode === "verify-code" && (
                <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'animate-fade-in' : ''}`}>
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Verificar Código</h2>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Ingresa el código de 6 dígitos enviado a tu email</p>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Código de Verificación</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className={`h-12 border-2 transition-all duration-300 text-center text-lg font-mono ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                            : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                        }`}
                        maxLength={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verificando...</span>
                    </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verificar Código</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className={`text-center text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <p>Código de prueba: <strong>123456</strong></p>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 transition-all duration-300 hover:scale-105"
                      onClick={() => setAuthMode("forgot-password")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </div>
                </div>
            )}

              {/* Formulario de Reset de Contraseña */}
            {authMode === "reset-password" && (
                <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'animate-fade-in' : ''}`}>
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Nueva Contraseña</h2>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Crea una nueva contraseña segura</p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Nueva Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nueva contraseña"
                          value={resetPasswordData.newPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                          className={`pl-10 pr-12 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Indicador de fortaleza de contraseña mejorado */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                          }`}>Fortaleza:</span>
                          <span className={`font-medium ${getPasswordStrengthColor()}`}>{getPasswordStrengthText()}</span>
                          </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength >= 80 ? 'bg-green-500' :
                              passwordStrength >= 60 ? 'bg-yellow-500' :
                              passwordStrength >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>Confirmar Nueva Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma la nueva contraseña"
                          value={resetPasswordData.confirmNewPassword}
                          onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmNewPassword: e.target.value })}
                          className={`pl-10 pr-12 h-12 border-2 transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20' 
                              : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                          }`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Actualizando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Actualizar Contraseña</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 transition-all duration-300 hover:scale-105"
                      onClick={() => setAuthMode("verify-code")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Autenticación Social */}
      <SocialAuthModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        mode="login"
        onAuthComplete={handleSocialAuthComplete}
      />
    </div>
  )
}
