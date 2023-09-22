
class linkListe{

    constructor(){
        this.LinkInBioLinksListView = document.querySelector('#LinkInBioLinksListView');
        this.cardContainer = document.querySelector('#card-container');
        this.loaderImage = document.querySelector('.loader-image');
        
        this.isListViewRendered = false;
        this.linklistview();
    }

    events(){}

    renderCard(link) {
        return `
        <div class="card border-0 shadow-sm mb-3 sortable-grabel">
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
                            <button type="button" class="btn btn-primary btn-sm linkinbio-editcard" data-linkinbio-editcard="${link.id}"><i class="fa-solid fa-pen"></i></button>
                        </div>
                        <div class="d-flex mt-3">
                            <a class="linkinbio" href="${link.url_destination}" target="_blank">${link.url_destination}</a>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-chart-line linkinbio-icon"></i>
                                <small class="mx-2 textsmall">1</small>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input linkinbio-switch" data-linkinbio-switch="${link.id}" type="checkbox" role="switch" id="flexSwitchCheckDefault">
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
      
            $.ajax({
              url: this.LinkInBioLinksListView.value,
              type: 'GET',
              dataType: 'json',
              success: (data) => {
                // empty list
                $(this.cardContainer).empty();
                this.loaderImage.classList.remove('d-none');

                setTimeout(() => {
                  for (var i = 0; i < data.links.length; i++) {
                    var link = data.links[i];
                    var card = this.renderCard(link);
                    $(this.cardContainer).append($(card));

                  }
                  $(this.loaderImage.classList.add('d-none'));
                }, 1000);
              },
              error: (xhr, textStatus, errorThrown) => {
                console.error('Fehler:', errorThrown);
              }
            });
          }

    }

}

export default linkListe
