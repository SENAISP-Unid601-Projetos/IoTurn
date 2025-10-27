# ---- Estágio 1: Builder ----
# Usamos a imagem "completa" (não-slim) do Python 3.11
# Ela já contém muitas bibliotecas e headers necessários.
FROM python:3.11 AS builder

WORKDIR /app

# 1. Instala o 'build-essential', que contém os compiladores C/C++ (gcc, g++, etc.)
# Isso é crucial para o hdbscan e suas dependências (como scikit-learn).
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY requirements.txt .

# 2. Agora o 'pip wheel' tem as ferramentas para compilar os pacotes
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# ---- Estágio 2: Final ----
# Voltamos para a imagem 'slim' para produção, mantendo o tamanho baixo
FROM python:3.11-slim

WORKDIR /app

# 3. Instala bibliotecas de RUNTIME que são comumente necessárias
# Pacotes científicos compilados (como os do scikit-learn) muitas vezes
# dependem da 'libgomp1' (para OpenMP/multithreading).
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copia as 'wheels' (pacotes pré-compilados) do estágio builder
COPY --from=builder /wheels /wheels

# Copia o código da sua aplicação
COPY ./app ./app
# Copia a pasta 'artifacts' local para dentro da imagem
COPY ./artifacts ./artifacts
# Instala as dependências a partir dos wheels locais.
# Isso será rápido, pois não há compilação nesta etapa.
RUN pip install --no-cache /wheels/*

# Cria e usa o usuário não-root (boa prática de segurança)
RUN useradd --create-home appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Comando final
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
