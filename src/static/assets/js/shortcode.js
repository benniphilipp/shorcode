$(document).ready(function(){


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


    /***************** Limitation limitation *****************/

    // Input Field Date Time
    function limitationDateTime(){
        var startDateInput = document.getElementById("id_start_date");
        if (startDateInput) {
          var currentDate = luxon.DateTime.local();
          startDateInput.value =  currentDate.toFormat('dd.MM.yyyy HH:mm');
        }
    
        // Input Field Date End
        var entDateInput = document.getElementById("id_end_date");
        if (entDateInput) {
            var currentDate = luxon.DateTime.local();
            entDateInput.value =  currentDate.toFormat('dd.MM.yyyy HH:mm');
        }
    }

    /***************** Shortcode *****************/

    //Variabeln     
    const url_destination = document.getElementById('id_url_destination');
    const url_titel = document.getElementById('id_url_titel');
    const url_medium = document.getElementById('id_url_medium');
    const url_source = document.getElementById('id_url_source');
    const url_term = document.getElementById('id_url_term');
    const url_content = document.getElementById('id_url_content');
    const url_campaign = document.getElementById('id_url_campaign');
    const csrf = document.getElementsByName('csrfmiddlewaretoken');
    const url_creator = document.getElementById('url_creator');
    const idShort = document.getElementById('id_shortcode');
    // limitation
    // const startDateInputField = document.getElementById('id_start_date');
    // const endDateInputField = document.getElementById('id_end_date');
    // const countDatafield = document.getElementById('id_count');
    // const alternativeDataField = document.getElementById('id_alternative_url');


    /* Crate functions Shortcode */
    $("#crate-form-shortcode").on("click", function(event) {
        event.preventDefault();

        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append('url_destination', url_destination.value);
        fd.append('url_titel', url_titel.value);
        fd.append('url_source', url_source.value);
        fd.append('url_medium', url_medium.value);
        fd.append('url_term', url_term.value);
        fd.append('url_campaign', url_campaign.value);
        fd.append('url_creator', url_creator.value);
        fd.append('url_content', url_content.value);

        $.ajax({
            type: 'POST',
            url: $("input[name=data]").val(),
            data: fd,
            enctype: 'multipart/form-data',
            success: function(response){

                //Alert
                if(response.success == 'Dein link wurde erfolgreich erstellt'){

                    // Inputfilelds UTM Parameter
                    $('.disabled-func').each(function() {
                        $(this).find('input[type=text]').attr('disabled', 'disabled');
                    });

                    // //Overlay
                    $('#overlay').addClass('overlay-active');
                    var dataImage = jQuery('#overlay').attr('data-image');
                    $('#overlay').html("<div class=\"overlay-body\"><img src='"+dataImage+"' width=\"60\" height=\"60\"><span>Warten...</span></div>")

                    // Restefields
                    $('#id_url_destination').val('')
                    $('#id_url_titel').val('')
                    $('#id_url_medium').val('')
                    $('#id_url_source').val('')
                    $('#id_url_term').val('')
                    $('#id_url_titel').val('')
                    $('#id_url_campaign').val('')
                    $('#id_url_content').val('')
                    $('#id_shortcode').val('')
            
                    const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
                    tagsCheckboxes.each(function(index, checkbox) {
                        const tagValue = parseInt($(checkbox).val());
            
                        $(checkbox).prop('checked', '');
                    });
                    
                    // ALert Box
                    ls_toast(response.success);

                    //Close Sidebar
                    setTimeout(()=>{
                        location.reload();
                        $('#overlay').removeClass('overlay-active');
                    }, 2000);

                }else{

                    // Error PopUp
                    if(response.errors.url_destination){
                        $('#id_url_destination').addClass('is-invalid');
                        ls_toast(response.errors.url_destination);
                    }

                    if(response.errors.url_titel){
                        $('#id_url_titel').addClass('is-invalid');
                        ls_toast(response.errors.url_titel);
                    }              

                }
            
                setTimeout(function(){$('.alert').alert('close')}, 3000);

            },
            error: function(error){
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
        })

    });


    /** Update Shorcode View **/
    $('#update-form-shortcode').on('click', function(event){
        event.preventDefault();

        var idShortcode = $('#update-shortcode-url').val();
        const url_update = url_view_update + '/shortcode/update/' + idShortcode + '/';
        $('#archive-btn').attr('data-archive', idShortcode);

        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append('url_destination', url_destination.value);
        fd.append('url_titel', url_titel.value);
        fd.append('url_source', url_source.value);
        fd.append('url_medium', url_medium.value);
        fd.append('url_term', url_term.value);
        fd.append('url_campaign', url_campaign.value);
        fd.append('url_creator', url_creator.value);
        fd.append('url_content', url_content.value);
        fd.append('shortcode_id', idShort.value);

        const selectedTags = [];
        $('input[name="tags"]input[type="checkbox"]:checked').each(function() {
            selectedTags.push($(this).val());

        });

        fd.append('tags', selectedTags.join(','));

        $.ajax({
            type: 'POST',
            url: url_update,
            data: fd,
            enctype: 'multipart/form-data',
            success: function(response){

                //form fuc disabled
                $('.disabled-func').each(function() {
                    $(this).find('input[type=text]').attr('disabled', 'disabled');
                });

                //Overlay
                $('#overlay').addClass('overlay-active');
                var dataImage = jQuery('#overlay').attr('data-image');
                $('#overlay').html("<div class=\"overlay-body\"><img src='"+dataImage+"' width=\"60\" height=\"60\"><span>Warten...</span></div>")

                //Reset fields
                $('#id_url_destination').val('')
                $('#id_url_titel').val('')
                $('#id_url_medium').val('')
                $('#id_url_source').val('')
                $('#id_url_term').val('')
                $('#id_url_titel').val('')
                $('#id_url_campaign').val('')
                $('#id_url_content').val('')
                $('#id_shortcode').val('')

                const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
                tagsCheckboxes.each(function(index, checkbox) {
                    const tagValue = parseInt($(checkbox).val());

                    $(checkbox).prop('checked', '');
                });

                // //Alert
                ls_toast(response.success);

                setTimeout(()=>{
                    window.location.reload();
                    $('#overlay').removeClass('overlay-active');
                }, 2000);

            },
            error: function(error){
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
        })
    })



}); // End document ready function