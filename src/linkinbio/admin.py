from django.contrib import admin
from .models import LinkInBio, CustomSettings, SocialMediaPlatform, LinkInBioLink, UrlSocialProfiles

admin.site.register(LinkInBio)
admin.site.register(CustomSettings)
admin.site.register(SocialMediaPlatform)
admin.site.register(LinkInBioLink)
admin.site.register(UrlSocialProfiles)