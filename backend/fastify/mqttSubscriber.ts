
import mqttClient from './src/config/mqttClient'
const TOPICS = ['ioturn/gateways/all/commands']; 

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
    
    console.log(`[MQTT RECEBIDO] Tópico: ${topic} | Mensagem: ${payload}`);
        
  } catch (error) {
    console.error('[ERRO DE PARSE MQTT]:', error)
  }
})

export default function refreshMappings(){
  mqttClient.publish('ioturn/gateways/all/commands', JSON.stringify({ command: 'refresh_mappings' }), { qos: 0, retain: false }, (err) => {
    if (err) {
      console.error('[MQTT PUBLISH] Erro ao publicar mensagem:', err)
    } else {
      console.log('[MQTT PUBLISH] Mensagem publicada com sucesso no tópico ioturn/gateways/all/commands')
    }
  })
}  

