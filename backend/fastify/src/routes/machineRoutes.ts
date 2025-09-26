import { FastifyInstance } from "fastify";
import { machineController } from "../controller/machineController";

export async function machineRoutes(fastify: FastifyInstance) {
    fastify.post('/createMachine', machineController.createMachineController)
}