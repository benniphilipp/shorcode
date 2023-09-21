import { getCookie } from './getCookie';

class createFormLinks {

    constructor(){
        this.labelUpdate = document.querySelector('#labelUpdate');
        this.urlDestinationUpdate = document.querySelector('#urlDestinationUpdate');
        this.shortcodeId = document.querySelector('#shortcodeId');

        // Formular Switch
        this.createShorcodeUpdate = document.querySelector('#createShorcodeUpdate');
        this.createSearchUpdate = document.querySelector('#createSearchUpdate');
        
        // Event-Handling Dynamic
        this.linkinbioEditcardContainer = document.querySelector('#card-container'); 

        // Form View Place
        this.formPlace = document.querySelector('.form-place');
        this.linkinbioEditcard = document.querySelectorAll('.linkinbio-editcard');
        this.linkInBioCardAddForm = document.querySelector('#linkInBioCardAddForm');
        this.linkInBioCardForm = document.querySelector('#linkInBioCardForm');
        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event(){
        const linkinbioEditcardContainer = document.querySelector('#card-container'); 
        if(linkinbioEditcardContainer){
            this.linkinbioEditcardContainer.addEventListener('click', this.handleEditcardClick.bind(this));
            this.linkinbioEditcardContainer.addEventListener('click', this.handleFormPlace.bind(this));
            //this.linkinbioEditcardContainer.addEventListener('click', this.handleUpdateForm.bind(this));
        }
    }

    // rednerForm
    rednderUpdateForm(formPlaceId){
        return `
        <input type="hidden" id="linkInBioLinkUrlDatile${formPlaceId}" value="${formPlaceId}">
        <div id="createlinkinbio" class="card shadow-sm border-0 mb-3">
            <div class="card-body">

            <div class="d-flex flex-row align-items-center mb-3">
                <input class="form-check-input p-2 m-2" type="checkbox" id="createShorcodeUpdate" value="option1" checked>
                <label class="form-check-label" for="createShorcodeUpdate">Update Llinkb link</label>
            
                <input class="form-check-input p-2 m-2" type="checkbox" id="createSearchUpdate" value="option1">
                <label class="form-check-label" for="createSearchUpdate">Create new Llinkb link</label>
            </div>

            <!--Url Shortcode Update-->
            <form style="display: block;" action="$" id="form-create-shorcode-update">
                <div class="mb-3">
                    <label for="urlDestinationUpdate" class="form-label">Url</label>
                    <input type="text" class="form-control mb-3" id="urlDestinationUpdate" value="$">
                    <input type="hidden" id="linkInBioPageId" value="$">
                    <input type="hidden" id="shortcodeId" value="$">
                    <button type="submit" class="btn btn-primary btn-sm">Create</button>
                </div>
            </form>

            <!--Crate Shortcode-->
            <form id="form-create-link-update" style="display: none;" action="" method="POST">
                <div class="mb-3">
                    <label for="cratedhortcode" class="form-label">Url</label>
                    <input type="text" class="form-control mb-3" id="selectShortcode" placeholder="Create new link">
                    <input type="hidden" id="linkinbio_page_id" value="">
                    <input type="hidden" id="shortcode_id" value="">
                    <button type="submit" class="btn btn-primary btn-sm">Create</button>
                </div>
            </form>

            </div>
        </div>
        `;
    }

    // Update Form View
    updateLinkForm(formPlaceId){

        const formIdDiv = document.querySelector('.linkinbio-form-place'+formPlaceId);
        const formHtml = this.rednderUpdateForm(formPlaceId);
        $(formIdDiv).append(formHtml);

        const urlDetaileUpdatefield = document.querySelector('#linkInBioLinkUrlDatile'+formPlaceId);
        const urlDetaileUpdateValue = urlDetaileUpdatefield.value;

        const updateUrl = document.querySelector('#viewUrlLinks').value.replace('0', urlDetaileUpdateValue);

        console.log('Url', updateUrl);

        $.ajax({
            url: updateUrl,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRFToken': this.csrftoken
            },
            success: function(data) {
                console.log(data);   
            },
            error: function() {
                console.log('Fehler beim Abrufen der Daten');
            }
        });

        // Form
    
        

    }

    // Insite Formular
    insiteFormular(clickId) {    
        const linkClassOpenform = document.querySelector('#linkInBioCardAddForm' + clickId);
        const linkInBioCardForm = document.querySelector('#linkInBioCardForm' + clickId);
        const cancelButton = document.querySelector('#cancel' + clickId);

        if (linkClassOpenform) {
            if (linkClassOpenform.classList.contains('d-none')) {
                linkClassOpenform.classList.remove('d-none');
                linkInBioCardForm.classList.add('d-none');
            } else {
                linkClassOpenform.classList.add('d-none');
                linkInBioCardForm.classList.remove('d-none');
            }
        }

        cancelButton.addEventListener('click', () => {
            if (!linkClassOpenform || !linkInBioCardForm) {
                return;
            }

            linkClassOpenform.classList.add('d-none');
            linkInBioCardForm.classList.remove('d-none');

        });

    }

    // Id Form
    handleEditcardClick(event) {
        const clickedEditcard = event.target.closest('.linkinbio-editcard');
        if (clickedEditcard) {
            const urlDataId = clickedEditcard.getAttribute('data-linkinbio-editcard');
            this.insiteFormular(urlDataId);
            console.log(urlDataId)
        }
    }

    handleFormPlace(event){
        const dataFormPlace = event.target.closest('.form-place');
        if(dataFormPlace){
            const formPlaceId = dataFormPlace.getAttribute('data-form-place');
            this.updateLinkForm(formPlaceId);
            console.log('Link ID ',formPlaceId)
        }
    }

    // handleUpdateForm(event){
    //     event.preventDefault();
    //     const formCreateLinkUpdate = document.querySelector('#form-create-shorcode-update');
    //     console.log(formCreateLinkUpdate);
    //     // const dataFormPlace = event.target.closest('action');
    //     // if(dataFormPlace){
    //     //     const formPlaceId = dataFormPlace.getAttribute('data-form-place');
    //     //     this.postUpdateForm(formPlaceId);
    //     // }
    // }



    // $('#card-container').on('click', '.form-place', function(){
    //     var linkFormId = $(this).data('form-place');
    //     // console.log(linkFormId);
    //     insertFormLinkInBio(linkFormId);
    // });


    // Fromualr Update link

    // Formular Switch
    // $('#card-container').on('change', '#createShorcodeUpdate', function() {
    //     if ($(this).is(':checked')) {
    //         $('#form-create-shorcode-update').show();
    //         $('#form-create-link-update').hide();
    //         $('#createSearchUpdate').prop('checked', false);
    //     }
    // });

    // $('#card-container').on('change', '#createSearchUpdate', function() {
    //     if ($(this).is(':checked')) {
    //         $('#form-create-shorcode-update').hide();
    //         $('#form-create-link-update').show();
    //         $('#createShorcodeUpdate').prop('checked', false);
    //     }
    // });

    // Check Formular Crate and Update Shorcode links

}

export default createFormLinks