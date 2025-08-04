"use client"

import { useAuth } from "@/hooks/use-api"

interface WelcomeMessageProps {
  className?: string
  showTime?: boolean
}

export function WelcomeMessage({ className = "", showTime = false }: WelcomeMessageProps) {
  const { user: authUser } = useAuth()

  // Función para capitalizar la primera letra
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      return "Buenos días"
    } else if (hour >= 12 && hour < 18) {
      return "Buenas tardes"
    } else {
      return "Buenas noches"
    }
  }

  // Función para obtener el nombre del usuario
  const getUserDisplayName = () => {
    if (!authUser?.name) {
      return "Usuario"
    }

    const fullName = authUser.name
    const nameParts = fullName.split(' ')
    
    // Lógica para nombre y apellido (igual que en sidebar)
    if (nameParts.length >= 4) {
      // Caso: "ricardo javier sequeda goez" → "Ricardo"
      const firstName = nameParts[0] // ricardo
      return capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 3) {
      // Caso: "ricardo sequeda goez" → "Ricardo"
      const firstName = nameParts[0] // ricardo
      return capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 2) {
      // Caso: "ricardo sequeda" → "Ricardo"
      const firstName = nameParts[0] // ricardo
      return capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 1) {
      // Caso: "ricardo" → "Ricardo"
      return capitalizeFirstLetter(nameParts[0])
    } else {
      return "Usuario"
    }
  }

  // Función para obtener la hora actual
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const greeting = getGreeting()
  const userName = getUserDisplayName()
  const currentTime = getCurrentTime()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {greeting}, {userName}
      </h1>
      {showTime && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentTime}
        </p>
      )}
    </div>
  )
} 