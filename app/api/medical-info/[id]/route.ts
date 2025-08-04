import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateMedicalInfoSchema = z.object({
  bloodType: z.string().min(1, 'El tipo de sangre es requerido').optional(),
  allergies: z.array(z.string()).default([]).optional(),
  medications: z.array(z.string()).default([]).optional(),
  conditions: z.array(z.string()).default([]).optional(),
  emergencyContact: z.string().min(1, 'El contacto de emergencia es requerido').optional(),
  weight: z.string().min(1, 'El peso es requerido').optional(),
  height: z.string().min(1, 'La altura es requerida').optional(),
  insuranceNumber: z.string().min(1, 'El número de seguro es requerido').optional(),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🔍 Actualizando información médica:', id)
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const updateData = updateMedicalInfoSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(updateData, null, 2))

    // Procesar arrays para guardar como JSON
    const processedData = {
      ...updateData,
      allergies: updateData.allergies ? JSON.stringify(updateData.allergies) : undefined,
      medications: updateData.medications ? JSON.stringify(updateData.medications) : undefined,
      conditions: updateData.conditions ? JSON.stringify(updateData.conditions) : undefined,
      updatedAt: new Date()
    }

    console.log('🚀 Actualizando información médica en Supabase...')
    
    const { data: medicalInfo, error } = await supabase
      .from('medical_info')
      .update(processedData)
      .eq('id', id)
      .eq('userId', updateData.userId)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error actualizando información médica:', error)
      return NextResponse.json(
        { success: false, error: `Error updating medical info: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Información médica actualizada exitosamente:', medicalInfo)

    return NextResponse.json({
      success: true,
      data: {
        ...medicalInfo,
        allergies: JSON.parse(medicalInfo.allergies),
        medications: JSON.parse(medicalInfo.medications),
        conditions: JSON.parse(medicalInfo.conditions)
      }
    })
  } catch (error) {
    console.error('❌ Error en PATCH /medical-info/[id]:', error)
    
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