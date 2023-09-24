import { getCookie } from './getCookie';

class adjustmentRemoImg {

    constructor(){
        this.csrftoken = getCookie('csrftoken');
        this.event();
    }

    event(){
        const openModelDelte = document.querySelector('#openModelDelte');
        if(openModelDelte){
            openModelDelte.addEventListener('click', (event) => {
                this.openDeleteModalImage(event);
            });
        }
        const imageProfileDeleteBtn = document.querySelector('#imageProfileDeleteBtn');
        if(imageProfileDeleteBtn){
            imageProfileDeleteBtn.addEventListener('click', (event) => {
                this.profileImageDelete(event);
            });
        }
    }

    openDeleteModalImage(){
        console.log('Run Model');
        $('#exampleModalImageDelete').modal('show');
    }

    profileImageDelete(event){

        const urlData = document.querySelector('#ImageProfileAdjustment');

        const dummyImageBlob = new Blob([''], { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', dummyImageBlob, 'profile_image.png');
        
        $.ajax({
            type: 'POST',
            url: urlData.value,
            enctype: 'multipart/form-data',
            data: formData,
            headers: {
                'X-CSRFToken': this.csrftoken 
            },
            success: function(response) {
                console.log('success', response);
            },
            error: function(error) {
                console.log('error', error);
            },
            contentType: false,
            processData: false,
        });
    }

}

export default adjustmentRemoImg;