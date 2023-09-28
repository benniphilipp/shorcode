from django.conf import settings
from django.db import models
from django.utils import timezone
from accounts.models import CustomUser
from geotargeting.models import GeoThemplate
from django_hosts.resolvers import reverse

from .utils import create_shortcode

SHORTCODE_MAX = getattr(settings, "SHORTCODE_MAX", 15)


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)

    def __str__(self):
        return self.name


class ShortcodeClass(models.Model):
    url_destination     = models.CharField(max_length=520, blank=False)
    url_titel           = models.CharField(max_length=125, blank=True)
    url_source          = models.CharField(max_length=525, blank=True)
    url_medium          = models.CharField(max_length=525, blank=True)
    url_campaign        = models.CharField(max_length=525, blank=True)
    url_term            = models.CharField(max_length=525, blank=True)
    url_content         = models.CharField(max_length=525, blank=True)
    url_creator         = models.ForeignKey(CustomUser,on_delete=models.CASCADE,)
    url_create_date     = models.DateTimeField(default=timezone.now)
    url_archivate       = models.BooleanField(default=False)
    url_active          = models.BooleanField(default=True)
    favicon_path        = models.CharField(max_length=255, blank=True, null=True)
    created_at          = models.DateTimeField(default=timezone.now)
    updated_at          = models.DateTimeField(default=timezone.now)
    tags                = models.ManyToManyField(Tag, related_name='shortcodes')
    
    #Button LinkInBio
    button_label        = models.CharField(max_length=520, blank=True, null=True) 
    shortcode           = models.CharField(max_length=SHORTCODE_MAX, unique=True, blank=True)
    
    # LinkInBio Page
    linkinbiopage        = models.ForeignKey('linkinbio.LinkInBio',on_delete=models.CASCADE)
    
    # Begrenzung von URLs
    limitation_active = models.BooleanField(default=False)
    count = models.IntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    alternative_url = models.URLField(max_length=200, blank=True, null=True)

    # Geo-Targeting
    geo_targeting_on_off = models.BooleanField(default=False)
    link_geo = models.CharField(max_length=320, blank=True, null=True)
    template_geo = models.ManyToManyField(GeoThemplate, related_name='geothemplate')
    
    # Android-Targeting
    android_on_off = models.BooleanField(default=False)
    android = models.CharField(max_length=320, blank=True, null=True)
    
    # iOS-Targeting
    ios_on_off = models.BooleanField(default=False)
    ios = models.CharField(max_length=320, blank=True, null=True)
    
    def __str__(self):
        return self.url_titel
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)
        
    def save(self, *args, **kwargs):
        if self.shortcode is None or self.shortcode == "":
            self.shortcode = create_shortcode(self)
        if not "http" in self.url_destination:
            self.url_destination = "http://" + self.url_destination
        super(ShortcodeClass, self).save(*args, **kwargs)
    
    
    @property
    def get_full_url(self):
        url_parts = []

        if self.url_destination:
            url_parts.append(self.url_destination)

        if self.url_medium and self.url_source:
            url_basic = '?utm_medium=' + self.url_medium + '&utm_source=' + self.url_source
            url_parts.append(url_basic)

        if self.url_campaign:
            url_parts.append('&utm_campaign=' + self.url_campaign)

        if self.url_term:
            url_parts.append('&utm_term=' + self.url_term)

        if self.url_content:
            url_parts.append('&utm_content=' + self.url_content)

        full_url = ''.join(url_parts)
        return full_url
    
    
    @property
    def archivate_count(self):
        return self.url_archivate.count()
    
    
    @property
    def get_short_url(self):
        url_path = reverse("scode", kwargs={'shortcode': self.shortcode}, host='www', scheme='http')
        return url_path
    