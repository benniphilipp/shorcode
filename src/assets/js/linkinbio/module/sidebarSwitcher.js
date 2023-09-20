export function openForm() {
    document.querySelector('#aside-form').classList.add("toggle");
    document.querySelector('#overlay-open').classList.add("overlay-open");
    
    const templateNameInput = document.querySelector('#id_template_name');
    templateNameInput.style.borderColor = '#dc3545';
    
    templateNameInput.addEventListener('change', () => {
        templateNameInput.style.borderColor = '';
    });
}

export function closeForm() {
    document.querySelector('#aside-form').classList.remove("toggle");
    document.querySelector('#overlay-open').classList.remove("overlay-open");
}