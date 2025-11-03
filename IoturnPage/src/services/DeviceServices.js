import ApiService from './ApiServices';
import { formatTimestamp } from '../utils/formatters';

const DEVICES_API_URL = '/devices';

export const fetchAllDeviceData = async () => {
  console.log('Buscando dados dos dispositivos...');

  const rawData = await ApiService.getRequest(DEVICES_API_URL);

  console.log('Dados brutos dos dispositivos recebidos:', rawData);

  const formattedData = rawData.map(device => {
    return {
        id: device.id,
        nodeId: device.nodeId || '–',
        description: device.description || '–',
        status: device.status || '–',
        lastHeartbeat: formatTimestamp(device.lastHeartbeat),
        machineName: device.machine?.name || '–',
        gatewayId: device.gateway?.gatewayId || '–',
        gatewayStatus: device.gateway?.status || '–',
        gatewayLastHeartbeat: formatTimestamp(device.gateway?.lastHeartbeat),
      };
  });

  console.log('Dados formatados dos dispositivos:', formattedData);
  return formattedData;
};