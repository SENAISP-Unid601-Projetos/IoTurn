import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sensorDataRepository = {
    saveMqttPayload: async(temperature: number, oilLevel: number, rpm: number, current: number): Promise<any> =>{
        try{
            const result = await prisma.sensorData.create({
                data:{
                    temperatura:temperature,
                    nivel:oilLevel,
                    rpm:rpm,
                    corrente:current
                }
            });

            return result;
        } catch (err){
            console.error("Erro ao salvar dados dos sensores");
        }
    }
}