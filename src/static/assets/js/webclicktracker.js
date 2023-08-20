

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


    // Open Website Modal
    $('#openWebsiteModel').on('click', function(){
        $('#model-form-website').addClass('active');
    });


    // Close Website Modal
    $('#website-close').on('click', function(){
        $('#model-form-website').removeClass('active');
    });


    // Crate Website Json
    $('#create-website-btn').click(function(e) {
        e.preventDefault();
        var url = $('#id_url').val();  // Setze die URL der Website
        var user_id = $('input[name="user"]').val();  // Setze die ID des Benutzers (z.B. aus der Session)
        var csrfToken = $('input[name=csrfmiddlewaretoken]').val();

        console.log(user_id);

        $.ajax({
            url: '/webclicktracker/create_website/',
            method: 'POST',
            data: {
                'url': url,
                'user_id': user_id,
                csrfmiddlewaretoken: csrfToken,
            },
            success: function(data) {
                // $('#result').html('<p>Website created with ID: ' + data.id + '</p>');
                console.log(data);
            },
            error: function(xhr, status, error) {
                console.log(error);
                // $('#result').html('<p>Error creating website.</p>');
            }
        });

    });


    

});








