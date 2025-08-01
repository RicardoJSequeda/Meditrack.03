"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual de MediTrack. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Simular respuesta del asistente
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular respuesta del asistente
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(text),
        isUser: false,
        timestamp: new Date()
      }
      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('cita') || input.includes('appointment')) {
      return 'Para programar una cita, ve a la sección "Citas" en el menú lateral. Allí podrás ver tus citas existentes y programar nuevas.'
    }
    
    if (input.includes('medicamento') || input.includes('medicina')) {
      return 'Puedes gestionar tus medicamentos en la sección "Tratamientos". Allí podrás agregar nuevos medicamentos y establecer recordatorios.'
    }
    
    if (input.includes('historial') || input.includes('médico')) {
      return 'Tu historial médico está disponible en la sección "Historial Médico". Allí encontrarás todos tus diagnósticos, tratamientos y eventos médicos.'
    }
    
    if (input.includes('emergencia') || input.includes('emergency')) {
      return 'En caso de emergencia, ve a la sección "Emergencia" donde podrás activar el modo de emergencia y contactar a tus contactos de emergencia.'
    }
    
    if (input.includes('recordatorio') || input.includes('reminder')) {
      return 'Los recordatorios están en la sección "Recordatorios". Puedes configurar recordatorios para medicamentos, citas y otros eventos importantes.'
    }
    
    return 'Entiendo tu consulta. Puedo ayudarte con citas médicas, medicamentos, historial médico, emergencias y recordatorios. ¿Qué te gustaría saber más específicamente?'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-teal-600 hover:bg-teal-700 z-50"
        size="icon"
        aria-label="Abrir asistente virtual"
        title="Asistente Virtual"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Modal del asistente */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          <Card className="w-96 h-[500px] flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-teal-600" />
                <span id="assistant-title" className="font-semibold">Asistente Virtual</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar asistente virtual"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.isUser
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    role="article"
                    aria-label={`${message.isUser ? 'Tu mensaje' : 'Respuesta del asistente'}: ${message.text}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isTyping}
                  aria-label="Escribe tu mensaje al asistente virtual"
                  aria-describedby="send-button"
                />
                <Button
                  id="send-button"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-teal-600 hover:bg-teal-700"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
} 