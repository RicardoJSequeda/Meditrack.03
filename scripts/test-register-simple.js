const http = require('http')

const userData = {
  name: "Test User",
  email: "test@example.com",
  password: "password123"
}

const postData = JSON.stringify(userData)

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}

console.log('🧪 Probando registro de usuario...')
console.log('📝 Datos a enviar:', JSON.stringify(userData, null, 2))

const req = http.request(options, (res) => {
  console.log('📊 Status:', res.statusCode)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data)
      console.log('📄 Response:', JSON.stringify(result, null, 2))
      
      if (res.statusCode === 200) {
        console.log('✅ Registro exitoso!')
      } else {
        console.log('❌ Error en registro')
      }
    } catch (error) {
      console.log('📄 Raw response:', data)
    }
  })
})

req.on('error', (error) => {
  console.error('❌ Error:', error.message)
})

req.write(postData)
req.end() 