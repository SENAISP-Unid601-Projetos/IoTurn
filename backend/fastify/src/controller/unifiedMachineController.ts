import z from "zod";
import { unifiedMachineStateRepository } from "../infrastructure/repository/unifiedMachineStateRepository";
import { FastifyReply, FastifyRequest } from "fastify";

const paramsUnifiedMachineIdSchema = z.object({
    unifiedMachineId: z.coerce.number().int().positive(), //Coerce transforma string em number, no caso pega o que vem na url e transforma em number
    startDate: z.coerce.date(), 
    endDate: z.coerce.date()  
});

export const unifiedMachineController = {
    getUnifiedMachineDataController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const params = paramsUnifiedMachineIdSchema.safeParse(request.params);
            if (!params.success) {
                reply.status(400).send({ message: 'Invalid request parameters', errors: params.error.message });
                return;
            }
            const { unifiedMachineId, startDate, endDate } = params.data;
            const result = await unifiedMachineStateRepository.findAll(unifiedMachineId, startDate, endDate);
            return reply.status(200).send(result);
        } catch (error) {
            console.error("Error fetching unified machine data:", error);
            return reply.status(500).send({ error: "Internal server error while fetching unified machine data." });
        }
    }
}