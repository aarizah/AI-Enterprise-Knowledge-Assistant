# Migración a Supabase Storage

## Cambios Realizados

### 1. Dependencias
- Agregado `supabase>=2.13.4` en `pyproject.toml`

### 2. Variables de Entorno
Agregadas en `.env` (actualiza con tus valores reales):
```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-key-here
SUPABASE_BUCKET=eka-documents
```

### 3. Nuevo Módulo: `storage_utils.py`
Reemplaza `s3_utils.py` con funcionalidad de Supabase Storage:

**Métodos principales:**
- `save_uploaded_file()`: Sube archivos a Supabase Storage
- `save_uploaded_files()`: Sube múltiples archivos
- `delete_file()`: Elimina archivos del bucket
- `get_file_info()`: Obtiene metadata e información del archivo
- `get_public_url()`: Genera URL pública para acceso directo
- `get_signed_url()`: Genera URL firmada temporal (para buckets privados)
- `download_file()`: Descarga contenido de archivo desde Supabase

### 4. Archivos Actualizados

#### `services.py`
- Cambió import de `s3_utils` a `storage_utils`
- Usa `storage` en lugar de `file_utils`
- Ya no usa `Path` para operaciones de archivo

#### `router.py`
- Actualizado import y dependencias
- Pasa `storage` al pipeline de ingestion

#### `pipeline.py`
- Descarga archivos temporalmente desde Supabase para procesamiento
- Limpia archivos temporales después del procesamiento
- Maneja ciclo completo: download → process → cleanup

### 5. Flujo de Archivos

**Antes (Local):**
```
Upload → Guardar en /s3/ → Procesar desde disco → Mantener en disco
```

**Ahora (Supabase):**
```
Upload → Supabase Storage → Download temporal → Procesar → Limpiar temp → Archivo permanece en Supabase
```

### 6. Configuración del Bucket en Supabase

Asegúrate de:
1. Crear el bucket en tu proyecto Supabase
2. Configurar políticas de acceso según necesites:
   - **Privado**: Requiere autenticación para acceder
   - **Público**: URLs directas accesibles sin auth

### 7. Próximos Pasos

1. Actualizar valores en `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_BUCKET`

2. Instalar dependencias:
   ```bash
   uv sync
   ```

3. Verificar que el bucket existe en Supabase

4. Probar subida de documentos

### 8. Notas Importantes

- El archivo `s3_utils.py` ya no se usa pero se mantiene por si necesitas referencia
- Todos los archivos nuevos se guardarán en Supabase Storage
- Los archivos existentes en `/s3/` local no se migran automáticamente
- El procesamiento de documentos descarga temporalmente archivos para análisis
