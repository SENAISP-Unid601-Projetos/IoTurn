// Importamos os tipos e o repositório
import { 
    gatewayRepository, 
    NewGatewayData, 
    UpdateGatewayData 
} from "../infrastructure/repository/gatewayRepository"; // Ajuste o caminho se necessário
import { Gateway, PrismaClient, Prisma, DeviceStatus } from "@prisma/client";

// Instanciamos o Prisma aqui para usar nas transações
const prisma = new PrismaClient();

export const gatewayService = {

    createGateway: async(data: NewGatewayData): Promise<Gateway> => {
        try {
            const result = await gatewayRepository.newGateway(data);

            if(!result){
                throw new Error("Falha ao criar gateway. Verifique se o 'gatewayId' já existe.");
            }

            return result;
        
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("Já existe um gateway com este 'gatewayId'.");
                }
            }
            console.error("Erro no service ao criar gateway:", error);
            throw new Error("Falha ao criar gateway.");
        }
    },

    findAllGateways: async (userId: number): Promise<Gateway[]> => {
        if (!userId || typeof userId !== 'number' || isNaN(userId)) {
            throw new Error("ID do usuário inválido.");
        }

        try {
            const gateways = await gatewayRepository.findAllGateways(userId);
            return gateways;
        } catch (error) {
            console.error("Erro no service ao buscar gateways:", error);
            throw new Error("Falha ao buscar gateways.");
        }
    },
    updateGateway: async (gatewayId: number, data: UpdateGatewayData): Promise<Gateway> => {

        if (!gatewayId || typeof gatewayId !== 'number' || isNaN(gatewayId)) {
            throw new Error("ID do gateway inválido.");
        }
        if (!data.description && !data.status) {
            throw new Error("Nenhum dado fornecido para atualização.");
        }

        try {
            // 2. Regra de Negócio: Existência
            const existingGateway = await gatewayRepository.findGatewayById(gatewayId);
            if (!existingGateway) {
                throw new Error(`Gateway com ID ${gatewayId} não encontrado.`);
            }

            // 3. Regra de Negócio: Status
            if (existingGateway.status === 'CANCELED') {
                throw new Error("Não é possível atualizar um gateway que já foi cancelado.");
            }

            // 4. Chama o Repositório
            const updatedGateway = await gatewayRepository.updateGateway(gatewayId, data);
            return updatedGateway;

        } catch (error) {
            // 5. Tratamento de Erro
            if (error instanceof Error && (error.message.includes("não encontrado") || error.message.includes("cancelado"))) {
                throw error;
            }
            console.error(`Erro no service ao atualizar gateway ${gatewayId}:`, error);
            throw new Error("Falha ao atualizar gateway.");
        }
    },

    deleteGateway: async (gatewayId: number): Promise<Gateway> => {
        // 1. Validação
        if (!gatewayId || typeof gatewayId !== 'number' || isNaN(gatewayId)) {
            throw new Error("ID do gateway inválido.");
        }

        try {
            // 2. Regra de Negócio: Existência
            const existingGateway = await gatewayRepository.findGatewayById(gatewayId);
            if (!existingGateway) {
                throw new Error(`Gateway com ID ${gatewayId} não encontrado.`);
            }

            // 3. Regra de Negócio: Idempotência
            if (existingGateway.status === 'CANCELED') {
                return existingGateway; // Já está cancelado, não faz nada
            }

            const deletedGateway = await gatewayRepository.deleteGateway(existingGateway.id)

            return deletedGateway;

        } catch (error) {
            if (error instanceof Error && error.message.includes("não encontrado")) {
                throw error;
            }
            console.error(`Erro no service ao (soft) deletar gateway ${gatewayId}:`, error);
            throw new Error("Falha ao deletar gateway.");
        }
    }
}