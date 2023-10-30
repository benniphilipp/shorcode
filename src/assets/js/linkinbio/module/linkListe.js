import { getCookie } from './getCookie';

class linkListe{

    constructor(){
        this.LinkInBioLinksListView = document.querySelector('#LinkInBioLinksListView');

        if(this.LinkInBioLinksListView){
            this.cardContainer = document.querySelector('#card-container');
            this.loaderImage = document.querySelector('.loader-image');
            this.urlForm = document.querySelector('#valueUrlSort').value;
        }

        this.isListViewRendered = false;
        this.csrftoken = getCookie('csrftoken');
        this.initSortable();

        this.isListViewRendered = false;
        this.linklistview();
    }

    events(){}

    renderCard(link) {
        const switchId = `flexSwitchCheck${link.is_aktiv ? 'Active' : 'Inactive'}`;
        const trashUrl = document.getElementById('deleteLinkinLink').value.replace(/0/g, link.id);
        return `
        <div class="card border-0 shadow-sm mb-3 sortable-grabel sortable-item" data-id="${link.id}">
            <div class="card-body">
                <div class="row" id="linkInBioCardForm${link.id}">
                    <div class="col-1">
                        <div class="d-flex mb-3 linkin-bio-hover align-items-center h-100">
                            <i class="fa-solid fa-grip-vertical"></i>
                        </div>
                    </div>
                    <div class="col-11">
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="mb-0">${link.button_label}</h5>
                            <div>
                                <button type="button" class="btn btn-primary btn-sm linkinbio-editcard" data-linkinbio-editcard="${link.id}"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" data-toggle="modal" data-target="#exampleModal" class="btn btn-danger btn-sm linkinbio-trash" data-url-trash="${trashUrl}" data-linkinbio-editcard="${link.id}" data-linkinbio-titel="${link.button_label}"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="d-flex mt-3">
                            <a class="linkinbio" href="${link.url_destination}" target="_blank">${link.url_destination}</a>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-chart-line linkinbio-icon"></i>
                                <small class="mx-2 textsmall">1</small>
                            </div>
                            <div class="form-check form-switch d-flex justify-content-end">
                                <input class="form-check-input linkinbio-switch" data-linkinbio-switch="${link.id}" type="checkbox" role="switch" id="${switchId}" ${link.is_aktiv ? 'checked' : ''}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }


    // ListViewLinks
    linklistview(){
        if (this.LinkInBioLinksListView && !this.isListViewRendered) {
            this.isListViewRendered = true;

            $(this.cardContainer).empty();
            this.loaderImage.classList.remove('d-none');

            setTimeout(() => {
                $.ajax({
                url: this.LinkInBioLinksListView.value,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    // empty list              
                    for (var i = 0; i < data.links.length; i++) {
                        var link = data.links[i];
                        var card = this.renderCard(link);
                        $(this.cardContainer).append($(card));

                    }
                    $(this.loaderImage.classList.add('d-none'));
           
                },
                error: (xhr, textStatus, errorThrown) => {
                    console.error('Fehler:', errorThrown);
                }
                });
            }, 1000);
        }
    }


    initSortable() {
        const self = this;

        $(this.cardContainer).sortable({
            axis: 'y',
            update: function (event, ui) {
                const sortedLinks = $(this).find('.sortable-item').map(function () {
                    return $(this).attr('data-id');
                }).get();

                self.saveSortOrder(sortedLinks);
            },
        });

        $(this.cardContainer).disableSelection();
    }

    saveSortOrder(sortedLinks) {
        $.ajax({
            url: this.urlForm,
            type: 'POST',
            data: { sorted_links: sortedLinks },
            headers: {
                'X-CSRFToken': this.csrftoken,
            },
            success: function (data) {
                console.log('Reihenfolge erfolgreich gespeichert.');
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Fehler beim Speichern der Reihenfolge:', errorThrown);
            },
        });
    }

}

export default linkListe

