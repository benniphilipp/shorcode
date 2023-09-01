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

        /***************** Reste Fields nach dem Update oder Erstellen von Shorcode *****************/
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
    
        /***************** Open Sidebar for Crate Shorcode *****************/
        $("#openForm").on('click', function() {  //use a class, since your ID gets mangled
            $('#aside-form').addClass("toggle"); 
            $('#archive-btn').addClass('d-none');
            $('#update-form-shortcode').addClass('d-none');
            $('#openForm').addClass("disabled"); 
            $('#overlay-open').addClass("overlay-open"); 
    
            // limitation
            $('#pills-profile-tab').addClass('disabled')
            $('#limitation-form').hide();
    
            // iOS-Targeting & Android-Targeting
            $('#mobile-tab').addClass('disabled');
            $('#ios-targeting-from').hide();
            $('#android-targeting-form').hide();
    
            // Geo-Targeting
            $('#geo-targeting-tab').addClass('disabled');
            $('#geo-targeting-form').hide();
    
        });
    
        /***************** Close Sidebar *****************/
        $("#closeForm").click(function() {  //use a class, since your ID gets mangled
            $('#aside-form').removeClass("toggle"); 
            $('#archive-btn').removeClass('d-none');
            $('#update-form-shortcode').removeClass('d-none');
            $('#crate-form-shortcode').removeClass('d-none');
            $('#openForm').removeClass("disabled");
            $('#overlay-open').removeClass("overlay-open"); 
            $('#shortcode_id').html('');
    
            // limitation
            $('#pills-profile-tab').removeClass('disabled')
            $('#limitation-form').show();
    
            // iOS-Targeting & Android-Targeting
            $('#mobile-tab').removeClass('disabled');
            $('#ios-targeting-from').show();
            $('#android-targeting-form').show();
    
            // Geo-Targeting
            $('#geo-targeting-tab').removeClass('disabled');
            $('#geo-targeting-form').show();
    
            resteFields();
    
        });





    /*****************  Shortcode list View *****************/
    var currentPage = 1;  
    var totalShortcodes = 0; 

    function loadMore() {
        $.ajax({
            url: `/shortcode/json-list/?page=${currentPage}`,  
            data: { page: currentPage  }, 
            dataType: 'json',
            success: function(response) {

                var shortcodeList = $('#shortcode-list');
                var serialized_data = response.data;

                $('#gif-load').removeClass('d-none');
                setTimeout(function() {
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
                            <span class="short-chart" data-anaylyse="${ item.short_id }"><i class="fa-solid fa-chart-line orb-icon"></i> ${item.click_count} klicks </span>
                            <span class="short-tags"><i class="fa-solid fa-tag orb-icon"></i> ${item.tags.join(', ')} Tags</span>
                        </small>
                        `);
                        shortcodeList.append(shortcodeItem);
                    });

                    $('#gif-load').addClass('d-none');
                    $('#load-more-button').removeClass('d-none');
                    
                    // Shortcode Load more
                    if (totalShortcodes === 0) {
                        totalShortcodes = response.total_shortcodes;
                    }
    
                    if (serialized_data.length === 0 || response.page * response.per_page >= totalShortcodes) {
                        $('#load-more-button').hide();
                    } else {
                        $('#load-more-button').show();
                    }
        
                    currentPage += 1; 
                    start_index = response.start_index;
                }, 500);

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









    // Prüfung feld source code
    $('#id_url_source').on('blur', function () {
        var inputValue = $(this).val();
        var otherInputValue = $('#id_url_medium').val();

        if (inputValue && otherInputValue) {
            $('#crate-form-shortcode').removeClass('disabled');
        }
    });

    $('#id_url_medium').on('blur', function () {
        var inputValue = $('#id_url_source').val();
        var otherInputValue = $(this).val();

        if (inputValue && otherInputValue) {
            $('#crate-form-shortcode').removeClass('disabled');
        }
    });

    $('#id_url_source, #id_url_medium').on('input', function () {
        $('#crate-form-shortcode').addClass('disabled');
    });


    //destination https://stackoverflow.com/questions/60286543/how-to-check-if-a-url-is-valid-actually-loads-a-page-with-content-efficiently
    $("#id_url_destination").on("change", function () {

        var link = $('#id_url_destination').val();

        function UrlExists(url, cb){
            jQuery.ajax({
                url:      url,
                dataType: 'text',
                type:     'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                complete:  function(xhr){
                    if(typeof cb === 'function')
                        cb.apply(this, [xhr.status]);
                }
            });
        }

        UrlExists(link, function(status){
            if(status === 200){
                // file was found
                setTimeout(()=>{
                    $("#id_url_destination").after('<div class="text-success">Deine Website ist erreichbar!</div>');
                }, 300);
            }
            else if(status === 404){
                // 404 not found
                setTimeout(()=>{
                    $("#id_url_destination").after('<div class="text-danger">Deine Website ist erreichbar!</div>');
                }, 300);
            }
        });
    });


    //Copy Button color
    $('#shortcode-list').on("click", '.btn-copy', function(event){
        event.preventDefault();

        var buttonId = $(this).attr('data-button');

        let that = document.getElementById(buttonId);
        navigator.clipboard.writeText(that?.innerText).then(res => {});

        $('.color' + buttonId).addClass('bg-success text-white');
        setTimeout(()=>{
            $('.color' + buttonId).removeClass('bg-success text-white');
                // onClick copy to clipboard
                console.clear()
        }, 2000);

    })

    $('#aside-form').on("click", '.btn-copy', function(event){
        event.preventDefault();

        var buttonId = $(this).attr('data-button');

        let that = document.getElementById(buttonId);
        navigator.clipboard.writeText(that?.innerText).then(res => {});

        $('.color' + buttonId).addClass('bg-success text-white');
        setTimeout(()=>{
            $('.color' + buttonId).removeClass('bg-success text-white');
                // onClick copy to clipboard
                console.clear()
        }, 2000);

    })

    // Löst das holen von Favicon aus
    $("#crate-form-shortcode").click(function() {
        var url = $("#id_url_destination").val();
        var titel = $("#id_url_titel").val();
        if(url && titel){
            $.ajax({
                url: '/shortcode/get_favicon/?url=' + encodeURIComponent(url),
                success: function(data) {
                    if (data.favicon_url) {
                        $("#result").html(`<img src="${data.favicon_url}" alt="Favicon">`);
                    } else {
                        $("#result").html("Favicon not found");
                    }
                },
                error: function() {
                    $("#result").html("Error fetching favicon.");
                }
            });
        }
    });


}); // End document ready function