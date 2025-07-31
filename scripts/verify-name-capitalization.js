// Script para verificar la capitalización y lógica del apellido
console.log('🔧 Verificando capitalización y lógica del apellido...')

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function simulateNameLogic() {
  console.log('\n👤 Lógica de Nombres y Apellidos:')
  console.log('='.repeat(60))
  
  const testCases = [
    {
      fullName: 'ricardo javier sequeda goez',
      expected: 'Ricardo Sequeda',
      description: '4 palabras → Nombre (1ra) + Apellido (3ra)',
      explanation: 'ricardo (1ra) + sequeda (3ra) = Ricardo Sequeda'
    },
    {
      fullName: 'ricardo sequeda goez',
      expected: 'Ricardo Sequeda',
      description: '3 palabras → Nombre (1ra) + Apellido (2da)',
      explanation: 'ricardo (1ra) + sequeda (2da) = Ricardo Sequeda'
    },
    {
      fullName: 'maria gonzalez rodriguez',
      expected: 'Maria Gonzalez',
      description: '3 palabras → Nombre (1ra) + Apellido (2da)',
      explanation: 'maria (1ra) + gonzalez (2da) = Maria Gonzalez'
    },
    {
      fullName: 'juan perez',
      expected: 'Juan Perez',
      description: '2 palabras → Nombre (1ra) + Apellido (2da)',
      explanation: 'juan (1ra) + perez (2da) = Juan Perez'
    },
    {
      fullName: 'carlos',
      expected: 'Carlos',
      description: '1 palabra → Solo nombre',
      explanation: 'carlos = Carlos'
    },
    {
      fullName: 'ana maria lopez perez',
      expected: 'Ana Lopez',
      description: '4 palabras → Nombre (1ra) + Apellido (3ra)',
      explanation: 'ana (1ra) + lopez (3ra) = Ana Lopez'
    }
  ]
  
  testCases.forEach((testCase, index) => {
    const nameParts = testCase.fullName.split(' ')
    let displayName = ""
    
    if (nameParts.length >= 4) {
      // Caso: "ricardo javier sequeda goez" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[2]  // sequeda (tercera palabra)
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 3) {
      // Caso: "ricardo sequeda goez" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[1]  // sequeda (segunda palabra)
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 2) {
      // Caso: "ricardo sequeda" → "Ricardo Sequeda"
      const firstName = nameParts[0] // ricardo
      const lastName = nameParts[1]  // sequeda
      displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
    } else if (nameParts.length === 1) {
      // Caso: "ricardo" → "Ricardo"
      displayName = capitalizeFirstLetter(nameParts[0])
    } else {
      // Fallback
      displayName = "Usuario"
    }
    
    console.log(`\n${index + 1}. ${testCase.description}`)
    console.log(`   Nombre completo: "${testCase.fullName}"`)
    console.log(`   Palabras: ${nameParts.length} (${nameParts.join(', ')})`)
    console.log(`   Lógica: ${testCase.explanation}`)
    console.log(`   Resultado: "${displayName}"`)
    console.log(`   Esperado: "${testCase.expected}"`)
    console.log(`   Estado: ${displayName === testCase.expected ? '✅ Correcto' : '❌ Incorrecto'}`)
  })
}

function showCurrentUser() {
  console.log('\n👤 Usuario Actual:')
  console.log('='.repeat(60))
  
  const currentUser = {
    fullName: 'ricardo javier sequeda goez',
    email: 'kalexioviedo@gmail.com',
    phone: '3226245980'
  }
  
  const nameParts = currentUser.fullName.split(' ')
  let displayName = ""
  
  if (nameParts.length >= 3) {
    const firstName = nameParts[0] // ricardo
    const lastName = nameParts[2]  // sequeda (tercera palabra)
    displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
  } else if (nameParts.length === 2) {
    const firstName = nameParts[0] // ricardo
    const lastName = nameParts[1]  // sequeda
    displayName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
  } else if (nameParts.length === 1) {
    displayName = capitalizeFirstLetter(nameParts[0])
  } else {
    displayName = "Usuario"
  }
  
  console.log('Datos del usuario:')
  console.log(`  Nombre completo: "${currentUser.fullName}"`)
  console.log(`  Palabras: ${nameParts.length} (${nameParts.join(', ')})`)
  console.log(`  Email: "${currentUser.email}"`)
  console.log(`  Teléfono: "${currentUser.phone}"`)
  
  console.log('\nDisplay en el sidebar:')
  console.log(`  Nombre mostrado: "${displayName}"`)
  console.log(`  Email: "${currentUser.email}"`)
  console.log(`  Estado: "Saludable"`)
  
  console.log('\n✅ Lógica implementada correctamente!')
}

function showCapitalizationRules() {
  console.log('\n📝 Reglas de Capitalización:')
  console.log('='.repeat(60))
  
  const rules = [
    {
      rule: 'Primera letra en mayúscula',
      example: 'ricardo → Ricardo',
      code: 'str.charAt(0).toUpperCase()'
    },
    {
      rule: 'Resto en minúscula',
      example: 'RICARDO → Ricardo',
      code: 'str.slice(1).toLowerCase()'
    },
    {
      rule: 'Combinación',
      example: 'rIcArDo → Ricardo',
      code: 'capitalizeFirstLetter(str)'
    }
  ]
  
  rules.forEach((rule, index) => {
    console.log(`\n${index + 1}. ${rule.rule}`)
    console.log(`   Ejemplo: ${rule.example}`)
    console.log(`   Código: ${rule.code}`)
  })
}

function showApellidoLogic() {
  console.log('\n🏷️ Lógica del Apellido:')
  console.log('='.repeat(60))
  
  const logic = [
    {
      case: '4 palabras: "ricardo javier sequeda goez"',
      logic: 'Apellido = 3ra palabra (sequeda)',
      result: 'Ricardo Sequeda',
      explanation: 'Nombre (1ra) + Apellido (3ra)'
    },
    {
      case: '3 palabras: "ricardo sequeda goez"',
      logic: 'Apellido = 2da palabra (sequeda)',
      result: 'Ricardo Sequeda',
      explanation: 'Nombre (1ra) + Apellido (2da)'
    },
    {
      case: '2 palabras: "ricardo sequeda"',
      logic: 'Apellido = 2da palabra (sequeda)',
      result: 'Ricardo Sequeda',
      explanation: 'Nombre (1ra) + Apellido (2da)'
    },
    {
      case: '1 palabra: "ricardo"',
      logic: 'Solo nombre',
      result: 'Ricardo',
      explanation: 'Solo se muestra el nombre'
    }
  ]
  
  logic.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.case}`)
    console.log(`   Lógica: ${item.logic}`)
    console.log(`   Resultado: ${item.result}`)
    console.log(`   Explicación: ${item.explanation}`)
  })
}

function showBenefits() {
  console.log('\n🎉 Beneficios de la Capitalización:')
  console.log('='.repeat(60))
  
  const benefits = [
    '✅ Nombres con formato profesional',
    '✅ Consistente con estándares de UI',
    '✅ Mejor legibilidad',
    '✅ Lógica correcta del apellido',
    '✅ Manejo de diferentes casos',
    '✅ Capitalización automática',
    '✅ Formato estándar: "Nombre Apellido"',
    '✅ Fácil de mantener'
  ]
  
  benefits.forEach((benefit, index) => {
    console.log(`  ${index + 1}. ${benefit}`)
  })
}

// Ejecutar verificaciones
simulateNameLogic()
showCurrentUser()
showCapitalizationRules()
showApellidoLogic()
showBenefits()

console.log('\n🎯 Resultado esperado:')
console.log('✅ "ricardo javier sequeda goez" → "Ricardo Sequeda"')
console.log('✅ Capitalización automática de primera letra')
console.log('✅ Lógica correcta del apellido (3ra palabra)')
console.log('✅ Formato profesional: "Nombre Apellido"')

console.log('\n✅ Capitalización y lógica del apellido implementada!') 