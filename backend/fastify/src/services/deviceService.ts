import { CreateDeviceData, deviceRepository, RawMapping, UpdateDeviceData } from "../infrastructure/repository/deviceRepository";
import { gatewayRepository } from "../infrastructure/repository/gatewayRepository";
import refreshMappings from "../../mqttSubscriber";
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
    },
    createDevice: async (data: CreateDeviceData): Promise<Device> =>{
        const result = await deviceRepository.createDevice(data);
        if(!result){
            throw new Error("Erro ao crir dispositivo")
        }

        return result as Device
    },
    findAllDevices: async (userId: number): Promise<Device[]> => {
        if (!userId || typeof userId !== 'number' || isNaN(userId)) {
            throw new Error("ID do usuário inválido.");
        }

        try {
            const devices = await deviceRepository.findAllDevices(userId);
            return devices;
        } catch (error) {
            console.error("Erro no service ao buscar dispositivos:", error);
            throw new Error("Falha ao buscar dispositivos."); 
        }
    },
    updateDevice: async (deviceId: number, data: UpdateDeviceData): Promise<Device> => {
        if (!deviceId || typeof deviceId !== 'number' || isNaN(deviceId)) {
            throw new Error("ID do dispositivo inválido.");
        }
        if (!data.description && !data.status) {
            throw new Error("Nenhum dado fornecido para atualização.");
        }

        try {
            const existingDevice = await deviceRepository.findDeviceById(deviceId);
            if (!existingDevice) {
                throw new Error(`Dispositivo com ID ${deviceId} não encontrado.`);
            }

            if (existingDevice.status === 'CANCELED') {
                throw new Error("Não é possível atualizar um dispositivo que já foi cancelado.");
            }

            const updatedDevice = await deviceRepository.updateDevice(deviceId, data);
            return updatedDevice;

        } catch (error) {
            if (error instanceof Error && (error.message.includes("não encontrado") || error.message.includes("cancelado"))) {
                throw error;
            }
            console.error(`Erro no service ao atualizar dispositivo ${deviceId}:`, error);
            throw new Error("Falha ao atualizar dispositivo.");
        }
    },
    deleteDevice: async (deviceId: number): Promise<Device> => {
        if (!deviceId || typeof deviceId !== 'number' || isNaN(deviceId)) {
            throw new Error("ID do dispositivo inválido.");
        }

        try {
            const existingDevice = await deviceRepository.findDeviceById(deviceId);
            if (!existingDevice) {
                throw new Error(`Dispositivo com ID ${deviceId} não encontrado.`);
            }

            if (existingDevice.status === 'CANCELED') {
                return existingDevice;
            }

            const deletedDevice = await deviceRepository.deleteDevice(existingDevice.id)

            return deletedDevice;

        } catch (error) {
            if (error instanceof Error && error.message.includes("não encontrado")) {
                throw error;
            }
            console.error(`Erro no service ao (soft) deletar dispositivo ${deviceId}:`, error);
            throw new Error("Falha ao deletar dispositivo.");
        }
    }
}