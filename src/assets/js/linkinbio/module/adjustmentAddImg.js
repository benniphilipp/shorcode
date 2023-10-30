import { getCookie } from './getCookie';
import profileImageView from './adjustmentViewImg';
import { clearContent, lsToast } from './lsToast';

class adjustmentAddImg{

    constructor(){
        this.cropperContainer = document.getElementById('cropper-container');
        this.cropperImage = document.getElementById('cropper-image');
        this.cropper;

        this.csrftoken = getCookie('csrftoken');
        this.event(); 
        this.cropper;
    }

    event(){
        const openModelButton = document.querySelector('#openMoadlImage');
        if(openModelButton){
            openModelButton.addEventListener('click', this.openModalImage.bind(this));
        }

        const imageInput = document.getElementById('image-input');
        if(imageInput){
            imageInput.addEventListener('change', (event) => {
                this.imageInputCropping(event);
            });
        }

        const cropButton = document.querySelector('#crop-button');
        if(cropButton){
            cropButton.addEventListener('click', (event) => {
                this.imageSaveCropper(event);
            });
        }

    }

    // Open Modal
    openModalImage(){
        $('#exampleModalImage').modal('show');
    }

    // Cropping Image
    imageInputCropping(event) {
        const imageInput = document.querySelector('#image-input');
        const img_data = imageInput.files[0];
        const url = URL.createObjectURL(img_data);

        const imageDiv = document.querySelector('#cropper-container');
        imageDiv.classList.remove('d-none');

        // Das Bild mit der ID 'image' in das imageBox-Element einfügen
        this.cropperContainer.innerHTML = `<img src="${url}" id="image" width="700px">`;
        const image = document.querySelector('#image');
        // Den Cropper.js initialisieren
        this.cropper = new Cropper(image, {
            aspectRatio: 1000/1000,
            crop: function(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
            }
        });    
    }

    imageSaveCropper() {
        const self = this;
        if (this.cropper) {
            
            this.cropper.getCroppedCanvas().toBlob((blob) => {
                if (blob) {
                    const urlData = document.querySelector('#ImageProfileAdjustment');
                    
                    if (urlData) {
                        const formData = new FormData();
                        const randomFileName = `image_${Math.floor(Math.random() * 1000000)}.png`;
                        formData.append('image', blob, randomFileName);
    
                        $.ajax({
                            type: 'POST',
                            url: urlData.value,
                            enctype: 'multipart/form-data',
                            data: formData,
                            headers: {
                                'X-CSRFToken': this.csrftoken 
                            },
                            success: function(response) {
                                lsToast(response.message);
                                $('#exampleModalImage').modal('hide');
                                this.profileImageView = new profileImageView();

                                const imageInput = document.querySelector('#image-input');
                                imageInput.value = '';

                                const imageDiv = document.querySelector('#cropper-container');
                                imageDiv.classList.add('d-none');

                            },
                            error: function(error) {
                                console.log('error', error);
                            },
                            contentType: false,
                            processData: false,
                        });
                    } else {
                        console.error('Element mit ID "ImageProfileAdjustment" nicht gefunden.');
                    }
                } else {
                    console.error('Fehler beim Erstellen des Blob für das Bild.');
                }
            }, 'image/png');
        } else {
            console.error('Bild-Element nicht gefunden.');
        }
    }


}

export default adjustmentAddImg;
