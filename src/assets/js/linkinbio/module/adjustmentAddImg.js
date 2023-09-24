import { getCookie } from './getCookie';

class adjustmentAddImg{

    constructor(){
        this.cropperContainer = document.getElementById('cropper-container');
        this.cropperImage = document.getElementById('cropper-image');
        this.cropper;

        this.csrftoken = getCookie('csrftoken');
        this.event(); 
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
    
        // Das Bild mit der ID 'image' in das imageBox-Element einfügen
        this.cropperContainer.innerHTML = `<img src="${url}" id="image" width="700px">`;
    
        // Den Cropper.js initialisieren
        const image = document.querySelector('#image');
        const cropper = new Cropper(image, {
            aspectRatio: 1/1,
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
    
        // Zugriff auf den Cropper

       
    }

    imageSaveCropper() {
        const image = document.querySelector('#image');
    
        if (image) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            canvas.width = image.width;
            canvas.height = image.height;
    
            // Zeichne das Bild auf das Canvas
            ctx.drawImage(image, 0, 0, image.width, image.height);
    
            // Das Bild aus dem Canvas in ein Blob umwandeln
            canvas.toBlob((blob) => {
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
                                console.log('success', response);
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
