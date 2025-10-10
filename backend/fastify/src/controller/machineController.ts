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

const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, { message: "ID must be a number" })
});
export const machineController = {
    createMachineController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try {
            const machineData = createMachineBodySchema.safeParse(request.body);
            if (!machineData.success) {
                reply.status(400).send({ message: 'Invalid request body', errors: machineData.error.message });
                return;
            }
            const result = await machineService.createMachine(machineData.data as NewMachineData);
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

    },
    getAllUsersMachineController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try {
            const paramsValidation = idParamSchema.safeParse(request.params);
            if (!paramsValidation.success) {
                reply.status(400).send({ message: 'Invalid request parameters', errors: paramsValidation.error.message });
                return;
            }
            const userId = parseInt((paramsValidation.data as {id: string}).id, 10);
            if (isNaN(userId)) {
                reply.status(400).send({ message: 'Invalid user ID' });
                return;
            }
            const packageData = await machineService.getAllUsersMachine(userId);
            return reply.status(200).send(packageData);
        } catch (error) {
            console.error("Erro ao buscar máquinas do usuário:", error);
            return reply.status(500).send({error: "Erro interno do servidor ao buscar máquinas do usuário."});
        }
    }
}