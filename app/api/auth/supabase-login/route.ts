import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = LoginSchema.parse(body)

    // Verificar que supabaseAdmin esté disponible
    if (!supabaseAdmin) {
      console.error('Supabase admin no configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Autenticar con Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Obtener datos del usuario desde la tabla users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        session: data.session
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    
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