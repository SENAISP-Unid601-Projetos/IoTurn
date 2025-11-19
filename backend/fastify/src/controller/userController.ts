import { Status, UserType } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { userService } from '../services/userService'
const createUserBodySchema = z.object({
  name: z.string().nonempty('O nome é obrigatório.'),
  email: z.email(),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  userType: z.enum(UserType),
  status: z.enum(Status),
  clientId: z.number().int().positive('O ID do cliente deve ser um número positivo.'),
})
const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  userType: z.enum(UserType).optional(),
  status: z.enum(Status).optional(),
})
const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive('O ID do usuário deve ser um número positivo.'),
})

const clientIdParamSchema = z.object({
  clientId: z.coerce.number().int().positive('O ID do cliente deve ser um número positivo.'),
})
export const userController = {
  createUser: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userData = createUserBodySchema.safeParse(request.body)

      if (!userData.success) {
        reply.status(400).send({ message: 'Invalid request body', errors: userData.error.message })
        return
      }
      const result = await userService.createUser(userData.data)
      return reply.status(201).send(result)
    } catch (error) {
      console.error('Erro ao criar usuario:', error)
      reply.status(500).send({
        error: 'Erro interno do servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  },
  findAllUsersActive: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const params = clientIdParamSchema.safeParse(request.params)
      if (!params.success) {
        reply
          .status(400)
          .send({ message: 'Parâmetro [clientId] inválido', errors: params.error.message })
        return
      }

      const result = await userService.findAllUsersActive(params.data.clientId)
      console.log(result)
      // Garantindo que id esteja presente no response
      return reply.status(200).send(result)
    } catch (error) {
      console.error('Erro ao buscar usuarios:', error)
      reply.status(500).send({
        error: 'Erro interno do servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  },
  updateUser: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const params = userIdParamSchema.safeParse(request.params)
      if (!params.success) {
        reply
          .status(400)
          .send({ message: 'Parâmetro [userId] inválido', errors: params.error.message })
        return
      }

      const updateData = updateUserBodySchema.safeParse(request.body)
      if (!updateData.success) {
        reply
          .status(400)
          .send({ message: 'Invalid request body', errors: updateData.error.message })
        return
      }

      const result = await userService.updateUser(params.data.userId, updateData.data)
      return reply.status(200).send(result)
    } catch (error) {
      console.error('Erro ao atualizar usuario:', error)
      reply.status(500).send({
        error: 'Erro interno do servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  },
  softDelete: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const params = userIdParamSchema.safeParse(request.params)

      if (!params.success) {
        reply
          .status(400)
          .send({ message: 'Parâmetro [userId] inválido', errors: params.error.message })
        return
      }

      const result = await userService.softDelete(params.data.userId)
      return reply.status(200).send(result)
    } catch (error) {
      console.error('Erro ao deletar usuario:', error)
      reply.status(500).send({
        error: 'Erro interno do servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  },
}
