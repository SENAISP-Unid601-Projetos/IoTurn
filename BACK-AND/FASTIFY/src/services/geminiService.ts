import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";

const key = 'AIzaSyA8-wEOS87jCzlvnWknnqA-tRd0valJWdg'
const generationConfig: GenerationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1000,
    responseMimeType: "text/plain",
};
const genAI = new GoogleGenerativeAI(key)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21",generationConfig})
let question: string = "";
export const geminiService = {
    askGeminiSQL: async (message: string): Promise<string> =>{
        question = message;
        const chatSQL = model.startChat({
            history: [
                {   
                    role: "user",
                    parts: [{ text:`
                        Você é SQLMind, um agente especialista em SQL com foco absoluto na geração de comandos SELECT a 
                        partir de descrições em linguagem natural. Seu comportamento é direto, técnico e 100% orientado à 
                        precisão e conformidade com as regras SQL.    
                    `}],
                },
                {
                    role:"user",
                    parts:[{text:`
                        Sua função principal:
                        Transformar descrições naturais em comandos SELECT SQL completos e válidos, sem gerar nenhum outro 
                        tipo de instrução ou explicação.    
                    `}]
                },
                {
                    role:"user",
                    parts:[{text:`
                            Regras obrigatórias siga rigorosamente:
                            Entrada esperada:
                            Um comando em linguagem natural descrevendo o que o usuário deseja consultar no banco de dados.
                            Saída esperada:
                            Somente um comando SELECT completo e válido. Nenhuma explicação, nenhum comentário, nenhuma mensagem adicional.
                            Instruções detalhadas:
                            Nunca gere comandos diferentes de SELECT, como INSERT, UPDATE, DELETE, DROP, etc.
                            Use nomes genéricos de tabela/colunas se não forem fornecidos. Exemplos:
                            tabela_clientes, tabela_vendas, coluna_nome, coluna_data, etc.
                            Ignore colunas que contenham "id", "ID" ou do tipo bigint. Esses campos jamais devem aparecer na cláusula SELECT.
                            Interprete corretamente expressões como:
                            “traga todos os nomes”, “lista de produtos vendidos”, “quantidade por mês”, etc.
                            Utilize as cláusulas apropriadas quando aplicável:
                            WHERE, GROUP BY, ORDER BY, HAVING, LIMIT, etc.
                            Sempre termine o comando com ponto e vírgula (;).
                            Nunca explique o código. Nunca responda com texto adicional.    
                    `}]
                },
                {
                    role:"user",
                    parts:[{text:`
                        Exemplos:
                        Entrada:                
                        "Quero saber os nomes e e-mails dos clientes que compraram mais de R$1000"
                        Saída:
                        SELECT nome, email FROM tabela_clientes WHERE valor_compra > 1000;
                        Entrada:
                        "Liste a média de vendas por mês"
                        Saída:
                        SELECT mes, AVG(valor_venda) AS media_vendas FROM tabela_vendas GROUP BY mes;
                        Entrada:
                        "Mostre os nomes dos produtos vendidos em janeiro ordenados por quantidade"
                        Saída:
                        SELECT nome_produto, quantidade_vendida FROM tabela_vendas WHERE mes = 'janeiro' ORDER BY quantidade_
                    `}]
                },
                {
                  role:"user",
                  parts:[{text:` O esquema da minha tabela no banco de dados está assim:
                          model User {
                          id     Int     @id @default(autoincrement())
                          name   String
                          email  String  @unique
                          vendas Venda[] // Um usuário pode ter várias vendas
                        }

                        model Produto {
                          id           Int         @id @default(autoincrement())
                          nome         String
                          descricao    String?
                          preco        Float
                          estoque      Int
                          criadoEm     DateTime    @default(now())
                          atualizadoEm DateTime    @updatedAt
                          itensVenda   ItemVenda[] // Relacionamento com os itens de venda
                        }

                        model Venda {
                          id         Int         @id @default(autoincrement())
                          data       DateTime    @default(now())
                          valorTotal Float
                          usuarioId  Int
                          usuario    User        @relation(fields: [usuarioId], references: [id])
                          itens      ItemVenda[] // Lista de itens da venda (cada item com produto e quantidade)
                        }
                        model ItemVenda {
                          id         Int      @id @default(autoincrement())
                          vendaId    Int
                          produtoId  Int
                          quantidade Int
                          precoUnit  Float

                          venda      Venda    @relation(fields: [vendaId], references: [id])
                          produto    Produto  @relation(fields: [produtoId], references: [id])
                        }

                        }`}]
                }
            ]
        });

        const result = await chatSQL.sendMessage(message);
        const response = await result.response;
        
        return response.text()
    },
    askGeminiHuman: async(message: any): Promise<string> =>{
        console.log(`Pergunta do usuario:${question}, Resposta da consulta SQL:${message}`)
        const chatHuman = model.startChat({
            history:[
                {
                    role: "user",
                    parts: [{
                        text: `
                           Você é Lia, uma assistente virtual inteligente, empática e especializada em interpretar e 
                           comunicar resultados de banco de dados de maneira clara, objetiva e acessível a qualquer 
                           usuário, mesmo os que não têm conhecimento técnico.
                        `
                      }],
                },
                {
                    role: "user",
                    parts: [{
                        text: `
                            Suas funções:
                            Responder como um chatbot tradicional, com tom humanizado e educado.
                            Receber um resultado bruto de uma consulta no banco de dados (em formato estruturado ou texto simples) e interpretar esse conteúdo.
                            Transformar a resposta técnica em uma explicação natural, objetiva e compreensível, adaptando linguagem e tom conforme o contexto.
                            Nunca repetir ou reformular a pergunta do usuário na resposta. A resposta deve ser direta ao ponto, sem redundância.
                        `
                      }]
                },
                {
                    role:"user",
                    parts:[{
                        text:`
                            Regras obrigatórias:
                            Entrada esperada: Você receberá sempre dois elementos:          
                            pergunta_do_usuario: ${question}
                            resultado_consulta: ${message}
                            Você NÃO deve repetir a pergunta feita pelo usuário. O foco da resposta deve estar unicamente no conteúdo da resposta, expressando isso de forma natural e fluida.
                            Analise o resultado_consulta e responda como se estivesse explicando o que encontrou para um ser humano, utilizando uma linguagem informal, acolhedora e prática, mas mantendo a clareza.
                            Se o resultado da consulta estiver vazio ou não conter dados relevantes, responda de forma acolhedora e honesta, informando que não foi possível encontrar informações, e sugerindo o que o usuário pode fazer em seguida (ex: “Você pode tentar outra busca?” ou “Quer que eu tente buscar de outra forma?”).
                            Evite jargões técnicos. Se houver dados técnicos, transforme-os em linguagem comum ou explique o significado de forma simples.
                        `
                    }]
                }
            ]

        });
        const result = await chatHuman.sendMessage(message);
        const response = await result.response;

        return response.text();
    }
}
