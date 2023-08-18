window.addEventListener('DOMContentLoaded', (event) => {

    const getCookie =(name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // Close Overlay analytics
    $('#icon-close-trigger').click(function(){
        $('.anayltics-overlay').removeClass('active');
        $('body').removeClass('overlay');

        //Clear
        $('#creation_date').html('');
        $('#last_modification_date').html('');
        $('#top-countries-list').html('');
        $('#top-browsers-list').html('');
        $('#top-os-list').html('');
        $('#top-referrers-list').html('');
        $('#shorcode-url').html('');
        $('#id-destination').html('');
        $('#redirections_counter').html('');
    });

    // Open Overlay analytics
    $('#shortcode-list').on('click', '.short-chart', function(){
        var anaylyse_id = $(this).data('anaylyse');
 
        $('body').addClass('overlay');
        $('.anayltics-overlay').addClass('active');

        $.ajax({
          type: 'GET',
          url: `/analytics/analyse/${anaylyse_id}/`,
          data: {
            'shortcode': anaylyse_id
          },
          success: function(response){

            var clicks_365_days = response.clicks_365_days;
            var clicks_30_days = response.clicks_30_days;
            var clicks_90_days = response.clicks_90_days;
            var clicks_120_days = response.clicks_365_days;
            var last_modification_date = response.last_modification_date;
            var creation_date = response.creation_date;

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
                  x: 'Klicklinks 30 Tage',
                  y: clicks_30_days
                }, {
                  x: 'Klicklinks 90 Tage',
                  y: clicks_90_days
                }, {
                  x: 'Klicklinks 120 Tage',
                  y: clicks_120_days
                },
                {
                  x: 'Klicklinks 365 Tage',
                  y: clicks_365_days
                }]
              }]
            }
            
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

            var donut = {
              series: response.country_values,
              labels: response.country_labels,
              chart: {
                type: 'donut',
              },
            };

            var chart = new ApexCharts(document.querySelector('#chart-donut'), donut);
            chart.render();


            $('#creation_date').html(creation_date);
            $('#last_modification_date').html(last_modification_date);

            Object.entries(response.redirections_counter).forEach(function([url, count]) {
                const link = $(`<a href="${url}" target="_blank">Link ${count}</a>`);
                //const paragraph = $(`<p>${count}</p>`);
                const container = $('<div class="redirection-item"></div>');
                container.append(link);
                $('#redirections_counter').append(container);
            });

            // Top-Länder-Daten verarbeiten
            const topCountriesList = $('#top-countries-list');
            const topCountriesData = response.top_countries;
            for (let i = 0; i < topCountriesData.length; i++) {
                const countryData = topCountriesData[i];
                const country = countryData[0];
                const count = countryData[1];
                const listItem = $('<li class="list-group-item border-0"></li>');
                listItem.text(country + ': ' + count + ' Clicks');
                topCountriesList.append(listItem);
            }

            // Top-Browser-Daten verarbeiten
            const topBrowsersList = $('#top-browsers-list');
            const topBrowsersData = response.top_browsers;
            for (let i = 0; i < topBrowsersData.length; i++) {
                const browserData = topBrowsersData[i];
                const browser = browserData[0];
                const count = browserData[1];
                const listItem = $('<li class="list-group-item border-0"></li>');
                listItem.text(browser + ': ' + count + ' Clicks');
                topBrowsersList.append(listItem);
            }

            // Top-Betriebssysteme-Daten verarbeiten
            const topOs = response.top_os;
            const topOsList = $('#top-os-list');
            topOs.forEach(function(osData) {
                const os = osData[0];
                const count = osData[1];
            
                const listItem = $('<li class="list-group-item border-0"></li>');
                listItem.text(`${os}: ${count} Clicks`);
                topOsList.append(listItem);
            });

            // Top-Referrer-Daten verarbeiten
            const topReferrers = response.top_referrers;
            const topReferrersList = $('#top-referrers-list');
            topReferrers.forEach(function(referrerData) {
                const referrer = referrerData[0];
                const count = referrerData[1];

                const listItem = $('<li class="list-group-item border-0"></li>');
                listItem.text(`${referrer}: ${count} Clicks`);
                topReferrersList.append(listItem);
            });

            $('#shorcode-url').html(response.url);
            $('#id-destination').html(`<a href="${response.url_destination}" target="_blank">Link</a>`)

          },
          error: function(error){
              console.log(error)
          },
        })

    });

});