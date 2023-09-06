$(document).ready(function(){

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

    var selectedLanguageCookie = getCookieValue("language");

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
                $("#payment-form").attr("data-product", firstProduct.id);
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
                loadStripe();
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
                $("#payment-form").attr("data-product", data.id);
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


    selectedLanguageCookie = 'de'




// // This is your test publishable API key.
// const stripe = Stripe("pk_test_kvxLMnvuKeiFE7Z2i8Lx5DnD007eHlPfx0");
// var formAction = $("#payment-form").attr("action");
// // The items the customer wants to buy

// const items = $("#payment-form").attr("data-product");
// // console.log("Wert von data-product: " + items);
// let elements;


// checkStatus();

// document
//   .querySelector("#payment-form")
//   .addEventListener("submit", handleSubmit);

// let emailAddress = '';
// // Fetches a payment intent and captures the client secret

// initialize();
// async function initialize() {
// console.log("Formular wurde gesendet.");

//   const response = await fetch(formAction, {
//     method: "POST",
//     headers: { 
//         "Content-Type": "application/json", 
//         'X-CSRFToken': csrftoken
//     },
//     body: JSON.stringify({ pk: 1 }),
//   });

//   const responseData = await response.json();
//   const clientSecret = responseData.client_secret;

//   const appearance = {
//     theme: 'stripe',
//   };
//   elements = stripe.elements({ appearance, clientSecret });

//   const linkAuthenticationElement = elements.create("linkAuthentication");
//   linkAuthenticationElement.mount("#link-authentication-element");

//   linkAuthenticationElement.on('change', (event) => {
//     emailAddress = event.value.email;
//   });

//   const paymentElementOptions = {
//     layout: "tabs",
//   };

//   const paymentElement = elements.create("payment", paymentElementOptions);
//   paymentElement.mount("#payment-element");
// }



// async function handleSubmit(e) {
//   e.preventDefault();
  
//   setLoading(true);

//   const { error } = await stripe.confirmPayment({
//     elements,
//     confirmParams: {
//       // Make sure to change this to your payment completion page
//       return_url: "https://1442-185-58-55-54.ngrok-free.app/products/success/",
//       receipt_email: emailAddress,
//     },
//   });

//   if (error.type === "card_error" || error.type === "validation_error") {
//     showMessage(error.message);
//   } else {
//     showMessage("An unexpected error occurred.");
//   }

//   setLoading(false);
// }

// // Fetches the payment intent status after payment submission
// async function checkStatus() {
//     console.log("Formular wurde gesendet.");
//     // const clientSecret = new URLSearchParams(window.location.search).get(
//     //     "payment_intent_client_secret"
//     // );

//     // const response = await fetch(formAction, {
//     //     method: "POST",
//     //     headers: { 
//     //         "Content-Type": "application/json", 
//     //         'X-CSRFToken': csrftoken
//     //     },
//     //     body: JSON.stringify({ pk: 1 }),
//     //   });

//     //   const responseData = await response.json();
//       const clientSecret = 'pi_3NnQ8qJ3ZTfk5u7C1T2anLGf_secret_jK8QJDLi7i7C6nRu6zJyTsL9L';
//       console.log(clientSecret)

//     if (!clientSecret) {
//         return;
//     }

//   const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

//   switch (paymentIntent.status) {
//     case "succeeded":
//       showMessage("Payment succeeded!");
//       break;
//     case "processing":
//       showMessage("Your payment is processing.");
//       break;
//     case "requires_payment_method":
//       showMessage("Your payment was not successful, please try again.");
//       break;
//     default:
//       showMessage("Something went wrong.");
//       break;
//   }
// }

// // ------- UI helpers -------

// function showMessage(messageText) {
//   const messageContainer = document.querySelector("#payment-message");

//   messageContainer.classList.remove("hidden");
//   messageContainer.textContent = messageText;

//   setTimeout(function () {
//     messageContainer.classList.add("hidden");
//     messageContainer.textContent = "";
//   }, 4000);
// }

// // Show a spinner on payment submission
// function setLoading(isLoading) {
//   if (isLoading) {
//     // Disable the button and show a spinner
//     document.querySelector("#submit").disabled = true;
//     document.querySelector("#spinner").classList.remove("hidden");
//     document.querySelector("#button-text").classList.add("hidden");
//   } else {
//     document.querySelector("#submit").disabled = false;
//     document.querySelector("#spinner").classList.add("hidden");
//     document.querySelector("#button-text").classList.remove("hidden");
//   }
// }



























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