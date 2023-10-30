from django.forms import ModelForm, Textarea, CharField, HiddenInput, Select, BooleanField
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Hidden, Div, Field

from .models import GeoThemplate
from accounts.models import CustomUser

class GeoThemplateForm(forms.ModelForm):
    
    themplate_name = forms.CharField(required=True)
    land = forms.CharField(required=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('themplate_name', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            Row(
                Column('land', css_class='form-group col-12 my-2'),
                HTML('<ul id="countryList" class="d-none"></ul>'),
                HTML('<input type="hidden" id="id_geonameId"/>'),
                css_class='row'
            ),
            Row(
                Column('themplate_region', css_class='form-group col-12 my-2'),
                HTML('<ul id="regionList" class="d-none"></ul>'),
                css_class='row'
            ), 
            Hidden('themplate_user', '{{ user.id }}'), 
            HTML('<input class="btn btn-primary mt-3" id="geothemplate-form-view" type="submit" value="Speichern">'),     
            HTML('<input class="btn btn-primary mt-3 d-none" id="geothemplate-form-update" type="submit" value="Update"/>')      
        )
        
    class Meta:
        model = GeoThemplate
        fields = ['themplate_name', 'land', 'themplate_region', 'themplate_user']
        # widgets = {
        #     'themplate_user': HiddenInput(),
        # }