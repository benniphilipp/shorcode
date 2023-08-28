window.addEventListener('DOMContentLoaded', (event) => {


    // Count links
        // Führe Ajax-Request aus, um die Gesamtanzahl der Links abzurufen
        $.ajax({
            url: '/analytics/analytics/total-links/',  // Passe die URL an
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data.click_data)
                // Füge die Gesamtanzahl der Links in das HTML-Element ein
                if(data.click_data > 0){
                    value_click = data.click_data
                }else{
                    value_click = '0'
                }

                $('#total-links-container').html(`
                    <p><i class="fa-solid fa-link"></i>
                    <small>${data.total_links} von 10000 verwendet</small></p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-label="Example with label" style="width: ${data.total_links}%;" aria-valuenow="${data.total_links}" aria-valuemin="0" aria-valuemax="10000">${data.total_links}%</div>
                    </div>
                `);

                $('#archiv-links-container').html(`
                <p><i class="fa-solid fa-link"></i>
                <small>${data.total_archiv} von 10000 archiviert</small></p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-label="Example with label" style="width: ${data.total_archiv}%;" aria-valuenow="${data.total_archiv}" aria-valuemin="0" aria-valuemax="10000">${data.total_archiv}%</div>
                    </div>
                `);

                $('#count-links-container').html(`<p><i class="fa-solid fa-earth-americas"></i> <small> Link Klicks ${data.total_clicks} </small></p>`);


            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });

});
