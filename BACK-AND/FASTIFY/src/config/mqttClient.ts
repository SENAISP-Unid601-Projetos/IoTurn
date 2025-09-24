
import mqtt, { MqttClient } from 'mqtt'

const MQTT_BROKER_URL = 'mqtt://localhost:1883' 
const CLIENT_ID = `mqtt_client_${Math.random().toString(16).slice(2, 8)}`

const options = {
  clientId: CLIENT_ID,
  clean: true,             
  connectTimeout: 4000,     
  reconnectPeriod: 1000,    
}


const client: MqttClient = mqtt.connect(MQTT_BROKER_URL, options)

client.on('connect', () => {
  console.log(`[MQTT] Conectado ao broker como "${CLIENT_ID}"`)
})

client.on('error', (error) => {
  console.error('[MQTT] Erro de conexão:', error)
  client.end()
})

export default client
