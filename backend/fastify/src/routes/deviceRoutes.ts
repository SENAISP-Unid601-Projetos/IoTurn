import { FastifyInstance } from "fastify";
import { deviceController } from "../controller/deviceController";

export async function deviceRoutes(fastify: FastifyInstance) {
    fastify.get('/getDeviceMapping', deviceController.getFormatedMappingController);
}