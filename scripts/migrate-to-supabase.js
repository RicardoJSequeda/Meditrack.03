const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configurar Prisma para MySQL (datos existentes)
const prismaMySQL = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL
    }
  }
})

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateData() {
  console.log('🚀 Iniciando migración de MySQL a Supabase...')
  
  try {
    // 1. Migrar usuarios
    console.log('👥 Migrando usuarios...')
    const users = await prismaMySQL.user.findMany()
    
    for (const user of users) {
      try {
        // Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'temporary-password-123', // El usuario deberá cambiar su contraseña
          email_confirm: true,
          user_metadata: {
            name: user.name,
            phone: user.phone,
            address: user.address,
            bloodType: user.bloodType,
            emergencyContact: user.emergencyContact,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender
          }
        })

        if (authError) {
          console.error(`❌ Error creando usuario ${user.email}:`, authError.message)
          continue
        }

        // Crear usuario en la tabla users
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: user.email,
            password: user.password, // Mantener el hash existente
            name: user.name,
            phone: user.phone,
            address: user.address,
            bloodType: user.bloodType,
            emergencyContact: user.emergencyContact,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          })

        if (userError) {
          console.error(`❌ Error insertando usuario ${user.email}:`, userError.message)
          // Eliminar usuario de auth si falla la inserción en la tabla
          await supabase.auth.admin.deleteUser(authData.user.id)
          continue
        }

        console.log(`✅ Usuario migrado: ${user.email}`)
      } catch (error) {
        console.error(`❌ Error migrando usuario ${user.email}:`, error.message)
      }
    }

    // 2. Migrar diagnósticos
    console.log('🏥 Migrando diagnósticos...')
    const diagnoses = await prismaMySQL.diagnosis.findMany()
    
    for (const diagnosis of diagnoses) {
      try {
        const { error } = await supabase
          .from('diagnoses')
          .insert({
            id: diagnosis.id,
            condition: diagnosis.condition,
            diagnosedDate: diagnosis.diagnosedDate,
            doctor: diagnosis.doctor,
            specialty: diagnosis.specialty,
            severity: diagnosis.severity,
            status: diagnosis.status,
            lastReading: diagnosis.lastReading,
            nextCheckup: diagnosis.nextCheckup,
            notes: diagnosis.notes,
            userId: diagnosis.userId,
            createdAt: diagnosis.createdAt,
            updatedAt: diagnosis.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando diagnóstico ${diagnosis.id}:`, error.message)
        } else {
          console.log(`✅ Diagnóstico migrado: ${diagnosis.condition}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando diagnóstico ${diagnosis.id}:`, error.message)
      }
    }

    // 3. Migrar tratamientos
    console.log('💊 Migrando tratamientos...')
    const treatments = await prismaMySQL.treatment.findMany()
    
    for (const treatment of treatments) {
      try {
        const { error } = await supabase
          .from('treatments')
          .insert({
            id: treatment.id,
            medication: treatment.medication,
            dosage: treatment.dosage,
            frequency: treatment.frequency,
            startDate: treatment.startDate,
            endDate: treatment.endDate,
            adherence: treatment.adherence,
            status: treatment.status,
            sideEffects: treatment.sideEffects,
            doctorNotes: treatment.doctorNotes,
            prescribedBy: treatment.prescribedBy,
            diagnosisId: treatment.diagnosisId,
            userId: treatment.userId,
            createdAt: treatment.createdAt,
            updatedAt: treatment.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando tratamiento ${treatment.id}:`, error.message)
        } else {
          console.log(`✅ Tratamiento migrado: ${treatment.medication}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando tratamiento ${treatment.id}:`, error.message)
      }
    }

    // 4. Migrar eventos médicos
    console.log('📅 Migrando eventos médicos...')
    const medicalEvents = await prismaMySQL.medicalEvent.findMany()
    
    for (const event of medicalEvents) {
      try {
        const { error } = await supabase
          .from('medical_events')
          .insert({
            id: event.id,
            type: event.type,
            title: event.title,
            date: event.date,
            location: event.location,
            doctor: event.doctor,
            description: event.description,
            outcome: event.outcome,
            followUp: event.followUp,
            userId: event.userId,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando evento ${event.id}:`, error.message)
        } else {
          console.log(`✅ Evento migrado: ${event.title}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando evento ${event.id}:`, error.message)
      }
    }

    // 5. Migrar documentos médicos
    console.log('📄 Migrando documentos médicos...')
    const medicalDocuments = await prismaMySQL.medicalDocument.findMany()
    
    for (const document of medicalDocuments) {
      try {
        const { error } = await supabase
          .from('medical_documents')
          .insert({
            id: document.id,
            type: document.type,
            title: document.title,
            date: document.date,
            doctor: document.doctor,
            category: document.category,
            description: document.description,
            fileUrl: document.fileUrl,
            results: document.results,
            recommendations: document.recommendations,
            userId: document.userId,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando documento ${document.id}:`, error.message)
        } else {
          console.log(`✅ Documento migrado: ${document.title}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando documento ${document.id}:`, error.message)
      }
    }

    // 6. Migrar citas
    console.log('📋 Migrando citas...')
    const appointments = await prismaMySQL.appointment.findMany()
    
    for (const appointment of appointments) {
      try {
        const { error } = await supabase
          .from('appointments')
          .insert({
            id: appointment.id,
            title: appointment.title,
            date: appointment.date,
            duration: appointment.duration,
            doctor: appointment.doctor,
            specialty: appointment.specialty,
            location: appointment.location,
            notes: appointment.notes,
            status: appointment.status,
            userId: appointment.userId,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando cita ${appointment.id}:`, error.message)
        } else {
          console.log(`✅ Cita migrada: ${appointment.title}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando cita ${appointment.id}:`, error.message)
      }
    }

    // 7. Migrar recordatorios
    console.log('⏰ Migrando recordatorios...')
    const reminders = await prismaMySQL.reminder.findMany()
    
    for (const reminder of reminders) {
      try {
        const { error } = await supabase
          .from('reminders')
          .insert({
            id: reminder.id,
            title: reminder.title,
            description: reminder.description,
            date: reminder.date,
            type: reminder.type,
            isCompleted: reminder.isCompleted,
            userId: reminder.userId,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando recordatorio ${reminder.id}:`, error.message)
        } else {
          console.log(`✅ Recordatorio migrado: ${reminder.title}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando recordatorio ${reminder.id}:`, error.message)
      }
    }

    // 8. Migrar notas médicas
    console.log('📝 Migrando notas médicas...')
    const medicalNotes = await prismaMySQL.medicalNote.findMany()
    
    for (const note of medicalNotes) {
      try {
        const { error } = await supabase
          .from('medical_notes')
          .insert({
            id: note.id,
            title: note.title,
            content: note.content,
            category: note.category,
            userId: note.userId,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            isPinned: note.isPinned,
            isFavorite: note.isFavorite,
            isArchived: note.isArchived
          })

        if (error) {
          console.error(`❌ Error migrando nota ${note.id}:`, error.message)
        } else {
          console.log(`✅ Nota migrada: ${note.title}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando nota ${note.id}:`, error.message)
      }
    }

    // 9. Migrar eventos de emergencia
    console.log('🚨 Migrando eventos de emergencia...')
    const emergencyEvents = await prismaMySQL.emergencyEvent.findMany()
    
    for (const event of emergencyEvents) {
      try {
        const { error } = await supabase
          .from('emergency_events')
          .insert({
            id: event.id,
            userId: event.userId,
            isActive: event.isActive,
            startTime: event.startTime,
            duration: event.duration,
            location: event.location,
            contactsNotified: event.contactsNotified,
            medicalInfoSnapshot: event.medicalInfoSnapshot,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando evento de emergencia ${event.id}:`, error.message)
        } else {
          console.log(`✅ Evento de emergencia migrado: ${event.id}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando evento de emergencia ${event.id}:`, error.message)
      }
    }

    // 10. Migrar contactos de emergencia
    console.log('📞 Migrando contactos de emergencia...')
    const emergencyContacts = await prismaMySQL.emergencyContact.findMany()
    
    for (const contact of emergencyContacts) {
      try {
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            id: contact.id,
            userId: contact.userId,
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
            isPrimary: contact.isPrimary,
            isOnline: contact.isOnline,
            lastSeen: contact.lastSeen,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt
          })

        if (error) {
          console.error(`❌ Error migrando contacto ${contact.id}:`, error.message)
        } else {
          console.log(`✅ Contacto migrado: ${contact.name}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando contacto ${contact.id}:`, error.message)
      }
    }

    console.log('🎉 ¡Migración completada!')
    console.log('📋 Resumen:')
    console.log(`   - Usuarios: ${users.length}`)
    console.log(`   - Diagnósticos: ${diagnoses.length}`)
    console.log(`   - Tratamientos: ${treatments.length}`)
    console.log(`   - Eventos médicos: ${medicalEvents.length}`)
    console.log(`   - Documentos: ${medicalDocuments.length}`)
    console.log(`   - Citas: ${appointments.length}`)
    console.log(`   - Recordatorios: ${reminders.length}`)
    console.log(`   - Notas: ${medicalNotes.length}`)
    console.log(`   - Eventos de emergencia: ${emergencyEvents.length}`)
    console.log(`   - Contactos de emergencia: ${emergencyContacts.length}`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await prismaMySQL.$disconnect()
  }
}

// Ejecutar migración
migrateData() 