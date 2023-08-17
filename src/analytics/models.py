from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from shortcode.models import ShortcodeClass
# Create your models here.

class ClickEventManager(models.Manager):
    def create_event(self, shortInstance):
        if isinstance(shortInstance, ShortcodeClass):
            obj, created = self.get_or_create(short_url=shortInstance)
            obj.count += 1
            obj.save()
            return obj.count
        return None

class ClickEvent(models.Model):
    short_url   = models.OneToOneField(ShortcodeClass, on_delete=models.CASCADE)
    count       = models.IntegerField(default=0)
    updated     = models.DateTimeField(auto_now=True) 
    timestamp   = models.DateTimeField(auto_now_add=True)

    objects = ClickEventManager()

    def __str__(self):
        return "{i}".format(i=self.count)
    
    def get_short_url(self):
        return self.short_url.shortcode if self.short_url else ""
    
    
class DailyClick(models.Model):
    short_url = models.ForeignKey(ShortcodeClass, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Click on {self.short_url.shortcode} at {self.timestamp}"
    
    
# IPGeolocation
class IPGeolocation(models.Model):
    shortcode = models.ForeignKey(ShortcodeClass, on_delete=models.CASCADE, related_name='geolocations')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    os = models.CharField(max_length=100, blank=True, null=True)
    device = models.CharField(max_length=100, blank=True, null=True)
    browser = models.CharField(max_length=100, blank=True, null=True)
    timestamp   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'IPGeolocation for Shortcode: {self.shortcode.shortcode}'