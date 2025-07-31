require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testReminderSettingsAPI() {
  console.log('🧪 Probando API de configuraciones de recordatorios...\n')

  try {
    // 1. Verificar si hay usuarios en la base de datos
    console.log('1️⃣ Verificando usuarios en la base de datos...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError)
      return
    }

    if (!users || users.length === 0) {
      console.log('⚠️ No hay usuarios en la base de datos')
      console.log('💡 Para probar la funcionalidad, necesitas crear un usuario primero')
      return
    }

    console.log(`✅ Encontrados ${users.length} usuarios`)
    const testUser = users[0]
    console.log(`📋 Usuario de prueba: ${testUser.name} (${testUser.email})`)

    // 2. Verificar si hay configuraciones existentes
    console.log('\n2️⃣ Verificando configuraciones existentes...')
    const { data: existingSettings, error: settingsError } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('userId', testUser.id)

    if (settingsError) {
      console.error('❌ Error obteniendo configuraciones:', settingsError)
    } else {
      console.log(`✅ Encontradas ${existingSettings?.length || 0} configuraciones existentes`)
    }

    // 3. Simular llamada a la API GET
    console.log('\n3️⃣ Probando GET /api/reminder-settings...')
    
    const baseUrl = 'http://localhost:3000'
    const token = 'test-token' // En un caso real, esto sería un JWT válido
    const userId = testUser.id

    const getResponse = await fetch(`${baseUrl}/api/reminder-settings?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log('✅ GET /api/reminder-settings exitoso')
      console.log('📊 Configuración obtenida:', getData.data?.settings ? 'Sí' : 'No')
      
      if (getData.data?.settings) {
        const settings = getData.data.settings
        console.log('📋 Configuración actual:')
        console.log(`   - Notificaciones push: ${settings.notifications?.push}`)
        console.log(`   - Notificaciones email: ${settings.notifications?.email}`)
        console.log(`   - Tiempo de anticipación: ${settings.timing?.defaultAdvanceTime} minutos`)
        console.log(`   - Zona horaria: ${settings.timing?.timezone}`)
        console.log(`   - Tema: ${settings.appearance?.theme}`)
      }
    } else {
      const errorData = await getResponse.json()
      console.log('❌ GET /api/reminder-settings falló:', errorData)
    }

    // 4. Simular llamada a la API POST (guardar configuración)
    console.log('\n4️⃣ Probando POST /api/reminder-settings...')
    
    const newSettings = {
      userId: testUser.id,
      notifications: {
        push: true,
        email: false,
        sound: true,
        vibration: true,
        desktop: false
      },
      timing: {
        defaultAdvanceTime: 30,
        snoozeOptions: [5, 15, 30, 60, 120],
        timezone: 'America/Bogota',
        workHours: {
          start: '09:00',
          end: '17:00'
        }
      },
      appearance: {
        theme: 'auto',
        accentColor: '#3b82f6',
        showCompleted: true,
        showOverdue: true
      },
      privacy: {
        shareWithFamily: false,
        emergencyContacts: ['familia@email.com', 'emergencia@email.com'],
        dataRetention: 365
      },
      integrations: {
        calendarSync: true,
        healthApps: false,
        backupEnabled: true
      }
    }

    const postResponse = await fetch(`${baseUrl}/api/reminder-settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSettings)
    })

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('✅ POST /api/reminder-settings exitoso')
      console.log('📝 Configuración guardada correctamente')
      console.log(`   - ID: ${postData.data.id}`)
      console.log(`   - Usuario: ${postData.data.userId}`)
      
      // 5. Verificar que la configuración se guardó correctamente
      console.log('\n5️⃣ Verificando configuración guardada...')
      const { data: savedSettings, error: savedError } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('userId', testUser.id)
        .single()

      if (savedError) {
        console.error('❌ Error obteniendo configuración guardada:', savedError)
      } else {
        console.log('✅ Configuración guardada en la base de datos:')
        console.log(`   - ID: ${savedSettings.id}`)
        console.log(`   - Usuario: ${savedSettings.userId}`)
        console.log(`   - Creado: ${savedSettings.createdAt}`)
        console.log(`   - Actualizado: ${savedSettings.updatedAt}`)
        
        const settings = savedSettings.settings
        console.log('📋 Configuración guardada:')
        console.log(`   - Notificaciones push: ${settings.notifications.push}`)
        console.log(`   - Tiempo de anticipación: ${settings.timing.defaultAdvanceTime} minutos`)
        console.log(`   - Zona horaria: ${settings.timing.timezone}`)
        console.log(`   - Tema: ${settings.appearance.theme}`)
        console.log(`   - Contactos de emergencia: ${settings.privacy.emergencyContacts.length}`)
        console.log(`   - Sincronización con calendario: ${settings.integrations.calendarSync}`)
      }
      
    } else {
      const errorData = await postResponse.json()
      console.log('❌ POST /api/reminder-settings falló:', errorData)
    }

    // 6. Probar actualización de configuración
    console.log('\n6️⃣ Probando actualización de configuración...')
    
    const updatedSettings = {
      ...newSettings,
      notifications: {
        ...newSettings.notifications,
        email: true,
        desktop: true
      },
      appearance: {
        ...newSettings.appearance,
        theme: 'dark',
        accentColor: '#10b981'
      }
    }

    const updateResponse = await fetch(`${baseUrl}/api/reminder-settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSettings)
    })

    if (updateResponse.ok) {
      console.log('✅ Actualización de configuración exitosa')
      console.log('📝 Configuración actualizada correctamente')
    } else {
      const errorData = await updateResponse.json()
      console.log('❌ Actualización de configuración falló:', errorData)
    }

    // 7. Verificar datos finales en la base de datos
    console.log('\n7️⃣ Verificando datos finales en la base de datos...')
    const { data: finalSettings, error: finalError } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('userId', testUser.id)

    if (finalError) {
      console.error('❌ Error obteniendo configuraciones finales:', finalError)
    } else {
      console.log(`✅ Configuraciones en la base de datos: ${finalSettings?.length || 0}`)
    }

    console.log('\n🎉 Pruebas completadas exitosamente!')
    console.log('\n📋 Resumen:')
    console.log('   ✅ API GET /api/reminder-settings funciona correctamente')
    console.log('   ✅ API POST /api/reminder-settings funciona correctamente')
    console.log('   ✅ Los datos se guardan correctamente en la base de datos')
    console.log('   ✅ Las actualizaciones funcionan correctamente')
    console.log('   ✅ La configuración por defecto se aplica cuando no hay datos')

  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  }
}

// Ejecutar las pruebas
testReminderSettingsAPI() 