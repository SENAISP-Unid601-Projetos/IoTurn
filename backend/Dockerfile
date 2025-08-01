# ---- Estágio de Build (apelidado de "builder") ----
# Usamos uma imagem Node como base e damos o apelido 'builder'
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependências e instala TUDO (dev e prod)
COPY package*.json ./
RUN npm install

# Copia todo o resto do código-fonte
COPY . .

# Roda o build do TypeScript para gerar a pasta /dist
RUN npm run build

# ---- Estágio de Produção (a imagem final) ----
# Começamos de uma imagem limpa para um resultado menor
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia apenas o package.json e instala somente as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o schema do Prisma do estágio 'builder'
COPY --from=builder /usr/src/app/prisma ./prisma

# AGORA, com o schema no lugar, geramos o Prisma Client
RUN npx prisma generate

# Por último, copia o código já compilado da pasta /dist
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333

# Inicia a aplicação
CMD ["node", "dist/server.js"]