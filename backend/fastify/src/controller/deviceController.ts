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
const deviceParamsSchema = z.object({
    id: z.coerce.number().int().min(1, "O ID do dispositivo é obrigatório.")
});
const UserIdParamsSchema = z.object({
    id: z.coerce.number().int().min(1, "O ID do usuario é obrigatório.")
});
const updateDeviceBodySchema = z.object({
    description: z.string().optional(),
    status: z.enum(DeviceStatus).optional()
}).strip();

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

    },
    findAllDevicesController: async(request:FastifyRequest,reply: FastifyReply): Promise<void> => {
        try {
            const userId = UserIdParamsSchema.safeParse(request.params)

            if (!userId.success) {
                reply.status(400).send({ message: 'Invalid request body', errors: userId.error.message });
                return;
            }
            const devices = await deviceService.findAllDevices(userId.data.id);

            reply.status(200).send(devices);

        } catch (error) {
            console.error("Erro no controller ao buscar dispositivos:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    },

    updateDeviceController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const paramsParse = deviceParamsSchema.safeParse(request.params);
            if (!paramsParse.success) {
                reply.status(400).send({ message: 'ID do dispositivo inválido.', errors: paramsParse.error.message });
                return;
            }
            const { id: deviceId } = paramsParse.data;

            const bodyParse = updateDeviceBodySchema.safeParse(request.body);
            if (!bodyParse.success) {
                reply.status(400).send({ message: 'Corpo da requisição inválido.', errors: bodyParse.error.message });
                return;
            }
            const updateData = bodyParse.data;

            const updatedDevice = await deviceService.updateDevice(deviceId, updateData);

            reply.status(200).send(updatedDevice);

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
            // Erro genérico (500)
            console.error("Erro no controller ao atualizar dispositivo:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    },
    deleteDeviceController: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const paramsParse = deviceParamsSchema.safeParse(request.params);
            if (!paramsParse.success) {
                reply.status(400).send({ message: 'ID do dispositivo inválido.', errors: paramsParse.error.message });
                return;
            }
            const deviceId = paramsParse.data;

            const deletedDevice = await deviceService.deleteDevice(deviceId.id);

            reply.status(200).send(deletedDevice);

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrado")) {
                    reply.status(404).send({ message: error.message }); 
                    return;
                }
            }
            // Erro genérico (500)
            console.error("Erro no controller ao deletar dispositivo:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
}