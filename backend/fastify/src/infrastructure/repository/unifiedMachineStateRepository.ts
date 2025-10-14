import { PrismaClient, UnifiedMachineState } from "@prisma/client";



const prisma = new PrismaClient();


export interface NewUnifiedMachineState {
    timestamp: Date;
    machineId: number;
    current?: number;
    rpm?: number;
    oilTemperature?: number;
    oilLevel?: number;
    currentIsMissing: boolean;
    rpmIsMissing: boolean;
    oilTemperatureIsMissing: boolean;
    oilLevelIsMissing: boolean;
    clusterPredict: number | null;
    clusterStrength: number | null;    
}
export const unifiedMachineStateRepository = {
    newUnifiedMachine: async (data: NewUnifiedMachineState): Promise<UnifiedMachineState> => {
        try {
            const result = await prisma.unifiedMachineState.create({
                data: {
                    timestamp: data.timestamp,
                    machineId: data.machineId,
                    current: data.current,
                    rpm: data.rpm,
                    oilTemperature: data.oilTemperature,
                    oilLevel: data.oilLevel,
                    currentIsMissing: data.currentIsMissing,
                    rpmIsMissing: data.rpmIsMissing,
                    oilTemperatureIsMissing: data.oilTemperatureIsMissing,
                    oilLevelIsMissing: data.oilLevelIsMissing,
                    clusterPredict: data.clusterPredict,
                    clusterStrength: data.clusterStrength
                }
            });

            return result;
        } catch (err) {
            console.error("Erro no repositório ao criar UnifiedMachineState:", err);
            throw new Error("Falha ao acessar o banco de dados para guardar o UnifiedMachineState.");
        }
    },
    findAll: async(machineId: number, startDate: Date, finalDate: Date): Promise<UnifiedMachineState[]> =>{
        try {
            const result = await prisma.unifiedMachineState.findMany({
                where: {
                    machineId: machineId,
                    timestamp: {
                        gte: startDate,
                        lte: finalDate
                    }
                },
            });
            return result;
        } catch (err) {
            console.error("Erro ao buscar todos os estados unificados das máquinas:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar todos os estados unificados das máquinas.");
        }
    }
}

