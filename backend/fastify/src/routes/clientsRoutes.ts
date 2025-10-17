import { FastifyInstance } from "fastify";
import { clientsController } from "../controller/clientsController";

export async function clientsRoutes(fastify: FastifyInstance) {
    fastify.post('/login', clientsController.loginController)
    fastify.post('/createClient', clientsController.newClientController);
}