$(document).ready(function(){


    // Überprüfen Sie den Status des Cookie1 und setzen Sie das Checkbox-Feld entsprechend
    if (getCookie("sta_lli") === "true") {
        $("#sta_lli").prop("checked", true);
    } else {
        $("#sta_lli").prop("checked", false);
    }

    // Überprüfen Sie den Status des Cookie2 und setzen Sie das Checkbox-Feld entsprechend
    if (getCookie("mar_lli") === "true") {
        $("#mar_lli").prop("checked", true);
    } else {
        $("#mar_lli").prop("checked", false);
    }

    // Event-Handler für das Cookie1-Checkbox-Feld
    $("#sta_lli").change(function() {
        if ($(this).is(":checked")) {
            setCookie("sta_lli", "true", 365); // Setzen Sie das Cookie für 365 Tage
        } else {
            deleteCookie("sta_lli"); // Löschen Sie das Cookie
        }
    });

    // Event-Handler für das Cookie2-Checkbox-Feld
    $("#mar_lli").change(function() {
        if ($(this).is(":checked")) {
            setCookie("mar_lli", "true", 365); // Setzen Sie das Cookie für 365 Tage
        } else {
            deleteCookie("mar_lli"); // Löschen Sie das Cookie
        }
    });

    // Event-Handler für den "Alle Cookies akzeptieren"-Button
    $("#accept_all").click(function() {
        // Setzen Sie das Cookie "sta_lli" auf "true" (akzeptiert) und "mar_lli" auf "true" (akzeptiert)
        setCookie("sta_lli", "true", 365);
        setCookie("mar_lli", "true", 365);

        // Aktualisieren Sie die Checkbox-Felder entsprechend
        $("#sta_lli").prop("checked", true);
        $("#mar_lli").prop("checked", true);
    });

    // Funktion zum Setzen eines Cookies
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
            console.log('Cookie Setzen');
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    // Funktion zum Abrufen eines Cookies und Anzeigen in der Konsole
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                var cookieValue = c.substring(nameEQ.length, c.length);
                // console.log(name + " = " + cookieValue); // Zeigen Sie den Cookie-Wert in der Konsole an
                return cookieValue;
            }
        }
        return null;
    }

    // Funktion zum Löschen eines Cookies
    function deleteCookie(name) {
        console.log('Cookie Löschen');
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }


    /*Cookie Open Close*/
    $("#cookie-settings-open").click(function() {
        var meinElement = $("#cookie-settings");
        if (meinElement.hasClass("angezeigt")) {
            meinElement.removeClass("angezeigt");
        } else {
            meinElement.addClass("angezeigt");
        }
    });


    // Überprüfen Sie den Status des Cookie "sta_lli" und "mar_lli"
    var sta_lliCookie = getCookie("sta_lli");
    var mar_lliCookie = getCookie("mar_lli");

    // Überprüfen Sie, ob einer der Cookies ausgewählt wurde
    if (sta_lliCookie === "true" || mar_lliCookie === "true") {
        // Ein Cookie wurde ausgewählt, daher verstecken Sie das alte Element (z.B. Element mit ID "altElement")
        $("#cookie-banner").hide();

        // Zeigen Sie ein neues Element (z.B. Element mit ID "neuElement") an
        $("#cookie-symbol").show();
    } else {
        // Kein Cookie wurde ausgewählt, daher verstecken Sie das neue Element (falls sichtbar)
        $("#cookie-symbol").hide();

        // Zeigen Sie das alte Element (z.B. Element mit ID "altElement") an
        $("#cookie-banner").show();
    }

    /*Cookie Symbol Open Close*/
    $("#cookie-symbol").click(function() {
        console.log('cockie run');
        $("#cookie-symbol").hide();
        $("#cookie-banner").show();
    });

    /*Load page*/
    $("#cookie-save").click(function() {
        window.location.reload();
    });


});