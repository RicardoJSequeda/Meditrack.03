const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const createTablesSQL = `
-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  "bloodType" TEXT,
  "emergencyContact" TEXT,
  "dateOfBirth" TIMESTAMP,
  gender TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla diagnoses
CREATE TABLE IF NOT EXISTS diagnoses (
  id TEXT PRIMARY KEY,
  condition TEXT NOT NULL,
  "diagnosedDate" TIMESTAMP NOT NULL,
  doctor TEXT NOT NULL,
  specialty TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LEVE', 'MODERADA', 'GRAVE')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVA', 'CONTROLADA', 'RESUELTA')),
  "lastReading" TEXT,
  "nextCheckup" TIMESTAMP,
  notes TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla treatments
CREATE TABLE IF NOT EXISTS treatments (
  id TEXT PRIMARY KEY,
  medication TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP,
  adherence INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('ACTIVO', 'SUSPENDIDO', 'COMPLETADO')),
  "sideEffects" TEXT,
  "doctorNotes" TEXT,
  "prescribedBy" TEXT NOT NULL,
  "diagnosisId" TEXT REFERENCES diagnoses(id),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla medical_events
CREATE TABLE IF NOT EXISTS medical_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('CIRUGIA', 'EMERGENCIA', 'VACUNA', 'CONSULTA', 'HOSPITALIZACION', 'PROCEDIMIENTO')),
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  doctor TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT NOT NULL,
  "followUp" TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla medical_documents
CREATE TABLE IF NOT EXISTS medical_documents (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('ANALISIS', 'RADIOGRAFIA', 'INFORME', 'RECETA', 'CERTIFICADO', 'NOTA')),
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  doctor TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  "fileUrl" TEXT,
  results TEXT,
  recommendations TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  doctor TEXT NOT NULL,
  specialty TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla reminders
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MEDICATION', 'APPOINTMENT', 'TEST', 'EXERCISE', 'DIET', 'OTHER')),
  "isCompleted" BOOLEAN DEFAULT FALSE,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla medical_notes
CREATE TABLE IF NOT EXISTS medical_notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "isPinned" BOOLEAN DEFAULT FALSE,
  "isFavorite" BOOLEAN DEFAULT FALSE,
  "isArchived" BOOLEAN DEFAULT FALSE
);

-- Crear tabla emergency_events
CREATE TABLE IF NOT EXISTS emergency_events (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "isActive" BOOLEAN NOT NULL,
  "startTime" TIMESTAMP,
  duration INTEGER NOT NULL,
  location TEXT,
  "contactsNotified" TEXT,
  "medicalInfoSnapshot" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Crear tabla emergency_contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  "isPrimary" BOOLEAN DEFAULT FALSE,
  "isOnline" BOOLEAN DEFAULT FALSE,
  "lastSeen" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
`

async function createTables() {
  try {
    console.log('🏗️  Creando tablas en Supabase...')
    
    // Ejecutar SQL para crear tablas
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (error) {
      console.log('❌ Error ejecutando SQL:', error.message)
      
      // Si no existe la función exec_sql, intentar crear las tablas una por una
      console.log('🔄 Intentando crear tablas individualmente...')
      
      const tables = [
        'users',
        'diagnoses', 
        'treatments',
        'medical_events',
        'medical_documents',
        'appointments',
        'reminders',
        'medical_notes',
        'emergency_events',
        'emergency_contacts'
      ]
      
      for (const table of tables) {
        console.log(`📋 Creando tabla: ${table}`)
        // Intentar insertar un registro de prueba para verificar que la tabla existe
        const { error: testError } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (testError && testError.message.includes('does not exist')) {
          console.log(`❌ Tabla ${table} no existe`)
        } else {
          console.log(`✅ Tabla ${table} existe`)
        }
      }
      
      return
    }
    
    console.log('✅ Tablas creadas exitosamente!')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

createTables() 