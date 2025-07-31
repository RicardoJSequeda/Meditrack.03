import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const medicalEventSchema = z.object({
  type: z.enum(['CIRUGIA', 'EMERGENCIA', 'VACUNA', 'CONSULTA', 'HOSPITALIZACION', 'PROCEDIMIENTO']),
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().datetime('Fecha inválida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  doctor: z.string().min(1, 'El doctor es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  outcome: z.string().min(1, 'El resultado es requerido'),
  followUp: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando evento médico...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const eventData = medicalEventSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(eventData, null, 2))

    // Convert dates
    const processedData = {
      ...eventData,
      date: new Date(eventData.date)
    }

    console.log('🚀 Insertando evento médico en Supabase...')
    
    const { data: event, error } = await supabase
      .from('medical_events')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando evento médico:', error)
      return NextResponse.json(
        { success: false, error: `Error creating medical event: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Evento médico creado exitosamente:', event)

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('❌ Error en POST /medical-events:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
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

    console.log('🔍 Obteniendo eventos médicos para usuario:', userId)

    const { data: events, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo eventos médicos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching medical events: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Eventos médicos obtenidos:', events.length)

    return NextResponse.json({
      success: true,
      data: events
    })
  } catch (error) {
    console.error('❌ Error en GET /medical-events:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 