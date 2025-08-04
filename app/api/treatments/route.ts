import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const treatmentSchema = z.object({
  medication: z.string().min(1, 'La medicación es requerida'),
  dosage: z.string().min(1, 'La dosis es requerida'),
  frequency: z.string().min(1, 'La frecuencia es requerida'),
  startDate: z.string().datetime('Fecha de inicio inválida'),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
  adherence: z.number().min(0).max(100).default(0),
  status: z.enum(['ACTIVO', 'SUSPENDIDO', 'COMPLETADO']),
  sideEffects: z.string().optional(),
  doctorNotes: z.string().optional(),
  prescribedBy: z.string().min(1, 'El prescriptor es requerido'),
  diagnosisId: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando tratamiento...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const treatmentData = treatmentSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(treatmentData, null, 2))

    // Convert dates
    const processedData = {
      ...treatmentData,
      startDate: new Date(treatmentData.startDate),
      endDate: treatmentData.endDate ? new Date(treatmentData.endDate) : undefined
    }

    console.log('🚀 Insertando tratamiento en Supabase...')
    
    const { data: treatment, error } = await supabase
      .from('treatments')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando tratamiento:', error)
      return NextResponse.json(
        { success: false, error: `Error creating treatment: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Tratamiento creado exitosamente:', treatment)

    return NextResponse.json({
      success: true,
      data: treatment
    })
  } catch (error) {
    console.error('❌ Error en POST /treatments:', error)
    
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

    console.log('🔍 Obteniendo tratamientos para usuario:', userId)

    const { data: treatments, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('userId', userId)
      .order('startDate', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo tratamientos:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching treatments: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Tratamientos obtenidos:', treatments.length)

    return NextResponse.json({
      success: true,
      data: treatments
    })
  } catch (error) {
    console.error('❌ Error en GET /treatments:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 