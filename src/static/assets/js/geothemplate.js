window.addEventListener('DOMContentLoaded', (event) => {

    //Alert
    function clearContent() {
        setTimeout(function() {
            $('#toast-alert').html('');
        }, 1000);
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


    // CSRF token
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


    // Update GEO Themplate Form View
    $('#geothemplate-list').on('click', '.themplate-edit', function(){
        const geoID = $(this).attr('data-themplate-edit');

        const idThemplate = $('#id_themplate_name');
        const IDland = $('#id_land');
        const IDthemplateRegion = $('#id_themplate_region');
        const userValue = $("input[name='themplate_user']");
        const iDgeonameId = $('#geo-id');


        // Open Siedabar
        $('#aside-form').addClass("toggle"); 
        $('#overlay-open').addClass("overlay-open"); 


        $("#geothemplate-form-update").removeClass('d-none');
        $('#geothemplate-form-view').addClass('d-none');


        $.ajax({
            type: 'GET',
            url: `/geotargeting/detail/${geoID}/`,  // Stellen Sie sicher, die URL richtig anzupassen
            success: function(data) {
                // Hier können Sie die Daten in der 'data'-Variable verwenden
                idThemplate.val(data.template_name);
                IDland.val(data.land);
                IDthemplateRegion.val(data.template_region);
                userValue.val(data.template_user);
                iDgeonameId.val(data.id);
            }
        });
    });




    // Update Geo Form send
    $('#geothemplate-form-update').click(function(event){
        event.preventDefault();

        const geoID = $('#geo-id').val();

        // Update
        
        $.ajax({
            type: 'POST',
            url: `/geotargeting/update/${geoID}/`,  // Stellen Sie sicher, die URL richtig anzupassen
            data: $('#geothemplate-form').serialize(),
            headers: {
                'X-CSRFToken': csrftoken  // CSRF-Token als Header übergeben
            },
            success: function(response) {
                if (response.success) {

                    ls_toast(response.message);

                    //Load Data
                    $.ajax({
                        url: '/geotargeting/list/',
                        dataType: 'json',
                        success: function (data) {

                            $('#gif-load').removeClass('d-none');

                            setTimeout(function() {
                                var list = $('#geothemplate-list');
                                list.empty();
                                data.forEach(function (item) {
                                    list.append('<li class="list-group-item list-geo d-flex justify-content-start align-items-center"> <i style="margin-right:5px;" class="fa-solid fa-file"></i> <span class="mr-3 name_geo' + item.id + '">' + item.themplate_name + '</span>&ensp;<i style="margin-right:5px;" class="fa-solid fa-earth-europe"></i> ' + item.land + '</span>&nbsp;<i style="margin-right:5px;" class="fa-solid fa-map"></i> ' + item.themplate_region + '<div class="ms-auto"><i class="fa-solid fa-pencil themplate-edit p-3" data-themplate-edit="' + item.id + '"></i> <i class="fa-solid fa-trash themplate-delate p-3" data-themplate-delate="' + item.id + '"></i></div></li>');
                                });
                                $('#gif-load').addClass('d-none');
                            }, 500);
    
                            $('#geothemplate-form')[0].reset();
                        }
                    });

                    //Close
                    $('#aside-form').removeClass("toggle");
                    $('#overlay-open').removeClass("overlay-open");  

                } else {
                    //alert('Fehler beim Aktualisieren des Templates.');
                }
            },
            error: function(error) {
                console.log("Fehler:", error);
            },
        });

    });


    // Delete View GEO Themplate
    $('#geothemplate-list').on('click', '.themplate-delate', function(event){
        event.preventDefault();
        const geoID = $(this).attr('data-themplate-delate');
        const name_geo = $('.name_geo'+geoID).text();

        console.log(name_geo)

        // Open Siedabar
        $('#aside-form').addClass("toggle"); 
        $('#overlay-open').addClass("overlay-open"); 

        $('#geothemplate-form').addClass("d-none"); 
        $('#geothemplate-form-delete').removeClass("d-none"); 
        $('#id_geonameId_delate').val(geoID);
        $('.titel').html(name_geo);
        
    });

    // Delete GEO Themplate
    $('#geothemplate-form-delete').click(function(event){
        event.preventDefault();
        
        const geoID = $('#id_geonameId_delate').val();
        ls_toast('Template erfolgreich gelöscht.');

        $.ajax({
            type: 'POST',
            url: `/geotargeting/delete/${geoID}/`,  // Stellen Sie sicher, die URL richtig anzupassen
            headers: {
                'X-CSRFToken': csrftoken  // CSRF-Token als Header übergeben
            },
            success: function(response) {
                if (response.success) {

                    $.ajax({
                        url: '/geotargeting/list/',
                        dataType: 'json',
                        success: function (data) {
    
                            ls_toast('Das Formular wurde erfolgreich gesendet.');

                            $('#geothemplate-form').removeClass("d-none"); 
                            $('#geothemplate-form-delete').addClass("d-none"); 
    
                            $('#aside-form').removeClass("toggle");
                            $('#overlay-open').removeClass("overlay-open");
    
                            $('#gif-load').removeClass('d-none');

                            var list = $('#geothemplate-list');
                            list.empty();
                            setTimeout(function() {
                                data.forEach(function (item) {
                                    list.append('<li class="list-group-item list-geo d-flex justify-content-start align-items-center"> Name: <span class="mr-3 name_geo' + item.id + '">' + item.themplate_name + '</span>&ensp;Land: ' + item.land + '</span>&nbsp;Region: ' + item.themplate_region + '<div class="ms-auto"><i class="fa-solid fa-pencil themplate-edit p-3" data-themplate-edit="' + item.id + '"></i> <i class="fa-solid fa-trash themplate-delate p-3" data-themplate-delate="' + item.id + '"></i></div></li>');
                                });
                                $('#gif-load').addClass('d-none');
                            }, 500);
    
                            $('#geothemplate-form')[0].reset();
                        }
                    });

                } else {
                    // alert('Fehler beim Löschen des Templates.');
                }
            }
        });

    });



    // Ländersuche API
    $('#id_land').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();
        $('#countryList').removeClass('d-none');
        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            $.ajax({
                url: '/geotargeting/country_name/',
                type: 'GET',
                dataType: 'json',
                success: function(data) {

                    var filteredCountries = data.filter(function(country) {
                        return country.countryName.toLowerCase().includes(searchTerm);
                    });

                    var countryList = $('#countryList');
                    countryList.empty();

                    filteredCountries.forEach(function(country) {
                        var listItem = $('<li>').text(country.countryName);
                        listItem.on('click', function() {
                            $('#id_land').val(country.countryName);
                            $('#id_geonameId').val(country.geonameId);
                            $('#countryList').addClass('d-none');
                            countryList.empty();
                        });
                        countryList.append(listItem);
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Fehler beim Abrufen der Länderdaten:', error);
                }
            });
        }
    });

    // Region API
    $('#id_themplate_region').on('input', function() {
        var selectedCountry = $(this).val();
        var geonameId = $('#id_geonameId').val(); // Die geonameId aus dem Feld #id_geonameId
        $('#regionList').removeClass('d-none');
        console.log(selectedCountry);
        console.log(geonameId);

        if (selectedCountry && geonameId) {
            $.ajax({
                url: '/geotargeting/region_name/' + geonameId + '/',  // Passe den Pfad an, um die geonameId zu übergeben
                type: 'GET',
                dataType: 'json',
                success: function(data) {

                    var regionList = $('#regionList');
                    regionList.empty();
    
                    data.forEach(function(region) {
                        var listItem = $('<li>').text(region.toponymName);
                        regionList.append(listItem);
                    });

                    $('#regionList').on('click', 'li', function() {
                        var selectedRegion = $(this).text();
                        $('#id_themplate_region').val(selectedRegion);
                        $('#regionList').empty(); // Leere die Liste der Regionen
                        $('#regionList').addClass('d-none');
                    });

                },
                error: function(xhr, status, error) {
                    console.error('Fehler beim Abrufen der Regionen:', error);
                }
            });
        }
    });

    
    //List View Geo
    $.ajax({
        url: '/geotargeting/list/',
        dataType: 'json',
        success: function (data) {

            $('#gif-load').removeClass('d-none');

            setTimeout(function() {
                var list = $('#geothemplate-list');
                list.empty();
                data.forEach(function (item) {
                    list.append('<li class="list-group-item list-geo d-flex justify-content-start align-items-center"> <i style="margin-right:5px;" class="fa-solid fa-file"></i> <span class="mr-3 name_geo' + item.id + '">' + item.themplate_name + '</span>&ensp;<i style="margin-right:5px;" class="fa-solid fa-earth-europe"></i> ' + item.land + '</span>&nbsp;<i style="margin-right:5px;" class="fa-solid fa-map"></i> ' + item.themplate_region + '<div class="ms-auto"><i class="fa-solid fa-pencil themplate-edit p-3" data-themplate-edit="' + item.id + '"></i> <i class="fa-solid fa-trash themplate-delate p-3" data-themplate-delate="' + item.id + '"></i></div></li>');
                });
                $('#gif-load').addClass('d-none');
            }, 500);

        }
    });


    // Create View
    $('#geothemplate-form').submit(function (event) {
        event.preventDefault();
        
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function () {
                // Aktualisiere die Liste der Objekte
                $.ajax({
                    url: '/geotargeting/list/',
                    dataType: 'json',
                    success: function (data) {

                        ls_toast('Das Formular wurde erfolgreich gesendet.');

                        $('#aside-form').removeClass("toggle");
                        $('#overlay-open').removeClass("overlay-open");

                        $('#gif-load').removeClass('d-none');

                        setTimeout(function() {
                            var list = $('#geothemplate-list');
                            list.empty();
                            data.forEach(function (item) {
                                list.append('<li class="list-group-item list-geo d-flex justify-content-start align-items-center"> <i style="margin-right:5px;" class="fa-solid fa-file"></i> <span class="mr-3 name_geo' + item.id + '">' + item.themplate_name + '</span>&ensp;<i style="margin-right:5px;" class="fa-solid fa-earth-europe"></i> ' + item.land + '</span>&nbsp;<i style="margin-right:5px;" class="fa-solid fa-map"></i> ' + item.themplate_region + '<div class="ms-auto"><i class="fa-solid fa-pencil themplate-edit p-3" data-themplate-edit="' + item.id + '"></i> <i class="fa-solid fa-trash themplate-delate p-3" data-themplate-delate="' + item.id + '"></i></div></li>');
                            });
                            $('#gif-load').addClass('d-none');
                        }, 500);

                        $('#geothemplate-form')[0].reset();
                    }
                });
            }
        });
    });

    
    /***************** Open Sidebar *****************/
    $("#openForm").on('click', function() {  //use a class, since your ID gets mangled
        console.log('run open');
        $('#aside-form').addClass("toggle"); 
        $('#overlay-open').addClass("overlay-open"); 

        $('#id_template_name').css({
            'border-color': '#dc3545',
        });

        $('#id_template_name').on('change', function() {
            $('#id_template_name').css({
                'border-color': '',
            });
        });

    });


    /***************** Close Sidebar *****************/
    $("#closeForm").click(function() {  //use a class, since your ID gets mangled
        $('#aside-form').removeClass("toggle");
        $('#overlay-open').removeClass("overlay-open");  

        $('#geothemplate-form').removeClass("d-none"); 
        $('#geothemplate-form-delete').addClass("d-none"); 

        $('#geothemplate-form')[0].reset();
    });
    

});