// const API_URL = 'http://10.110.12.12:3000/machines/getAllUsersMachine/1';
// const formatTimestamp = (timestamp) => {
//   if (!timestamp) return 'N/A';
//   const date = new Date(timestamp);
//   return date.toLocaleString('pt-BR');
// };


// export const fetchAllMachineData = async () => {
//   console.log("Buscando dados da nova API...");
//   const response = await fetch(API_URL);

//   if (!response.ok) {
//     throw new Error('Falha ao buscar os dados da nova API');
//   }

//   const rawData = await response.json();
//   console.log("Dados brutos recebidos:", rawData);

//   const formattedData = rawData.map(machine => {
//     return {
//       id: machine.id,
//       name: machine.name,
//       sector: machine.model || '', 
//       machineId: machine.serialNumber, 
//       company: machine.manufacturer,   
//       lastUpdate: formatTimestamp(machine.lastRpm?.timestamp), 

//       metrics: [
//         { name: 'RPM', value: machine.lastRpm?.rpm ?? 'N/A', unit: '' },
//         { name: 'Temp', value: machine.lastOilTemperature?.temperature ?? 'N/A', unit: '°C' },
//         { name: 'Óleo', value: machine.lastOilLevel?.level ?? 'N/A', unit: '%' },
//         { name: 'Corrente', value: machine.lastCurrent?.current ?? 'N/A', unit: 'A' },
//       ]
//     };
//   });

//   console.log("Dados formatados para o front-end:", formattedData);
//   return formattedData;
// };



const MACHINES_URL = 'http://localhost:3001/machines';
const METRICS_BASE_URL = 'http://localhost:3001/metrics';

export const fetchAllMachineData = async () => {
  const machinesResponse = await fetch(MACHINES_URL);
  if (!machinesResponse.ok) throw new Error('Falha ao buscar a lista de máquinas');
  const machinesData = await machinesResponse.json();

  const metricsPromises = machinesData.map(machine =>
    fetch(`${METRICS_BASE_URL}?machineId=${machine.id}`)
      .then(res => res.json())
      .then(data => data[0])
  );

  const metricsResults = await Promise.all(metricsPromises);

  const combinedData = machinesData.map(machine => {

    const machineMetrics = metricsResults.find(m => m && m.machineId === Number(machine.id));
    
    return {
      ...machine,
      metrics: machineMetrics ? machineMetrics.metrics : [],
    };
  });

  return combinedData;
};
