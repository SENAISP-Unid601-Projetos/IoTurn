import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import chooseBestArm from "./chooseBestArm";
import { InputPredictionLog } from "./logDiagnosis";

function getSchemaContext(): string {
  return `
    Você tem acesso às seguintes tabelas e colunas. Use os nomes exatos das tabelas e colunas ao gerar as queries.

    Contexto do Banco de Dados PostgreSQL:
    Você tem acesso às seguintes tabelas e colunas. Use os nomes exatos das tabelas e colunas ao gerar as queries.

    REGRA CRÍTICA E OBRIGATÓRIA 
    Como os nomes das colunas usam camelCase (ex: "companyName"), você DEVE OBRIGATORIAMENTE colocar todos os nomes de tabelas e colunas entre aspas duplas ("") em todas as queries.

    Exemplo de Falha Comum:

      -ERRADO (causa o erro 'column does not exist'): ... JOIN "machines" m ON u.id = m.responsibleuserid

      -CORRETO (use sempre este formato): ... JOIN "machines" m ON u."id" = m."responsibleUserId"

    1. Tabela "clients": Armazena as informações das empresas clientes.
       - id (Int, Chave Primária)
       - companyName (String)
       - cnpj (String, Único)
       - phone (String)
       - address (String)
       - email (String, Único)
       - contractDate (DateTime)
       - status (String)

    2. Tabela "users": Armazena os usuários da plataforma.
       - id (Int, Chave Primária)
       - name (String)
       - email (String, Único)
       - password (String, Hash)
       - userType (String)
       - status (String)
       - clientId (Int)

    3. Tabela "machines": Armazena as informações das máquinas monitoradas.
       - id (Int, Chave Primária)
       - name (String)
       - model (String)
       - manufacturer (String)
       - serialNumber (String, Único)
       - status (String)
       - clientId (Int)
       - responsibleUserId (Int)

    4. Tabela "sensor_readings": Armazena as leituras dos sensores das máquinas.
       - id (Int, Chave Primária)
       - timestamp (DateTime)
       - rpm (Int)
       - oilTemperature (Float)
       - oilLevel (Float)
       - current (Float)
       - vibration (Float)
       - status (String)
       - machineId (Int)
       - userId (Int)

    Relações Importantes:
    Cada user pertence a um client.
    Cada machine pertence a um client e tem um user responsável.
    Cada sensor_reading pertence a uma machine e a um user.
  `;
}

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
  const key = process.env.API_GEMINI_KEY; 

  if (!key) {
    throw new Error("A variável de ambiente API_GEMINI_KEY não foi definida.");
  }

  const genAI = new GoogleGenerativeAI(key);
  
  return {
    model: genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21", generationConfig }),
    generationConfig
  };
}

export const geminiService = {

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

 
  askGeminiHuman: async (originalQuestion: string, sqlResult: any): Promise<{dataHuman:string, hiperParamsHuman:GenerationConfig}> => {
    console.log(`Pergunta original: ${originalQuestion}, Resultado da consulta SQL:`, sqlResult);
    
    const { model, generationConfig } = await initGemini();

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
  },
  askGeminiInsight: async (logData: InputPredictionLog, clusterPrediction: number, clusterStrength: number): Promise<string> => {
    const { model } = await initGemini();
    const context = `
      Você é Lia, uma IA especialista em análise industrial e manutenção preditiva.
      Sua função é gerar insights com base em leituras de sensores e predições de cluster,mas não repita os valores na sua resposta.

      Definições dos Clusters:
      -1: Ruído ou condição desconhecida
      0: Máquina em repouso
      1: Aquecimento inicial (RPM baixo, temperatura subindo)
      2: Operação estável
      3: Alta carga (corrente e RPM elevados)
      4: Sobreaquecimento ou condição crítica

      Campos disponíveis no log:
      - timestamp
      - current (corrente em A)
      - rpm
      - oilTemperature (°C)
      - oilLevel (%)

      **REGRA CRÍTICA:** explique o que está acontecendo referindo-se aos **nomes das métricas** (ex: "Temperatura do Óleo", "Nível da Corrente"), mas **NÃO inclua os valores numéricos** (ex: "95°C", "11A"). Os valores exatos já serão exibidos na interface do usuário.
    `;

    const prompt = `
      ${context}

      Dados recebidos:
      \`\`\`json
      ${JSON.stringify(logData, null, 2)}
      \`\`\`

      Predição do cluster: ${clusterPrediction}
      Confiança: ${clusterStrength}%

      Gere um insight claro para o operador da máquina, explicando o que está acontecendo e qual ação tomar.
      Use linguagem técnica simples e baseada em diagnósticos reais de operação industrial.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
};
