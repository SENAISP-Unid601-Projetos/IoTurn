import { FastifyReply } from "fastify";
import redis from "../config/redisCacher"; // Importe sua configuração do Redis

/**
 * Gerenciador de Clientes SSE (Fan-Out)
 *
 * A chave do Map é o 'userId' (ex: "1" do canal "machineOwnerChannel-1").
 * O valor é um Set de 'FastifyReply' (um Set pois o mesmo usuário pode
 * ter múltiplas abas abertas, e queremos enviar para todas).
 */
const sseClients = new Map<string, Set<FastifyReply>>();

// 1. Crie UM ÚNICO cliente Redis para ser o Assinante (Subscriber)
const redisSubscriber = redis.duplicate();

// 2. Use PSUBSCRIBE para ouvir um Padrão de canal
// Isso é muito mais eficiente do que N 'subscribe' individuais.
redisSubscriber.psubscribe('machineOwnerChannel-*', (err) => {
    if (err) {
        console.error("[SSE Manager] Erro fatal ao se inscrever nos canais (psubscribe)", err);
    } else {
        console.log("[SSE Manager] Assinante Redis ouvindo o padrão: machineOwnerChannel-*");
    }
});

// 3. O Distribuidor (Fan-Out)
// Este 'on pmessage' será chamado UMA VEZ por mensagem publicada
redisSubscriber.on('pmessage', (pattern, channel, message) => {
    console.log(`[SSE Manager] Mensagem recebida no canal: ${channel}`);

    // Extrai o 'userId' do nome do canal (ex: "machineOwnerChannel-1" -> "1")
    const userId = channel.split('-')[1]; 
    
    if (!userId) return; // Canal inválido, ignora

    // Busca os clientes (replies) associados a esse userId
    const clients = sseClients.get(userId);

    if (clients && clients.size > 0) {
        console.log(`[SSE Manager] Enviando mensagem para ${clients.size} cliente(s) do usuário ${userId}`);
        
        // Envia a mensagem para cada cliente (aba) conectado
        clients.forEach(reply => {
            // Verifica se o cliente ainda está conectado/pode escrever
            if (!reply.raw.writableEnded) {
                reply.raw.write(`data: ${message}\n\n`);
            } else {
                // Limpeza: remove cliente que não está mais 'writable'
                console.log(`[SSE Manager] Removendo cliente (não-escriturável) do usuário ${userId}`);
                clients.delete(reply);
            }
        });
    }
    // else {
    //     console.log(`[SSE Manager] Mensagem recebida para ${channel}, mas nenhum cliente SSE está ouvindo.`);
    // }
});

// 4. Funções para Adicionar e Remover clientes (que serão usadas nas rotas)
export const sseManager = {
    /**
     * Adiciona um novo cliente SSE (ex: uma nova aba de browser) ao gerenciador.
     */
    addClient: (userId: string, reply: FastifyReply) => {
        // Se for o primeiro cliente para este usuário, crie o Set
        if (!sseClients.has(userId)) {
            sseClients.set(userId, new Set());
        }
        
        // Adiciona o 'reply' ao Set daquele usuário
        sseClients.get(userId)!.add(reply);
        
        console.log(`[SSE Manager] Cliente adicionado para usuário: ${userId}. Total de clientes para ele: ${sseClients.get(userId)!.size}`);
    },

    /**
     * Remove um cliente SSE do gerenciador (ex: o usuário fechou a aba).
     */
    removeClient: (userId: string, reply: FastifyReply) => {
        if (sseClients.has(userId)) {
            const clients = sseClients.get(userId)!;
            clients.delete(reply);
            
            console.log(`[SSE Manager] Cliente removido para usuário: ${userId}. Total restante: ${clients.size}`);
            
            // Opcional: limpar o map se for o último cliente desse usuário
            if (clients.size === 0) {
                sseClients.delete(userId);
            }
        }
    }
};