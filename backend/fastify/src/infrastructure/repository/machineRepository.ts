import { Prisma, PrismaClient, Status, Machine } from "@prisma/client";
import { id } from "zod/v4/locales";

const prisma = new PrismaClient();

export interface NewMachineData {
    name: string;
    model: string;
    manufacturer: string;
    serialNumber: string;
    status: Status;
    clientId: number;
    responsibleUserId: number;
    nodeId: string;
    description?: string;
}


export const machineRepository = {
    newMachine: async (data: NewMachineData): Promise<Machine | undefined> => {
        try {
            const result = await prisma.machine.create({
                data: {
                    name: data.name,
                    model: data.model,
                    manufacturer: data.manufacturer,
                    serialNumber: data.serialNumber,
                    status: data.status,
                    client: {
                        connect: { id: data.clientId }
                    },
                    responsibleUser: {
                        connect: { id: data.responsibleUserId }
                    },
                    device: {
                        create: {
                            nodeId: data.nodeId,
                            description: data.description
                        }
                    }
                }
            });
            return result;
    
        } catch (err) {
            console.error("Erro ao criar máquina:", err);
            return undefined; 
        }
    },
    countBySerialNumber: async (serialNumber: string): Promise<number> => {
        try {
            const count = await prisma.machine.count({
                where: { serialNumber }
            });
            return count;
        } catch (err) {
            console.error("Erro ao contar máquinas por serialNumber:", err);
            return -1; 
        }
    },
    findAllUsersMachine: async(id: number): Promise<Machine[] | null> => {
        try {
            const machines = await prisma.machine.findMany({
                where: { clientId: id },
            });
            return machines;
        } catch (err) {
            console.error("Erro ao buscar máquinas do usuário:", err);
            return null; 
        }
    }
    
};