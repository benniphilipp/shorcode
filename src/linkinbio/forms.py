from django import forms
from .models import LinkInBio
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Row, Column, HTML, Hidden


class LinkInBioDashboardForm(forms.ModelForm):
    title = forms.CharField(label="Titel", widget=forms.TextInput(attrs={'placeholder': 'Titel'}))
    description = forms.CharField(label="Description", widget=forms.TextInput(attrs={'placeholder': 'Titel'}))
        
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None) 
        super(LinkInBioDashboardForm, self).__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('title', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            Row(
                Column('description', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            Hidden('user', '{{ admin }}'),
            HTML('<input id="saveBtn" class="btn btn-primary mt-3" type="submit" value="Speichern">'),
            HTML('<input id="updateBtnJson" class="btn btn-primary mt-3 d-none" value="Ändern">'),
        )
        
    class Meta:
        model = LinkInBio
        fields = ['title', 'description']