import { PrismaClient, Gateway, DeviceStatus, } from "@prisma/client";

const prisma = new PrismaClient();

export interface NewGatewayData {
    gatewayId: string;
    description: string;
    status: DeviceStatus
}
export const gatewayRepository = {
    newGateway: async (data: NewGatewayData): Promise<Gateway | undefined> => {
        try {
            const result = await prisma.gateway.create({
                data: {
                    gatewayId: data.gatewayId,
                    description: data.description,
                    status: data.status
                }
            });

            return result;
        } catch (err) {
            console.error("Erro ao criar gateway:", err);
            return undefined; 
        }
    },
    findGatewayById: async(gatewayId: number): Promise<Gateway | undefined> =>{
        try {
            const result = await prisma.gateway.findUnique({
                where: {
                    id: gatewayId
                }
            });

            return result as Gateway;
        } catch (err) {
            console.error("Erro ao buscar gateway pelo id:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar gateway por ID.");
        }
    },
}