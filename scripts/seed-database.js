const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Datos de usuarios
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
  },
  {
    name: "Luis Fernández García",
    email: "luis.fernandez@email.com",
    password: "password123",
    phone: "+34 645 678 901",
    address: "Calle Real 89, Sevilla, España",
    bloodType: "AB+",
    emergencyContact: "Carmen Fernández - +34 665 432 109",
    dateOfBirth: "1992-04-12",
    gender: "Masculino"
  },
  {
    name: "Isabel Torres Ruiz",
    email: "isabel.torres@email.com",
    password: "password123",
    phone: "+34 656 789 012",
    address: "Gran Vía 234, Bilbao, España",
    bloodType: "O-",
    emergencyContact: "Miguel Torres - +34 654 321 098",
    dateOfBirth: "1987-09-30",
    gender: "Femenino"
  }
]

// Datos de diagnósticos
const diagnoses = [
  {
    condition: "Hipertensión arterial",
    description: "Presión arterial elevada de forma crónica",
    severity: "Moderada",
    date: "2024-01-15",
    doctor: "Dr. García López",
    hospital: "Hospital General de Madrid",
    status: "Activo"
  },
  {
    condition: "Diabetes tipo 2",
    description: "Alteración del metabolismo de la glucosa",
    severity: "Leve",
    date: "2024-02-20",
    doctor: "Dra. Martínez Sánchez",
    hospital: "Clínica Universitaria",
    status: "Activo"
  },
  {
    condition: "Artritis reumatoide",
    description: "Enfermedad inflamatoria crónica de las articulaciones",
    severity: "Moderada",
    date: "2023-11-10",
    doctor: "Dr. Rodríguez Martín",
    hospital: "Hospital de Reumatología",
    status: "Activo"
  },
  {
    condition: "Asma bronquial",
    description: "Enfermedad inflamatoria crónica de las vías respiratorias",
    severity: "Leve",
    date: "2024-03-05",
    doctor: "Dra. Fernández García",
    hospital: "Centro de Neumología",
    status: "Activo"
  },
  {
    condition: "Depresión mayor",
    description: "Trastorno del estado de ánimo",
    severity: "Moderada",
    date: "2024-01-30",
    doctor: "Dr. López Torres",
    hospital: "Instituto de Psiquiatría",
    status: "En remisión"
  },
  {
    condition: "Migraña crónica",
    description: "Dolores de cabeza intensos y recurrentes",
    severity: "Leve",
    date: "2023-12-15",
    doctor: "Dra. Ruiz González",
    hospital: "Clínica Neurológica",
    status: "Activo"
  },
  {
    condition: "Osteoporosis",
    description: "Pérdida de densidad ósea",
    severity: "Moderada",
    date: "2024-02-10",
    doctor: "Dr. Sánchez Martínez",
    hospital: "Centro de Endocrinología",
    status: "Activo"
  },
  {
    condition: "Insomnio crónico",
    description: "Dificultad persistente para conciliar el sueño",
    severity: "Leve",
    date: "2024-03-20",
    doctor: "Dra. Torres Ruiz",
    hospital: "Unidad del Sueño",
    status: "Activo"
  }
]

// Datos de tratamientos
const treatments = [
  {
    name: "Metformina 500mg",
    type: "Medicamento",
    dosage: "1 comprimido cada 8 horas",
    frequency: "3 veces al día",
    startDate: "2024-02-20",
    endDate: "2025-02-20",
    doctor: "Dra. Martínez Sánchez",
    notes: "Tomar con las comidas para evitar efectos secundarios gastrointestinales"
  },
  {
    name: "Enalapril 10mg",
    type: "Medicamento",
    dosage: "1 comprimido diario",
    frequency: "1 vez al día",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    doctor: "Dr. García López",
    notes: "Controlar presión arterial semanalmente"
  },
  {
    name: "Fisioterapia articular",
    type: "Terapia física",
    dosage: "Sesión de 45 minutos",
    frequency: "2 veces por semana",
    startDate: "2023-11-10",
    endDate: "2024-05-10",
    doctor: "Dr. Rodríguez Martín",
    notes: "Ejercicios de movilidad y fortalecimiento muscular"
  },
  {
    name: "Salbutamol inhalador",
    type: "Medicamento",
    dosage: "2 inhalaciones",
    frequency: "Según necesidad",
    startDate: "2024-03-05",
    endDate: "2025-03-05",
    doctor: "Dra. Fernández García",
    notes: "Usar antes del ejercicio físico y en caso de crisis"
  },
  {
    name: "Sertralina 50mg",
    type: "Medicamento",
    dosage: "1 comprimido diario",
    frequency: "1 vez al día",
    startDate: "2024-01-30",
    endDate: "2024-07-30",
    doctor: "Dr. López Torres",
    notes: "Tomar por la mañana, puede causar somnolencia inicial"
  },
  {
    name: "Sumatriptán 50mg",
    type: "Medicamento",
    dosage: "1 comprimido",
    frequency: "Al inicio del dolor de cabeza",
    startDate: "2023-12-15",
    endDate: "2024-12-15",
    doctor: "Dra. Ruiz González",
    notes: "Máximo 2 comprimidos por día, no usar más de 10 días al mes"
  },
  {
    name: "Calcio + Vitamina D",
    type: "Suplemento",
    dosage: "1 comprimido diario",
    frequency: "1 vez al día",
    startDate: "2024-02-10",
    endDate: "2025-02-10",
    doctor: "Dr. Sánchez Martínez",
    notes: "Tomar con las comidas para mejor absorción"
  },
  {
    name: "Melatonina 3mg",
    type: "Suplemento",
    dosage: "1 comprimido",
    frequency: "30 minutos antes de dormir",
    startDate: "2024-03-20",
    endDate: "2024-09-20",
    doctor: "Dra. Torres Ruiz",
    notes: "Ayuda a regular el ciclo del sueño"
  }
]

// Datos de eventos médicos
const medicalEvents = [
  {
    type: "Consulta médica",
    title: "Revisión anual",
    description: "Control rutinario de salud general",
    date: "2024-03-15",
    location: "Centro de Salud Madrid Norte",
    doctor: "Dr. García López",
    notes: "Presión arterial normal, peso estable, análisis de sangre pendientes"
  },
  {
    type: "Análisis de sangre",
    title: "Hemograma completo",
    description: "Análisis de glóbulos rojos, blancos y plaquetas",
    date: "2024-03-10",
    location: "Laboratorio Central",
    doctor: "Dra. Martínez Sánchez",
    notes: "Resultados normales, colesterol ligeramente elevado"
  },
  {
    type: "Radiografía",
    title: "Radiografía de tórax",
    description: "Exploración radiológica del tórax",
    date: "2024-02-28",
    location: "Servicio de Radiología",
    doctor: "Dr. Rodríguez Martín",
    notes: "Sin hallazgos patológicos, campos pulmonares libres"
  },
  {
    type: "Vacunación",
    title: "Vacuna de la gripe",
    description: "Vacunación anual contra la influenza",
    date: "2024-10-15",
    location: "Centro de Vacunación",
    doctor: "Dra. Fernández García",
    notes: "Sin reacciones adversas, próxima dosis en octubre 2025"
  },
  {
    type: "Cirugía menor",
    title: "Extracción de lunar",
    description: "Extirpación de lunar sospechoso en brazo derecho",
    date: "2024-01-20",
    location: "Quirófano menor",
    doctor: "Dr. López Torres",
    notes: "Procedimiento exitoso, sutura absorbible, revisión en 7 días"
  },
  {
    type: "Fisioterapia",
    title: "Sesión de rehabilitación",
    description: "Terapia física para dolor lumbar",
    date: "2024-03-18",
    location: "Centro de Fisioterapia",
    doctor: "Dr. Sánchez Martínez",
    notes: "Mejora en la movilidad, continuar ejercicios en casa"
  },
  {
    type: "Consulta especializada",
    title: "Consulta cardiología",
    description: "Evaluación cardiológica por palpitaciones",
    date: "2024-02-15",
    location: "Servicio de Cardiología",
    doctor: "Dra. Ruiz González",
    notes: "ECG normal, ecocardiograma programado para próxima semana"
  },
  {
    type: "Prueba de esfuerzo",
    title: "Test de esfuerzo cardíaco",
    description: "Evaluación de la función cardíaca durante ejercicio",
    date: "2024-02-22",
    location: "Unidad de Cardiología",
    doctor: "Dr. Torres Ruiz",
    notes: "Resultados normales, capacidad funcional buena"
  }
]

// Datos de documentos médicos
const medicalDocuments = [
  {
    type: "Informe médico",
    title: "Informe de alta hospitalaria",
    description: "Documento de alta tras ingreso por neumonía",
    date: "2024-02-10",
    doctor: "Dr. García López",
    hospital: "Hospital General de Madrid",
    notes: "Tratamiento completado, seguimiento ambulatorio"
  },
  {
    type: "Análisis",
    title: "Análisis de sangre completo",
    description: "Resultados de hemograma, bioquímica y hormonas",
    date: "2024-03-10",
    doctor: "Dra. Martínez Sánchez",
    hospital: "Laboratorio Central",
    notes: "Valores dentro de la normalidad, control en 6 meses"
  },
  {
    type: "Radiografía",
    title: "Radiografía de rodilla",
    description: "Exploración radiológica de rodilla derecha",
    date: "2024-01-25",
    doctor: "Dr. Rodríguez Martín",
    hospital: "Servicio de Radiología",
    notes: "Sin fracturas, ligera artrosis, tratamiento conservador"
  },
  {
    type: "Ecografía",
    title: "Ecografía abdominal",
    description: "Exploración ecográfica del abdomen",
    date: "2024-02-28",
    doctor: "Dra. Fernández García",
    hospital: "Servicio de Diagnóstico por Imagen",
    notes: "Órganos abdominales normales, sin hallazgos patológicos"
  },
  {
    type: "Informe quirúrgico",
    title: "Informe de cirugía de apendicitis",
    description: "Documentación de apendicectomía laparoscópica",
    date: "2023-12-15",
    doctor: "Dr. López Torres",
    hospital: "Hospital Quirúrgico",
    notes: "Procedimiento exitoso, recuperación normal"
  },
  {
    type: "Certificado médico",
    title: "Certificado de aptitud física",
    description: "Certificado para práctica deportiva",
    date: "2024-01-10",
    doctor: "Dr. Sánchez Martínez",
    hospital: "Centro Médico Deportivo",
    notes: "Apto para deporte de competición, revisión anual"
  },
  {
    type: "Historia clínica",
    title: "Resumen de historia clínica",
    description: "Resumen de antecedentes médicos",
    date: "2024-03-01",
    doctor: "Dra. Ruiz González",
    hospital: "Centro de Salud",
    notes: "Historia clínica completa disponible en sistema"
  },
  {
    type: "Receta médica",
    title: "Receta de medicamentos",
    description: "Prescripción de tratamiento farmacológico",
    date: "2024-03-15",
    doctor: "Dr. Torres Ruiz",
    hospital: "Centro de Salud",
    notes: "Medicación para 3 meses, revisión en consulta"
  }
]

// Datos de citas
const appointments = [
  {
    title: "Consulta cardiología",
    type: "Consulta médica",
    date: "2024-04-15",
    time: "10:00",
    doctor: "Dr. García López",
    location: "Hospital General de Madrid",
    notes: "Revisión de presión arterial y ajuste de medicación",
    status: "Programada"
  },
  {
    title: "Análisis de sangre",
    type: "Prueba diagnóstica",
    date: "2024-04-20",
    time: "08:30",
    doctor: "Dra. Martínez Sánchez",
    location: "Laboratorio Central",
    notes: "Hemograma completo y perfil lipídico en ayunas",
    status: "Programada"
  },
  {
    title: "Fisioterapia",
    type: "Terapia física",
    date: "2024-04-12",
    time: "16:00",
    doctor: "Dr. Rodríguez Martín",
    location: "Centro de Fisioterapia",
    notes: "Sesión de rehabilitación para dolor lumbar",
    status: "Completada"
  },
  {
    title: "Radiografía de tórax",
    type: "Prueba diagnóstica",
    date: "2024-04-18",
    time: "11:15",
    doctor: "Dra. Fernández García",
    location: "Servicio de Radiología",
    notes: "Control radiológico anual",
    status: "Programada"
  },
  {
    title: "Consulta endocrinología",
    type: "Consulta médica",
    date: "2024-04-25",
    time: "09:30",
    doctor: "Dr. López Torres",
    location: "Centro de Endocrinología",
    notes: "Control de diabetes y ajuste de insulina",
    status: "Programada"
  },
  {
    title: "Vacuna de la gripe",
    type: "Vacunación",
    date: "2024-10-15",
    time: "14:00",
    doctor: "Dra. Ruiz González",
    location: "Centro de Vacunación",
    notes: "Vacunación anual contra la influenza",
    status: "Programada"
  },
  {
    title: "Consulta psiquiatría",
    type: "Consulta médica",
    date: "2024-04-30",
    time: "17:00",
    doctor: "Dr. Sánchez Martínez",
    location: "Instituto de Psiquiatría",
    notes: "Seguimiento de tratamiento antidepresivo",
    status: "Programada"
  },
  {
    title: "Ecografía abdominal",
    type: "Prueba diagnóstica",
    date: "2024-05-05",
    time: "10:45",
    doctor: "Dr. Torres Ruiz",
    location: "Servicio de Diagnóstico por Imagen",
    notes: "Control ecográfico anual",
    status: "Programada"
  }
]

// Datos de recordatorios
const reminders = [
  {
    title: "Tomar Metformina",
    type: "Medicamento",
    date: "2024-04-15",
    time: "08:00",
    frequency: "Diario",
    notes: "Tomar con el desayuno",
    status: "Activo"
  },
  {
    title: "Medir presión arterial",
    type: "Control",
    date: "2024-04-16",
    time: "09:00",
    frequency: "Semanal",
    notes: "Registrar valores en la aplicación",
    status: "Activo"
  },
  {
    title: "Ejercicios de fisioterapia",
    type: "Terapia",
    date: "2024-04-15",
    time: "18:00",
    frequency: "Diario",
    notes: "Serie de ejercicios para rodilla",
    status: "Activo"
  },
  {
    title: "Revisar inhalador",
    type: "Medicamento",
    date: "2024-04-20",
    time: "12:00",
    frequency: "Mensual",
    notes: "Verificar que no esté vacío",
    status: "Activo"
  },
  {
    title: "Cita con cardiólogo",
    type: "Cita médica",
    date: "2024-04-15",
    time: "09:30",
    frequency: "Única",
    notes: "Llevar resultados de análisis",
    status: "Activo"
  },
  {
    title: "Renovar receta",
    type: "Medicamento",
    date: "2024-04-25",
    time: "10:00",
    frequency: "Mensual",
    notes: "Solicitar nueva receta de Enalapril",
    status: "Activo"
  },
  {
    title: "Análisis de sangre",
    type: "Prueba médica",
    date: "2024-04-20",
    time: "08:00",
    frequency: "Única",
    notes: "Acudir en ayunas",
    status: "Activo"
  },
  {
    title: "Ejercicio físico",
    type: "Actividad",
    date: "2024-04-15",
    time: "19:00",
    frequency: "Diario",
    notes: "Caminar 30 minutos",
    status: "Activo"
  }
]

// Datos de notas médicas
const medicalNotes = [
  {
    title: "Síntomas de gripe",
    content: "Fiebre de 38.5°C, dolor de garganta, congestión nasal. Tomando paracetamol cada 6 horas. Mejorando gradualmente.",
    category: "Síntomas",
    date: "2024-03-20",
    tags: ["gripe", "fiebre", "congestión"]
  },
  {
    title: "Reacción alérgica",
    content: "Erupción cutánea en brazos tras tomar nuevo medicamento. Suspender medicación y consultar con médico.",
    category: "Alergias",
    date: "2024-03-15",
    tags: ["alergia", "erupción", "medicamento"]
  },
  {
    title: "Mejora en diabetes",
    content: "Glucosa en ayunas: 95 mg/dL (normal). Hemoglobina glicosilada: 6.2% (mejorando). Continuar con dieta y ejercicio.",
    category: "Control",
    date: "2024-03-10",
    tags: ["diabetes", "glucosa", "control"]
  },
  {
    title: "Dolor lumbar",
    content: "Dolor intenso en zona lumbar tras levantar peso. Aplicando hielo y tomando antiinflamatorios. Mejorar postura.",
    category: "Síntomas",
    date: "2024-03-05",
    tags: ["dolor", "lumbar", "postura"]
  },
  {
    title: "Consulta nutricionista",
    content: "Recomendaciones: reducir sal, aumentar fibra, controlar porciones. Plan de alimentación personalizado entregado.",
    category: "Nutrición",
    date: "2024-02-28",
    tags: ["nutrición", "dieta", "salud"]
  },
  {
    title: "Problemas de sueño",
    content: "Dificultad para conciliar el sueño, despertar frecuente. Probando técnicas de relajación y horario regular.",
    category: "Síntomas",
    date: "2024-02-25",
    tags: ["sueño", "insomnio", "relajación"]
  },
  {
    title: "Ejercicio físico",
    content: "Caminata diaria de 30 minutos. Mejora en resistencia y estado de ánimo. Continuar progresivamente.",
    category: "Actividad",
    date: "2024-02-20",
    tags: ["ejercicio", "caminata", "salud"]
  },
  {
    title: "Control de peso",
    content: "Peso actual: 70 kg. Objetivo: 68 kg. Perdidos 2 kg en 3 meses. Mantener dieta equilibrada y ejercicio.",
    category: "Control",
    date: "2024-02-15",
    tags: ["peso", "control", "dieta"]
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...')

    // Crear usuarios
    console.log('👥 Creando usuarios...')
    const createdUsers = []
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          address: userData.address,
          bloodType: userData.bloodType,
          emergencyContact: userData.emergencyContact,
          dateOfBirth: new Date(userData.dateOfBirth),
          gender: userData.gender
        }
      })
      createdUsers.push(user)
      console.log(`✅ Usuario creado: ${user.name}`)
    }

    // Crear diagnósticos para cada usuario
    console.log('🏥 Creando diagnósticos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)]
        await prisma.diagnosis.create({
          data: {
            userId: user.id,
            condition: diagnosis.condition,
            description: diagnosis.description,
            severity: diagnosis.severity,
            date: new Date(diagnosis.date),
            doctor: diagnosis.doctor,
            hospital: diagnosis.hospital,
            status: diagnosis.status
          }
        })
      }
      console.log(`✅ Diagnósticos creados para: ${user.name}`)
    }

    // Crear tratamientos para cada usuario
    console.log('💊 Creando tratamientos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const treatment = treatments[Math.floor(Math.random() * treatments.length)]
        await prisma.treatment.create({
          data: {
            userId: user.id,
            name: treatment.name,
            type: treatment.type,
            dosage: treatment.dosage,
            frequency: treatment.frequency,
            startDate: new Date(treatment.startDate),
            endDate: new Date(treatment.endDate),
            doctor: treatment.doctor,
            notes: treatment.notes
          }
        })
      }
      console.log(`✅ Tratamientos creados para: ${user.name}`)
    }

    // Crear eventos médicos para cada usuario
    console.log('📅 Creando eventos médicos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 4; i++) {
        const event = medicalEvents[Math.floor(Math.random() * medicalEvents.length)]
        await prisma.medicalEvent.create({
          data: {
            userId: user.id,
            type: event.type,
            title: event.title,
            description: event.description,
            date: new Date(event.date),
            location: event.location,
            doctor: event.doctor,
            notes: event.notes
          }
        })
      }
      console.log(`✅ Eventos médicos creados para: ${user.name}`)
    }

    // Crear documentos médicos para cada usuario
    console.log('📄 Creando documentos médicos...')
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        const document = medicalDocuments[Math.floor(Math.random() * medicalDocuments.length)]
        await prisma.medicalDocument.create({
          data: {
            userId: user.id,
            type: document.type,
            title: document.title,
            description: document.description,
            date: new Date(document.date),
            doctor: document.doctor,
            hospital: document.hospital,
            notes: document.notes
          }
        })
      }
      console.log(`✅ Documentos médicos creados para: ${user.name}`)
    }

    // Crear citas para cada usuario
    console.log('📋 Creando citas...')
    for (const user of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const appointment = appointments[Math.floor(Math.random() * appointments.length)]
        await prisma.appointment.create({
          data: {
            userId: user.id,
            title: appointment.title,
            type: appointment.type,
            date: new Date(appointment.date),
            time: appointment.time,
            doctor: appointment.doctor,
            location: appointment.location,
            notes: appointment.notes,
            status: appointment.status
          }
        })
      }
      console.log(`✅ Citas creadas para: ${user.name}`)
    }

    // Crear recordatorios para cada usuario
    console.log('⏰ Creando recordatorios...')
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        const reminder = reminders[Math.floor(Math.random() * reminders.length)]
        await prisma.reminder.create({
          data: {
            userId: user.id,
            title: reminder.title,
            type: reminder.type,
            date: new Date(reminder.date),
            time: reminder.time,
            frequency: reminder.frequency,
            notes: reminder.notes,
            status: reminder.status
          }
        })
      }
      console.log(`✅ Recordatorios creados para: ${user.name}`)
    }

    // Crear notas médicas para cada usuario
    console.log('📝 Creando notas médicas...')
    for (const user of createdUsers) {
      for (let i = 0; i < 4; i++) {
        const note = medicalNotes[Math.floor(Math.random() * medicalNotes.length)]
        await prisma.medicalNote.create({
          data: {
            userId: user.id,
            title: note.title,
            content: note.content,
            category: note.category,
            date: new Date(note.date),
            tags: note.tags
          }
        })
      }
      console.log(`✅ Notas médicas creadas para: ${user.name}`)
    }

    console.log('🎉 ¡Base de datos poblada exitosamente!')
    console.log(`📊 Resumen:`)
    console.log(`   - ${createdUsers.length} usuarios creados`)
    console.log(`   - ${createdUsers.length * 3} diagnósticos creados`)
    console.log(`   - ${createdUsers.length * 2} tratamientos creados`)
    console.log(`   - ${createdUsers.length * 4} eventos médicos creados`)
    console.log(`   - ${createdUsers.length * 3} documentos médicos creados`)
    console.log(`   - ${createdUsers.length * 2} citas creadas`)
    console.log(`   - ${createdUsers.length * 3} recordatorios creados`)
    console.log(`   - ${createdUsers.length * 4} notas médicas creadas`)

  } catch (error) {
    console.error('❌ Error durante el seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase() 