const http = require('http')

// Token válido
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODEwNTI3LCJleHAiOjE3NTQ0MTUzMjd9.3h5dpwR26Tnj3qDLbhMf3L-avKf1WNueA-K7'

// Decodificar el token para obtener userId
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

function testAPIEndpoint(path) {
  return new Promise((resolve, reject) => {
    // Decodificar el token para obtener userId
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
    // Agregar userId como parámetro de consulta
    const url = new URL(path, 'http://localhost:3000')
    url.searchParams.set('userId', userId)
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url.pathname + url.search,
      method: 'GET',
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
        console.log(`\n📊 ${path}:`)
        console.log(`   Status: ${res.statusCode}`)
        console.log(`   Content-Type: ${res.headers['content-type']}`)
        console.log(`   URL completa: ${options.path}`)
        console.log(`   Response length: ${responseData.length} characters`)
        
        // Mostrar los primeros 500 caracteres de la respuesta
        const preview = responseData.substring(0, 500)
        console.log(`   Preview: ${preview}`)
        
        if (responseData.startsWith('<!DOCTYPE') || responseData.startsWith('<html')) {
          console.log(`   ❌ ERROR: Respuesta HTML en lugar de JSON`)
        } else {
          try {
            const jsonData = JSON.parse(responseData)
            console.log(`   ✅ Respuesta JSON válida`)
            if (jsonData.data) {
              console.log(`   📊 Datos: ${Array.isArray(jsonData.data) ? jsonData.data.length + ' elementos' : '1 elemento'}`)
            }
          } catch (error) {
            console.log(`   ❌ Error parseando JSON: ${error.message}`)
          }
        }
        
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          data: responseData
        })
      })
    })

    req.on('error', (error) => {
      console.log(`❌ Error en ${path}: ${error.message}`)
      reject(error)
    })

    req.end()
  })
}

async function debugAPIError() {
  console.log('🔍 Debuggeando error de API...\n')
  
  const endpoints = [
    '/api/emergency-contacts',
    '/api/emergency',
    '/api/medical-info',
    '/api/appointments',
    '/api/notes',
    '/api/diagnoses',
    '/api/treatments'
  ]
  
  for (const endpoint of endpoints) {
    try {
      await testAPIEndpoint(endpoint)
    } catch (error) {
      console.log(`❌ Error probando ${endpoint}: ${error.message}`)
    }
  }
  
  console.log('\n🎯 Resumen:')
  console.log('Si ves respuestas HTML, significa que hay un error 404 o 500')
  console.log('Esto puede ser causado por:')
  console.log('1. Ruta de API incorrecta')
  console.log('2. Error en el servidor Next.js')
  console.log('3. Problema con el middleware')
  console.log('4. Error en la configuración de Supabase')
}

debugAPIError() 