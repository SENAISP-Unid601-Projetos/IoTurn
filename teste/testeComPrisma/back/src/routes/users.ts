import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface CreateUserBody {
  name: string;
  email: string;
}

export default async function (app: FastifyInstance) {
  app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const search = (request.query as any).search || '';

    const users = await app.prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return users;
  });

  app.post('/users', async (request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
    const { name, email } = request.body;

    const user = await app.prisma.user.create({
      data: { name, email },
    });

    return user;
  });
}
