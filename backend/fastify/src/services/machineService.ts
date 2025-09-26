import { Machine } from "@prisma/client";
import { machineRepository, NewMachineData } from "../infrastructure/repository/machineRepository";

export const machineService = {
    createMachine: async (data: NewMachineData): Promise<Machine> =>{
        const existingSerialNumberCount = await machineRepository.countBySerialNumber(data.serialNumber);
        if(existingSerialNumberCount > 0){
            throw new Error("Número de série já existe. Por favor, use um número de série único.");
        }
        const machine = await machineRepository.newMachine(data);
        if(!machine){
            throw new Error("Falha ao criar a máquina.");
        }
        return machine;
    },
}