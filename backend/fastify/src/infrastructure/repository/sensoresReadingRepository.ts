import { 
    PrismaClient, 
    RpmReading,
    OilTemperatureReading,
    OilLevelReading,
    CurrentReading
} from "@prisma/client";

const prisma = new PrismaClient();

export interface NewRpmData {
    rpm: number;
    machineId: number;
}
export interface NewOilTemperatureReadingData {
    temperature: number;
    machineId: number;
}
export interface NewOilLevelReadingData {
    level: number;
    machineId: number;
}
export interface NewCurrentReadingData {
    current: number;
    machineId: number;
}

export const sensoresReadingRepository = {
    newRpm: async (data: NewRpmData): Promise<RpmReading> => {
        try {
            const result = await prisma.rpmReading.create({
                data: {
                    rpm: data.rpm,
                    machineId: data.machineId, 
                }
            });
            return result;
        } catch (err) {
            console.error("Erro no repositório ao criar RpmReading:", err); 
            throw new Error("Falha ao acessar o banco de dados para guardar o RPM.");
        }
    },
    newOilTemperatureReading: async (data: NewOilTemperatureReadingData): Promise<OilTemperatureReading> => {
        try {
            const result = await prisma.oilTemperatureReading.create({
                data: {
                    temperature: data.temperature,
                    machineId: data.machineId,
                }
            });
            return result;
        } catch (err) {
            console.error("Erro no repositório ao criar OilTemperatureReading:", err);
            throw new Error("Falha ao acessar o banco de dados para guardar a TEMPERATURA.");
        }
    },

    newOilLevelReading: async (data: NewOilLevelReadingData): Promise<OilLevelReading> => {
        try {
           
            const result = await prisma.oilLevelReading.create({
                data: {
                    level: data.level,
                    machineId: data.machineId,
                }
            });
            return result;
        } catch (err) {
            console.error("Erro no repositório ao criar OilLevelReading:", err);
            throw new Error("Falha ao acessar o banco de dados para guardar o NÍVEL DO ÓLEO.");
        }
    },
    newCurrentReading: async (data: NewCurrentReadingData): Promise<CurrentReading> => {
        try {

            const result = await prisma.currentReading.create({
                data: {
                    current: data.current,
                    machineId: data.machineId,
                }
            });
            return result;
        } catch (err) {
            console.error("Erro no repositório ao criar CurrentReading:", err);
            throw new Error("Falha ao acessar o banco de dados para guardar a CORRENTE.");
        }
    },
};