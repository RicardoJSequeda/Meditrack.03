const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Datos de usuarios de ejemplo
const users = [
  {
    name: "María González López",
    email: "maria.gonzalez@email.com",
    password: "password123",
    phone: "+34 612 345 678",
    address: "Calle Mayor 123, Madrid, España",
    bloodType: "O+",
    emergencyContact: "Juan González - +34 698 765 432",
    dateOfBirth: "1985-03-15",
    gender: "Femenino"
  },
  {
    name: "Carlos Rodríguez Martín",
    email: "carlos.rodriguez@email.com",
    password: "password123",
    phone: "+34 623 456 789",
    address: "Avenida de la Paz 45, Barcelona, España",
    bloodType: "A+",
    emergencyContact: "Ana Rodríguez - +34 687 654 321",
    dateOfBirth: "1990-07-22",
    gender: "Masculino"
  },
  {
    name: "Ana Martínez Sánchez",
    email: "ana.martinez@email.com",
    password: "password123",
    phone: "+34 634 567 890",
    address: "Plaza España 67, Valencia, España",
    bloodType: "B+",
    emergencyContact: "Pedro Martínez - +34 676 543 210",
    dateOfBirth: "1988-11-08",
    gender: "Femenino"
  }
]

// Datos de diagnósticos de ejemplo
const diagnoses = [
  {
    condition: "Hipertensión Arterial",
    description: "Presión arterial elevada que requiere monitoreo constante",
    severity: "MODERADA",
    date: "2024-01-15",
    doctor: "Dr. García Martínez",
    hospital: "Hospital General de Madrid",
    status: "CONTROLADA"
  },
  {
    condition: "Diabetes Tipo 2",
    description: "Trastorno metabólico que afecta la regulación del azúcar en sangre",
    severity: "MODERADA",
    date: "2023-11-20",
    doctor: "Dra. López Fernández",
    hospital: "Clínica Endocrinológica",
    status: "ACTIVA"
  },
  {
    condition: "Artritis Reumatoide",
    description: "Enfermedad autoinmune que afecta las articulaciones",
    severity: "LEVE",
    date: "2024-02-10",
    doctor: "Dr. Ruiz Moreno",
    hospital: "Centro de Reumatología",
    status: "CONTROLADA"
  }
]

// Datos de tratamientos de ejemplo
const treatments = [
  {
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "1 vez al día",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    adherence: 95,
    status: "ACTIVO",
    sideEffects: "Tos seca ocasional",
    doctorNotes: "Tomar en ayunas",
    prescribedBy: "Dr. García Martínez"
  },
  {
    medication: "Metformina",
    dosage: "500mg",
    frequency: "2 veces al día",
    startDate: "2023-11-20",
    endDate: null,
    adherence: 90,
    status: "ACTIVO",
    sideEffects: "Náuseas leves al inicio",
    doctorNotes: "Tomar con las comidas",
    prescribedBy: "Dra. López Fernández"
  },
  {
    medication: "Ibuprofeno",
    dosage: "400mg",
    frequency: "Según necesidad",
    startDate: "2024-02-10",
    endDate: null,
    adherence: 80,
    status: "ACTIVO",
    sideEffects: "Molestias estomacales",
    doctorNotes: "Tomar con alimentos",
    prescribedBy: "Dr. Ruiz Moreno"
  }
]

async function seedSupabase() {
  console.log('🌱 Iniciando seeding de Supabase...')

  try {
    // Crear usuarios
    console.log('👥 Creando usuarios...')
    const createdUsers = []
    
    for (const userData of users) {
      try {
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
            bloodType: userData.bloodType,
            emergencyContact: userData.emergencyContact,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender
          }
        })

        if (authError) {
          console.error(`❌ Error creando usuario ${userData.email}:`, authError.message)
          continue
        }

        // Crear usuario en la tabla users
        const { data: user, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
            bloodType: userData.bloodType,
            emergencyContact: userData.emergencyContact,
            dateOfBirth: new Date(userData.dateOfBirth),
            gender: userData.gender
          })
          .select()
          .single()

        if (userError) {
          console.error(`❌ Error insertando usuario ${userData.email}:`, userError.message)
          // Eliminar usuario de auth si falla la inserción
          await supabase.auth.admin.deleteUser(authData.user.id)
          continue
        }

        createdUsers.push(user)
        console.log(`✅ Usuario creado: ${user.name}`)
      } catch (error) {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message)
      }
    }

    // Crear diagnósticos para cada usuario
    console.log('🏥 Creando diagnósticos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)]
        try {
          const { error } = await supabase
            .from('diagnoses')
            .insert({
              userId: user.id,
              condition: diagnosis.condition,
              diagnosedDate: new Date(diagnosis.date),
              doctor: diagnosis.doctor,
              specialty: "Medicina General",
              severity: diagnosis.severity,
              status: diagnosis.status,
              notes: diagnosis.description
            })

          if (error) {
            console.error(`❌ Error creando diagnóstico para ${user.name}:`, error.message)
          } else {
            console.log(`✅ Diagnóstico creado para: ${user.name}`)
          }
        } catch (error) {
          console.error(`❌ Error creando diagnóstico para ${user.name}:`, error.message)
        }
      }
    }

    // Crear tratamientos para cada usuario
    console.log('💊 Creando tratamientos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const treatment = treatments[Math.floor(Math.random() * treatments.length)]
        try {
          const { error } = await supabase
            .from('treatments')
            .insert({
              userId: user.id,
              medication: treatment.medication,
              dosage: treatment.dosage,
              frequency: treatment.frequency,
              startDate: new Date(treatment.startDate),
              endDate: treatment.endDate ? new Date(treatment.endDate) : null,
              adherence: treatment.adherence,
              status: treatment.status,
              sideEffects: treatment.sideEffects,
              doctorNotes: treatment.doctorNotes,
              prescribedBy: treatment.prescribedBy
            })

          if (error) {
            console.error(`❌ Error creando tratamiento para ${user.name}:`, error.message)
          } else {
            console.log(`✅ Tratamiento creado para: ${user.name}`)
          }
        } catch (error) {
          console.error(`❌ Error creando tratamiento para ${user.name}:`, error.message)
        }
      }
    }

    // Crear citas de ejemplo
    console.log('📅 Creando citas...')
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 7)
        
        try {
          const { error } = await supabase
            .from('appointments')
            .insert({
              userId: user.id,
              title: `Consulta de seguimiento ${i + 1}`,
              date: futureDate,
              duration: 30,
              doctor: "Dr. García Martínez",
              specialty: "Medicina General",
              location: "Hospital General de Madrid",
              status: "SCHEDULED",
              notes: "Revisión de rutina"
            })

          if (error) {
            console.error(`❌ Error creando cita para ${user.name}:`, error.message)
          } else {
            console.log(`✅ Cita creada para: ${user.name}`)
          }
        } catch (error) {
          console.error(`❌ Error creando cita para ${user.name}:`, error.message)
        }
      }
    }

    // Crear recordatorios de ejemplo
    console.log('⏰ Creando recordatorios...')
    for (const user of createdUsers) {
      for (let i = 0; i < 5; i++) {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14) + 1)
        
        try {
          const { error } = await supabase
            .from('reminders')
            .insert({
              userId: user.id,
              title: `Recordatorio ${i + 1}`,
              description: "Recordatorio importante",
              date: futureDate,
              type: "MEDICATION",
              isCompleted: false
            })

          if (error) {
            console.error(`❌ Error creando recordatorio para ${user.name}:`, error.message)
          } else {
            console.log(`✅ Recordatorio creado para: ${user.name}`)
          }
        } catch (error) {
          console.error(`❌ Error creando recordatorio para ${user.name}:`, error.message)
        }
      }
    }

    // Crear notas médicas de ejemplo
    console.log('📝 Creando notas médicas...')
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        try {
          const { error } = await supabase
            .from('medical_notes')
            .insert({
              userId: user.id,
              title: `Nota médica ${i + 1}`,
              content: "Contenido de la nota médica de ejemplo",
              category: "General",
              isPinned: i === 0,
              isFavorite: false,
              isArchived: false
            })

          if (error) {
            console.error(`❌ Error creando nota para ${user.name}:`, error.message)
          } else {
            console.log(`✅ Nota creada para: ${user.name}`)
          }
        } catch (error) {
          console.error(`❌ Error creando nota para ${user.name}:`, error.message)
        }
      }
    }

    console.log('🎉 ¡Seeding completado!')
    console.log('📋 Resumen:')
    console.log(`   - Usuarios creados: ${createdUsers.length}`)
    console.log(`   - Diagnósticos: ${createdUsers.length * 2}`)
    console.log(`   - Tratamientos: ${createdUsers.length * 2}`)
    console.log(`   - Citas: ${createdUsers.length * 3}`)
    console.log(`   - Recordatorios: ${createdUsers.length * 5}`)
    console.log(`   - Notas: ${createdUsers.length * 3}`)

  } catch (error) {
    console.error('❌ Error durante el seeding:', error)
  }
}

// Ejecutar seeding
seedSupabase() 