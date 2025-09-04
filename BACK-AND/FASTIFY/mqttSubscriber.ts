
import mqttClient from '../FASTIFY/src/config/mqttClient'
import { sensorDataRepository } from './src/infrastructure/repository/sensorDataRepository'
const TOPICS = ['esp32/sensores']; 
interface sensorData {
  temperatura:number,
  nivel:number,
  rpm:number,
  corrente:number
}
// Subscreve aos tópicos
mqttClient.subscribe(TOPICS, { qos: 0 }, (err, granted) => {
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
    const {temperatura,nivel,rpm,corrente} = JSON.parse(payload);

    console.log(`[MQTT RECEBIDO] Tópico: ${topic} | Mensagem: ${payload}`);

    await sensorDataRepository.saveMqttPayload(
      parseFloat(temperatura.toFixed(2)),
      parseFloat(nivel.toFixed(2)),
      parseInt(rpm),
      parseFloat(corrente.toFixed(2))
    );
  
    
  } catch (error) {
    console.error('[ERRO DE PARSE MQTT]:', error)
  }
})
