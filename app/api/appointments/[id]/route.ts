import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateAppointmentSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  date: z.string().datetime('Fecha inválida').optional(),
  duration: z.number().min(1, 'La duración debe ser al menos 1 minuto').optional(),
  doctor: z.string().min(1, 'El doctor es requerido').optional(),
  specialty: z.string().min(1, 'La especialidad es requerida').optional(),
  location: z.string().min(1, 'La ubicación es requerida').optional(),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 Actualizando cita:', id)
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const updateData = updateAppointmentSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(updateData, null, 2))

    // Convert date if provided
    const processedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined,
      updatedAt: new Date()
    }

    console.log('🚀 Actualizando cita en Supabase...')
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(processedData)
      .eq('id', id)
      .eq('userId', updateData.userId)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error actualizando cita:', error)
      return NextResponse.json(
        { success: false, error: `Error updating appointment: ${error.message}` },
        { status: 400 }
      )
    }

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    console.log('✅ Cita actualizada exitosamente:', appointment)

    return NextResponse.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('❌ Error en PATCH /appointments/[id]:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 Eliminando cita:', id)
    
    // Obtener userId del query parameter
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    console.log('🚀 Eliminando cita de Supabase...')
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('userId', userId)

    if (error) {
      console.error('❌ Error eliminando cita:', error)
      return NextResponse.json(
        { success: false, error: `Error deleting appointment: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Cita eliminada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error en DELETE /appointments/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 