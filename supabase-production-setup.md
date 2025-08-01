# Configuración de Supabase para Producción

## 1. Configurar Políticas de Seguridad (RLS)

### Habilitar RLS en todas las tablas
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
```

### Políticas para la tabla users
```sql
-- Permitir que los usuarios vean solo sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Permitir que los usuarios actualicen solo sus propios datos
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Permitir inserción de nuevos usuarios
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);
```

### Políticas para otras tablas (ejemplo para diagnoses)
```sql
-- Permitir que los usuarios vean solo sus propios diagnósticos
CREATE POLICY "Users can view own diagnoses" ON diagnoses
  FOR SELECT USING (auth.uid()::text = userId);

-- Permitir que los usuarios inserten sus propios diagnósticos
CREATE POLICY "Users can insert own diagnoses" ON diagnoses
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

-- Permitir que los usuarios actualicen sus propios diagnósticos
CREATE POLICY "Users can update own diagnoses" ON diagnoses
  FOR UPDATE USING (auth.uid()::text = userId);

-- Permitir que los usuarios eliminen sus propios diagnósticos
CREATE POLICY "Users can delete own diagnoses" ON diagnoses
  FOR DELETE USING (auth.uid()::text = userId);
```

## 2. Configurar Autenticación

### Habilitar proveedores de autenticación
1. Ve a Authentication > Providers en Supabase Dashboard
2. Habilita los proveedores que necesites:
   - Email/Password
   - Google (si usas)
   - GitHub (si usas)

### Configurar URLs de redirección
```
https://tu-dominio.vercel.app/auth/callback
https://tu-dominio.vercel.app/login
https://tu-dominio.vercel.app/register
```

## 3. Configurar Storage (si usas archivos)

### Crear bucket para documentos médicos
```sql
-- Crear bucket para documentos médicos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-documents', 'medical-documents', false);
```

### Políticas para storage
```sql
-- Permitir que los usuarios suban archivos a su carpeta
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que los usuarios vean sus propios archivos
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 4. Configurar Funciones Edge (si las usas)

### Crear función para validación de tokens
```sql
-- Función para validar tokens JWT
CREATE OR REPLACE FUNCTION validate_jwt_token(token text)
RETURNS boolean AS $$
BEGIN
  -- Aquí iría la lógica de validación
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 5. Configurar Webhooks (opcional)

### Para notificaciones en tiempo real
1. Ve a Database > Webhooks en Supabase Dashboard
2. Configura webhooks para eventos importantes
3. Apunta a tu endpoint de Vercel

## 6. Configurar Backup y Monitoreo

### Habilitar backups automáticos
1. Ve a Settings > Database en Supabase Dashboard
2. Configura backups automáticos
3. Configura alertas de monitoreo

## 7. Verificar Configuración

### Script de verificación
```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
  'users', 'diagnoses', 'treatments', 'medical_events', 
  'medical_documents', 'appointments', 'reminders', 
  'medical_notes', 'emergency_events', 'emergency_contacts'
);

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
``` 