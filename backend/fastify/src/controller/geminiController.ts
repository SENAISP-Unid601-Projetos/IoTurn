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
            let moment: string;

            if (!message) {
                return reply.status(400).send({ error: 'A mensagem do usuário é obrigatória.' });
            } else {
                moment = helper.catchMoment();
            }

            // 1. Chame o serviço para gerar o SQL. A resposta é uma string JSON.
            const geminiSqlResponseString = await geminiService.askGeminiSQL(message);
            const geminiSqlResponse = JSON.parse(geminiSqlResponseString);

            // 2. VERIFIQUE SE A IA RETORNOU UM ERRO ANTES DE CONTINUAR
            if (geminiSqlResponse.error) {
                console.error("A IA retornou um erro:", geminiSqlResponse.error);
                // Retorne o erro da IA para o usuário final
                return reply.status(400).send({
                    success: false,
                    message: "A IA não conseguiu gerar a query SQL.",
                    details: geminiSqlResponse.error
                });
            }

            // 3. Extraia a query e valide-a
            const sqlQuery = geminiSqlResponse.query;
            if (!sqlQuery) {
                throw new Error("Resposta inesperada da IA (não contém 'query' nem 'error').");
            }

            if (!queryGeminiValidator.isSafeQuery(sqlQuery)) {
                throw new Error("Query Insegura detectada!");
            }
            
            console.log("Query SQL validada:", sqlQuery);

            // 4. Execute a query segura no banco de dados
            const dbResult = await geminiRepository.fetchAllRecords(sqlQuery);

            // 5. Chame o serviço para humanizar a resposta, passando a pergunta original e o resultado do banco
            const { dataHuman, hiperParamsHuman } = await geminiService.askGeminiHuman(message, helper.convertBigInt(dbResult));

            // 6. Salve em cache e retorne a resposta final
            const createCache = await redisService.saveCache(
                message,
                sqlQuery, // Usando a variável correta
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
