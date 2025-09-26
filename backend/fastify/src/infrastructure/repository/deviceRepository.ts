import { PrismaClient } from "@prisma/client";

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
    }
}