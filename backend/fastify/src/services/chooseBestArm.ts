import axios from "axios";
import { hyperParameterArmRepository } from "../infrastructure/repository/hyperparameterArmRepository";
import { ArmData } from "../infrastructure/repository/hyperparameterArmRepository";
export default async function chooseBestArm() {
    try {
        const arms = await hyperParameterArmRepository.getAllArms();

        const defaultArm: ArmData  = {
            temperature: 0.7,
            topP: 0.9,
            topK: 50,
            maxOutputTokens: 1024,
            responseMimeType: 'text/plain'
        };

        if (arms.length === 0) {
            console.error("Lista de arms está vazia. Não é possível fazer a requisição.");
            return defaultArm
        }
        console.log("Arms enviados:", arms);

        const response = await axios.post("http://10.110.18.15:30007/bestArm", { arms:arms });

        if (response.status === 200) {
            const bestArmReturned = response.data;
            const bestArm =  await hyperParameterArmRepository.getBestArm(bestArmReturned)
            console.log("Arms recebido:", bestArmReturned);
            return bestArm || defaultArm;
        } else {
            return defaultArm;
        }
    } catch (err) {
        console.error("Erro interno na requisição ao microserviço:", err);
        throw err; 
    }
}
