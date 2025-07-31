"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, Calendar, FileText, Paperclip } from "lucide-react"

interface DoctorChatModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: any
}

interface Message {
  id: string
  content: string
  sender: "user" | "doctor"
  timestamp: Date
}

export default function DoctorChatModal({ isOpen, onClose, doctor }: DoctorChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hola María, ¿cómo te has sentido desde nuestra última consulta?",
      sender: "doctor",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      content: "Hola doctor, me he sentido mucho mejor. La presión arterial se ha estabilizado.",
      sender: "user",
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: "3",
      content: "Excelente noticia. He revisado tus últimas mediciones y se ven muy bien. ¿Has tenido algún síntoma?",
      sender: "doctor",
      timestamp: new Date(Date.now() - 2400000),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateDoctorResponse = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Entiendo tu preocupación. Basándome en tus síntomas, te recomiendo...",
        "Esos valores se ven bien. Continúa con tu medicación actual.",
        "Es importante que mantengas un registro de estos síntomas. ¿Has notado algún patrón?",
        "Programemos una cita para revisar esto en persona. ¿Qué día te viene mejor?",
        "Tus resultados muestran una mejora significativa. ¡Felicitaciones por tu dedicación!",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const newMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "doctor",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    simulateDoctorResponse(inputMessage)
    setInputMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!doctor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback>
                  {doctor.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doctor.online ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>
            <div className="flex-1">
              <DialogTitle>{doctor.name}</DialogTitle>
              <DialogDescription className="flex items-center space-x-2">
                <span>{doctor.specialty}</span>
                <Badge variant="outline" className="text-xs">
                  {doctor.online ? "En línea" : "Desconectado"}
                </Badge>
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 space-y-3">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-1" />
              Compartir Reporte
            </Button>
            <Button size="sm" variant="outline">
              <Paperclip className="w-4 h-4 mr-1" />
              Adjuntar
            </Button>
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
