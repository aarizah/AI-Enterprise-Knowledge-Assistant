# Imagen base con Python + uv
FROM astral/uv:python3.12-bookworm-slim

# Optimizar Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY pyproject.toml uv.lock ./

# Instalar dependencias
RUN uv sync --frozen --no-cache

# Copiar el código fuente
COPY app ./app

# Render pasará esta variable automáticamente (PORT)
ENV PORT=8000

# Documentar el puerto
EXPOSE ${PORT}

# Comando para correr FastAPI en producción
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
