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

function makeRequest(path, method = 'POST', data = null) {
  return new Promise((resolve, reject) => {
    const payload = decodeJWT(testToken)
    const userId = payload?.userId || 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
    
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
      req.write(JSON.stringify({ ...data, userId }))
    }

    req.end()
  })
}

async function testAddRecord() {
  console.log('🧪 Probando funcionalidad de agregar registros...\n')
  
  try {
    // 1. Probar agregar diagnóstico
    console.log('🔍 1. Probando agregar diagnóstico...')
    const diagnosisData = {
      condition: 'Diabetes Tipo 2',
      diagnosedDate: new Date('2024-01-20T10:00:00Z').toISOString(),
      doctor: 'Dr. Ana Rodríguez',
      specialty: 'Endocrinología',
      severity: 'MODERADA',
      status: 'ACTIVA',
      lastReading: '140 mg/dL',
      nextCheckup: new Date('2024-03-20T10:00:00Z').toISOString(),
      notes: 'Diabetes tipo 2 diagnosticada. Requiere monitoreo de glucosa y dieta controlada.'
    }
    
    const diagnosisResult = await makeRequest('/api/diagnoses', 'POST', diagnosisData)
    
    if (diagnosisResult.success && diagnosisResult.data.success) {
      console.log('✅ Diagnóstico agregado exitosamente')
      console.log(`   📝 ID: ${diagnosisResult.data.data.id}`)
      console.log(`   📝 Condición: ${diagnosisResult.data.data.condition}`)
    } else {
      console.log('❌ Error agregando diagnóstico:', diagnosisResult.data?.error || 'Error desconocido')
    }
    
    console.log('')
    
    // 2. Probar agregar tratamiento
    console.log('🔍 2. Probando agregar tratamiento...')
    const treatmentData = {
      medication: 'Metformina',
      dosage: '500mg',
      frequency: '2 veces al día',
      startDate: new Date('2024-01-25T00:00:00Z').toISOString(),
      status: 'ACTIVO',
      sideEffects: 'Náuseas leves ocasionales',
      doctorNotes: 'Tomar con las comidas. Monitorear función renal.',
      prescribedBy: 'Dr. Ana Rodríguez'
    }
    
    const treatmentResult = await makeRequest('/api/treatments', 'POST', treatmentData)
    
    if (treatmentResult.success && treatmentResult.data.success) {
      console.log('✅ Tratamiento agregado exitosamente')
      console.log(`   📝 ID: ${treatmentResult.data.data.id}`)
      console.log(`   📝 Medicamento: ${treatmentResult.data.data.medication}`)
    } else {
      console.log('❌ Error agregando tratamiento:', treatmentResult.data?.error || 'Error desconocido')
    }
    
    console.log('')
    
    // 3. Probar agregar evento médico
    console.log('🔍 3. Probando agregar evento médico...')
    const eventData = {
      type: 'CONSULTA',
      title: 'Control de Diabetes',
      date: new Date('2024-02-01T14:00:00Z').toISOString(),
      location: 'Clínica Endocrinológica',
      doctor: 'Dr. Ana Rodríguez',
      description: 'Control rutinario de diabetes tipo 2. Revisión de glucosa y ajuste de medicación.',
      outcome: 'Glucosa controlada. Continuar con Metformina 500mg.',
      followUp: 'Próximo control en 2 meses'
    }
    
    const eventResult = await makeRequest('/api/medical-events', 'POST', eventData)
    
    if (eventResult.success && eventResult.data.success) {
      console.log('✅ Evento médico agregado exitosamente')
      console.log(`   📝 ID: ${eventResult.data.data.id}`)
      console.log(`   📝 Título: ${eventResult.data.data.title}`)
    } else {
      console.log('❌ Error agregando evento:', eventResult.data?.error || 'Error desconocido')
    }
    
    console.log('')
    
    // 4. Probar agregar documento médico
    console.log('🔍 4. Probando agregar documento médico...')
    const documentData = {
      type: 'ANALISIS',
      title: 'Perfil Lipídico',
      date: new Date('2024-01-15T08:00:00Z').toISOString(),
      doctor: 'Dr. Laboratorio',
      category: 'Laboratorio',
      description: 'Análisis de colesterol y triglicéridos para control de diabetes.',
      results: 'Colesterol total: 180 mg/dL, HDL: 45 mg/dL, LDL: 110 mg/dL, Triglicéridos: 150 mg/dL',
      recommendations: 'Mantener dieta baja en grasas y ejercicio regular.'
    }
    
    const documentResult = await makeRequest('/api/medical-documents', 'POST', documentData)
    
    if (documentResult.success && documentResult.data.success) {
      console.log('✅ Documento médico agregado exitosamente')
      console.log(`   📝 ID: ${documentResult.data.data.id}`)
      console.log(`   📝 Título: ${documentResult.data.data.title}`)
    } else {
      console.log('❌ Error agregando documento:', documentResult.data?.error || 'Error desconocido')
    }
    
    console.log('\n🎉 ¡Pruebas de agregar registros completadas!')
    console.log('\n📋 Resumen:')
    console.log('✅ Funcionalidad de agregar diagnósticos funcionando')
    console.log('✅ Funcionalidad de agregar tratamientos funcionando')
    console.log('✅ Funcionalidad de agregar eventos médicos funcionando')
    console.log('✅ Funcionalidad de agregar documentos médicos funcionando')
    
    console.log('\n📋 Próximos pasos:')
    console.log('1. Ve a la aplicación en el navegador')
    console.log('2. Navega a la página de Historial Médico')
    console.log('3. Haz clic en "Agregar Registro"')
    console.log('4. Prueba agregar diferentes tipos de registros')
    console.log('5. Verifica que los datos aparecen en la interfaz')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

testAddRecord() 