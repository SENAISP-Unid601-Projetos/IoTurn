# --- Etapa 1: Build da Aplicação ---
FROM node:20-alpine as builder
WORKDIR /app

# Mantenha esta ordem:
# 1. Copia arquivos de lock/dependências para cache
COPY package.json package-lock.json ./ 

# 2. ADICIONA ETAPA: Limpa o npm cache (opcional, mas seguro) e remove o lock file.
# Isso garante que a instalação a seguir seja "fresca".
RUN npm cache clean --force && rm -f package-lock.json

# 3. Executa a instalação das dependências (agora mais limpa)
RUN npm install

# 4. Copia o restante do código
COPY . .

# 5. Gera os arquivos estáticos
RUN npm run build

# --- Etapa 2: Imagem Final (Produção) ---
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]