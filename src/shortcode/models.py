from django.db import models
from django.utils import timezone
from accounts.models import CustomUser

# Create your models here.
class ShortcodeClass(models.Model):
    url_destination     = models.CharField(max_length=520, unique=True, blank=False)
    url_titel           = models.CharField(max_length=125, blank=True)
    url_source          = models.CharField(max_length=525, blank=True)
    url_medium          = models.CharField(max_length=525, blank=True)
    url_campaign        = models.CharField(max_length=525, blank=True)
    url_term            = models.CharField(max_length=525, blank=True)
    url_content         = models.CharField(max_length=525, blank=True)
    url_tags            = models.CharField(max_length=125, blank=True)   
    url_creator         = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    url_create_date     = models.DateTimeField(default=timezone.now)
    url_archivate       = models.BooleanField(default=False)
    url_active          = models.BooleanField(default=True)
    
    def __str__(self):
        return self.url_titel