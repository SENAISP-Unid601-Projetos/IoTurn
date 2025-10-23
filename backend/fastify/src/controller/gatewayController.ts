import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { gatewayService } from '../services/gatewayService';
import { NewGatewayData } from '../infrastructure/repository/gatewayRepository';
import { DeviceStatus } from '@prisma/client';


const createGatewayBodySchema = z.object({
    gatewayId: z.string().nonempty("O 'gatewayId' (identificador) é obrigatório."),
    description: z.string().nonempty("A 'description' (descrição) é obrigatória."),
    status: z.enum(DeviceStatus),
    clientId: z.coerce.number().int().min(1, "O ID do cliente é obrigatório.")
});

const gatewayParamsSchema = z.object({
    id: z.coerce.number().int().min(1, "O ID do gateway é obrigatório.")
});

const userParamsSchema = z.object({
    id: z.coerce.number().int().min(1, "O ID do user é obrigatório.")
});

const updateGatewayBodySchema = z.object({
    description: z.string().optional(),
    status: z.enum(DeviceStatus).optional()
}).strip();

export const gatewayController = {
    
    createGatewayController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const parseResult = createGatewayBodySchema.safeParse(request.body);
        if (!parseResult.success) {
            reply.status(400).send({ message: 'Dados de entrada inválidos.', errors: parseResult.error.message });
            return;
        }
        
        const gatewayData = parseResult.data; 
        
        try {
            const result = await gatewayService.createGateway(gatewayData);
            return reply.status(201).send(result);

        } catch (error) {
            console.error("Erro no controller ao criar gateway:", error);
            if (error instanceof Error) {
                if (error.message.includes("já existe")) {
                    reply.status(409).send({ message: error.message });
                    return;
                }
            }
            
            return reply.status(500).send({ message: "Erro interno do servidor ao criar gateway." });
        }
    },
    findAllGatewaysController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const parseResult =  userParamsSchema.safeParse(request.params)
            if (!parseResult.success) {
                reply.status(400).send({ message: 'Dados de entrada inválidos.', errors: parseResult.error.message });
                return;
            }

         
            const gateways = await gatewayService.findAllGateways(parseResult.data.id);

            reply.status(200).send(gateways);

        } catch (error) {
            console.error("Erro no controller ao buscar gateways:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    },

    updateGatewayController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const paramsParse = gatewayParamsSchema.safeParse(request.params);
            if (!paramsParse.success) {
                reply.status(400).send({ message: 'ID do gateway inválido.', errors: paramsParse.error.message });
                return;
            }
            const { id: gatewayId } = paramsParse.data;

            const bodyParse = updateGatewayBodySchema.safeParse(request.body);
            if (!bodyParse.success) {
                reply.status(400).send({ message: 'Corpo da requisição inválido.', errors: bodyParse.error.message });
                return;
            }
            const updateData = bodyParse.data;

         
            const updatedGateway = await gatewayService.updateGateway(gatewayId, updateData);

       
            reply.status(200).send(updatedGateway);

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    reply.status(404).send({ message: error.message });
                    return;
                }
                if (error.message.includes("cancelado") || error.message.includes("Nenhum dado")) {
                    reply.status(400).send({ message: error.message }); 
                    return;
                }
            }
            console.error("Erro no controller ao atualizar gateway:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    },

    deleteGatewayController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            
            const paramsParse = gatewayParamsSchema.safeParse(request.params);
            if (!paramsParse.success) {
                reply.status(400).send({ message: 'ID do gateway inválido.', errors: paramsParse.error.message });
                return;
            }
            const { id: gatewayId } = paramsParse.data;

            const deletedGateway = await gatewayService.deleteGateway(gatewayId);

            reply.status(200).send(deletedGateway);

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    reply.status(404).send({ message: error.message }); 
                    return;
                }
            }
            console.error("Erro no controller ao deletar gateway:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
}