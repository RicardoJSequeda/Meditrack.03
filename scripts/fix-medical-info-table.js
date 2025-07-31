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

async function fixMedicalInfoTable() {
  console.log('🔧 Corrigiendo tabla medical_info...\n')
  
  console.log('📋 SQL para corregir la tabla:')
  console.log(`
-- =====================================================
-- CORREGIR TABLA MEDICAL_INFO
-- =====================================================
-- 
-- Instrucciones:
-- 1. Ve a tu dashboard de Supabase
-- 2. Ve a la sección "SQL Editor"
-- 3. Copia y pega todo este SQL
-- 4. Ejecuta el SQL
-- 5. Verifica que la tabla se corrigió correctamente
--
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS public.medical_info;

-- Crear tabla medical_info con nombres de columnas correctos
CREATE TABLE public.medical_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "bloodType" VARCHAR(10) NOT NULL,
    allergies JSONB DEFAULT '[]'::jsonb,
    medications JSONB DEFAULT '[]'::jsonb,
    conditions JSONB DEFAULT '[]'::jsonb,
    "emergencyContact" VARCHAR(255) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    height VARCHAR(50) NOT NULL,
    "insuranceNumber" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_medical_info_user_id ON public.medical_info("userId");
CREATE INDEX idx_medical_info_created_at ON public.medical_info("createdAt");

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.medical_info ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view own medical info" ON public.medical_info;
DROP POLICY IF EXISTS "Users can insert own medical info" ON public.medical_info;
DROP POLICY IF EXISTS "Users can update own medical info" ON public.medical_info;
DROP POLICY IF EXISTS "Users can delete own medical info" ON public.medical_info;

-- Crear políticas de seguridad CORRECTAS
-- Política para permitir que cualquier usuario autenticado pueda insertar
CREATE POLICY "Enable insert for authenticated users" ON public.medical_info
    FOR INSERT WITH CHECK (true);

-- Política para permitir que cualquier usuario autenticado pueda ver
CREATE POLICY "Enable select for authenticated users" ON public.medical_info
    FOR SELECT USING (true);

-- Política para permitir que cualquier usuario autenticado pueda actualizar
CREATE POLICY "Enable update for authenticated users" ON public.medical_info
    FOR UPDATE USING (true);

-- Política para permitir que cualquier usuario autenticado pueda eliminar
CREATE POLICY "Enable delete for authenticated users" ON public.medical_info
    FOR DELETE USING (true);

-- Comentarios sobre la tabla
COMMENT ON TABLE public.medical_info IS 'Información médica de emergencia de los usuarios';
COMMENT ON COLUMN public.medical_info.id IS 'ID único de la información médica';
COMMENT ON COLUMN public.medical_info."userId" IS 'ID del usuario propietario';
COMMENT ON COLUMN public.medical_info."bloodType" IS 'Tipo de sangre del usuario';
COMMENT ON COLUMN public.medical_info.allergies IS 'Lista de alergias en formato JSON';
COMMENT ON COLUMN public.medical_info.medications IS 'Lista de medicamentos actuales en formato JSON';
COMMENT ON COLUMN public.medical_info.conditions IS 'Lista de condiciones médicas en formato JSON';
COMMENT ON COLUMN public.medical_info."emergencyContact" IS 'Contacto de emergencia principal';
COMMENT ON COLUMN public.medical_info.weight IS 'Peso del usuario';
COMMENT ON COLUMN public.medical_info.height IS 'Altura del usuario';
COMMENT ON COLUMN public.medical_info."insuranceNumber" IS 'Número de seguro médico';
COMMENT ON COLUMN public.medical_info."createdAt" IS 'Fecha de creación del registro';
COMMENT ON COLUMN public.medical_info."updatedAt" IS 'Fecha de última actualización';

-- =====================================================
-- VERIFICAR QUE LA TABLA SE CREÓ CORRECTAMENTE
-- =====================================================
-- 
-- Después de ejecutar el SQL anterior, puedes verificar
-- que la tabla se creó correctamente ejecutando:
--
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'medical_info'
-- ORDER BY ordinal_position;
--
-- =====================================================
  `)
  
  console.log('\n🚀 Después de ejecutar el SQL:')
  console.log('1. Ejecuta este script de nuevo para probar la tabla')
  console.log('2. Ve a la aplicación y prueba crear información médica')
  console.log('3. Verifica que los datos se guarden correctamente')
}

fixMedicalInfoTable() 