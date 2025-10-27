#!/bin/sh

# 'set -e' faz o script parar se qualquer comando falhar
set -e

# 1. Roda as migrações do Prisma
echo "Running database migrations..."
npx prisma migrate deploy

# 2. Inicia a aplicação
echo "Starting Fastify application..."
# Aponta para o seu 'server.ts' transpilado, que está em 'fastify/dist/server.js'
exec node backend/fastify/dist/server.js
