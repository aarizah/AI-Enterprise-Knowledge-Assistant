# API Endpoints Documentation

## Tabla de Contenidos
- [Autenticación](#autenticación)
- [Chat](#chat)
- [Documentos](#documentos)
- [Analytics](#analytics)

---

## Autenticación

Base URL: `/auth`

### 1. Registrar Usuario

**Endpoint:** `POST /auth/register`

**Descripción:** Crea una nueva cuenta de usuario en el sistema.

**Autenticación:** No requiere

**Request Body:**
```json
{
  "username": "string",
  "email": "string (email válido)",
  "password": "string"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```

**Errores Posibles:**
- `400 Bad Request`: Email o username ya existe
- `422 Unprocessable Entity`: Datos de entrada inválidos

---

### 2. Iniciar Sesión

**Endpoint:** `POST /auth/login`

**Descripción:** Autentica un usuario y devuelve un token JWT.

**Autenticación:** No requiere

**Request Body:**
```json
{
  "email": "string (email válido)",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errores Posibles:**
- `401 Unauthorized`: Credenciales inválidas
- `422 Unprocessable Entity`: Datos de entrada inválidos

---

### 3. Obtener Usuario Actual

**Endpoint:** `GET /auth/me`

**Descripción:** Devuelve la información del usuario autenticado actualmente.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "user": {
    "sub": "1",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Token no proporcionado

---

## Chat

Base URL: `/chat`

### 1. Realizar Consulta

**Endpoint:** `POST /chat/answer`

**Descripción:** Envía una pregunta y recibe una respuesta generada por IA basada en los documentos del usuario.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "query": "string"
}
```

**Ejemplo Request:**
```json
{
  "query": "¿Cuál es la política de vacaciones de la empresa?"
}
```

**Response:** `200 OK`
```json
{
  "answer": "Según los documentos analizados...",
  "sources": [
    {
      "document_id": 1,
      "chunk_id": "abc123",
      "relevance_score": 0.95
    }
  ],
  "metadata": {
    "tokens_used": 150,
    "processing_time_ms": 1200
  }
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `400 Bad Request`: Query vacío o inválido
- `500 Internal Server Error`: Error en el procesamiento de la consulta

---

## Documentos

Base URL: `/documents`

### 1. Subir y Procesar Documentos

**Endpoint:** `POST /documents`

**Descripción:** Sube uno o más documentos, los procesa automáticamente y los vectoriza para búsqueda semántica.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `files`: Array de archivos (required)

**Formatos Soportados:**
- PDF (.pdf)
- Word (.docx)
- Text (.txt)
- Markdown (.md)

**Ejemplo Request:**
```
POST /documents
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="files"; filename="document.pdf"
Content-Type: application/pdf

[binary data]
--boundary--
```

**Response:** `200 OK`
```json
{
  "results": [
    {
      "document_id": 1,
      "filename": "document.pdf",
      "status": "processed",
      "chunks_count": 45,
      "embeddings_stored": 45
    }
  ]
}
```

**Response en caso de error:**
```json
{
  "results": [
    {
      "document_id": 1,
      "status": "failed",
      "error": "No content could be extracted from document.pdf"
    }
  ]
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `400 Bad Request`: Formato de archivo no soportado o archivo duplicado
- `413 Payload Too Large`: Archivo demasiado grande
- `500 Internal Server Error`: Error en el procesamiento del documento

---

### 2. Listar Documentos

**Endpoint:** `GET /documents`

**Descripción:** Obtiene la lista de documentos del usuario con paginación.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip`: int (default: 0) - Número de registros a saltar
- `limit`: int (default: 100) - Número máximo de registros a devolver

**Ejemplo Request:**
```
GET /documents?skip=0&limit=10
```

**Response:** `200 OK`
```json
{
  "total": 25,
  "documents": [
    {
      "id": 1,
      "filename": "Manual_Usuario.pdf",
      "file_path": "/uploads/user_1/manual.pdf",
      "file_type": "pdf",
      "upload_date": "2025-11-28T10:30:00Z",
      "user_id": 1,
      "chunks_count": 45,
      "file_size_bytes": 2048000,
      "status": "processed"
    },
    {
      "id": 2,
      "filename": "Politicas_Empresa.docx",
      "file_path": "/uploads/user_1/politicas.docx",
      "file_type": "docx",
      "upload_date": "2025-11-27T15:45:00Z",
      "user_id": 1,
      "chunks_count": 28,
      "file_size_bytes": 1536000,
      "status": "processed"
    }
  ]
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `422 Unprocessable Entity`: Parámetros de paginación inválidos

---

### 3. Obtener Documento por ID

**Endpoint:** `GET /documents/{document_id}`

**Descripción:** Obtiene los detalles de un documento específico del usuario.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `document_id`: int (required) - ID del documento

**Ejemplo Request:**
```
GET /documents/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "filename": "Manual_Usuario.pdf",
  "file_path": "/uploads/user_1/manual.pdf",
  "file_type": "pdf",
  "upload_date": "2025-11-28T10:30:00Z",
  "user_id": 1,
  "chunks_count": 45,
  "file_size_bytes": 2048000,
  "status": "processed"
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `404 Not Found`: Documento no encontrado
- `403 Forbidden`: No tienes acceso a este documento

---

### 4. Eliminar Documento

**Endpoint:** `DELETE /documents/{document_id}`

**Descripción:** Elimina un documento y todos sus embeddings asociados.

**Autenticación:** Requiere Bearer Token

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `document_id`: int (required) - ID del documento a eliminar

**Ejemplo Request:**
```
DELETE /documents/1
```

**Response:** `200 OK`
```json
{
  "message": "Document deleted successfully"
}
```

**Errores Posibles:**
- `401 Unauthorized`: Token inválido o expirado
- `404 Not Found`: Documento no encontrado
- `403 Forbidden`: No tienes acceso a este documento

---

## Analytics

Base URL: `/analytics`

**Estado:** Módulo en desarrollo

---

## Códigos de Estado HTTP

### Exitosos (2xx)
- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente

### Errores del Cliente (4xx)
- `400 Bad Request`: Solicitud mal formada o datos inválidos
- `401 Unauthorized`: Credenciales inválidas o token expirado
- `403 Forbidden`: Sin permisos para acceder al recurso
- `404 Not Found`: Recurso no encontrado
- `413 Payload Too Large`: Archivo o payload demasiado grande
- `422 Unprocessable Entity`: Datos de entrada no válidos según el schema

### Errores del Servidor (5xx)
- `500 Internal Server Error`: Error interno del servidor

---

## Autenticación JWT

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren autenticación mediante JWT Bearer Token.

**Formato del Header:**
```
Authorization: Bearer {your_jwt_token}
```

**Obtención del Token:**
1. Registrar usuario con `POST /auth/register`
2. Iniciar sesión con `POST /auth/login`
3. Usar el `access_token` recibido en las siguientes peticiones

**Expiración:**
El token JWT tiene una duración limitada. Cuando expire, deberás iniciar sesión nuevamente.

---

## Límites y Restricciones

### Documentos
- **Tamaño máximo por archivo:** Por definir (configuración del servidor)
- **Formatos soportados:** PDF, DOC, DOCX, TXT, MD
- **Número máximo de archivos por request:** Limitado por configuración

### Rate Limiting
- Por definir según configuración del servidor

---

## Ejemplos de Uso

### Flujo Completo: Registro, Login y Subida de Documento

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# 2. Iniciar sesión
TOKEN=$(curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }' | jq -r '.access_token')

# 3. Subir documento
curl -X POST http://localhost:8000/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/document.pdf"

# 4. Listar documentos
curl -X GET http://localhost:8000/documents \
  -H "Authorization: Bearer $TOKEN"

# 5. Hacer una consulta
curl -X POST http://localhost:8000/chat/answer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "¿Cuáles son las políticas de la empresa?"
  }'
```

---

## Notas Adicionales

### Seguridad
- Las contraseñas se almacenan hasheadas (bcrypt)
- Los tokens JWT están firmados y tienen expiración
- Cada usuario solo puede acceder a sus propios documentos

### Procesamiento de Documentos
- Los documentos se procesan de forma asíncrona
- Se crean chunks y embeddings para búsqueda semántica
- El estado del documento se actualiza durante el procesamiento

### Base de Datos
- PostgreSQL para datos estructurados (usuarios, documentos)
- Vector store para embeddings (búsqueda semántica)

---

**Última actualización:** 28 de noviembre de 2025
**Versión API:** 1.0