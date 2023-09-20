window.addEventListener('DOMContentLoaded', (event) => {
    // Hier finden sie alle functionen LinkInBio **Links** 


    // form anzeigen
    // $('#createOpenCloseForm').on('click', function(){
    //     $('#createlinkinbio').toggleClass('d-none');
    // });



    // Update Form View
    $('#card-container').on('click', '.linkinbio-editcard', function(){
        var linkInBioId = $(this).data('linkinbio-editcard');
        //console.log(linkInBioId);

        $('#linkInBioCardAddForm'+linkInBioId).removeClass('d-none');
        $('#linkInBioCardForm'+linkInBioId).addClass('d-none');

    });

    function insertFormLinkInBio(linkFormId){

        $.ajax({
            url: '/linkinbio/link_detaile/' + linkFormId + '/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrftoken 
            },
            success: function(data) {
                // Hier kannst du die JSON-Daten verwenden und im Modal anzeigen
                var updateUrl = $('#updateUrl').val().replace('0', data.id);


                var htmlForm = `
                <div id="createlinkinbio" class="card shadow-sm border-0 mb-3">
                    <div class="card-body">
        
                    <div class="d-flex flex-row align-items-center mb-3">
                        <input class="form-check-input p-2 m-2" type="checkbox" id="createShorcodeUpdate" value="option1" checked>
                        <label class="form-check-label" for="createShorcodeUpdate">Update Llinkb link</label>
                    
                        <input class="form-check-input p-2 m-2" type="checkbox" id="createSearchUpdate" value="option1">
                        <label class="form-check-label" for="createSearchUpdate">Create new Llinkb link</label>
                    </div>
        
                    <form style="display: block;" action="${updateUrl}" id="form-create-shorcode-update">
                        <div class="mb-3">
                            <label for="labelUpdate" class="form-label">Button Label</label>
                            <input type="text" class="form-control mb-1" id="labelUpdate" value="${data.button_label}">
                            <label for="urlDestinationUpdate" class="form-label">Url</label>
                            <input type="text" class="form-control mb-3" id="urlDestinationUpdate" value="${data.url_destination}">
                            <input type="hidden" id="linkInBioPageId" value="${data.id}">
                            <input type="hidden" id="shortcodeId" value="${data.shortcode_id}">
                            <button type="submit" class="btn btn-primary btn-sm">Create</button>
                        </div>
                    </form>
        
                    <form id="form-create-link-update" style="display: none;" action="" method="POST">
                        <div class="mb-3">
                            <label for="cratedhortcode" class="form-label">Button Label</label>
                            <input type="text" class="form-control mb-1" id="button_label" placeholder="Button label">
                            <label for="cratedhortcode" class="form-label">Url</label>
                            <input type="text" class="form-control mb-3" id="selectShortcode" placeholder="Create new link">
                            <input type="hidden" id="linkinbio_page_id" value="">
                            <input type="hidden" id="shortcode_id" value="">
                            <button type="submit" class="btn btn-primary btn-sm">Create</button>
                        </div>
                    </form>
        
                    </div>
                </div>
                `;
                $('.linkinbio-form-place'+linkFormId).html(htmlForm);
            },
            error: function() {
                console.log('Fehler beim Abrufen der Daten');
            }
        });
    };

    // Auslöser für Update Formular Link
    $('#card-container').on('click', '.form-place', function(){
        var linkFormId = $(this).data('form-place');
        // console.log(linkFormId);
        insertFormLinkInBio(linkFormId);
    });

    
    $('#card-container').on('submit', '#form-create-shorcode-update', function(event){
        event.preventDefault();
    
        var button_label = $('#labelUpdate').val();
        var url_destination = $('#urlDestinationUpdate').val();
        var shortcode_id = $('#shortcodeId').val();
        var urlLinkinBio = $(this).attr('action');
        console.log(urlLinkinBio)

        var newData = {
            'shortcode_id': shortcode_id,
            'url_destination': url_destination,
            'button_label': button_label,
        };
        console.log(newData)
        
        $.ajax({
            url: urlLinkinBio,
            type: 'POST',
            data: JSON.stringify(newData),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrftoken 
            },
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log('Fehler bei der AJAX-Anfrage: ' + error.statusText);
            }
        });
    
    });



    // Sortieren Links in linkinbio
    var urlForm = $('#valueUrlSort').val();

    $("#card-container").sortable({
        axis: 'y',  // Nur vertikales Sortieren erlauben
        update: function(event, ui) {
            // Hier kannst du Code ausführen, um die aktualisierte Reihenfolge zu speichern
            var sortedLinks = $(this).find('.sortable-item').map(function() {
                return $(this).attr('data-id');
            }).get();

            // Führe hier eine Ajax-Anfrage aus, um die Reihenfolge auf dem Server zu speichern
            $.ajax({
                url: urlForm,
                type: 'POST',
                data: { sorted_links: sortedLinks },  // Gebe die sortierte Reihenfolge weiter
                headers: {
                    'X-CSRFToken': csrftoken 
                },
                success: function(data) {
                    console.log('Reihenfolge erfolgreich gespeichert.');
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.error('Fehler beim Speichern der Reihenfolge:', errorThrown);
                }
            });
        }
    });

    // Deaktiviere die Standardtextauswahl für die Cards, um Konflikte mit Sortierungen zu vermeiden
    $("#card-container").disableSelection();


    /* Create Link LinkInBio */
    // $('#form-create-link').on('submit', function(event){
    //     event.preventDefault(); 
        
    //     var button_label = $('#button_label').val();
    //     var linkinbio_page_id = $('#linkinbio_page_id').val();
    //     var shortcode_id = $('#shortcode_id').val();

    //     var formData = {
    //         'shortcode_id': shortcode_id,
    //         'linkinbio_page_id': linkinbio_page_id,
    //         'button_label': button_label,
    //     };

    //     $.ajax({
    //         type: 'POST',
    //         url: $(this).attr('action'), // Aktualisieren Sie dies mit Ihrer tatsächlichen URL
    //         data: JSON.stringify(formData),
    //         contentType: 'application/json',
    //         headers: {
    //             'X-CSRFToken': csrftoken 
    //         },
    //         success: function(data) {
    //             console.log(data);
    //             if (data.success) {
    //                 alert(data.message); // Zeigen Sie eine Erfolgsmeldung an oder führen Sie andere Aktionen aus
    //             } else {
    //                 alert('Fehler: ' + data.message); // Zeigen Sie eine Fehlermeldung an
    //             }
    //         },
    //         error: function(xhr, textStatus, errorThrown) {
    //             console.log('Fehler beim Senden des Formulars: ' + errorThrown)
    //         }
    //     });
    // });

    /* LinkInBio Links */   
    // $('#form-create-shorcode').on('submit', function(event) {
    //     event.preventDefault();
    
    //     // Erfassen Sie die Formulardaten
    //     var buttonLabel = $('#cratedhortcode').val();
    //     var linkUrl = $('#link-url').val();
    //     var linkinbio_page = $('#linkInBioPageID').val();
    
    //     // Erstellen Sie ein JSON-Objekt mit den Formulardaten
    //     var formData = {
    //         'button_label': buttonLabel,
    //         'link_url': linkUrl,
    //         'linkinbio_page': linkinbio_page
    //     };
    
    //     // Senden Sie die Formulardaten an die View
    //     $.ajax({
    //         type: 'POST',
    //         url: $(this).attr('action'),
    //         data: JSON.stringify(formData),
    //         contentType: 'application/json',
    //         headers: {
    //             'X-CSRFToken': csrftoken 
    //         },
    //         success: function(data) {
    //             console.log(data);
    //             if (data.success) {
    //                 alert(data.message);
    //             } else {
    //                 alert('Fehler: ' + data.message);
    //             }
    //         },
    //         error: function(xhr, textStatus, errorThrown) {
    //             // alert('Fehler beim Senden des Formulars: ' + errorThrown);
    //             console.log('Fehler beim Senden des Formulars: ' + errorThrown)
    //         }
    //     });
    // });

    /* Autocomplete Shorcdcode */
    // var shortcodeInput = $('#selectShortcode');
    // var searchResults = $('#search-results');

    // shortcodeInput.on('input', function() {

    //     var enteredText = shortcodeInput.val();

    //     if (enteredText.length > 2) { // Mindestlänge für die Suche
    //         $.ajax({
    //             url: '/linkinbio/shortcode/', // Ersetzen Sie "/path/to/shortcode-list/" durch die richtige URL
    //             type: 'GET',
    //             data: {
    //                 search_term: enteredText
    //             },
    //             headers: {
    //                 'X-CSRFToken': csrftoken 
    //             },
    //             success: function(response) {
    //                 // Löschen Sie vorhandene Suchergebnisse
    //                 searchResults.empty();
    //                 console.log(response);
    //                 // Durchlaufen Sie die Antwort und fügen Sie Suchergebnisse hinzu
    //                 for (var i = 0; i < response.length; i++) {
    //                     var shortcodeItem = $('<li>');
    //                     shortcodeItem.text(response[i].url_titel); // Zeigen Sie den gewünschten Wert an
    //                     // Fügen Sie eine Daten-ID mit der Shortcode-ID hinzu
    //                     shortcodeItem.attr('data-id', response[i].id);
    //                     // Fügen Sie einen Klick-Handler hinzu, um die Shortcode-ID zu setzen
    //                     shortcodeItem.click(function() {
    //                         var shortcodeId = $(this).attr('data-id');
    //                         $('#shortcode_id').val(shortcodeId); // Setzen Sie die Shortcode-ID im versteckten Feld
    //                     });
    //                     searchResults.append(shortcodeItem);
    //                 }
    //             },
    //             error: function(error) {
    //                 console.error('Error:', error);
    //             }
    //         });
    //     } else {
    //         // Leeren Sie das Suchergebnis, wenn der Text zu kurz ist
    //         searchResults.empty();
    //     }
    // });

    // Verarbeiten Sie das Klicken auf ein Suchergebnis
    // searchResults.on('click', 'li', function() {
    //     var selectedText = $(this).text();
    //     var shortcodeId = $(this).attr('data-id'); // Holen Sie die Shortcode-ID aus dem Daten-Attribut
    //     shortcodeInput.val(selectedText);
    //     $('#shortcode_id').val(shortcodeId); // Setzen Sie die Shortcode-ID im versteckten Feld
    //     searchResults.empty();
    // });


    // // Überwachen Sie Änderungen in den Checkboxen
    // $('#createShorcode').on('change', function() {
    //     if ($(this).is(':checked')) {
    //         // Wenn "Create a new Llinkb link" ausgewählt ist, aktivieren Sie das zugehörige Formular
    //         $('#form-create-shorcode').show();
    //         $('#form-create-link').hide();
    //         // Deaktivieren Sie das andere Formular
    //         $('#createSearch').prop('checked', false);
    //     }
    // });

    // $('#createSearch').on('change', function() {
    //     if ($(this).is(':checked')) {
    //         $('#form-create-shorcode').hide();
    //         $('#form-create-link').show();
    //         // Deaktivieren Sie das andere Formular
    //         $('#createShorcode').prop('checked', false);
    //     }
    // });


    /** Update form Prüfen in den Carten Create a new Llinkb link */
    $('#card-container').on('change', '#createShorcodeUpdate', function() {
        if ($(this).is(':checked')) {
            $('#form-create-shorcode-update').show();
            $('#form-create-link-update').hide();
            $('#createSearchUpdate').prop('checked', false);
        }
    });

    $('#card-container').on('change', '#createSearchUpdate', function() {
        if ($(this).is(':checked')) {
            $('#form-create-shorcode-update').hide();
            $('#form-create-link-update').show();
            $('#createShorcodeUpdate').prop('checked', false);
        }
    });


    /* LinkListe für LinkInBio Deatile View */
    var linkinbioId = $('#linkinbio_page_id').val();
    if(linkinbioId){
        $.ajax({
            url: '/linkinbio/links/' + linkinbioId + '/',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                // Leeren Sie zuerst den Container, um sicherzustellen, dass keine alten Daten übrig bleiben
                $('#card-container').empty();
                $('.loader-image').removeClass('d-none')
                setTimeout(function() {

                    for (var i = 0; i < data.links.length; i++) {
                        var link = data.links[i];
                    
                        var card = `
                        <div class="card border-0 shadow-sm mb-3 sortable-grabel">
                        <div class="card-body">
                            <div class="row" id="linkInBioCardForm${link.id}">
                                <div class="col-1">
                                    <div class="d-flex mb-3 linkin-bio-hover align-items-center h-100">
                                        <i class="fa-solid fa-grip-vertical"></i>
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5 class="mb-0">${link.button_label}</h5>
                                        <button type="button" class="btn btn-primary btn-sm linkinbio-editcard" data-linkinbio-editcard="${link.id}"><i class="fa-solid fa-pen"></i></button>
                                    </div>
                                    <div class="d-flex mt-3">
                                        <a class="linkinbio" href="${link.url_destination}" target="_blank">${link.url_destination}</a>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <div class="d-flex align-items-center">
                                            <i class="fa-solid fa-chart-line linkinbio-icon"></i>
                                            <small class="mx-2 textsmall">1</small>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input linkinbio-switch" data-linkinbio-switch="${link.id}" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row d-none" id="linkInBioCardAddForm${link.id}">
                                <div class="col-12">
                                    <div class="mb-3">
                                        
                                        <div class="bg-linkinbio-edit-field d-flex justify-content-start align-items-baseline rounded">
                                            <a class="btn btn-light form-place" data-form-place="${link.id}" href="#">Replace link</a>
                                        </div>
        
                                        <!--Neuer Link Form-->
                                        <div class="linkinbio-form-place${link.id}"></div>
                                        <!-- /. Neuer Link Form-->
        
                                        <button type="submit" id="cancel" class="btn btn-secondary btn-sm mt-3">Abbrechen</button>
                                    </div>
                                </div>
                            </div>
        
                        </div>
                    </div>
                        `;

                        $('#card-container').append(card);
                    }
                    

                    $('.loader-image').addClass('d-none')

                }, 1000);
        
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler:', errorThrown);
            }
        });
    }



    
});