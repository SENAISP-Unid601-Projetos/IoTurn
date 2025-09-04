import Fastify from 'fastify'
import { geminiRoutes } from './src/routes/geminiRoutes'
import './mqttSubscriber' 
import { WebSocketServer } from 'ws'
import { wsHandler } from './src/websocket/wsHandler'
import cors from '@fastify/cors'

const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: true, 
})

fastify.register(geminiRoutes)


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
