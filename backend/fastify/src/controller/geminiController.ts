import { geminiService } from '../services/geminiService'; // <-- ATENÇÃO: Importando o service refatorado
import { FastifyReply, FastifyRequest } from 'fastify';
import { queryGeminiValidator } from '../validation/queryGeminiValidator';
import { helper } from '../utils/helper';
import { geminiRepository } from '../infrastructure/repository/geminiRepository';
import { redisService } from '../services/redisService';

export const geminiController = {
    askGeminiController: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { message } = request.body as { message: string };
            const params = request.params as { id?: string } | undefined;
            const idParam = params?.id;
            const id: number = idParam ? parseInt(idParam, 10) : NaN;
            if (isNaN(id)) {
                return reply.status(400).send({ error: 'ID de rota inválido ou ausente.' });
            }
            let moment: string;

            if (!message) {
                return reply.status(400).send({ error: 'A mensagem do usuário é obrigatória.' });
            } else {
                moment = helper.catchMoment();
            }

            
            const geminiSqlResponseString = await geminiService.askGeminiSQL(message,id);
            const geminiSqlResponse = JSON.parse(geminiSqlResponseString);

            
            if (geminiSqlResponse.error) {
                console.error("A IA retornou um erro:", geminiSqlResponse.error);
                
                return reply.status(400).send({
                    success: false,
                    message: "A IA não conseguiu gerar a query SQL.",
                    details: geminiSqlResponse.error
                });
            }

            const sqlQuery = geminiSqlResponse.query;
            if (!sqlQuery) {
                throw new Error("Resposta inesperada da IA (não contém 'query' nem 'error').");
            }

            if (!queryGeminiValidator.isSafeQuery(sqlQuery)) {
                throw new Error("Query Insegura detectada!");
            }
            
            console.log("Query SQL validada:", sqlQuery);

           
            const dbResult = await geminiRepository.fetchAllRecords(sqlQuery);

            
            const { dataHuman, hiperParamsHuman } = await geminiService.askGeminiHuman(message, helper.convertBigInt(dbResult));

            
            const createCache = await redisService.saveCache(
                message,
                sqlQuery, 
                dataHuman,
                helper.createSHA256(moment),
                hiperParamsHuman.temperature!,
                hiperParamsHuman.topP!,
                hiperParamsHuman.topK!,
                hiperParamsHuman.maxOutputTokens!,
                hiperParamsHuman.responseMimeType!
            );
            
            return reply.send({
                success: true,
                message: 'Interação processada com sucesso',
                data: dataHuman,
                cacheId: createCache,
            });

        } catch (error: any) {
            console.error('Erro no geminiController:', error);
            reply.status(500).send({
                success: false,
                error: 'Erro interno ao processar a requisição',
                message: error.message || 'Erro desconhecido'
            });
        }
    }
};
