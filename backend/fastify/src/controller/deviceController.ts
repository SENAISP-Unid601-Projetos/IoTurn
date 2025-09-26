import { FastifyReply, FastifyRequest } from "fastify";
import { deviceService } from "../services/deviceService";


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
    }
}