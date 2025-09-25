import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import chooseBestArm from "./chooseBestArm";

// Helper para centralizar a obtenção do contexto do schema
function getSchemaContext(): string {
  // A melhor forma é fornecer um contexto claro e simples.
  // Usar sintaxe de CREATE TABLE ou um formato de lista simples funciona muito bem.
  return `
    Você tem acesso a um banco de dados PostgreSQL com as seguintes tabelas e colunas:

    1. Tabela "sensorData":
       - id (Int, Chave Primária)
       - createdAt (DateTime)
       - temperatura (Float)
       - nivel (Float)
       - rpm (Float)
       - corrente (Float)

    2. Tabela "usuarios":
       - id (Int, Chave Primária)
       - usuario (String, Único)
       - email (String, Único)
       - senha (String, Hash)
  `;
}

// Inicialização do Gemini permanece a mesma
async function initGemini() {
  const bestArm = await chooseBestArm();
  
  const generationConfig: GenerationConfig = {
    temperature: Number(bestArm.temperature),
    topP: Number(bestArm.topP),
    topK: Number(bestArm.topK),
    maxOutputTokens: Number(bestArm.maxOutputTokens),
    responseMimeType: 'application/json',
  };
  
  console.log("Estou no gemini service:", bestArm);
  const key = process.env.API_GEMINI_KEY; // Corrigido para corresponder ao seu código

  if (!key) {
    throw new Error("A variável de ambiente API_GEMINI_KEY não foi definida.");
  }

  const genAI = new GoogleGenerativeAI(key);
  
  return {
    model: genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig }),
    generationConfig
  };
}

export const geminiService = {
  /**
   * Gera uma query SQL a partir da pergunta do usuário.
   * Agora retorna um JSON com 'query' ou 'error'.
   */
  askGeminiSQL: async (userMessage: string): Promise<string> => {
    const { model } = await initGemini();
    const schemaContext = getSchemaContext();

    const prompt = `
      ${schemaContext}

      Sua tarefa é converter a pergunta do usuário em uma query SQL SELECT para o PostgreSQL.
      
      Regras:
      - Gere APENAS a query SQL.
      - NÃO use colunas de ID no SELECT.
      - Se você puder gerar a query, responda APENAS com o seguinte formato JSON: {"query": "SUA QUERY SQL AQUI;"}
      - Se a pergunta for ambígua ou você não tiver contexto suficiente para criar a query, responda APENAS com o seguinte formato JSON: {"error": "MOTIVO DO ERRO AQUI"}

      Pergunta do usuário: "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  },

  /**
   * Gera uma resposta humanizada a partir do resultado do banco de dados.
   * AGORA RECEBE A PERGUNTA ORIGINAL como argumento para evitar o uso de variável global.
   */
  askGeminiHuman: async (originalQuestion: string, sqlResult: any): Promise<{dataHuman:string, hiperParamsHuman:GenerationConfig}> => {
    console.log(`Pergunta original: ${originalQuestion}, Resultado da consulta SQL:`, sqlResult);
    
    const { model, generationConfig } = await initGemini();

    // Converte o resultado do banco (que pode ser um array de objetos) em uma string JSON para a IA ler
    const sqlResultString = JSON.stringify(sqlResult, null, 2);

    const prompt = `
      Você é Lia, uma assistente virtual inteligente e empática.
      Sua tarefa é explicar o resultado de uma consulta de banco de dados para um usuário de forma natural.

      A pergunta original do usuário foi: "${originalQuestion}"
      O resultado obtido do banco de dados foi:
      \`\`\`json
      ${sqlResultString}
      \`\`\`

      Regras:
      - Analise o resultado e responda à pergunta original do usuário de forma clara e direta.
      - Não repita a pergunta na sua resposta.
      - Se o resultado estiver vazio, informe ao usuário que não foram encontrados dados.
      - Use uma linguagem amigável e evite jargões técnicos.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return { dataHuman: response.text(), hiperParamsHuman: generationConfig };
  }
};
