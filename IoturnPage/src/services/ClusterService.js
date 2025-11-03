import ApiService from './ApiServices';
import { formatTimestamp } from '../utils/formatters';

const API_URL = '/cluster_analysis';

export const fetchClusterData = async () => {
    console.log('Buscando dados de análise de cluster...');

    const rawData = await ApiService.getRequest(API_URL);

    console.log('Dados brutos de cluster recebidos:', rawData);

    const formattedEvents = rawData.events.map(event => ({
        ...event,
        time: new Date(event.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
    }));

    const formattedData = {
        summary: rawData.summary,
        events: formattedEvents,
    };

    console.log('Dados de cluster formatados:', formattedData);
    return formattedData;
};