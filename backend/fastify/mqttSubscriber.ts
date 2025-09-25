
import mqttClient from './src/config/mqttClient'
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
        
  } catch (error) {
    console.error('[ERRO DE PARSE MQTT]:', error)
  }
})
