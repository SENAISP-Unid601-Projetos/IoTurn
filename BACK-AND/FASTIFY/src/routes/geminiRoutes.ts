import fastify, { FastifyInstance } from "fastify";
import { geminiController } from "../controller/geminiController";

export async function geminiRoutes(fastify: FastifyInstance){
    fastify.post('/askGemini',geminiController.askGeminiController)
}