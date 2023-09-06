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



    // Productslist View
    $.ajax({
        url: '/products/',  // Die URL zu Ihrer Produktliste View
        dataType: 'json',
        success: function(data) {
            const productList = $("#product-list");
            data.forEach(function(product) {

                const monthlyPriceSavings = parseFloat(product.monthly_price_savings);
                const yearlyPriceSavings = parseFloat(product.savings_price);

                    const card = `
                    <div class="col-12 col-md-4">
                        <div class="card card-border${product.id} border-element">
                            <div class="card-body product-list" data-products="${product.id}">
                                <h5 class="card-title">${product.stage}</h5>
                                <div class="d-flex justify-content-between">
                                    <p class="card-text yearly-price">Price: $${product.price} 
                                    ${yearlyPriceSavings > 0.00 ? 
                                        `<span class="badge bg-success">${product.savings_price}</span>`:
                                        ``
                                    }
                                    </p>
                                    <p class="card-text monthly-price" style="display: none;">Price: $${product.monthly_price} 
                                    ${monthlyPriceSavings > 0.00 ? 
                                        `<span class="badge bg-success">${product.monthly_price_savings}</span>` :
                                        ``
                                    }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productList.append(card);
            });

            const productDetaile = $("#product-detaile");
            if (data.length > 0) {
                const firstProduct = data[0];

                const proDetaile = `
                <h5>Purchase summary</h5>
                <div class="d-flex justify-content-between align-items-center">
                <h5 id="stage">${firstProduct.stage}</h5>
                    <div class="d-flex justify-content-between align-items-center">
                        <span id="product-price" class="yearly-price w-100">${firstProduct.price} €&nbsp;/yr</span></div>
                    </div>
                    <span id="product-price" class="monthly-price" style="display:none;">${firstProduct.monthly_price} €</span>
                </div>
                <div id="content">${firstProduct.content}</div>
                <hr>
                `;

                $('#tax').text(firstProduct.tax);
                $('#price').html('<span id="product-price" class="yearly-price">' + firstProduct.price + ' € <span class="small yr">/yr</span></span>');
                $('#monthly_price').html('<span id="product-price" class="monthly-price" style="display:none;">' + firstProduct.monthly_price + ' € <span class="small yr">/yr</span></span>');
                productDetaile.html(proDetaile);
            }

        },
        error: function(error) {
            console.error('Error fetching product list:', error);
        }
    });

   

    // Edite Product auf ListView
    $('#product-list').on('click', '.product-list', function(){
        var produktClickID = $(this).attr('data-products');
        var switchStatus = $('#switch').is(':checked');

        const productDetaile = $("#product-detaile");
        $.ajax({
            url: `/products/${produktClickID}/`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                //console.log(data);
                const proDetaile = `
                <h5>Purchase summary</h5>
                <div class="d-flex justify-content-between align-items-center">
                <h5 id="stage">${data.stage}</h5>
                    <div class="d-flex justify-content-between align-items-center">
                        
                        ${switchStatus ? `<span id="product-price">${data.monthly_price} €</span>`: 
                        `<span id="product-price" class="w-100">${data.price} €&nbsp;/yr</span></div>`}
                        
                    </div>
                </div>
                <div id="content">${data.content}</div>
                <hr>
                `;

                $('#tax').text(data.tax);
                if(switchStatus == false){
                    $('#price').html('<span id="product-price" class="yearly-price">' + data.price + ' € <span class="small yr">/yr</span></span>');
                }else{
                    $('#monthly_price').html('<span id="product-price" class="monthly-price">' + data.monthly_price + ' € <span class="small yr">/yr</span></span>');
                }
                
                productDetaile.html(proDetaile);

                // Ad Porducut
                $('#id_product').val(produktClickID);
            
            },
            error: function() {
                console.error('Error fetching product details.');
            }
        });
    });



    // Entferne die Klasse "active-border" von allen Elementen
    $(document).on('click', '.border-element', function() {
        $('.border-element').removeClass('border-primary');

        var clickedClass = $(this).attr('class').split(' ').find(cls => cls.startsWith('card-border'));
        $(this).addClass('border-primary');
    });


    // Switch für Järliche oder Monatiche abrechung
    function switchPrice() {
        if ($('#switch').is(':checked')) {
            $('.yearly-price').hide();
            $('.monthly-price').show()
        } else {
            $('.yearly-price').show();
            $('.monthly-price').hide();
        }
    }
    
    $('#switch').change(function() {
        switchPrice(this);
    });







var selectedLanguageCookie = 'de'

// This is your test publishable API key.
const stripe = Stripe("pk_test_kvxLMnvuKeiFE7Z2i8Lx5DnD007eHlPfx0");

// The items the customer wants to buy
const items = [{ id: "xl-tshirt" }];

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch(`/${selectedLanguageCookie}/products/create-payment-intent/`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json", 
        'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({ price: 1999 }),
  });

  const responseData = await response.json();
  const clientSecret = responseData.client_secret;

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://127.0.0.1:8000/products/success/",
      receipt_email: emailAddress,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //     "payment_intent_client_secret"
    // );

    const response = await fetch(`/${selectedLanguageCookie}/products/create-payment-intent/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ price: 1999 }),
      });
      //const clientSecret = document.querySelector("#client-secret-input").value;
      const responseData = await response.json();
      const clientSecret = responseData.client_secret;

    console.log(clientSecret);

    if (!clientSecret) {
        return;
    }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}




















    // var elements = stripe.elements();

    // var card = elements.create('card');
    // card.mount('#card-element');

    // var form = document.getElementById('payment-form');

    // form.addEventListener('submit', function(event) {
    //     event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    //     // Sammeln Sie die Zahlungsinformationen aus dem Formular
    //     var cardNumber = document.getElementById('id_card_number').value;
    //     var expMonth = document.getElementById('id_exp_month').value;
    //     var expYear = document.getElementById('id_exp_year').value;
    //     var cvc = document.getElementById('id_cvc').value;

    //     var product_id = document.getElementById('id_product').value;

    //     // Senden Sie die Zahlungsinformationen an Ihre Django View
    //     var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    //     fetch('/products/checkout/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': csrfToken,
    //         },
    //         body: JSON.stringify({
    //             card_number: cardNumber,
    //             exp_month: expMonth,
    //             exp_year: expYear,
    //             cvc: cvc,
    //             product_id: product_id
    //         }),
    //     }).then(function(response) {
    //         if (response.ok) {
    //             // Zahlung erfolgreich, zeigen Sie eine Erfolgsmeldung an
    //             alert('Zahlung erfolgreich verarbeitet!');
    //         } else {
    //             // Fehler bei der Zahlung, behandeln Sie ihn hier
    //             alert('Fehler bei der Zahlung: ' + response.statusText);
    //         }
    //     });
    // });


    // var elements = stripe.elements();
    // var cardElement = elements.create('card');

    // cardElement.mount('#card-element');

    // var form = document.getElementById('payment-form');
    // var errorElement = document.getElementById('error-message');

    // form.addEventListener('submit', function(event) {
    //     event.preventDefault();

    //     stripe.createPaymentMethod({
    //         type: 'card',
    //         card: cardElement,
    //     }).then(function(result) {
    //         if (result.error) {
    //             errorElement.textContent = result.error.message;
    //         } else {
    //             // Erfolgreiche Zahlungsmethode erhalten, jetzt den Server aufrufen
    //             fetch('/products/process_payment/', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'X-CSRFToken': '{{ csrf_token }}',
    //                 },
    //                 body: JSON.stringify({
    //                     payment_method_id: result.paymentMethod.id,
    //                 }),
    //             }).then(function(response) {
    //                 return response.json();
    //             }).then(function(data) {
    //                 if (data.success) {
    //                     // Zahlung erfolgreich verarbeitet
    //                     alert('Zahlung erfolgreich verarbeitet!');
    //                 } else {
    //                     // Fehler bei der Zahlungsverarbeitung
    //                     errorElement.textContent = data.error;
    //                 }
    //             });
    //         }
    //     });
    // });







    // Einzelansicht
    // var productId = 1;  // Ändern Sie dies auf die tatsächliche Produkt-ID

    // $.ajax({
    //     url: `/products/${productId}/`,
    //     method: 'GET',
    //     dataType: 'json',
    //     success: function(data) {
    //         $('#product-name').text(data.name);
    //         $('#product-price').text('Price: $' + data.price);
    //         $('#product-tax').text('Tax: $' + data.tax);
    //         $('#product-stage').text('Stage: ' + data.stage);
    //     },
    //     error: function() {
    //         console.error('Error fetching product details.');
    //     }
    // });


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
            error: function(error) {
                console.log(error);
                // alert('Es ist ein Fehler aufgetreten.');
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    });


});