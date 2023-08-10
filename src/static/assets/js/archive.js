window.addEventListener('DOMContentLoaded', (event) => {

    function fetchClickDataAndUpdateChart(chart) {
        $.ajax({
            url: '/analytics/click_data/',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Verarbeite die empfangenen Click-Daten hier
                var chartData = data.map(entry => {
                    return { x: entry.timestamp, y: entry.count };
                });
            
                chart.data.datasets[0].data = chartData;
                chart.update();
                console.log(data)
  
            }
        });
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Labels werden automatisch aus den Daten generiert
            datasets: [{
                label: 'Clicks over Time',
                data: [], // Daten werden dynamisch geladen
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    adapters: {
                        date: moment,
                    },
                    parser: 'iso',
                    time: {
                        unit: 'day'
                    },
                    ticks: {
                        source: 'auto' // Automatische Anpassung der Tick-Positionen
                    }
                },
                y: {
                    position: 'right', // Y-Achse auf der rechten Seite
                    beginAtZero: true
                }
            }
        }
    });

    fetchClickDataAndUpdateChart(myChart); 

});
