import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    console.log('🔍 Obteniendo información del paciente para usuario:', userId)

    // Obtener información del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('❌ Error obteniendo datos del usuario:', userError)
      return NextResponse.json(
        { success: false, error: 'Error obteniendo información del paciente' },
        { status: 500 }
      )
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    // Calcular edad basada en dateOfBirth
    let age = 0
    if (userData.dateOfBirth) {
      const birthDate = new Date(userData.dateOfBirth)
      const today = new Date()
      age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
    }

    // Generar ID médico si no existe
    const medicalId = userData.medicalId || `MED-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Preparar datos del paciente
    const patientInfo = {
      name: userData.name || 'Sin nombre',
      age: age,
      gender: userData.gender || 'No especificado',
      bloodType: userData.bloodType || 'No especificado',
      medicalId: medicalId,
      phone: userData.phone || 'No especificado',
      email: userData.email || 'No especificado',
      address: userData.address || 'No especificado',
      emergencyContact: userData.emergencyContact || 'No especificado',
      dateOfBirth: userData.dateOfBirth,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }

    console.log('✅ Información del paciente obtenida exitosamente:', patientInfo)

    return NextResponse.json({
      success: true,
      data: patientInfo
    })
  } catch (error) {
    console.error('❌ Error en GET /patient-info:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, phone, address, bloodType, emergencyContact, dateOfBirth, gender } = body

    console.log('🔧 Actualizando información del paciente para usuario:', userId)

    // Actualizar información del usuario
    const { data, error } = await supabase
      .from('users')
      .update({
        name: name || null,
        phone: phone || null,
        address: address || null,
        bloodType: bloodType || null,
        emergencyContact: emergencyContact || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('❌ Error actualizando datos del usuario:', error)
      return NextResponse.json(
        { success: false, error: 'Error actualizando información del paciente' },
        { status: 500 }
      )
    }

    console.log('✅ Información del paciente actualizada exitosamente')

    return NextResponse.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('❌ Error en PUT /patient-info:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 