import createGauge from './chartGauge.js'
import createRealtimeEchart from './chartLineECharts.js'

// client.ts
const socket = new WebSocket('ws://10.110.12.14:8080')

socket.onopen = () => {
    console.log('✅ Conectado ao servidor WebSocket')
    socket.send('Olá servidor!')
}

socket.onmessage = (event) => {
    const data = event.data;
    console.log(data);
}

//teste 1
// socket.on('message', (data) => {
//     console.log('teste')
//     console.log('Dados recebidos do servidor:', data);
// });

socket.onerror = (err) => {
    console.error('❌ Erro no WebSocket:', err)
}
createRealtimeEchart('graph-oleo');
createRealtimeEchart('graph-temp');

const gauge1 = createGauge('chartDiv1', 'RPM');
const gauge2 = createGauge('chartDiv2', 'N. Óleo');
const gauge3 = createGauge('chartDiv3');
const gauge4 = createGauge('chartDiv4');