window.addEventListener('DOMContentLoaded', (event) => {


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
