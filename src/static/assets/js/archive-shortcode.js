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

    //Archive function
    $('#archive-btn').on('click', function(event){
        event.preventDefault();

        var dataArchive = jQuery(this).attr('data-archive');
        
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
