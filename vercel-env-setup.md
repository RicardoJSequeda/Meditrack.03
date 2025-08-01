# Variables de Entorno para Vercel

## Variables Requeridas para Supabase

### Variables Públicas (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### Variables Privadas (Solo Servidor)
```
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
```

## Cómo Obtener Estas Variables

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a Settings > API
3. Copia:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role secret → SUPABASE_SERVICE_ROLE_KEY

## Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de que estén disponibles en Production, Preview y Development

## Variables Opcionales (si las usas)

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
NEXT_PUBLIC_EMERGENCY_API_KEY=tu_api_key_de_emergencia
```

## Notas Importantes

- Las variables que empiezan con `NEXT_PUBLIC_` estarán disponibles en el cliente
- Las variables sin `NEXT_PUBLIC_` solo estarán disponibles en el servidor
- Nunca expongas la `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- Después de agregar las variables, redeploya tu aplicación 