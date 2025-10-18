import { User } from "@prisma/client";
import { NewUserData, RawUserData, UpdateUserData, userRepository } from "../infrastructure/repository/userRepository";

export const userService = {
    createUser: async (data: NewUserData): Promise<User> => {
        const result = await userRepository.newUser(data);
        return result;
    },

    findAllUsersActive: async (clientId: number): Promise<RawUserData[]> => {
        const result = await userRepository.findAllUsersActive(clientId);
        return result;
    },
    updateUser: async (userId: number, data: UpdateUserData): Promise<User> => {
        const isPresent = await userRepository.findById(userId);
        if(!isPresent){
            throw new Error("Usuário não encontrado")
        }
        const result = await userRepository.updateUser(userId, data);
        return result;
    },

    softDelete: async (userId: number): Promise<User> => {
        const isPresent = await userRepository.findById(userId);
        if(!isPresent){
            throw new Error("Usuário não encontrado")
        }
        const result = await userRepository.deleteUser(userId);
        return result;
    }
};