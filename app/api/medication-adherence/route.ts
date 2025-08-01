import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const medicationAdherenceSchema = z.object({
  medication: z.string().min(1, 'El medicamento es requerido'),
  prescribed: z.number().min(0, 'Las dosis prescritas deben ser positivas'),
  taken: z.number().min(0, 'Las dosis tomadas deben ser positivas'),
  adherence: z.number().min(0).max(100, 'La adherencia debe estar entre 0 y 100'),
  status: z.enum(['excellent', 'good', 'poor']),
  period: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando registro de adherencia...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const adherenceData = medicationAdherenceSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(adherenceData, null, 2))

    console.log('🚀 Insertando adherencia en Supabase...')
    
    const { data: adherence, error } = await supabase
      .from('medication_adherence')
      .insert({
        id: crypto.randomUUID(),
        ...adherenceData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando adherencia:', error)
      return NextResponse.json(
        { success: false, error: `Error creating medication adherence: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Adherencia creada exitosamente:', adherence)

    return NextResponse.json({
      success: true,
      data: adherence
    })
  } catch (error) {
    console.error('❌ Error en POST /medication-adherence:', error)
    
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

    console.log('🔍 Obteniendo adherencia a medicamentos para usuario:', userId)

    const { data: adherence, error } = await supabase
      .from('medication_adherence')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo adherencia:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching medication adherence: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Adherencia obtenida exitosamente:', adherence?.length || 0)

    return NextResponse.json({
      success: true,
      data: adherence || []
    })
  } catch (error) {
    console.error('❌ Error en GET /medication-adherence:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 