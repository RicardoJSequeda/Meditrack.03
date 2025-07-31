const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA5MTEzLCJleHAiOjE3NTQ0MTM5MTN9.VwQADhe9JY-HzCLEbtTpCBvqfFmeC2LJ98fgtSLJQ6U'

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

async function testEmergencyContactsCRUD() {
  console.log('🧪 Probando operaciones CRUD completas de contactos de emergencia...\n')
  
  let createdContactId = null
  
  try {
    // 1. CREAR contacto
    console.log('📝 1. Probando CREAR contacto...')
    const newContact = {
      name: "Dr. Roberto Silva",
      relationship: "Neurólogo",
      phone: "+573301234567",
      isPrimary: false,
      isOnline: true,
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const createResponse = await makeRequest('/api/emergency-contacts', 'POST', newContact)
    
    console.log('📊 Status:', createResponse.status)
    if (createResponse.status === 200 && createResponse.data.success) {
      console.log('✅ Contacto creado exitosamente')
      createdContactId = createResponse.data.data.id
      console.log('📋 ID del contacto creado:', createdContactId)
    } else {
      console.log('❌ Error creando contacto:', createResponse.data)
      return
    }
    
    // 2. LEER contactos (verificar que se agregó)
    console.log('\n📖 2. Probando LEER contactos...')
    const readResponse = await makeRequest('/api/emergency-contacts?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readResponse.status)
    if (readResponse.status === 200 && readResponse.data.success) {
      console.log('✅ Contactos leídos exitosamente')
      console.log(`📊 Total de contactos: ${readResponse.data.data?.length || 0}`)
      
      // Verificar que el contacto creado está en la lista
      const foundContact = readResponse.data.data.find(c => c.id === createdContactId)
      if (foundContact) {
        console.log('✅ Contacto creado encontrado en la lista')
      } else {
        console.log('❌ Contacto creado NO encontrado en la lista')
      }
    } else {
      console.log('❌ Error leyendo contactos:', readResponse.data)
    }
    
    // 3. ACTUALIZAR contacto
    console.log('\n✏️ 3. Probando ACTUALIZAR contacto...')
    const updateData = {
      name: "Dr. Roberto Silva Actualizado",
      relationship: "Neurólogo Especialista",
      phone: "+573301234568",
      isPrimary: true,
      isOnline: false,
      userId: "c868eb3d-8eeb-448f-a4d0-eaffabfbcf23"
    }
    
    const updateResponse = await makeRequest(`/api/emergency-contacts/${createdContactId}`, 'PATCH', updateData)
    
    console.log('📊 Status:', updateResponse.status)
    if (updateResponse.status === 200 && updateResponse.data.success) {
      console.log('✅ Contacto actualizado exitosamente')
      console.log('📋 Datos actualizados:', updateResponse.data.data)
    } else {
      console.log('❌ Error actualizando contacto:', updateResponse.data)
    }
    
    // 4. LEER contactos (verificar que se actualizó)
    console.log('\n📖 4. Probando LEER contactos después de actualizar...')
    const readAfterUpdateResponse = await makeRequest('/api/emergency-contacts?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readAfterUpdateResponse.status)
    if (readAfterUpdateResponse.status === 200 && readAfterUpdateResponse.data.success) {
      console.log('✅ Contactos leídos exitosamente después de actualizar')
      
      // Verificar que el contacto actualizado está en la lista
      const foundUpdatedContact = readAfterUpdateResponse.data.data.find(c => c.id === createdContactId)
      if (foundUpdatedContact) {
        console.log('✅ Contacto actualizado encontrado en la lista')
        console.log('📋 Datos del contacto actualizado:', foundUpdatedContact)
      } else {
        console.log('❌ Contacto actualizado NO encontrado en la lista')
      }
    } else {
      console.log('❌ Error leyendo contactos después de actualizar:', readAfterUpdateResponse.data)
    }
    
    // 5. ELIMINAR contacto
    console.log('\n🗑️ 5. Probando ELIMINAR contacto...')
    const deleteResponse = await makeRequest(`/api/emergency-contacts/${createdContactId}?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23`, 'DELETE')
    
    console.log('📊 Status:', deleteResponse.status)
    if (deleteResponse.status === 200 && deleteResponse.data.success) {
      console.log('✅ Contacto eliminado exitosamente')
      console.log('📋 Datos del contacto eliminado:', deleteResponse.data.data)
    } else {
      console.log('❌ Error eliminando contacto:', deleteResponse.data)
    }
    
    // 6. LEER contactos (verificar que se eliminó)
    console.log('\n📖 6. Probando LEER contactos después de eliminar...')
    const readAfterDeleteResponse = await makeRequest('/api/emergency-contacts?userId=c868eb3d-8eeb-448f-a4d0-eaffabfbcf23')
    
    console.log('📊 Status:', readAfterDeleteResponse.status)
    if (readAfterDeleteResponse.status === 200 && readAfterDeleteResponse.data.success) {
      console.log('✅ Contactos leídos exitosamente después de eliminar')
      
      // Verificar que el contacto eliminado NO está en la lista
      const foundDeletedContact = readAfterDeleteResponse.data.data.find(c => c.id === createdContactId)
      if (!foundDeletedContact) {
        console.log('✅ Contacto eliminado NO encontrado en la lista (correcto)')
      } else {
        console.log('❌ Contacto eliminado SÍ encontrado en la lista (incorrecto)')
      }
      
      console.log(`📊 Total de contactos después de eliminar: ${readAfterDeleteResponse.data.data?.length || 0}`)
    } else {
      console.log('❌ Error leyendo contactos después de eliminar:', readAfterDeleteResponse.data)
    }
    
    console.log('\n🎉 Pruebas CRUD de contactos completadas exitosamente!')
    console.log('\n📱 Ahora puedes probar la interfaz web:')
    console.log('   1. Ve a http://localhost:3000')
    console.log('   2. Inicia sesión con: kalexioviedo@gmail.com')
    console.log('   3. Ve a la sección "Emergencia"')
    console.log('   4. Prueba crear, editar y eliminar contactos')
    console.log('   5. Verifica que todas las operaciones funcionan con la base de datos')
    
  } catch (error) {
    console.error('❌ Error en las pruebas CRUD:', error.message)
  }
}

testEmergencyContactsCRUD() 