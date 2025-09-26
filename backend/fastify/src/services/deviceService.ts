import { deviceRepository, RawMapping } from "../infrastructure/repository/deviceRepository";

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
    }
}