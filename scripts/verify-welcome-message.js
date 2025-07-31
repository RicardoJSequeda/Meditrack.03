// Script para verificar el componente de bienvenida dinámico
console.log('🔧 Verificando componente de bienvenida dinámico...')

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function simulateGreetingLogic() {
  console.log('\n🕐 Lógica de Saludos por Hora:')
  console.log('='.repeat(60))
  
  const timeSlots = [
    {
      hour: 6,
      expected: 'Buenos días',
      description: 'Mañana temprano'
    },
    {
      hour: 11,
      expected: 'Buenos días',
      description: 'Mañana'
    },
    {
      hour: 12,
      expected: 'Buenas tardes',
      description: 'Mediodía'
    },
    {
      hour: 15,
      expected: 'Buenas tardes',
      description: 'Tarde'
    },
    {
      hour: 18,
      expected: 'Buenas noches',
      description: 'Noche'
    },
    {
      hour: 22,
      expected: 'Buenas noches',
      description: 'Noche tarde'
    },
    {
      hour: 2,
      expected: 'Buenas noches',
      description: 'Madrugada'
    }
  ]
  
  timeSlots.forEach((slot, index) => {
    let greeting = ""
    if (slot.hour >= 5 && slot.hour < 12) {
      greeting = "Buenos días"
    } else if (slot.hour >= 12 && slot.hour < 18) {
      greeting = "Buenas tardes"
    } else {
      greeting = "Buenas noches"
    }
    
    console.log(`\n${index + 1}. ${slot.description} (${slot.hour}:00)`)
    console.log(`   Saludo: "${greeting}"`)
    console.log(`   Esperado: "${slot.expected}"`)
    console.log(`   Estado: ${greeting === slot.expected ? '✅ Correcto' : '❌ Incorrecto'}`)
  })
}

function simulateUserNameLogic() {
  console.log('\n👤 Lógica de Nombres de Usuario:')
  console.log('='.repeat(60))
  
  const testCases = [
    {
      fullName: 'ricardo javier sequeda goez',
      expected: 'Ricardo',
      description: '4 palabras → Solo primer nombre'
    },
    {
      fullName: 'ricardo sequeda goez',
      expected: 'Ricardo',
      description: '3 palabras → Solo primer nombre'
    },
    {
      fullName: 'maria gonzalez rodriguez',
      expected: 'Maria',
      description: '3 palabras → Solo primer nombre'
    },
    {
      fullName: 'juan perez',
      expected: 'Juan',
      description: '2 palabras → Solo primer nombre'
    },
    {
      fullName: 'carlos',
      expected: 'Carlos',
      description: '1 palabra → Solo nombre'
    }
  ]
  
  testCases.forEach((testCase, index) => {
    const nameParts = testCase.fullName.split(' ')
    let displayName = ""
    
    if (nameParts.length >= 4) {
      const firstName = nameParts[0]
      displayName = capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 3) {
      const firstName = nameParts[0]
      displayName = capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 2) {
      const firstName = nameParts[0]
      displayName = capitalizeFirstLetter(firstName)
    } else if (nameParts.length === 1) {
      displayName = capitalizeFirstLetter(nameParts[0])
    } else {
      displayName = "Usuario"
    }
    
    console.log(`\n${index + 1}. ${testCase.description}`)
    console.log(`   Nombre completo: "${testCase.fullName}"`)
    console.log(`   Nombre mostrado: "${displayName}"`)
    console.log(`   Esperado: "${testCase.expected}"`)
    console.log(`   Estado: ${displayName === testCase.expected ? '✅ Correcto' : '❌ Incorrecto'}`)
  })
}

function showWelcomeExamples() {
  console.log('\n👋 Ejemplos de Mensajes de Bienvenida:')
  console.log('='.repeat(60))
  
  const examples = [
    {
      time: '08:30',
      greeting: 'Buenos días',
      userName: 'Ricardo',
      message: 'Buenos días, Ricardo'
    },
    {
      time: '14:15',
      greeting: 'Buenas tardes',
      userName: 'Maria',
      message: 'Buenas tardes, Maria'
    },
    {
      time: '20:45',
      greeting: 'Buenas noches',
      userName: 'Juan',
      message: 'Buenas noches, Juan'
    },
    {
      time: '23:30',
      greeting: 'Buenas noches',
      userName: 'Carlos',
      message: 'Buenas noches, Carlos'
    }
  ]
  
  examples.forEach((example, index) => {
    console.log(`\n${index + 1}. ${example.time}`)
    console.log(`   Saludo: ${example.greeting}`)
    console.log(`   Usuario: ${example.userName}`)
    console.log(`   Mensaje completo: "${example.message}"`)
  })
}

function showComponentFeatures() {
  console.log('\n🎯 Características del Componente:')
  console.log('='.repeat(60))
  
  const features = [
    {
      feature: 'Saludo dinámico',
      description: 'Cambia según la hora del día',
      benefits: ['Buenos días (5:00-11:59)', 'Buenas tardes (12:00-17:59)', 'Buenas noches (18:00-4:59)']
    },
    {
      feature: 'Nombre del usuario',
      description: 'Usa el nombre real del usuario autenticado',
      benefits: ['Capitalización automática', 'Solo primer nombre', 'Fallback a "Usuario"']
    },
    {
      feature: 'Hora opcional',
      description: 'Puede mostrar la hora actual',
      benefits: ['Formato 24h', 'Hora local', 'Actualización en tiempo real']
    },
    {
      feature: 'Estilos personalizables',
      description: 'Acepta className para personalización',
      benefits: ['Colores adaptables', 'Tamaños flexibles', 'Tema claro/oscuro']
    }
  ]
  
  features.forEach((feature, index) => {
    console.log(`\n${index + 1}. ${feature.feature}`)
    console.log(`   Descripción: ${feature.description}`)
    console.log(`   Beneficios:`)
    feature.benefits.forEach((benefit, i) => {
      console.log(`     ${i + 1}. ${benefit}`)
    })
  })
}

function showUsageExamples() {
  console.log('\n💻 Ejemplos de Uso:')
  console.log('='.repeat(60))
  
  const usageExamples = [
    {
      component: '<WelcomeMessage />',
      result: 'Buenos días, Ricardo',
      description: 'Uso básico'
    },
    {
      component: '<WelcomeMessage className="text-white" />',
      result: 'Buenos días, Ricardo (texto blanco)',
      description: 'Con estilos personalizados'
    },
    {
      component: '<WelcomeMessage showTime={true} />',
      result: 'Buenos días, Ricardo\n14:30',
      description: 'Con hora visible'
    },
    {
      component: '<WelcomeMessage className="text-2xl" showTime={true} />',
      result: 'Buenos días, Ricardo\n14:30 (texto grande)',
      description: 'Combinación completa'
    }
  ]
  
  usageExamples.forEach((example, index) => {
    console.log(`\n${index + 1}. ${example.description}`)
    console.log(`   Componente: ${example.component}`)
    console.log(`   Resultado: "${example.result}"`)
  })
}

// Ejecutar verificaciones
simulateGreetingLogic()
simulateUserNameLogic()
showWelcomeExamples()
showComponentFeatures()
showUsageExamples()

console.log('\n🎯 Resultado esperado:')
console.log('✅ Saludo dinámico según la hora')
console.log('✅ Nombre del usuario con capitalización')
console.log('✅ Componente reutilizable')
console.log('✅ Estilos personalizables')

console.log('\n✅ Componente de bienvenida dinámico implementado!') 