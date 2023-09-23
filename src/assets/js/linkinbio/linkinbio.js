import { getCookie } from './module/getCookie';
import { openForm, closeForm } from './module/sidebarSwitcher';

const csrftoken = getCookie('csrftoken');

// Linkinbiolink Links Javascript
import crateFormLink from './module/linkCrate';
import createFormLinks from './module/updateFormLinks';
import linkDelete from './module/linkDelete';

const crateformlink = new crateFormLink();
const createformlinks = new createFormLinks();
const linkdelete = new linkDelete();

// LinkInBio Page
import linkPageUpdate from './module/linkPageUpdate';
import linkPageDelete from './module/linkPageDelete';

const linkpageupdate = new linkPageUpdate();
const linkpagedelete = new linkPageDelete();

// Sidebar Open & Close
const openFormButton = document.querySelector("#openForm");
const closeFormButton = document.querySelector("#closeForm");

if (openFormButton) {
    openFormButton.addEventListener('click', openForm);
}

if (closeFormButton) {
    closeFormButton.addEventListener('click', closeForm);
}
