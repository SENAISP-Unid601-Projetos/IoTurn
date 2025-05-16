function createRealtimeChart(containerId) {
    let seriesData = [{ data: [] }];
    let intervalId;

    let options = {
        series: seriesData,
        chart: {
            id: 'realtime-' + containerId,
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        title: {
            text: 'Test UpdateChart - ' + containerId,
            align: 'left'
        },
        markers: { size: 0 },
        xaxis: {
            type: 'datetime',
            range: 60000,
        },
        yaxis: { max: 100 },
        legend: { show: false },
    };

    let chart = new ApexCharts(document.getElementById(containerId), options);
    chart.render();

    function startInterval() {
        if (!intervalId) {
            intervalId = setInterval(() => {
                let time = new Date().getTime();
                let value = Math.floor(Math.random() * 100);

                seriesData[0].data.push([time, value]);

                if (seriesData[0].data.length > 60) {
                    seriesData[0].data.shift();
                }

                chart.updateSeries(seriesData);
            }, 5000);
        }
    }

    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    //Page Visibility API
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startInterval();
        } else {
            stopInterval();
        }
    });

    startInterval();

    return chart;
}

const line1 = createRealtimeChart('graph-oleo');
const line2 = createRealtimeChart('graph-temp');

//line$.updateChart(number)