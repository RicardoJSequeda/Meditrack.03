const fetch = require('node-fetch')

async function testRegister() {
  try {
    console.log('🧪 Probando registro de usuario...')
    
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    }
    
    console.log('📝 Datos a enviar:', JSON.stringify(userData, null, 2))
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    const result = await response.json()
    
    console.log('📊 Status:', response.status)
    console.log('📄 Response:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('✅ Registro exitoso!')
    } else {
      console.log('❌ Error en registro')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testRegister() 