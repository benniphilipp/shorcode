from django.forms import ModelForm, forms
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Hidden, Div, Field
from crispy_forms.bootstrap import InlineCheckboxes

from django.forms import ModelForm, Textarea, CharField, HiddenInput, Select, BooleanField

from .models import Website


class WebsiteForm(forms.ModelForm):
    url = forms.CharField(label="", widget=forms.TextInput(attrs={'placeholder': 'Websiten Url'}))

    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('url', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            HTML('<input id="create-website-btn" class="btn btn-primary mt-3" type="submit" value="Speichern">'),
        )

    class Meta:
        model = Website
        fields = ['url']
