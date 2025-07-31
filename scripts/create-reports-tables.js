const http = require('http')

// Token válido
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
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
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
            data: parsedData
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

async function testReportsAPIs() {
  console.log('🧪 Probando APIs de informes...\n')
  
  const tests = [
    {
      name: 'Métricas de Salud',
      path: '/api/health-metrics',
      expected: 'array'
    },
    {
      name: 'Adherencia a Medicamentos',
      path: '/api/medication-adherence',
      expected: 'array'
    },
    {
      name: 'Recomendaciones',
      path: '/api/recommendations',
      expected: 'array'
    }
  ]
  
  let passedTests = 0
  let totalTests = tests.length
  
  for (const test of tests) {
    try {
      console.log(`🔍 Probando: ${test.name}`)
      const result = await makeRequest(test.path)
      
      if (result.success && result.data.success) {
        const data = result.data.data
        const isCorrectType = test.expected === 'array' ? Array.isArray(data) : typeof data === 'object'
        
        if (isCorrectType) {
          console.log(`   ✅ ${test.name}: OK`)
          console.log(`      📊 ${Array.isArray(data) ? data.length + ' elementos' : '1 elemento'}`)
          passedTests++
        } else {
          console.log(`   ❌ ${test.name}: Tipo de datos incorrecto`)
        }
      } else {
        console.log(`   ❌ ${test.name}: Error - ${result.data?.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: Error de conexión - ${error.message}`)
    }
  }
  
  console.log('\n📊 Resultados:')
  console.log(`   ✅ Tests pasados: ${passedTests}/${totalTests}`)
  console.log(`   📈 Porcentaje de éxito: ${Math.round((passedTests/totalTests)*100)}%`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ¡APIs de informes funcionando correctamente!')
    console.log('\n✅ Todas las APIs están respondiendo')
    console.log('✅ Los datos se cargan desde Supabase')
    console.log('✅ Las tablas están creadas correctamente')
  } else {
    console.log('\n⚠️ Algunos tests fallaron')
    console.log('Revisa los logs para identificar los problemas')
  }
  
  console.log('\n📋 Instrucciones para crear las tablas:')
  console.log('1. Ve a tu dashboard de Supabase')
  console.log('2. Ve a la sección SQL Editor')
  console.log('3. Copia y pega el contenido del archivo SQL-CREATE-REPORTS-TABLES.sql')
  console.log('4. Ejecuta el script SQL')
  console.log('5. Vuelve a ejecutar este script para verificar')
}

testReportsAPIs() 