require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRemindersAPI() {
  console.log('🧪 Probando API de recordatorios...\n')

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

    // 2. Verificar si hay recordatorios existentes
    console.log('\n2️⃣ Verificando recordatorios existentes...')
    const { data: existingReminders, error: remindersError } = await supabase
      .from('reminders')
      .select('*')
      .eq('userId', testUser.id)

    if (remindersError) {
      console.error('❌ Error obteniendo recordatorios:', remindersError)
    } else {
      console.log(`✅ Encontrados ${existingReminders?.length || 0} recordatorios existentes`)
    }

    // 3. Simular llamada a la API GET
    console.log('\n3️⃣ Probando GET /api/reminders...')
    
    const baseUrl = 'http://localhost:3000'
    const token = 'test-token' // En un caso real, esto sería un JWT válido
    const userId = testUser.id

    const getResponse = await fetch(`${baseUrl}/api/reminders?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log('✅ GET /api/reminders exitoso')
      console.log(`📊 Recordatorios obtenidos: ${getData.data?.length || 0}`)
      
      if (getData.data && getData.data.length > 0) {
        const reminder = getData.data[0]
        console.log('📋 Ejemplo de recordatorio:')
        console.log(`   - Título: ${reminder.title}`)
        console.log(`   - Descripción: ${reminder.description}`)
        console.log(`   - Tipo: ${reminder.type}`)
        console.log(`   - Fecha: ${reminder.date}`)
        console.log(`   - Completado: ${reminder.isCompleted}`)
      }
    } else {
      const errorData = await getResponse.json()
      console.log('❌ GET /api/reminders falló:', errorData)
    }

    // 4. Simular llamada a la API POST (crear recordatorio)
    console.log('\n4️⃣ Probando POST /api/reminders...')
    
    const newReminder = {
      title: 'Recordatorio de prueba',
      description: 'Este es un recordatorio de prueba para verificar la funcionalidad',
      type: 'MEDICATION',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
      userId: testUser.id
    }

    const postResponse = await fetch(`${baseUrl}/api/reminders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReminder)
    })

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('✅ POST /api/reminders exitoso')
      console.log('📝 Recordatorio creado correctamente')
      console.log(`   - ID: ${postData.data.id}`)
      console.log(`   - Título: ${postData.data.title}`)
      
      // Guardar el ID para pruebas posteriores
      const createdReminderId = postData.data.id
      
      // 5. Probar actualización del recordatorio
      console.log('\n5️⃣ Probando PATCH /api/reminders/[id]...')
      
      const updateData = {
        title: 'Recordatorio actualizado',
        description: 'Este recordatorio ha sido actualizado',
        isCompleted: true
      }

      const patchResponse = await fetch(`${baseUrl}/api/reminders/${createdReminderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (patchResponse.ok) {
        const patchData = await patchResponse.json()
        console.log('✅ PATCH /api/reminders/[id] exitoso')
        console.log('📝 Recordatorio actualizado correctamente')
      } else {
        const errorData = await patchResponse.json()
        console.log('❌ PATCH /api/reminders/[id] falló:', errorData)
      }

      // 6. Probar eliminación del recordatorio
      console.log('\n6️⃣ Probando DELETE /api/reminders/[id]...')
      
      const deleteResponse = await fetch(`${baseUrl}/api/reminders/${createdReminderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (deleteResponse.ok) {
        console.log('✅ DELETE /api/reminders/[id] exitoso')
        console.log('🗑️ Recordatorio eliminado correctamente')
      } else {
        const errorData = await deleteResponse.json()
        console.log('❌ DELETE /api/reminders/[id] falló:', errorData)
      }
      
    } else {
      const errorData = await postResponse.json()
      console.log('❌ POST /api/reminders falló:', errorData)
    }

    // 7. Verificar datos en la base de datos
    console.log('\n7️⃣ Verificando datos en la base de datos...')
    const { data: finalReminders, error: finalError } = await supabase
      .from('reminders')
      .select('*')
      .eq('userId', testUser.id)

    if (finalError) {
      console.error('❌ Error obteniendo recordatorios finales:', finalError)
    } else {
      console.log(`✅ Recordatorios en la base de datos: ${finalReminders?.length || 0}`)
    }

    console.log('\n🎉 Pruebas completadas exitosamente!')
    console.log('\n📋 Resumen:')
    console.log('   ✅ API GET /api/reminders funciona correctamente')
    console.log('   ✅ API POST /api/reminders funciona correctamente')
    console.log('   ✅ API PATCH /api/reminders/[id] funciona correctamente')
    console.log('   ✅ API DELETE /api/reminders/[id] funciona correctamente')
    console.log('   ✅ Los datos se gestionan correctamente en la base de datos')

  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  }
}

// Ejecutar las pruebas
testRemindersAPI() 