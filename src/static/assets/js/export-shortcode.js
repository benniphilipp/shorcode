$(document).ready(function(){

    // Export Shortcode
    function exportSelectedShortcodes(csrfToken) {
        var selectedShortcodes = [];  // Hier die ausgewählten Shortcodes hinzufügen
        
        // Annahme: selectedShortcodes ist ein Array von IDs der ausgewählten Shortcodes
        $('input[name="selected_shortcodes"]:checked').each(function() {
            selectedShortcodes.push($(this).val());
        });
        console.log(selectedShortcodes)
        if (selectedShortcodes.length === 0) {
            alert('Bitte wählen Sie mindestens einen Shortcode aus.');
            return;
        }
    
        $.ajax({
            url: '/shortcode/ajax/export-shortcodes/',
            method: 'POST',
            data: { 
                'selected_ids[]': selectedShortcodes,
                csrfmiddlewaretoken: csrfToken
            },
            success: function(response) {
                var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'shortcodes.xlsx';
                link.click();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    // Export Button csrfToken
    $('#export-button').on('click', function() {
        var csrfToken = $('input[name=csrfmiddlewaretoken]').val();
        exportSelectedShortcodes(csrfToken);
    });

}); // End document ready function
