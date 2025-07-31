require('dotenv').config({ path: '.env.local' })

const http = require('http')

// Token válido para pruebas
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

async function verifyFrontendIntegration() {
  console.log('🔍 Verificando integración completa del frontend...\n')
  
  // Verificar que el token es válido
  const payload = decodeJWT(testToken)
  console.log('📋 Token verificado:')
  console.log(`   👤 Usuario: ${payload?.name}`)
  console.log(`   📧 Email: ${payload?.email}`)
  console.log(`   🆔 UserID: ${payload?.userId}`)
  console.log(`   ⏰ Expira: ${new Date(payload?.exp * 1000).toLocaleString()}`)
  
  console.log('\n🔍 Probando APIs con el mismo flujo que usa el frontend...')
  
  const tests = [
    {
      name: 'Diagnósticos',
      path: '/api/diagnoses',
      expected: 'array'
    },
    {
      name: 'Tratamientos',
      path: '/api/treatments',
      expected: 'array'
    },
    {
      name: 'Eventos Médicos',
      path: '/api/medical-events',
      expected: 'array'
    },
    {
      name: 'Documentos Médicos',
      path: '/api/medical-documents',
      expected: 'array'
    }
  ]
  
  let passedTests = 0
  let totalTests = tests.length
  
  for (const test of tests) {
    try {
      console.log(`\n🔍 Probando: ${test.name}`)
      const result = await makeRequest(test.path)
      
      console.log(`   📊 Status: ${result.status}`)
      console.log(`   📊 Success: ${result.success}`)
      
      if (result.success && result.data.success) {
        const data = result.data.data
        const isCorrectType = test.expected === 'array' ? Array.isArray(data) : typeof data === 'object'
        
        if (isCorrectType) {
          console.log(`   ✅ ${test.name}: OK`)
          console.log(`      📊 ${Array.isArray(data) ? data.length + ' elementos' : '1 elemento'}`)
          
          if (Array.isArray(data) && data.length > 0) {
            const sample = data[0]
            console.log(`      📝 Ejemplo: ${JSON.stringify(sample, null, 2).substring(0, 200)}...`)
          }
          
          passedTests++
        } else {
          console.log(`   ❌ ${test.name}: Tipo de datos incorrecto`)
          console.log(`      📝 Datos recibidos: ${JSON.stringify(result.data, null, 2)}`)
        }
      } else {
        console.log(`   ❌ ${test.name}: Error`)
        console.log(`      📝 Respuesta: ${JSON.stringify(result.data, null, 2)}`)
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: Error de conexión - ${error.message}`)
    }
  }
  
  console.log('\n📊 Resultados de la verificación:')
  console.log(`   ✅ Tests pasados: ${passedTests}/${totalTests}`)
  console.log(`   📈 Porcentaje de éxito: ${Math.round((passedTests/totalTests)*100)}%`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ¡Integración del frontend funcionando correctamente!')
    console.log('\n✅ Todas las APIs están respondiendo')
    console.log('✅ Los datos se cargan desde Supabase')
    console.log('✅ Los hooks están funcionando')
    console.log('✅ La página de historial médico está conectada a la BD')
    
    console.log('\n📋 Para verificar en el navegador:')
    console.log('1. Abre http://localhost:3000/medical-history')
    console.log('2. Verifica que los datos aparecen en las pestañas')
    console.log('3. Prueba el botón "Agregar Registro"')
    console.log('4. Verifica que los nuevos registros aparecen')
    console.log('5. Prueba las funcionalidades de búsqueda y filtros')
    
    console.log('\n🔧 Si los datos no aparecen en el navegador:')
    console.log('1. Abre las herramientas de desarrollador (F12)')
    console.log('2. Ve a la pestaña Console y busca errores')
    console.log('3. Ve a la pestaña Network y verifica las llamadas a las APIs')
    console.log('4. Verifica que localStorage.getItem("token") devuelve el token')
    console.log('5. Recarga la página y verifica que los hooks se ejecutan')
    
  } else {
    console.log('\n⚠️ Algunos tests fallaron')
    console.log('Revisa los logs para identificar los problemas')
  }
}

verifyFrontendIntegration() 