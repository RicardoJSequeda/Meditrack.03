import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const reminderSettingsSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  notifications: z.object({
    push: z.boolean(),
    email: z.boolean(),
    sound: z.boolean(),
    vibration: z.boolean(),
    desktop: z.boolean()
  }),
  timing: z.object({
    defaultAdvanceTime: z.number().min(1).max(1440),
    snoozeOptions: z.array(z.number()),
    timezone: z.string(),
    workHours: z.object({
      start: z.string(),
      end: z.string()
    })
  }),
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    accentColor: z.string(),
    showCompleted: z.boolean(),
    showOverdue: z.boolean()
  }),
  privacy: z.object({
    shareWithFamily: z.boolean(),
    emergencyContacts: z.array(z.string()),
    dataRetention: z.number().min(1).max(3650)
  }),
  integrations: z.object({
    calendarSync: z.boolean(),
    healthApps: z.boolean(),
    backupEnabled: z.boolean()
  })
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Guardando configuración de recordatorios...')
    
    const body = await request.json()
    console.log('📝 Datos recibidos:', JSON.stringify(body, null, 2))
    
    const settingsData = reminderSettingsSchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(settingsData, null, 2))

    // Verificar si ya existe una configuración para este usuario
    const { data: existingSettings, error: checkError } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('userId', settingsData.userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error verificando configuración existente:', checkError)
      return NextResponse.json(
        { success: false, error: `Error checking existing settings: ${checkError.message}` },
        { status: 400 }
      )
    }

    let result
    if (existingSettings) {
      // Actualizar configuración existente
      console.log('🔄 Actualizando configuración existente...')
      const { data, error } = await supabase
        .from('reminder_settings')
        .update({
          settings: settingsData,
          updatedAt: new Date().toISOString()
        })
        .eq('userId', settingsData.userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error actualizando configuración:', error)
        return NextResponse.json(
          { success: false, error: `Error updating settings: ${error.message}` },
          { status: 400 }
        )
      }

      result = data
      console.log('✅ Configuración actualizada exitosamente')
    } else {
      // Crear nueva configuración
      console.log('🆕 Creando nueva configuración...')
      const { data, error } = await supabase
        .from('reminder_settings')
        .insert({
          id: crypto.randomUUID(),
          userId: settingsData.userId,
          settings: settingsData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creando configuración:', error)
        return NextResponse.json(
          { success: false, error: `Error creating settings: ${error.message}` },
          { status: 400 }
        )
      }

      result = data
      console.log('✅ Configuración creada exitosamente')
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('❌ Error en POST /reminder-settings:', error)
    
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

    console.log('🔍 Obteniendo configuración de recordatorios para usuario:', userId)

    const { data: settings, error } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('userId', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No hay configuración para este usuario, devolver configuración por defecto
        console.log('⚠️ No hay configuración para este usuario, devolviendo configuración por defecto')
        return NextResponse.json({
          success: true,
          data: {
            settings: {
              notifications: {
                push: true,
                email: false,
                sound: true,
                vibration: true,
                desktop: false
              },
              timing: {
                defaultAdvanceTime: 15,
                snoozeOptions: [5, 15, 30, 60, 120],
                timezone: 'America/Bogota',
                workHours: {
                  start: '08:00',
                  end: '18:00'
                }
              },
              appearance: {
                theme: 'auto',
                accentColor: '#8b5cf6',
                showCompleted: true,
                showOverdue: true
              },
              privacy: {
                shareWithFamily: false,
                emergencyContacts: [],
                dataRetention: 365
              },
              integrations: {
                calendarSync: false,
                healthApps: false,
                backupEnabled: true
              }
            }
          }
        })
      }

      console.error('❌ Error obteniendo configuración:', error)
      return NextResponse.json(
        { success: false, error: `Error fetching settings: ${error.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Configuración obtenida exitosamente')

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('❌ Error en GET /reminder-settings:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 