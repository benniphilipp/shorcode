window.addEventListener('DOMContentLoaded', (event) => {


    // Close Overlay analytics
    $('#icon-close-trigger').click(function(){
        $('.anayltics-overlay').removeClass('active');
        $('body').removeClass('overlay');
    });

    // Open Overlay analytics
    $('#shortcode-list').on('click', '.short-chart', function(){
        var anaylyse_id = $(this).data('anaylyse');
        
        $('body').addClass('overlay');
        $('.anayltics-overlay').addClass('active');

    });


    options = {
        chart: {
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        series: [{
          data: [{
            x: 'category A',
            y: 10
          }, {
            x: 'category B',
            y: 18
          }, {
            x: 'category C',
            y: 13
          }]
        }]
      }
      
    
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();


    donut = {
        chart: {
          type: 'donut'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        series: [44, 55, 13, 33],
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
        chartOptions: {
            labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
        }
      }
      

    var chart_donut = new ApexCharts(document.querySelector("#chart-donut"), donut);
    chart_donut.render();
});