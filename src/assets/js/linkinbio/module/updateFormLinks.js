import { getCookie } from './getCookie';
import { clearContent, lsToast } from './lsToast';
import linkListe from './linkListe';

class createFormLinks {

    constructor(){
        this.csrftoken = getCookie('csrftoken');
        
        this.event();  
    }

    event() {
        const linkinbioEditcardContainer = document.querySelector('#card-container');
        const cardContainerForm = document.querySelector('#card-container-form');
        const urlDestinationUpdateInput = document.querySelector('#urlDestinationUpdate');


        if (cardContainerForm) {
            cardContainerForm.addEventListener('submit', this.handleSubmitClick.bind(this));
            cardContainerForm.addEventListener('keyup', (event) => {
                if (event.target === urlDestinationUpdateInput) {
                    this.autoCompleteShorcdcode();
                }
            });
        }
    
        if (linkinbioEditcardContainer) {
            linkinbioEditcardContainer.addEventListener('click', this.handleUpdateSwicht.bind(this));
            linkinbioEditcardContainer.addEventListener('click', this.handleEditcardClick.bind(this));
        }
    }

    ajaxDatile(urlDataId){
        const updateUrl = document.getElementById('viewUrlLinks').value.replace(/0/g, urlDataId);
        
        const buttonLabelSelector = '#buttonLabel';
        const urlDestinationUpdateSelector = '#urlDestinationUpdate';

        const buttonLabelId = document.querySelector(buttonLabelSelector);
        const urlDestinationUpdateId = document.querySelector(urlDestinationUpdateSelector);

        const updateformlinkId = document.querySelector('.updateformlink');
        const urlUpdateFormId = updateformlinkId.getAttribute('data-update-form');

        const shortcodeId = document.querySelector('#shortcodeId');

        const linkInBioPageIdValue = document.querySelector('#linkInBioPageIdValue');

        $.ajax({
            url: updateUrl,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRFToken': this.csrftoken
            },
            success: function(data) {
                console.log(data);
                buttonLabelId.value = data.button_label;
                urlDestinationUpdateId.value = data.url_destination;
                updateformlinkId.dataset.urlUpdateFormId = data.id;
                shortcodeId.value = data.shortcode_id;
                linkInBioPageIdValue.value = data.id;
            },
            error: function() {
                console.log('Fehler beim Abrufen der Daten');
            }
        });
    }

    // Update Form View
    updateLinkForm(){
        const linkInBioCardAddForm = document.getElementById('linkInBioCardAddForm');
        linkInBioCardAddForm.classList.remove('d-none');
    }

    // Update Aktive Swicht
    updateSwicht(dataLinkinbioSwitch){

        const swichtUpdateUrl = document.getElementById('swichtupdate').value.replace(/0/g, dataLinkinbioSwitch);

        $.ajax({
            url: swichtUpdateUrl,
            type: 'POST',
            dataType: 'json',
            headers: {
                'X-CSRFToken': this.csrftoken
            },
            success: (data) => {
            //   console.log(data.message)
              lsToast(data.message);
            },
            error: (xhr, textStatus, errorThrown) => {
              console.error('Fehler:', errorThrown);
            }
        });
        
   
    }

    // Handle Update Swicht
    handleUpdateSwicht(event){
        const linkinbioSwitch = event.target.closest('.linkinbio-switch');
        if (linkinbioSwitch) {
            const dataLinkinbioSwitch = linkinbioSwitch.getAttribute('data-linkinbio-switch');
            this.updateSwicht(dataLinkinbioSwitch);
        }  
    }

    // Fomrular aufrufen
    handleEditcardClick(event) {
        const clickedEditcard = event.target.closest('.linkinbio-editcard');
        if (clickedEditcard) {
            const urlDataId = clickedEditcard.getAttribute('data-linkinbio-editcard');
            this.updateLinkForm();
            this.ajaxDatile(urlDataId);
        }
    }

    // Formular Speichern
    handleSubmitClick(event){
        event.preventDefault();
        const updateformlink = document.querySelector('.updateformlink');
        const urlUpdateFormId = updateformlink.getAttribute('data-url-update-form-id');
        this.updateFormLinkinBio(urlUpdateFormId);
    }

    // Formular speichern func
    updateFormLinkinBio(urlUpdateFormId){
        const self = this;
        this.linkList = new linkListe();

        const updateUrlShortcode = document.getElementById('updateUrl').value.replace(/0/g, urlUpdateFormId);
  
        const buttonLabelInput = document.querySelector('#buttonLabel');
        const buttonLabelValue = buttonLabelInput.value;

        const urlDestinationUpdateInput = document.querySelector('#urlDestinationUpdate')
        const urlDestinationUpdateValue = urlDestinationUpdateInput.value;

        const shortcodeId = document.querySelector('#shortcodeId');
        const shortcodeIdValue = shortcodeId.value;
    
        const formData = new FormData();
        formData.append('button_label', buttonLabelValue);
        formData.append('url_destination', urlDestinationUpdateValue);
        formData.append('shortcode_id', shortcodeIdValue);

        $.ajax({
            url: updateUrlShortcode,
            type: 'POST',
            data: formData,
            contentType: 'application/json',
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': this.csrftoken 
            },
            success: function(response) {
                document.querySelector('#linkInBioCardAddForm').classList.add('d-none');

                buttonLabelInput.value = '';
                urlDestinationUpdateInput.value = '';
                shortcodeId.value = '';

                // Link liste neue laden
                self.linkList.linklistview();

                lsToast(translations['Dein link wurde gespeicher.']);
            },
            error: function(error) {
                console.log('Fehler bei der AJAX-Anfrage: ' + error.statusText);
            }
        });

    }

    // Url Regulärer Ausdrück
    isValidURL(url) {
        const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        return urlPattern.test(url);
    }
    
    // Url Prüfen ob es eine URL ist
    urlCheckenNew(UrlInput){
        const feedbackElement = document.querySelector('.url-chacke-feedback');
        if (this.isValidURL(UrlInput)) {
            if (!feedbackElement || feedbackElement.textContent !== 'Looks good!') {
                if (feedbackElement) {
                    feedbackElement.textContent = 'Looks good!';
                    feedbackElement.style.color = '#198754';
                } else {
                    const newFeedbackElementValid = document.createElement('div');
                    newFeedbackElementValid.className = 'url-chacke-feedback mb-3';
                    newFeedbackElementValid.textContent = 'Looks good!';
                    newFeedbackElementValid.style.color = '#198754';
                    const linkInBioPageIDInput = document.querySelector('#shortcodeId');
                    linkInBioPageIDInput.insertAdjacentElement('afterend', newFeedbackElementValid);
                }
                document.querySelector('#buttonCrateShortcode').classList.remove('disabled');
            }
        } else {
            if (!feedbackElement || feedbackElement.textContent !== 'none valid') {
                if (feedbackElement) {
                    feedbackElement.textContent = 'none valid';
                    feedbackElement.style.color = '#dc3545';
                } else {
                    const newFeedbackElementInvalid = document.createElement('div');
                    newFeedbackElementInvalid.className = 'url-chacke-feedback mb-3';
                    newFeedbackElementInvalid.textContent = 'none valid';
                    newFeedbackElementInvalid.style.color = '#dc3545';
                    const linkInBioPageIDInput = document.querySelector('#shortcodeId');
                    linkInBioPageIDInput.insertAdjacentElement('afterend', newFeedbackElementInvalid);
                }
                document.querySelector('#buttonCrateShortcode').classList.add('disabled');
            }
        }

    }

    // Autocomplete Shorcdcode
    autoCompleteShorcdcode(){
        // ID Value
        
        const updateformlink = document.querySelector('.updateformlink');
        const urlUpdateFormId = updateformlink.getAttribute('data-url-update-form-id');

        // Url Shorcode
        const InputUrlShotcodeAutocomplete = document.querySelector('#urlDestinationUpdate');
        const UrlShotcodeAutocompleteValue = InputUrlShotcodeAutocomplete.value;

        this.urlCheckenNew(UrlShotcodeAutocompleteValue);

        // Id link page
        const linkInBioPageId = document.querySelector('#linkInBioPageId');
        const linkInBioPageIdValue = linkInBioPageId.value;

        // ID Shorcode
        const shortcodeId = document.querySelector('#shortcodeId');
        const shortcodeIdValue = shortcodeId.value;

        // shortcodeId.value = '';
        
        // Search resultes
        const searchResultsDiv = document.querySelector('#search-results-update');

        // URL View
        const urlAutocompleteInput = document.querySelector('#valueUrlShotcodeAutocomplete');
        const urlAutocompleteValue = urlAutocompleteInput.value;

    
            if(UrlShotcodeAutocompleteValue.length > 2){
                $.ajax({
                    url: urlAutocompleteValue,
                    type: 'GET',
                    data:{
                        link_in_bio_page_id: linkInBioPageIdValue,
                        search_term : UrlShotcodeAutocompleteValue,
                    },
                    headers: {
                        'X-CSRFToken': this.csrftoken 
                    },
                    success: function(response) {
                        $(this.searchResultsDiv).empty();

                        response.forEach((item) => {
                            const shortcodeItem = $('<li>');
                            shortcodeItem.text(item.url_titel);
                            shortcodeItem.attr('data-id', item.id);
                            $(searchResultsDiv).append(shortcodeItem);
                        });
    
                        // Click add Value hiddenfields
                        this.shortcodeInput = $('#shortcodeId');
                        $(searchResultsDiv).on('click', 'li', function () {
                            const selectedText = $(this).text();
                            const shortcodeDataId = $(this).attr('data-id');
                            
                            $(InputUrlShotcodeAutocomplete).val(selectedText);
                            $('#shortcodeId').val(shortcodeDataId);
        
                            $(searchResultsDiv).empty();
                        });
    
                    },
                    error: function(error) {
                        console.error('Error:', error);
                    }
                });
            
            }
        }

}

export default createFormLinks