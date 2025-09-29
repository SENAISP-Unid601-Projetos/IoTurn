import { deviceRepository, RawMapping } from "../infrastructure/repository/deviceRepository";
import { gatewayRepository } from "../infrastructure/repository/gatewayRepository";
import refreshMappings from "../../mqttSubscriber";
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
    assignGatewayToDevice: async(gatewayId: number, deviceId: number): Promise<void> =>{
        const isExistingDevice = await deviceRepository.findDeviceById(deviceId);
        if(!isExistingDevice){
            throw new Error("Dispositivo não encontrado.");
        }
        const result = await deviceRepository.assignGatewayToDevice(gatewayId, deviceId);
        if(!result || !result.gatewayId){
            throw new Error("Falha ao atribuir gateway ao dispositivo.");
        }
        const gatewayToNotify = await gatewayRepository.findGatewayById(result.gatewayId);

         if (!gatewayToNotify) {
            throw new Error(`Inconsistência de dados: Gateway com ID ${result.gatewayId} não encontrado.`); 
        }
        refreshMappings(gatewayToNotify.gatewayId)
    }
}