import { getCookie } from './module/getCookie';
import { openForm, closeForm } from './module/sidebarSwitcher';

const csrftoken = getCookie('csrftoken');

// Class Javascript
import linkListe from './module/linkListe';
import crateFormLink from './module/crateFormLink';

const linklist = new linkListe();
const crateformlink = new crateFormLink();



// Sidebar Open & Close
const openFormButton = document.querySelector("#openForm");
const closeFormButton = document.querySelector("#closeForm");

if (openFormButton) {
    openFormButton.addEventListener('click', openForm);
}

if (closeFormButton) {
    closeFormButton.addEventListener('click', closeForm);
}
