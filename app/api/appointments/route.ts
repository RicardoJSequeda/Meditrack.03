import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const appointmentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().datetime('Fecha inválida'),
  duration: z.number().min(1, 'La duración debe ser al menos 1 minuto'),
  doctor: z.string().min(1, 'El doctor es requerido'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).default('SCHEDULED'),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando cita...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const appointmentData = appointmentSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(appointmentData, null, 2))

    // Convert date
    const processedData = {
      ...appointmentData,
      date: new Date(appointmentData.date)
    }

    console.log('🚀 Insertando cita en Supabase...')
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando cita:', error)
      return NextResponse.json(
        { success: false, error: `Error creating appointment: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Cita creada exitosamente:', appointment)

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('❌ Error en POST /appointments:', error)
    
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

    console.log('🔍 Obteniendo citas para usuario:', userId)

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: true })

    if (error) {
      console.error('❌ Error obteniendo citas:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching appointments: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Citas obtenidas:', appointments.length)

    return NextResponse.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('❌ Error en GET /appointments:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 