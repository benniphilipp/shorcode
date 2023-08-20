

$(document).ready(function() {

    // Dopplete inhatle löschen.
    $("#removeDuplicatesBtn").click(function() {

        $("#removeDuplicatesBtn").prop("disabled", true);

        $.ajax({
            type: "GET",
            url: "/webclicktracker/remove-duplicates/",  // Die URL zum Django-View
            success: function(data) {
                //alert(data.message);  // Zeige eine Erfolgsmeldung an
                console.log(data.message);
                $("#removeDuplicatesBtn").prop("disabled", false);
            },
            error: function(xhr, status, error) {
                alert("Fehler beim Entfernen doppelter Seiten");
            }
        });
    });

    // Button Website graper
    $("#submit-button").click(function(e) {
        e.preventDefault();
    
        $("#submit-button").prop("disabled", true);
        var url = $('#url-input').val();
        var csrfToken = $('input[name=csrfmiddlewaretoken]').val();

        // Starte den rekursiven Vorgang und aktualisiere den Fortschrittsbalken
        startRecursiveProcess(url, csrfToken);
        
    });
    
    // Funktion zum Starten des rekursiven Vorgangs und Fortschrittsaktualisierung
    function startRecursiveProcess(url, csrfToken) {
        $.ajax({
            type: 'POST',
            url: '/webclicktracker/save_click/',
            data: {
                'url': url,
                csrfmiddlewaretoken: csrfToken,
            },
            dataType: 'json',
            success: function(response) {
                console.log(response.message);
                $("#submit-button").prop("disabled", false);
            },
            error: function(xhr, status, error) {
                // alert("Fehler beim Vorgang");
                console.log("Fehler beim Vorgang");
            }
        });
    }

    // Crate Website Json
    $('#create-website-btn').click(function() {
        var url = 'https://example.com';  // Setze die URL der Website
        var title = 'Example Website';  // Setze den Titel der Website
        var user_id = 1;  // Setze die ID des Benutzers (z.B. aus der Session)
        var csrfToken = $('input[name=csrfmiddlewaretoken]').val();

        $.ajax({
            url: '/create_website/',
            method: 'POST',
            data: {
                'url': url,
                'title': title,
                'user_id': user_id,
                csrfmiddlewaretoken: csrfToken,
            },
            success: function(data) {
                // $('#result').html('<p>Website created with ID: ' + data.id + '</p>');
            },
            error: function() {
                // $('#result').html('<p>Error creating website.</p>');
            }
        });
    });


    

});








