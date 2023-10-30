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

    /* Alert Box Close */
    function clearContent() {
        setTimeout(function() {
            $('#toast-alert').html('');
        }, 4000);
    }

    /* Alert Box */
    function ls_toast(parmToast){
        $('#toast-alert').html(`
            <div class="ls-toast" id="ls-toas">
                <div class="ls-toas-header d-flex justify-content-start align-items-center px-2 py-2">
                    <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
                    <span><b>Meldung</b></span>
                    <i class="fa-solid fa-xmark ms-auto"></i>
                </div>
                <hr>
                <div class="ls-toas-body p-2">
                    ${parmToast}
                </div>
            </div>
        `);
        clearContent();
    };

    /* Send iOS-Targeting Switche */
    $('#id_ios_on_off').on('change', function(event){
        event.preventDefault();

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
                    $('#id_ios_on_off').prop('checked', true);
                    $('.disabled-ios').prop('disabled', false);
                }else{
                    $('#id_ios_on_off').prop('checked', false);
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


        var currentStatus = $('#id_ios_on_off').prop('checked');
        var idShortcode = $('#update-shortcode-url').val();
        const formAction = `/shortcode/update_ios_targeting/${idShortcode}/`;

        const ios = $('#id_ios').val();
        console.log(currentStatus);
        const fd = new FormData();
        fd.append('ios', ios);
        fd.append('ios_on_off', currentStatus);

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
                    const data = response.status_switches;
                    //console.log('Formular wurde erfolgreich aktualisiert.');
                    ls_toast('Formular wurde erfolgreich aktualisiert.');

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

                var disabledClassEdit = '.disabled-ios';
                var elementsShortID = '#id_ios_on_off';

                if(data.android_on_off){
                    $(elementsShortID).prop('checked', true);
                    $(disabledClassEdit).prop('disabled', false);
                }else{
                    $(elementsShortID).prop('checked', false);
                    $(disabledClassEdit).prop('disabled', true);
                }

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });
    });

}); // End document ready function