import { FastifyReply, FastifyRequest } from "fastify";
import { NewMachineData } from "../infrastructure/repository/machineRepository";
import { machineService } from "../services/machineService";
import {z} from 'zod';

const createMachineBodySchema = z.object({
    name: z.string(),
    serialNumber: z.string(),
    nodeId: z.string(),
    model: z.string().optional(),
    manufacturer: z.string().optional(),
    description: z.string().optional(),
    clientId: z.number(),
    responsibleUserId: z.number(),
});
export const machineController = {
    createMachineController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try {
            const machineData = createMachineBodySchema.parse(request.body);

            const result = await machineService.createMachine(machineData as NewMachineData);
            return reply.status(201).send(result);
        } catch (error) {
            console.error("Erro ao criar máquina:", error);

            if (error instanceof z.ZodError) {
                reply.status(400).send({ 
                    error: "Dados de entrada inválidos.", 
                    details: error.message
                });
                return; 
            }
            if((error as Error).message.includes("Número de série já existe")){
                return reply.status(409).send({error: (error as Error).message});
            }
            return reply.status(500).send({error: "Erro interno do servidor ao criar máquina."});
        }

    }
}