$(document).ready(function(){

    //Archive function
    $('#archive-btn').on('click', function(event){
        event.preventDefault();

        var dataArchive = jQuery(this).attr('data-archive');

        //form fuc disabled
        disabledTextInput();

        //Overlay
        overlayReady();
        
        $.ajax({
            type: 'POST',
            url: "/shortcode/update/archive/", //shortcode
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': dataArchive,
            },
            success: function(response){
                console.log(response);
                setTimeout(()=>{
                    window.location.reload();
                    $('#overlay').removeClass('overlay-active');
                    $('#overlay-open').removeClass("overlay-open"); 
                }, 1000);
            },
            error: function(error){
                console.log(error)
            },
        })
    })

}); // End document ready function
