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

    //Reste Fields
    function resteFields(){
        //Reset fields
        $('#id_url_destination').val('')
        $('#id_url_titel').val('')
        $('#id_url_medium').val('')
        $('#id_url_source').val('')
        $('#id_url_term').val('')
        $('#id_url_titel').val('')
        $('#id_url_campaign').val('')
        $('#id_url_content').val('')
        $('#id_shortcode').val('')

        const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
        tagsCheckboxes.each(function(index, checkbox) {
            const tagValue = parseInt($(checkbox).val());

            $(checkbox).prop('checked', '');
        });
    }

    // Open Sidebar
    $("#openForm").on('click', function() {  //use a class, since your ID gets mangled
        $('#aside-form').addClass("toggle"); 
        $('#archive-btn').addClass('d-none');
        $('#update-form-shortcode').addClass('d-none');
        $('#openForm').addClass("disabled"); 
        $('#overlay-open').addClass("overlay-open"); 
    });

    // Close Sidebar
    $("#closeForm").click(function() {  //use a class, since your ID gets mangled
        $('#aside-form').removeClass("toggle", 1500); 
        $('#archive-btn').removeClass('d-none');
        $('#update-form-shortcode').removeClass('d-none');
        $('#crate-form-shortcode').removeClass('d-none');
        $('#openForm').removeClass("disabled");
        $('#overlay-open').removeClass("overlay-open"); 
        $('#shortcode_id').html('');
        resteFields();
    });
    
    //Variabeln     
    // const url_destination = document.getElementById('id_url_destination');
    // const url_titel = document.getElementById('id_url_titel');
    // const url_medium = document.getElementById('id_url_medium');
    // const url_source = document.getElementById('id_url_source');
    // const url_term = document.getElementById('id_url_term');
    // const url_content = document.getElementById('id_url_content');
    // const url_campaign = document.getElementById('id_url_campaign');
    // const csrf = document.getElementsByName('csrfmiddlewaretoken');
    // const url_creator = document.getElementById('url_creator');
    // const idShort = document.getElementById('id_shortcode');
    




    //Form disabled
    function disabledTextInput(){
        $('.disabled-func').each(function() {
            $(this).find('input[type=text]').attr('disabled', 'disabled');
        });
    }


    //Overlay ready
    function overlayReady(){
        $('#overlay').addClass('overlay-active');
        var dataImage = jQuery('#overlay').attr('data-image');
        $('#overlay').html("<div class=\"overlay-body\"><img src='"+dataImage+"' width=\"60\" height=\"60\"><span>Warten...</span></div>")
    }


    //Archive function
    // $('#archive-btn').on('click', function(event){
    //     event.preventDefault();

    //     var dataArchive = jQuery(this).attr('data-archive');

    //     //form fuc disabled
    //     disabledTextInput();

    //     //Overlay
    //     overlayReady();
        
    //     $.ajax({
    //         type: 'POST',
    //         url: "/shortcode/update/archive/", //shortcode
    //         data: {
    //             'csrfmiddlewaretoken': csrftoken,
    //             'pk': dataArchive,
    //         },
    //         success: function(response){
    //             console.log(response);
    //             setTimeout(()=>{
    //                 window.location.reload();
    //                 $('#overlay').removeClass('overlay-active');
    //                 $('#overlay-open').removeClass("overlay-open"); 
    //             }, 1000);
    //         },
    //         error: function(error){
    //             console.log(error)
    //         },
    //     })

    // })


    // $('#update-form-shortcode').on('click', function(event){
    //     event.preventDefault();

    //     var idShortcode = $('#update-shortcode-url').val();
    //     const url_update = url_view_update + '/shortcode/update/' + idShortcode + '/';
    //     $('#archive-btn').attr('data-archive', idShortcode);
    //     //const tags = formData.filter(item => item.name === 'tags')[0].value.split(',');

    //     // console.log(url_update);

    //     const fd = new FormData();
    //     fd.append('csrfmiddlewaretoken', csrf[0].value)
    //     fd.append('url_destination', url_destination.value);
    //     fd.append('url_titel', url_titel.value);
    //     fd.append('url_source', url_source.value);
    //     fd.append('url_medium', url_medium.value);
    //     fd.append('url_term', url_term.value);
    //     fd.append('url_campaign', url_campaign.value);
    //     fd.append('url_creator', url_creator.value);
    //     fd.append('url_content', url_content.value);
    //     fd.append('shortcode_id', idShort.value);


    //     const selectedTags = [];
    //     $('input[name="tags"]input[type="checkbox"]:checked').each(function() {
    //         selectedTags.push($(this).val());

    //     });
    //     fd.append('tags', selectedTags.join(','));

    //     $.ajax({
    //         type: 'POST',
    //         url: url_update,
    //         data: fd,
    //         enctype: 'multipart/form-data',
    //         success: function(response){

    //             //form fuc disabled
    //             disabledTextInput();

    //             //Overlay
    //             overlayReady();

    //             resteFields()

    //             // //Alert
    //             alert(response.success, 'success')
    //             setTimeout(function(){$('.alert').alert('close')}, 3000)
    //             $('#overlay-open').removeClass("overlay-open"); 

    //             setTimeout(()=>{
    //                 window.location.reload();
    //                 $('#overlay').removeClass('overlay-active');
    //             }, 2000);

    //         },
    //         error: function(error){
    //             console.log(error);
    //         },
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //     })
    // })


    //Alert Banner
    // const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    // const alert = (message, type) => {
    // const wrapper = document.createElement('div')
    // wrapper.innerHTML = [
    //     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    //     `   <div>${message}</div>`,
    //     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    //     '</div>'
    // ].join('')

    // alertPlaceholder.append(wrapper)
    // }

    // Crate functions Shortcode
    $("#crate-form-shortcode").on("click", function(event) {
        event.preventDefault();

        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append('url_destination', url_destination.value);
        fd.append('url_titel', url_titel.value);
        fd.append('url_source', url_source.value);
        fd.append('url_medium', url_medium.value);
        fd.append('url_term', url_term.value);
        fd.append('url_campaign', url_campaign.value);
        fd.append('url_creator', url_creator.value);
        fd.append('url_content', url_content.value);

        $.ajax({
            type: 'POST',
            url: $("input[name=data]").val(),
            data: fd,
            enctype: 'multipart/form-data',
            success: function(response){


                //Alert
                if(response.success == 'Dein link wurde erfolgreich erstellt'){

                    //form fuc disabled
                    disabledTextInput();

                    //Overlay
                    overlayReady();

                    resteFields();
                    
                    alert(response.success, 'success')

                        //Close Sidebar
                        setTimeout(()=>{
                            location.reload();
                            $('#overlay').removeClass('overlay-active');
                        }, 2000);

                }else{
                    
                    if(response.danger_titel == 'Dieses Feld ist zwingend erforderlich.'){
                        console.log(response.danger_titel);
                        alert(response.danger_titel, 'danger');
                        $('#id_url_destination').addClass('is-invalid')

                    }else if(response.danger_titel == 'Dieses Feld ist zwingend erforderlich.'){

                        alert(response.danger_titel, 'danger');   
                        $('#id_url_titel').addClass('is-invalid')

                    }

                }
            
                setTimeout(function(){$('.alert').alert('close')}, 3000)


            },
            error: function(error){
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
        })

    });


    // Prüfung feld source code
    // $('#id_url_source').on('blur', function () {
    //     var inputValue = $(this).val();
    //     var otherInputValue = $('#id_url_medium').val();

    //     if (inputValue && otherInputValue) {
    //         // Beide Felder sind ausgefüllt, entferne die Klasse
    //         $('#crate-form-shortcode').removeClass('disabled');
    //     }
    // });

    // $('#id_url_medium').on('blur', function () {
    //     var inputValue = $('#id_url_source').val();
    //     var otherInputValue = $(this).val();

    //     if (inputValue && otherInputValue) {
    //         // Beide Felder sind ausgefüllt, entferne die Klasse
    //         $('#crate-form-shortcode').removeClass('disabled');
    //     }
    // });

    // $('#id_url_source, #id_url_medium').on('input', function () {
    //     // Füge die Klasse hinzu, wenn eines der Felder geändert wird
    //     $('#crate-form-shortcode').addClass('disabled');
    // });




    //destination https://stackoverflow.com/questions/60286543/how-to-check-if-a-url-is-valid-actually-loads-a-page-with-content-efficiently
    // $("#id_url_destination").on("change", function () {

    //     var link = $('#id_url_destination').val();

    //     function UrlExists(url, cb){
    //         jQuery.ajax({
    //             url:      url,
    //             dataType: 'text',
    //             type:     'GET',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             },
    //             complete:  function(xhr){
    //                 if(typeof cb === 'function')
    //                    cb.apply(this, [xhr.status]);
    //             }
    //         });
    //     }

    //     UrlExists(link, function(status){
    //         if(status === 200){
    //            // file was found
    //            console.log( "status code 200 returned");
    //            $("#id_url_destination").after('<div class="text-success">Deine Website ist erreichbar!</div>');
    //         }
    //         else if(status === 404){
    //            // 404 not found
    //            console.log( "status code 404 returned");
    //            $("#id_url_destination").after('<div class="text-danger">Deine Website ist erreichbar!</div>');
    //         }
    //     });

    // });






    function fetchClickDataAndUpdateChart(chart, shortcode) {
        $.ajax({
            url: `/analytics/shortcode/${shortcode}/click_data/`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var chartData = data.map(function (entry) {
                    return {
                        x: moment.utc(entry.click_date).local(),
                        y: entry.click_count
                    };
                });
    
                chart.data.datasets[0].data = chartData;
                chart.update();
            }
        });
    }
    
    var myChart;

    const url_view_update = window.location.origin;
    const updateShortcodeUrl = document.getElementById('update-shortcode-url');
    const shortcode_id = document.getElementById('shortcode_id');

    // Shortcode Singel Edit View
    $('#shortcode-list').on('click', '.shortcode-class', function() {

        var idShortcode = jQuery(this).attr('data-shortcode');
        const url_view = url_view_update + '/shortcode/update/' + idShortcode + '/view/'
        $('#archive-btn').attr('data-archive', idShortcode);
        $('#overlay-open').addClass("overlay-open"); 

        $.ajax({
            type: 'GET',
            url: url_view,
            success: function(response){
                const data = response.data

                $('#aside-form').addClass('toggle');
                $('#crate-form-shortcode').addClass('d-none');
                $('#openForm').addClass("disabled"); 
                updateShortcodeUrl.value = data.id;
                url_destination.value = data.url_destination;
                url_titel.value = data.url_titel;
                url_medium.value = data.url_medium;
                url_source.value = data.url_source;
                url_term.value = data.url_term;
                url_content.value = data.url_content;
                url_campaign.value = data.url_campaign;
                idShort.value = data.shortcode;

                $(shortcode_id).html(data.get_short_url);  

                // Tags-Felder auswählen
                const tagsCheckboxes = $('input[name="tags"][type="checkbox"]');
                console.log(tagsCheckboxes)
                tagsCheckboxes.each(function(index, checkbox) {
                    const tagValue = parseInt($(checkbox).val());
                    const tagIsSelected = data.tags.includes(tagValue);
                    $(checkbox).prop('checked', tagIsSelected);
                });

                tagsCheckboxes.trigger('change');

            },
            error: function(error){
                console.log(error + 'erro');
            },
        });

        // Shortcode Chart Clicks
        if (myChart) {
            myChart.destroy();
        }

        var shortcode = jQuery(this).attr('data-shortname');
        //console.log(shortcode);
        var ctx = document.getElementById('myChartClick').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Clicks over Time',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        adapters: {
                            date: moment,
                        },
                        parser: 'iso',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        fetchClickDataAndUpdateChart(myChart, shortcode); 

    });



function fetchClickDataAndUpdateChart(chart, shortcode) {
    $.ajax({
        url: `/analytics/shortcode/${shortcode}/click_data/`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var chartData = data.map(function (entry) {
                return {
                    x: moment.utc(entry.click_date).local(),
                    y: entry.click_count
                };
            });

            chart.data.datasets[0].data = chartData;
            chart.update();
        }
    });
}

var myChart;

$('.shortcode-class').on('click', function() {
    var shortcode = jQuery(this).attr('data-shortname'); // Hier den Shortcode setzen

    if (myChart) {
        myChart.destroy();
    }

    console.log(shortcode);
    var ctx = document.getElementById('myChartClick').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Clicks over Time',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    adapters: {
                        date: moment,
                    },
                    parser: 'iso',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    fetchClickDataAndUpdateChart(myChart, shortcode); 
});





    var currentPage = 1;  // Startseite
    var totalShortcodes = 0;  // Gesamtanzahl der Shortcodes

    function loadMore() {
        $.ajax({
            url: `/shortcode/json-list/?page=${currentPage}`,  // Die URL zur JSON ListView
            data: { page: currentPage  },  // Aktualisiere den 'page'-Parameter
            dataType: 'json',
            success: function(response) {

                var shortcodeList = $('#shortcode-list');
                var serialized_data = response.data;

                serialized_data.forEach(function(item) {

                    var shortUrl = item.get_short_url;
                    if (shortUrl.length > 90) {
                        shortUrl = shortUrl.substring(0, 90) + '...';
                    }

                    var shortDestination = item.url_destination;
                    if (shortDestination.length > 90) {
                        shortDestination = shortDestination.substring(0, 90) + '...';
                    }

                    // shortcodeList hinzufügen
                    var shortcodeItem = $('<div class="card p-3 my-3 border border-0">');
                    shortcodeItem.append(`<div class="card-header header-elements"> <form id="shortcode-form"><input type="checkbox" name="selected_shortcodes" value="shortcode_id_${item.short_id}"></form> <img src="${item.favicon_path? `${item.favicon_path}`: `${faviconPath}`}" class="img-thumbnail favicon-img" alt="favicon.ico"> <h5 class="card-title">${item.url_titel}</h5><div class="card-header-elements ms-auto"> <span class="d-none" id="short${ item.short_id }">${item.get_short_url}</span> <button data-button="short${ item.short_id }" type="button" class="btn btn-secondary btn-copy colorshort${ item.short_id } btn-sm"><i class="fa-regular fa-copy"></i> Kopieren</button> <a data-shortcode="${item.short_id}" data-shortname="${item.shortcode}" class="shortcode-class short-name btn btn-xs btn-primary btn-sm"><i class="fa-solid fa-pencil"></i> Bearbeiten</a>`);
                    shortcodeItem.append(`<div class="card-body"><a href="${item.get_short_url}">${shortUrl}</a><br><a class="text-muted" href="${item.url_destination}">${shortDestination}</a>`);
                    shortcodeItem.append(`<div class="card-footer">
                    <small class="text-muted short-links-footer">
                        <span class="short-calendar"><i class="fa-regular fa-calendar orb-icon"></i> ${item.url_create_date} </span>
                        <span class="short-chart"><i class="fa-solid fa-chart-line orb-icon"></i> ${item.click_count} klicks </span>
                        <span class="short-tags"><i class="fa-solid fa-tag orb-icon"></i> ${item.tags.join(', ')} Tags</span>
                    </small>
                    `);
                    shortcodeList.append(shortcodeItem);
                });

                if (totalShortcodes === 0) {
                    totalShortcodes = response.total_shortcodes;
                }
                
                // if (serialized_data.length === 0 || response.page * response.per_page >= totalShortcodes) {
                //     $('#load-more-button').hide();
                // } else {
                //     $('#load-more-button').show();
                // }
    
                currentPage += 1;  // Aktualisiere die aktuelle Seite
                start_index = response.start_index;

            },
            error: function(xhr, status, error) {
                console.error(error);
                console.log(url)
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    }

    loadMore();

    $('#load-more-button').on('click', loadMore);


    // onClick copy to clipboard
    // console.clear()

    // //Copy Button color
    // $('#shortcode-list').on("click", '.btn-copy', function(event){
    //     event.preventDefault();

    //     var buttonId = $(this).attr('data-button');

    //     let that = document.getElementById(buttonId);
    //     navigator.clipboard.writeText(that?.innerText).then(res => {});
     
    //     $('.color' + buttonId).addClass('bg-success text-white');
    //     setTimeout(()=>{
    //         $('.color' + buttonId).removeClass('bg-success text-white');
    //     }, 2000);

    // })




    // $("#crate-form-shortcode").click(function() {
    //     var url = $("#id_url_destination").val();
    //     console.log(url);
    //     $.ajax({
    //         url: '/shortcode/get_favicon/?url=' + encodeURIComponent(url),
    //         success: function(data) {
    //             if (data.favicon_url) {
    //                 $("#result").html(`<img src="${data.favicon_url}" alt="Favicon">`);
    //             } else {
    //                 $("#result").html("Favicon not found");
    //             }
    //         },
    //         error: function() {
    //             $("#result").html("Error fetching favicon.");
    //         }
    //     });
    // });


    //Export
    // function exportSelectedShortcodes(csrfToken) {
    //     var selectedShortcodes = [];  // Hier die ausgewählten Shortcodes hinzufügen
        
    //     // Annahme: selectedShortcodes ist ein Array von IDs der ausgewählten Shortcodes
    //     $('input[name="selected_shortcodes"]:checked').each(function() {
    //         selectedShortcodes.push($(this).val());
    //     });
    //     console.log(selectedShortcodes)
    //     if (selectedShortcodes.length === 0) {
    //         alert('Bitte wählen Sie mindestens einen Shortcode aus.');
    //         return;
    //     }
    
    //     $.ajax({
    //         url: '/shortcode/ajax/export-shortcodes/',
    //         method: 'POST',
    //         data: { 
    //             'selected_ids[]': selectedShortcodes,
    //             csrfmiddlewaretoken: csrfToken
    //         },
    //         success: function(response) {
    //             var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //             var link = document.createElement('a');
    //             link.href = window.URL.createObjectURL(blob);
    //             link.download = 'shortcodes.xlsx';
    //             link.click();
    //         },
    //         error: function(xhr, status, error) {
    //             console.error(error);
    //         }
    //     });
    // }

    // // Export Button
    // $('#export-button').on('click', function() {
    //     var csrfToken = $('input[name=csrfmiddlewaretoken]').val();
    //     exportSelectedShortcodes(csrfToken);
    // });



    //Search
    // $('#filter-search-form').on('change', function(event) {
    //     event.preventDefault();

    //     $('#reset-filter-btn').removeClass('d-none')
    //     var shortcodeList = $('#shortcode-list');
    //     var selectedTag = $('#tag-filter').val();

    //     const searchQuery = $('#search-input').val();
    //     $.ajax({
    //         type: 'GET',
    //         url: '/shortcode/serach/',  // Passe die URL an
    //         data: {
    //             tags: [selectedTag],
    //             q: searchQuery
    //         },
    //         success: function(response) {
    //             const shortcodes = response.shortcodes;
    //             // Verarbeite die Shortcodes-Daten und aktualisiere die Anzeige

    //             $('#shortcode-list').empty();

    //             shortcodes.forEach(function(item) {
    //                 console.log(item)
    //                 var shortUrl = item.get_short_url;
    //                 if (shortUrl.length > 90) {
    //                     shortUrl = shortUrl.substring(0, 90) + '...';
    //                 }

    //                 var shortDestination = item.url_destination;
    //                 if (shortDestination.length > 90) {
    //                     shortDestination = shortDestination.substring(0, 90) + '...';
    //                 }

    //                 // shortcodeList hinzufügen
    //                 var shortcodeItem = $('<div class="card p-3 my-3 border border-0">');
    //                 shortcodeItem.append(`<div class="card-header header-elements"> <form id="shortcode-form"><input type="checkbox" name="selected_shortcodes" value="shortcode_id_${item.short_id}"></form> <img src="${item.favicon_path? `${item.favicon_path}`: `${faviconPath}`}" class="img-thumbnail favicon-img" alt="favicon.ico"> <h5 class="card-title">${item.url_titel}</h5><div class="card-header-elements ms-auto"> <span class="d-none" id="short${ item.short_id }">${item.get_short_url}</span> <button data-button="short${ item.short_id }" type="button" class="btn btn-secondary btn-copy colorshort${ item.short_id } btn-sm"><i class="fa-regular fa-copy"></i> Kopieren</button> <a data-shortcode="${item.short_id}" data-shortname="${item.shortcode}" class="shortcode-class short-name btn btn-xs btn-primary btn-sm"><i class="fa-solid fa-pencil"></i> Bearbeiten</a>`);
    //                 shortcodeItem.append(`<div class="card-body"><a href="${item.get_short_url}">${shortUrl}</a><br><a class="text-muted" href="${item.url_destination}">${shortDestination}</a>`);
    //                 shortcodeItem.append(`<div class="card-footer">
    //                 <small class="text-muted short-links-footer">
    //                     <span class="short-calendar"><i class="fa-regular fa-calendar orb-icon"></i> ${item.url_create_date} </span>
    //                     <span class="short-chart"><i class="fa-solid fa-chart-line orb-icon"></i> ${item.click_count} klicks </span>
    //                     <span class="short-tags"><i class="fa-solid fa-tag orb-icon"></i> Kein Tags</span>
    //                 </small>
    //                 `);
    //                 shortcodeList.append(shortcodeItem);
    //             });


    //             // console.log(shortcodes);
    //         },
    //         error: function(error) {
    //             console.log(error);
    //         }
    //     });
    // });



    // Tags View for filter
    // function loadTags() {
    //     $.ajax({
    //         type: 'GET',
    //         url: '/shortcode/tags/',  // Passe die URL an
    //         success: function(response) {
    //             const tags = response.tags;

    //             // Verarbeite die Tags und aktualisiere den Filter
    //             const tagFilter = $('#tag-filter');
    //             tagFilter.empty();
    //             tags.forEach(function(tag) {
    //                 const option = $('<option>').text(tag).val(tag);
    //                 tagFilter.append(option);
    //             });

    //         },
    //         error: function(error) {
    //             console.log(error);
    //         }
    //     });
    // }
    
    // // Rufe die Tags beim Laden der Seite auf
    // loadTags();


    //Filter Reste
    // $('#reset-filter-btn').on('click', function(event) {

    //     $('#tag-filter').val([]); // Dies setzt die Auswahl der Tags zurück
    //     $('#shortcode-list').empty();
    //     $('#reset-filter-btn').addClass('d-none')

    //     loadMore();
    // });


});


