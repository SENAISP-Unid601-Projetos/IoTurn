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

 export type LastReadingResult = {
  current?: number;
  rpm?:number;
  oilTemperature?: number;
  oilLevel?: number;
  timestamp: Date;
} | null;



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
    findLastCurrentData: async (machineId: number, reconstructionTime: Date): Promise<LastReadingResult> => {
        try {
            const result = await prisma.currentReading.findFirst({
                select: {
                    current: true,
                    timestamp: true
                },
                where: {
                    machineId: machineId,
                    timestamp: {
                        lte: reconstructionTime
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            return result;

        } catch (error) {
            console.error("Error fetching last current data:", error);
            throw error;
        }
    },
    findLastRpmData: async (machineId: number, reconstructionTime: Date): Promise<LastReadingResult> => {
        try {
            const result = await prisma.rpmReading.findFirst({
                select: {
                    rpm: true,
                    timestamp: true
                },
                where: {
                    machineId: machineId,
                    timestamp: {
                        lte: reconstructionTime
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            return result;

        } catch (error) {
            console.error("Error fetching last rpm data:", error);
            throw error;
        }
    },
    findLastOilTemperatureData: async (machineId: number, reconstructionTime: Date): Promise<LastReadingResult> => {
        try {
            const result = await prisma.oilTemperatureReading.findFirst({
                select: {
                    temperature: true,
                    timestamp: true
                },
                where: {
                    machineId: machineId,
                    timestamp: {
                        lte: reconstructionTime
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            return result;

        } catch (error) {
            console.error("Error fetching last temperature data:", error);
            throw error;
        }
    },
    findLastOilLevelData: async (machineId: number, reconstructionTime: Date): Promise<LastReadingResult> => {
        try {
            const result = await prisma.oilLevelReading.findFirst({
                select: {
                    level: true,
                    timestamp: true
                },
                where: {
                    machineId: machineId,
                    timestamp: {
                        lte: reconstructionTime
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            return result;

        } catch (error) {
            console.error("Error fetching last level data:", error);
            throw error;
        }
    }

};