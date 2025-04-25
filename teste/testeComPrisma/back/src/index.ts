import { FastifyInstance } from 'fastify';

export default async function userRoutes(app: FastifyInstance) {
  app.get('/users', async (request, reply) => {
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

  app.post('/users', async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };
    const user = await app.prisma.user.create({
      data: { name, email },
    });
    return user;
  });
}
