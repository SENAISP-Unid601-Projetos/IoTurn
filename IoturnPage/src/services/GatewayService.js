import ApiService from './ApiServices';
import { formatTimestamp } from '../utils/formatters';

const GATEWAYS_API_URL = '/gateways';

export const fetchAllGatewayData = async () => {
  console.log('Buscando dados dos gateways...');
  
  const rawData = await ApiService.getRequest(GATEWAYS_API_URL);

  console.log('Dados brutos dos gateways recebidos:', rawData);

  const formattedData = rawData.map(gateway => ({
    id: gateway.id,
    gatewayId: gateway.gatewayId || '–',
    description: gateway.description || '–',
    status: gateway.status || 'UNKNOWN',
    connectedDevices: gateway.connectedDevices || 0,
    lastHeartbeat: formatTimestamp(gateway.lastHeartbeat),
  }));

  console.log('Dados formatados dos gateways:', formattedData);
  return formattedData;
};