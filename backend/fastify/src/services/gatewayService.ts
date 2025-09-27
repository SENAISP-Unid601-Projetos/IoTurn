import { gatewayRepository, NewGatewayData } from "../infrastructure/repository/gatewayRepository";
import { Gateway } from "@prisma/client";
export const gatewayService = {
    createGateway: async(data: NewGatewayData): Promise<Gateway> =>{
        const result = await gatewayRepository.newGateway(data);

        if(!result){
            throw new Error("Falha ao criar gateway.");
        }

        return result;
    }
}