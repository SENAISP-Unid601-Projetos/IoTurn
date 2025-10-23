const DEVICES_API_URL = 'http://10.110.12.24:3000/devices/allDevices/1';
//const DEVICES_API_URL = 'http://localhost:3000/devices';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR');
};

export const fetchAllDeviceData = async () => {
  console.log('Buscando dados dos dispositivos...');
  const response = await fetch(DEVICES_API_URL);

  if (!response.ok) {
    throw new Error('Falha ao buscar os dados dos dispositivos');
  }

  const rawData = await response.json();
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