const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA3NDE4LCJleHAiOjE3NTQ0MTIyMTh9.6-1UeY7pbvCGoXxbg1PFH1IbQZb5khng90nHMnW5QhE'

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

async function testAppointmentsAPI() {
  console.log('🧪 Probando API de citas...\n')
  
  try {
    // 1. Probar GET /api/appointments
    console.log('📡 Probando GET /api/appointments...')
    const getResponse = await makeRequest('/api/appointments?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', getResponse.status)
    console.log('📋 Datos recibidos:', JSON.stringify(getResponse.data, null, 2))
    
    if (getResponse.status === 200 && getResponse.data.success) {
      console.log('✅ API funciona correctamente')
      console.log(`📊 Total de citas: ${getResponse.data.data?.length || 0}`)
      
      if (getResponse.data.data && getResponse.data.data.length > 0) {
        console.log('\n📝 Primera cita:')
        console.log('   - ID:', getResponse.data.data[0].id)
        console.log('   - Título:', getResponse.data.data[0].title)
        console.log('   - Doctor:', getResponse.data.data[0].doctor)
        console.log('   - Fecha:', getResponse.data.data[0].date)
        console.log('   - Estado:', getResponse.data.data[0].status)
      }
    } else {
      console.log('❌ Error en la API:', getResponse.data)
    }
    
    // 2. Probar GET /api/auth/me para verificar autenticación
    console.log('\n📡 Probando GET /api/auth/me...')
    const meResponse = await makeRequest('/api/auth/me')
    
    console.log('📊 Status:', meResponse.status)
    console.log('📋 Datos de usuario:', JSON.stringify(meResponse.data, null, 2))
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

testAppointmentsAPI() 