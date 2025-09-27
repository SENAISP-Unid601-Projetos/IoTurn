import { FastifyInstance } from "fastify";
import { gatewayController } from "../controller/gatewayController";

export async function gatewayRoutes(fastify: FastifyInstance){
    fastify.post('/createGateway', gatewayController.createGatewayController);
}