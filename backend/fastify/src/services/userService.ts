import { User } from '@prisma/client'
import {
  NewUserData,
  RawUserData,
  UpdateUserData,
  userRepository,
} from '../infrastructure/repository/userRepository'

export const userService = {
  createUser: async (data: NewUserData): Promise<User> => {
    const result = await userRepository.newUser(data)
    return result
  },

  findAllUsersActive: async (
    clientId: number
  ): Promise<{ id: number; name: string; type: string }[]> => {
    const result = await userRepository.findAllUsersActive(clientId)

    // Garantindo que cada usuário contenha o id
    return result.map((user) => ({
      id: user.id,
      name: user.name,
      type: user.userType, // ou user.type dependendo do seu schema
    }))
  },

  updateUser: async (userId: number, data: UpdateUserData): Promise<User> => {
    const isPresent = await userRepository.findById(userId)
    if (!isPresent) {
      throw new Error('Usuário não encontrado')
    }
    const result = await userRepository.updateUser(userId, data)
    return result
  },

  softDelete: async (userId: number): Promise<User> => {
    const isPresent = await userRepository.findById(userId)
    if (!isPresent) {
      throw new Error('Usuário não encontrado')
    }
    const result = await userRepository.deleteUser(userId)
    return result
  },
}
