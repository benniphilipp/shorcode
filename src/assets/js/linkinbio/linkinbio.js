import { getCookie } from './module/getCookie';
import { openForm, closeForm } from './module/sidebarSwitcher';

const csrftoken = getCookie('csrftoken');

// Linkinbio Links Javascript
import linkListe from './module/linkListe';
import crateFormLink from './module/crateFormLink';
import createFormLinks from './module/updateFormLinks';

const crateformlink = new crateFormLink();
const createformlinks = new createFormLinks();


// Sidebar Open & Close
const openFormButton = document.querySelector("#openForm");
const closeFormButton = document.querySelector("#closeForm");

if (openFormButton) {
    openFormButton.addEventListener('click', openForm);
}

if (closeFormButton) {
    closeFormButton.addEventListener('click', closeForm);
}
