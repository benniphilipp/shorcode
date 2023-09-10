document.addEventListener("DOMContentLoaded", function () {

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



    var languageDropdown = document.querySelector("#language-switcher select");
    var currentUrl = window.location.pathname;

    languageSelector.addEventListener('change', function() {
        var selectedLanguage = this.value;
        var nextField = document.querySelector('input[name="next"]');
        
        // Aktualisieren Sie den next-Parameter basierend auf der aktuellen URL
        nextField.value = currentUrl.replace('/' + LANGUAGE_CODE + '/', '/' + selectedLanguage + '/');
        
        // Senden Sie das Formular
        this.form.submit();
    });


    // Browsersprache auslesen
    var userLanguage = navigator.language || navigator.userLanguage;

    // Element auswählen, das das Dropdown-Menü für die Sprachauswahl enthält
    var languageDropdown = document.querySelector("#language-switcher select");

    // Über alle Optionen im Dropdown-Menü iterieren
    for (var i = 0; i < languageDropdown.options.length; i++) {
        var option = languageDropdown.options[i];

        // Wenn die Browsersprache mit einer der verfügbaren Sprachen übereinstimmt
        if (option.value === userLanguage) {
        // Die entsprechende Option auswählen
        option.selected = true;
        break; // Schleife beenden, da die Sprache gefunden wurde
        }
    }

    // Das Formular absenden, um die Sprache zu ändern
    languageDropdown.form.submit();
    
});