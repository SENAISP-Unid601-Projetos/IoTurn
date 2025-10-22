
// const MACHINES_URL = 'http://localhost:3001/machines';
// const METRICS_BASE_URL = 'http://localhost:3001/metrics';

// export const fetchAllMachineData = async () => {
//   const machinesResponse = await fetch(MACHINES_URL);
//   if (!machinesResponse.ok) throw new Error('Falha ao buscar a lista de máquinas');
//   const machinesData = await machinesResponse.json();

//   const metricsPromises = machinesData.map(machine =>
//     fetch(`${METRICS_BASE_URL}?machineId=${machine.id}`)
//       .then(res => res.json())
//       .then(data => data[0])
//   );

//   const metricsResults = await Promise.all(metricsPromises);

//   const combinedData = machinesData.map(machine => {

//     const machineMetrics = metricsResults.find(m => m && m.machineId === Number(machine.id));
    
//     return {
//       ...machine,
//       metrics: machineMetrics ? machineMetrics.metrics : [],
//     };
//   });

//   return combinedData;
// };


const API_URL = 'http://10.110.12.48:3000/machines/getAll/1';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR');
};

export const fetchAllMachineData = async () => {
  console.log("Buscando dados da nova API...");
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da nova API');
  }

  const rawData = await response.json();
  console.log("Dados brutos recebidos:", rawData);

  const formattedData = rawData.map(machine => {
  
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


      metrics: [
        { 
          name: 'RPM', 
          value: machine.lastRpm?.rpm ?? 'N/A', 
          unit: '' 
        },
        { 
          name: 'Temp', 
          value: machine.lastOilTemperature?.temperature ?? 'N/A', 
          unit: '°C' 
        },
        { 
          name: 'Óleo', 
          value: machine.lastOilLevel?.level ?? 'N/A', 
          unit: '%' 
        },
        { 
          name: 'Corrente', 
          value: machine.lastCurrent?.current ?? 'N/A', 
          unit: 'A' 
        },
      ]
    };
  });

  console.log("Dados formatados para o front-end:", formattedData);
  return formattedData;
};
