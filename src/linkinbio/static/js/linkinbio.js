


window.addEventListener('DOMContentLoaded', (event) => {




    // List View social media
    // const linkInBioId = $('#linkinbio_page_id_custome').val();
    // var linkInBioIdelement = document.getElementById(linkInBioId);
    // if(linkInBioIdelement){
    //     $.ajax({
    //         url: '/linkinbio/social_media_profiles/' + linkInBioId,
    //         type: 'GET',
    //         dataType: 'json',
    //         success: function(data) {
    
    //             var socialMediaProfiles = data.social_media_profiles;
    //             socialMediaProfiles.forEach(function(profile) {
    
    //                 var newElement = `
    //                     <div class="card border-0 mt-4 p-3" style="background-color: rgb(248,249,250);">
    //                     <div class="card-body p-0">
    //                         <div class="row">
    //                             <div class="col">
    //                             <div class="d-flex flex-row align-items-center">
    //                                 <i class="fa-solid fa-grip-vertical mx-2"></i>
    //                                 <select class="form-select platform-select" id="socialSelectFieldId" name="platform" disabled>
    //                                     <!-- Optionen werden hier dynamisch hinzugefügt -->
    //                                     <option value="1">${profile.platform}</option>
    //                                 </select>
    //                             </div>
    //                             </div>
    //                             <div class="col">
    //                                 <div class="form-group">
    //                                     <div class="d-flex flex-row align-items-center">
    //                                         <input type="text" class="form-control url_social" placeholder="Url" value="${profile.url}">
    //                                         <i class="fa-regular fa-circle-xmark mx-2"></i>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 `;
    //                 $('#elementContainer').append(newElement);
    //             });
    
    //         }
    //     });
    // };



    // Handler für den Button-Klick zum Speichern der URL
    var urlSocialForm = $('#urlSocial').val();
    $(document.body).on('change', '.url_social', function() {
        var url_social = $(this).val();  // Wert aus dem Input-Feld holen
        var link_in_bio_id = $('#linkinbio_page_id_custome').val();  // Annahme: Die LinkInBio-Seite hat eine ID
        var social_media_platform = $('#socialSlectFeldId').val();
        console.log(social_media_platform)
        // Ajax-Anfrage zum Speichern der URL
        $.ajax({
            url: urlSocialForm,  // Ersetze durch die richtige URL zur View
            type: 'POST',
            data: {
                url_social: url_social,
                link_in_bio_id: link_in_bio_id,
                social_media_platform: social_media_platform
            },
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                if (data.success) {
                    console.log('URL erfolgreich gespeichert.');
                    // Hier kannst du weitere Aktionen ausführen, z.B. die Seite aktualisieren
                } else {
                    console.error('Fehler beim Speichern der URL:', data.message);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der URL:', errorThrown);
            }
        });
    });


    // Handler für den Button-Klick
    $('#addElementButton').click(function() {
        // Erstelle ein neues Element mit dem gewünschten HTML
        var newElement = `
        <div class="card border-0 mt-4 p-3" style="background-color: rgb(248,249,250);">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col">
                        <select class="form-select platform-select" id="socialSlectFeldId" name="platform">
                            <!-- Optionen werden hier dynamisch hinzugefügt -->
                        </select>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <input type="text" class="form-control url_social" placeholder="Url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Füge das neue Element zum Container hinzu
        $('#elementContainer').append(newElement);

        // Hole die Plattformen und fülle das gerade hinzugefügte <select> mit Optionen
        $.ajax({
            url: '/linkinbio/get_social_media_platforms/', // Ersetze durch die richtige API-URL
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Finde das <select> im neuen Element
                var select = $('#elementContainer').find('.platform-select').last();
                $.each(data.platforms, function(index, platform) {
                    select.append($('<option>', {
                        value: platform.id,
                        text: platform.name
                    }));
                });
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler:', errorThrown);
            }
        });
    });




    const colorInputs = document.querySelectorAll('.color-picker');

    colorInputs.forEach((colorInput) => {
        const pickr = Pickr.create({
            el: colorInput,
            theme: 'classic',
            default: '#000000',
            padding: 8,
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    input: true,
                    save: true,
                },
            },
        });
    
        pickr.on('save', (color) => {
            // Hier kannst du die ausgewählte Farbe verwenden, z.B. speichern oder anzeigen
            console.log(`Ausgewählte Farbe: ${color.toHEXA().toString()}`);
        });
    });





















    // Checkbox Image
    $('#customeImage').on('change', function(){
        if ($(this).is(':checked')) {
            console.log(this);
            $('#fieldsImage').show();
            $('#fieldsColor').hide();
            $('#customeColor').prop('checked', false);
        }
    });

    // Checkbox Color
    $('#customeColor').on('change', function(){
        if ($(this).is(':checked')) {
            console.log(this);
            $('#fieldsColor').show();
            $('#fieldsImage').hide();
            $('#customeImage').prop('checked', false);
        }
    });

    // Varbverlauf
    var startColorInput = $('#start-color');
    var endColorInput = $('#end-color');
    var createGradientButton = $('#create-gradient');
    var selectedGradientPreview = $('#selected-gradient-preview');

    createGradientButton.on('change', function() {
        var startColor = startColorInput.val();
        var endColor = endColorInput.val();

        var gradient = `linear-gradient(to right, ${startColor}, ${endColor})`;
        selectedGradientPreview.css('background', gradient);
    });

    // Initialen Farbverlauf anzeigen
    var initialGradient = `linear-gradient(to right, ${startColorInput.val()}, ${endColorInput.val()})`;
    selectedGradientPreview.css('background', initialGradient);






    // $("#openForm").on('click', function() {
    //     $('#aside-form').addClass("toggle"); 
    //     $('#overlay-open').addClass("overlay-open"); 

    //     $('#id_template_name').css({
    //         'border-color': '#dc3545',
    //     });

    //     $('#id_template_name').on('change', function() {
    //         $('#id_template_name').css({
    //             'border-color': '',
    //         });
    //     });

    // });

    // $("#closeForm").click(function() { 
    //     $('#aside-form').removeClass("toggle");
    //     $('#overlay-open').removeClass("overlay-open");  
    // });


});
