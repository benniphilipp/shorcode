from django.forms import ModelForm, Textarea, CharField, HiddenInput, Select, BooleanField
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Hidden, Div, Field

from .models import ShortcodeClass, Tag
from geotargeting.models import GeoThemplate

class ShortcodeClassForm(forms.ModelForm):

    url_destination = forms.CharField(label="Ziel-Url", widget=forms.TextInput(attrs={'placeholder': 'Ziel Url'}))
    url_titel = forms.CharField(label="Titel", widget=forms.TextInput(attrs={'placeholder': 'Titel'}))
    shortcode = forms.CharField(label="Shortcode", required=False, widget=forms.TextInput(attrs={'placeholder': 'shortcode'}))
    url_source = forms.CharField(label="Source", required=False, widget=forms.TextInput(attrs={'placeholder': 'z.B Google, Newsletter'}))
    url_medium = forms.CharField(label="Medium", required=False, widget=forms.TextInput(attrs={'placeholder': 'z.B. CPC, Banner, E-Mail'}))
    url_campaign = forms.CharField(label="Campaign", required=False, widget=forms.TextInput(attrs={'placeholder': 'z.B spring_sale'}))
    url_term = forms.CharField(label="Term", required=False, widget=forms.TextInput(attrs={'placeholder': 'z.B etwas'}))
    url_content = forms.CharField(label="Content", required=False, widget=forms.TextInput(attrs={'placeholder': 'z.B etwas'}))
    tags = forms.ModelMultipleChoiceField(queryset=Tag.objects.none(), widget=forms.CheckboxSelectMultiple(attrs={'class': 'id_tags'}), required=False)
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None) 
        super(ShortcodeClassForm, self).__init__(*args, **kwargs)
                
        if user:
            self.fields['tags'].queryset = Tag.objects.filter(user=user)
            
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('url_destination', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('url_titel', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('shortcode', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('url_source', css_class='form-group col-md-6 my-2 disabled-func'),
                Column('url_medium', css_class='form-group col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('url_campaign', css_class='form-group col-md-6 my-2 disabled-func'),
                Column('url_term', css_class='form-group col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('url_content', css_class='form-group col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('tags', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            HTML('<div class="row"><div class="form-group col-12 my-2"></div></div>'),
            Hidden('url_creator', '{{ admin }}'),
            HTML('<input id="crate-form-shortcode" class="btn btn-primary mt-3" type="submit" value="Speichern">'),
            HTML('<input id="update-form-shortcode" class="btn btn-primary mt-3" type="submit" value="Speichern">')
        )
    
    class Meta:
        model = ShortcodeClass
        fields = ['url_destination' , 'url_titel', 'url_source', 'url_medium', 'url_campaign', 'url_term', 'url_content', 'url_creator', 'url_archivate', 'tags', 'shortcode']
        
        widgets = {
            'url_creator': HiddenInput(),
        }
        
        
class CreateTagForm(forms.ModelForm):
    name = forms.CharField(label="", required=False, widget=forms.TextInput(attrs={'placeholder': 'Tags erstellen'}))
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('name', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            Hidden('user', '{{ admin }}'),
            HTML('<input id="createTagButton" class="btn btn-primary mt-3 mb-3" type="submit" value="Speichern">'),
        )
    class Meta:
        model = Tag
        fields = ['name'] 
        

# Begrenzung von URLs
class LimitationShorcodeForm(forms.ModelForm):
    
    start_date = forms.CharField(required=False, label="Start Datum", widget=forms.TextInput(attrs={'class': 'disabled-limitation time-limitation'}))
    end_date = forms.CharField(required=False, label="End Datum", widget=forms.TextInput(attrs={'class': 'disabled-limitation time-limitation'}))
    count = forms.CharField(required=False, label="Zahl der Klicks", widget=forms.TextInput(attrs={'class': 'disabled-limitation'}))
    alternative_url = forms.CharField(required=False, label="Alternativ URL", widget=forms.TextInput(attrs={'class': 'disabled-limitation'}))
    limitation_active = forms.BooleanField(label='Ablaufdatum / Klicklimit Aktivieren', required=False)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
                
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Field('limitation_active', css_class="form-check-input", wrapper_class="form-check"),
                css_class='row'
            ),
            Row(
                Column('start_date', css_class='form-group col-md-6 my-2'),
                Column('end_date', css_class='form-group col-md-6 my-2'),
                css_class='row'
            ),
            Row(
                Column('count', css_class='form-group col-md-6 my-2'),
                css_class='row'
            ),
            Row(
                Column('alternative_url', css_class='form-group col-md-12 my-2'),
                css_class='row'
            ),
            Hidden('url_creator', '{{ admin }}'),
        )
    
    class Meta:
        model = ShortcodeClass
        fields = ['count', 'start_date', 'end_date', 'alternative_url', 'limitation_active'] 


# Geo-Targeting Form
class GeoTargetingForm(forms.ModelForm):
    
    link_geo = forms.CharField(required=False, widget=forms.TextInput(attrs={'class': 'disabled-geo'}))
    template_geo = forms.ModelMultipleChoiceField(queryset=GeoThemplate.objects.all(), widget=forms.CheckboxSelectMultiple(attrs={'class': 'id_template_geo'}), required=False)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Field('geo_targeting_on_off', css_class="form-check-input", wrapper_class="form-check form-switch"),
                css_class='row'
            ),
            Row(
                Column('template_geo', css_class='form-group col-12 my-2'),
                css_class='row'
            ),
            Row(
                Column('link_geo', css_class='form-group col-md-12 my-2'),
                css_class='row'
            ),
            Hidden('url_creator', '{{ admin }}'),
            #HTML('<input class="btn btn-primary mt-3 disabled-geo send-update-form" type="submit" value="Speichern">')
        )
    
    class Meta:
        model = ShortcodeClass
        fields = ['geo_targeting_on_off', 'link_geo', 'template_geo']


# Android-Targeting From
class AndroidTargetingForm(forms.ModelForm):

    android = forms.CharField(required=False, widget=forms.TextInput(attrs={'class': 'disabled-android'}))
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
                
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Field('android_on_off', css_class="form-check-input", wrapper_class="form-check form-switch"),
                css_class='row'
            ),
            Row(
                Column('android', css_class='form-group col-12 col-md-12 my-2'),
                css_class='row'
            ),
            Hidden('url_creator', '{{ admin }}'),
            #HTML('<input id="" class="btn btn-primary mt-3 disabled-android send-android-form" type="submit" value="Speichern">')
        )
    
    class Meta:
        model = ShortcodeClass
        fields = ['android', 'android_on_off']


# iOS-Targeting
class IosTargetingForm(forms.ModelForm):
    
    ios = forms.CharField(required=False, widget=forms.TextInput(attrs={'class': 'disabled-ios'}))
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
                
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Field('ios_on_off', css_class="form-check-input", wrapper_class="form-check form-switch"),
                css_class='row'
            ),
            Row(
                Column('ios', css_class='form-group col-12 col-md-12 my-2'),
                css_class='row'
            ),
            Hidden('url_creator', '{{ admin }}'),
            #HTML('<input class="btn btn-primary mt-3 disabled-ios send-ios-form" type="submit" value="Speichern">')
        )

    class Meta:
        model = ShortcodeClass
        fields = ['ios_on_off', 'ios'] 
