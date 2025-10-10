import { FastifyInstance } from "fastify";
import { unifiedMachineController } from "../controller/unifiedMachineController";

export async function unifiedMachineRoute(fastify: FastifyInstance) {
    fastify.get('/state/:unifiedMachineId/:startDate/:endDate',unifiedMachineController.getUnifiedMachineDataController)
}