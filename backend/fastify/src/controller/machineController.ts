import { FastifyReply, FastifyRequest } from "fastify";
import { NewMachineData } from "../infrastructure/repository/machineRepository";
import { machineService } from "../services/machineService";
import {z} from 'zod';
import { Status } from "@prisma/client";

const createMachineBodySchema = z.object({
    name: z.string().nonempty("O nome não pode ser vazio"),
    serialNumber: z.string().nonempty("O Numero da serial não pode ser vazio"),
    model: z.string().nonempty("O modelo não pode ser vazio"),
    manufacturer: z.string().nonempty("O Fabricante não pode ser vazio"),
    clientId: z.number().positive("O ID do cliente deve ser um número positivo."),
    responsibleUserId: z.number().positive("O ID do responsavel deve ser um número positivo."),
    status:z.enum(Status),
    gatewayId: z.number().positive().optional(),
    deviceId: z.number().positive().nonoptional("É necessário um ID para fazer o vinculo")
});
const updateMachineBodySchema = z.object({
    name: z.string().optional(),
    model: z.string().optional(),
    manufacturer: z.string().optional(),
    serialNumber: z.string().optional(),
    status: z.enum(Status),
    responsibleUserId: z.int().positive().optional(),
})

const idParamSchema = z.object({
    id: z.coerce.number().int().positive("O ID do usuário deve ser um número positivo.")
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
            const packageData = await machineService.getAllUsersMachine(paramsValidation.data.id);
            return reply.status(200).send(packageData);
        } catch (error) {
            console.error("Erro ao buscar máquinas do usuário:", error);
            return reply.status(500).send({error: "Erro interno do servidor ao buscar máquinas do usuário."});
        }
    },
    updateMachine: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try{
            const paramsValidation = idParamSchema.safeParse(request.params);

            if (!paramsValidation.success) {
                reply.status(400).send({ message: 'Parâmetro [Id] inválido', errors: paramsValidation.error.message });
                return;
            }

            const packageData = updateMachineBodySchema.safeParse(request.body);

            if(!packageData.success){
                reply.status(400).send({ message: 'Invalid request body', errors: packageData.error.message });
                return;
            }

            const result = await machineService.updateMachine(paramsValidation.data.id,packageData.data)
            return reply.status(201).send(result);

        } catch (error){
            console.error("Erro ao atualizar máquina:", error);
            return reply.status(500).send({error: "Erro interno do servidor ao atualizar máquina."}); 
        }
    },
    softDelete: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try {
            const paramsValidation = idParamSchema.safeParse(request.params);

            if(!paramsValidation.success){
                 reply.status(400).send({ message: 'Parâmetro [Id] inválido', errors: paramsValidation.error.message });
                return;
            }
            const result = await machineService.deleteMachine(paramsValidation.data.id)
            return reply.status(202).send(result);
        } catch (error) {
            console.error("Erro ao deletar máquina:", error);
            return reply.status(500).send({error: "Erro interno do servidor ao deletar máquina."}); 
        }
    }
}