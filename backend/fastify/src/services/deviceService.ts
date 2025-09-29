import { deviceRepository, RawMapping } from "../infrastructure/repository/deviceRepository";
import { Device } from "@prisma/client";
export type MappingResponse = {
    nodeId: string,
    machineId: number
}
export const deviceService = {
    getFormatedMapping: async(): Promise<MappingResponse[]> =>{
        const result = await deviceRepository.findActiveMappings();
        const formatedMapping = result.map(device =>({
            nodeId: device.nodeId,
            machineId: device.machine.id
        }))
        return formatedMapping;
    },
    assignGatewayToDevice: async(gatewayId: number, deviceId: number): Promise<Device> =>{
        const isExistingDevice = await deviceRepository.findDeviceById(deviceId);
        if(!isExistingDevice){
            throw new Error("Dispositivo não encontrado.");
        }
        const result = await deviceRepository.assignGatewayToDevice(gatewayId, deviceId);
        if(!result){
            throw new Error("Falha ao atribuir gateway ao dispositivo.");
        }
        return result as Device;
    }
}