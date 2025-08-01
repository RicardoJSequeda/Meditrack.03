import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const diagnosisSchema = z.object({
  condition: z.string().min(1, 'La condición es requerida'),
  diagnosedDate: z.string().datetime('Fecha de diagnóstico inválida'),
  doctor: z.string().min(1, 'El doctor es requerido'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  severity: z.enum(['LEVE', 'MODERADA', 'GRAVE']),
  status: z.enum(['ACTIVA', 'CONTROLADA', 'RESUELTA']),
  lastReading: z.string().optional(),
  nextCheckup: z.string().datetime('Fecha de próximo chequeo inválida').optional(),
  notes: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando diagnóstico...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const diagnosisData = diagnosisSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(diagnosisData, null, 2))

    // Convert dates
    const processedData = {
      ...diagnosisData,
      diagnosedDate: new Date(diagnosisData.diagnosedDate),
      nextCheckup: diagnosisData.nextCheckup ? new Date(diagnosisData.nextCheckup) : undefined
    }

    console.log('🚀 Insertando diagnóstico en Supabase...')
    
    const { data: diagnosis, error } = await supabase
      .from('diagnoses')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando diagnóstico:', error)
      return NextResponse.json(
        { success: false, error: `Error creating diagnosis: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Diagnóstico creado exitosamente:', diagnosis)

    return NextResponse.json({
      success: true,
      data: diagnosis
    })
  } catch (error) {
    console.error('❌ Error en POST /diagnoses:', error)
    
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

    console.log('🔍 Obteniendo diagnósticos para usuario:', userId)

    const { data: diagnoses, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('userId', userId)
      .order('diagnosedDate', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo diagnósticos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching diagnoses: ${error.message}` },
        { status: 400 }
      )
    }
    
    console.log('✅ Diagnósticos obtenidos:', diagnoses.length)

    return NextResponse.json({
      success: true,
      data: diagnoses
    })
  } catch (error) {
    console.error('❌ Error en GET /diagnoses:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 