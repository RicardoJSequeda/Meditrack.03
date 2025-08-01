# 🚀 Guía de Despliegue a Vercel

## 📋 Checklist Pre-Despliegue

### 1. Configurar Supabase
- [ ] Crear proyecto en Supabase
- [ ] Configurar tablas de base de datos
- [ ] Habilitar Row Level Security (RLS)
- [ ] Configurar políticas de seguridad
- [ ] Configurar autenticación
- [ ] Configurar storage (si es necesario)

### 2. Obtener Variables de Entorno
- [ ] Copiar URL del proyecto de Supabase
- [ ] Copiar anon key de Supabase
- [ ] Copiar service role key de Supabase

### 3. Preparar Código
- [ ] Verificar que no hay credenciales hardcodeadas
- [ ] Ejecutar `npm run verify:production`
- [ ] Hacer commit de todos los cambios

## 🔧 Pasos de Configuración

### Paso 1: Configurar Supabase

1. **Crear proyecto en Supabase**
   ```bash
   # Ve a https://supabase.com
   # Crea un nuevo proyecto
   # Anota la URL y las keys
   ```

2. **Configurar base de datos**
   ```bash
   # Ejecutar scripts de migración
   npm run supabase:migrate
   npm run supabase:seed
   ```

3. **Configurar políticas de seguridad**
   ```sql
   -- Ejecutar en el SQL Editor de Supabase
   -- Ver archivo supabase-production-setup.md para detalles
   ```

### Paso 2: Configurar Variables de Entorno

1. **En Vercel Dashboard:**
   - Ve a tu proyecto
   - Settings > Environment Variables
   - Agrega las siguientes variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
   ```

2. **Verificar configuración:**
   ```bash
   npm run verify:production
   ```

### Paso 3: Desplegar a Vercel

#### Opción A: Despliegue Automático (Recomendado)

1. **Conectar repositorio a Vercel:**
   - Ve a https://vercel.com
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno
   - Vercel desplegará automáticamente

2. **Configurar dominio personalizado (opcional):**
   - Ve a Settings > Domains
   - Agrega tu dominio personalizado

#### Opción B: Despliegue Manual

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login a Vercel:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   npm run deploy:vercel
   ```

## 🔍 Verificación Post-Despliegue

### 1. Verificar Funcionalidad Básica
- [ ] Página principal carga correctamente
- [ ] Autenticación funciona
- [ ] Base de datos conecta correctamente
- [ ] APIs responden correctamente

### 2. Verificar Funcionalidades Específicas
- [ ] Registro de usuarios
- [ ] Login/logout
- [ ] CRUD de datos médicos
- [ ] Subida de archivos (si aplica)
- [ ] Notificaciones (si aplica)

### 3. Verificar Rendimiento
- [ ] Tiempo de carga aceptable
- [ ] Funciona en móviles
- [ ] No hay errores en consola

## 🛠️ Solución de Problemas Comunes

### Error: "Supabase connection failed"
```bash
# Verificar variables de entorno
npm run verify:production

# Verificar que las keys son correctas
# Verificar que Supabase está activo
```

### Error: "Database tables not found"
```bash
# Ejecutar migraciones
npm run supabase:migrate

# Verificar que las tablas existen
# Verificar políticas de seguridad
```

### Error: "Authentication not working"
```bash
# Verificar configuración de auth en Supabase
# Verificar URLs de redirección
# Verificar que los providers están habilitados
```

### Error: "Build failed"
```bash
# Verificar que todas las dependencias están instaladas
npm install

# Verificar que no hay errores de TypeScript
npm run lint

# Verificar que el build funciona localmente
npm run build
```

## 📊 Monitoreo y Mantenimiento

### 1. Configurar Monitoreo
- [ ] Configurar alertas en Vercel
- [ ] Configurar logs en Supabase
- [ ] Configurar uptime monitoring

### 2. Backup y Recuperación
- [ ] Configurar backups automáticos en Supabase
- [ ] Documentar proceso de recuperación
- [ ] Probar restauración de backups

### 3. Actualizaciones
- [ ] Configurar actualizaciones automáticas de dependencias
- [ ] Planificar actualizaciones de seguridad
- [ ] Mantener documentación actualizada

## 🔒 Seguridad

### Checklist de Seguridad
- [ ] Variables de entorno configuradas correctamente
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas de seguridad implementadas
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] No hay credenciales en el código

### Buenas Prácticas
- [ ] Usar variables de entorno para todas las credenciales
- [ ] Implementar rate limiting
- [ ] Validar todas las entradas de usuario
- [ ] Mantener dependencias actualizadas
- [ ] Monitorear logs regularmente

## 📞 Soporte

### Recursos Útiles
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Contacto
- Para problemas de Vercel: [Vercel Support](https://vercel.com/support)
- Para problemas de Supabase: [Supabase Support](https://supabase.com/support)

---

## 🎉 ¡Listo para Producción!

Una vez completados todos los pasos, tu aplicación estará lista para producción en Vercel con Supabase como base de datos.

**Recuerda:**
- Mantener las credenciales seguras
- Monitorear el rendimiento regularmente
- Hacer backups periódicos
- Actualizar dependencias regularmente 