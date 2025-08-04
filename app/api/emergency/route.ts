import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const emergencyEventSchema = z.object({
  isActive: z.boolean(),
  startTime: z.string().datetime('Fecha de inicio inválida').optional(),
  duration: z.number().min(1, 'La duración debe ser al menos 1 segundo'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }).optional(),
  contactsNotified: z.array(z.string()).optional(),
  medicalInfoSnapshot: z.object({
    bloodType: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    conditions: z.array(z.string()).optional()
  }).optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando evento de emergencia...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const eventData = emergencyEventSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(eventData, null, 2))

    // Convert dates and prepare data for Supabase
    const processedData = {
      ...eventData,
      startTime: eventData.startTime ? new Date(eventData.startTime) : undefined,
      location: eventData.location ? JSON.stringify(eventData.location) : undefined,
      contactsNotified: eventData.contactsNotified ? JSON.stringify(eventData.contactsNotified) : undefined,
      medicalInfoSnapshot: eventData.medicalInfoSnapshot ? JSON.stringify(eventData.medicalInfoSnapshot) : undefined
    }

    console.log('🚀 Insertando evento en Supabase...')
    
    const { data: event, error } = await supabase
      .from('emergency_events')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando evento:', error)
      return NextResponse.json(
        { success: false, error: `Error creating emergency event: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Evento creado exitosamente:', event)

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('❌ Error en POST /emergency:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    console.log('🔍 Obteniendo eventos de emergencia para usuario:', userId)

    const { data: events, error } = await supabase
      .from('emergency_events')
      .select('*')
      .eq('userId', userId)
      .order('startTime', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo eventos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching emergency events: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Eventos obtenidos:', events.length)

    return NextResponse.json({
      success: true,
      data: events
    })
  } catch (error) {
    console.error('❌ Error en GET /emergency:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 