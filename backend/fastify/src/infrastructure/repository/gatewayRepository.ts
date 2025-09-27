import { PrismaClient, Gateway } from "@prisma/client";

const prisma = new PrismaClient();

export interface NewGatewayData {
    gatewayId: string;
    description?: string;
}
export const gatewayRepository = {
    newGateway: async (data: NewGatewayData): Promise<Gateway | undefined> => {
        try {
            const result = await prisma.gateway.create({
                data: {
                    gatewayId: data.gatewayId,
                    description: data.description
                }
            });

            return result;
        } catch (err) {
            console.error("Erro ao criar gateway:", err);
            return undefined; 
        }
    }
}