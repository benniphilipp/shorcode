// $(document).ready(function(){


//     const getCookie =(name) => {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 // Does this cookie string begin with the name we want?
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
//     const csrftoken = getCookie('csrftoken');


//     /* Alert Box Close */
//     function clearContent() {
//         setTimeout(function() {
//             $('#toast-alert').html('');
//         }, 4000);
//     }

//     /* Alert Box */
//     function ls_toast(parmToast){
//         $('#toast-alert').html(`
//             <div class="ls-toast" id="ls-toas">
//                 <div class="ls-toas-header d-flex justify-content-start align-items-center px-2 py-2">
//                     <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
//                     <span><b>Meldung</b></span>
//                     <i class="fa-solid fa-xmark ms-auto"></i>
//                 </div>
//                 <hr>
//                 <div class="ls-toas-body p-2">
//                     ${parmToast}
//                 </div>
//             </div>
//         `);
//         clearContent();
//     };

        /** Update Shorcode View **/
        // $('#update-form-shortcode').on('click', function(event){
        //     event.preventDefault();
    
        //     var idShortcode = $('#update-shortcode-url').val();
        //     const url_update = url_view_update + '/shortcode/update/' + idShortcode + '/';
        //     $('#archive-btn').attr('data-archive', idShortcode);
    
        //     const fd = new FormData();
        //     fd.append('csrfmiddlewaretoken', csrf[0].value)
        //     fd.append('url_destination', url_destination.value);
        //     fd.append('url_titel', url_titel.value);
        //     fd.append('url_source', url_source.value);
        //     fd.append('url_medium', url_medium.value);
        //     fd.append('url_term', url_term.value);
        //     fd.append('url_campaign', url_campaign.value);
        //     fd.append('url_creator', url_creator.value);
        //     fd.append('url_content', url_content.value);
        //     fd.append('shortcode_id', idShort.value);
    
        //     const selectedTags = [];
        //     $('input[name="tags"]input[type="checkbox"]:checked').each(function() {
        //         selectedTags.push($(this).val());
    
        //     });
    
        //     fd.append('tags', selectedTags.join(','));
    
        //     $.ajax({
        //         type: 'POST',
        //         url: url_update,
        //         data: fd,
        //         enctype: 'multipart/form-data',
        //         success: function(response){
    
        //             //form fuc disabled
        //             $('.disabled-func').each(function() {
        //                 $(this).find('input[type=text]').attr('disabled', 'disabled');
        //             });
    
        //             //Overlay
        //             $('#overlay').addClass('overlay-active');
        //             var dataImage = jQuery('#overlay').attr('data-image');
        //             $('#overlay').html("<div class=\"overlay-body\"><img src='"+dataImage+"' width=\"60\" height=\"60\"><span>Warten...</span></div>")
    
        //             //Reset fields
        //             $('#id_url_destination').val('')
        //             $('#id_url_titel').val('')
        //             $('#id_url_medium').val('')
        //             $('#id_url_source').val('')
        //             $('#id_url_term').val('')
        //             $('#id_url_titel').val('')
        //             $('#id_url_campaign').val('')
        //             $('#id_url_content').val('')
        //             $('#id_shortcode').val('')
    
        //             const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
        //             tagsCheckboxes.each(function(index, checkbox) {
        //                 const tagValue = parseInt($(checkbox).val());
    
        //                 $(checkbox).prop('checked', '');
        //             });
    
        //             // //Alert
        //             ls_toast(response.success);
    
        //             setTimeout(()=>{
        //                 window.location.reload();
        //                 $('#overlay').removeClass('overlay-active');
        //             }, 2000);
    
        //         },
        //         error: function(error){
        //             console.log(error);
        //         },
        //         cache: false,
        //         contentType: false,
        //         processData: false,
        //     })
        // });



//     // Input Field Date Time
//     // function limitationDateTime(){
//     //     var startDateInput = document.getElementById("id_start_date");
//     //     if (startDateInput) {
//     //         var currentDate = luxon.DateTime.local();
//     //         var formattedStartDate = currentDate.toFormat('yyyy-LL-dd HH:mm:ss.SSSZZ');
//     //         startDateInput.value = formattedStartDate || "0001-01-01 00:00:00";
//     //     }
    
//     //     // Input Field Date End
//     //     var entDateInput = document.getElementById("id_end_date");
//     //     if (entDateInput) {
//     //         var currentDate = luxon.DateTime.local();
//     //         var formattedEndDate = currentDate.toFormat('yyyy-LL-dd HH:mm:ss.SSSZZ');
//     //         entDateInput.value = formattedEndDate || "0001-01-01 00:00:00";   
//     //     }
//     // }



//     //Variabeln     
//     const url_destination = document.getElementById('id_url_destination');
//     const url_titel = document.getElementById('id_url_titel');
//     const url_medium = document.getElementById('id_url_medium');
//     const url_source = document.getElementById('id_url_source');
//     const url_term = document.getElementById('id_url_term');
//     const url_content = document.getElementById('id_url_content');
//     const url_campaign = document.getElementById('id_url_campaign');
//     const csrf = document.getElementsByName('csrfmiddlewaretoken');
//     const url_creator = document.getElementById('url_creator');
//     const idShort = document.getElementById('id_shortcode');

//     const url_view_update = window.location.origin;
//     const updateShortcodeUrl = document.getElementById('update-shortcode-url');
//     const shortcode_id = document.getElementById('shortcode_id');


//     /* Einzelansicht felder Befühlung */
    $('#shortcode-list').on('click', '.shortcode-class', function() {

        // Shorcode Single Ansicht
        var idShortcode = jQuery(this).attr('data-shortcode');
        const url_view = url_view_update + '/shortcode/update/' + idShortcode + '/view/';
        $('#archive-btn').attr('data-archive', idShortcode);
        $('#overlay-open').addClass("overlay-open"); 

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data

                $('#aside-form').addClass('toggle');
                $('#crate-form-shortcode').addClass('d-none');
                $('#openForm').addClass("disabled"); 
                updateShortcodeUrl.value = data.id;
                url_destination.value = data.url_destination;
                url_titel.value = data.url_titel;
                url_medium.value = data.url_medium;
                url_source.value = data.url_source;
                url_term.value = data.url_term;
                url_content.value = data.url_content;
                url_campaign.value = data.url_campaign;
                idShort.value = data.shortcode;

                $(shortcode_id).html(`<button data-button="short${data.id}" type="button" class="btn btn-secondary btn-copy colorshort${data.id} btn-sm"><i class="fa-solid fa-link"></i> Kopieren</button>`)///data.get_short_url);  

                // Tags-Felder auswählen
                const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');

                tagsCheckboxes.each(function(index, checkbox) {
                    const tagValue = parseInt($(checkbox).val());
                    const tagIsSelected = data.tags.includes(tagValue);
                    $(checkbox).prop('checked', tagIsSelected);
                });

                tagsCheckboxes.trigger('change');

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });


        /* Funktion zum abrufen des Status der Swiches */
        function shorcodeSwitchesStatus(elementsID, url, disabledClass){
            $.ajax({
                url: url,
                type: 'GET',
                success: function(response) {

                    const data = response.status_switches;

                    if(data){
                        $(elementsID).prop('checked', true);
                        $(disabledClass).prop('disabled', false);
                    }else{
                        $(elementsID).prop('checked', false);
                        $(disabledClass).prop('disabled', true);
                    }
                    
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        /* limitation */
        var disabledClass = '.disabled-limitation';
        var url = `/shortcode/get_limitation_active_status/${idShortcode}/`;
        var elementsID = '#id_limitation_active';
        shorcodeSwitchesStatus(elementsID, url, disabledClass);

        /* Geo-Targeting */
        var disabledClass = '.disabled-geo';
        var url = `/shortcode/get_detaile_geo_targeting/${idShortcode}/`;
        var elementsID = '#id_geo_targeting_on_off';
        shorcodeSwitchesStatus(elementsID, url, disabledClass);

        /* iOS-Targeting */
        var disabledClass = '.disabled-ios'
        var url = `/shortcode/get_detaile_ios_targeting/${idShortcode}/`;
        var elementsID = '#id_ios_on_off';
        shorcodeSwitchesStatus(elementsID, url, disabledClass);

        /* Android-Targeting */
        var disabledClass = '.disabled-android';
        var url = `/shortcode/get_deatile_android_targeting/${idShortcode}/`;
        var elementsID = '#id_android_on_off';
        shorcodeSwitchesStatus(elementsID, url, disabledClass);


        /***************** Start Swiches Update View *****************/

        /* Funktion Edite Swiches */
        $('.checkboxinput').on('change', function() {
            var currentStatus = $(this).data('status');
            var isChecked = $(this).prop('checked');

            // function shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit){
            //     $.ajax({
            //         url: shortUrl,
            //         type: 'POST',
            //         data: {
            //             'csrfmiddlewaretoken': csrftoken,
            //             'pk': idShortcode,
            //             'current_status': currentStatus
            //         },
            //         success: function(response) {
            //             const data = response.status_switches;

            //             if(data){
            //                 $(elementsShortID).prop('checked', true);
            //                 $(disabledClassEdit).prop('disabled', false);
            //             }else{
            //                 $(elementsShortID).prop('checked', false);
            //                 $(disabledClassEdit).prop('disabled', true);

            //                 var elementsWithClass = $(disabledClassEdit);
            //                 elementsWithClass.each(function(index, element) {
            //                     var fieldValue = $(element).val();
            //                     if (fieldValue) {
            //                         $(element).val('');
            //                     }
            //                 });
            //             }
            //         },
            //         error: function(error) {
            //             console.log("Fehler:", error);
            //         }
            //     });
            // }


            if (isChecked) {
                if('id_limitation_active' == this.id){
                    /* limitation */
                    // var disabledClassEdit = '.disabled-limitation';
                    // elementsShortID = '#id_limitation_active';
                    // shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                    //sendLimitationForm();
                }else if('id_geo_targeting_on_off' == this.id){
                    /* Geo-Targeting */
                    // var disabledClassEdit = '.disabled-geo';
                    // var elementsShortID = '#id_geo_targeting_on_off';
                    // var shortUrl = `/shortcode/toggle_geo_targeting_active_satus/${idShortcode}/`;
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }else if('id_android_on_off' == this.id){
                    /* Android-Targeting */
                    // var disabledClassEdit = '.disabled-android';
                    // var shortUrl = `/shortcode/toggle_android_targeting_active_status/${idShortcode}/`;
                    // var elementsShortID = '#id_android_on_off';
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }else{
                    /* iOS-Targeting */
                    // var disabledClassEdit = '.disabled-ios'
                    // var shortUrl = `/shortcode/toggle_ios_targeting_active_status/${idShortcode}/`;
                    // var elementsShortID = '#id_ios_on_off';
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }
            }else{
                if('id_limitation_active' == this.id){
                    // /* limitation */
                    // var disabledClassEdit = '.disabled-limitation';
                    // elementsShortID = '#id_limitation_active';
                    // shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }else if('id_geo_targeting_on_off' == this.id){
                    /* Geo-Targeting */
                    // var disabledClassEdit = '.disabled-geo';
                    // var shortUrl = `/shortcode/toggle_geo_targeting_active_satus/${idShortcode}/`;
                    // var elementsShortID = '#id_geo_targeting_on_off';
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }else if('id_android_on_off' == this.id){
                    /* Android-Targeting */
                    // var disabledClassEdit = '.disabled-android';
                    // var shortUrl = `/shortcode/toggle_android_targeting_active_status/${idShortcode}/`;
                    // var elementsShortID = '#id_android_on_off';
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }else{
                    /* iOS-Targeting */
                    // var disabledClassEdit = '.disabled-ios'
                    // var shortUrl = `/shortcode/toggle_ios_targeting_active_status/${idShortcode}/`;
                    // var elementsShortID = '#id_ios_on_off';
                    // shorcodeSwitchesEdit(shortUrl, idShortcode, currentStatus, elementsShortID, disabledClassEdit);
                }
            }
        });
    });

//     // /* Limitation zum speichern Switsch */
//     // $('#id_limitation_active').on('change', function(event){
//     //     event.preventDefault();

//     //     const url_id_start_date = document.getElementById('id_start_date');
//     //     const url_id_end_date = document.getElementById('id_end_date');
//     //     var currentStatus = $(this).data('status');

//     //     var idShortcode = jQuery('.shortcode-class').attr('data-shortcode');
//     //     const disabledClassEdit = '.disabled-limitation';
//     //     const elementsShortID = '#id_limitation_active';
//     //     const shortUrl = `/shortcode/toggle_limitation_active_status/${idShortcode}/`;

//     //     console.log('id_limitation_active ID');

//     //     $.ajax({
//     //         url: shortUrl,
//     //         type: 'POST',
//     //         data: {
//     //             'csrfmiddlewaretoken': csrftoken,
//     //             'pk': idShortcode,
//     //             'current_status': currentStatus
//     //         },
//     //         success: function(response) {
//     //             const data = response.status_switches;

//     //             if(data){
//     //                 $(elementsShortID).prop('checked', true);
//     //                 $(disabledClassEdit).prop('disabled', false);
//     //             }else{
//     //                 $(elementsShortID).prop('checked', false);
//     //                 $(disabledClassEdit).prop('disabled', true);

//     //                 var elementsWithClass = $(disabledClassEdit);
//     //                 elementsWithClass.each(function(index, element) {
//     //                     var fieldValue = $(element).val();
//     //                     if (fieldValue) {
//     //                         $(element).val('');
//     //                     }
//     //                 });


//     //             }

//     //             if(elementsShortID == '#id_limitation_active' && data == true){
//     //                 // Datum Anzeige
//     //                 //limitationDateTime();
//     //             }else{
//     //                 $(url_id_start_date).val('')
//     //                 $(url_id_end_date).val('')
//     //             }

//     //         },
//     //         error: function(error) {
//     //             console.log("Fehler:", error);
//     //         }
//     //     });
//     // })

//     // /* Funktion Update Send limitation */
//     // function sendLimitationForm() {
//     //     var idShortcode = $('#update-shortcode-url').val();
//     //     var formAction = `/shortcode/update_limitation_targeting/${idShortcode}/`;
    
//     //     var id_start_date = $('#id_start_date').val();
//     //     var id_end_date = $('#id_end_date').val();
//     //     var id_count = $('#id_count').val();
//     //     var id_alternative_url = $('#id_alternative_url').val();
    
//     //     console.log(id_count);
    
//     //     const fd = new FormData();
//     //     fd.append('id_end_date', id_end_date);
//     //     fd.append('id_start_date', id_start_date);
//     //     fd.append('id_count', id_count);
//     //     fd.append('id_alternative_url', id_alternative_url);
    
//     //     $.ajax({
//     //         url: formAction,
//     //         type: 'POST',
//     //         data: fd,
//     //         headers: {
//     //             'X-CSRFToken': csrftoken
//     //         },
//     //         dataType: 'json',
//     //         success: function(response) {
//     //             if (response.success) {
//     //                 console.log('Formular wurde erfolgreich aktualisiert.');
//     //             } else {
//     //                 console.log('Fehler beim Aktualisieren des Formulars:', response);
//     //             }
//     //         },
//     //         error: function(error) {
//     //             console.log('Fehler beim Ajax-Aufruf:', error.response_data);
//     //         },
//     //         cache: false,
//     //         contentType: false,
//     //         processData: false,
//     //     });
//     // }
    
//     // /* Update Auslöser Send limitation */
//     // $('.send-limitation-form').click(function(event) {
//     //     event.preventDefault();
//     //     sendLimitationForm();
//     // });
    

//     /* Update Send Geo-Targeting */
//     $('.send-update-form').click(function(event){
//         event.preventDefault();

//         var idShortcode = $('#update-shortcode-url').val();
//         var formAction = `/shortcode/update_geo_targeting/${idShortcode}/`;

//         var id_template_geo = $('#id_template_geo').val();
//         var id_link_geo = $('#id_link_geo').val();

//         const fd = new FormData();
//         fd.append('id_template_geo', id_template_geo);
//         fd.append('id_link_geo', id_link_geo);

//         $.ajax({
//             url: formAction,
//             type: 'POST',
//             data: fd,
//             headers: {
//                 'X-CSRFToken': csrftoken
//             },
//             dataType: 'json',
//             success: function(response) {
//                 if (response.success) {
//                     console.log('Formular wurde erfolgreich aktualisiert.');
//                 } else {
//                     console.log('Fehler beim Aktualisieren des Formulars:', response);
//                 }
//             },
//             error: function(error) {
//                 console.log('Fehler beim Ajax-Aufruf:', error);
//             },
//             cache: false,
//             contentType: false,
//             processData: false,
//         });

//     });

//     // /* Android-Targeting */
//     // $('.send-android-form').click(function(event){        
//     //     event.preventDefault();
 
//     //     var idShortcode = $('#update-shortcode-url').val();
//     //     var formAction = `/shortcode/update_android_targeting/${idShortcode}/`;

//     //     var id_android = $('#id_android').val();

//     //     const fd = new FormData();
//     //     fd.append('android', id_android);

//     //     $.ajax({
//     //         url: formAction,
//     //         type: 'POST',
//     //         data: fd,
//     //         headers: {
//     //             'X-CSRFToken': csrftoken
//     //         },
//     //         dataType: 'json',
//     //         success: function(response) {
//     //             if (response.success) {
//     //                 console.log('Formular wurde erfolgreich aktualisiert.');
//     //             } else {
//     //                 console.log('Fehler beim Aktualisieren des Formulars:', response);
//     //             }
//     //         },
//     //         error: function(error) {
//     //             console.log('Fehler beim Ajax-Aufruf:', error);
//     //         },
//     //         cache: false,
//     //         contentType: false,
//     //         processData: false, 
//     //     });

//     // });

//     /* Update Send iOS-Targeting */
//     // $('.send-ios-form').click(function(event){
//     //     event.preventDefault();

//     //     var idShortcode = $('#update-shortcode-url').val();
//     //     var formAction = `/shortcode/update_ios_targeting/${idShortcode}/`;
//     //     var ios = $('#id_ios').val();

//     //     const fd = new FormData();
//     //     fd.append('ios', ios);

//     //     $.ajax({
//     //         url: formAction,
//     //         type: 'POST',
//     //         data: fd,
//     //         headers: {
//     //             'X-CSRFToken': csrftoken
//     //         },
//     //         dataType: 'json',
//     //         success: function(response) {
//     //             if (response.success) {
//     //                 console.log('Formular wurde erfolgreich aktualisiert.');
//     //             } else {
//     //                 console.log('Fehler beim Aktualisieren des Formulars:', response);
//     //             }
//     //         },
//     //         error: function(error) {
//     //             console.log('Fehler beim Ajax-Aufruf:', error);
//     //         },
//     //         cache: false,
//     //         contentType: false,
//     //         processData: false, 
//     //     });

//     // });

    

//     /* Crate functions Shortcode */
//     $("#crate-form-shortcode").on("click", function(event) {
//         event.preventDefault();

//         const fd = new FormData();
//         fd.append('csrfmiddlewaretoken', csrf[0].value)
//         fd.append('url_destination', url_destination.value);
//         fd.append('url_titel', url_titel.value);
//         fd.append('url_source', url_source.value);
//         fd.append('url_medium', url_medium.value);
//         fd.append('url_term', url_term.value);
//         fd.append('url_campaign', url_campaign.value);
//         fd.append('url_creator', url_creator.value);
//         fd.append('url_content', url_content.value);

//         $.ajax({
//             type: 'POST',
//             url: $("input[name=data]").val(),
//             data: fd,
//             enctype: 'multipart/form-data',
//             success: function(response){

//                 //Alert
//                 if(response.success == 'Dein link wurde erfolgreich erstellt'){

//                     // Inputfilelds UTM Parameter
//                     $('.disabled-func').each(function() {
//                         $(this).find('input[type=text]').attr('disabled', 'disabled');
//                     });

//                     // //Overlay
//                     $('#overlay').addClass('overlay-active');
//                     var dataImage = jQuery('#overlay').attr('data-image');
//                     $('#overlay').html("<div class=\"overlay-body\"><img src='"+dataImage+"' width=\"60\" height=\"60\"><span>Warten...</span></div>")

//                     // Restefields
//                     $('#id_url_destination').val('')
//                     $('#id_url_titel').val('')
//                     $('#id_url_medium').val('')
//                     $('#id_url_source').val('')
//                     $('#id_url_term').val('')
//                     $('#id_url_titel').val('')
//                     $('#id_url_campaign').val('')
//                     $('#id_url_content').val('')
//                     $('#id_shortcode').val('')
            
//                     const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
//                     tagsCheckboxes.each(function(index, checkbox) {
//                         const tagValue = parseInt($(checkbox).val());
            
//                         $(checkbox).prop('checked', '');
//                     });
                    
//                     // ALert Box
//                     ls_toast(response.success);

//                     //Close Sidebar
//                     setTimeout(()=>{
//                         location.reload();
//                         $('#overlay').removeClass('overlay-active');
//                     }, 2000);

//                 }else{

//                     // Error PopUp
//                     if(response.errors.url_destination){
//                         $('#id_url_destination').addClass('is-invalid');
//                         ls_toast(response.errors.url_destination);
//                     }

//                     if(response.errors.url_titel){
//                         $('#id_url_titel').addClass('is-invalid');
//                         ls_toast(response.errors.url_titel);
//                     }              

//                 }
            
//                 setTimeout(function(){$('.alert').alert('close')}, 3000);

//             },
//             error: function(error){
//                 console.log(error);
//             },
//             cache: false,
//             contentType: false,
//             processData: false,
//         })

//     });








// }); // End document ready function
