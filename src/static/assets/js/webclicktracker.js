

$(document).ready(function() {

    //Alert
    function clearContent() {
        setTimeout(function() {
            $('#toast-alert').html('');
        }, 4000);
    }

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
        console.log(url)
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
                console.log(data.message);
                if(data.message == 'Url existiert bereits' || data.message == 'Das Formular ist ungültig'){
                    $('#error-message').html(data.message);
                    $('#error-message').addClass('active');

                    setTimeout(function() {
                        $('#error-message').removeClass('active');
                    }, 2000);

                }else{
                    ls_toast(data.message);
                        $('#model-form-website').removeClass('active');
                        $('#id_url').val('');
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                // $('#result').html('<p>Error creating website.</p>');
            }
        });
    });

    // List View Website
    function getWebsiteList() {
        $.ajax({
            url: '/webclicktracker/website-list/',  // Passe den Pfad zur Website-Liste-View an
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Hier kannst du die Daten aus dem JSON verwenden
                var websiteList = data;

                // Verarbeite die Daten weiter, z.B. fülle eine Tabelle damit
                var websiteDiv = $('#website-list');
                websiteList.forEach(item => {
                    var websiteCard = $(`
                        <div class="card border-0 mt-3">
                            <div class="card-header website-card-header border-0 pt-4">
                                <img src="${item.favicon}" class="img-thumbnail website-favicon-img" alt="favicon.ico">
                                <a href="/webclicktracker/website/${item.id}" class="btn btn-xs btn-primary btn-sm ms-auto" type="button">Webseite Treking</a>
                            </div>
                            <div class="card-body">
                                
                                <div class="container g-0">
                                    <div class="row g-0">
                                        <div class="col-12 col-md-2">
                                            <img src="${item.first_image ? item.first_image : website_image}" class="website-image-card img-fluid rounded" alt="Website Image">
                                        </div>
                                        <div class="col-12 col-md-10">
                                        <h5>${item.title}</h5>
                                        <p><span class="website-meta">Meta Beschreibung:<br></span>${item.meta_description ? item.meta_description : 'Keine Beschreibung zufinden'}</p>
                                        <a class="website-link-blue" href="${item.url}" target="_blank">${item.url}</a>      
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    `)

                    websiteDiv.append(websiteCard);
                });

            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    getWebsiteList();

    // 
    $.ajax({
        url: '/webclicktracker/website/3/data/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {

            console.log(data);

            var orgchartData = transformDataForOrgChart(data, isIndividualPage);
            $('#clickDataList').orgchart({
                'data': orgchartData
            });


        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });

    function isIndividualPage(url) {
        var regex = /\/page\/.*/i;  // Ein regulärer Ausdruck, der nach /page/ gefolgt von alphanumerischen Zeichen sucht
        return regex.test(url);
    }

    function transformDataForOrgChart(data) {
        // Hier können Sie die erhaltenen Daten in das OrgChart-Format umwandeln
        // Je nach Format des OrgChart-Plugins kann die Umwandlung variieren
        // Rückgabe sollte ein geeignetes Format für das OrgChart sein

        var orgchartData = {
            'id': data.id,
            'name': data.title,
            'children': []  // Fügen Sie hier die Unterseiten hinzu
        };


        // Schleife durch die empfangenen Seiten und füge sie als Unterseiten hinzu
        for (var i = 0; i < data.pages.length; i++) {
            var page = data.pages[i];
            if (isIndividualPage(page.url)) {
                var pageNode = {
                    'id': page.id,
                    'name': page.title,
                    'children': []  // Hier können weitere Unterseiten hinzugefügt werden
                };
                orgchartData.children.push(pageNode);
            }
        }

        return orgchartData;
    }
         

});








