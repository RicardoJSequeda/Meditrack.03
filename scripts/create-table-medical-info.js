console.log('🔧 CREAR TABLA MEDICAL_INFO EN SUPABASE')
console.log('==========================================')
console.log('')
console.log('📋 Instrucciones:')
console.log('1. Ve a tu dashboard de Supabase')
console.log('2. Ve a la sección "SQL Editor"')
console.log('3. Copia y pega el SQL de abajo')
console.log('4. Ejecuta el SQL')
console.log('5. Verifica que la tabla se creó correctamente')
console.log('')
console.log('📝 SQL para ejecutar en Supabase:')
console.log('==========================================')

const sql = `
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

console.log(sql)
console.log('')
console.log('==========================================')
console.log('✅ Después de ejecutar el SQL:')
console.log('1. Ejecuta: node scripts/test-medical-info.js')
console.log('2. Actualiza el token en el navegador')
console.log('3. Prueba la funcionalidad en la interfaz')
console.log('')
console.log('🔄 Para verificar que la tabla se creó:')
console.log('SELECT * FROM information_schema.tables WHERE table_name = \'medical_info\';') 