from django.contrib import admin
from .models import ContentPage, MarketingField
from translations.admin import TranslatableAdmin, TranslationInline

class MarketingFieldInline(admin.TabularInline):
    model = MarketingField
    extra = 1  # Anzahl der leeren Marketingfelder auf der Bearbeitungsseite

@admin.register(ContentPage)
class ContentPageAdmin(TranslatableAdmin, admin.ModelAdmin):
    inlines = [TranslationInline, MarketingFieldInline]

admin.site.register(MarketingField)


