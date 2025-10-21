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


async function getAndValidateMetric<T extends keyof typeof TTLS>(
    metricName: T,
    reconstructionTime: Date,
    newData: { value?: number | null, timestamp?: Date | null },
    fetchFunction: () => Promise<LastReadingResult | null>
): Promise<{ value: number | null; isMissing: boolean }> {
    
    if (newData.value !== null && newData.value !== undefined) {
        return { value: newData.value, isMissing: false };
    }

    const lastKnownData = await fetchFunction();

    if (!lastKnownData || !lastKnownData.timestamp) {
        return { value: null, isMissing: true };
    }

    const dataAge = reconstructionTime.getTime() - lastKnownData.timestamp.getTime();
    
    if (dataAge > TTLS[metricName].milliseconds) {
        return { value: null, isMissing: true };
    } else {
        return { value: lastKnownData[metricName] !== undefined ? lastKnownData[metricName] : null, isMissing: false };
    }
}


export const unifiedMachineStateService = {
    unifiedState: async (data: NewDataPoint): Promise<void> => {
        
        const reconstructionTime = data.timeStampCorrente || 
                                 data.timeStampRpm || 
                                 data.timeStampNivel || 
                                 data.timeStampTemperatura || 
                                 new Date();

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
            return; 
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