class adjustmentViewImg{

    constructor(){
        this.profileImageValue = document.querySelector('#ProfileImageDetailView')?.value || '';
        this.event();
    }

    event(){
        if (this.profileImageValue) {
            this.profileImageView(this.profileImageValue);
        }
    }

    profileImageView(valueUrl){
        const profileImage = document.getElementById('profileImage');
        const pageImage = document.querySelector('.page-image');

        $.ajax({
            url: valueUrl,
            type: 'GET',
            dataType: 'json',
            success: (data) => {

                const newImageUrl = data[0].profile_image;
                profileImage.src = newImageUrl;
                pageImage.src = newImageUrl;
                
            },
            error: (xhr, textStatus, errorThrown) => {
              console.error('Fehler:', errorThrown);
            }
          });
    }


}

export default adjustmentViewImg;
