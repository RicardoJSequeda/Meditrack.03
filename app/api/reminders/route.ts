import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const reminderSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  date: z.string().datetime('Fecha inválida'),
  type: z.enum(['MEDICATION', 'APPOINTMENT', 'TEST', 'EXERCISE', 'DIET', 'OTHER']),
  isCompleted: z.boolean().default(false),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando recordatorio...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const reminderData = reminderSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(reminderData, null, 2))

    // Convert date
    const processedData = {
      ...reminderData,
      date: new Date(reminderData.date)
    }

    console.log('🚀 Insertando recordatorio en Supabase...')
    
    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando recordatorio:', error)
      return NextResponse.json(
        { success: false, error: `Error creating reminder: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Recordatorio creado exitosamente:', reminder)

    return NextResponse.json({
      success: true,
      data: reminder
    })
  } catch (error) {
    console.error('❌ Error en POST /reminders:', error)
    
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

    console.log('🔍 Obteniendo recordatorios para usuario:', userId)

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: true })

    if (error) {
      console.error('❌ Error obteniendo recordatorios:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching reminders: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Recordatorios obtenidos:', reminders.length)

    return NextResponse.json({
      success: true,
      data: reminders
    })
  } catch (error) {
    console.error('❌ Error en GET /reminders:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 