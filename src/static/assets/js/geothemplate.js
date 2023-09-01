window.addEventListener('DOMContentLoaded', (event) => {

    /*
    1. Button beide formular Update und Crate anpassen
    2. PopUp vor dem Löschen
    3. Optik anpassen von list
    4. Fomular Härtung
    */

    // Update GEO Themplate
    $('#geothemplate-list').on('click', '.themplate-edit', function(){
        const geoID = $(this).attr('data-themplate-edit');

        const idThemplate = $('#id_themplate_name');
        const IDland = $('#id_land');
        const IDthemplateRegion = $('#id_themplate_region');
        const userValue = $("input[name='themplate_user']");

        $("#geothemplate-form-update").removeClass('d-none');
        $('#geothemplate-form-view').addClass('d-none')
        $.ajax({
            type: 'GET',
            url: `/geotargeting/detail/${geoID}/`,  // Stellen Sie sicher, die URL richtig anzupassen
            success: function(data) {
                // Hier können Sie die Daten in der 'data'-Variable verwenden
                idThemplate.val(data.template_name);
                IDland.val(data.land);
                IDthemplateRegion.val(data.template_region);
                userValue.val(data.template_user);
            }
        });
    });


    // Update Geo 
    $('#geothemplate-form-update').submit(function(event){
        event.preventDefault();
        console.log('Update')
        // Update
        // $.ajax({
        //     type: 'POST',
        //     url: `/geotargeting/update/${geoID}/`,  // Stellen Sie sicher, die URL richtig anzupassen
        //     data: $('#update-form').serialize(),
        //     success: function(response) {
        //         if (response.success) {
        //             alert('Template erfolgreich aktualisiert.');
        //         } else {
        //             alert('Fehler beim Aktualisieren des Templates.');
        //         }
        //     }
        // });

    });


    // Delate GEO Themplate class: themplate-delate
    $('#geothemplate-list').on('click', '.themplate-delate', function(event){
        event.preventDefault();
        const geoID = $(this).attr('data-themplate-delate');
        
    });

    // Ländersuche API
    $('#id_land').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();

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
            var list = $('#geothemplate-list');
            list.empty();
            data.forEach(function (item) {
                list.append('<li class="list-group-item list-geo d-flex justify-content-between align-items-center"> Name: ' + item.themplate_name + ' Land: ' + item.land + ' ' + ' Region: ' + item.themplate_region + '<div><i class="fa-solid fa-pencil themplate-edit p-3" data-themplate-edit="' + item.id + '"></i> <i class="fa-solid fa-trash themplate-delate p-3" data-themplate-delate="' + item.id + '"></i></div></li>');
            });
        }
    });

    // Hover list
    $(document).on("mouseenter", ".list-geo", function() {
        $(this).addClass("list-group-item-primary");
    }).on("mouseleave", ".list-geo", function() {
        $(this).removeClass("list-group-item-primary");
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
                        var list = $('#geothemplate-list');
                        list.empty();
                        data.forEach(function (item) {
                            list.append('<li class="list-group-item list-geo d-flex justify-content-between align-items-center list-group-item-action" data-themplate="' + item.id + '" > Themplate Name: ' + item.themplate_name + ' Land: ' + item.land + ' Region: ' + item.themplate_region + '</li>');
                        });

                        $('#geothemplate-form')[0].reset();
                    }
                });
            }
        });
    });

});