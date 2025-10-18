import { FastifyReply, FastifyRequest } from 'fastify';
import {z} from 'zod';
import { gatewayService } from '../services/gatewayService';
import { NewGatewayData } from '../infrastructure/repository/gatewayRepository';
import { DeviceStatus } from '@prisma/client';


const createGatewayBodySchema = z.object({
    gatewayId: z.string(),
    description: z.string(),
    status:z.enum(DeviceStatus)
})

export const gatewayController = {
    createGatewayController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const parseResult = createGatewayBodySchema.safeParse(request.body);
        if (!parseResult.success) {
            reply.status(400).send({ message: 'Invalid request body', errors: parseResult.error.message });
            return;
        }
        const gatewayData = parseResult.data;
        try {
            const result = await gatewayService.createGateway(gatewayData as NewGatewayData);
            return reply.status(201).send(result);
        } catch (error) {
            console.error("Erro ao criar gateway:", error);
            if(error instanceof z.ZodError){
                reply.status(400).send({ 
                    error: "Dados de entrada inválidos.", 
                    details: error.message
                });
                return; 
            }
            return reply.status(500).send({error: "Erro interno do servidor ao criar gateway."});
        }
    }
}