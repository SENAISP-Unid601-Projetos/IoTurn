// machineRoutes.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { machineController } from "../controller/machineController";
// REMOVIDO: import redis from "../config/redisCacher";
import { sseManager } from "../services/sseManeger"; // <-- IMPORTE O NOVO MANAGER

export async function machineRoutes(fastify: FastifyInstance) {
    
    fastify.post('/create', machineController.createMachineController)
    fastify.get('/getAll/:id', machineController.getAllUsersMachineController)
    fastify.put('/update/:id', machineController.updateMachine)
    fastify.delete('/delete/:id', machineController.softDelete)
    fastify.get('/getMachine/:clientId/:machineId', machineController.getMachineByClientAndIdController)
    
    /**
     * ROTA SSE REFEITA (AGORA CORRETA)
     */
    fastify.get('/stream/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        
        // 1. Configurar os headers
        const HEADERS = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*', // Mantenha se precisar de CORS
        };
        reply.raw.writeHead(200, HEADERS);

        // 2. Obter o ID do usuário
        const params = request.params as { id: string };
        const user = params.id;
        if (!user) {
            return reply.raw.end(); 
        }

        // 3. Adicionar o cliente (reply) ao Manager
        // O sseManager vai cuidar de associar este 'reply' ao 'user'
        sseManager.addClient(user, reply);

        // 4. Enviar mensagem de conexão (só para este cliente)
        console.log(`[SSE] Usuário ${user} conectado ao stream.`);
        reply.raw.write(`event: connected\ndata: ${JSON.stringify({ message: "Conectado ao stream" })}\n\n`);

        // 5. Remover o cliente do Manager ao desconectar
        request.raw.on('close', () => {
            console.log(`[SSE] Usuário ${user} desconectado.`);
            sseManager.removeClient(user, reply);
            
            // Garante que a resposta seja finalizada se ainda não foi
            if (!reply.raw.writableEnded) {
                reply.raw.end();
            }
        });
    });
}