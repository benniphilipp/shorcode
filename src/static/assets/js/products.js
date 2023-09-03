$(document).ready(function(){


    var elements = stripe.elements();

    console.group(stripe);

    var card = elements.create('card');
    card.mount('#card-element');


    var form = document.getElementById('payment-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das Standardverhalten des Formulars

        // Sammeln Sie die Zahlungsinformationen aus dem Formular
        var cardNumber = document.getElementById('card_number').value;
        var expMonth = document.getElementById('exp_month').value;
        var expYear = document.getElementById('exp_year').value;
        var cvc = document.getElementById('cvc').value;

        // Senden Sie die Zahlungsinformationen an Ihre Django View
        var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        fetch('/checkout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                card_number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc,
            }),
        }).then(function(response) {
            if (response.ok) {
                // Zahlung erfolgreich, zeigen Sie eine Erfolgsmeldung an
                alert('Zahlung erfolgreich verarbeitet!');
            } else {
                // Fehler bei der Zahlung, behandeln Sie ihn hier
                alert('Fehler bei der Zahlung: ' + response.statusText);
            }
        });
    });



        

    
    
    
    
    
    











    var productId = 1;  // Ändern Sie dies auf die tatsächliche Produkt-ID

    $.ajax({
        url: `/products/${productId}/`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#product-name').text(data.name);
            $('#product-price').text('Price: $' + data.price);
            $('#product-tax').text('Tax: $' + data.tax);
            $('#product-stage').text('Stage: ' + data.stage);
        },
        error: function() {
            console.error('Error fetching product details.');
        }
    });


    var domain = window.location.protocol + '//' + window.location.host;

    var userId = 4; // Setze die gewünschte Benutzer-ID hier

    const first_name = document.getElementById('id_first_name');
    const last_name = document.getElementById('id_last_name');
    const address = document.getElementById('id_address');
    const zip_code = document.getElementById('id_zip_code');
    const city = document.getElementById('id_city');
    const csrf = document.getElementsByName('csrfmiddlewaretoken');

    $.ajax({
        url: `${domain}/${userId}/customer_json_adress/`, // Passe den URL-Pfad entsprechend an
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if ('error' in response) {
                console.log('Fehler:', response.error);
            } else {

                // Data
                const data = response

                first_name.value = data.first_name;
                last_name.value = data.last_name
                address.value = data.address
                zip_code.value = data.zip_code
                city.value = data.city
                
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX-Fehler:', error);
        }
    });

    // Create Adresse Ajax
    $('#userProfileForm').submit(function(event) {
        event.preventDefault();
        
        const first_name = document.getElementById('id_first_name');
        const last_name = document.getElementById('id_last_name');
        const address = document.getElementById('id_address');
        const zip_code = document.getElementById('id_zip_code');
        const city = document.getElementById('id_city');
        const csrf = document.getElementsByName('csrfmiddlewaretoken');

        const fd = new FormData();
        fd.append('first_name', first_name.value);
        fd.append('last_name', last_name.value);
        fd.append('address', address.value);
        fd.append('zip_code', zip_code.value);
        fd.append('city', city.value);
        fd.append('csrfmiddlewaretoken', csrf[0].value)

        var userId = $('input[name="user_id"]').val();
        var ajaxUrl = `${domain}/${userId}/update_json/`; 
        
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            enctype: 'multipart/form-data',
            data: fd,
            success: function(response) {
                if (response.success) {
                    //alert(response.message);
                    ls_toast(response.message);
                } else {
                    // alert('Fehler beim Aktualisieren des Profils.');
                    console.log(response);
                    
                    
                    //$('#id_url').val('');
                }
            },
            error: function() {
                console.log(error);
                // alert('Es ist ein Fehler aufgetreten.');
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    });


});