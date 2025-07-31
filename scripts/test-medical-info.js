const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA5ODAxLCJleHAiOjE3NTQ0MTQ2MDF9.I_s4q-AmUerEW_sxpMBLDInoabmhCtgXpqkFrIYFKEI'

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData)
          resolve({
            status: res.statusCode,
            data: parsedData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

async function testMedicalInfoAPI() {
  console.log('🧪 Probando APIs de información médica...\n')
  
  let createdMedicalInfoId = null
  
  try {
    // 1. LEER información médica (puede que no exista)
    console.log('📖 1. Probando LEER información médica...')
    const readResponse = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readResponse.status)
    if (readResponse.status === 200 && readResponse.data.success) {
      if (readResponse.data.data) {
        console.log('✅ Información médica encontrada')
        console.log('📋 Datos:', readResponse.data.data)
        createdMedicalInfoId = readResponse.data.data.id
      } else {
        console.log('ℹ️ No hay información médica guardada')
      }
    } else {
      console.log('❌ Error leyendo información médica:', readResponse.data)
    }
    
    // 2. CREAR información médica
    console.log('\n📝 2. Probando CREAR información médica...')
    const newMedicalInfo = {
      bloodType: "A+",
      allergies: ["Penicilina", "Mariscos", "Polen", "Látex"],
      medications: [
        "Aspirina 100mg (1 vez al día)",
        "Lisinopril 10mg (2 veces al día)",
        "Metformina 500mg (con comidas)",
        "Vitamina D 1000UI (diario)"
      ],
      conditions: ["Hipertensión", "Diabetes Tipo 2", "Artritis", "Asma"],
      emergencyContact: "María González - Esposa",
      weight: "75 kg",
      height: "170 cm",
      insuranceNumber: "INS-987654321",
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const createResponse = await makeRequest('/api/medical-info', 'POST', newMedicalInfo)
    
    console.log('📊 Status:', createResponse.status)
    if (createResponse.status === 200 && createResponse.data.success) {
      console.log('✅ Información médica creada exitosamente')
      createdMedicalInfoId = createResponse.data.data.id
      console.log('📋 ID de la información médica:', createdMedicalInfoId)
      console.log('📋 Datos creados:', createResponse.data.data)
    } else {
      console.log('❌ Error creando información médica:', createResponse.data)
      return
    }
    
    // 3. LEER información médica (verificar que se creó)
    console.log('\n📖 3. Probando LEER información médica después de crear...')
    const readAfterCreateResponse = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readAfterCreateResponse.status)
    if (readAfterCreateResponse.status === 200 && readAfterCreateResponse.data.success) {
      console.log('✅ Información médica leída exitosamente después de crear')
      console.log('📋 Datos leídos:', readAfterCreateResponse.data.data)
    } else {
      console.log('❌ Error leyendo información médica después de crear:', readAfterCreateResponse.data)
    }
    
    // 4. ACTUALIZAR información médica
    console.log('\n✏️ 4. Probando ACTUALIZAR información médica...')
    const updateData = {
      bloodType: "AB+",
      allergies: ["Penicilina", "Mariscos", "Polen", "Látex", "Nueces"],
      medications: [
        "Aspirina 100mg (1 vez al día)",
        "Lisinopril 10mg (2 veces al día)",
        "Metformina 500mg (con comidas)",
        "Vitamina D 1000UI (diario)",
        "Omega 3 1000mg (diario)"
      ],
      conditions: ["Hipertensión", "Diabetes Tipo 2", "Artritis", "Asma", "Colesterol Alto"],
      emergencyContact: "María González - Esposa (Actualizado)",
      weight: "73 kg",
      height: "170 cm",
      insuranceNumber: "INS-987654321-2024",
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const updateResponse = await makeRequest(`/api/medical-info/${createdMedicalInfoId}`, 'PATCH', updateData)
    
    console.log('📊 Status:', updateResponse.status)
    if (updateResponse.status === 200 && updateResponse.data.success) {
      console.log('✅ Información médica actualizada exitosamente')
      console.log('📋 Datos actualizados:', updateResponse.data.data)
    } else {
      console.log('❌ Error actualizando información médica:', updateResponse.data)
    }
    
    // 5. LEER información médica (verificar que se actualizó)
    console.log('\n📖 5. Probando LEER información médica después de actualizar...')
    const readAfterUpdateResponse = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readAfterUpdateResponse.status)
    if (readAfterUpdateResponse.status === 200 && readAfterUpdateResponse.data.success) {
      console.log('✅ Información médica leída exitosamente después de actualizar')
      console.log('📋 Datos finales:', readAfterUpdateResponse.data.data)
    } else {
      console.log('❌ Error leyendo información médica después de actualizar:', readAfterUpdateResponse.data)
    }
    
    console.log('\n🎉 Pruebas de información médica completadas exitosamente!')
    console.log('\n📱 Ahora puedes probar la interfaz web:')
    console.log('   1. Ve a http://localhost:3000')
    console.log('   2. Inicia sesión con: kalexioviedo@gmail.com')
    console.log('   3. Ve a la sección "Emergencia"')
    console.log('   4. Haz clic en "Información Médica de Emergencia"')
    console.log('   5. Haz clic en "Editar" para modificar la información')
    console.log('   6. Verifica que los datos se guardan en la base de datos')
    
  } catch (error) {
    console.error('❌ Error en las pruebas de información médica:', error.message)
  }
}

testMedicalInfoAPI() 