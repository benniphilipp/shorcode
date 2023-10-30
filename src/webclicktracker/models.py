from django.db import models
from django.utils import timezone
from accounts.models import CustomUser


class Website(models.Model):
    url = models.URLField(unique=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    favicon = models.URLField(blank=True, null=True)  # Favicon URL
    first_image = models.URLField(blank=True, null=True)  # URL des ersten Bildes der Website
    meta_description = models.TextField(blank=True, null=True)  # Meta-Beschreibung der Website
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.url


class WebsitePages(models.Model):
    url = models.URLField()
    click_path = models.TextField()
    title = models.CharField(max_length=200)
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title


class Subpage(models.Model):
    parent_page = models.ForeignKey(WebsitePages, on_delete=models.CASCADE)
    url = models.URLField()
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default='Subpage')


class Link(models.Model):
    website_click = models.ForeignKey(WebsitePages, on_delete=models.CASCADE)
    link = models.URLField()
    link_id = models.CharField(max_length=100, blank=True, null=True)
    link_class = models.CharField(max_length=100, blank=True, null=True)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)


class Button(models.Model):
    website_click = models.ForeignKey(WebsitePages, on_delete=models.CASCADE)
    button_text = models.CharField(max_length=200)
    button_id = models.CharField(max_length=100, blank=True, null=True)
    button_class = models.CharField(max_length=100, blank=True, null=True)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)
