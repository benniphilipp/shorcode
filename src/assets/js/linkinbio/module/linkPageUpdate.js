import { getCookie } from './getCookie';
import { clearContent, lsToast } from './lsToast';

class linkPageUpdate {
    constructor() {
        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event() {
        const updateLinkinbioPages = document.querySelectorAll('.update-linkinbio-page');
        if(updateLinkinbioPages){
            updateLinkinbioPages.forEach((button) => {
                button.addEventListener('click', (event) => {
                    this.openFormData(event);
                });
            });
        }

        const updateBtnJson = document.querySelectorAll('#updateBtnJson');
        if(updateBtnJson){
            updateBtnJson.forEach((button) => {
                button.addEventListener('click',(event) =>{
                    this.updateFormLinkinbio(event);
                }); 
            });
        }

    }

    // Open Form data View
    openFormData(event) {
        const button = event.target.closest('.update-linkinbio-page');

        if (button.classList.contains('update-linkinbio-page')) {
            const dataID = button.getAttribute('data-linkinbio-page-id');
            const urlData = document.getElementById('linkinbioJson').value.replace(/0/g, dataID);

            const idTitle = document.querySelector('#id_title');
            const idDescription = document.querySelector('#id_description');
            const linkinbioUpdateId = document.querySelector('#linkinbioUpdateId');

            $.ajax({
                url: urlData,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'X-CSRFToken': this.csrftoken,
                },
                success: function (data) {

                    idTitle.value = data.id_title;
                    idDescription.value = data.id_description;
                    linkinbioUpdateId.value = data.id

                    document.querySelector('#updateBtnJson').classList.remove('d-none')
                    document.querySelector('#saveBtn').classList.add("d-none");
                    document.querySelector('#aside-form').classList.add("toggle");
                    document.querySelector('#overlay-open').classList.add("overlay-open");

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error('Fehler bei der Ajax-Anfrage:', errorThrown);
                }
            });
        }
    }


    updateFormLinkinbio(event){
        event.preventDefault();

        const idTitleValue = document.querySelector('#id_title').value;
        const idDescriptionValue = document.querySelector('#id_description').value;
        const linkinbioUpdateIdValue = document.querySelector('#linkinbioUpdateId').value;

        const urlData = document.getElementById('linkinbioUpdateJson').value.replace(/0/g, linkinbioUpdateIdValue);

        console.log('url ', urlData);
        console.log('Bes ', idDescriptionValue);
        console.log('Tite ', idTitleValue);

        const formData = new FormData();
        formData.append('id_title', idTitleValue);
        formData.append('id_description', idDescriptionValue);

        $.ajax({
            url: urlData,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': this.csrftoken, 
            },
            success: function (data) {
                console.log('Antwort von Server:', data.message);

                document.querySelector('#aside-form').classList.remove("toggle");
                document.querySelector('#overlay-open').classList.remove("overlay-open");

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

export default linkPageUpdate;
