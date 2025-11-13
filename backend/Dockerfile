# Imagen oficial de uv con Python preinstalado
FROM astral/uv:python3.12-bookworm-slim

# Variables para optimizar Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias primero
COPY pyproject.toml uv.lock ./

# Instalar dependencias
RUN uv sync --frozen --no-cache

# Copiar el código fuente
COPY app ./app

# Puerto configurable (por defecto 8000)
ARG BACKEND_PORT=8000
EXPOSE ${BACKEND_PORT}

# Comando por defecto
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--reload"]

