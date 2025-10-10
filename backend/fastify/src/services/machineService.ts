import { Machine } from "@prisma/client";
import { machineRepository, NewMachineData } from "../infrastructure/repository/machineRepository";
import { sensoresReadingRepository } from "../infrastructure/repository/sensoresReadingRepository";

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
    getAllUsersMachine: async(id: number): Promise<Machine[] | null> => {
        const packageData = Promise.all([
            machineRepository.findAllUsersMachine(id),
            sensoresReadingRepository.findLastCurrentData(id),
            sensoresReadingRepository.findLastRpmData(id),
            sensoresReadingRepository.findLastOilTemperatureData(id),
            sensoresReadingRepository.findLastOilLevelData(id)
        ]);
        const {0: machines, 1: lastCurrent, 2: lastRpm, 3: lastOilTemp, 4: lastOilLevel} = await packageData;
        return machines?.map(machine => ({
            ...machine,
            lastCurrent: lastCurrent || null,
            lastRpm: lastRpm || null,
            lastOilTemperature: lastOilTemp || null,
            lastOilLevel: lastOilLevel || null
        })) || null;
    }
}