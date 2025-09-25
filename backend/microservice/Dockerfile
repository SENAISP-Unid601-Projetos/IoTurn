# ---- Estágio 1: Builder ----
FROM python:3.11-slim AS builder
WORKDIR /app
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# ---- Estágio 2: Final ----
FROM python:3.11-slim
WORKDIR /app

# Copia as dependências e o código
COPY --from=builder /wheels /wheels
COPY ./app ./app

# Instala as dependências Python
RUN pip install --no-cache /wheels/*

# Cria e usa o usuário não-root
RUN useradd --create-home appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]