window.addEventListener('DOMContentLoaded', (event) => {

    // Menu Style
    $('.links-down').click(function(event){
        event.preventDefault();
        if($("#links-collapse").hasClass("show")){
            $('#links-collapse').removeClass('show');
        }else{
            $('#links-collapse').addClass('show');
        }
    });


    if($('.link-archiv').hasClass('active')){
        $('#links-collapse').addClass('show');   
    }

    if($('.link-archiv').hasClass('active')){
        $('.link-nav').addClass('active');
    }

    if($('.link-geo').hasClass('active')){
        $('#links-collapse').addClass('show');  
    }

    if($('.link-geo').hasClass('active')){
        $('.link-nav').addClass('active');
    }



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


    // Beispiel: Wenn der Benutzer die Sprache auswählt
    function setLanguageCookie(language) {
        // Speichere die ausgewählte Sprache im Cookie "language"
        document.cookie = `language=${language};path=/`;
    }


    // Funktion zum Lesen des Cookie-Werts
    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return null; // Cookie wurde nicht gefunden
    }

    // Beispiel: Lesen des "language"-Cookies und Zuweisen des Werts zur Cookie-Variable
    var selectedLanguageCookie = getCookieValue("language");

    // Verwenden Sie selectedLanguageCookie in Ihrer JavaScript-Logik
    if (selectedLanguageCookie) {
        console.log("Die ausgewählte Sprache aus dem Cookie ist: " + selectedLanguageCookie);
    } else {
        console.log("Der Cookie 'language' wurde nicht gefunden.");
    }

    function updateLanguage(selectedLanguage) {
        // Aktualisiert die Sprache in der Datenbank (per AJAX)
        $.ajax({
            type: "POST",
            url: `/${selectedLanguageCookie}/update_language/`,
            data: {
                language: selectedLanguage
            },
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                if (data.success) {
                    // Erfolgreiche Aktualisierung der Datenbank

                    // Speichert die ausgewählte Sprache im Cookie
                    var expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 30); // Ablaufdatum in 30 Tagen
                    var cookieValue = encodeURIComponent(selectedLanguage) + '; expires=' + expirationDate.toUTCString() + '; path=/';
                    document.cookie = 'language=' + cookieValue;

                    // Aktualisiert die Seite mit der ausgewählten Sprache in der URL
                    var currentUrl = window.location.href;
                    var urlParts = currentUrl.split('/');
                    var baseUrl = urlParts.slice(0, 3).join('/'); // Beispiel: http://localhost:8000
                    var newUrl = baseUrl + '/' + selectedLanguage + '/' + urlParts.slice(4).join('/');//var newUrl = baseUrl + '/' + selectedLanguage + urlParts.slice(4).join('/');//var newUrl = baseUrl + '/' + selectedLanguageCookie + urlParts.slice(3).join('/');//var newUrl = baseUrl + '/' + selectedLanguage + urlParts.slice(3).join('/'); // Neuer URL mit ausgewählter Sprache

                    // Leitet die Seite zur neuen URL um, um den Browser neu zu laden
                    window.location.href = newUrl;
                } else {
                    // Fehler beim Aktualisieren der Datenbank
                    console.log(data.errors);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                // Handhaben Sie Ajax-Fehler hier
                ls_toast('Ajax-Fehler: ' + textStatus + ' ' + errorThrown);
                console.log(xhr);
            }
        });
    }

    $("#id_language").change(function() {
        var selectedLanguageDropdown = $(this).val(); // Aus dem Dropdown-Feld ausgewählte Sprache
        updateLanguage(selectedLanguageDropdown);
    });

    
});