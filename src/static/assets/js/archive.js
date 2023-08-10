window.addEventListener('DOMContentLoaded', (event) => {

    function fetchClickDataAndUpdateChart(chart) {
        $.ajax({
            url: '/analytics/click_data/',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var chartData = data.map(function (entry) {
                    return {
                        x: moment.utc(entry.timestamp).local(), // Zeit in die lokale Zeitzone konvertieren
                        y: entry.count,
                        short_url: entry.short_url
                    };
                });
    
                chart.data.datasets[0].data = chartData;
                chart.update();
                console.log(chartData);
            }
        });
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Clicks over Time',
                data: [],
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
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            if (context.parsed.short_url) {
                                label += ' (' + context.parsed.short_url + ')';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    fetchClickDataAndUpdateChart(myChart); 

});
