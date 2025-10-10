import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const clientsRepository = {
    loginTemp: async (email: string, cnpj: string) => {
        try {
            const client = await prisma.client.findFirst({
                where: {
                    cnpj: cnpj, 
                    email: email
                },
                select: {id:true, companyName:true, email:true, cnpj:true}
            });
            return client;
        } catch (err) {
            console.error("Erro ao buscar cliente:", err);
            return null;
        }
    }
};