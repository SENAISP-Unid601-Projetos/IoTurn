import { FastifyInstance } from "fastify";
import { machineController } from "../controller/machineController";

export async function machineRoutes(fastify: FastifyInstance) {
    fastify.post('/create', machineController.createMachineController)
    fastify.get('/getAll/:id', machineController.getAllUsersMachineController)
    fastify.put('/update/:id', machineController.updateMachine)
    fastify.delete('/delete/:id', machineController.softDelete)
}