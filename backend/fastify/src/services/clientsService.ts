import { clientsRepository } from "../infrastructure/repository/clientsRepository";
export interface Client {
    id: number;
    companyName: string;
    email: string;
    cnpj: string;
}

export const clientsService = {
    loginTemp: async (email: string, cnpj: string): Promise<Client | null> => {
        const client = await clientsRepository.loginTemp(email, cnpj);
        return client;
    }
};
