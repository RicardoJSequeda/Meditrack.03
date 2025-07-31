const http = require('http')

// Token válido generado
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODY4ZWIzZC04ZWViLTQ0OGYtYTRkMC1lYWZmYWJmYmNmMjMiLCJlbWFpbCI6ImthbGV4aW92aWVkb0BnbWFpbC5jb20iLCJuYW1lIjoicmljYXJkbyBqYXZpZXIgc2VxdWVkYSBnb2V6IiwiaWF0IjoxNzUzODA5ODAxLCJleHAiOjE3NTQ0MTQ2MDF9.I_s4q-AmUerEW_sxpMBLDInoabmhCtgXpqkFrIYFKEI'

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

async function createMedicalInfoTable() {
  console.log('🔧 Creando tabla medical_info en Supabase...\n')
  
  try {
    // SQL para crear la tabla
    const createTableSQL = `
      -- Crear tabla medical_info
      CREATE TABLE IF NOT EXISTS public.medical_info (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          userId UUID NOT NULL,
          bloodType VARCHAR(10) NOT NULL,
          allergies JSONB DEFAULT '[]'::jsonb,
          medications JSONB DEFAULT '[]'::jsonb,
          conditions JSONB DEFAULT '[]'::jsonb,
          emergencyContact VARCHAR(255) NOT NULL,
          weight VARCHAR(50) NOT NULL,
          height VARCHAR(50) NOT NULL,
          insuranceNumber VARCHAR(100) NOT NULL,
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear índices para mejorar el rendimiento
      CREATE INDEX IF NOT EXISTS idx_medical_info_user_id ON public.medical_info(userId);
      CREATE INDEX IF NOT EXISTS idx_medical_info_created_at ON public.medical_info(createdAt);

      -- Habilitar RLS (Row Level Security)
      ALTER TABLE public.medical_info ENABLE ROW LEVEL SECURITY;

      -- Crear política para que los usuarios solo puedan ver/editar su propia información médica
      CREATE POLICY "Users can view own medical info" ON public.medical_info
          FOR SELECT USING (auth.uid()::text = userId::text);

      CREATE POLICY "Users can insert own medical info" ON public.medical_info
          FOR INSERT WITH CHECK (auth.uid()::text = userId::text);

      CREATE POLICY "Users can update own medical info" ON public.medical_info
          FOR UPDATE USING (auth.uid()::text = userId::text);

      CREATE POLICY "Users can delete own medical info" ON public.medical_info
          FOR DELETE USING (auth.uid()::text = userId::text);
    `

    console.log('📝 SQL para crear la tabla:')
    console.log(createTableSQL)
    console.log('\n📋 Instrucciones para crear la tabla:')
    console.log('1. Ve a tu dashboard de Supabase')
    console.log('2. Ve a la sección "SQL Editor"')
    console.log('3. Copia y pega el SQL de arriba')
    console.log('4. Ejecuta el SQL')
    console.log('5. Verifica que la tabla se creó correctamente')
    console.log('\n🔄 Después de crear la tabla, ejecuta:')
    console.log('   node scripts/test-medical-info.js')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createMedicalInfoTable() 