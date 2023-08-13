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

    // Count links
        // Führe Ajax-Request aus, um die Gesamtanzahl der Links abzurufen
        $.ajax({
            url: '/analytics/analytics/total-links/',  // Passe die URL an
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                
                // Füge die Gesamtanzahl der Links in das HTML-Element ein
                if(data.click_data > 0){
                    value_click = data.click_data
                }else{
                    value_click = '0'
                }

                $('#total-links-container').html(`
                    <i class="fa-solid fa-link"></i>
                    <small>${data.total_links} von 10000 verwendet</small>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-label="Example with label" style="width: ${data.total_links}%;" aria-valuenow="${data.total_links}" aria-valuemin="0" aria-valuemax="10000">${data.total_links}%</div>
                    </div>
                `);

                $('#archiv-links-container').html(`
                <i class="fa-solid fa-link"></i>
                <small>${data.total_archiv} von 10000 archiviert</small>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-label="Example with label" style="width: ${data.total_archiv}%;" aria-valuenow="${data.total_archiv}" aria-valuemin="0" aria-valuemax="10000">${data.total_archiv}%</div>
                    </div>
                `);

                $('#count-links-container').html(`<i class="fa-solid fa-earth-americas"></i> <small> Link Klicks ${value_click} </small>`);


            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });

});
