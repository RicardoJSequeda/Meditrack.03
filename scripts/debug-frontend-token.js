require('dotenv').config({ path: '.env.local' })

const http = require('http')

// Simular el token que estaría en localStorage del frontend
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODEwNTI3LCJleHAiOjE3NTQ0MTUzMjd9.3h5dpwR26Tnj3qDLbhMf3L-avKf1WNueA-K7'

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    // Decodificar el token para obtener el userId
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
    // Agregar userId como parámetro de consulta
    const url = new URL(path, 'http://localhost:3000')
    url.searchParams.set('userId', userId)
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url.pathname + url.search,
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
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: parsedData,
            rawData: responseData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            success: false,
            error: 'Respuesta no válida',
            rawData: responseData
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

async function debugFrontendToken() {
  console.log('🔍 Debuggeando token del frontend...\n')
  
  // Decodificar el token
  const payload = decodeJWT(testToken)
  console.log('📋 Token decodificado:')
  console.log(JSON.stringify(payload, null, 2))
  
  console.log('\n🔍 Probando APIs con el mismo token que usa el frontend...')
  
  const tests = [
    {
      name: 'Diagnósticos',
      path: '/api/diagnoses'
    },
    {
      name: 'Tratamientos', 
      path: '/api/treatments'
    },
    {
      name: 'Eventos Médicos',
      path: '/api/medical-events'
    },
    {
      name: 'Documentos Médicos',
      path: '/api/medical-documents'
    }
  ]
  
  for (const test of tests) {
    try {
      console.log(`\n🔍 Probando: ${test.name}`)
      const result = await makeRequest(test.path)
      
      console.log(`   📊 Status: ${result.status}`)
      console.log(`   📊 Success: ${result.success}`)
      
      if (result.success && result.data.success) {
        const data = result.data.data
        console.log(`   ✅ ${test.name}: OK`)
        console.log(`      📊 ${Array.isArray(data) ? data.length + ' elementos' : '1 elemento'}`)
        
        if (Array.isArray(data) && data.length > 0) {
          const sample = data[0]
          console.log(`      📝 Primer elemento: ${JSON.stringify(sample, null, 2).substring(0, 300)}...`)
        }
      } else {
        console.log(`   ❌ ${test.name}: Error`)
        console.log(`      📝 Respuesta: ${JSON.stringify(result.data, null, 2)}`)
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: Error de conexión - ${error.message}`)
    }
  }
  
  console.log('\n📋 Análisis del problema:')
  console.log('1. Si las APIs funcionan pero el frontend no muestra datos:')
  console.log('   - Verifica que el token esté en localStorage')
  console.log('   - Verifica que los hooks estén usando el token correcto')
  console.log('   - Verifica que no haya errores de CORS')
  console.log('   - Verifica la consola del navegador para errores')
  
  console.log('\n2. Para verificar en el navegador:')
  console.log('   - Abre las herramientas de desarrollador (F12)')
  console.log('   - Ve a la pestaña Console')
  console.log('   - Ve a la pestaña Network')
  console.log('   - Recarga la página y verifica las llamadas a las APIs')
  console.log('   - Verifica que localStorage.getItem("token") devuelva el token')
}

debugFrontendToken() 