export default function createRealtimeEchart(containerId) {
    const chartDom = document.getElementById(containerId);
    const myChart = echarts.init(chartDom);
  
    let data = [];
    let timeLabels = [];
    
    const option = {
      title: {
        text: 'Realtime Chart - ' + containerId,
        left: 'center',
        top: '10px',
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
        axisLine: { lineStyle: { color: '#1cb5e8' } },
        axisLabel: { color: '#fff' },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#fff' },
        splitLine: { lineStyle: { color: '#123642' } },
      },
      series: [
        {
          name: 'Valor',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: data,
          lineStyle: {
            color: '#1cb5e8',
            width: 3,
          },
        },
      ],
      animation: true,
      // Adicionar suporte a responsividade
      responsive: true,
    };
  
    myChart.setOption(option);
  
    // Atualização dos dados em tempo real
    setInterval(() => {
      const now = new Date();
  
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const label = `${hours}:${minutes}:${seconds}`;
  
      const value = Math.floor(Math.random() * 100);
  
      if (data.length >= 60) {
        data.shift();
        timeLabels.shift();
      }
  
      data.push(value);
      timeLabels.push(label);
  
      myChart.setOption({
        xAxis: { data: timeLabels },
        series: [{ data: data }],
      });
    }, 1000);
  
    // Adicionar suporte a redimensionamento
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  
    return myChart;
  }
  
