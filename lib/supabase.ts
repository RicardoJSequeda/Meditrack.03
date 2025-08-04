import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operaciones del servidor (con service role key)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Solo crear el cliente admin si tenemos la service role key
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          phone: string | null
          address: string | null
          bloodType: string | null
          emergencyContact: string | null
          dateOfBirth: Date | null
          gender: string | null
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          phone?: string | null
          address?: string | null
          bloodType?: string | null
          emergencyContact?: string | null
          dateOfBirth?: Date | null
          gender?: string | null
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          phone?: string | null
          address?: string | null
          bloodType?: string | null
          emergencyContact?: string | null
          dateOfBirth?: Date | null
          gender?: string | null
          createdAt?: Date
          updatedAt?: Date
        }
      }
      diagnoses: {
        Row: {
          id: string
          condition: string
          diagnosedDate: Date
          doctor: string
          specialty: string
          severity: 'LEVE' | 'MODERADA' | 'GRAVE'
          status: 'ACTIVA' | 'CONTROLADA' | 'RESUELTA'
          lastReading: string | null
          nextCheckup: Date | null
          notes: string | null
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          condition: string
          diagnosedDate: Date
          doctor: string
          specialty: string
          severity: 'LEVE' | 'MODERADA' | 'GRAVE'
          status: 'ACTIVA' | 'CONTROLADA' | 'RESUELTA'
          lastReading?: string | null
          nextCheckup?: Date | null
          notes?: string | null
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          condition?: string
          diagnosedDate?: Date
          doctor?: string
          specialty?: string
          severity?: 'LEVE' | 'MODERADA' | 'GRAVE'
          status?: 'ACTIVA' | 'CONTROLADA' | 'RESUELTA'
          lastReading?: string | null
          nextCheckup?: Date | null
          notes?: string | null
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      treatments: {
        Row: {
          id: string
          medication: string
          dosage: string
          frequency: string
          startDate: Date
          endDate: Date | null
          adherence: number
          status: 'ACTIVO' | 'SUSPENDIDO' | 'COMPLETADO'
          sideEffects: string | null
          doctorNotes: string | null
          prescribedBy: string
          diagnosisId: string | null
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          medication: string
          dosage: string
          frequency: string
          startDate: Date
          endDate?: Date | null
          adherence?: number
          status?: 'ACTIVO' | 'SUSPENDIDO' | 'COMPLETADO'
          sideEffects?: string | null
          doctorNotes?: string | null
          prescribedBy: string
          diagnosisId?: string | null
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          medication?: string
          dosage?: string
          frequency?: string
          startDate?: Date
          endDate?: Date | null
          adherence?: number
          status?: 'ACTIVO' | 'SUSPENDIDO' | 'COMPLETADO'
          sideEffects?: string | null
          doctorNotes?: string | null
          prescribedBy?: string
          diagnosisId?: string | null
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      medical_events: {
        Row: {
          id: string
          type: 'CIRUGIA' | 'EMERGENCIA' | 'VACUNA' | 'CONSULTA' | 'HOSPITALIZACION' | 'PROCEDIMIENTO'
          title: string
          date: Date
          location: string
          doctor: string
          description: string
          outcome: string
          followUp: string | null
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          type: 'CIRUGIA' | 'EMERGENCIA' | 'VACUNA' | 'CONSULTA' | 'HOSPITALIZACION' | 'PROCEDIMIENTO'
          title: string
          date: Date
          location: string
          doctor: string
          description: string
          outcome: string
          followUp?: string | null
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          type?: 'CIRUGIA' | 'EMERGENCIA' | 'VACUNA' | 'CONSULTA' | 'HOSPITALIZACION' | 'PROCEDIMIENTO'
          title?: string
          date?: Date
          location?: string
          doctor?: string
          description?: string
          outcome?: string
          followUp?: string | null
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      medical_documents: {
        Row: {
          id: string
          type: 'ANALISIS' | 'RADIOGRAFIA' | 'INFORME' | 'RECETA' | 'CERTIFICADO' | 'NOTA'
          title: string
          date: Date
          doctor: string
          category: string
          description: string
          fileUrl: string | null
          results: string | null
          recommendations: string | null
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          type: 'ANALISIS' | 'RADIOGRAFIA' | 'INFORME' | 'RECETA' | 'CERTIFICADO' | 'NOTA'
          title: string
          date: Date
          doctor: string
          category: string
          description: string
          fileUrl?: string | null
          results?: string | null
          recommendations?: string | null
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          type?: 'ANALISIS' | 'RADIOGRAFIA' | 'INFORME' | 'RECETA' | 'CERTIFICADO' | 'NOTA'
          title?: string
          date?: Date
          doctor?: string
          category?: string
          description?: string
          fileUrl?: string | null
          results?: string | null
          recommendations?: string | null
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      appointments: {
        Row: {
          id: string
          title: string
          date: Date
          duration: number
          doctor: string
          specialty: string
          location: string
          notes: string | null
          status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          title: string
          date: Date
          duration: number
          doctor: string
          specialty: string
          location: string
          notes?: string | null
          status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          title?: string
          date?: Date
          duration?: number
          doctor?: string
          specialty?: string
          location?: string
          notes?: string | null
          status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      reminders: {
        Row: {
          id: string
          title: string
          description: string | null
          date: Date
          type: 'MEDICATION' | 'APPOINTMENT' | 'TEST' | 'EXERCISE' | 'DIET' | 'OTHER'
          isCompleted: boolean
          userId: string
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: Date
          type: 'MEDICATION' | 'APPOINTMENT' | 'TEST' | 'EXERCISE' | 'DIET' | 'OTHER'
          isCompleted?: boolean
          userId: string
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: Date
          type?: 'MEDICATION' | 'APPOINTMENT' | 'TEST' | 'EXERCISE' | 'DIET' | 'OTHER'
          isCompleted?: boolean
          userId?: string
          createdAt?: Date
          updatedAt?: Date
        }
      }
      medical_notes: {
        Row: {
          id: string
          title: string
          content: string
          category: string | null
          userId: string
          createdAt: Date
          updatedAt: Date
          isPinned: boolean
          isFavorite: boolean
          isArchived: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string | null
          userId: string
          createdAt?: Date
          updatedAt?: Date
          isPinned?: boolean
          isFavorite?: boolean
          isArchived?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string | null
          userId?: string
          createdAt?: Date
          updatedAt?: Date
          isPinned?: boolean
          isFavorite?: boolean
          isArchived?: boolean
        }
      }
      emergency_events: {
        Row: {
          id: string
          userId: string
          isActive: boolean
          startTime: Date | null
          duration: number
          location: string | null
          contactsNotified: string | null
          medicalInfoSnapshot: string | null
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          userId: string
          isActive: boolean
          startTime?: Date | null
          duration: number
          location?: string | null
          contactsNotified?: string | null
          medicalInfoSnapshot?: string | null
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          userId?: string
          isActive?: boolean
          startTime?: Date | null
          duration?: number
          location?: string | null
          contactsNotified?: string | null
          medicalInfoSnapshot?: string | null
          createdAt?: Date
          updatedAt?: Date
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          userId: string
          name: string
          relationship: string
          phone: string
          isPrimary: boolean
          isOnline: boolean
          lastSeen: Date | null
          createdAt: Date
          updatedAt: Date
        }
        Insert: {
          id?: string
          userId: string
          name: string
          relationship: string
          phone: string
          isPrimary?: boolean
          isOnline?: boolean
          lastSeen?: Date | null
          createdAt?: Date
          updatedAt?: Date
        }
        Update: {
          id?: string
          userId?: string
          name?: string
          relationship?: string
          phone?: string
          isPrimary?: boolean
          isOnline?: boolean
          lastSeen?: Date | null
          createdAt?: Date
          updatedAt?: Date
        }
      }
    }
  }
} 