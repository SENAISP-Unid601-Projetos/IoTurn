// wsHandler.ts
import { WebSocket } from 'ws'

const clients = new Map<string, WebSocket>()
function generateClientId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export const wsHandler = {
  addClient: (socket: WebSocket): string => {
    const id = generateClientId()
    clients.set(id, socket)
    console.log(`🔌 Cliente conectado: ${id}`)
    return id
  },

  removeClient: (id: string) => {
    clients.delete(id)
    console.log(`❌ Cliente removido: ${id}`)
  },
  existsClient: (): boolean => {
    const isConnected = clients.size > 0;
    if (!isConnected) {
      console.warn("⚠️ Não há clientes conectados!");
    }
    return isConnected;
  },
  broadcast: (message: string) => {
    for (const [id, socket] of clients) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message)
      }
    }
    console.log(`📢 Broadcast enviado: ${message}`)
  },

  sendToClient: (id: string, message: string) => {
    const socket = clients.get(id)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message)
      console.log(`📨 Mensagem enviada para ${id}: ${message}`)
    } else {
      console.warn(`⚠️ Cliente ${id} não está disponível`)
    }
  }
}
