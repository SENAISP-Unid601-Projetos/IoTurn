import createGauge from './chartGauge.js'
import createRealtimeEchart from './chartLineECharts.js'

const client = mqtt.connect('ws://10.110.12.14:8080');

client.on('connect', () => {
  console.log('Conectado ao broker MQTT via WebSocket!');
  client.subscribe('meu/topico', (err) => {
    if (!err) {
      client.publish('meu/topico', 'Olá via WebSocket!');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Mensagem recebida em ${topic}: ${message.toString()}`);
});

const gauge1 = createGauge('chartDiv1', 'RPM');
const gauge2 = createGauge('chartDiv2', 'N. Óleo');