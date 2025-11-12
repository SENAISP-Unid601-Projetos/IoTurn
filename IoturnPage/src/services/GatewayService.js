import ApiService from "./ApiServices";
import { formatTimestamp } from "../utils/formatters";

const GATEWAYS_API_URL = "/gateways/allGateways";

export const fetchAllGatewayData = async () => {
  const rawData = await ApiService.getRequest(GATEWAYS_API_URL);
  const formattedData = rawData.map((gateway) => ({
    id: gateway.id,
    gatewayId: gateway.gatewayId || "–",
    description: gateway.description || "–",
    status: gateway.status || "UNKNOWN",
    connectedDevices: gateway.connectedDevices || 0,
    lastHeartbeat: formatTimestamp(gateway.lastHeartbeat),
  }));

  return formattedData;
};
