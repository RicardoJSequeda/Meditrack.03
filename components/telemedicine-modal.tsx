"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  FileText,
  MessageCircle,
  Settings,
  Users,
  RepeatIcon as Record,
} from "lucide-react"

interface TelemedicineModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TelemedicineModal({ isOpen, onClose }: TelemedicineModalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionTime, setConnectionTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleConnect = () => {
    setIsConnected(true)
    setConnectionTime(0)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectionTime(0)
    onClose()
  }

  const doctor = {
    name: "Dra. García",
    specialty: "Cardiología",
    avatar: "/placeholder.svg?height=60&width=60",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[700px] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback>DG</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>Consulta Virtual - {doctor.name}</DialogTitle>
                <DialogDescription>{doctor.specialty}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Conectado - {formatTime(connectionTime)}
                </Badge>
              )}
              {isRecording && (
                <Badge className="bg-red-100 text-red-800">
                  <Record className="w-3 h-3 mr-1" />
                  Grabando
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Video Area */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative">
          {!isConnected ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <Video className="w-16 h-16 mx-auto text-gray-400" />
                <h3 className="text-xl font-medium">Consulta Virtual</h3>
                <p className="text-gray-300">Presiona "Conectar" para iniciar la videollamada</p>
                <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                  <Video className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full relative">
              {/* Simulación de video del doctor */}
              <div className="h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback className="text-4xl">DG</AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-medium">{doctor.name}</h3>
                  <p className="text-blue-200">{doctor.specialty}</p>
                </div>
              </div>

              {/* Video del usuario (pequeño) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
                {videoEnabled ? (
                  <div className="h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarFallback>MG</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">María</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gray-700 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Indicadores de estado */}
              <div className="absolute top-4 left-4 flex space-x-2">
                {!audioEnabled && (
                  <Badge className="bg-red-600">
                    <MicOff className="w-3 h-3 mr-1" />
                    Silenciado
                  </Badge>
                )}
                {!videoEnabled && (
                  <Badge className="bg-gray-600">
                    <VideoOff className="w-3 h-3 mr-1" />
                    Video desactivado
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                disabled={!isConnected}
              >
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>

              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="sm"
                onClick={() => setVideoEnabled(!videoEnabled)}
                disabled={!isConnected}
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>

              <Button variant="outline" size="sm" disabled={!isConnected}>
                <Monitor className="w-4 h-4 mr-1" />
                Compartir Pantalla
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                disabled={!isConnected}
              >
                <Record className="w-4 h-4 mr-1" />
                {isRecording ? "Detener" : "Grabar"}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={!isConnected}>
                <FileText className="w-4 h-4 mr-1" />
                Compartir Archivos
              </Button>

              <Button variant="outline" size="sm" disabled={!isConnected}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>

              <Button variant="outline" size="sm" disabled={!isConnected}>
                <Settings className="w-4 h-4 mr-1" />
                Configuración
              </Button>

              <Button variant="destructive" size="sm" onClick={handleDisconnect} disabled={!isConnected}>
                <PhoneOff className="w-4 h-4 mr-1" />
                Finalizar
              </Button>
            </div>
          </div>

          {/* Funciones avanzadas */}
          {isConnected && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <Users className="w-3 h-3 mr-1" />
                  Invitar Especialista
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <FileText className="w-3 h-3 mr-1" />
                  Historial Médico
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <Monitor className="w-3 h-3 mr-1" />
                  Mostrar Resultados
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Notas de Consulta
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
