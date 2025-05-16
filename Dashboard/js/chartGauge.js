function createGauge(containerId) {
  let chart = JSC.chart(containerId, { 
    debug: false, 
    type: 'gauge', 
    chartArea: { 
      background: {
        fill: 'transparent', // ou qualquer cor HEX/RGB
        outline: { width: 0 } // remove borda
      }
    },
    backgroundColor: 'transparent',
    animation_duration: 1000, 
    legend_visible: false, 
    xAxis: { spacingPercentage: 0.25 }, 
    yAxis: { 
      defaultTick: { padding: -5, label_style_fontSize: '14px' }, 
      line: { width: 9, color: 'smartPalette', breaks_gap: 0.06 }, 
      scale_range: [0, 100] 
    }, 
    palette: { 
      pointValue: '{%value/100}', 
      colors: ['green', 'yellow', 'red'] 
    },
    defaultTooltip_enabled: false, 
    defaultSeries: { 
      angle: { sweep: 180 }, 
      shape: { 
        innerSize: '70%', 
        label: { 
          text: '<span color="%color">{%sum:n1}</span><br/><span color="#696969" fontSize="20px">kW</span>', 
          style_fontSize: '46px', 
          verticalAlign: 'middle'
        } 
      } 
    }, 
    series: [ 
      { 
        type: 'column roundcaps', 
        points: [{ id: '1', x: 'speed', y: 0 }],
      } 
    ]
  });

  let intervalId;

  function setGauge(y) {
    chart.series(0).options({
      points: [{ id: '1', x: 'speed', y: y }]
    });
  }

  function playPause(val) {
    if (val) {
      clearInterval(intervalId);
    } else {
      update();
    }
  }

  function update() {
    intervalId = setInterval(() => {
      setGauge(Math.random() * 100);
    }, 5000);
  }

  playPause(false);

  // Retornar métodos para controle externo
  return { chart, playPause, setGauge };
}

// Inicializar gauges
const gauge1 = createGauge('chartDiv1');
const gauge2 = createGauge('chartDiv2');
const gauge3 = createGauge('chartDiv3');
const gauge4 = createGauge('chartDiv4');

// Exemplo de uso externo (opcional)
// gauge1.setGauge(75);