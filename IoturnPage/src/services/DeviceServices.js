import ApiService from "./ApiServices";
import { formatTimestamp } from "../utils/formatters";
import { fetchAllGatewayData } from "./GatewayService";

const DEVICES_API_URL = "/devices/allDevices";

export const fetchAllDeviceData = async () => {
  try {
    // 👇 2. Busque Dispositivos E Gateways ao mesmo tempo (em paralelo)
    const [rawData, rawGateways] = await Promise.all([
      ApiService.getRequest(DEVICES_API_URL),
      fetchAllGatewayData(),
    ]);

    // 👇 3. Crie um "Dicionário" para trocar ID por Nome
    // Exemplo: { 11: "PedroGateway", 15: "ESP-32 Teste" }
    const gatewayMap = {};
    if (Array.isArray(rawGateways)) {
      rawGateways.forEach((g) => {
        // g.id é o número (11), g.gatewayId é o nome ("PedroGateway")
        gatewayMap[g.id] = g.gatewayId;
      });
    }

    const formattedData = rawData.map((device) => {
      const gatewayName =
        device.gateway?.gatewayId ||
        gatewayMap[device.gatewayId] || 
        "–";

      return {
        id: device.id,
        nodeId: device.nodeId || "–",
        description: device.description || "–",
        status: device.status || "–",
        lastHeartbeat: formatTimestamp(device.lastHeartbeat),
        machineName: device.machine?.name || "–",
        gatewayId: gatewayName,

        gatewayStatus: device.gateway?.status || "–",
        gatewayLastHeartbeat: formatTimestamp(device.gateway?.lastHeartbeat),
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Erro ao buscar dados de dispositivos:", error);
    return [];
  }
};
