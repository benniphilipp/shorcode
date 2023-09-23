import { getCookie } from './getCookie';
import { clearContent, lsToast } from './lsToast';

class linkPageDelete{

    constructor(){
        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event(){
        const deleteLinkinbioPage = document.querySelectorAll('.delete-linkinbio-page');

        if(deleteLinkinbioPage){
            deleteLinkinbioPage.forEach((button) => {
                button.addEventListener('click',(event) =>{
                    this.openModalDeleteForm(event);
                }); 
            });
        }

        const btnDelete = document.querySelector('.btn-delete');
        if(btnDelete){
            btnDelete.addEventListener('click', (event) => {
                this.delteModelForm(event);
            });
        }

    }

    openModalDeleteForm(event){
        const button = event.target.closest('.delete-linkinbio-page');
        console.log(button);

        if(button.classList.contains('delete-linkinbio-page')){
            const dataID = button.getAttribute('data-linkinbio-page-delete-id');
            const dataLinkinbioPageTitel = button.getAttribute('data-linkinbio-page-titel');
            const linkinbioDeleteJson = document.querySelectorAll('#linkinbioDeleteJson');

            const urlData = document.getElementById('linkinbioDeleteJson').value.replace(/0/g, dataID);
        
            $('#exampleModalDelete').modal('show');
            const idContent = document.querySelector('#idContent');
            const contentItem = document.createElement('p');
            contentItem.textContent = ' Möchten Sie" ' + dataLinkinbioPageTitel + ' "Löschen';

            const saveChangesButton = document.querySelector('.modal-footer .btn-delete');
            saveChangesButton.setAttribute('data-url-delete', urlData);

            $(idContent).append(contentItem);
        }
    }

    
    delteModelForm(event){
        const button = event.target.closest('.btn-delete');

        if(button.classList.contains('btn-delete')){
            const ulrTrash = button.getAttribute('data-url-delete');

            $.ajax({
                url: ulrTrash,
                type: 'POST',
                dataType: 'json',
                headers: {
                    'X-CSRFToken': this.csrftoken, 
                },
                success: function (data) {
                    console.log('Antwort von Server:', data);

                    $('#exampleModal').modal('hide');

                    lsToast(data.message);
                    
                    setTimeout(function() {
                        location.reload();
                    }, 300);

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error('Fehler bei der Ajax-Anfrage:', errorThrown);
                }
            });

        }
    }


}

export default linkPageDelete