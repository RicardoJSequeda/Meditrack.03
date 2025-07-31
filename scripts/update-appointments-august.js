const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const year = new Date().getFullYear()
  // Actualiza todas las citas existentes a agosto de este año
  const appointments = await prisma.appointment.findMany()
  for (let i = 0; i < appointments.length; i++) {
    const day = (i % 28) + 1
    const date = new Date(`${year}-08-${day.toString().padStart(2, '0')}T09:00:00`)
    await prisma.appointment.update({
      where: { id: appointments[i].id },
      data: { date }
    })
  }

  // Agrega citas variadas
  const user = await prisma.user.findFirst()
  if (!user) return
  const specialties = [
    { doctor: 'Dr. García López', specialty: 'Endocrinología', location: 'Hospital General Madrid', notes: 'Chequeo anual' },
    { doctor: 'Dra. Martínez Ruiz', specialty: 'Cardiología', location: 'Clínica Corazón', notes: 'Control de presión' },
    { doctor: 'Dr. Pérez Soto', specialty: 'Dermatología', location: 'Centro Dermatológico', notes: 'Revisión lunar' },
    { doctor: 'Dra. Torres Gil', specialty: 'Pediatría', location: 'Hospital Infantil', notes: 'Consulta niño' },
    { doctor: 'Dr. Ramírez Díaz', specialty: 'Neurología', location: 'NeuroSalud', notes: 'Dolor de cabeza' },
    { doctor: 'Dra. López Vega', specialty: 'Ginecología', location: 'Clínica Mujer', notes: 'Control anual' },
  ]
  for (let i = 1; i <= 12; i++) {
    const spec = specialties[i % specialties.length]
    const date = new Date(`${year}-08-${(i * 2).toString().padStart(2, '0')}T${(8 + (i % 8)).toString().padStart(2, '0')}:30:00`)
    await prisma.appointment.create({
      data: {
        title: `Cita médica #${i}`,
        doctor: spec.doctor,
        specialty: spec.specialty,
        date,
        duration: 30,
        location: spec.location,
        notes: spec.notes,
        status: 'SCHEDULED',
        userId: user.id,
      }
    })
  }
  console.log('Citas actualizadas y nuevas citas variadas agregadas para agosto de este año.')
}

main().finally(() => prisma.$disconnect()) 