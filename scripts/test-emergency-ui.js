const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA4NjIwLCJleHAiOjE3NTQ0MTM0MjB9.GexnrCuiLHMwt1HU9OD3fMYhAHkPyM1p-J-O_bOVstw'

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

async function testEmergencyUI() {
  console.log('🧪 Probando funcionalidad completa de emergencia...\n')
  
  try {
    // 1. Probar GET /api/emergency-contacts
    console.log('📡 Probando GET /api/emergency-contacts...')
    const contactsResponse = await makeRequest('/api/emergency-contacts?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', contactsResponse.status)
    if (contactsResponse.status === 200 && contactsResponse.data.success) {
      console.log('✅ API de contactos funciona correctamente')
      console.log(`📊 Total de contactos: ${contactsResponse.data.data?.length || 0}`)
    } else {
      console.log('❌ Error en API de contactos:', contactsResponse.data)
    }
    
    // 2. Probar GET /api/emergency
    console.log('\n📡 Probando GET /api/emergency...')
    const eventsResponse = await makeRequest('/api/emergency?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', eventsResponse.status)
    if (eventsResponse.status === 200 && eventsResponse.data.success) {
      console.log('✅ API de eventos funciona correctamente')
      console.log(`📊 Total de eventos: ${eventsResponse.data.data?.length || 0}`)
    } else {
      console.log('❌ Error en API de eventos:', eventsResponse.data)
    }
    
    // 3. Probar POST /api/emergency-contacts (crear contacto)
    console.log('\n📡 Probando POST /api/emergency-contacts...')
    const newContact = {
      name: "Dr. Ana Martínez",
      relationship: "Cardióloga",
      phone: "+573201234567",
      isPrimary: false,
      isOnline: true,
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const createContactResponse = await makeRequest('/api/emergency-contacts', 'POST', newContact)
    
    console.log('📊 Status:', createContactResponse.status)
    if (createContactResponse.status === 200 && createContactResponse.data.success) {
      console.log('✅ Contacto creado exitosamente')
    } else {
      console.log('❌ Error creando contacto:', createContactResponse.data)
    }
    
    // 4. Probar POST /api/emergency (crear evento)
    console.log('\n📡 Probando POST /api/emergency...')
    const newEvent = {
      isActive: true,
      startTime: new Date().toISOString(),
      duration: 300,
      location: {
        lat: 4.710989,
        lng: -74.072092,
        address: "Bogotá, Colombia - Prueba UI"
      },
      contactsNotified: ["c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"],
      medicalInfoSnapshot: {
        bloodType: "O+",
        allergies: ["Penicilina"],
        medications: ["Aspirina"],
        conditions: ["Hipertensión"]
      },
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const createEventResponse = await makeRequest('/api/emergency', 'POST', newEvent)
    
    console.log('📊 Status:', createEventResponse.status)
    if (createEventResponse.status === 200 && createEventResponse.data.success) {
      console.log('✅ Evento creado exitosamente')
    } else {
      console.log('❌ Error creando evento:', createEventResponse.data)
    }
    
    console.log('\n🎉 Pruebas de emergencia completadas!')
    console.log('\n📱 Ahora puedes probar la interfaz web:')
    console.log('   1. Ve a http://localhost:3000')
    console.log('   2. Inicia sesión con: kalexioviedo@gmail.com')
    console.log('   3. Ve a la sección "Emergencia"')
    console.log('   4. Prueba crear contactos y eventos de emergencia')
    console.log('   5. Verifica que los datos se cargan desde la base de datos')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

testEmergencyUI() 