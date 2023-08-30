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

    /* Send iOS-Targeting Switche */
    $('#id_ios_on_off').on('change', function(event){
        event.preventDefault();
        console.log('run');

        var currentStatus = $(this).data('status');
        var idShortcode = $('#update-shortcode-url').val();
        var formAction = `/shortcode/toggle_ios_targeting_active_status/${idShortcode}/`;

        const fd = new FormData();
        fd.append('pk', idShortcode);
        fd.append('current_status', currentStatus);

        $.ajax({
            url: formAction,
            type: 'POST',
            data: fd,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(response) {
                const data = response.status_switches;

                if(data){
                    $('id_ios_on_off').prop('checked', true);
                    $('.disabled-ios').prop('disabled', false);
                }else{
                    $('id_ios_on_off').prop('checked', false);
                    $('.disabled-ios').prop('disabled', true);

                    var elementsWithClass = $('.disabled-ios');
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
            },
            cache: false,
            contentType: false,
            processData: false, 
        });
    });


    /* Update Send iOS-Targeting */
    $('#ios-targeting-from').on('change', function(event){
        event.preventDefault();

        const idShortcode = $('#update-shortcode-url').val();
        const formAction = `/shortcode/update_ios_targeting/${idShortcode}/`;
        const selectedStatus = $('#id_android_on_off').prop('checked');
        const ios = $('#id_ios').val();

        const fd = new FormData();
        fd.append('ios', ios);
        fd.append('ios_on_off', selectedStatus);

        $.ajax({
            url: formAction,
            type: 'POST',
            data: fd,
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    //console.log('Formular wurde erfolgreich aktualisiert.');
                    ls_toast(data.message);
                } else {
                    console.log('Fehler beim Aktualisieren des Formulars:', response);
                }
            },
            error: function(error) {
                console.log('Fehler beim Ajax-Aufruf:', error);
            },
            cache: false,
            contentType: false,
            processData: false, 
        });
    });

    /* IOS-Targeting View */
    $('#shortcode-list').on('click', '.shortcode-class', function() {

        var idShortcode = $('.shortcode-class').attr('data-shortcode');
        const shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;
        const url_id_ios = document.getElementById('id_ios');
        const url_view = '/shortcode/update/' + idShortcode + '/view/';

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data;

                url_id_ios.value = data.url_id_ios;

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });
    });

}); // End document ready function