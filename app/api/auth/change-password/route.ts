import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { verifyToken, verifyPassword, hashPassword } from '@/lib/auth'
import { z } from 'zod'

// Schema de validación para cambiar contraseña
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
})

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Iniciando cambio de contraseña...')
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      console.error('❌ Token no proporcionado')
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      console.error('❌ Token inválido')
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    console.log('✅ Token válido para usuario:', decoded.userId)

    const body = await request.json()
    console.log('📝 Datos recibidos:', { currentPassword: '***', newPassword: '***' })
    
    // Validar datos
    const validatedData = ChangePasswordSchema.parse(body)
    console.log('✅ Datos validados')
    
    // Obtener usuario actual
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, password: true }
    })

    if (!user) {
      console.error('❌ Usuario no encontrado')
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await verifyPassword(validatedData.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      console.error('❌ Contraseña actual incorrecta')
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }

    console.log('✅ Contraseña actual verificada')

    // Hashear nueva contraseña
    const hashedNewPassword = await hashPassword(validatedData.newPassword)
    console.log('✅ Nueva contraseña hasheada')

    // Actualizar contraseña en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword },
      select: { id: true, email: true, name: true }
    })

    console.log('✅ Contraseña actualizada exitosamente')

    return NextResponse.json({ 
      success: true,
      message: 'Contraseña cambiada exitosamente',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    })
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error)
    
    if (error instanceof z.ZodError) {
      console.error('❌ Error de validación:', error.errors)
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 