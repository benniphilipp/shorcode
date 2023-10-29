import { getCookie } from './getCookie';
import linkListe from './linkListe';
import adjustmentSocial from './adjustmentSocial';
import adjustmentColor from './adjustmentColor';
import { clearContent, lsToast } from './lsToast';

class linkDelete{
    constructor(){
        this.linkList = new linkListe();
        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event(){
        const linkinbioEditcardContainer = document.querySelector('#card-container');
        
        if (linkinbioEditcardContainer) {
            linkinbioEditcardContainer.addEventListener('click', (event) => {
                this.handlerOpenModal(event);
            });
        }

        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', this.handlerCloseModal.bind(this));
        }

        const btnTrash = document.querySelector('.btn-trash');
        if(btnTrash){
            btnTrash.addEventListener('click', (event) => {
                this.deleteLinkInBio(event);
            });
        }

    }

    handlerOpenModal(event){

        const button = event.target.closest('.linkinbio-trash');

        if (button.classList.contains('linkinbio-trash')) {
            $('#exampleModal').modal('show');
            const urlTrash = button.getAttribute('data-url-trash');
            const linkinbioEditcard = button.getAttribute('data-linkinbio-editcard');
            const linkinbioTitel = button.getAttribute('data-linkinbio-titel');
    
            const exampleModalLabel = document.querySelector('#exampleModalLabel');
            exampleModalLabel.textContent = linkinbioTitel;

            const idContent = document.querySelector('#idContent');
            const contentItem = document.createElement('p');
            contentItem.textContent = ' Möchten Sie" ' + linkinbioTitel + ' "Löschen';

            $(idContent).append(contentItem);

            const saveChangesButton = document.querySelector('.modal-footer .btn-trash');
            saveChangesButton.setAttribute('data-url-trash', urlTrash);
            saveChangesButton.setAttribute('data-linkinbio-editcard', linkinbioEditcard);   
        }
    }
    

    handlerCloseModal(){
        const exampleModalLabel = document.querySelector('#exampleModalLabel');
        if(exampleModalLabel){
            $('#exampleModal').modal('hide');
            exampleModalLabel.textContent = '';

            const idContent = document.querySelector('#idContent');
            idContent.innerHTML = '';
        }

    }



    deleteLinkInBio(event){
        event.preventDefault();
        const self = this;

        this.linkList = new linkListe();
        this.adjustmentSocial = new adjustmentSocial();
        this.adjustmentColor = new adjustmentColor();

        const button = event.target.closest('.btn-trash');
        
        if (button.classList.contains('btn-trash')) {
            const ulrTrash = button.getAttribute('data-url-trash');

            console.log(ulrTrash)
            $.ajax({
                url: ulrTrash,
                type: 'POST',
                dataType: 'json',
                headers: {
                    'X-CSRFToken': this.csrftoken, 
                },
                success: (data) => {
                    console.log('Antwort von Server:', data);

                    const exampleModalLabel = document.querySelector('#exampleModalLabel');
                    exampleModalLabel.textContent = '';
                    const contentItem = document.querySelector('#idContent');
                    contentItem.textContent = '';

                    $('#exampleModal').modal('hide');

                    // Link liste neue laden
                    self.linkList.linklistview();
                    self.adjustmentSocial.linkinbioEditScrenn();
                    self.adjustmentColor.customeSetitngsAjax();
                    lsToast(data.message);

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error('Fehler bei der Ajax-Anfrage:', errorThrown);
                }
            });



        }


    }


}

export default linkDelete