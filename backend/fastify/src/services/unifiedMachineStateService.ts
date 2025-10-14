import { NewDataPoint } from "../../mqttSubscriber";
import { sensoresReadingRepository, LastReadingResult } from "../infrastructure/repository/sensoresReadingRepository";
import { unifiedMachineStateRepository, NewUnifiedMachineState } from "../infrastructure/repository/unifiedMachineStateRepository";
import axios from "axios";
const TTLS = {
    current: { milliseconds: 35000 },
    rpm: { milliseconds: 35000 },
    oilTemperature: { milliseconds: 300000 }, // 5 minutos
    oilLevel: { milliseconds: 3600000 } // 1 hora
};

// --- FUNÇÃO AUXILIAR PARA VALIDAR UMA MÉTRICA ---
// Esta função encapsula toda a lógica para uma única métrica.
async function getAndValidateMetric<T extends keyof typeof TTLS>(
    metricName: T,
    reconstructionTime: Date,
    newData: { value?: number | null, timestamp?: Date | null },
    fetchFunction: () => Promise<LastReadingResult | null>
): Promise<{ value: number | null; isMissing: boolean }> {
    
    // Caso 1: O dado já veio no pacote de entrada. Usamos ele.
    if (newData.value !== null && newData.value !== undefined) {
        return { value: newData.value, isMissing: false };
    }

    // Caso 2: O dado não veio. Precisamos buscar no histórico.
    const lastKnownData = await fetchFunction();

    // Se não há histórico, o dado está ausente.
    if (!lastKnownData || !lastKnownData.timestamp) {
        return { value: null, isMissing: true };
    }

    // Caso 3: Encontramos um dado histórico. Precisamos validar seu TTL.
    const dataAge = reconstructionTime.getTime() - lastKnownData.timestamp.getTime();
    
    if (dataAge > TTLS[metricName].milliseconds) {
        // O dado é muito antigo (obsoleto).
        return { value: null, isMissing: true };
    } else {
        // O dado é recente o suficiente. Usamos ele.
        return { value: lastKnownData[metricName] !== undefined ? lastKnownData[metricName] : null, isMissing: false };
    }
}


export const unifiedMachineStateService = {
    unifiedState: async (data: NewDataPoint): Promise<void> => {
        // O timestamp do evento que disparou a reconstrução é a nossa referência.
        const reconstructionTime = new Date();

        // Executamos todas as buscas e validações em PARALELO para performance.
        const [
            currentResult,
            rpmResult,
            oilTemperatureResult,
            oilLevelResult
        ] = await Promise.all([
            // Corrente
            getAndValidateMetric(
                'current',
                reconstructionTime,
                { value: data.corrente, timestamp: data.timeStampCorrente },
                () => sensoresReadingRepository.findLastCurrentData(data.machineId, reconstructionTime)
            ),
            // RPM
            getAndValidateMetric(
                'rpm',
                reconstructionTime,
                { value: data.rpm, timestamp: data.timeStampRpm },
                () => sensoresReadingRepository.findLastRpmData(data.machineId, reconstructionTime)
            ),
            // Temperatura do Óleo
            getAndValidateMetric(
                'oilTemperature',
                reconstructionTime,
                { value: data.temperatura, timestamp: data.timeStampTemperatura },
                () => sensoresReadingRepository.findLastOilTemperatureData(data.machineId, reconstructionTime)
            ),
            // Nível do Óleo
            getAndValidateMetric(
                'oilLevel',
                reconstructionTime,
                { value: data.nivel, timestamp: data.timeStampNivel },
                () => sensoresReadingRepository.findLastOilLevelData(data.machineId, reconstructionTime)
            )
        ]);

        const newState: NewUnifiedMachineState = {
            timestamp: reconstructionTime,
            machineId: data.machineId,
            current: currentResult.value ?? undefined,
            rpm: rpmResult.value ?? undefined,
            oilTemperature: oilTemperatureResult.value ?? undefined,
            oilLevel: oilLevelResult.value ?? undefined,
            currentIsMissing: currentResult.isMissing,
            rpmIsMissing: rpmResult.isMissing,
            oilTemperatureIsMissing: oilTemperatureResult.isMissing,
            oilLevelIsMissing: oilLevelResult.isMissing,
            clusterPredict: null,
            clusterStrength: null
        };

         if (newState.currentIsMissing || newState.rpmIsMissing || newState.oilTemperatureIsMissing || newState.oilLevelIsMissing) {
            console.warn(`[Machine ID: ${newState.machineId}] Dados incompletos para predição. Salvando estado sem cluster.`);
            await unifiedMachineStateRepository.newUnifiedMachine(newState);
            return; // Encerra a função aqui, evitando a chamada à API
        }

        try {
            const predictionPayload = {
                current: newState.current,
                rpm: newState.rpm,
                oilTemperature: newState.oilTemperature,
                oilLevel: newState.oilLevel
            };
            console.log(`[Machine ID: ${newState.machineId}] Enviando dados para predição:`, predictionPayload);
            const response = await axios.post('http://127.0.0.1:8000/predictCluster', predictionPayload);

            if (response.status === 200) {
                const { predicted_cluster, prediction_strength } = response.data;
                
                newState.clusterPredict = predicted_cluster;
                newState.clusterStrength = prediction_strength;
                
                console.log(`[Machine ID: ${newState.machineId}] Predição recebida: Cluster ${predicted_cluster}`);
                await unifiedMachineStateRepository.newUnifiedMachine(newState);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Erro na chamada para a API de predição:", error.response?.data || error.message);
            } else {
                console.error("Erro desconhecido ao tentar prever o cluster:", error);
            }
            console.warn(`[Machine ID: ${newState.machineId}] Predição falhou. Salvando estado sem cluster.`);
            await unifiedMachineStateRepository.newUnifiedMachine(newState);
        }
    }
}