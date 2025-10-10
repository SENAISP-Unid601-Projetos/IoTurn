import { FastifyInstance } from "fastify";
import { clientsController } from "../controller/clientsController";

export async function clientsRoutes(fastify: FastifyInstance) {
    fastify.post('/loginTemp', clientsController.loginTempController)
}