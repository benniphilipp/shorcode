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


    // Handler für linkinbio sozial media list
    var linkInBioId = $('#linkinbio_page_id_custome').val();

    $.ajax({
        url: '/de/linkinbio/social_media_profiles/' + linkInBioId,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Hier kannst du die Daten verarbeiten, z.B. in deine HTML-Seite einfügen
            var socialMediaProfiles = data.social_media_profiles;
            console.log(socialMediaProfiles);
    
            socialMediaProfiles.forEach(function(profile) {
                // Verarbeite jedes Profil (profile.platform und profile.url) hier
                var newElement = `
                    <div class="card border-0 mt-4 p-3" style="background-color: rgb(248,249,250);">
                        <div class="card-body p-0">
                            <div class="row">
                                <div class="col">
                                    <select class="form-select platform-select" id="socialSelectFieldId" name="platform">
                                        <!-- Optionen werden hier dynamisch hinzugefügt -->
                                    </select>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <input type="text" class="form-control url_social" placeholder="Url" value="${profile.url}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#elementContainer').append(newElement);
    
                // Das <select> im aktuellen Element auswählen und mit Optionen befüllen
                var currentElement = $('#elementContainer').children().last(); // Das zuletzt hinzugefügte Element
                var currentSelect = currentElement.find('.platform-select'); // Das <select> im aktuellen Element
    
                // Funktion zum Befüllen eines <select> mit Plattformoptionen
                function fillPlatformSelect(select, platformId) {
                    $.each(data.platforms, function(index, platform) {
                        var option = $('<option>', {
                            value: platform.id,
                            text: platform.name
                        });
                        if (platform.id === profile.platform) {
                            option.attr('selected', 'selected');
                        }
                        select.append(option);
                    });
                }
    
                fillPlatformSelect(currentSelect, profile.platform);
            });
    
            // Hier fügen wir die verbleibenden Plattformen aus dem zweiten AJAX-Aufruf hinzu
            $.ajax({
                url: '/linkinbio/get_social_media_platforms/', // Passe die URL an deine Route an
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    var socialMediaPlatforms = data.platforms;
    
                    // Hier kannst du die Plattformen in deinen <select>-Elementen verwenden
                    // Füge die Optionen zu den <select>-Elementen hinzu
                    socialMediaPlatforms.forEach(function(platform) {
                        $('.platform-select').append($('<option>', {
                            value: platform.id,
                            text: platform.name
                        }));
                    });
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.error('Fehler beim Abrufen der Plattformen:', errorThrown);
                }
            });
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Fehler beim Abrufen der Daten:', errorThrown);
        }
    });



    // Handler für den Button-Klick zum Speichern der URL
    var urlSocialForm = $('#urlSocial').val();
    $(document.body).on('change', '.url_social', function() {
        var url_social = $(this).val();  // Wert aus dem Input-Feld holen
        var link_in_bio_id = $('#linkinbio_page_id_custome').val();  // Annahme: Die LinkInBio-Seite hat eine ID
        var social_media_platform = $('#socialSlectFeldId').val();
        console.log(social_media_platform)
        // Ajax-Anfrage zum Speichern der URL
        $.ajax({
            url: urlSocialForm,  // Ersetze durch die richtige URL zur View
            type: 'POST',
            data: {
                url_social: url_social,
                link_in_bio_id: link_in_bio_id,
                social_media_platform: social_media_platform
            },
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                if (data.success) {
                    console.log('URL erfolgreich gespeichert.');
                    // Hier kannst du weitere Aktionen ausführen, z.B. die Seite aktualisieren
                } else {
                    console.error('Fehler beim Speichern der URL:', data.message);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der URL:', errorThrown);
            }
        });
    });


    // Handler für den Button-Klick
    $('#addElementButton').click(function() {
        // Erstelle ein neues Element mit dem gewünschten HTML
        var newElement = `
            <div class="card border-0 mt-4 p-3" style="background-color: rgb(248,249,250);">
                <div class="card-body p-0">
                    <div class="row">
                        <div class="col">
                            <select class="form-select platform-select" id="socialSlectFeldId" name="platform">
                                <!-- Optionen werden hier dynamisch hinzugefügt -->
                            </select>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <input type="text" class="form-control url_social" placeholder="Url">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Füge das neue Element zum Container hinzu
        $('#elementContainer').append(newElement);

        // Hole die Plattformen und fülle das gerade hinzugefügte <select> mit Optionen
        $.ajax({
            url: '/linkinbio/get_social_media_platforms/', // Ersetze durch die richtige API-URL
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Finde das <select> im neuen Element
                var select = $('#elementContainer').find('.platform-select').last();
                $.each(data.platforms, function(index, platform) {
                    select.append($('<option>', {
                        value: platform.id,
                        text: platform.name
                    }));
                });
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler:', errorThrown);
            }
        });
    });




    const colorInputs = document.querySelectorAll('.color-picker');

    colorInputs.forEach((colorInput) => {
        const pickr = Pickr.create({
            el: colorInput,
            theme: 'classic',
            default: '#000000',
            padding: 8,
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    input: true,
                    save: true,
                },
            },
        });
    
        pickr.on('save', (color) => {
            // Hier kannst du die ausgewählte Farbe verwenden, z.B. speichern oder anzeigen
            console.log(`Ausgewählte Farbe: ${color.toHEXA().toString()}`);
        });
    });




    /* LinkListe für LinkInBio Deatile View */
    var linkinbioId = $('#linkinbio_page_id').val();

    $.ajax({
        url: '/linkinbio/links/' + linkinbioId + '/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
    
            // Leeren Sie zuerst den Container, um sicherzustellen, dass keine alten Daten übrig bleiben
            $('#card-container').empty();
    
            for (var i = 0; i < data.links.length; i++) {
                var link = data.links[i];
            
                // Erstellen Sie eine Card-Div mit den Daten aus dem JSON
                var card = $('<div class="card mt-3 sortable-item">');
                var cardBody = $('<div class="card-body p-3">');
                var title = $('<h5>').text(link.button_label);
                var linkElement = $('<a>').attr('href', link.url_destination).text(link.url_titel);
            
                // Fügen Sie die erstellten Elemente zur Card hinzu
                cardBody.append(title);
                cardBody.append(linkElement);
                card.append(cardBody);
            
                // Fügen Sie die Card zum Container hinzu
                $('#card-container').append(card);
            
                // Hinzufügen des data-id-Attributs zur Card
                card.attr('data-id', link.order);
            
                // Hinzufügen eines Event Listeners für die Card
                card.on('dragstart', function(event) {
                    event.originalEvent.dataTransfer.setData('text/plain', $(this).attr('data-id'));
                });
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Fehler:', errorThrown);
        }
    });



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
    $('#form-create-link').on('submit', function(event){
        event.preventDefault(); 
        
        var button_label = $('#button_label').val();
        var linkinbio_page_id = $('#linkinbio_page_id').val();
        var shortcode_id = $('#shortcode_id').val();

        var formData = {
            'shortcode_id': shortcode_id,
            'linkinbio_page_id': linkinbio_page_id,
            'button_label': button_label,
        };

        $.ajax({
            type: 'POST',
            url: $(this).attr('action'), // Aktualisieren Sie dies mit Ihrer tatsächlichen URL
            data: JSON.stringify(formData),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrftoken 
            },
            success: function(data) {
                console.log(data);
                if (data.success) {
                    alert(data.message); // Zeigen Sie eine Erfolgsmeldung an oder führen Sie andere Aktionen aus
                } else {
                    alert('Fehler: ' + data.message); // Zeigen Sie eine Fehlermeldung an
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('Fehler beim Senden des Formulars: ' + errorThrown)
            }
        });
    });


    /* Crate Shorcode in LinkInBio */   
    $('#form-create-shorcode').on('submit', function(event) {
        event.preventDefault();
    
        // Erfassen Sie die Formulardaten
        var buttonLabel = $('#cratedhortcode').val();
        var linkUrl = $('#link-url').val();
        var linkinbio_page = $('#linkInBioPageID').val();
    
        // Erstellen Sie ein JSON-Objekt mit den Formulardaten
        var formData = {
            'button_label': buttonLabel,
            'link_url': linkUrl,
            'linkinbio_page': linkinbio_page
        };
    
        // Senden Sie die Formulardaten an die View
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'), // Verwenden Sie die action aus dem Formular
            data: JSON.stringify(formData),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrftoken 
            },
            success: function(data) {
                console.log(data);
                if (data.success) {
                    alert(data.message); // Zeigen Sie eine Erfolgsmeldung an oder führen Sie andere Aktionen aus
                } else {
                    alert('Fehler: ' + data.message); // Zeigen Sie eine Fehlermeldung an
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                // alert('Fehler beim Senden des Formulars: ' + errorThrown);
                console.log('Fehler beim Senden des Formulars: ' + errorThrown)
            }
        });
    });


    /* Autocoplite Shorcdcode */
    var shortcodeInput = $('#selectShortcode');
    var searchResults = $('#search-results');

    shortcodeInput.on('input', function() {

        var enteredText = shortcodeInput.val();

        if (enteredText.length > 2) { // Mindestlänge für die Suche
            $.ajax({
                url: '/linkinbio/shortcode/', // Ersetzen Sie "/path/to/shortcode-list/" durch die richtige URL
                type: 'GET',
                data: {
                    search_term: enteredText
                },
                headers: {
                    'X-CSRFToken': csrftoken 
                },
                success: function(response) {
                    // Löschen Sie vorhandene Suchergebnisse
                    searchResults.empty();
                    console.log(response);
                    // Durchlaufen Sie die Antwort und fügen Sie Suchergebnisse hinzu
                    for (var i = 0; i < response.length; i++) {
                        var shortcodeItem = $('<li>');
                        shortcodeItem.text(response[i].url_titel); // Zeigen Sie den gewünschten Wert an
                        // Fügen Sie eine Daten-ID mit der Shortcode-ID hinzu
                        shortcodeItem.attr('data-id', response[i].id);
                        // Fügen Sie einen Klick-Handler hinzu, um die Shortcode-ID zu setzen
                        shortcodeItem.click(function() {
                            var shortcodeId = $(this).attr('data-id');
                            $('#shortcode_id').val(shortcodeId); // Setzen Sie die Shortcode-ID im versteckten Feld
                        });
                        searchResults.append(shortcodeItem);
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Leeren Sie das Suchergebnis, wenn der Text zu kurz ist
            searchResults.empty();
        }
    });

    // Verarbeiten Sie das Klicken auf ein Suchergebnis
    searchResults.on('click', 'li', function() {
        var selectedText = $(this).text();
        var shortcodeId = $(this).attr('data-id'); // Holen Sie die Shortcode-ID aus dem Daten-Attribut
        shortcodeInput.val(selectedText);
        $('#shortcode_id').val(shortcodeId); // Setzen Sie die Shortcode-ID im versteckten Feld
        searchResults.empty();
    });


    // Überwachen Sie Änderungen in den Checkboxen
    $('#createShorcode').on('change', function() {
        if ($(this).is(':checked')) {
            // Wenn "Create a new Llinkb link" ausgewählt ist, aktivieren Sie das zugehörige Formular
            $('#form-create-shorcode').show();
            $('#form-create-link').hide();
            // Deaktivieren Sie das andere Formular
            $('#createSearch').prop('checked', false);
        }
    });

    $('#createSearch').on('change', function() {
        if ($(this).is(':checked')) {
            // Wenn "Select an existing Llinkb link" ausgewählt ist, aktivieren Sie das zugehörige Formular
            $('#form-create-shorcode').hide();
            $('#form-create-link').show();
            // Deaktivieren Sie das andere Formular
            $('#createShorcode').prop('checked', false);
        }
    });


    /***************** Open Sidebar *****************/
    $("#openForm").on('click', function() {  //use a class, since your ID gets mangled
        console.log('run open');
        $('#aside-form').addClass("toggle"); 
        $('#overlay-open').addClass("overlay-open"); 

        $('#id_template_name').css({
            'border-color': '#dc3545',
        });

        $('#id_template_name').on('change', function() {
            $('#id_template_name').css({
                'border-color': '',
            });
        });

    });


    /***************** Close Sidebar *****************/
    $("#closeForm").click(function() {  //use a class, since your ID gets mangled
        $('#aside-form').removeClass("toggle");
        $('#overlay-open').removeClass("overlay-open");  

        $('#geothemplate-form').removeClass("d-none"); 
        $('#geothemplate-form-delete').addClass("d-none"); 

        $('#geothemplate-form')[0].reset();
    });


});
