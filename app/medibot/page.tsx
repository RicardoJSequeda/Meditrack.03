"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Heart,
  AlertTriangle,
  Lightbulb,
  Clock,
  Mic,
  ImageIcon,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "suggestion" | "warning"
}

export default function MediBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy MediBot, tu asistente de salud con inteligencia artificial. Puedo ayudarte con análisis generales de síntomas, consejos de salud y responder preguntas médicas básicas. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
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

  const quickSuggestions = [
    "¿Qué significa tener dolor de cabeza frecuente?",
    "Consejos para mejorar mi sueño",
    "¿Cuándo debo preocuparme por la fiebre?",
    "Ejercicios recomendados para mi edad",
    "¿Cómo puedo reducir el estrés?",
    "Síntomas de presión arterial alta",
  ]

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(() => {
      let botResponse = ""
      let responseType: "text" | "suggestion" | "warning" = "text"

      // Simulación de respuestas basadas en palabras clave
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes("dolor de cabeza") || lowerMessage.includes("cefalea")) {
        botResponse =
          "Los dolores de cabeza pueden tener múltiples causas: estrés, deshidratación, tensión muscular, o cambios hormonales. Te recomiendo: 1) Mantener una buena hidratación, 2) Descansar en un lugar oscuro y silencioso, 3) Aplicar compresas frías o calientes según te resulte más cómodo. Si los dolores son frecuentes o muy intensos, es importante consultar con un médico."
        responseType = "suggestion"
      } else if (lowerMessage.includes("fiebre")) {
        botResponse =
          "La fiebre es una respuesta natural del cuerpo ante infecciones. Debes consultar a un médico si: la temperatura supera los 39°C (102°F), persiste por más de 3 días, se acompaña de dificultad respiratoria, dolor de pecho, o confusión. Mientras tanto, mantente hidratado y descansa."
        responseType = "warning"
      } else if (lowerMessage.includes("sueño") || lowerMessage.includes("dormir")) {
        botResponse =
          "Para mejorar la calidad del sueño te sugiero: 1) Mantener horarios regulares, 2) Evitar pantallas 1 hora antes de dormir, 3) Crear un ambiente fresco y oscuro, 4) Evitar cafeína después de las 2 PM, 5) Hacer ejercicio regular pero no cerca de la hora de dormir. Un buen descanso es fundamental para tu salud."
        responseType = "suggestion"
      } else if (lowerMessage.includes("estrés")) {
        botResponse =
          "El manejo del estrés es crucial para tu bienestar. Técnicas efectivas incluyen: respiración profunda, meditación, ejercicio regular, mantener conexiones sociales, y establecer límites saludables. Si el estrés interfiere significativamente con tu vida diaria, considera hablar con un profesional de la salud mental."
        responseType = "suggestion"
      } else if (lowerMessage.includes("presión") || lowerMessage.includes("hipertensión")) {
        botResponse =
          "Los síntomas de presión arterial alta pueden incluir: dolores de cabeza, mareos, visión borrosa, o sangrado nasal. Sin embargo, la hipertensión a menudo es 'silenciosa'. Es importante monitorear regularmente tu presión arterial y seguir las recomendaciones de tu médico sobre dieta, ejercicio y medicamentos."
        responseType = "warning"
      } else {
        botResponse =
          "Entiendo tu consulta. Como asistente de IA, puedo proporcionar información general sobre salud, pero recuerda que no reemplazo el consejo médico profesional. Para síntomas específicos o preocupaciones serias, siempre consulta con un profesional de la salud. ¿Hay algo más específico en lo que pueda ayudarte?"
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        type: responseType,
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    simulateBotResponse(inputMessage)
    setInputMessage("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="p-4 md:pl-6 md:pr-6 md:py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MediBot</h1>
            <p className="text-gray-600">Tu asistente de salud con inteligencia artificial</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by Gemini AI
        </Badge>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">MediBot está en línea</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Salud
            </Badge>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.type === "warning"
                      ? "bg-red-50 border border-red-200 text-red-900"
                      : message.type === "suggestion"
                        ? "bg-green-50 border border-green-200 text-green-900"
                        : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0">
                      {message.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                      ) : message.type === "suggestion" ? (
                        <Lightbulb className="w-4 h-4 text-green-500 mt-1" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-500 mt-1" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-500" />
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
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4 space-y-4">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs hover:bg-blue-50"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta de salud aquí..."
                className="pr-20"
                disabled={isTyping}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Mic className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <ImageIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Aviso Importante</p>
              <p>
                MediBot proporciona información general sobre salud y no debe considerarse como consejo médico
                profesional. Siempre consulta con un profesional de la salud para diagnósticos, tratamientos o
                decisiones médicas importantes. En caso de emergencia, contacta inmediatamente a los servicios de
                emergencia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Análisis de Síntomas</h3>
            <p className="text-sm text-gray-600 mt-1">Evaluación básica de síntomas comunes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Lightbulb className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Consejos de Salud</h3>
            <p className="text-sm text-gray-600 mt-1">Recomendaciones personalizadas de bienestar</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Disponible 24/7</h3>
            <p className="text-sm text-gray-600 mt-1">Asistencia de salud cuando la necesites</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
