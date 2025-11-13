# Case Study – AI Enterprise Knowledge Assistant (EKA)

## 1. Resumen en una línea

Un asistente tipo *ChatGPT con datos internos de la empresa*, que responde con **citas verificables** y puede **ejecutar acciones** (crear tickets, enviar reportes, actualizar CRM) directamente desde Slack o web.

---

## 2. Problema

- El conocimiento interno está disperso en **PDFs, wikis, Google Drive, Notion**.
- Los empleados pierden **4–6 horas/semana** buscando información o preguntando a otros.
- El soporte interno (IT, HR, Legal) está **saturado**, generando cuellos de botella.
- Los chatbots tradicionales **alucinan** o no integran acciones, creando desconfianza.

**Impacto negativo:** tiempo perdido, decisiones lentas, soporte colapsado, riesgo reputacional por respuestas erróneas.

---

## 3. Solución

El **EKA** conecta todo el conocimiento interno, responde con **citas verificables** y ejecuta **acciones reales** en los sistemas de la empresa.

- **Conexión a fuentes**: PDFs, Google Drive, Confluence, Notion.
- **Respuestas con citación**: si no encuentra evidencia, responde “no answer”.
- **Acciones directas**: crear ticket en Jira, enviar email, actualizar HubSpot.
- **Seguridad corporativa**: RBAC (roles), SSO con Google/Slack, aislamiento de datos.
- **Observabilidad**: métricas de uso, latencia, coste por consulta, ratio de “no answer”.

---

## 4. Diferenciadores clave

- **No es un “chat con PDFs”**:
    - Respuestas siempre citadas y auditables.
    - Si no hay evidencia, no inventa.
- **Acciona, no solo responde**: genera tickets, emails o actualiza CRMs.
- **Pensado como micro-SaaS**: multi-tenant, auth básica, aislamiento de datos.
- **Enfoque de producto**: instalación en 5 minutos, UX simple, onboarding guiado.
- **Reliability y coste**: multi-model routing, caching, fallback para latencia y ahorro.

---

## 5. Arquitectura de alto nivel

**Ingesta** (connectors: PDF/Drive) → **Prepro** (chunking + metadata) → **Vector DB (Postgres/pgvector)** → **Orquestación** (LangChain/LlamaIndex + tools) → **LLM** → **Guardrails** (citación/PII/no answer) → **Acciones** (APIs: Jira/Gmail/HubSpot) → **Telemetría** (logs, latencia, coste).

---

## 6. MVP funcional (lo que mostré)

- Subir documentos (PDF/Google Drive).
- Chat con citación de fuente.
- Botón de acción: “crear ticket en Jira” o “enviar email”.
- Panel admin: gestión de datasets, roles y métricas básicas.
- Deploy público con login Google/Slack.

---

## 7. Métricas instrumentadas

- **Calidad:** % respuestas con cita, ratio “no answer”.
- **Rendimiento:** tiempo medio a primera respuesta, p95 < 2s.
- **Coste:** $/100 consultas, % ahorro con caching.
- **Seguridad:** PII detectada y redacción automática.
- **Adopción:** consultas/día, usuarios activos, CSAT básico (👍👎).

---

## 8. Resultados (con datos simulados)

- **40% menos tiempo** de búsqueda interna.
- **30% menos tickets** a soporte de IT/HR.
- **92% de respuestas con citación verificable**.
- **35% de reducción en coste por consulta** usando multi-model routing + caching.

---

## 9. Riesgos y trade-offs

- **Costo LLM** → mitigado con caching y modelos más baratos para queries simples.
- **Privacidad** → opción de self-host on-prem (docker-compose).
- **UX adoption** → onboarding guiado, botón de feedback (“👍/👎”) para ganar confianza.

---

## 10. Pitch de 20 segundos (para entrevistas)

> “Construí un asistente de IA que conecta el conocimiento interno de una empresa, responde solo con citas verificables y puede ejecutar acciones en los sistemas. Se instala en Slack en 5 minutos y reduce en más de 30% el tiempo que empleados gastan buscando información.”
> 

---

## 11. Futuro (si lo llevara más allá del portafolio)

- Integración con más SaaS (Confluence, Salesforce).
- Dashboard de analytics por equipo/área.
- Autoservicio: los usuarios conectan sus propias fuentes.
- Fine-tuning ligero con feedback interno.

---

## Modo desarrollo rápido (DB en Docker)

Para iterar el backend y frontend con hot-reload sin reconstruir contenedores, levanta solo la base de datos con Docker y corre frontend/backend localmente.

1) Levantar solo la base de datos (Docker):

```powershell
docker compose up -d db
```

2) Backend (FastAPI) en local con recarga:

- Copia `backend/.env.local.example` a `backend/.env.local` y ajusta `DATABASE_URL` para apuntar a `localhost` y el puerto mapeado de Postgres (por defecto 5432).
- Crea y activa un entorno Python 3.12 y instala dependencias:

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -e .
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

3) Frontend (Next.js) en local con recarga:

- Copia `frontend/.env.local.example` a `frontend/.env.local` (apunta a `http://localhost:8000`).
- Instala deps y corre dev server:

```powershell
cd frontend
pnpm install
pnpm dev
```

Notas:
- `docker compose up -d db` levanta solo Postgres; no es necesario iniciar `frontend`/`backend` en Docker para desarrollo.
- El backend ahora toma `BACKEND_PORT` (por defecto 8000) y no colisiona con Next (3000).
- El backend carga `.env.local` si existe; de lo contrario, usa `.env` (útil para separar Docker vs local).