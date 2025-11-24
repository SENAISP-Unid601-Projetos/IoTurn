// machineRoutes.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { machineController } from "../controller/machineController";
import { sseManager } from "../services/sseManeger"; 

export async function machineRoutes(fastify: FastifyInstance) {
    
    fastify.post('/create', machineController.createMachineController)
    fastify.get('/getAll/:id', machineController.getAllUsersMachineController)
    fastify.put('/update/:id', machineController.updateMachine)
    fastify.delete('/delete/:id', machineController.softDelete)
    fastify.get('/getMachine/:clientId/:machineId', machineController.getMachineByClientAndIdController)
    fastify.get('/stream/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        
        const HEADERS = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*', 
        };
        reply.raw.writeHead(200, HEADERS);

        const params = request.params as { id: string };
        const user = params.id;
        if (!user) {
            return reply.raw.end(); 
        }

        sseManager.addClient(user, reply);

        console.log(`[SSE] Usuário ${user} conectado ao stream.`);
        reply.raw.write(`event: connected\ndata: ${JSON.stringify({ message: "Conectado ao stream" })}\n\n`);

        request.raw.on('close', () => {
            console.log(`[SSE] Usuário ${user} desconectado.`);
            sseManager.removeClient(user, reply);
            
            if (!reply.raw.writableEnded) {
                reply.raw.end();
            }
        });
    });
    fastify.get('/notify/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        
        const HEADERS = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*', 
        };
        reply.raw.writeHead(200, HEADERS);

        const params = request.params as { id: string };
        const user = params.id;
        if (!user) {
            return reply.raw.end(); 
        }

        sseManager.addClient(user, reply);

        console.log(`[SSE] Usuário ${user} conectado ao stream.`);
        reply.raw.write(`event: connected\ndata: ${JSON.stringify({ message: "Conectado ao stream" })}\n\n`);

        request.raw.on('close', () => {
            console.log(`[SSE] Usuário ${user} desconectado.`);
            sseManager.removeClient(user, reply);
            
            if (!reply.raw.writableEnded) {
                reply.raw.end();
            }
        });
    });
}