"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart, Shield, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value as string))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Preparar los datos para el API
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess("¡Cuenta creada exitosamente!")
        setTimeout(() => {
          router.push("/login")
        }, 1000)
      } else {
        setError(result.error || "Error al crear la cuenta. Por favor, intenta nuevamente.")
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError("Error al crear la cuenta. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Muy débil"
    if (passwordStrength < 50) return "Débil"
    if (passwordStrength < 75) return "Buena"
    return "Muy fuerte"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo y título */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-green-600 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">MediTrack</h1>
          </div>
          <p className="text-gray-600">Únete a tu asistente personal de salud</p>
        </div>

        <Card className="border-green-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa tus datos para comenzar a cuidar tu salud
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombres */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Tu nombre"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (Opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
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
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Fortaleza de contraseña:</span>
                      <span
                        className={
                          passwordStrength >= 75
                            ? "text-green-600"
                            : passwordStrength >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className={`h-2 ${getPasswordStrengthColor()}`} />
                  </div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
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
                  {formData.confirmPassword && (
                    <div className="absolute right-10 top-3">
                      {formData.password === formData.confirmPassword ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    Acepto los{" "}
                    <Link href="/terms" className="text-green-600 hover:underline">
                      Términos y Condiciones
                    </Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm leading-5">
                    Acepto la{" "}
                    <Link href="/privacy" className="text-green-600 hover:underline">
                      Política de Privacidad
                    </Link>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={
                  !formData.acceptTerms || !formData.acceptPrivacy || formData.password !== formData.confirmPassword || isLoading
                }
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">¡Éxito!</strong>
                <span className="block sm:inline"> {success}</span>
              </div>
            )}

            <Separator className="my-4" />

            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">O regístrate con</p>

              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Registrarse con Google
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Registrarse con Facebook
                </Button>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Información de seguridad */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 Tu información médica está protegida con los más altos estándares de seguridad</p>
          <p>✅ Cumplimos con HIPAA y normativas internacionales de privacidad</p>
        </div>
      </div>
    </div>
  )
}
