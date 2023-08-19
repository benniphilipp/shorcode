

$(document).ready(function() {

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

    

});








