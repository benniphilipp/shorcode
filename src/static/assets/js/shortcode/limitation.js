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

    //Alert
    function clearContent() {
        setTimeout(function() {
            $('#toast-alert').html('');
        }, 1000);
    }

    // function ls_toast(parmToast){
    //     $('#toast-alert').html(`
    //         <div class="ls-toast" id="ls-toas">
    //             <div class="ls-toas-header d-flex justify-content-start align-items-center px-2 py-2">
    //                 <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
    //                 <span><b>Meldung</b></span>
    //                 <i class="fa-solid fa-xmark ms-auto"></i>
    //             </div>
    //             <hr>
    //             <div class="ls-toas-body p-2">
    //                 ${parmToast}
    //             </div>
    //         </div>
    //     `);
    //     clearContent();
    // };

    /* Limitation View */ 
    function limitationView(){
        const url_id_count = document.getElementById('id_count');
        const url_id_alternative_url = document.getElementById('id_alternative_url');
        const url_id_start_date = document.getElementById("id_start_date");
        const url_id_end_date = document.getElementById("id_end_date");

        var idShortcode = jQuery('.shortcode-class').attr('data-shortcode');
        const url_view = '/shortcode/update/' + idShortcode + '/view/';

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data

                url_id_start_date.value = data.url_id_start_date
                url_id_end_date.value = data.url_id_end_date
                url_id_count.value = data.url_id_count
                url_id_alternative_url.value = data.url_id_alternative_url

                if(data.status_switches){
                    $('#id_limitation_active').prop('checked', true);
                    $('.disabled-limitation').prop('disabled', false);
                }else{
                    $('#id_limitation_active').prop('checked', false);
                    $('.disabled-limitation').prop('disabled', true);
                }

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });
    }

    $('#shortcode-list').on('click', '.shortcode-class', function() {
        limitationView();
    });
    

    /* Limitation zum speichern Switsch */
    $('#id_limitation_active').on('change', function(event){
        event.preventDefault();

        const url_id_start_date = document.getElementById('id_start_date');
        const url_id_end_date = document.getElementById('id_end_date');
        var currentStatus = $(this).data('status');

        var idShortcode = $('.shortcode-class').attr('data-shortcode');
        const shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;

        var currentStatus = $(this).data('status');

        const fd = new FormData();
        fd.append('pk', idShortcode);
        fd.append('current_status', currentStatus);

        $.ajax({
            url: shortUrl,
            type: 'POST',
            data: fd,
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType: 'json',
            success: function(response) {
                const data = response.status_switches;

                // ls_toast(data.message);

                if(data){
                    $('#id_limitation_active').prop('checked', true);
                    $('.disabled-limitation').prop('disabled', false);
                    $('#id_count').val('0');
                    $('#id_start_date').val('');
                    $('#id_end_date').val('');
                    $('#id_alternative_url').val('');
                    sendLimitationForm();
                }else{
                    $('#id_limitation_active').prop('checked', false);
                    $('.disabled-limitation').prop('disabled', true);
                    $('#id_count').val('0');
                    $('#id_start_date').val('');
                    $('#id_end_date').val('');
                    $('#id_alternative_url').val('');
                    sendLimitationForm();
                }
            },
            error: function(error) {
                console.log("Fehler:", error);
            },
            contentType: false,
            processData: false,
        });
    })


    /* Funktion Update Send limitation */
    function sendLimitationForm() {
        var idShortcode = $('#update-shortcode-url').val();
        var formAction = `/de/shortcode/update_limitation_targeting/${idShortcode}/`;
    
        var id_start_date = $('#id_start_date').val();
        var id_end_date = $('#id_end_date').val();
        var id_count = $('#id_count').val();
        var id_alternative_url = $('#id_alternative_url').val();
        var selectedStatus = $('#id_limitation_active').prop('checked');

        if ($("#id_alternative_url").val() === "") {
            $('#id_alternative_url').css('border-color', '#dc3545');
        } else {
            $('#id_alternative_url').css('border-color', '#198754');
        }

        const fd = new FormData();
        fd.append('id_end_date', id_end_date);
        fd.append('id_start_date', id_start_date);
        fd.append('id_count', id_count);
        fd.append('id_alternative_url', id_alternative_url);
        fd.append('limitation_active', selectedStatus);

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
                    // ls_toast(response.message);
                    // console.log('Formular wurde erfolgreich aktualisiert.');
                } else {
                    // ls_toast(response.message);
                    console.log('Fehler beim Aktualisieren des Formulars:', response);
                }
            },
            error: function(error) {
                console.log('Fehler beim Ajax-Aufruf:', error.response_data);
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    }
    
    /* Update Auslöser Send limitation */
    $('.disabled-limitation').on('change', function(event) {
        event.preventDefault();
        sendLimitationForm();
        console.log('run');
    });



    // Initialisiere den Zustand für jedes Feld
    var fieldStates = {};

    // limitation fileds
    $('.disabled-limitation').on('focusout', function() {
        var fieldValue = $(this).val();
        
        if (fieldValue === '' && fieldStates[$(this).attr('id')] === 'befüllt') {
            $(this).css('border-color', '#dc3545');
        } else {
            $(this).css('border-color', '#198754');
        }
    });

    $('.disabled-limitation').on('focusin', function() {
        fieldStates[$(this).attr('id')] = 'befüllt';
        $(this).css('border-color', '#ced4da');
    });


    // limitation Time field
    $('.time-limitation').on('focusout', function() {
        var fieldValue = $(this).val();
        if (fieldValue === '' && fieldStates[$(this).attr('id')] === 'befüllt') {
            $(this).css('border-color', '#ced4da');
        } else {
            $(this).css('border-color', '#198754');
        }
    });

    $('.time-limitation').on('focusin', function() {
        fieldStates[$(this).attr('id')] = 'befüllt';
        $(this).css('border-color', '#ced4da');
    });


    $("#id_start_date").datepicker({
        dateFormat: "yy-mm-dd", 
        timeFormat: "HH:mm:ss", 
        showSecond: true,       
        timeSuffix: " ",        
        changeMonth: true,     
        changeYear: true        
    });

    
    $("#id_end_date").datepicker({
        dateFormat: "yy-mm-dd", 
        timeFormat: "HH:mm:ss", 
        showSecond: true,       
        timeSuffix: " ",        
        changeMonth: true,     
        changeYear: true        
    });


}); // End document ready function