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
    await fastify.listen({ port: 3000 })
    console.log('🚀 HTTP rodando em http://localhost:3000')

    const wss = new WebSocketServer({ port: 8080 })
    console.log('🛰️ WebSocket rodando em ws://localhost:8080')
    
    wss.on('connection', (socket) => {
      const clientId = wsHandler.addClient(socket)

      socket.on('message', (msg) => {
        console.log(`[${clientId}] disse: ${msg}`)
      })

      socket.on('close', () => {
        wsHandler.removeClient(clientId)
      })

      socket.send('🖖 Bem-vindo ao WebSocket!')
    })

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
