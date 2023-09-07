from django.db import models
from django.contrib import admin

from django.utils.text import slugify

class MarketingField(models.Model):
    content_page = models.ForeignKey('ContentPage', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='marketing_images/')
    headline = models.CharField(max_length=200)
    subline = models.CharField(max_length=200)
    text = models.TextField()
     
class MarketingFieldInline(admin.TabularInline):
    model = MarketingField
    extra = 1

class ContentPage(models.Model):
    title = models.CharField(max_length=200)
    headline = models.CharField(max_length=200)
    subline = models.CharField(max_length=200)
    body_text = models.TextField()
    slug = models.SlugField(unique=True)
    og_description = models.CharField(max_length=255, blank=True, null=True)
    

    def save(self, *args, **kwargs):
        # Automatisch den Slug aus dem Titel generieren
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.title

