
import { PrismaClient, UserType, Status, User} from "@prisma/client";

const prisma = new PrismaClient();

export interface NewUserData {
    name: string;
    email: string;
    password: string;
    userType: UserType;
    status: Status;
    clientId: number;
}
export interface RawUserData {
    id: number;
    name: string;
    email: string;
    userType: UserType;
    status: Status;
    createdAt: Date;
    client: {
        companyName: string
    }
}
export interface UpdateUserData {
    name?: string;
    email?: string;
    userType?: UserType;
    status?: Status;
}
export const userRepository = {
    newUser: async (data: NewUserData): Promise<User> => {
        try {
            const user = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    userType: data.userType,
                    status: data.status,
                    client: {
                        connect: {
                            id: data.clientId
                        }
                    },
                }
            });

            return user;
        } catch (error) {
            console.error("Erro ao criar usuario:", error);
            throw new Error("Falha ao acessar o banco de dados para criar o usuario.");
        }
    },
    findAllUsersActive: async (clientId: number ): Promise<RawUserData[]> =>{
        try {
            const users = await prisma.user.findMany({
                where: {
                    clientId: clientId,
                    status: Status.ACTIVE
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    userType: true,
                    status: true,
                    createdAt: true,
                    client: {
                        select: {
                            companyName: true
                        }
                    },
                }  
            });
            return users as RawUserData[];
        } catch (error) {
            console.error("Erro ao buscar usuarios:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar os usuarios.");
        }
    },
    updateUser: async (userId:number,data: UpdateUserData): Promise<User> => {
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: data 
            });

            return updatedUser;
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw new Error("Falha ao acessar o banco de dados para atualizar o usuário.");
        }
    },
    deleteUser: async(userId: number): Promise<User> =>{
        try{
            const deleteUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    status: Status.CANCELED
                }
            });

            return deleteUser;
        } catch(error){
            console.error("Erro ao deletar usuário:", error);
            throw new Error("Falha ao acessar o banco de dados para deletar o usuário.");
        }
    },
    findById: async(id: number): Promise<User> =>{
        try {
            const isExists = await prisma.user.findFirst({
                where: {
                    id: id
                }
            });
            return isExists as User;
        } catch (error) {
            console.error("Erro ao buscar usuário especifico:", error);
            throw new Error("Falha ao acessar o banco de dados para buscar usuário especifico.");
        }
    }

};