import { subscribe } from "diagnostics_channel";
import { NewDataPoint } from "../../mqttSubscriber";
import redis from "../config/redisCacher";
import { machineRepository } from "../infrastructure/repository/machineRepository";

export const redisService = {
    saveCache: async (
        message: string,
        response: string,
        geminiHumanResponse:string,
        hashID:string,
        temperature: number,
        topP: number,
        topK: number,
        maxOutputTokens: number,
        responseMimeType: string): Promise<string> =>{
        
        const cacheKey = `dataInCache:${hashID}`;

        await redis.hmset(cacheKey, {
            userMessage: message,
            builtQuery: response,
            geminiResponse: geminiHumanResponse,
            temperature:temperature,
            topP:topP,
            topK:topK,
            maxOutputTokens:maxOutputTokens,
            responseMimeType:responseMimeType
        });
        await redis.rpush('dataInCache', hashID);

        await redis.expire(cacheKey, 300);

        return cacheKey
    },
    getCache: async (hashID: string): Promise<any> => {
        const cacheKey = hashID;
        
        // Buscar todos os dados do hash específico
        const cacheData = await redis.hgetall(cacheKey);

        // Se o cache não existir ou tiver expirado (dados vazios), retorna erro
        if (Object.keys(cacheData).length === 0) {
            throw new Error('Cache não encontrado ou expirado.');
        }

        return cacheData;
    },
    publishMessageToMachine: async(machineId: number, data: NewDataPoint): Promise<void> =>{
        const {clientId} = await machineRepository.findById(machineId);
        if(!clientId){
            throw new Error("Usuário da máquina não encontrada");
        }
        redis.publish(`machineOwnerChannel-${clientId}`, JSON.stringify(data), (err)=>{
            if(err){
                throw new Error("Erro ao publicar mensagem no canal Redis: " + err.message);
            } else {
                console.log(`Mensagem publicada com sucesso no canal Redis: machineOwnerChannel-${clientId}`);
            }
        });
    },
}