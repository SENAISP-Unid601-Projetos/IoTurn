import { Client, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export interface NewClientData {
    companyName: string;
    cnpj: string;
    phone: string;
    address: string;
    email: string;
    password: string;
}
export const clientsRepository = {
    newClient: async (data: NewClientData): Promise<Client> =>{
        try {
            const client = await prisma.client.create({
                data: {
                    companyName: data.companyName,
                    cnpj: data.cnpj,
                    phone: data.phone,
                    address: data.address,
                    email: data.email,
                    password: data.password
                },
            });

            return client
        } catch (err) {
            console.error("Erro ao criar cliente:", err);
            throw new Error("Falha ao acessar o banco de dados para criar o cliente.");
        }
    },
    login: async (email: string, password: string): Promise<Client> => {
        try {
            const client = await prisma.client.findFirst({
                where: {
                    email: email,
                    password: password, 
                },
                select: {id:true, companyName:true, email:true, cnpj:true}
            });
            return client as Client
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            throw new Error("Falha ao acessar o banco de dados para fazer login.");
        }
    },
    findByEmail: async (email: string): Promise<Client> =>{
        try {
            const isExists = await prisma.client.findFirst({
                where: {
                    email: email
                }
            });

            return isExists as Client
        } catch (err) {
            console.error("Erro ao buscar email do cliente:", err);
            throw new Error("Falha ao acessar o banco de dados para buscar email.");
        }
    }
};