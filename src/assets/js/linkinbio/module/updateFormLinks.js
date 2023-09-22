import { getCookie } from './getCookie';

class createFormLinks {

    constructor(){
        this.event();  
    }

    event(){
        const linkinbioEditcardContainer = document.querySelector('#card-container');
        if (linkinbioEditcardContainer) {
            linkinbioEditcardContainer.addEventListener('click', this.handleEditcardClick.bind(this));
        }
    }


    ajaxDatile(urlDataId){
        const updateUrl = document.getElementById('viewUrlLinks').value.replace(/0/g, urlDataId);
        
        const buttonLabelSelector = '#buttonLabel' + urlDataId;
        const urlDestinationUpdateSelector = '#urlDestinationUpdate' + urlDataId;

        const buttonLabelId = document.querySelector(buttonLabelSelector);
        const urlDestinationUpdateId = document.querySelector(urlDestinationUpdateSelector);

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
            },
            error: function() {
                console.log('Fehler beim Abrufen der Daten');
            }
        });
    }


    // Update Form View
    updateLinkForm(urlDataId){
        const linkInBioCardAddForm = document.getElementById('linkInBioCardAddForm' + urlDataId);
        const linkInBioCardForm = document.querySelector('#linkInBioCardForm' + urlDataId);
        const cancelButtonID = document.querySelector('#cancel' + urlDataId);

        if (linkInBioCardAddForm.classList.contains('d-none')) {
            linkInBioCardAddForm.classList.remove('d-none');
            linkInBioCardForm.classList.add('d-none');
            linkInBioCardAddForm.style.cursor = 'default';
        } else {
            linkInBioCardAddForm.classList.add('d-none');
            linkInBioCardForm.classList.remove('d-none');
        }

        if (cancelButtonID) {
            cancelButtonID.addEventListener('click', (event) => {
                event.preventDefault();
                linkInBioCardAddForm.style.cursor = 'auto';
                linkInBioCardAddForm.classList.add('d-none');
                linkInBioCardForm.classList.remove('d-none');

            });
        }

        // 
        // this.ajaxDatile(urlDataId);

    }

    handleEditcardClick(event) {
        const clickedEditcard = event.target.closest('.linkinbio-editcard');
        if (clickedEditcard) {
            const urlDataId = clickedEditcard.getAttribute('data-linkinbio-editcard');
            this.updateLinkForm(urlDataId);

            this.ajaxDatile(urlDataId);
        }

    }


}

export default createFormLinks