import { FastifyInstance } from "fastify";
import { deviceController } from "../controller/deviceController";

export async function deviceRoutes(fastify: FastifyInstance) {
    fastify.get('/allDevices/:id', deviceController.findAllDevicesController)
    fastify.get('/getDeviceMapping', deviceController.getFormatedMappingController);
    fastify.post('/assignGatewayToDevice',deviceController.assignGatewayToDeviceController);
    fastify.post('/create', deviceController.createDevice);
    fastify.put('/update/:id', deviceController.updateDeviceController)
    fastify.delete('delete/:id', deviceController.deleteDeviceController)
}