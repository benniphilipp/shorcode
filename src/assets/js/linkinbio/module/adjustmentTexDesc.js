import { getCookie } from './getCookie';
import { clearContent, lsToast } from './lsToast';

class adjustmentTexDesc{

    constructor(){

        this.csrftoken = getCookie('csrftoken');

        // Titel
        this.inputFieldTitel = document.getElementById('formGroupTitelInput');
        this.charCountTitel = document.getElementById('charCountTitel');

        if (this.inputFieldTitel) {
            this.inputFieldTitel.addEventListener('input', (event) => {
                this.typingLengthTitel(event);
            });
        }

        // Description
        this.inputFieldDescription = document.getElementById('formdescriptionInput');
        this.charCount = document.getElementById('charCount');

        if (this.inputFieldDescription) {
            this.inputFieldDescription.addEventListener('input', (event) => {
                this.typingLengthDescription(event);
            });
        }

        // Zielfeld
        this.titelPageValue = document.querySelector('#titelpageValue');
        this.descriptionPageValue = document.querySelector('#descriptionPageValue');
 
        // Description
        if(this.inputFieldDescription && descriptionPageValue){
            this.inputFieldDescription.addEventListener('input', () => {
                this.valueDescriptionTransferred();
            });
        }

        // Text
        if (this.inputFieldTitel && this.titelPageValue) {
            this.inputFieldTitel.addEventListener('input', () => {
                this.valueTransferred();
            });
        }

        // Save Text and Description
        this.textSaveBtn = document.querySelector('#textSaveBtn');
        if(this.textSaveBtn){
            textSaveBtn.addEventListener('click', () => {
                this.saveTextDescription();
            });
        }

        this.event();
    }

    event(){
        const detailePage = document.querySelector('#TexteDeatileAdjustmentView');
        if(detailePage){
            this.detaileViewText();
        }
        
    }

    // Detaile View Text
    detaileViewText(){
        const UrlDatile = document.querySelector('#TexteDeatileAdjustmentView');

        $.ajax({
            url: UrlDatile.value,
            type: 'GET',
            dataType: 'json',
            success: (data) => {

                this.titelPageValue.textContent = data[0].title;
                this.inputFieldTitel.value = data[0].title;
                this.inputFieldDescription.value = data[0].description;
                this.descriptionPageValue.textContent = data[0].description;
                
            },
            error: (xhr, textStatus, errorThrown) => {
              console.error('Fehler:', errorThrown);
            }
        });

    }

    // Save funktion Texte Description
    saveTextDescription(){
        const urlData = document.querySelector('#TexteCreateAdjustmentView');

        const inputFieldTitelValue = this.inputFieldTitel.value;
        const inputFieldDescriptionValue = this.inputFieldDescription.value;

        const formData = new FormData();
        formData.append('title', inputFieldTitelValue);
        formData.append('description', inputFieldDescriptionValue);

        $.ajax({
            type: 'POST',
            url: urlData.value,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': this.csrftoken 
            },
            success: function (data) {
                console.log(data);
                lsToast(data.message);
            },
            error: function (xhr, status, error) {
                console.error('Fehler:', status, error);
            }
        });

    }


    // Titel
    typingLengthTitel(){
        const text = this.inputFieldTitel.value;
        const remainingCharacters = 34 - text.length;

        if (remainingCharacters < 0) {
            this.inputFieldTitel.value = text.slice(0, 34);
            this.charCountTitel.textContent = '34 / 34 characters';
        } else {
            this.charCountTitel.textContent = text.length + ' / 34 characters';
        }
    }

    // Description
    typingLengthDescription(){
        const text = this.inputFieldDescription.value;
        const remainingCharacters = 34 - text.length;

        if (remainingCharacters < 0) {
            this.inputFieldDescription.value = text.slice(0, 80);
            this.charCount.textContent = '80 / 80 characters';
        } else {
            this.charCount.textContent = text.length + ' / 80 characters';
        }
    }

    // Text Value Transfer
    valueTransferred(){
        const valueWert = this.inputFieldTitel.value;
        this.titelPageValue.textContent = valueWert;
    }

    // Description Value Transfer
    valueDescriptionTransferred(){
        const valueWert = this.inputFieldDescription.value;
        this.descriptionPageValue.textContent = valueWert;
    }


}

export default adjustmentTexDesc;