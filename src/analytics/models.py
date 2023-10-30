from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser
from shortcode.models import ShortcodeClass

from django.db.models import Sum

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
    
    
    @staticmethod
    def get_total_clicks_for_user(user):
        user_shortcodes = ShortcodeClass.objects.filter(url_creator=user, url_archivate=False)
        total_clicks = ClickEvent.objects.filter(short_url__in=user_shortcodes).aggregate(total=Sum('count'))['total']
        return total_clicks or 0
    
    
class DailyClick(models.Model):
    short_url = models.ForeignKey(ShortcodeClass, on_delete=models.CASCADE, related_name='daily_clicks')
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
    referrer = models.CharField(max_length=255, default="Unknown Referrer")

    def __str__(self):
        return f'IPGeolocation for Shortcode: {self.shortcode.shortcode}'
    



class ClickData(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    website_title = models.CharField(max_length=255)
    website_url = models.URLField()
    referrer = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    os = models.CharField(max_length=255)
    device = models.CharField(max_length=255)
    browser = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.website_title} - {self.ip_address} - {self.timestamp}"
