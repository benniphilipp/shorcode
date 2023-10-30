/*
TODOs:
*/

import { getCookie } from './getCookie';
import { clearContent, lsToast } from './lsToast';

class adjustmentSocial {

    constructor() {

        this.linkinbioEditScrenn();
        this.sozialprofilelist();
        this.SortableUlrSocial();
        this.socialplattformEmpty();
        this.csrftoken = getCookie('csrftoken');

        this.addElementButton = document.querySelector('#addElementButton');
        if (this.addElementButton) {
            this.addElementButton.addEventListener('click', () => {
                this.addSocialMediaPlatforms();
            })
        }

        const elementContainer = document.querySelector('#elementContainer');
        if (elementContainer) {
            elementContainer.addEventListener('change', this.handleSelectChange.bind(this));
            elementContainer.addEventListener('input', this.handleInput.bind(this));
            elementContainer.addEventListener('click', this.handleButtonUpdate.bind(this));
            elementContainer.addEventListener('click', this.handleButtonDelete.bind(this));
        }

        // modalButtonDelete
        const deleteButton = document.getElementById('urlsDelete');
        if(deleteButton){
            deleteButton.addEventListener('click', this.modalButtonDelete.bind(this));
        }

        this.uniqueIdCounter = 0;
        this.selectedPlatform = null;
        this.inputFieldId = null;

    }

    handleSelectChange(event) {
        const select = event.target;
        if (select.tagName === 'SELECT') {
            const selectedOption = select.options[select.selectedIndex];
            const selectedPlatform = selectedOption.getAttribute('data-platform');
            const uniqueId = select.id.replace('socialSelectFieldId', '');
    
            // Jetzt kannst du mit den ausgewählten Informationen arbeiten
            // console.log('Ausgewählte Plattform:', selectedPlatform);
            // console.log('UniqueId:', uniqueId);
    
            const relatedUrlInput = document.getElementById(`urlSocial${uniqueId}`);
            // relatedUrlInput.classList.add(selectedPlatform);
            relatedUrlInput.classList.add(this.selectedPlatform);
            this.selectedPlatform = selectedPlatform;
        }
    }

    handleInput(event) {
        const inputField = event.target;
        const enteredURL = inputField.value;

        if (this.selectedPlatform) {
            // Validieren Sie die eingegebene URL für die ausgewählte Plattform

            if (this.validateURL(this.selectedPlatform, enteredURL)) {
                // console.log(`Die URL für ${this.selectedPlatform} ist gültig`);
                // Daten speichern
                this.saveData(this.selectedPlatform, enteredURL); 
                inputField.style.borderColor = '';
            } else {
                // console.log(`Die URL für ${this.selectedPlatform} ist ungültig`);

                inputField.style.borderColor = '#dc3545';
                
            }
        }

    }


    // Methode zum Speichern der Daten
    saveData(selectedPlatform, enteredURL) {
        if (selectedPlatform && enteredURL) {

            var link_in_bio_id = $('#linkinbio_page_id_custome').val();
            const urlSocialForm = $('#urlSocial').val();

            $.ajax({
                url: urlSocialForm,
                type: 'POST',
                data: {
                    url_social: enteredURL,
                    link_in_bio_id: link_in_bio_id,
                    social_media_platform: selectedPlatform
                },
                headers: {
                    'X-CSRFToken': this.csrftoken,
                },
                success: (data) => {
                    if (data.success) {

                        lsToast(translations['URL erfolgreich gespeichert.']);                      
                        this.sozialprofilelist();

                    } else {
                        console.error('Fehler beim Speichern der URL:', data.message);
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.error('Fehler beim Speichern der URL:', errorThrown);
                }
            });

        }
    }


    // Funktion zur Validierung der URL für die ausgewählte Plattform
    validateURL(platform, url) {
        switch (platform) {
            case 'Facebook':
                return this.isFacebookURL(url);
            case 'Instagram':
                return this.isInstagramURL(url);
            case 'YouTube':
                return this.isYoutubeURL(url);
            case 'Vimeo':
                return this.isVimeoURL(url);
            case 'Twitter':
                return this.isTwitterURL(url);
            case 'Twitch':
                return this.isTwitchURL(url);
            case 'TikTok':
                return this.istTikTokURL(url);
            case 'Reddit':
                return this.istRedditURL(url);
            case 'Tumblr':
                return this.istTumblrURL(url);
            case 'Snapchat':
                return this.isSnapchatUrl(url);
            case 'Discord':
                return this.isDiscordUrl(url);
            case 'LinkedIn':
                return this.isLinkedInUrl(url);
            case 'Xing':
                return this.isXingUrl(url);
            default:
                return false;
        }
    }


    // Validierungsfunktion für Facebook
    isFacebookURL(url) {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.*/i;
        return facebookRegex.test(url);
    }

    // Validierungsfunktion für Instagram
    isInstagramURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Yourtube
    isYoutubeURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Vimeo
    isVimeoURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Twitter
    isTwitterURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?twitter\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Twitch
    isTwitchURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?twitch\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Twitch
    istTikTokURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Reddit
    istRedditURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?reddit\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Tumblr
    istTumblrURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?tumblr\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Snapchat
    isSnapchatUrl(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?snapchat\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für Snapchat
    isDiscordUrl(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?discord\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für LinkedIn
    isLinkedInUrl(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*/i;
        return instagramRegex.test(url);
    }

    // Validierungsfunktion für XING
    isXingUrl(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?xing\.com\/.*/i;
        return instagramRegex.test(url);
    }


    elementSocial(uniqueId) {

        return `
        <div class="card border-0 mt-4 p-3 shadow-sm">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col-sm-1 d-flex justify-content-start align-items-center">
                        <i class="fa-solid fa-grip-vertical"></i>
                    </div>
                    <div class="col-sm-5">
                        <select class="form-select platform-select" id="socialSelectFieldId${uniqueId}" name="platform">
                            <!-- Optionen werden hier dynamisch hinzugefügt -->
                        </select>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <input type="text" class="form-control url_social" id="urlSocial${uniqueId}" placeholder="Url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    addSocialMediaPlatforms() {
        const elementContainer = document.querySelector('#elementContainer');
        const UrlDataView = document.querySelector('#getSocialMdiaPlatforms');

        const newElement = this.elementSocial(this.uniqueIdCounter);
        $(elementContainer).append($(newElement));

        this.uniqueIdCounter++;
        const link_in_bio_id = $('#linkinbio_page_id_custome').val();
        $.ajax({
            url: UrlDataView.value,
            type: 'GET',
            dataType: 'json',
            data: {
                link_in_bio_page_id: link_in_bio_id,
            },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: (data) => {
                const self = this;
                // Finde das <select> im neuen Element
                var select = $('#elementContainer').find('.platform-select').last();
                $.each(data.platforms, function (index, platform) {
                    var option = $('<option>', {
                        value: platform.id,
                        text: platform.name,
                        'data-platform': platform.name
                    });
                    option.addClass('platform');
                    select.append(option);
                });

                select.prepend($('<option>', {
                    value: '',
                    text: 'Plattform wählen'
                }));
                select.val('');
                console.log('Update');
                self.socialplattformEmpty();

            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Fehler:', errorThrown);
            }
        });
    }

    // View list urls
    sozialprofilelist() {
        const urlData = document.querySelector('#UrlSocialProfilesViewList');
        const elementContainer = document.querySelector('#elementContainer');

        if(urlData){
            $.ajax({
                url: urlData.value,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    
                    // Löschung aller vorhandenen Elemente im Container
                    elementContainer.innerHTML = '';
                    
                    // Durchlaufe die Daten und erstelle Elemente für alle Profile
                    data.social_media.forEach((profile) => {

                        const newElement = this.UpdateelementSocial(profile.platform, profile.url, profile.id, profile.selected, profile.order);
                        elementContainer.insertAdjacentHTML('beforeend', newElement);
                    });
                },
                error: (xhr, textStatus, errorThrown) => {
                    console.error('Fehler:', errorThrown);
                }
            });
        }

    }
    
    // Element list view urls
    UpdateelementSocial(platform, url, id, selected, order) {
        const selectFieldId = `socialSelectFieldId${id}`;
        const selectedAttribute = selected ? 'selected' : '';
        return `
        <div class="card border-0 mt-4 p-3 shadow-sm sortable-item" data-id="${id}">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col-1 d-flex justify-content-center align-items-center p-0">
                        <i class="fa-solid fa-grip-vertical"></i>
                    </div>
                    <div class="col-3">
                        <select class="form-select update-platform-select" id="${selectFieldId}">
                            <option value="${platform}" data-platform="${platform}" ${selectedAttribute}>${platform}</option>
                        </select>
                    </div>
                    <div class="col-6 p-0">
                        <div class="form-group">
                            <input type="text" class="form-control url_social" id="urlSocial${id}" value="${url}">
                        </div>
                    </div>
                    <div class="col-2 d-flex justify-content-center align-items-center p-0">
                        <button class="btn btn-primary btn-sm mx-1 sozial-update" data-url-update="${id}"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger btn-sm sozial-delete" data-url-delete="${id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    

    

    handleButtonUpdate(event){
        const sozialUpdate = event.target.closest('.sozial-update');
        if(sozialUpdate){
            const updateId = sozialUpdate.getAttribute('data-url-update');
            const urlSocialValue = document.querySelector('#urlSocial'+ updateId).value;
            this.sozialprofilurlsupdate(updateId, urlSocialValue)
        }
    }


    sozialprofilurlsupdate(updateId, urlSocialValue){

        const urlData = document.querySelector('#UrlSocialProfilesUpdateView');
  
        const formData = new FormData();
        formData.append('url_social_id', updateId);
        formData.append('url_social', urlSocialValue);

        $.ajax({
            type: 'POST',
            url: urlData.value,
            data: formData,
            contentType: 'application/json',
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': this.csrftoken, 
            },
            success: (data) => {

                lsToast(data.message);
                this.sozialprofilelist();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Fehler bei der Ajax-Anfrage:', errorThrown);
            }
        });

    }


    
    // Delete Button
    handleButtonDelete(event){
        const sozialDelete = event.target.closest('.sozial-delete');
        if(sozialDelete){
            const updateId = sozialDelete.getAttribute('data-url-delete');
            this.openModalDeleteUrl(updateId)
        }
    }



    // Open Modal Delete URL
    openModalDeleteUrl(updateId){
        const deleteButton = document.getElementById('urlsDelete');
        deleteButton.setAttribute('data-custom-attribute', updateId);
        $('#exampleUrls').modal('show');
    }



    // Delete Modal Button
    modalButtonDelete(){
        const urlsDelete = document.querySelector('#urlsDelete');
        if(urlsDelete){
            const delteId = urlsDelete.getAttribute('data-custom-attribute');
            this.sozialprofilurlsdelete(delteId)
        }
    }



    // Delete function
    sozialprofilurlsdelete(updateId){
     
        const dataUrl = document.querySelector('#UrlSocialProfilesDeleteView');
        
        $.ajax({
            url: dataUrl.value,
            type: 'POST',
            data: {
                url_social_id: updateId,
            },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: (data) => {

                $('#exampleUrls').modal('hide');
                lsToast(data.social_media_delete);
                this.sozialprofilelist();
                this.socialplattformEmpty();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der URL:', errorThrown);
            }
        });
    }


    // Edite Screnn
    linkinbioEditScrenn(){

        const urlData = document.querySelector('#LinkInBioViewEditScreen');

        if(urlData){
            $.ajax({
                url: urlData.value,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
    
                    $('#descriptionPageValue').text(data.description);
                    $('#titelpageValue').text(data.title);
    
                    // Rendern der URL-Social-Profile
                    const urlSocialProfilesContainer = $('#urlSocialProfilesContainer');
                    urlSocialProfilesContainer.empty();
    
                    data.links.url_social_profiles.forEach((profile) => {
    
                        const profileElement = `
                        <li>
                            <a href="${profile.url_social}">
                                <i class="fa-brands ${profile.icon}"></i>
                            </a>
                        </li>
                        `;
                        urlSocialProfilesContainer.append(profileElement);
                    });
    
                    // Rendern der Link-in-Bio-Links
                    const linkInBioLinksContainer = $('#linkInBioLinksContainer');
                    linkInBioLinksContainer.empty();
                    
                    data.links.link_in_bio_links.forEach((link) => {
                        const linkElement = `
                            <a class="link-page-btn link-btn-color d-none" href="http://127.0.0.1:8000/${link.lang}/${link.url}">${link.link_text}</a>
                        `;
                        linkInBioLinksContainer.append(linkElement);
                    });

                    setTimeout(() => {
                        linkInBioLinksContainer.removeClass('d-none');
                    }, 500);

                    const linkPageDisplay = document.querySelectorAll('.link-page-btn');

                    linkInBioLinksContainer.removeClass('d-none');
                    linkPageDisplay.forEach(function(linkPageElement){
                        setTimeout(() => {
                            linkPageElement.classList.remove('d-none');
                        }, 1500);
                    })

    
                },
                error: (xhr, textStatus, errorThrown) => {
                  console.error('Fehler:', errorThrown);
                }
              });
        }


    }

    // Sortable 
    SortableUlrSocial(){
        const self = this;
        const sortableList = document.getElementById('elementContainer');

        $(sortableList).sortable({
            axis: "y", // Falls du nur vertikal sortieren möchtest
            update: function(event, ui) {
                const sortedItems = $(this).find('.sortable-item').map(function() {
                    return $(this).attr('data-id');
                  }).get();
                  console.log("Aktualisierte Reihenfolge:", sortedItems);
                  self.sorttabelSaveUrlSocial(sortedItems)
            }
          });
          $(sortableList).disableSelection();
    }

    sorttabelSaveUrlSocial(sortedLinks){
        const dataFrom = document.querySelector('#SocialMediaProfilesOrderSaveView').value;
        console.log(dataFrom);
        console.log(sortedLinks);
        $.ajax({
            url: dataFrom,
            type: 'POST',
            data: { sorted_links: sortedLinks },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: function (data) {
                console.log('Reihenfolge erfolgreich gespeichert.'+ data.sorted_links);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der Reihenfolge:', errorThrown);
            },
        });    
    }

    socialplattformEmpty(){
        const dataUrl = document.querySelector('#getSocialMdiaPlatforms').value;
        const link_in_bio_id = $('#linkinbio_page_id_custome').val();
        $.ajax({
            url: dataUrl, // Hier setzt du deine Django-URL ein
            type: 'GET',
            data: {
                link_in_bio_page_id: link_in_bio_id,
            },
            dataType: 'json',
            success: function (data) {
                // Daten erfolgreich abgerufen
                if (data.platforms.length === 0) {
                    const addElementButton = document.querySelector('#addElementButton');
                    addElementButton.style.display = 'none';
                } else {
                    const addElementButton = document.querySelector('#addElementButton');
                    addElementButton.style.display = 'block';
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                // Fehler beim Abrufen der Daten
                console.error('Fehler:', errorThrown);
            }
        });
    }
    


}

export default adjustmentSocial;