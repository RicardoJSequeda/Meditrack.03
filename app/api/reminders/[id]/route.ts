import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    console.log('🗑️ Eliminando recordatorio:', id)

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error eliminando recordatorio:', error)
      return NextResponse.json(
        { success: false, error: `Error deleting reminder: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Recordatorio eliminado exitosamente')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error en DELETE /reminders/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    console.log('🔧 Actualizando recordatorio:', id, body)

    const { data, error } = await supabase
      .from('reminders')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando recordatorio:', error)
      return NextResponse.json(
        { success: false, error: `Error updating reminder: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Recordatorio actualizado exitosamente')

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ Error en PATCH /reminders/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 