const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Probando conexión a Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('📡 Intentando conectar...')
    
    // Probar una consulta simple
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('✅ Conexión exitosa! La tabla users no existe aún (es normal)')
        return true
      }
      
      return false
    }
    
    console.log('✅ Conexión exitosa!')
    return true
  } catch (error) {
    console.log('❌ Error:', error.message)
    return false
  }
}

testConnection() 