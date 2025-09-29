import { FastifyReply, FastifyRequest } from "fastify";
import { deviceService } from "../services/deviceService";
import {z} from "zod";

const assignGatewaySchema = z.object({
    gatewayId: z.number().min(1),
    deviceId: z.number().min(1)
});

export const deviceController = {
    getFormatedMappingController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try {
            const result = await deviceService.getFormatedMapping();
            reply.status(200).send(result)
            return
        } catch (error) {
            console.error("Erro no controller ao buscar mapeamentos:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
            return;
        }
    },
    assignGatewayToDeviceController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const parseResult = assignGatewaySchema.safeParse(request.body);
        if (!parseResult.success) {
            reply.status(400).send({ message: 'Invalid request body', errors: parseResult.error.message });
            return;
        }
        const { gatewayId, deviceId } = parseResult.data;
        try {
            const result = await deviceService.assignGatewayToDevice(gatewayId, deviceId);
            reply.status(200).send(result);
            return;
        } catch (error) {
            console.error("Erro no controller ao atribuir gateway ao dispositivo:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
            return;
        }
    }
}