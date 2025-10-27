# ---- Estágio 1: Builder ----
# Constrói o app a partir da raiz do projeto
FROM node:20-alpine AS builder
WORKDIR /app

# Copia o package.json (da raiz)
COPY package*.json ./

# Instala TODAS as dependências do monorepo
RUN npm install

# Copia todo o código-fonte (o .dockerignore vai pular node_modules, .env, etc)
COPY . .

# Gera o Prisma Client (especificando o caminho do schema)
# CORREÇÃO: Removido 'backend/' do caminho do schema
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compila o TypeScript (usando o package.json e tsconfig.json da raiz)
# ISSO REQUER QUE VOCÊ TENHA O SCRIPT "build": "tsc" NO SEU package.json
RUN npm run build

# ---- Estágio 2: Final ----
# Imagem final de produção
FROM node:20-alpine AS final
WORKDIR /app

ENV NODE_ENV=production

# Cria o usuário não-root
RUN addgroup --system nonroot && adduser --system --ingroup nonroot nonroot

# Copia o package.json da raiz e instala SOMENTE as dependências de PRODUÇÃO
COPY package*.json ./
RUN npm install --omit=dev

# Do 'builder', copia apenas as partes que precisamos para rodar o Fastify
# 1. O código transpilado do Fastify
# CORREÇÃO: Copia o *conteúdo* de /app/dist/ para o diretório de destino
COPY --from=builder /app/dist/ ./backend/fastify/dist/

# 2. O schema do Prisma E o cliente gerado (necessário para 'migrate' e 'runtime')
# CORREÇÃO: Removido 'backend/' do caminho do schema
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 3. O script de entrypoint (que está na pasta fastify)
COPY --from=builder /app/backend/fastify/entrypoint.sh ./backend/fastify/entrypoint.sh
RUN chmod +x ./backend/fastify/entrypoint.sh

# Muda para o usuário seguro
USER nonroot

# Expõe a porta
EXPOSE 3000

# Roda o script de entrypoint (o caminho agora é relativo à raiz /app)
CMD ["./backend/fastify/entrypoint.sh"]

