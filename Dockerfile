# IoTurn/Dockerfile (Versão Definitiva)
# --- ESTÁGIO 1: BUILD (Corrigido para forçar reinstalação limpa) ---
FROM node:20-slim as builder
WORKDIR /app

# 1. Copia o package.json para cachear a camada de instalação
COPY package.json ./ 

# 2. Instala as dependências de forma limpa (ci é melhor que install para builds)
# Se npm ci falhar por falta de lockfile, use `npm install --legacy-peer-deps`
RUN npm install

# 3. Copia o restante do código-fonte (incluindo package-lock.json)
COPY . .

# 4. Executa o build do Vite (cria a pasta 'dist')
RUN npm run build

# --- ESTÁGIO 2: IMAGEM FINAL (Servindo com Nginx) ---
FROM nginx:stable-alpine
EXPOSE 80

# 1. Copia a configuração do Nginx (para o React Router)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf 

# 2. Copia os arquivos estáticos gerados pelo Vite (pasta 'dist')
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]