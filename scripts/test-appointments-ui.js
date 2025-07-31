const http = require('http')

// Datos del usuario registrado
const testUserId = 'c868eb3d-8eeb-448f-a4d0-eaffabfbcf23'
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA2MTM0LCJleHAiOjE3NTQ0MTA5MzR9._2IKmpnqIzcmk5S1eZZF1uWVk8PRJxlecKIzf-QMqxk'

const testAppointments = [
  {
    title: "Consulta de Cardiología",
    doctor: "Dr. Carlos García",
    specialty: "Cardiología",
    date: "2024-08-05T10:00:00.000Z",
    duration: 45,
    location: "Hospital Central",
    notes: "Revisión de presión arterial y electrocardiograma",
    status: "SCHEDULED",
    userId: testUserId
  },
  {
    title: "Control de Diabetes",
    doctor: "Dra. María López",
    specialty: "Endocrinología",
    date: "2024-08-10T14:30:00.000Z",
    duration: 30,
    location: "Clínica San José",
    notes: "Revisión de niveles de glucosa y ajuste de medicación",
    status: "CONFIRMED",
    userId: testUserId
  },
  {
    title: "Radiografía de Tórax",
    doctor: "Dr. Roberto Silva",
    specialty: "Radiología",
    date: "2024-08-15T09:00:00.000Z",
    duration: 20,
    location: "Centro de Radiología",
    notes: "Examen de rutina anual",
    status: "SCHEDULED",
    userId: testUserId
  },
  {
    title: "Consulta de Dermatología",
    doctor: "Dra. Ana Martínez",
    specialty: "Dermatología",
    date: "2024-08-20T11:15:00.000Z",
    duration: 30,
    location: "Clínica Norte",
    notes: "Revisión de manchas en la piel",
    status: "SCHEDULED",
    userId: testUserId
  }
]

function makeRequest(path, method, data = null, token = null) {
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

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
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

async function testAppointmentsUI() {
  console.log('🧪 Probando funcionalidad completa de citas...\n')

  try {
    // 1. Crear múltiples citas
    console.log('📝 Creando citas de prueba...')
    const createdAppointments = []
    
    for (const appointment of testAppointments) {
      const result = await makeRequest('/api/appointments', 'POST', appointment, testToken)
      console.log(`   ✅ Cita creada: ${appointment.title} - ${result.status}`)
      if (result.data.success) {
        createdAppointments.push(result.data.data)
      }
    }

    // 2. Obtener todas las citas
    console.log('\n📋 Obteniendo todas las citas...')
    const getResult = await makeRequest(`/api/appointments?userId=${testUserId}`, 'GET', null, testToken)
    console.log(`   📊 Status: ${getResult.status}`)
    console.log(`   📄 Citas obtenidas: ${getResult.data.data?.length || 0}`)

    if (getResult.data.success && getResult.data.data.length > 0) {
      const firstAppointment = getResult.data.data[0]
      console.log(`   👆 Primera cita: ${firstAppointment.title}`)

      // 3. Actualizar una cita
      console.log('\n✏️ Actualizando primera cita...')
      const updateData = {
        title: "Consulta de Cardiología - ACTUALIZADA",
        notes: "Notas actualizadas para la consulta",
        status: "CONFIRMED",
        userId: testUserId
      }
      
      const updateResult = await makeRequest(`/api/appointments/${firstAppointment.id}`, 'PATCH', updateData, testToken)
      console.log(`   📝 Status: ${updateResult.status} - ${updateResult.data.success ? '✅' : '❌'}`)

      // 4. Eliminar una cita
      console.log('\n🗑️ Eliminando última cita...')
      const lastAppointment = getResult.data.data[getResult.data.data.length - 1]
      const deleteResult = await makeRequest(`/api/appointments/${lastAppointment.id}?userId=${testUserId}`, 'DELETE', null, testToken)
      console.log(`   🗑️ Status: ${deleteResult.status} - ${deleteResult.data.success ? '✅' : '❌'}`)

      // 5. Verificar citas después de eliminar
      console.log('\n📋 Verificando citas después de eliminar...')
      const finalGetResult = await makeRequest(`/api/appointments?userId=${testUserId}`, 'GET', null, testToken)
      console.log(`   📊 Citas restantes: ${finalGetResult.data.data?.length || 0}`)
    }

    console.log('\n🎉 Pruebas de citas completadas!')
    console.log('\n📱 Ahora puedes probar la interfaz web:')
    console.log('   1. Ve a http://localhost:3000')
    console.log('   2. Inicia sesión con: kalexioviedo@gmail.com')
    console.log('   3. Ve a la sección "Mis Citas"')
    console.log('   4. Prueba crear, editar y eliminar citas')

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

testAppointmentsUI() 