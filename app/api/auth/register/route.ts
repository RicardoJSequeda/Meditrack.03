import { NextRequest, NextResponse } from 'next/server'
import { registerUser, AuthError } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando registro de usuario...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const userData = registerSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(userData, null, 2))

    // Convert dateOfBirth string to Date if provided
    const processedData = {
      ...userData,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined
    }
    console.log('🔄 Datos procesados:', JSON.stringify(processedData, null, 2))

    console.log('🚀 Llamando a registerUser...')
    const result = await registerUser(processedData)
    console.log('✅ Usuario registrado exitosamente:', JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('❌ Error en registro:', error)
    
    if (error instanceof AuthError) {
      console.error('❌ AuthError:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    if (error instanceof z.ZodError) {
      console.error('❌ ZodError:', error.errors)
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('❌ Error interno:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 