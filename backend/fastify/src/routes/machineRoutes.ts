import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { machineController } from "../controller/machineController";
import redis from "../config/redisCacher";

export async function machineRoutes(fastify: FastifyInstance) {
    fastify.post('/create', machineController.createMachineController)
    fastify.get('/getAll/:id', machineController.getAllUsersMachineController)
    fastify.put('/update/:id', machineController.updateMachine)
    fastify.delete('/delete/:id', machineController.softDelete)
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

        const subscriber = redis.duplicate(); 
        const channel = `machineOwnerChannel-${user}`;

        subscriber.subscribe(channel, (err) => {
            if (err) {
                console.error(`Erro ao se inscrever no canal Redis: ${channel}`, err.message);
                return reply.raw.end();
            } else {
                console.log(`[SSE] Usuário ${user} inscrito com sucesso no canal: ${channel}`);
                reply.raw.write(`event: connected\ndata: ${JSON.stringify({ message: "Conectado ao stream" })}\n\n`);
            }
        });

        subscriber.on('message', (subscribedChannel, message) => {
            if (subscribedChannel === channel) {
                reply.raw.write(`data: ${message}\n\n`);
            }
        });

        request.raw.on('close', () => {
            console.log(`[SSE] Usuário ${user} desconectado. Fechando inscrição do canal: ${channel}`);
            subscriber.removeAllListeners('message');
            subscriber.unsubscribe(channel);
            subscriber.quit();
            if (!reply.raw.writableEnded) {
                reply.raw.end();
            }
        });
    });
}