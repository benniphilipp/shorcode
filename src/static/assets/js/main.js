window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed main.js');

    $('.links-down').click(function(event){
        event.preventDefault();
        if($("#links-collapse").hasClass("show")){
            $('#links-collapse').removeClass('show');
        }else{
            $('#links-collapse').addClass('show');
        }
    });


    if($('.link-archiv').hasClass('active')){
        $('#links-collapse').addClass('show');   
    }

    if($('.link-archiv').hasClass('active')){
        $('.link-nav').addClass('active');
    }

    if($('.link-geo').hasClass('active')){
        $('#links-collapse').addClass('show');  
    }

    if($('.link-geo').hasClass('active')){
        $('.link-nav').addClass('active');
    }


});