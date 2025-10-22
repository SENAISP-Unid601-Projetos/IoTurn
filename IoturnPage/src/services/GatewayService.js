const GATEWAYS_API_URL = 'http://localhost:3001'

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'; 
  return new Date(timestamp).toLocaleString('pt-BR');
};

export const fetchAllGatewayData = async () => {
  console.log('Buscando dados dos gateways...');
  const response = await fetch(GATEWAYS_API_URL);

  if (!response.ok) {
    throw new Error('Falha ao buscar os dados dos gateways');
  }

  const rawData = await response.json();
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


