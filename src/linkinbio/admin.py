from django.contrib import admin
from .models import LinkInBio, CustomSettings, SocialMediaPlatform, LinkInBioLink, UrlSocialProfiles

admin.site.register(LinkInBio)
admin.site.register(CustomSettings)
admin.site.register(SocialMediaPlatform)

admin.site.register(UrlSocialProfiles)


@admin.register(LinkInBioLink)
class LinkInBioLinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'link_in_bio', 'shortcode', 'button_label')

    def button_label(self, obj):
        return obj.shortcode.button_label