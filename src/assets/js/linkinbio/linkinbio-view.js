
class LinkInBioView {
    constructor(){
        const dataUrl = document.querySelector('#LinkInBioDeatilePage');
        if(dataUrl){
            this.ajaxView(dataUrl)
        }
    }

    ajaxView(dataUrl){
        $.ajax({
            url: dataUrl.value,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
            console.log(data);

            $('#descriptionPageValue').text(data.context_json.description);
            $('#titelpageValue').text(data.context_json.title);

            // Rendern der URL-Social-Profile
            const urlSocialProfilesContainer = $('#urlSocialProfilesContainer');
            urlSocialProfilesContainer.empty();

            data.social_media_data.forEach((profile) => {
                const profileElement = `
                <li>
                    <a href="${profile.url}">
                        <i class="fa-brands ${profile.platform}"></i>
                    </a>
                </li>
                `;
                urlSocialProfilesContainer.append(profileElement);
            });


            // Rendern der Link-in-Bio-Links
            const linkInBioLinksContainer = $('#linkInBioLinksContainer');
            linkInBioLinksContainer.empty();
            
            data.links.forEach((link) => {
                const linkElement = `
                    <a class="link-page-btn link-btn-color" href="${link.url_destination}">${link.button_label}</a>
                `;
                linkInBioLinksContainer.append(linkElement);
            });

            //Image
            const pageImage = document.querySelector('.page-image');
            const newImageUrl = data.image[0].profile_image;
            pageImage.src = newImageUrl;


            const cssStyles  = data['settings_json_data'];

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
            error: function(error) {
              console.error('Fehler beim Abrufen der Daten: ' + error);
            }
        });
    }

}

export default LinkInBioView;

const linkinbioview = new LinkInBioView();