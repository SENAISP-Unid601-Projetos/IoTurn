import { format } from "date-fns";
import { createHash } from "crypto";

export const helper = {
    // <T> fala que a função é um tipo generico, obj: T que o objeto a ser entrado vai ser generico e que ela retorna um generico
    convertBigInt: <T>(obj: T): T => {
        //Passa por cada valor do obj. Caso encontre um bigInt da um parse nele
        return JSON.parse(
          JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? Number(v) : v))
        );
    },

    catchMoment(): string{
      return format(new Date(),'HH:mm:ss.SSS');
    },

    createSHA256(data: string): string{
      return createHash('sha256').update(data).digest('hex'); 
    }
}