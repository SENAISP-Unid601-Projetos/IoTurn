import { FastifyReply } from "fastify";
import redis from "../config/redisCacher"; // Importe sua configuração do Redis

const sseClients = new Map<string, Set<FastifyReply>>();

const redisSubscriber = redis.duplicate();

redisSubscriber.psubscribe('machineOwnerChannel-*', (err) => {
    if (err) {
        console.error("[SSE Manager] Erro fatal ao se inscrever nos canais (psubscribe)", err);
    } else {
        console.log("[SSE Manager] Assinante Redis ouvindo o padrão: machineOwnerChannel-*");
    }
});

redisSubscriber.on('pmessage', (pattern, channel, message) => {
    console.log(`[SSE Manager] Mensagem recebida no canal: ${channel}`);

    const userId = channel.split('-')[1]; 
    
    if (!userId) return; 

    const clients = sseClients.get(userId);

    if (clients && clients.size > 0) {
        console.log(`[SSE Manager] Enviando mensagem para ${clients.size} cliente(s) do usuário ${userId}`);
        
        clients.forEach(reply => {
            if (!reply.raw.writableEnded) {
                reply.raw.write(`data: ${message}\n\n`);
            } else {
                console.log(`[SSE Manager] Removendo cliente (não-escriturável) do usuário ${userId}`);
                clients.delete(reply);
            }
        });
    }
    // else {
    //     console.log(`[SSE Manager] Mensagem recebida para ${channel}, mas nenhum cliente SSE está ouvindo.`);
    // }
});

export const sseManager = {
    addClient: (userId: string, reply: FastifyReply) => {
        if (!sseClients.has(userId)) {
            sseClients.set(userId, new Set());
        }
        
        sseClients.get(userId)!.add(reply);
        
        console.log(`[SSE Manager] Cliente adicionado para usuário: ${userId}. Total de clientes para ele: ${sseClients.get(userId)!.size}`);
    },

    removeClient: (userId: string, reply: FastifyReply) => {
        if (sseClients.has(userId)) {
            const clients = sseClients.get(userId)!;
            clients.delete(reply);
            
            console.log(`[SSE Manager] Cliente removido para usuário: ${userId}. Total restante: ${clients.size}`);
            
            if (clients.size === 0) {
                sseClients.delete(userId);
            }
        }
    }
};