# Dockerfile

# 1. Imagem base
FROM python:3.11-slim

# 2. Diretório de trabalho dentro do container
WORKDIR /app

# 3. Copia e instala as dependências primeiro para usar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copia o código da sua aplicação
#    Esta linha copia o conteúdo da sua pasta local "app" para o diretório de trabalho "/app" no container.
COPY ./app .

# 5. Comando para iniciar a aplicação
#    Este comando não muda, pois o WORKDIR é /app, e dentro dele teremos o main.py.
#    O Gunicorn vai procurar pelo objeto "app" dentro do arquivo "main.py".
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "-b", "0.0.0.0:8000"]