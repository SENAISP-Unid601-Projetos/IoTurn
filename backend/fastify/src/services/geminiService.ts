import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import chooseBestArm from "./chooseBestArm";
import { InputPredictionLog } from "./logDiagnosisService";

function getSchemaContext(): string {
  return `
    Contexto do Banco de Dados PostgreSQL:
    Você tem acesso às seguintes tabelas e colunas. Use os nomes exatos das tabelas e colunas ao gerar as queries.

      REGRA CRÍTICA E OBRIGATÓRIA  
    Como os nomes das colunas usam camelCase (ex: "companyName"), você DEVE OBRIGATORIAMENTE colocar todos os nomes de tabelas e colunas entre aspas duplas ("") em todas as queries SQL.

    Exemplo de Falha Comum:

      ERRADO (causa o erro 'column does not exist'): 
         ... JOIN "machines" m ON u.id = m.responsibleuserid

      CORRETO (use sempre este formato): 
         ... JOIN "machines" m ON u."id" = m."responsibleUserId"

    ESQUEMA COMPLETO DO BANCO DE DADOS

    1. Tabela "clients"
       Representa as empresas clientes.
       - "id" (Int, PK)
       - "companyName" (String)
       - "cnpj" (String, Único)
       - "phone" (String)
       - "address" (String)
       - "email" (String, Único)
       - "password" (String)
       - "contractDate" (DateTime)
       - "status" (Enum: ACTIVE, SUSPENDED, CANCELED)

    2. Tabela "users"
       Usuários associados a um cliente.
       - "id" (Int, PK)
       - "name" (String)
       - "email" (String, Único)
       - "password" (String)
       - "userType" (Enum: ADMIN, TECHNICIAN, VIEWER)
       - "status" (Enum: ACTIVE, SUSPENDED, CANCELED)
       - "clientId" (Int, FK → "clients"."id")
       - "createdAt" (DateTime)

    3. Tabela "machines"
       Máquinas industriais monitoradas.
       - "id" (Int, PK)
       - "name" (String)
       - "model" (String)
       - "manufacturer" (String)
       - "serialNumber" (String, Único)
       - "status" (Enum: ACTIVE, SUSPENDED, CANCELED)
       - "clientId" (Int, FK → "clients"."id")
       - "responsibleUserId" (Int, FK → "users"."id")
       - "deviceId" (Int, Único, FK → "devices"."id")

    4. Tabela "UnifiedMachineState"
       Armazena o estado consolidado da máquina.
       - "id" (String, PK)
       - "timestamp" (DateTime)
       - "machineId" (Int, FK → "machines"."id")
       - "current" (Float)
       - "rpm" (Int)
       - "oilTemperature" (Float)
       - "oilLevel" (Float)
       - "clusterPredict" (Int)
       - "clusterStrength" (Float)
       - "currentIsMissing" (Boolean)
       - "rpmIsMissing" (Boolean)
       - "oilTemperatureIsMissing" (Boolean)
       - "oilLevelIsMissing" (Boolean)

    5. Tabela "devices"
       Representa o hardware físico de um dispositivo.
       - "id" (Int, PK)
       - "nodeId" (String, Único)
       - "description" (String)
       - "status" (Enum: ONLINE, OFFLINE, PROVISIONING, ERROR, CANCELED)
       - "lastHeartbeat" (DateTime)
       - "gatewayId" (Int, FK → "gateways"."id")
       - "clientId" (Int, FK → "clients"."id")

    6. Tabela "gateways"
       Representa o gateway (ex: ESP32).
       - "id" (Int, PK)
       - "gatewayId" (String, Único)
       - "description" (String)
       - "status" (Enum: ONLINE, OFFLINE, PROVISIONING, ERROR, CANCELED)
       - "lastHeartbeat" (DateTime)
       - "clientId" (Int, FK → "clients"."id")

    7. Tabela "rpm_readings"
       Leituras de rotação por minuto.
       - "id" (Int, PK)
       - "timestamp" (DateTime)
       - "rpm" (Int)
       - "machineId" (Int, FK → "machines"."id")
       - "userId" (Int, FK → "users"."id")

    8. Tabela "oil_temperature_readings"
       Leituras de temperatura do óleo.
       - "id" (Int, PK)
       - "timestamp" (DateTime)
       - "temperature" (Float)
       - "machineId" (Int, FK → "machines"."id")
       - "userId" (Int, FK → "users"."id")

    9. Tabela "oil_level_readings"
       Leituras do nível de óleo.
       - "id" (Int, PK)
       - "timestamp" (DateTime)
       - "level" (Float)
       - "machineId" (Int, FK → "machines"."id")
       - "userId" (Int, FK → "users"."id")

    10. Tabela "current_readings"
        Leituras de corrente elétrica.
        - "id" (Int, PK)
        - "timestamp" (DateTime)
        - "current" (Float)
        - "machineId" (Int, FK → "machines"."id")
        - "userId" (Int, FK → "users"."id")

    11. Tabela "InteracaoIA"
        Histórico das interações entre o usuário e o sistema de IA.
        - "id" (Int, PK)
        - "perguntaUsuario" (String)
        - "queryMontada" (String)
        - "respostaHumanizada" (String)
        - "feedbackUsuario" (Int)
        - "criadoEm" (DateTime)
        - "atualizadoEm" (DateTime)
        - "hyperparameterArmId" (String, FK → "hyperparameter_arm"."id")

    12. Tabela "HyperparameterArm"
        Controle de versões e parâmetros de execução da IA.
        - "id" (String, PK)
        - "modelName" (String)
        - "version" (String)
        - "temperature" (Float)
        - "topP" (Float)
        - "topK" (Int)
        - "maxOutputTokens" (Int)
        - "responseMimeType" (String)
        - "successes" (Int)
        - "failures" (Int)
        - "createdAt" (DateTime)
        - "updatedAt" (DateTime)

    RELAÇÕES ENTRE AS TABELAS

    - Cada "user" pertence a um "client".
    - Cada "machine" pertence a um "client" e possui um "responsibleUser".
    - Cada "machine" pode ter um "device" e um "gateway" associados.
    - Cada leitura ("rpm_readings", "oil_temperature_readings", "oil_level_readings", "current_readings") pertence a uma "machine" e opcionalmente a um "user".
    - Cada "device" pertence a um "client" e pode estar vinculado a um "gateway".
    - Cada "gateway" pertence a um "client".
    - Cada "interacao_ia" pertence a um "hyperparameter_arm".
  `;
}

async function initGemini() {
  const bestArm = await chooseBestArm();

  const generationConfig: GenerationConfig = {
    temperature: Number(bestArm.temperature),
    topP: Number(bestArm.topP),
    topK: Number(bestArm.topK),
    maxOutputTokens: Number(bestArm.maxOutputTokens),
    responseMimeType: "application/json",
  };

  console.log("Estou no gemini service:", bestArm);
  const key = process.env.API_GEMINI_KEY;

  if (!key) {
    throw new Error("A variável de ambiente API_GEMINI_KEY não foi definida.");
  }

  const genAI = new GoogleGenerativeAI(key);

  return {
    model: genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
      generationConfig,
    }),
    generationConfig,
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
      - Se a pergunta for ambígua ou você não tiver contexto suficiente para criar a query, responda APENAS com o seguinte formato JSON: {"error": "MOTIVO DO ERRO AQUI"}

      Pergunta do usuário: "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  },

  askGeminiHuman: async (
    originalQuestion: string,
    sqlResult: any
  ): Promise<{ dataHuman: string; hiperParamsHuman: GenerationConfig }> => {
    console.log(
      `Pergunta original: ${originalQuestion}, Resultado da consulta SQL:`,
      sqlResult
    );

    const { model, generationConfig } = await initGemini();

    const sqlResultString = JSON.stringify(sqlResult, null, 2);

    const prompt = `
      Você é Lia, uma assistente virtual inteligente e empática.
      Sua tarefa é explicar o resultado de uma consulta de banco de dados para um usuário de forma natural.
      
      A pergunta original do usuário foi: "${originalQuestion}"
      O resultado obtido do banco de dados foi:
      
      ${sqlResultString}
      
      Regras:
      - Não responda em formato JSON, objeto, array ou qualquer notação de programação.
      - Não utilize nenhum caractere especial como *, /, \\, \\n ou similares na resposta.
      - Analise o resultado e responda à pergunta original do usuário de forma clara e direta.
      - Não repita a pergunta na sua resposta.
      - Se o resultado estiver vazio, informe ao usuário que não foram encontrados dados.
      - Use uma linguagem amigável, natural e evite jargões técnicos.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { dataHuman: response.text(), hiperParamsHuman: generationConfig };
  },
  askGeminiInsight: async (
    logData: InputPredictionLog,
    clusterPrediction: number,
    clusterStrength: number
  ): Promise<string> => {
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
      Força: ${clusterStrength}%

      Gere um insight claro para o operador da máquina, explicando o que está acontecendo e qual ação tomar.
      Use linguagem técnica simples e baseada em diagnósticos reais de operação industrial.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },
};
