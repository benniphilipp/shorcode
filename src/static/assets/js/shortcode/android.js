$(document).ready(function(){

    /* limitation */
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

    /* Send Form Android-Targeting */
    $('#android-targeting-form').on('change', function(event){        
        event.preventDefault();

        var idShortcode = $('#update-shortcode-url').val();
        var formAction = `/shortcode/update_android_targeting/${idShortcode}/`;
        var selectedStatus = $('#id_android_on_off').prop('checked');
        var id_android = $('#id_android').val();

        const fd = new FormData();
        fd.append('android', id_android);
        fd.append('android_on_off', selectedStatus);

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
                    console.log('Formular wurde erfolgreich aktualisiert.');
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

    /* Android-Targeting Update Switch */
    $('#id_android_on_off').on('change', function(event) {
        event.preventDefault();

        var currentStatus = $(this).data('status');
        var idShortcode = $('.shortcode-class').attr('data-shortcode');
        var formAction = `/shortcode/toggle_android_targeting_active_status/${idShortcode}/`;

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
            dataType: 'json',
            success: function(response) {
                const data = response.status_switches;

                if(data){
                    $('#id_android_on_off').prop('checked', true);
                    $('.disabled-android').prop('disabled', false);
                }else{
                    $('#id_android_on_off').prop('checked', false);
                    $('.disabled-android').prop('disabled', true);

                    var elementsWithClass = $('.disabled-android');
                    elementsWithClass.each(function(index, element) {
                        var fieldValue = $(element).val();
                        if (fieldValue) {
                            $(element).val('');
                        }
                    });
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

    /* Android-Targeting View */
    $('#shortcode-list').on('click', '.shortcode-class', function() {

        var idShortcode = $('.shortcode-class').attr('data-shortcode');
        const shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;
        const url_id_android = document.getElementById('id_android');
        const url_view = '/shortcode/update/' + idShortcode + '/view/';

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data;

                url_id_android.value = data.url_id_android;

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });
    });

}); // End document ready function