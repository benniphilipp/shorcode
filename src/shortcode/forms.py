from django import forms
from django.forms import ModelForm, Textarea, CharField, HiddenInput, Select
from django.contrib.auth import get_user_model

from .models import ShortcodeClass

class ShortcodeClassForm(forms.ModelForm):
    class Meta:
        model = ShortcodeClass
        fields = [
            'url_destination',
            'url_titel',
            'url_source',
            'url_medium',
            'url_campaign',
            'url_term',
            'url_content',
            'url_tags',
            'url_active',
            ]