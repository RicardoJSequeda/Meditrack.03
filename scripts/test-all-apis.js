const http = require('http')

// Datos de prueba
const testUserId = 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23' // ID del usuario registrado

const testData = {
  // Diagnóstico
  diagnosis: {
    condition: "Diabetes Tipo 2",
    diagnosedDate: "2024-01-15T00:00:00.000Z",
    doctor: "Dr. María González",
    specialty: "Endocrinología",
    severity: "MODERADA",
    status: "ACTIVA",
    lastReading: "120 mg/dL",
    nextCheckup: "2024-08-15T00:00:00.000Z",
    notes: "Controlar dieta y ejercicio",
    userId: testUserId
  },

  // Tratamiento
  treatment: {
    medication: "Metformina",
    dosage: "500mg",
    frequency: "2 veces al día",
    startDate: "2024-01-15T00:00:00.000Z",
    endDate: "2024-12-31T00:00:00.000Z",
    adherence: 85,
    status: "ACTIVO",
    sideEffects: "Náuseas leves",
    doctorNotes: "Tomar con las comidas",
    prescribedBy: "Dr. María González",
    userId: testUserId
  },

  // Cita
  appointment: {
    title: "Control de diabetes",
    date: "2024-08-15T10:00:00.000Z",
    duration: 30,
    doctor: "Dr. María González",
    specialty: "Endocrinología",
    location: "Clínica San José",
    notes: "Traer resultados de laboratorio",
    status: "SCHEDULED",
    userId: testUserId
  },

  // Recordatorio
  reminder: {
    title: "Tomar Metformina",
    description: "Recordar tomar la medicación después del desayuno",
    date: "2024-07-30T08:00:00.000Z",
    type: "MEDICATION",
    isCompleted: false,
    userId: testUserId
  },

  // Nota médica
  note: {
    title: "Síntomas de diabetes",
    content: "Aumento de sed, fatiga y visión borrosa. Controlar niveles de glucosa regularmente.",
    category: "Síntomas",
    isPinned: true,
    isFavorite: false,
    isArchived: false,
    userId: testUserId
  },

  // Contacto de emergencia
  emergencyContact: {
    name: "María Sequeda",
    relationship: "Esposa",
    phone: "+57 300 123 4567",
    isPrimary: true,
    isOnline: true,
    lastSeen: "2024-07-29T16:00:00.000Z",
    userId: testUserId
  }
}

function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : ''
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => {
        responseData += chunk
      })
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData)
          resolve({ status: res.statusCode, data: result })
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(postData)
    }
    req.end()
  })
}

async function testAllAPIs() {
  console.log('🧪 Probando todas las APIs con Supabase...\n')

  const tests = [
    {
      name: 'Diagnósticos',
      path: '/api/diagnoses',
      data: testData.diagnosis
    },
    {
      name: 'Tratamientos',
      path: '/api/treatments',
      data: testData.treatment
    },
    {
      name: 'Citas',
      path: '/api/appointments',
      data: testData.appointment
    },
    {
      name: 'Recordatorios',
      path: '/api/reminders',
      data: testData.reminder
    },
    {
      name: 'Notas Médicas',
      path: '/api/notes',
      data: testData.note
    },
    {
      name: 'Contactos de Emergencia',
      path: '/api/emergency-contacts',
      data: testData.emergencyContact
    }
  ]

  for (const test of tests) {
    try {
      console.log(`📝 Probando ${test.name}...`)
      
      // POST - Crear
      const createResult = await makeRequest(test.path, 'POST', test.data)
      console.log(`   POST: ${createResult.status} - ${createResult.data.success ? '✅' : '❌'} ${createResult.data.error || 'Exitoso'}`)
      
      // GET - Obtener
      const getResult = await makeRequest(`${test.path}?userId=${testUserId}`, 'GET')
      console.log(`   GET:  ${getResult.status} - ${getResult.data.success ? '✅' : '❌'} ${getResult.data.error || `${getResult.data.data?.length || 0} registros`}`)
      
      console.log('')
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`)
    }
  }

  console.log('🎉 Pruebas completadas!')
}

testAllAPIs() 