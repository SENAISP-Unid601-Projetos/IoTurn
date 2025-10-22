import z from "zod";
import { clientsService } from "../services/clientsService";
import { FastifyReply, FastifyRequest } from "fastify";
import { clientsRepository } from "../infrastructure/repository/clientsRepository";
import bcrypt from 'bcrypt';

const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres.")
});
const newClientBodySchema = z.object({
    companyName: z.string(),
    cnpj: z.string().min(14, "O cnpj deve ter pelo menos 14 caracteres"),
    phone: z.string(),
    address: z.string(),
    email: z.email(),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres.")
})

export const clientsController = {
    loginController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const parseResult = loginBodySchema.safeParse(request.body);
        if (!parseResult.success) {
            reply.status(400).send({ message: 'Invalid request body', errors: parseResult.error.message });
            return;
        }
        const { email, password } = parseResult.data;
        try {
            const userExists = await clientsRepository.findByEmail(email);

            if(!userExists){
                return reply.status(401).send({ message: 'Credenciais inválidas.' });
            }

            const match = await bcrypt.compare(password, userExists.password);
            if (!match) {
                return reply.status(401).send({ message: 'Credenciais inválidas.' });
            }

            const token = await reply.jwtSign({
                id: userExists.id,
                companyName: userExists.companyName,
                email: userExists.email,
            }, {expiresIn: '30m'})

            return reply.setCookie('token', token, {
                path:'/',
                secure: false,
                httpOnly: true,
                sameSite: 'lax',
            }).status(200).send({message:'Login realizado com sucesso'});
        } catch (error) {
            console.error("Error in loginTempController:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    },
    newClientController:  async (request: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const parseResult = newClientBodySchema.safeParse(request.body);
        const saltRounds = 10;

        if(!parseResult.success){
            reply.status(400).send({
                message: 'Invalid request body',
                errors: parseResult.error.message 
            })
            return;
        }

        const data = parseResult.data;

        try {
            const userExists = await clientsRepository.findByEmail(data.email)
            if(userExists){
                return reply.status(409).send({
                    message: 'Email já cadastrado'
                });
            }

            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;
            const result = await clientsService.newClientService(data);
            
            if(!result){
                reply.status(500).send({
                    message: 'Erro ao cadastrar cliente'
                });
            }

            return reply.status(201).send({
                message: 'Cliente cadastrado com sucesso'
            });

        } catch (err) {
            console.error("Error",err);
            reply.status(500).send({
                message: 'An internal server error occurred'
            });
        }
    },
    logoutController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            return reply
                .clearCookie('token', { path: '/' })
                .status(200)
                .send({ message: 'Logout realizado com sucesso.' });
        } catch (error) {
            console.error("Error in logoutController:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
};