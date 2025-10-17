
import { clientsRepository, NewClientData } from "../infrastructure/repository/clientsRepository";
import { Client } from "@prisma/client";

export const clientsService = {
    
    newClientService: async (data: NewClientData): Promise<Client | undefined> =>{
        try {
            const result = await clientsRepository.newClient(data);

            if(!result){
                throw new Error("Erro ao cadastrar cliente")
            }

            return result;
        } catch (err) {
            console.error("Error:", err)
        }
    },
    loginService: async (email: string, password: string ): Promise<Client | undefined> =>{
        try {
            const result = await clientsRepository.login(email,password);

            if(!result){
                throw new Error("Erro ao logal cliente")
            }

            return result;

        }catch (err) {
            console.error("Error:", err)
        }
    }

};
