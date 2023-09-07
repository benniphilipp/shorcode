from django.contrib import admin
from .models import ContentPage, MarketingField

class MarketingFieldInline(admin.TabularInline):
    model = MarketingField
    extra = 1  # Anzahl der leeren Marketingfelder auf der Bearbeitungsseite

@admin.register(ContentPage)
class ContentPageAdmin(admin.ModelAdmin):
    inlines = [MarketingFieldInline]

admin.site.register(MarketingField)
