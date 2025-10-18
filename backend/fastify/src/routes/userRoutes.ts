import { FastifyInstance } from "fastify";
import { userController } from "../controller/userController";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/create', userController.createUser)
    fastify.get('/getAll/:clientId', userController.findAllUsersActive)
    fastify.put('/update/:userId', userController.updateUser)
    fastify.delete('/delete/:userId', userController.softDelete)
}