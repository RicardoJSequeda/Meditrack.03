const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProfileSave() {
  try {
    console.log('🔍 Iniciando prueba de guardado de perfil...')
    
    // 1. Verificar estructura de la tabla users
    console.log('\n📋 Verificando estructura de la tabla users...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'users')
      .order('ordinal_position')

    if (columnsError) {
      console.error('❌ Error obteniendo estructura:', columnsError)
      return
    }

    console.log('✅ Campos disponibles en tabla users:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })

    // 2. Verificar datos existentes
    console.log('\n👥 Verificando usuarios existentes...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, phone, address, dateOfBirth, gender, bloodType, emergencyContact')
      .limit(5)

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError)
      return
    }

    console.log('✅ Usuarios encontrados:')
    users.forEach(user => {
      console.log(`  - ID: ${user.id}`)
      console.log(`    Email: ${user.email}`)
      console.log(`    Nombre: ${user.name}`)
      console.log(`    Teléfono: ${user.phone || 'No definido'}`)
      console.log(`    Dirección: ${user.address || 'No definida'}`)
      console.log(`    Fecha Nacimiento: ${user.dateOfBirth || 'No definida'}`)
      console.log(`    Género: ${user.gender || 'No definido'}`)
      console.log(`    Tipo Sangre: ${user.bloodType || 'No definido'}`)
      console.log(`    Contacto Emergencia: ${user.emergencyContact || 'No definido'}`)
      console.log('')
    })

    // 3. Probar actualización de un usuario
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`\n🧪 Probando actualización del usuario: ${testUser.email}`)
      
      const testData = {
        name: testUser.name || 'Usuario Test',
        phone: '+1234567890',
        address: 'Calle Test 123, Ciudad Test',
        dateOfBirth: '1990-01-01',
        gender: 'Masculino',
        bloodType: 'O+',
        emergencyContact: 'Contacto Test'
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(testData)
        .eq('id', testUser.id)
        .select()

      if (updateError) {
        console.error('❌ Error actualizando usuario:', updateError)
        return
      }

      console.log('✅ Usuario actualizado exitosamente:')
      console.log(JSON.stringify(updatedUser[0], null, 2))

      // 4. Verificar que los datos se guardaron
      console.log('\n🔍 Verificando que los datos se guardaron...')
      const { data: verifyUser, error: verifyError } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUser.id)
        .single()

      if (verifyError) {
        console.error('❌ Error verificando usuario:', verifyError)
        return
      }

      console.log('✅ Datos verificados:')
      console.log(`  - Nombre: ${verifyUser.name}`)
      console.log(`  - Teléfono: ${verifyUser.phone}`)
      console.log(`  - Dirección: ${verifyUser.address}`)
      console.log(`  - Fecha Nacimiento: ${verifyUser.dateOfBirth}`)
      console.log(`  - Género: ${verifyUser.gender}`)
      console.log(`  - Tipo Sangre: ${verifyUser.bloodType}`)
      console.log(`  - Contacto Emergencia: ${verifyUser.emergencyContact}`)
    }

    console.log('\n✅ Prueba completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error)
  }
}

// Ejecutar la prueba
testProfileSave() 