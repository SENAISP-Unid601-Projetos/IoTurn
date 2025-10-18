import fastify, { FastifyInstance } from "fastify";
import { geminiController } from "../controller/geminiController";
import { redisController } from "../controller/redisController";

export async function geminiRoutes(fastify: FastifyInstance){
    fastify.post('/ask',geminiController.askGeminiController)
    fastify.post('/feedback',redisController.memoryCreator)
}