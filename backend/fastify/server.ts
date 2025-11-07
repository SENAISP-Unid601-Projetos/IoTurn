import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import { geminiRoutes } from './src/routes/geminiRoutes'
import './mqttSubscriber' 
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import { machineRoutes } from './src/routes/machineRoutes'
import { deviceRoutes } from './src/routes/deviceRoutes'
import { gatewayRoutes } from './src/routes/gatewayRoutes'
import { unifiedMachineRoute } from './src/routes/unifiedMachineRoute'
import { clientsRoutes } from './src/routes/clientsRoutes'
import fastifyJwt, { JWT } from '@fastify/jwt'
import '@fastify/cookie';
import { userRoutes } from './src/routes/userRoutes'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

dotenv.config()
const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: (origin, cb) => {
    // Se não houver origin (ex: Postman, cURL), permite também
    if (!origin) {
      cb(null, true);
      return;
    }
    // Permite qualquer origem da rede local
    cb(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})
//Registro plugin de cookies
fastify.register(require('@fastify/cookie'));
//Registro do plugin JWT
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  }
})

fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try{
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
})
fastify.register(geminiRoutes, {prefix:'/hermes'})
fastify.register(machineRoutes, {prefix: '/machines'});
fastify.register(deviceRoutes,{prefix: '/devices'});
fastify.register(gatewayRoutes,{prefix: '/gateways'});
fastify.register(unifiedMachineRoute,{prefix: '/unifiedMachines'});
fastify.register(clientsRoutes,{prefix: '/clients'});
fastify.register(userRoutes,{prefix:'/users'})

async function start() {
  try {
    await fastify.listen({ port: 3000,host: '0.0.0.0'})
    console.log('🚀 HTTP rodando em http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
