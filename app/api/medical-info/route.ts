import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const medicalInfoSchema = z.object({
  bloodType: z.string().min(1, 'El tipo de sangre es requerido'),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  emergencyContact: z.string().min(1, 'El contacto de emergencia es requerido'),
  weight: z.string().min(1, 'El peso es requerido'),
  height: z.string().min(1, 'La altura es requerida'),
  insuranceNumber: z.string().min(1, 'El número de seguro es requerido'),
  userId: z.string().min(1, 'ID de usuario requerido')
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creando información médica...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const medicalData = medicalInfoSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(medicalData, null, 2))

    console.log('🚀 Insertando información médica en Supabase...')
    
    const { data: medicalInfo, error } = await supabase
      .from('medical_info')
      .insert({
        id: crypto.randomUUID(),
        userId: medicalData.userId,
        bloodType: medicalData.bloodType,
        allergies: JSON.stringify(medicalData.allergies),
        medications: JSON.stringify(medicalData.medications),
        conditions: JSON.stringify(medicalData.conditions),
        emergencyContact: medicalData.emergencyContact,
        weight: medicalData.weight,
        height: medicalData.height,
        insuranceNumber: medicalData.insuranceNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Error creando información médica:', error)
      return NextResponse.json(
        { success: false, error: `Error creating medical info: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Información médica creada exitosamente:', medicalInfo)

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
    console.error('❌ Error en POST /medical-info:', error)
    
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

    console.log('🔍 Obteniendo información médica para usuario:', userId)
    
    const { data: medicalInfo, error } = await supabase
      .from('medical_info')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró información médica
        console.log('ℹ️ No se encontró información médica para el usuario')
        return NextResponse.json({
          success: true,
          data: null
        })
      }
      
      console.error('❌ Error obteniendo información médica:', error)
      return NextResponse.json(
        { success: false, error: `Error getting medical info: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Información médica obtenida exitosamente')

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
    console.error('❌ Error en GET /medical-info:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 