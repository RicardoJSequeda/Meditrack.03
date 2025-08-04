import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const recommendationSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  action: z.string().min(1, 'La acción es requerida'),
  priority: z.enum(['high', 'medium', 'low']),
  type: z.string().min(1, 'El tipo es requerido'),
  category: z.string().optional(),
  details: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  isCompleted: z.boolean().default(false),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando recomendación...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const recommendationData = recommendationSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(recommendationData, null, 2))

    // Preparar datos para Supabase
    const processedData = {
      ...recommendationData,
      details: recommendationData.details ? JSON.stringify(recommendationData.details) : undefined
    }

    console.log('🚀 Insertando recomendación en Supabase...')
    
    const { data: recommendation, error } = await supabase
      .from('recommendations')
      .insert({
        id: crypto.randomUUID(),
        ...processedData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando recomendación:', error)
      return NextResponse.json(
        { success: false, error: `Error creating recommendation: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Recomendación creada exitosamente:', recommendation)

    return NextResponse.json({
      success: true,
      data: {
        ...recommendation,
        details: recommendation.details ? JSON.parse(recommendation.details) : []
      }
    })
  } catch (error) {
    console.error('❌ Error en POST /recommendations:', error)
    
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

    console.log('🔍 Obteniendo recomendaciones para usuario:', userId)

    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo recomendaciones:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching recommendations: ${error.message}` },
        { status: 400 }
      )
    }

    // Parsear los detalles JSON
    const processedRecommendations = recommendations?.map(rec => ({
      ...rec,
      details: rec.details ? JSON.parse(rec.details) : []
    })) || []

    console.log('✅ Recomendaciones obtenidas exitosamente:', processedRecommendations.length)

    return NextResponse.json({
      success: true,
      data: processedRecommendations
    })
  } catch (error) {
    console.error('❌ Error en GET /recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 