import { HyperparameterArm, Prisma,PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export type ArmData = Pick<HyperparameterArm, 'temperature' | 'topP' | 'topK' | 'maxOutputTokens' | 'responseMimeType'>;

export const hyperParameterArmRepository = {
    saveArm: async(temperature: number, topP: number, topK: number, maxOutputTokens: number, responseMimeType: string): Promise<any> =>{
        try{
            const result = await prisma.hyperparameterArm.create({
                data:{
                    temperature:temperature,
                    topP:topP,
                    topK:topK,
                    maxOutputTokens:maxOutputTokens,
                    responseMimeType:responseMimeType
                }
            });
            return result;
        } catch(err){
            console.error("Erro ao criar braço:", err);
        }
    },
    betaDistributionParams: async (armId: number, feedback: number): Promise<any> => {
        try {
          let result;
      
          if (feedback === 1) {
            result = await prisma.hyperparameterArm.update({
              where: { id: armId.toString()},
              data: {
                successes: { increment: 1 }
              }
            });
          } else if (feedback === 0) {
            result = await prisma.hyperparameterArm.update({
              where: { id: armId.toString() },
              data: {
                failures: { increment: 1 }
              }
            });
          } else {
            throw new Error("Feedback inválido. Use 1 para sucesso ou 0 para fracasso.");
          }
      
          return result;
        } catch (err) {
          console.error("Erro ao atualizar distribuição beta:", err);
          throw err;
        }
    },
    existingArm: async(temperature: number,
        topP: number,
        topK: number,
        maxOutputTokens: number,
        responseMimeType: string): Promise<any> =>{
        try{
            const existingArm = await prisma.hyperparameterArm.findFirst({
                where: {
                  temperature,
                  topP,
                  topK,
                  maxOutputTokens,
                  responseMimeType
                }
            });

            return existingArm;
        } catch (err) {
            console.error("Erro ao achar braço que já existe:", err);
            throw err;
        }

    },
    getAllArms: async():Promise<any> =>{
      try{
        const arms = await prisma.hyperparameterArm.findMany({
          select:{
            id:true,
            successes:true,
            failures:true
          }
        });
        return arms;

      } catch (err) {
        console.error("Erro ao achar todos os braços:", err);
        throw err;
      }
    },
    getBestArm: async(armId: string):Promise<ArmData> =>{
      try {
        const bestArm = await prisma.hyperparameterArm.findFirstOrThrow({
          select:{
            temperature: true,
            topP: true,
            topK: true,
            maxOutputTokens: true,
            responseMimeType: true
          },
          where:{
            id:armId
          }
        });
        return bestArm;
      }catch (err) {
        console.error("Erro ao achar o melhor braço:", err);
        throw err;
      }
    }     
}