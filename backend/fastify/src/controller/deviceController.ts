import { FastifyReply, FastifyRequest } from "fastify";
import { deviceService } from "../services/deviceService";
import {z} from "zod";
import { DeviceStatus } from "@prisma/client";

const assignGatewaySchema = z.object({
    gatewayId: z.number().min(1),
    deviceId: z.number().min(1)
});

const createDeviceBodySchema = z.object({
    nodeId: z.string().nonempty(),
    description:z.string().nonempty(),
    status: z.enum(DeviceStatus).nonoptional()
})

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
    },
    createDevice: async(request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const deviceDataValid = createDeviceBodySchema.safeParse(request.body);
        if (!deviceDataValid.success) {
            reply.status(400).send({ message: 'Invalid request body', errors: deviceDataValid.error.message });
            return;
        }
        try {
            const result = await deviceService.createDevice(deviceDataValid.data)
            return reply.status(201).send(result);
        } catch (error) {
            console.error("Erro no controller ao criar dispositivo:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }

    }
}