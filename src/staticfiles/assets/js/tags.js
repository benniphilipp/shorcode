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




    /***************** Tags *****************/


    // Freiesuche für Shorcode
    $('#filter-search-form').on('change', function(event) {
        event.preventDefault();

        var shortcodeList = $('#shortcode-list');
        $('#reset-filter-btn').removeClass('d-none')
        const selectedTag = $('#tag-filter').val();
        const searchQuery = $('#search-input').val();

        const tagsArray = selectedTag ? [selectedTag] : [];
        $.ajax({
            type: 'GET',
            url: '/shortcode/serach/',  // Passe die URL an
            data: {
                tags: tagsArray,
                q: searchQuery
            },
            success: function(response) {
                const shortcodes = response.shortcodes;
                // Verarbeite die Shortcodes-Daten und aktualisiere die Anzeige

                $('#shortcode-list').empty();

                shortcodes.forEach(function(item) {
         
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
                        <span class="short-tags"><i class="fa-solid fa-tag orb-icon"></i> Kein Tags</span>
                    </small>
                    `);
                    shortcodeList.append(shortcodeItem);
                });


                // console.log(shortcodes);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });


    function loadTags() {
        $.ajax({
            type: 'GET',
            url: '/shortcode/tags/',  // Passe die URL an
            success: function(response) {
                const tags = response.tags;

                // Verarbeite die Tags und aktualisiere den Filter
                const tagFilter = $('#tag-filter');

                const emptyOption = $('<option>').text('').val('');
                tagFilter.empty().append(emptyOption);

                tags.forEach(function(tag) {
                    const option = $('<option>').text(tag).val(tag);
                    tagFilter.append(option);
                });

            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    
    // Rufe die Tags beim Laden der Seite auf
    loadTags();

    //Filter Reste
    $('#reset-filter-btn').on('click', function(event) {
        $('#tag-filter').val([]); // Dies setzt die Auswahl der Tags zurück
        $('#shortcode-list').empty();
        $('#reset-filter-btn').addClass('d-none');
        loadMore();
    });

    // Open Tag Model
    $('#exampleModal').click(function(){
        $('#model-form-tag').addClass('active');
    });

    // Close Tag Model
    $('#tag-close').click(function(){
        $('.form-tag-view').css('display', 'block');
        $('#model-form-tag').removeClass('active');
        $('#tag-list-edit').css('display', 'none');
        $('#id_name').val('');
        $('#tag-edit').html('<span id="tag-edit">Tags Löschen oder Bearbeiten</span>')
        $('.icon-modal-right').css('display', 'block');
    })

    //Create Tags
    $('#createTagButton').click(function(event) {
        event.preventDefault();
        const tag_name = $('#id_name').val();
        const csrf_token = $('[name="csrfmiddlewaretoken"]').val();
    
        $.ajax({
            type: 'POST',
            url: '/shortcode/tags-create/',  // Passe die URL entsprechend an
            data: {
            tag_name: tag_name,
            csrfmiddlewaretoken: csrf_token
            },
            success: function(response) {
            loadTags();
            $('#id_name').val('');
            $('#model-form-tag').removeClass('active');
            },
            error: function(xhr, textStatus, errorThrown) {
            var responseJson = xhr.responseJSON;
            if (responseJson && responseJson.message) {
                $('#error-message').text(responseJson.message);
            } else {
                $('#error-message').text('Ein Fehler ist aufgetreten.');
            }
            $('#error-modal').modal('show');
            }
        });
    });

    // Load Tags
    function load_tags_id(){
        $.ajax({
            url: '/shortcode/tags-list/',
            method: 'GET',
            success: function(response) {
                const tags = response.tags;
                // Verarbeitung der Tags, z.B. Hinzufügen zur Dropdown-Liste
                let tagOptions = '';

                tags.forEach(tag => {
                    tagOptions += `
                    <div class="input-group mb-3" id="tag-${tag.id}">
                        <input type="text" class="form-control" id="tag-value${tag.id}" value="${tag.name}" placeholder="">
                        <button class="btn btn-outline-danger delete-tag-button" type="button" data-tag-id="${tag.id}">Löschen</button>
                        <button class="btn btn-outline-primary edit-tag-button" type="button" data-tag-id="${tag.id}">Änderungen speichern</button>
                    </div>`
                });
                
                $('#tag-list-edit').html(`${tagOptions}`);

            },
            error: function(error) {
                // Fehlerverarbeitung
            }
        });
    }

    // Open Modal Tags Bearbeiten
    $('#tag-edit').click(function(){
        $('.form-tag-view').css('display', 'none');
        $('#tag-list-edit').css('display', 'block');
        $('.icon-modal-right').css('display', 'none');
        $('#tag-edit').html(``);

        //Load Tags ID
        load_tags_id();
    })

    // Löscht den Tag
    $('#tag-list-edit').on('click', '.delete-tag-button', function() {
        const tagId = $(this).data('tag-id');
        var csrfToken = getCookie('csrftoken');
        console.log(tagId);
        $.ajax({
            url: `/shortcode/tags-delete/${tagId}/`,
            method: 'POST',
            data: {
                csrfmiddlewaretoken: csrfToken // Das CSRF-Token aus dem Formular
            },
            success: function(response) {
                // Erfolgsverarbeitung, z.B. Tag aus der Anzeige entfernen
                $(`#tag-${tagId}`).remove();
                load_tags_id();
                ls_toast('Tag erfolgreich gelöscht')
            },
            error: function(error) {
                console.log(error);
                // Fehlerverarbeitung
            }
        });
    });

    // Tags Update
    $('#tag-list-edit').on('click', '.edit-tag-button', function(event) {
        event.preventDefault();
        const tagId = $(this).data('tag-id');
        var csrfToken = getCookie('csrftoken');

        const tagName = $('#tag-value'+tagId).val();  // Input field for tag name
        console.log(tagName)
        $.ajax({
            type: 'POST',
            url: `/shortcode/tags-edit/${tagId}/`,
            data: {
                csrfmiddlewaretoken: csrfToken,
                tag_name: tagName,
            },
            success: function(response) {
                // Handle success, e.g., close modal, refresh tag list, etc.
                load_tags_id();
                ls_toast('Tag erfolgreich aktualisiert.');

                $('.form-tag-view').css('display', 'block');
                $('#model-form-tag').removeClass('active');
                $('#tag-list-edit').css('display', 'none');
                $('#id_name').val('');
                $('#tag-edit').html('<span id="tag-edit">Tags Löschen oder Bearbeiten</span>')
                $('.icon-modal-right').css('display', 'block');

            },
            error: function(error) {
                // Handle error
                console.log(error);
            }
        });
    });
    
}); // End document ready function