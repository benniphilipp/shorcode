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


    // Open Sidebar
    $("#openForm").on('click', function() {  //use a class, since your ID gets mangled
        $('#aside-form').toggleClass("toggle", 1500); 
        $('#archive-btn').toggleClass('d-none')
    });

    $("#closeForm").click(function() {  //use a class, since your ID gets mangled
        $('#aside-form').toggleClass("toggle", 1500); 
        $('#archive-btn').toggleClass('d-none')
    });

    //Alert Banner
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    // Crate functions Shortcode
    const url_destination = document.getElementById('id_url_destination');
    const url_titel = document.getElementById('id_url_titel');
    const url_medium = document.getElementById('id_url_medium');
    const url_source = document.getElementById('id_url_source');
    const url_term = document.getElementById('id_url_term');
    const url_tags = document.getElementById('id_url_tags');
    const url_content = document.getElementById('id_url_content');
    const url_campaign = document.getElementById('id_url_campaign');
    const csrf = document.getElementsByName('csrfmiddlewaretoken');
    const url_creator = document.getElementById('url_creator');

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
        fd.append('url_tags', url_tags.value);
        fd.append('url_content', url_content.value);

        $.ajax({
            type: 'POST',
            url: $("input[name=data]").val(),
            data: fd,
            enctype: 'multipart/form-data',
            success: function(response){

                //Reset fields
                $('#id_url_destination').val('')
                $('#id_url_titel').val('')
                $('#id_url_medium').val('')
                $('#id_url_source').val('')
                $('#id_url_term').val('')
                $('#id_url_titel').val('')
                $('#id_url_tags').val('')
                $('#id_url_campaign').val('')
                $('#id_url_content').val('')

                //Alert
                alert(response.success, 'success')
                setTimeout(function(){$('.alert').alert('close')}, 3000)

                //Close Sidebar
                $('#aside-form').toggleClass("toggle", 1500); 

            },
            error: function(error){
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
        })

    });

    //destination
    $("#id_url_destination").on("change", function () {
        var destination_text = $('#id_url_destination').val();
        $("#destination").text('?utm_source=' + destination_text);

        if(destination_text == ''){
            $("#destination").text('');
            $('#text-card').addClass('d-none');
        }
        $('#text-card').removeClass('d-none');
    });

    // //titel
    // $("#id_url_titel").on("change", function () {
    //     var titel_text = $('#id_url_titel').val();
    //     $("#titel").text('&utm_medium=' + titel_text);

    //     var valueString = titel_text.replace(/\&/g, '');
    //     $("#titel").text(valueString);

    //     if(titel_text == ''){
    //         $("#destination").text('');
    //         $('#text-card').addClass('d-none');


    //     }
    //     $('#text-card').removeClass('d-none');
    // });



    //$('#inputDatabaseName').keyup(function () { alert('test'); });


});