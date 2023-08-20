from django.db import models
from django.utils import timezone
from accounts.models import CustomUser


class Website(models.Model):
    url = models.URLField(unique=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.url


class WebsiteClick(models.Model):
    url = models.URLField()
    click_path = models.TextField()
    title = models.CharField(max_length=200)
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title


class Link(models.Model):
    website_click = models.ForeignKey(WebsiteClick, on_delete=models.CASCADE)
    link = models.URLField()
    link_id = models.CharField(max_length=100, blank=True, null=True)
    link_class = models.CharField(max_length=100, blank=True, null=True)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)


class Button(models.Model):
    website_click = models.ForeignKey(WebsiteClick, on_delete=models.CASCADE)
    button_text = models.CharField(max_length=200)
    button_id = models.CharField(max_length=100, blank=True, null=True)
    button_class = models.CharField(max_length=100, blank=True, null=True)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)
