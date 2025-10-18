import { Machine } from "@prisma/client";
import { machineRepository, NewMachineData, RawMachine, UpdateMachineData } from "../infrastructure/repository/machineRepository";
import { sensoresReadingRepository } from "../infrastructure/repository/sensoresReadingRepository";
import { deviceRepository } from "../infrastructure/repository/deviceRepository";
import { gatewayRepository } from "../infrastructure/repository/gatewayRepository";

export const machineService = {
    createMachine: async (data: NewMachineData): Promise<Machine> => {
        const isPresentGateway = data.gatewayId ? await gatewayRepository.findGatewayById(data.gatewayId) : null;
        const existingSerialNumberCount = await machineRepository.findBySerialNumber(data.serialNumber);
        if (existingSerialNumberCount) {
            throw new Error("Número de série já existe. Por favor, use um número de série único.");
        }

        const machine = await machineRepository.newMachine(data);

        if (isPresentGateway) {
            await deviceRepository.assignGatewayToDevice(isPresentGateway.id, machine.deviceId);
        }

        return machine;
    }
    ,
    getAllUsersMachine: async(id: number): Promise<RawMachine[] | null> => {
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
    },
    updateMachine: async(machineId:number,data: UpdateMachineData): Promise<Machine> =>{
        const isPresent = await machineRepository.findById(machineId);
        if(!isPresent){
            throw new Error("Máquina não encontrada")
        }
        const result = await machineRepository.updateMachine(machineId,data);

        return result;
    },
    deleteMachine: async(machineId: number): Promise<Machine> =>{
        const isExists = await machineRepository.findById(machineId);

        if(!isExists){
            throw new Error("Máquina não encontrada");
        }

        const result = await machineRepository.deleteMachine(machineId);

        return result;
    }
}