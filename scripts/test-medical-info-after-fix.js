const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODEwNTI3LCJleHAiOjE3NTQ0MTUzMjd9.3h5dpwR26Tnj3qDLbhMf3L-avKf1WNueA-K7'

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

async function testMedicalInfoAfterFix() {
  console.log('🧪 Probando tabla medical_info después de la corrección...\n')
  
  try {
    // 1. Probar GET (debería devolver 404 si no hay datos)
    console.log('📖 1. Probando LEER información médica...')
    const getResponse = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', getResponse.status)
    if (getResponse.status === 200) {
      console.log('✅ GET exitoso - Datos encontrados')
      console.log('📋 Datos:', JSON.stringify(getResponse.data, null, 2))
    } else if (getResponse.status === 404) {
      console.log('✅ GET exitoso - No hay datos (esperado)')
    } else {
      console.log('❌ Error en GET:', getResponse.data)
    }
    
    // 2. Probar POST (crear nueva información médica)
    console.log('\n📝 2. Probando CREAR información médica...')
    const testData = {
      bloodType: "A+",
      allergies: ["Penicilina", "Mariscos"],
      medications: ["Aspirina 100mg", "Vitamina D"],
      conditions: ["Hipertensión", "Diabetes"],
      emergencyContact: "María González - Esposa",
      weight: "70 kg",
      height: "170 cm",
      insuranceNumber: "INS-123456789",
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const createResponse = await makeRequest('/api/medical-info', 'POST', testData)
    
    console.log('📊 Status:', createResponse.status)
    if (createResponse.status === 200) {
      console.log('✅ POST exitoso - Información médica creada')
      console.log('📋 Datos creados:', JSON.stringify(createResponse.data, null, 2))
      
      // 3. Probar GET nuevamente para verificar que se guardó
      console.log('\n📖 3. Verificando que los datos se guardaron...')
      const getResponse2 = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
      
      console.log('📊 Status:', getResponse2.status)
      if (getResponse2.status === 200) {
        console.log('✅ Verificación exitosa - Datos encontrados en la base de datos')
        console.log('📋 Datos recuperados:', JSON.stringify(getResponse2.data, null, 2))
      } else {
        console.log('❌ Error en verificación:', getResponse2.data)
      }
      
    } else {
      console.log('❌ Error en POST:', createResponse.data)
      console.log('\n🔧 Posibles soluciones:')
      console.log('1. Verifica que ejecutaste el SQL de corrección')
      console.log('2. Verifica que las políticas RLS están configuradas correctamente')
      console.log('3. Verifica que los nombres de las columnas coinciden')
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
  }
  
  console.log('\n🎯 Próximos pasos:')
  console.log('1. Si las pruebas fueron exitosas, ve a la aplicación')
  console.log('2. Ve a la sección "Emergencia"')
  console.log('3. Haz clic en "Información Médica de Emergencia"')
  console.log('4. Haz clic en "Editar" y prueba el formulario')
}

testMedicalInfoAfterFix() 