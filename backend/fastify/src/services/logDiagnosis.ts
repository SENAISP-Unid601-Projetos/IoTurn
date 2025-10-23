import { geminiService } from "./geminiService";

export interface InputPredictionLog {
  corrente: number;
  rpm: number;
  temperatura: number;
  nivel: number;
  timestamp: Date;
}

export interface OutputBodySchema {
  data: InputPredictionLog;
  clusterPredict: number;
  clusterStrength: number;
  insight: string;
}

export const logDiagnosis = {
  logGeneration: async (
    data: InputPredictionLog,
    clusterPredict: number,
    clusterStrength: number
  ): Promise<OutputBodySchema> => {
    try {
      console.log("[logDiagnosis] Iniciando geração de insight...");

      const response = await geminiService.askGeminiInsight(
        data,
        clusterPredict,
        clusterStrength
      );

      if (!response) {
        console.warn("[logDiagnosis] Nenhum insight retornado do Gemini.");
        throw new Error("Não foi possível gerar o insight.");
      }

      const output: OutputBodySchema = {
        data,
        clusterPredict,
        clusterStrength,
        insight: response,
      };

      console.log("[logDiagnosis] Insight gerado com sucesso.");
      return output;

    } catch (error: any) {
      console.error("[logDiagnosis] Erro ao gerar diagnóstico:", error.message);
      throw new Error("Erro ao gerar diagnóstico de IA: " + error.message);
    }
  },
};
