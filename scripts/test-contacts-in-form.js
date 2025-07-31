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

async function testContactsInForm() {
  console.log('👥 Probando carga de contactos en el formulario...\n')
  
  try {
    // 1. Obtener contactos de emergencia
    console.log('📖 1. Obteniendo contactos de emergencia...')
    const contactsResponse = await makeRequest('/api/emergency-contacts?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', contactsResponse.status)
    if (contactsResponse.status === 200) {
      console.log('✅ Contactos obtenidos exitosamente')
      console.log('📋 Contactos disponibles:')
      
      const contacts = contactsResponse.data.data || contactsResponse.data
      if (Array.isArray(contacts)) {
        contacts.forEach((contact, index) => {
          console.log(`   ${index + 1}. ${contact.name} (${contact.relationship}) - ${contact.phone}`)
        })
        
        console.log(`\n📊 Total de contactos: ${contacts.length}`)
        
        // Generar opciones como lo hace el formulario
        const contactOptions = contacts.map(contact => ({
          value: `${contact.name} - ${contact.relationship}`,
          label: `${contact.name} (${contact.relationship}) - ${contact.phone}`
        }))
        
        console.log('\n🎯 Opciones que aparecerán en el formulario:')
        contactOptions.forEach((option, index) => {
          console.log(`   ${index + 1}. Valor: "${option.value}"`)
          console.log(`      Etiqueta: "${option.label}"`)
        })
        
      } else {
        console.log('❌ Formato de respuesta inesperado:', contacts)
      }
    } else {
      console.log('❌ Error obteniendo contactos:', contactsResponse.data)
    }
    
    // 2. Obtener información médica actual
    console.log('\n📖 2. Obteniendo información médica actual...')
    const medicalInfoResponse = await makeRequest('/api/medical-info?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', medicalInfoResponse.status)
    if (medicalInfoResponse.status === 200) {
      console.log('✅ Información médica obtenida exitosamente')
      const medicalInfo = medicalInfoResponse.data.data || medicalInfoResponse.data
      console.log('📋 Contacto de emergencia actual:', medicalInfo.emergencyContact)
    } else {
      console.log('❌ Error obteniendo información médica:', medicalInfoResponse.data)
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
  }
  
  console.log('\n🎯 Próximos pasos:')
  console.log('1. Ve a la aplicación')
  console.log('2. Ve a la sección "Emergencia"')
  console.log('3. Haz clic en "Información Médica de Emergencia"')
  console.log('4. Haz clic en "Editar"')
  console.log('5. Verifica que el campo "Contacto de Emergencia" muestre las opciones de contactos guardados')
  console.log('6. Selecciona un contacto y guarda la información')
}

testContactsInForm() 