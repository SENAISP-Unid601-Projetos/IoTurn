function createRealtimeEchart(containerId) {
    const chartDom = document.getElementById(containerId);
    const myChart = echarts.init(chartDom);

    let data = [];
    let timeLabels = [];

    const option = {
        title: {
            text: 'Realtime Chart - ' + containerId
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeLabels
        },
        yAxis: {
            type: 'value',
            max: 100
        },
        series: [{
            name: 'Valor',
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: data
        }],
        animation: true
    };

    myChart.setOption(option);

    setInterval(() => {
        const now = new Date();
        const label = now.toLocaleTimeString();
        const value = Math.floor(Math.random() * 100);

        if (data.length >= 60) {
            data.shift();
            timeLabels.shift();
        }

        data.push(value);
        timeLabels.push(label);

        myChart.setOption({
            xAxis: { data: timeLabels },
            series: [{ data: data }]
        });
    }, 5000);

    return myChart;
}

createRealtimeEchart('graph-oleo');
createRealtimeEchart('graph-temp');