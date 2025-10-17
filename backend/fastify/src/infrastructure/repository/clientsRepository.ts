import { Client, PrismaClient } from "@prisma/client";
import { string } from "zod";

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
    newClient: async (data: NewClientData): Promise<Client | undefined> =>{
        try {
            const client = await prisma.client.create({
                data: {
                    companyName: data.companyName,
                    cnpj: data.cnpj,
                    phone: data.phone,
                    address: data.address,
                    email: data.email,
                    password: data.password
                }
            });

            return client
        } catch (error) {
            
        }
    },
    login: async (email: string, password: string): Promise<Client | undefined> => {
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
            console.error("Erro ao buscar cliente:", err);
        }
    },
    findByEmail: async (email: string): Promise<Client | undefined> =>{
        try {
            const isExists = await prisma.client.findFirst({
                where: {
                    email: email
                }
            });

            return isExists as Client
        } catch (err) {
            console.error("Erro ao buscar email do cliente:", err);
        }
    }
};