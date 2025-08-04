import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userData = RegisterSchema.parse(body)

    // Verificar que supabaseAdmin esté disponible
    if (!supabaseAdmin) {
      console.error('Supabase admin no configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          bloodType: userData.bloodType,
          emergencyContact: userData.emergencyContact,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Crear usuario en la tabla users
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        bloodType: userData.bloodType,
        emergencyContact: userData.emergencyContact,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        gender: userData.gender
      })
      .select()
      .single()

    if (userError) {
      // Si falla la creación en la tabla users, eliminar el usuario de auth
      if (authData.user) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      }
      
      return NextResponse.json(
        { error: 'Error al crear el usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        session: authData.session
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 