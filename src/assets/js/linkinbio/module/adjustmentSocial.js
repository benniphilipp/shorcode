/*
Speichern und TODOs:

Mitteilung das gespeichert ist
Auswahl alle Icons nur 1 Mal View anpassen erledig!
Sortierung auf und Up
Daten Ansicht Bearbeitung erledig!
Sozial Profile Update
Löschen der Links

*/

import { getCookie } from './getCookie';

class adjustmentSocial {

    constructor() {

        this.sozialprofilelist();

        this.csrftoken = getCookie('csrftoken');

        this.addElementButton = document.querySelector('#addElementButton');
        if (this.addElementButton) {
            this.addElementButton.addEventListener('click', () => {
                this.addSocialMediaPlatforms();
            })
        }

        const elementContainer = document.querySelector('#elementContainer');
        if (elementContainer) {
            elementContainer.addEventListener('change', this.handleSelectChange.bind(this));
            elementContainer.addEventListener('input', this.handleInput.bind(this));
        }

        this.uniqueIdCounter = 0;
        this.selectedPlatform = null;
        this.inputFieldId = null;

    }

    handleSelectChange(event) {
        const select = event.target;
        if (select.tagName === 'SELECT') {
            const selectedOption = select.options[select.selectedIndex];
            const selectedPlatform = selectedOption.getAttribute('data-platform');
            const uniqueId = select.id.replace('socialSelectFieldId', '');
    
            // Jetzt kannst du mit den ausgewählten Informationen arbeiten
            console.log('Ausgewählte Plattform:', selectedPlatform);
            console.log('UniqueId:', uniqueId);
    
            const relatedUrlInput = document.getElementById(`urlSocial${uniqueId}`);
            // relatedUrlInput.classList.add(selectedPlatform);
            relatedUrlInput.classList.add(this.selectedPlatform);
            this.selectedPlatform = selectedPlatform;
        }
    }

    handleInput(event) {
        const inputField = event.target;
        const enteredURL = inputField.value;

        if (this.selectedPlatform) {
            // Validieren Sie die eingegebene URL für die ausgewählte Plattform

            if (this.validateURL(this.selectedPlatform, enteredURL)) {
                console.log(`Die URL für ${this.selectedPlatform} ist gültig`);
                // Daten speichern
                this.saveData(this.selectedPlatform, enteredURL); 
            } else {
                console.log(`Die URL für ${this.selectedPlatform} ist ungültig`);
            }
        }

    }


    // Methode zum Speichern der Daten
    saveData(selectedPlatform, enteredURL) {
        if (selectedPlatform && enteredURL) {
        // Überprüfen, ob sowohl Plattform als auch URL vorhanden sind

        var link_in_bio_id = $('#linkinbio_page_id_custome').val();
        const urlSocialForm = $('#urlSocial').val();

        $.ajax({
            url: urlSocialForm,  // Ersetze durch die richtige URL zur View
            type: 'POST',
            data: {
                url_social: enteredURL,
                link_in_bio_id: link_in_bio_id,
                social_media_platform: selectedPlatform
            },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: function(data) {
                if (data.success) {
                    console.log('URL erfolgreich gespeichert.');
                    // Hier kannst du weitere Aktionen ausführen, z.B. die Seite aktualisieren
                } else {
                    console.error('Fehler beim Speichern der URL:', data.message);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der URL:', errorThrown);
            }
        });

        }
    }


    // Funktion zur Validierung der URL für die ausgewählte Plattform
    validateURL(platform, url) {
        switch (platform) {
            case 'Facebook':
                return this.isFacebookURL(url);
            case 'Instagram':
                return this.isInstagramURL(url);
            // Fügen Sie weitere Plattformen hinzu, wenn benötigt
            default:
                return false;
        }
    }

    // Validierungsfunktion für Facebook
    isFacebookURL(url) {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.*/i;
        return facebookRegex.test(url);
    }

    // Validierungsfunktion für Instagram
    isInstagramURL(url) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/.*/i;
        return instagramRegex.test(url);
    }

    elementSocial(uniqueId) {

        return `
        <div class="card border-0 mt-4 p-3 shadow-sm">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col-sm-1 d-flex justify-content-start align-items-center">
                        <i class="fa-solid fa-grip-vertical"></i>
                    </div>
                    <div class="col-sm-5">
                        <select class="form-select platform-select" id="socialSelectFieldId${uniqueId}" name="platform">
                            <!-- Optionen werden hier dynamisch hinzugefügt -->
                        </select>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <input type="text" class="form-control url_social" id="urlSocial${uniqueId}" placeholder="Url">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    addSocialMediaPlatforms() {
        const elementContainer = document.querySelector('#elementContainer');
        const UrlDataView = document.querySelector('#getSocialMdiaPlatforms');


        const newElement = this.elementSocial(this.uniqueIdCounter);
        $(elementContainer).append($(newElement));

        this.uniqueIdCounter++;
        const link_in_bio_id = $('#linkinbio_page_id_custome').val();
        $.ajax({
            url: UrlDataView.value,
            type: 'GET',
            dataType: 'json',
            data: {
                link_in_bio_page_id: link_in_bio_id,
            },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: function (data) {
                // Finde das <select> im neuen Element
                var select = $('#elementContainer').find('.platform-select').last();
                $.each(data.platforms, function (index, platform) {
                    var option = $('<option>', {
                        value: platform.id,
                        text: platform.name,
                        'data-platform': platform.name
                    });

                    option.addClass('platform');
                    select.append(option);
                });

                select.prepend($('<option>', {
                    value: '',
                    text: 'Bitte wählen Sie eine Plattform'
                }));
                select.val('');

            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Fehler:', errorThrown);
            }
        });
    }

    // View list urls
    sozialprofilelist() {
        const urlData = document.querySelector('#UrlSocialProfilesViewList');
        const elementContainer = document.querySelector('#elementContainer');
    
        $.ajax({
            url: urlData.value,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log(data);
    
                // Löschung aller vorhandenen Elemente im Container
                elementContainer.innerHTML = '';
    
                // Durchlaufe die Daten und erstelle Elemente für alle Profile
                data.social_media.forEach((profile) => {
                    const newElement = this.UpdateelementSocial(profile.platform, profile.url, profile.id, profile.selected);
                    elementContainer.insertAdjacentHTML('beforeend', newElement);
                });
            },
            error: (xhr, textStatus, errorThrown) => {
                console.error('Fehler:', errorThrown);
            }
        });
    }
    
    // Element list view urls
    UpdateelementSocial(platform, url, id, selected) {
        const selectFieldId = `socialSelectFieldId${id}`;
        const selectedAttribute = selected ? 'selected' : '';
        return `
        <div class="card border-0 mt-4 p-3 shadow-sm">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col-sm-1 d-flex justify-content-start align-items-center">
                        <i class="fa-solid fa-grip-vertical"></i>
                    </div>
                    <div class="col-sm-5">
                        <select class="form-select update-platform-select" id="${selectFieldId}">
                            <option value="${platform}" data-platform="${platform}" ${selectedAttribute}>${platform}</option>
                        </select>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <input type="text" class="form-control url_social" id="urlSocial${id}" value="${url}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    
    
    
    


}

export default adjustmentSocial;