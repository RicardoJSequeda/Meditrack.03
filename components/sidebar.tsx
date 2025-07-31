"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigation } from "@/hooks/use-navigation"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useAuth } from "@/hooks/use-api"
import {
  Home,
  Calendar,
  AlertTriangle,
  History,
  Lightbulb,
  StickyNote,
  Bell,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Shield,
  Heart,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  {
    name: "Inicio",
    href: "/",
    icon: Home,
    description: "Dashboard principal",
    priority: "high",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    name: "Mis Citas",
    href: "/appointments",
    icon: Calendar,
    description: "Gestionar citas médicas",
    priority: "high",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    name: "Emergencia",
    href: "/emergency",
    icon: AlertTriangle,
    description: "Contactos y protocolos de emergencia",
    priority: "high",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    name: "Recordatorios",
    href: "/reminders",
    icon: Bell,
    description: "Recordatorios de medicación y citas",
    priority: "high",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    name: "Informe",
    href: "/reports",
    icon: BarChart3,
    description: "Análisis de salud y reportes",
    priority: "medium",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  {
    name: "Historial",
    href: "/medical-history",
    icon: History,
    description: "Historial médico completo",
    priority: "medium",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    name: "Consejos",
    href: "/advice",
    icon: Lightbulb,
    description: "Consejos de salud personalizados",
    priority: "low",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    name: "Notas",
    href: "/notes",
    icon: StickyNote,
    description: "Notas médicas personales",
    priority: "low",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    description: "Ajustes de la aplicación",
    priority: "low",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
]

interface SidebarProps {
  className?: string
  onCollapseChange?: (collapsed: boolean) => void
}

// Componente memoizado para elementos de navegación
const NavigationItem = memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  isNavigating, 
  onNavigate 
}: {
  item: typeof navigation[0]
  isActive: boolean
  isCollapsed: boolean
  isNavigating: boolean
  onNavigate: (href: string) => void
}) => {
  const Icon = item.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            prefetch={item.priority === "high"}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 hover:shadow-md relative overflow-hidden",
              isActive 
                ? `${item.bgColor} ${item.color} border ${item.borderColor} shadow-sm` 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              isCollapsed ? "px-2 py-2 justify-center" : "",
              isNavigating && isActive ? "opacity-75 scale-95" : ""
            )}
            onClick={() => onNavigate(item.href)}
          >
            {/* Background animation */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isActive && "opacity-100"
            )} />
            
            {/* Icon */}
            <Icon className={cn(
              "h-5 w-5 transition-all duration-300 flex-shrink-0",
              isActive ? item.color : "text-gray-500 group-hover:text-gray-700",
              isCollapsed && isActive && "text-white"
            )} />
            
            {/* Text content */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.name}</div>
                {isActive && (
                  <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
                )}
              </div>
            )}
            
            {/* Active indicator */}
            {isActive && !isCollapsed && (
              <div className={cn("h-2 w-2 rounded-full transition-all duration-300", item.color.replace('text-', 'bg-'))} />
            )}
            
            {/* Loading indicator */}
            {isNavigating && isActive && (
              <div className="absolute inset-0 bg-white/50 rounded-xl animate-pulse" />
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-gray-900 text-white">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
})

NavigationItem.displayName = 'NavigationItem'

// Componente memoizado para el perfil de usuario
const UserProfile = memo(({ user, isCollapsed, notifications, onMarkAsRead, onMarkAllAsRead }: { 
  user: any, 
  isCollapsed: boolean,
  notifications: any[],
  onMarkAsRead?: (id: string) => void,
  onMarkAllAsRead?: () => void
}) => {
  const unreadCount = notifications.filter(n => !n.read).length
  const isAuthenticated = user.healthStatus !== "No autenticado" && user.healthStatus !== "Verificando"
  if (isCollapsed) {
    return (
      <div className="p-3 border-b border-gray-100 flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative cursor-pointer">
                <Avatar className={cn(
                  "h-10 w-10 ring-2 transition-all duration-300",
                  user.loading ? "ring-gray-300 animate-pulse" : 
                  isAuthenticated ? "ring-green-200 hover:ring-green-300" : 
                  "ring-red-200 hover:ring-red-300"
                )}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className={cn(
                    "font-medium",
                    user.loading ? "bg-gray-100 text-gray-600" :
                    isAuthenticated ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {user.loading ? "..." : user.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white">
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs opacity-75">
                  {user.loading ? "Verificando..." : user.healthStatus}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className={cn(
            "h-12 w-12 ring-2 transition-all duration-300",
            user.loading ? "ring-gray-300 animate-pulse" : 
            isAuthenticated ? "ring-green-200 hover:ring-green-300" : 
            "ring-red-200 hover:ring-red-300"
          )}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className={cn(
              "font-medium text-lg",
              user.loading ? "bg-gray-100 text-gray-600" :
              isAuthenticated ? "bg-green-100 text-green-700" :
              "bg-red-100 text-red-700"
            )}>
              {user.loading ? "..." : user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-semibold truncate",
            user.loading ? "text-gray-500" : "text-gray-900"
          )}>
            {user.loading ? "Verificando..." : user.name}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className={cn(
              "text-xs",
              user.loading ? "bg-gray-100 text-gray-600 border-gray-300" :
              isAuthenticated ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" :
              "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full mr-1",
                user.loading ? "bg-gray-400" :
                isAuthenticated ? "bg-green-500 animate-pulse" :
                "bg-red-500"
              )} />
              {user.loading ? "Verificando" : user.healthStatus}
            </Badge>
          </div>
        </div>
        <NotificationsDropdown
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
        />
      </div>
    </div>
  )
})

UserProfile.displayName = 'UserProfile'

export default function Sidebar({ className, onCollapseChange }: SidebarProps) {
  // Función para capitalizar la primera letra de cada palabra
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Usar hook de navegación optimizado
  const { isNavigating, navigate } = useNavigation({
    loadingDelay: 0,
    onNavigate: () => setIsMobileOpen(false)
  })

  // Usar hook de autenticación que funciona
  const { user: authUser, loading } = useAuth()
  
  // Obtener datos optimizados para display
  const user = useMemo(() => {
    if (loading) {
      return {
        name: "Cargando...",
        email: "",
        avatar: "/placeholder.svg?height=40&width=40",
        healthStatus: "Verificando",
        loading: true
      }
    }

    if (!authUser) {
      return {
        name: "Invitado",
        email: "",
        avatar: "/placeholder.svg?height=40&width=40",
        healthStatus: "No autenticado",
        loading: false
      }
    }

    // Usar datos del usuario autenticado - nombre y apellido con capitalización
    const fullName = authUser.name || authUser.email?.split('@')[0] || "Usuario"
    const nameParts = fullName.split(' ')
    
    // Lógica para nombre y apellido
    let displayName = ""
    if (nameParts.length >= 4) {
      // Caso: "ricardo javier sequeda goez" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[2]  // sequeda (tercera palabra)
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 3) {
      // Caso: "ricardo sequeda goez" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[1]  // sequeda (segunda palabra)
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 2) {
      // Caso: "ricardo sequeda" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[1]  // sequeda
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 1) {
      // Caso: "ricardo" → "Ricardo"
      displayName = capitalizeFirstLetter(nameParts[0])
    } else {
      // Fallback
      displayName = "Usuario"
    }
    
    return {
      name: displayName,
      email: authUser.email || "",
      avatar: authUser.avatar || "/placeholder.svg?height=40&width=40",
      healthStatus: "Saludable",
      loading: false
    }
  }, [authUser, loading])

  // Simular notificaciones (en producción vendrían de la API)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Recordatorio de medicación",
      message: "Es hora de tomar tu medicamento",
      type: "warning" as const,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
      read: false
    },
    {
      id: "2",
      title: "Cita médica confirmada",
      message: "Tu cita para mañana ha sido confirmada",
      type: "success" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false
    },
    {
      id: "3",
      title: "Nuevo consejo de salud",
      message: "Descubre cómo mejorar tu bienestar",
      type: "info" as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      read: true
    }
  ])

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  // Memoizar navegación priorizada
  const prioritizedNavigation = useMemo(() => {
    const highPriority = navigation.filter(item => item.priority === "high")
    const mediumPriority = navigation.filter(item => item.priority === "medium")
    const lowPriority = navigation.filter(item => item.priority === "low")
    return [...highPriority, ...mediumPriority, ...lowPriority]
  }, [])

  // Memoizar función de detección de ruta activa
  const isActive = useCallback((href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }, [pathname])

  // Optimizar función de logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    router.push("/login")
  }, [router])

  // Función optimizada para manejo de navegación
  const handleNavigation = useCallback((href: string) => {
    navigate(href)
  }, [navigate])

  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const SidebarContent = useMemo(() => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={`p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 ${isCollapsed ? "px-2 py-3" : ""}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isCollapsed ? "justify-center space-x-0" : ""}`}>
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2.5 rounded-xl flex-shrink-0 shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  MediTrack
                </h1>
                <p className="text-xs text-gray-600 font-medium">Tu asistente de salud</p>
              </div>
            )}
          </div>
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex h-8 w-8 p-0 hover:bg-white/50 rounded-lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <UserProfile 
        user={user} 
        isCollapsed={isCollapsed} 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Navigation */}
      <nav className={`flex-1 p-3 space-y-2 overflow-y-auto ${isCollapsed ? "px-2 py-2" : "px-4"}`}>
        {prioritizedNavigation.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
            isNavigating={isNavigating}
            onNavigate={handleNavigation}
          />
        ))}
      </nav>

      <Separator className="mx-4" />

      {/* Footer */}
      <div className={`p-3 space-y-2 ${isCollapsed ? "px-2 py-2" : "px-4"}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                prefetch={false}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 relative overflow-hidden",
                  isCollapsed ? "justify-center px-2 py-2" : "",
                )}
                onClick={() => handleNavigation("/profile")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="h-5 w-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                {!isCollapsed && <span>Mi Perfil</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Mi Perfil
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 group relative overflow-hidden",
                  isCollapsed ? "justify-center px-2 py-2" : "",
                )}
                onClick={handleLogout}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                {!isCollapsed && "Cerrar Sesión"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Cerrar Sesión
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {!isCollapsed && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>Datos protegidos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  ), [isCollapsed, user, prioritizedNavigation, isActive, isNavigating, handleNavigation, handleLogout])

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg rounded-xl border border-gray-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 shadow-xl",
          "transform transition-all duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:z-auto",
          isCollapsed ? "md:w-16" : "md:w-72",
          "md:flex-shrink-0 will-change-transform"
        )}
      >
        {SidebarContent}
      </div>
    </>
  )
}
