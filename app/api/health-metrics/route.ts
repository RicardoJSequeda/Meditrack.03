import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const healthMetricSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  value: z.number().min(0, 'El valor debe ser positivo'),
  unit: z.string().min(1, 'La unidad es requerida'),
  status: z.enum(['good', 'warning', 'critical']),
  trend: z.enum(['up', 'down', 'stable']),
  change: z.number(),
  category: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando métrica de salud...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const metricData = healthMetricSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(metricData, null, 2))

    console.log('🚀 Insertando métrica en Supabase...')
    
    const { data: metric, error } = await supabase
      .from('health_metrics')
      .insert({
        id: crypto.randomUUID(),
        ...metricData
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando métrica:', error)
      return NextResponse.json(
        { success: false, error: `Error creating health metric: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Métrica creada exitosamente:', metric)

    return NextResponse.json({
      success: true,
      data: metric
    })
  } catch (error) {
    console.error('❌ Error en POST /health-metrics:', error)
    
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

    console.log('🔍 Obteniendo métricas de salud para usuario:', userId)

    const { data: metrics, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo métricas:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching health metrics: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Métricas obtenidas exitosamente:', metrics?.length || 0)

    return NextResponse.json({
      success: true,
      data: metrics || []
    })
  } catch (error) {
    console.error('❌ Error en GET /health-metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 