from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Hidden, Div, Field
from crispy_forms.bootstrap import InlineCheckboxes
from django.forms import ModelForm, Textarea, CharField, HiddenInput, Select, BooleanField

from .models import CustomUser

from django.utils.translation import gettext_lazy as _

#Regestriren
class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True,
                             widget=forms.TextInput(attrs={'placeholder': _('E-Mail-Adresse'),
                                                           'class': 'form-control',
                                                           }))
    password1 = forms.CharField(max_length=50,
                                required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': _('Passwort'),
                                                                  'class': 'form-control',
                                                                  'data-toggle': 'password',
                                                                  'id': 'password',
                                                                  }))
    password2 = forms.CharField(max_length=50,
                                required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': _('Passwort bestätigen'),
                                                                  'class': 'form-control',
                                                                  'data-toggle': 'password',
                                                                  'id': 'password',
                                                                  }))

    class Meta:
        model = CustomUser
        fields = ['email', 'password1', 'password2']
        


#Login        
class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=100,
                                required=True,
                                widget=forms.TextInput(attrs={'placeholder': _('E-Mail'),
                                                                'class': 'form-control',
                                                                }))
    password = forms.CharField(max_length=50,
                               required=True,
                               widget=forms.PasswordInput(attrs={'placeholder': _('Password'),
                                                                 'class': 'form-control',
                                                                 'data-toggle': 'password',
                                                                 'id': 'password',
                                                                 'name': 'password',
                                                                 }))
    remember_me = forms.BooleanField(required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'remember_me']
        
class UserUpdateForm(forms.Form):
    email = forms.EmailField(required=False)
    password = forms.CharField(widget=forms.PasswordInput, required=False)



class ProfileFormAdresse(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('first_name', css_class='form-group col-12 col-md-6 my-2 disabled-func'),
                Column('last_name', css_class='form-group col-12 col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('address', css_class='form-group col-12 my-2 disabled-func'),
                css_class='row'
            ),
            Row(
                Column('zip_code', css_class='form-group col-md-6 my-2 disabled-func'),
                Column('city', css_class='form-group col-md-6 my-2 disabled-func'),
                css_class='row'
            ),
            Hidden('user_id', '{{ request.user.id }}'),
            HTML(f'<input class="btn btn-primary mt-3" type="submit" value="{_("Speichern")}">')
        )

    class Meta:
        model = CustomUser
        fields = ['address', 'zip_code', 'city', 'first_name', 'last_name'] 


# Form Sprache
class LanguageForm(forms.Form):
    
    LANGUAGE_CHOICES = [
        ('de', 'German'),
        ('en', 'English'),
    ]

    language = forms.ChoiceField(choices=LANGUAGE_CHOICES, required=False, label=_('Select Language'), widget=forms.Select(attrs={'class': 'form-control'}))