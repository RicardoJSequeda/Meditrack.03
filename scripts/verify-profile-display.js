// Script para verificar que los datos se muestran correctamente en el perfil
console.log('🔍 Verificando visualización de datos en el perfil...')

// Simular datos que deberían estar en la base de datos después de la actualización
const mockDatabaseData = {
  id: 'user-123',
  email: 'usuario@ejemplo.com',
  name: 'Juan Pérez',
  phone: '+1234567890',
  address: 'Calle Principal 123, Ciudad',
  dateOfBirth: '1990-05-15',
  gender: 'Masculino',
  bloodType: 'O+',
  emergencyContact: 'María Pérez',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Simular respuesta de la API
const mockApiResponse = {
  success: true,
  data: mockDatabaseData
}

// Simular mapeo en el frontend
function mapToUserData(apiResponse) {
  if (!apiResponse || !apiResponse.data) {
    return null
  }

  const data = apiResponse.data
  return {
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
}

// Simular renderizado en los campos
function simulateFieldDisplay(userData) {
  console.log('\n📋 Simulación de campos en el formulario:')
  console.log('='.repeat(60))
  
  console.log('📝 Información Personal:')
  console.log(`  Nombre Completo: [${userData.personal.name}] ${userData.personal.name ? '✅' : '❌'}`)
  console.log(`  Correo Electrónico: [${userData.personal.email}] ${userData.personal.email ? '✅' : '❌'}`)
  console.log(`  Teléfono: [${userData.personal.phone}] ${userData.personal.phone ? '✅' : '❌'}`)
  console.log(`  Fecha de Nacimiento: [${userData.personal.dateOfBirth}] ${userData.personal.dateOfBirth ? '✅' : '❌'}`)
  console.log(`  Género: [${userData.personal.gender}] ${userData.personal.gender ? '✅' : '❌'}`)
  console.log(`  Dirección: [${userData.personal.address}] ${userData.personal.address ? '✅' : '❌'}`)
  console.log(`  Contacto de Emergencia: [${userData.personal.emergencyContact}] ${userData.personal.emergencyContact ? '✅' : '❌'}`)
  
  console.log('\n🏥 Información Médica:')
  console.log(`  Tipo de Sangre: [${userData.health.bloodType}] ${userData.health.bloodType ? '✅' : '❌'}`)
}

// Probar el flujo completo
console.log('🧪 Probando flujo completo de datos...')

// 1. Simular datos de la base de datos
console.log('\n1️⃣ Datos en la base de datos:')
console.log(JSON.stringify(mockDatabaseData, null, 2))

// 2. Simular respuesta de la API
console.log('\n2️⃣ Respuesta de la API:')
console.log(JSON.stringify(mockApiResponse, null, 2))

// 3. Mapear datos para el frontend
const userData = mapToUserData(mockApiResponse)
console.log('\n3️⃣ Datos mapeados para el frontend:')
console.log(JSON.stringify(userData, null, 2))

// 4. Simular visualización en campos
simulateFieldDisplay(userData)

// Verificar problemas específicos
console.log('\n🔧 Verificación de problemas específicos:')

// Verificar si los campos están vacíos
const emptyFields = []
if (!userData.personal.name) emptyFields.push('Nombre')
if (!userData.personal.email) emptyFields.push('Email')
if (!userData.personal.phone) emptyFields.push('Teléfono')
if (!userData.personal.dateOfBirth) emptyFields.push('Fecha de Nacimiento')
if (!userData.personal.gender) emptyFields.push('Género')
if (!userData.personal.address) emptyFields.push('Dirección')
if (!userData.personal.emergencyContact) emptyFields.push('Contacto de Emergencia')
if (!userData.health.bloodType) emptyFields.push('Tipo de Sangre')

if (emptyFields.length > 0) {
  console.log(`❌ Campos vacíos: ${emptyFields.join(', ')}`)
} else {
  console.log('✅ Todos los campos tienen datos')
}

// Verificar formato de fecha
if (userData.personal.dateOfBirth) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (dateRegex.test(userData.personal.dateOfBirth)) {
    console.log('✅ Formato de fecha correcto')
  } else {
    console.log('❌ Formato de fecha incorrecto')
  }
}

console.log('\n🎯 Pasos para verificar en el navegador:')
console.log('\n1. Abre la consola del navegador (F12)')
console.log('2. Ve a la página de perfil')
console.log('3. Revisa los logs que empiezan con:')
console.log('   - 🔍 GET /api/user/profile - Iniciando...')
console.log('   - 📊 Datos del usuario:')
console.log('   - 📤 Enviando respuesta:')
console.log('   - 📝 Datos del usuario recibidos:')
console.log('   - 📊 Análisis de campos recibidos:')

console.log('\n4. Si los logs muestran datos pero los campos están vacíos:')
console.log('   - Verifica que el estado userData se actualice correctamente')
console.log('   - Verifica que los campos del formulario usen userData.personal.*')
console.log('   - Verifica que no haya errores de renderizado')

console.log('\n5. Si los logs no muestran datos:')
console.log('   - Verifica que la tabla users tenga los datos correctos')
console.log('   - Verifica que el usuario esté autenticado correctamente')
console.log('   - Verifica que la API esté funcionando')

console.log('\n✅ Verificación completada!') 