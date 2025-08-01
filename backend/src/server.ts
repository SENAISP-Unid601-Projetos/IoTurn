// backend/src/server.ts
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

// Inicializa o Fastify
const app = Fastify({
  logger: true, // Habilita um logger simples
});

// Inicializa o Prisma Client
const prisma = new PrismaClient();

// Rota 1: Criar um novo usuário
app.post('/users', async (request, reply) => {
  try {
    const { name, email } = request.body as { name: string; email: string };

    if (!email) {
      return reply.status(400).send({ message: 'Email is required' });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return reply.status(201).send(newUser);
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ message: 'Error creating user' });
  }
});

// Rota 2: Listar todos os usuários
app.get('/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany();
    return reply.send(users);
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ message: 'Error fetching users' });
  }
});

// Função para iniciar o servidor
const start = async () => {
  try {
    // O host '0.0.0.0' é essencial para o Docker conseguir expor a porta corretamente
    await app.listen({ port: 3333, host: '0.0.0.0' });
    app.log.info(`🚀 Server listening on http://localhost:3333`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();