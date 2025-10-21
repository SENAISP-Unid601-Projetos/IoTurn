import { FastifyInstance } from "fastify";
import { gatewayController } from "../controller/gatewayController";

export async function gatewayRoutes(fastify: FastifyInstance){
    fastify.post('/create', gatewayController.createGatewayController);
    fastify.get('/allGateways/:id',gatewayController.findAllGatewaysController);
    fastify.put('/update/:id',gatewayController.updateGatewayController);
    fastify.delete('/delete/:id', gatewayController.deleteGatewayController)
}