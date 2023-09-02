$(document).ready(function(){

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
    
    // $('#id_template_geo').addClass('form-select');
    // $('#id_template_geo').addClass('disabled-geo');

    /* Status Swiche Geo Targeting */
    $('#shortcode-list').on('click', '.shortcode-class', function(){
        
        const idShortcode = jQuery(this).attr('data-shortcode');
        const url_view = '/shortcode/update/' + idShortcode + '/view/';
        const id_link_geo = document.getElementById('id_link_geo');

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data;

                // Auswahlt Geo
                const geoThemplateCheckboxes = $('input[name="template_geo"][type="checkbox"]');

                geoThemplateCheckboxes.each(function(index, checkbox) {
                    const tagValue = parseInt($(checkbox).val());
                    const tagIsSelected = data.url_id_template_geo.includes(tagValue);
                    $(checkbox).prop('checked', tagIsSelected);
                });

                geoThemplateCheckboxes.trigger('change');


                id_link_geo.value = data.url_id_link_geo;

                // const formData = `/shortcode/get_limitation_active_status/${idShortcode}/`;
                const disabledClass = '.disabled-geo';
                const elementsID = '#id_geo_targeting_on_off';
        
                if(data.geo_targeting_on_off){
                    $(elementsID).prop('checked', true);
                    $(disabledClass).prop('disabled', false);
                }else{
                    $(elementsID).prop('checked', false);
                    $(disabledClass).prop('disabled', true);
                }


            },
            error: function(error){
                console.log(error + 'erro');
            },
        });

        // $.ajax({
        //     url: formData,
        //     type: 'GET',
        //     success: function(response) {

        //         const data = response.status_switches;
        //         console.log(data);
        //         if(data){
        //             $(elementsID).prop('checked', true);
        //             $(disabledClass).prop('disabled', false);
        //         }else{
        //             $(elementsID).prop('checked', false);
        //             $(disabledClass).prop('disabled', true);
        //         }
                
        //     },
        //     error: function(error) {
        //         console.log(error);
        //     }
        // });

    });


    /* Edit Swich GEO Targeting */
    $('#id_geo_targeting_on_off').on('change', function() {

        const idShortcode = jQuery('.shortcode-class').attr('data-shortcode');
        var currentStatus = $(this).data('status');

        console.log('RUN id_geo_targeting_on_off');
        var disabledClassEdit = '.disabled-geo';
        var elementsShortID = '#id_geo_targeting_on_off';
        var shortUrl = `/shortcode/toggle_geo_targeting_active_satus/${idShortcode}/`;

        $.ajax({
            url: shortUrl,
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': idShortcode,
                'current_status': currentStatus
            },
            success: function(response) {
                const data = response.status_switches;

                if(data){
                    $(elementsShortID).prop('checked', true);
                    $(disabledClassEdit).prop('disabled', false);
                }else{
                    $(elementsShortID).prop('checked', false);
                    $(disabledClassEdit).prop('disabled', true);

                    var elementsWithClass = $(disabledClassEdit);
                    elementsWithClass.each(function(index, element) {
                        var fieldValue = $(element).val();
                        if (fieldValue) {
                            $(element).val('');
                        }
                    });
                }
            },
            error: function(error) {
                console.log("Fehler:", error);
            }
        });

    });


}); // End document ready function