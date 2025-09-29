
import { error } from 'console';
import mqttClient from './src/config/mqttClient'
import { sensoresReadingRepository } from './src/infrastructure/repository/sensoresReadingRepository';
const TOPIC = 'ioturn/maquinas/+/dt/+'; 

// Subscreve aos tópicos
mqttClient.subscribe(TOPIC, { qos: 0 }, (err, granted) => {
  if (err) {
    console.error('[MQTT SUBSCRIBER] Erro ao se inscrever:', err)
  } else if(granted) {
    console.log('[MQTT SUBSCRIBER] Inscrito nos tópicos:', granted.map(g => g.topic).join(', '))
  }
})

// Ouvinte de mensagens
mqttClient.on('message',async (topic, message) => {
  try {
    const payload = message.toString();
    const topicParts = topic.split('/');
    
    const machineIdStr = topicParts[2];
    const sensorType = topicParts[4];
    
    const numericMachineId = parseInt(machineIdStr);
    const numericPayload = parseFloat(payload);
    
    console.log(`[MQTT RECEBIDO] Tópico: ${topic} | Mensagem: ${payload}`);

    if (isNaN(numericMachineId) || isNaN(numericPayload)) {
      throw error(`[ERRO DE DADOS] MachineID ou Payload inválido. Tópico: ${topic}, Payload: ${payload}`);
    }

    //Caso não funcionar, mudar a estrutura do banco para Long Format, timestamp,machineId,metricType,numericValue
    switch(sensorType){
      case 'temperatura':
        await sensoresReadingRepository.newOilTemperatureReading({
          temperature: numericPayload,
          machineId: numericMachineId
        });
        break;
      case 'nivel':
        await sensoresReadingRepository.newOilLevelReading({
          level: numericPayload,
          machineId: numericMachineId
        });
        break;
      case 'rpm':
        await sensoresReadingRepository.newRpm({
          rpm: numericPayload,
          machineId: numericMachineId
        });
        break;
      case 'corrente':
        await sensoresReadingRepository.newCurrentReading({
          current: numericPayload,
          machineId: numericMachineId
        })
      default:
        console.log(`[MQTT AVISO] Nenhum manipulador para o tipo de sensor: ${sensorType}`);
        break;
    }
        
  } catch (error) {
    console.error('[ERRO DE PARSE MQTT]:', error)
  }
})

export default function refreshMappings(gateway: string){
  mqttClient.publish(`ioturn/${gateway}/all/commands`, JSON.stringify({ command: 'refresh_mappings' }), { qos: 0, retain: false }, (err) => {
    if (err) {
      console.error('[MQTT PUBLISH] Erro ao publicar mensagem:', err)
    } else {
      console.log('[MQTT PUBLISH] Mensagem publicada com sucesso no tópico ioturn/gateways/all/commands')
    }
  })
}  

