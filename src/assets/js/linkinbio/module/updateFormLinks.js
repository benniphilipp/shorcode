import { getCookie } from './getCookie';

class createFormLinks {

    constructor(){
        this.csrftoken = getCookie('csrftoken');
        this.event();  
    }

    event(){
        const linkinbioEditcardContainer = document.querySelector('#card-container-form');
        if (linkinbioEditcardContainer) {
          linkinbioEditcardContainer.addEventListener('submit', this.handleSubmitClick.bind(this));
          linkinbioEditcardContainer.addEventListener('click', this.handleEditcardClick.bind(this));
          linkinbioEditcardContainer.addEventListener('keyup', this.autoCompleteShorcdcode.bind(this));
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

        $.ajax({
            url: updateUrl,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRFToken': this.csrftoken
            },
            success: function(data) {
                console.log(data)
                buttonLabelId.value = data.button_label;
                urlDestinationUpdateId.value = data.url_destination;
                updateformlinkId.dataset.shortcodeId = data.id;
                shortcodeId.value = data.shortcode_id;
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

    handleEditcardClick(event) {
        const clickedEditcard = event.target.closest('.linkinbio-editcard');
        if (clickedEditcard) {
            const urlDataId = clickedEditcard.getAttribute('data-linkinbio-editcard');
            this.updateLinkForm();
            this.ajaxDatile(urlDataId);
        }
    }

    handleSubmitClick(event){
        event.preventDefault();
        const updateformlink = document.querySelector('.updateformlink');
        const urlUpdateFormId = updateformlink.getAttribute('data-update-form');
        this.updateFormLinkinBio(urlUpdateFormId);
    }

    updateFormLinkinBio(urlUpdateFormId){

        const updateUrlShortcode = document.getElementById('updateUrl').value.replace(/0/g, urlUpdateFormId);

        const buttonLabelInput = document.querySelector('#buttonLabel');
        const buttonLabelValue = buttonLabelInput.value;

        const urlDestinationUpdateInput = document.querySelector('#urlDestinationUpdate')
        const urlDestinationUpdateValue = urlDestinationUpdateInput.value;

        const shortcodeId = document.querySelector('#shortcodeId');
        const shortcodeIdValue = shortcodeId.value;

        const linkInBioPageIdInput = document.querySelector('#linkInBioPageId')
        const linkInBioPageIdValue = linkInBioPageIdInput.value;

        console.log('Url ', updateUrlShortcode)
        console.log('Form ID', urlUpdateFormId)
        console.log('Label', buttonLabelValue);
        console.log('Url', urlDestinationUpdateValue);
        console.log('Shortcode', shortcodeIdValue);
        console.log('Link Id', linkInBioPageIdValue);

        // const formData = new FormData();
        // formData.append('button_label', buttonLabelValue);
        // formData.append('url_destination', urlDestinationUpdateValue);
        // formData.append('shortcode_id', shortcodeIdValue);
        // formData.append('link_page_id', linkInBioPageIdValue);

        // $.ajax({
        //     url: updateUrlShortcode,
        //     type: 'POST',
        //     data: formData,
        //     contentType: 'application/json',
        //     processData: false,
        //     contentType: false,
        //     headers: {
        //         'X-CSRFToken': this.csrftoken 
        //     },
        //     success: function(response) {
        //         console.log(response);
        //     },
        //     error: function(error) {
        //         console.log('Fehler bei der AJAX-Anfrage: ' + error.statusText);
        //     }
        // });

    }

    // Autocomplete Shorcdcode
    autoCompleteShorcdcode(){
        // ID Value
        // const updateformlink = document.querySelector('.updateformlink');
        // const urlUpdateFormId = updateformlink.getAttribute('data-update-form');

        // // Value field
        // const inputSearchformInput = document.querySelector('.inputSearchform');
        // const inputSearchformValue = inputSearchformInput.value;

        // // Url Shorcode
        // const InputUrlShotcodeAutocomplete = document.querySelector('#urlDestinationUpdate' + urlUpdateFormId);
        // const UrlShotcodeAutocompleteValue = InputUrlShotcodeAutocomplete.value;

        // // Id link page
        // const linkInBioPageId = document.querySelector('#linkInBioPageId' + urlUpdateFormId);
        // const linkInBioPageIdValue = linkInBioPageId.value;

        // // ID Shorcode
        // const shortcodeId = document.querySelector('#shortcodeId' + urlUpdateFormId);
        // const shortcodeIdValue = shortcodeId.value;

        // shortcodeId.value = '';
        
        // // Search resultes
        // const searchResultsDiv = document.querySelector('#search-results' + urlUpdateFormId )
        
        // // URL View
        // const urlAutocompleteInput = document.querySelector('#valueUrlShotcodeAutocomplete');
        // const urlAutocompleteValue = urlAutocompleteInput.value;

        // if(inputSearchformValue.length > 2){
        //     $.ajax({
        //         url: urlAutocompleteValue,
        //         type: 'GET',
        //         data:{
        //             link_in_bio_page_id: linkInBioPageIdValue,
        //             search_term : UrlShotcodeAutocompleteValue,
        //         },
        //         headers: {
        //             'X-CSRFToken': this.csrftoken 
        //         },
        //         success: function(response) {
        //             $(searchResultsDiv).empty();

        //             response.forEach((item) => {
        //                 const shortcodeItem = $('<li>');
        //                 shortcodeItem.text(item.url_titel);
        //                 shortcodeItem.attr('data-id', item.id);
        //                 $(searchResultsDiv).append(shortcodeItem);
        //             });

        //             // Click add Value hiddenfields
        //             this.shortcodeInput = $('#shortcodeId' + urlUpdateFormId);
        //             $(searchResultsDiv).on('click', 'li', function () {
        //                 const selectedText = $(this).text();
        //                 const shortcodeDataId = $(this).attr('data-id');
                        
        //                 $(inputSearchformInput).val(selectedText);
        //                 $('#shortcodeId' + urlUpdateFormId).val(shortcodeDataId);
    
        //                 $(searchResultsDiv).empty();
        //             });

        //         },
        //         error: function(error) {
        //             console.error('Error:', error);
        //         }
        //     });
        // }
    }


}

export default createFormLinks