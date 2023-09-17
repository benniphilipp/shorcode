window.addEventListener('DOMContentLoaded', (event) => {
    // Hier finden sie alle functionen LinkInBio **Links** 
    // console.log('JS Links');

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

    /* LinkInBio Links */   
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
        console.log(formData)
    
        // Senden Sie die Formulardaten an die View
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: JSON.stringify(formData),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrftoken 
            },
            success: function(data) {
                console.log(data);
                if (data.success) {
                    alert(data.message);
                } else {
                    alert('Fehler: ' + data.message);
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
            $('#form-create-shorcode').hide();
            $('#form-create-link').show();
            // Deaktivieren Sie das andere Formular
            $('#createShorcode').prop('checked', false);
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
        
                // Leeren Sie zuerst den Container, um sicherzustellen, dass keine alten Daten übrig bleiben
                $('#card-container').empty();
                $('.loader-image').removeClass('d-none')
                setTimeout(function() {

                    for (var i = 0; i < data.links.length; i++) {
                        var link = data.links[i];
                    
                        var card = `
                        <div class="card border-0 shadow-sm mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h5 class="mb-0">${link.button_label}</h5>
                                    <button type="button" class="btn btn-primary btn-sm linkinbio-editcard" data-linkinbio-editcard="${link.id}"><i class="fa-solid fa-pen linkinbio-icon"></i></button>
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