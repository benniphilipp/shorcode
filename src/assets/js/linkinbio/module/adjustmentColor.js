import { getCookie } from './getCookie';
import adjustmentSocial from './adjustmentSocial';

class adjustmentColor{

    constructor(){
        this.csrftoken = getCookie('csrftoken');
        this.jsonData = {};
        this.customeSetitngsAjax();
        this.event();
    }

    event(){}


    saveColorChange(id, color) {

        if(id === "colorButton"){

            const className = "link-page-btn";
            const state = "default";
            const propertyName = "background-color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }else if(id === "colorButtonText"){
            
            const className = "link-page-btn";
            const state = "default";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }else if(id === "colorButtonHover"){

            const className = "link-page-btn";
            const state = "hover";
            const propertyName = "background-color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }else if(id === "colorButtonHoverText"){

            const className = "link-page-btn";
            const state = "hover";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }else if(id === "colorIcon"){

            const className = "fa-brands";
            const state = "default";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }else if(id == "colorIconHover"){

            const className = "fa-brands";
            const state = "hover";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        } else if(id == "colorTextTitel"){

            const className = "titel";
            const state = "default";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        } else{

            const className = "description";
            const state = "default";
            const propertyName = "color";
            const propertyValue = color;
            this.sendCssSettingsToServer(className, state, propertyName, propertyValue);

        }

    }


    createColorPicker() {
        for (const fieldId in this.jsonData) {
            const color = this.jsonData[fieldId];
            const el = document.getElementById(fieldId);

            if (el) {
                el.value = color;
                el.addEventListener('change', (event) => {
                    const newColor = event.target.value;
                    this.saveColorChange(fieldId, newColor);
                });
            }
        }
    }


    sendCssSettingsToServer(className, state, propertyName, propertyValue) {
        const self = this;
        const dataUrlSettings = document.querySelector('#CustomSettingsUpdateView');

        //View senden
        $.ajax({
            url: dataUrlSettings.value,
            method: 'POST',
            data: {
                class_name: className,
                state: state,
                property_name: propertyName,
                property_value: propertyValue,
            },
            headers: {
                'X-CSRFToken': this.csrftoken, 
            },
            success: (data) => {
                //console.log('Erfolgreich an den Server gesendet:', data);

                //Update
                this.adjustmentSocial = new adjustmentSocial();
                self.adjustmentSocial.linkinbioEditScrenn();
                self.customeSetitngsAjax();

            },
            error: function (error) {
                console.error('Fehler beim Senden an den Server:', error);
            }
        });

    }

    customeSetitngsAjax(){
        const self = this;
        const dataUrl = document.querySelector('#CustomSettingsView');

        const pageOne = document.querySelector('#pageOne');
        const loaderImageMobile = document.querySelector('.loader-image-mobile');
        pageOne.classList.add('d-none');
        if(dataUrl){
            loaderImageMobile.classList.remove('d-none');
            
            setTimeout(() => {
                $.ajax({
                    url: dataUrl.value, 
                    method: 'GET',
                    dataType: 'json',
                    success: function (response) {

                        
                        pageOne.classList.remove('d-none');
                        loaderImageMobile.classList.add('d-none');

                        const colorButton = response['link-page-btn']['default']['background-color'];
                        const colorButtonText = response['link-page-btn']['default']['color'];
                        const colorButtonHover = response['link-page-btn']['hover']['background-color'];
                        const colorButtonHoverText = response['link-page-btn']['hover']['color'];
                        const colorIcon = response['fa-brands']['default']['color'];
                        const colorIconHover = response['fa-brands']['hover']['color'];
                        const colorTextTitel = response['titel']['default']['color'];
                        const colorDescriptionTitel = response['description']['default']['color'];

                        self.jsonData = {
                            "colorTextTitel": colorTextTitel,
                            "colorTextTitelInput": colorTextTitel,
                            "colorDescriptionTitel": colorDescriptionTitel,
                            "colorDescriptionTitelInput": colorDescriptionTitel,
                            "colorButton": colorButton,
                            "colorButtonInput": colorButton,
                            "colorButtonText": colorButtonText,
                            "colorButtonTextInput": colorButtonText,
                            "colorButtonHover": colorButtonHover,
                            "colorButtonHoverInput": colorButtonHover,
                            "colorButtonHoverText": colorButtonHoverText,
                            "colorButtonHoverTextInput": colorButtonHoverText,
                            "colorIcon": colorIcon,
                            "colorIconInput": colorIcon,
                            "colorIconHover": colorIconHover,
                            "colorIconHoverInput": colorIconHover
                        };

                        self.createColorPicker()

                        const cssStyles  = response;

                        for (const className in cssStyles) {
                            const elementInfo = cssStyles[className];
                            const elements = document.getElementsByClassName(className);
                    
                            for (const element of elements) {
                                const defaultStyles = elementInfo.default;
                                for (const styleName in defaultStyles) {
                                    element.style[styleName] = defaultStyles[styleName];
                                }
                    
                                // Fügen Sie den Hover-Effekt hinzu
                                element.addEventListener('mouseenter', () => {
                                    const hoverStyles = elementInfo.hover;
                                    if (hoverStyles) {
                                        for (const styleName in hoverStyles) {
                                            element.style[styleName] = hoverStyles[styleName];
                                        }
                                    }
                                });
                    
                                // Entfernen Sie den Hover-Effekt
                                element.addEventListener('mouseleave', () => {
                                    for (const styleName in defaultStyles) {
                                        element.style[styleName] = defaultStyles[styleName];
                                    }
                                });
                            }
                        }
        
                        
                    },
                    error: function (error) {
                        console.error('Fehler beim Abrufen der Einstellungen:', error);
                    }
                });
            }, 2000);

        }
    }

    

}

export default adjustmentColor;