import { getCookie } from './getCookie';
import linkListe from './linkListe';
import adjustmentSocial from './adjustmentSocial';
import adjustmentColor from './adjustmentColor';

import { clearContent, lsToast } from './lsToast';

class crateFormLink{

    constructor(){
        this.createOpenCloseForm = document.querySelector('#createOpenCloseForm');
        this.createlinkinbio = document.querySelector('#createlinkinbio');

        this.formCreateShorcode = document.querySelector('#form-create-shorcode');        
        this.formCreateLinkSelect = document.querySelector('#form-create-link-select');
        
        this.linkUrlSubmit = document.querySelector('#linkUrlSubmit');

        this.shortcodeInput = document.querySelector('#selectShortcode');

        this.buttonLabelInput = document.querySelector('#buttonLabelSelcetSubmit');
        this.selectShortcodeInput = document.querySelector('#selectShortcode');


        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event(){
        const formCreateShorcode = document.querySelector('#form-create-shorcode'); 
        const createOpenCloseForm = document.querySelector('#createOpenCloseForm');
        const createSearch = document.querySelector('#createSearch');
        const formCreateLinkSelect = document.querySelector('#form-create-link-select');
        const linkUrlSubmit = document.querySelector('#linkUrlSubmit');
        const shortcodeInput = document.querySelector('#selectShortcode');
        const buttonLabelInput = document.querySelector('#buttonLabelSelcetSubmit');
        const selectShortcodeInput = document.querySelector('#selectShortcode');
        if(createOpenCloseForm){
            this.createOpenCloseForm.addEventListener('click', this.opencrateform.bind(this));
        }
        if(formCreateShorcode){
            document.querySelector('#createShorcode').addEventListener('change', this.handleShorcodeUpdateChange.bind(this));
        }
        if(createSearch){
            document.querySelector('#createSearch').addEventListener('change', this.handleSearchUpdateChange.bind(this));
        }
        if(formCreateLinkSelect){
            this.formCreateLinkSelect.addEventListener('submit', this.cratelinkInBioSelectSubmit.bind(this));
        }
        if(formCreateShorcode){
            this.formCreateShorcode.addEventListener('submit', this.createLinkInBioSubmit.bind(this));   
        }
        if(linkUrlSubmit){
            this.linkUrlSubmit.addEventListener('keyup', this.eventHandlerUrlChecke.bind(this));
        }
        if(shortcodeInput){
            this.shortcodeInput.addEventListener('keyup', this.AutocompleteShorcdcode.bind(this));
        }
        if(buttonLabelInput){
            this.buttonLabelInput.addEventListener('input', this.checkInputs.bind(this));
        }
        if(selectShortcodeInput){
            this.selectShortcodeInput.addEventListener('input', this.checkInputs.bind(this));
        }
    }

    // Cratelink in bio Submit form
    createLinkInBioSubmit(event){
        event.preventDefault();
        const self = this;
        const buttonLabelInput = document.querySelector('#buttonLabelSubmit');
        const linkUrlInput = document.querySelector('#linkUrlSubmit');
        const linkInBioPageIDInput = document.querySelector('#linkInBioPageID');
        const actionAttribute = this.formCreateShorcode.getAttribute('action');
        
        const buttonLabelValue = buttonLabelInput.value;
        const linkUrlValue = linkUrlInput.value;
        const linkInBioPageIDValue = linkInBioPageIDInput.value;
        
        const formData = new FormData();
        formData.append('button_label', buttonLabelValue);
        formData.append('link_url', linkUrlValue);
        formData.append('linkinbio_page', linkInBioPageIDValue);

        this.linkList = new linkListe();
        this.adjustmentSocial = new adjustmentSocial();
        this.adjustmentColor = new adjustmentColor();
        
        $.ajax({
            type: 'POST',
            url: actionAttribute,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': this.csrftoken 
            },
            success: (data) => {

                buttonLabelInput.value = '';
                linkUrlInput.value = '';

                // Success masage
                lsToast(translations['Der Link wurde erfolgreich erstellt und mit Ihrer Link-in-Bio-Seite verknüpft.']);

                document.querySelector('#buttonCrateShortcode').classList.add('disabled');
                document.querySelector('.url-chacke-feedback').textContent = '';
               
                // Link liste neue laden
                self.linkList.linklistview();
                self.adjustmentSocial.linkinbioEditScrenn();
                self.adjustmentColor.customeSetitngsAjax();

            },
            error: function (xhr, status, error) {
                console.error('Fehler:', status, error);
            }
        });
    }

    // Link in Bio Selcet
    cratelinkInBioSelectSubmit(event){
        event.preventDefault();
        const self = this;
        const formCreateLinkAttribute = this.formCreateLinkSelect.getAttribute('action');

        const buttonLabelSelcetSubmitInput = document.querySelector('#buttonLabelSelcetSubmit');
        const linkinbioPageIdInput = document.querySelector('#linkinbio_page_id');
        const shortcodeIdInput = document.querySelector('#shortcode_id');

        const linkinbioPageIdValue = linkinbioPageIdInput.value;
        const buttonLabelSelcetSubmitValue = buttonLabelSelcetSubmitInput.value;
        const shortcodeIdValue = shortcodeIdInput.value;

        const formData = new FormData();
        formData.append('button_label', buttonLabelSelcetSubmitValue);
        formData.append('shortcode_id', shortcodeIdValue);
        formData.append('linkinbio_page_id', linkinbioPageIdValue);


        $.ajax({
            type: 'POST',
            url: formCreateLinkAttribute,
            data: formData,
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': this.csrftoken 
            },
            processData: false,
            contentType: false,
            success: function(data) {

                buttonLabelSelcetSubmitInput.value = '';
                linkinbioPageIdInput.value = '';
                shortcodeIdInput.value = '';
                $('#selectShortcode').val('');

                // Success masage
                lsToast(translations['Der neue Shortcode wurde erfolgreich erstellt und mit Ihrer Link-in-Bio-Seite verknüpft.']);

                document.querySelector('#buttonCrateSelectShortcode').classList.add('disabled');
                // List View Load
                self.linkList.linklistview();

            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('Fehler beim Senden des Formulars: ' + errorThrown)
            }
        });

    }


    // Input fields Link in Bio Select
    checkInputs() {
        const buttonLabelValue = this.buttonLabelInput.value.trim();
        const selectShortcodeValue = this.selectShortcodeInput.value.trim();
    
        if (buttonLabelValue === '' && selectShortcodeValue !== '') {
            // Das Button-Label-Feld ist leer
            document.querySelector('#buttonCrateSelectShortcode').classList.add('disabled');
        } else if (buttonLabelValue !== '' && selectShortcodeValue === '') {
            // Das Select-Shortcode-Feld ist leer
            document.querySelector('#buttonCrateSelectShortcode').classList.add('disabled');
        } else if (buttonLabelValue === '' && selectShortcodeValue === '') {
            // Beide Felder sind leer
            document.querySelector('#buttonCrateSelectShortcode').classList.add('disabled');
        } else {
            // Beide Felder enthalten Inhalt
            document.querySelector('#buttonCrateSelectShortcode').classList.remove('disabled');
        }
    }

    
    // Autocomplete Shorcdcode
    AutocompleteShorcdcode(){
        const searchResultsDiv = document.querySelector('#search-results')
        const InputUrlShotcodeAutocomplete = document.querySelector('#valueUrlShotcodeAutocomplete');
        const linkinbioPageIdInput = document.querySelector('#linkinbio_page_id');
        const urlShorcodeAutocomplete = InputUrlShotcodeAutocomplete.value;
        const linkinbioPageIdValue = linkinbioPageIdInput.value;

        if(this.shortcodeInput.value.length > 2){

            $.ajax({
                url: urlShorcodeAutocomplete,
                type: 'GET',
                data:{
                    link_in_bio_page_id: linkinbioPageIdValue,
                    search_term : this.shortcodeInput.value,
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
                    this.shortcodeInput = $('#shortcode_id');
                    $(searchResultsDiv).on('click', 'li', function () {
                        const selectedText = $(this).text();
                        const shortcodeId = $(this).attr('data-id');
                        
                        $('#selectShortcode').val(selectedText);
                        $('#shortcode_id').val(shortcodeId);
    
                        $(searchResultsDiv).empty();
                    });
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });

        }
    }

    // Url Regulärer Ausdrück
    isValidURL(url) {
        const urlPattern = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        return urlPattern.test(url);
    }

    // Url Check
    eventHandlerUrlChecke() {
        const linkUrlSubmitValue = linkUrlSubmit.value;
        const feedbackElement = document.querySelector('.url-chacke-feedback');
    
        if (this.isValidURL(linkUrlSubmitValue)) {
            if (!feedbackElement || feedbackElement.textContent !== 'Looks good!') {
                if (feedbackElement) {
                    feedbackElement.textContent = 'Looks good!';
                    feedbackElement.style.color = '#198754';
                } else {
                    const newFeedbackElementValid = document.createElement('div');
                    newFeedbackElementValid.className = 'url-chacke-feedback mb-3';
                    newFeedbackElementValid.textContent = 'Looks good!';
                    newFeedbackElementValid.style.color = '#198754';
                    const linkInBioPageIDInput = document.querySelector('#linkInBioPageID');
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
                    const linkInBioPageIDInput = document.querySelector('#linkInBioPageID');
                    linkInBioPageIDInput.insertAdjacentElement('afterend', newFeedbackElementInvalid);
                }
                document.querySelector('#buttonCrateShortcode').classList.add('disabled');
            }
        }
    }

    // Link Open form Crate
    opencrateform(){
        if (this.createlinkinbio.classList.contains('d-none')) {
            this.createlinkinbio.classList.remove('d-none');
          } else {
            this.createlinkinbio.classList.add('d-none');
        }
    }

    // handleShorcodeUpdateChange
    handleShorcodeUpdateChange() {
        if (document.querySelector('#createShorcode').checked) {
            this.formCreateShorcode.classList.remove('d-none');
            this.formCreateLinkSelect.classList.add('d-none');
            document.querySelector('#createSearch').checked = false;
        }
    }

    // handleSearchUpdateChange
    handleSearchUpdateChange() {
        if (document.querySelector('#createSearch').checked) {
            this.formCreateShorcode.classList.add('d-none');
            this.formCreateLinkSelect.classList.remove('d-none');
            document.querySelector('#createShorcode').checked = false;
        }
    }

}

export default crateFormLink