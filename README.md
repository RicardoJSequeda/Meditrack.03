# 🏥 MediTrack - Sistema de Gestión Médica

Una aplicación completa para la gestión de información médica personal, construida con Next.js, Supabase y Vercel.

## 🚀 Despliegue Rápido

### 1. Configurar Supabase
```bash
# Crear proyecto en Supabase
# Configurar variables de entorno
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
```

### 2. Desplegar a Vercel
```bash
# Opción A: Despliegue automático
# Conectar repositorio a Vercel y configurar variables de entorno

# Opción B: Despliegue manual
npm run deploy:vercel
```

## 🛠️ Desarrollo Local

### Instalar dependencias
```bash
npm install
# o
npm run clean:deps  # Para limpiar dependencias problemáticas
```

### Ejecutar en desarrollo
```bash
npm run dev
```

### Verificar configuración de producción
```bash
npm run verify:production
```

## 📋 Checklist de Despliegue

### Antes del Despliegue
- [ ] Variables de entorno configuradas en Vercel
- [ ] Supabase configurado con RLS habilitado
- [ ] Políticas de seguridad implementadas
- [ ] Autenticación configurada
- [ ] Script de verificación ejecutado

### Post-Despliegue
- [ ] Página principal carga correctamente
- [ ] Autenticación funciona
- [ ] Base de datos conecta
- [ ] APIs responden correctamente

## 🛠️ Solución de Problemas

### Error: "Module not found"
```bash
# Verificar que todos los componentes existen
npm run build
```

### Error: "Peer dependencies"
```bash
# Limpiar dependencias
npm run clean:deps
```

### Error: "Build failed"
```bash
# Verificar TypeScript
npm run lint
npm run build
```

## 📁 Estructura del Proyecto

```
meditrack2/
├── app/                    # Páginas de Next.js
├── components/             # Componentes reutilizables
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuración
├── modules/                # Módulos específicos
├── scripts/                # Scripts de utilidad
└── public/                 # Archivos estáticos
```

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo local
- `npm run build` - Build de producción
- `npm run lint` - Verificar código
- `npm run verify:production` - Verificar configuración
- `npm run clean:deps` - Limpiar dependencias
- `npm run deploy:vercel` - Desplegar a Vercel

## 🚨 Problemas Conocidos

### Dependencias Deprecadas
- `@supabase/auth-helpers-nextjs` → Usar `@supabase/ssr`
- `react-day-picker@8.x` → Actualizar a `@9.x`
- `vaul@0.9.x` → Actualizar a `@1.x`

### Peer Dependencies
- React 19 puede causar warnings con algunas librerías
- Usar `npm run clean:deps` para resolver

## 📞 Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Características

- ✅ Autenticación segura
- ✅ Gestión de historial médico
- ✅ Citas y recordatorios
- ✅ Modo de emergencia
- ✅ Asistente virtual
- ✅ Interfaz responsive
- ✅ Optimización de rendimiento

---

**¡Listo para producción! 🚀** 