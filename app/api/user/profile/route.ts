import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    console.log('🔍 API: User authenticated:', user.email)

    // Obtener datos del usuario desde la BD
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (dbError) {
      console.log('🔍 API: No user data in DB, using metadata')
      
      // Si no hay datos en BD, usar metadata de Supabase
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      "Usuario"
      
      // Obtener solo nombre y apellido (máximo 2 palabras)
      const nameParts = fullName.split(' ').slice(0, 2)
      const displayName = nameParts.join(' ')

      return NextResponse.json({
        id: user.id,
        name: displayName,
        email: user.email,
        avatar: user.user_metadata?.avatar_url || null,
        phone: null,
        address: null,
        dateOfBirth: null,
        gender: null,
        healthStatus: "Saludable"
      })
    }

    console.log('🔍 API: User data from DB:', userData)

    // Obtener datos de medical_info si existen
    const { data: medicalInfo, error: medicalError } = await supabase
      .from('medical_info')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (medicalError && medicalError.code !== 'PGRST116') {
      console.log('🔍 API: No medical info found')
    }

    // Combinar datos del usuario
    const combinedData = {
      id: userData.id,
      name: userData.name || userData.email?.split('@')[0] || 'Usuario',
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      avatar: userData.avatar || medicalInfo?.avatar,
      healthStatus: medicalInfo?.health_status || 'Saludable'
    }

    return NextResponse.json(combinedData)

  } catch (error) {
    console.error('🔍 API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
} 