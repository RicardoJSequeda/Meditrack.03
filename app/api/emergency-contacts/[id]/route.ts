import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateEmergencyContactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  relationship: z.string().min(1, 'La relación es requerida').optional(),
  phone: z.string().min(1, 'El teléfono es requerido').optional(),
  isPrimary: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  lastSeen: z.string().datetime('Fecha de última vista inválida').optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🔍 Actualizando contacto de emergencia:', id)
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const updateData = updateEmergencyContactSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(updateData, null, 2))

    // Convert date if provided
    const processedData = {
      ...updateData,
      lastSeen: updateData.lastSeen ? new Date(updateData.lastSeen) : undefined,
      updatedAt: new Date()
    }

    console.log('🚀 Actualizando contacto en Supabase...')
    
    const { data: contact, error } = await supabase
      .from('emergency_contacts')
      .update(processedData)
      .eq('id', id)
      .eq('userId', updateData.userId)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error actualizando contacto:', error)
      return NextResponse.json(
        { success: false, error: `Error updating emergency contact: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Contacto actualizado exitosamente:', contact)

    return NextResponse.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('❌ Error en PATCH /emergency-contacts/[id]:', error)
    
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
    
    console.log('🔍 Eliminando contacto de emergencia:', id)
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    console.log('🚀 Eliminando contacto de Supabase...')
    
    const { data: contact, error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id)
      .eq('userId', userId)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error eliminando contacto:', error)
      return NextResponse.json(
        { success: false, error: `Error deleting emergency contact: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Contacto eliminado exitosamente:', contact)

    return NextResponse.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('❌ Error en DELETE /emergency-contacts/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 