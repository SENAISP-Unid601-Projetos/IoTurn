import ApiService from './ApiServices';
import { formatTimestamp } from '../utils/formatters';

const API_URL = '/machines';

const formatMachineData = (machine) => {
  const companyName = machine.client?.companyName || '–';
  const deviceId = machine.device?.nodeId || '–';

  return {
    id: machine.id,
    name: machine.name,
    serialNumber: machine.serialNumber,
    manufacturer: machine.manufacturer,
    model: machine.model,
    company: companyName,
    iotDevice: deviceId,
    lastUpdate: formatTimestamp(machine.lastRpm?.timestamp),
    status: machine.status,
    metrics: {
      rpm: {
        name: 'RPM',
        value: machine.lastRpm?.rpm ?? 0,
        unit: '',
        min: machine.lastRpm?.min ?? 0,
        med: machine.lastRpm?.med ?? 0,
        max: machine.lastRpm?.max ?? 0,
      },
      temp: {
        name: 'Temperatura',
        value: machine.lastOilTemperature?.temperature ?? 0,
        unit: '°C',
        min: machine.lastOilTemperature?.min ?? 0,
        med: machine.lastOilTemperature?.med ?? 0,
        max: machine.lastOilTemperature?.max ?? 0,
      },
      oleo: {
        name: 'Nível de Óleo',
        value: machine.lastOilLevel?.level ?? 0,
        unit: '%',
        min: machine.lastOilLevel?.min ?? 0,
        med: machine.lastOilLevel?.med ?? 0,
        max: machine.lastOilLevel?.max ?? 0,
      },
      corrente: {
        name: 'Corrente',
        value: machine.lastCurrent?.current ?? 0,
        unit: 'A',
        min: machine.lastCurrent?.min ?? 0,
        med: machine.lastCurrent?.med ?? 0,
        max: machine.lastCurrent?.max ?? 0,
      },
    }
  };
};

export const fetchAllMachineData = async () => {
  console.log("Buscando dados da nova API...");
  const rawData = await ApiService.getRequest(API_URL);
  console.log("Dados brutos recebidos:", rawData);

  const formattedData = rawData.map(formatMachineData);

  console.log("Dados formatados para o front-end:", formattedData);
  return formattedData;
};

export const fetchMachineById = async (id) => {
  console.log(`Buscando dados da máquina ${id}...`);
  const rawData = await ApiService.getRequest(`${API_URL}/${id}`);
  console.log("Dados brutos da máquina:", rawData);

  const formattedData = formatMachineData(rawData);

  console.log("Dados formatados da máquina:", formattedData);
  return formattedData;
}