import { PrismaClient, Device } from "@prisma/client";

const prisma = new PrismaClient();

export interface RawMapping {
    nodeId: string,
    machine: {
        id: number
    }
}

export const deviceRepository = {

        findActiveMappings: async(): Promise<RawMapping[]> =>{
        try {
            const result = await prisma.device.findMany({
                where:{
                    machine: {
                        isNot: null
                    }
                },
                select: {
                    nodeId: true,
                    machine:{
                        select:{
                            id:true
                        }
                    }
                }
            });
            return result as RawMapping[] 
        } catch (err) {
            console.error("Erro ao buscar máquinas ativas:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar mapeamentos.");
        }
    },
    assignGatewayToDevice: async(gatewayId: number, deviceId: number): Promise<Device | undefined> =>{
        try {
            const result = await prisma.device.update({
                where: {
                    id: deviceId
                },
                data: {
                    gatewayId: gatewayId
                }
            });
            return result as Device | undefined;
        } catch (error) {
            console.error("Erro ao atribuir gateway ao dispositivo:", error);
            throw new Error("Falha ao acessar o banco de dados para atribuir gateway ao dispositivo.");
        }
    },
    findDeviceById: async(deviceId: number): Promise<Device | null> =>{
        try {
            const result = await prisma.device.findUnique({
                where: {
                    id: deviceId
                }
            });
            return result;
        } catch (error) {
            console.error("Erro ao buscar dispositivo por ID:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar dispositivo por ID.");
        }
    }
}