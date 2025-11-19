import ApiService from "./ApiServices";
import { formatTimestamp } from "../utils/formatters";

const GATEWAYS_API_URL = "/gateways/allGateways";
const DEVICES_API_URL = "/devices/allDevices"; 

export const fetchAllGatewayData = async () => {
  try {
    const [rawGateways, rawDevices] = await Promise.all([
      ApiService.getRequest(GATEWAYS_API_URL),
      ApiService.getRequest(DEVICES_API_URL)
    ]);

    const deviceCountMap = {};

    if (Array.isArray(rawDevices)) {
      rawDevices.forEach((device) => {
        const gatewayId = device.gateway?.id || device.gatewayId;

        if (gatewayId) {
          deviceCountMap[gatewayId] = (deviceCountMap[gatewayId] || 0) + 1;
        }
      });
    }

    const formattedData = rawGateways.map((gateway) => ({
      id: gateway.id,
      gatewayId: gateway.gatewayId || "–",
      description: gateway.description || "–",
      status: gateway.status || "UNKNOWN",
      
      connectedDevices: deviceCountMap[gateway.id] || 0, 
      
      lastHeartbeat: formatTimestamp(gateway.lastHeartbeat),
    }));

    return formattedData;

  } catch (error) {
    console.error("Erro ao buscar gateways e contar dispositivos:", error);
    return [];
  }
};