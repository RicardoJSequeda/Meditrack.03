// Script para debuggear los datos del perfil
console.log('🔍 Debugging datos del perfil...')

// Simular diferentes escenarios de datos
const scenarios = [
  {
    name: 'Usuario con datos completos',
    data: {
      id: 'user-1',
      email: 'usuario@ejemplo.com',
      name: 'Juan Pérez',
      phone: '+1234567890',
      address: 'Calle Principal 123',
      dateOfBirth: '1990-05-15',
      gender: 'Masculino',
      bloodType: 'O+',
      emergencyContact: 'María Pérez',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    name: 'Usuario con datos mínimos',
    data: {
      id: 'user-2',
      email: 'minimo@ejemplo.com',
      name: 'Ana García',
      phone: null,
      address: null,
      dateOfBirth: null,
      gender: null,
      bloodType: null,
      emergencyContact: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    name: 'Usuario con datos parciales',
    data: {
      id: 'user-3',
      email: 'parcial@ejemplo.com',
      name: 'Carlos López',
      phone: '+9876543210',
      address: 'Avenida Central 456',
      dateOfBirth: '1985-12-20',
      gender: 'Masculino',
      bloodType: 'A+',
      emergencyContact: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }
]

// Simular respuesta de la API
function simulateApiResponse(userData) {
  return {
    success: true,
    data: userData
  }
}

// Simular mapeo de datos en el frontend
function mapUserData(apiResponse) {
  if (!apiResponse || !apiResponse.data) {
    console.log('❌ No hay datos en la respuesta de la API')
    return null
  }

  const data = apiResponse.data
  console.log('📝 Datos recibidos de la API:', data)

  const mappedData = {
    personal: {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
      gender: data.gender || "",
      address: data.address || "",
      emergencyContact: data.emergencyContact || "",
    },
    health: {
      bloodType: data.bloodType || "",
    }
  }

  console.log('✅ Datos mapeados:', mappedData)
  return mappedData
}

// Probar cada escenario
scenarios.forEach((scenario, index) => {
  console.log(`\n🧪 Escenario ${index + 1}: ${scenario.name}`)
  console.log('='.repeat(50))
  
  // Simular respuesta de la API
  const apiResponse = simulateApiResponse(scenario.data)
  console.log('🌐 Respuesta simulada de la API:', apiResponse)
  
  // Mapear datos
  const mappedData = mapUserData(apiResponse)
  
  if (mappedData) {
    console.log('\n📊 Análisis de campos:')
    console.log(`  Nombre: "${mappedData.personal.name}" ${mappedData.personal.name ? '✅' : '❌'}`)
    console.log(`  Email: "${mappedData.personal.email}" ${mappedData.personal.email ? '✅' : '❌'}`)
    console.log(`  Teléfono: "${mappedData.personal.phone}" ${mappedData.personal.phone ? '✅' : '❌'}`)
    console.log(`  Fecha Nacimiento: "${mappedData.personal.dateOfBirth}" ${mappedData.personal.dateOfBirth ? '✅' : '❌'}`)
    console.log(`  Género: "${mappedData.personal.gender}" ${mappedData.personal.gender ? '✅' : '❌'}`)
    console.log(`  Dirección: "${mappedData.personal.address}" ${mappedData.personal.address ? '✅' : '❌'}`)
    console.log(`  Contacto Emergencia: "${mappedData.personal.emergencyContact}" ${mappedData.personal.emergencyContact ? '✅' : '❌'}`)
    console.log(`  Tipo Sangre: "${mappedData.health.bloodType}" ${mappedData.health.bloodType ? '✅' : '❌'}`)
  }
})

// Simular problemas comunes
console.log('\n🔧 Problemas comunes identificados:')
console.log('\n1. ❌ Token inválido o expirado:')
console.log('   - El usuario no está autenticado')
console.log('   - El token ha expirado')
console.log('   - El token no se envía correctamente')

console.log('\n2. ❌ Datos no guardados en el registro:')
console.log('   - Los campos adicionales no se guardaron durante el registro')
console.log('   - Solo se guardó email, password y name')

console.log('\n3. ❌ Error en la API:')
console.log('   - La API no encuentra el usuario')
console.log('   - Error en la consulta a la base de datos')
console.log('   - Campos faltantes en la tabla users')

console.log('\n4. ❌ Error en el mapeo:')
console.log('   - Los datos llegan pero no se mapean correctamente')
console.log('   - Problema en el formato de fecha')
console.log('   - Campos null no se manejan correctamente')

console.log('\n🎯 Pasos para diagnosticar:')
console.log('\n1. Abre la consola del navegador (F12)')
console.log('2. Ve a la página de perfil')
console.log('3. Revisa los logs que empiezan con:')
console.log('   - 🔄 useEffect ejecutándose')
console.log('   - 👤 Usuario autenticado')
console.log('   - 🔍 Respuesta del perfil')
console.log('   - 📝 Datos del usuario recibidos')
console.log('   - ✅ Estado userData actualizado')

console.log('\n4. Si no hay logs, verifica:')
console.log('   - Que estés autenticado')
console.log('   - Que el token esté en localStorage')
console.log('   - Que la API responda correctamente')

console.log('\n5. Si hay logs pero los campos están vacíos:')
console.log('   - Verifica que los datos se guardaron en el registro')
console.log('   - Ejecuta el script SQL para agregar campos faltantes')
console.log('   - Verifica que la API devuelva todos los campos')

console.log('\n✅ Debug completado!') 