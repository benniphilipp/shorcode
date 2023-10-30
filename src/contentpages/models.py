from django.db import models
from django.contrib import admin
from ckeditor.fields import RichTextField
from accounts.models import CustomUser
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from translations.models import Translatable


class MarketingField(Translatable):
    content_page = models.ForeignKey('ContentPage', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='marketing_images/')
    headline = models.CharField(_("headline"),max_length=200)
    subline = models.CharField(_("subline"), max_length=200)
    text = RichTextField(_("text"), null=True, blank=True)

    class TranslatableMeta:
        fields = ['headline', 'subline', 'text']
        

class ContentPage(Translatable):
    subline = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    headline = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    og_description = models.CharField(max_length=255, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        # Automatisch den Slug aus dem Titel generieren
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title

    class TranslatableMeta:
        fields = ['subline', 'headline', 'og_description']