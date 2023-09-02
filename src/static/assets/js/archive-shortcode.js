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

    
    // Unarchive
    $('#archive-button').click(function() {
        // Sammeln Sie die ausgewählten Shortcode-IDs
        var selectedShortcodes = [];
        $('input[type="checkbox"]:checked').each(function() {
            var shortcodeID = $(this).closest('tr').data('shortcode');
            selectedShortcodes.push(shortcodeID);
        });
    
        // Senden Sie die ausgewählten Shortcode-IDs an die Server-View
        $.ajax({
            type: 'POST',
            url: '/shortcode/unarchive/', // Passe die URL an
            data: {
                selected_shortcodes: selectedShortcodes,
                csrfmiddlewaretoken: csrftoken // Füge das CSRF-Token hinzu
            },
            success: function(data) {
                // Hier können Sie eine Erfolgsmeldung oder Aktionen nach der Entarchivierung durchführen
                //alert(data.message);
                loadArchivedShortcodes();
                ls_toast('Die ausgewählten Shortcodes wurden erfolgreich entarchiviert.');
                // Aktualisieren Sie die Ansicht, um die Änderungen zu reflektieren (z.B. die entfernten archivierten Shortcodes aus der Tabelle)
                // Hier können Sie die Aktualisierungslogik hinzufügen
            },
            error: function(error) {
                // Hier können Sie Fehlerbehandlung hinzufügen, falls die Anfrage fehlschlägt
                console.log(error);
            }
        });
    });


    // List ansicht Shorcode Archiviert
    function loadArchivedShortcodes() {
        $.ajax({
            type: 'GET',
            url: '/shortcode/archive/list/',
            dataType: 'json',
            success: function(response) {
                const archivedShortcodes = response.archived_shortcodes;
    
                const archivedShortcodeTable = $('#archived-shortcode-table');
                archivedShortcodeTable.empty();
    
                archivedShortcodes.forEach(function(shortcode) {
                    // Erstellen Sie eine Zeile für jeden archivierten Shortcode
                    const row = $('<tr data-shortcode="' + shortcode.id + '" class="shortcode-class">').addClass('shortcode-class');
    
                    // Erstellen Sie eine Zelle für die Checkbox mit einer eindeutigen ID
                    const checkboxCell = $('<td>');
                    const checkbox = $('<input>').attr({
                        type: 'checkbox',
                        value: shortcode.id,
                        id: 'checkbox-' + shortcode.id, // Eindeutige ID für jede Checkbox
                    }).addClass('form-check-input');
                    checkboxCell.append(checkbox);
                    row.append(checkboxCell);
    
                    // Erstellen Sie Zellen für die anderen Spalten
                    const titleCell = $('<td>').text(shortcode.url_titel);
                    const destinationCell = $('<td>').text(shortcode.url_destination);
                    const createDateCell = $('<td>').text(shortcode.url_create_date);
    
                    // Fügen Sie die Zellen zur Zeile hinzu
                    row.append(titleCell);
                    row.append(destinationCell);
                    row.append(createDateCell);
    
                    // Fügen Sie die Zeile zur Tabelle hinzu
                    archivedShortcodeTable.append(row);
                });
            },
            error: function(error) {
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    }

    loadArchivedShortcodes();


    // Unachriviert funktion
    $('#archive-button').hide();
    $('#delete-button').hide();

    $('#archived-shortcode-table').on('change', 'input[type="checkbox"]', function() {
        if ($('input[type="checkbox"]:checked').length > 0) {
            $('#archive-button').show();
            $('#delete-button').show();
        } else {
            $('#archive-button').hide();
            $('#delete-button').hide();
        }
    });


    //Archive function
    $('#archive-btn').on('click', function(event){
        event.preventDefault();

        var dataArchive = jQuery(this).attr('data-archive');
        console.log(dataArchive);

        const fd = new FormData();
        fd.append('pk', dataArchive);

        $.ajax({
            type: 'POST',
            url: "/shortcode/archive/update/", //shortcode
            data: fd,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(response){
                console.log(response);
                setTimeout(()=>{
                    $('#overlay').removeClass('overlay-active');
                    $('#overlay-open').removeClass("overlay-open"); 
                    $('#aside-form').removeClass("toggle"); 

                    ls_toast('Shortcodes wurden erfolgreich Archiviert.');
                    
                }, 1000);
            },
            error: function(error){
                console.log(error)
            },
            cache: false,
            contentType: false,
            processData: false,
        })
    });



    //Shorcode Löschen
    function deleteSelectedShortcodes() {
        const selectedShortcodeIds = []; // Array zum Speichern der ausgewählten Shortcode-IDs
    
        // Iteriere durch alle Checkboxen und füge die ausgewählten IDs zum Array hinzu
        $('input[type="checkbox"]:checked').each(function() {
            const checkboxId = $(this).attr('id'); // ID der Checkbox
            const shortcodeId = checkboxId.split('-')[1]; // Extrahiere die Shortcode-ID aus der Checkbox-ID
            selectedShortcodeIds.push(shortcodeId); // Füge die Shortcode-ID zum Array hinzu
        });
    
        if (selectedShortcodeIds.length === 0) {
            alert('Bitte wählen Sie mindestens einen Shortcode zum Löschen aus.');
            return;
        }
    
        $.ajax({
            type: 'POST',
            url: '/shortcode/delete/', // Die URL zur Lösch-View
            data: {
                'shortcode_ids[]': selectedShortcodeIds,
                'csrfmiddlewaretoken': csrftoken, // CSRF-Token, falls erforderlich
            },
            success: function(response) {
                // Hier kannst du die Erfolgsmeldung aus der JSON-Antwort verarbeiten
                console.log(response.message);
                loadArchivedShortcodes();
                ls_toast(response.message);

            },
            error: function(error) {
                console.log(error);
            },
        });
    }
    
    // Füge einen Event-Listener hinzu, um das Löschen von Shortcodes auszulösen
    $('#delete-button').on('click', function(event) {
        event.preventDefault();
        deleteSelectedShortcodes();
    });


}); // End document ready function
