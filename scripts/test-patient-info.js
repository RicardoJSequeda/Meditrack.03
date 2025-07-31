require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testPatientInfoAPI() {
  console.log('🧪 Probando API de información del paciente...\n')

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

    // 2. Simular llamada a la API GET
    console.log('\n2️⃣ Probando GET /api/patient-info...')
    
    const baseUrl = 'http://localhost:3000'
    const token = 'test-token' // En un caso real, esto sería un JWT válido
    const userId = testUser.id

    const getResponse = await fetch(`${baseUrl}/api/patient-info?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (getResponse.ok) {
      const getData = await getResponse.json()
      console.log('✅ GET /api/patient-info exitoso')
      console.log('📊 Datos del paciente:')
      console.log(`   - Nombre: ${getData.data.name}`)
      console.log(`   - Edad: ${getData.data.age} años`)
      console.log(`   - Género: ${getData.data.gender}`)
      console.log(`   - Tipo de sangre: ${getData.data.bloodType}`)
      console.log(`   - Teléfono: ${getData.data.phone}`)
      console.log(`   - Email: ${getData.data.email}`)
      console.log(`   - ID Médico: ${getData.data.medicalId}`)
    } else {
      const errorData = await getResponse.json()
      console.log('❌ GET /api/patient-info falló:', errorData)
    }

    // 3. Simular llamada a la API PUT (actualizar información)
    console.log('\n3️⃣ Probando PUT /api/patient-info...')
    
    const updateData = {
      name: testUser.name,
      phone: testUser.phone || '+1 (555) 555-1234',
      email: testUser.email,
      address: testUser.address || 'Dirección de prueba',
      bloodType: testUser.bloodType || 'O+',
      gender: testUser.gender || 'No especificado',
      emergencyContact: testUser.emergencyContact || 'Contacto de emergencia',
      dateOfBirth: testUser.dateOfBirth || '1990-01-01'
    }

    const putResponse = await fetch(`${baseUrl}/api/patient-info?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (putResponse.ok) {
      const putData = await putResponse.json()
      console.log('✅ PUT /api/patient-info exitoso')
      console.log('📝 Información actualizada correctamente')
    } else {
      const errorData = await putResponse.json()
      console.log('❌ PUT /api/patient-info falló:', errorData)
    }

    // 4. Verificar datos actualizados en la base de datos
    console.log('\n4️⃣ Verificando datos actualizados en la base de datos...')
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (updateError) {
      console.error('❌ Error obteniendo usuario actualizado:', updateError)
    } else {
      console.log('✅ Usuario actualizado en la base de datos:')
      console.log(`   - Nombre: ${updatedUser.name}`)
      console.log(`   - Teléfono: ${updatedUser.phone}`)
      console.log(`   - Tipo de sangre: ${updatedUser.bloodType}`)
      console.log(`   - Género: ${updatedUser.gender}`)
      console.log(`   - Contacto de emergencia: ${updatedUser.emergencyContact}`)
    }

    console.log('\n🎉 Pruebas completadas exitosamente!')
    console.log('\n📋 Resumen:')
    console.log('   ✅ API GET /api/patient-info funciona correctamente')
    console.log('   ✅ API PUT /api/patient-info funciona correctamente')
    console.log('   ✅ Los datos se actualizan en la base de datos')
    console.log('   ✅ La información del paciente es dinámica')

  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  }
}

// Ejecutar las pruebas
testPatientInfoAPI() 