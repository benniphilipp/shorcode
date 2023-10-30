/* Alert Box Close */
export function clearContent() {
    setTimeout(function() {
        $('#toast-alert').html('');
    }, 4000);
}

/* Alert Box */
export function lsToast(parmToast) {
    $('#toast-alert').html(`
        <div class="ls-toast" id="ls-toas">
            <div class="ls-toas-header d-flex justify-content-start align-items-center px-2 py-2">
                <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
                <span><b>Meldung</b></span>
                <i class="fa-solid fa-xmark ms-auto"></i>
            </div>
            <hr>
            <div class="ls-toas-body p-2">
                ${parmToast}
            </div>
        </div>
    `);
    clearContent();
}