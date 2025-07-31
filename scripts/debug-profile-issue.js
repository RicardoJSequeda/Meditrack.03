// Script para debuggear el problema del perfil
console.log('🔍 Debugging Profile Issue...')

// 1. Verificar que el script se ejecuta
console.log('✅ Script ejecutándose correctamente')

// 2. Simular los datos que deberían llegar del backend
const mockUserData = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Usuario Test',
  phone: '+1234567890',
  address: 'Calle Test 123',
  dateOfBirth: '1990-01-01',
  gender: 'Masculino',
  bloodType: 'O+',
  emergencyContact: 'Contacto Test',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

console.log('📝 Datos simulados del usuario:')
console.log(JSON.stringify(mockUserData, null, 2))

// 3. Simular el payload que se envía al guardar
const mockSavePayload = {
  name: mockUserData.name,
  phone: mockUserData.phone,
  address: mockUserData.address,
  bloodType: mockUserData.bloodType,
  emergencyContact: mockUserData.emergencyContact,
  dateOfBirth: mockUserData.dateOfBirth,
  gender: mockUserData.gender
}

console.log('💾 Payload que se enviaría al guardar:')
console.log(JSON.stringify(mockSavePayload, null, 2))

// 4. Verificar que todos los campos están presentes
const requiredFields = ['name', 'phone', 'address', 'dateOfBirth', 'gender', 'bloodType', 'emergencyContact']
const missingFields = requiredFields.filter(field => !mockSavePayload[field])

if (missingFields.length > 0) {
  console.log('❌ Campos faltantes:', missingFields)
} else {
  console.log('✅ Todos los campos están presentes')
}

// 5. Simular la respuesta del backend
const mockBackendResponse = {
  success: true,
  data: {
    ...mockUserData,
    ...mockSavePayload
  }
}

console.log('✅ Respuesta simulada del backend:')
console.log(JSON.stringify(mockBackendResponse, null, 2))

console.log('\n🎯 Pasos para verificar en el navegador:')
console.log('1. Abre la consola del navegador (F12)')
console.log('2. Ve a la página de perfil')
console.log('3. Revisa los logs que empiezan con 🔍, 📝, ✅')
console.log('4. Edita algún campo y haz clic en "Guardar"')
console.log('5. Revisa los logs que empiezan con 💾, ✅')
console.log('6. Si hay errores, revisa los logs que empiezan con ❌')

console.log('\n🔧 Posibles problemas:')
console.log('- Token de autorización no válido')
console.log('- Campos faltantes en la tabla users')
console.log('- Error en la API del perfil')
console.log('- Problema en el mapeo de datos')

console.log('\n✅ Debug completado!') 