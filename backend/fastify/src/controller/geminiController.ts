import { wsHandler } from '../websocket/wsHandler'
import { geminiService } from '../services/geminiService'
import { FastifyReply, FastifyRequest } from 'fastify'
import {queryGeminiValidator} from '../validation/queryGeminiValidator'
import { helper } from '../utils/helper'
import { geminiRepository } from '../infrastructure/repository/geminiRepository'
import { redisService } from '../services/redisService'

export const geminiController = {
   askGeminiController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
       try {
           // if (!wsHandler.existsClient()) {
           //     return reply.status(400).send({ error: 'Nenhum cliente conectado.' });
           // }

           const { message } = request.body as { message: string };
           let moment: string;

           if (!message) {
               return reply.status(400).send({ error: 'Mensagem é obrigatório.' });
           } else{
                moment = helper.catchMoment();
           }

           const {dataSQL} = await geminiService.askGeminiSQL(message);

            if (!queryGeminiValidator.isSafeQuery(dataSQL)) {
                 throw new Error("Query Insegura!");
            }
           const result = await geminiRepository.fetchAllRecords(dataSQL);
           const {dataHuman,hiperParamsHuman} = await geminiService.askGeminiHuman(JSON.stringify(helper.convertBigInt(result)));
           const createCache = await redisService.saveCache(message,
            dataSQL,
            dataHuman,
            helper.createSHA256(moment),
            hiperParamsHuman.temperature!,
            hiperParamsHuman.topP!,
            hiperParamsHuman.topK!,
            hiperParamsHuman.maxOutputTokens!,
            hiperParamsHuman.responseMimeType!)
            
           return reply.send({
               success: true,
               message: 'Interação processada com sucesso',
               data: dataHuman,
               cacheId: createCache,
           });

       } catch (error) {
           console.error('Erro no geminiService:', error);
           reply.status(500).send({
               error: 'Erro interno ao processar a requisição',
               message: error || 'Erro desconhecido'
           });
       }
   }
};
