import { PrismaClient, Gateway, DeviceStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface NewGatewayData {
    gatewayId: string;
    description: string;
    status: DeviceStatus
}
export interface UpdateGatewayData {
    description?: string;
    status?: DeviceStatus;
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

    findGatewayById: async(gatewayId: number): Promise<Gateway | null> =>{
        try {
            const result = await prisma.gateway.findUnique({
                where: {
                    id: gatewayId
                }
            });

            return result; 
        } catch (err) {
            console.error("Erro ao buscar gateway pelo id:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar gateway por ID.");
        }
    },
    updateGateway: async (gatewayId: number, data: UpdateGatewayData): Promise<Gateway> => {
        try {
            const updatedGateway = await prisma.gateway.update({
                where: {
                    id: gatewayId
                },
                data: data // Atualiza apenas os campos fornecidos
            });
            return updatedGateway;
        } catch (error) {
            console.error(`Erro ao atualizar gateway ${gatewayId}:`, error);
            throw new Error("Falha ao acessar o banco de dados para atualizar gateway.");
        }
    },
    deleteGateway: async (gatewayId: number): Promise<Gateway> => {
        try {
            const deletedGateway = await prisma.gateway.update({
                where: {
                    id: gatewayId
                },
                data: {
                    status: 'CANCELED' // Exclusão lógica
                }
            });
            return deletedGateway;
        } catch (error) {
            console.error(`Erro ao (soft) deletar gateway ${gatewayId}:`, error);
            throw new Error("Falha ao acessar o banco de dados para deletar gateway.");
        }
    },
    findAllGateways: async (userId: number): Promise<Gateway[]> => {
        try {
            // Passo 1: Descobrir o clientId do usuário
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { clientId: true }
            });

            if (!user) {
                console.warn(`Usuário ${userId} não encontrado para buscar gateways.`);
                return [];
            }

            // Passo 2: Buscar gateways baseados no clientId
            const gateways = await prisma.gateway.findMany({
                where: {
                    // 'responsibleFor' é a lista de 'Device' no modelo 'Gateway'
                    responsibleFor: {
                        // 'some' significa "pelo menos um" dispositivo na lista
                        some: {
                            // O dispositivo deve estar ligado a uma 'machine'
                            machine: {
                                // A máquina deve pertencer ao 'clientId' do usuário
                                clientId: user.clientId
                            }
                        }
                    },
                    // Opcional: Não mostrar gateways já cancelados
                    status: {
                        not: 'CANCELED'
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            });

            return gateways;

        } catch (error) {
            console.error("Erro ao buscar todos os gateways por usuário:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar gateways.");
        }
    },
}