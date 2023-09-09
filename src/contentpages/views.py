from django.http import HttpResponse
from django.views.generic import DetailView
from .models import ContentPage
from django.utils.translation import activate, get_language
from translations.context import Context
from translations.models import Translation

from django.shortcuts import get_object_or_404


class ContentPageDetailView(DetailView):
    model = ContentPage
    template_name = 'pages.html'
    context_object_name = 'content_page'
    slug_url_kwarg = 'slug'
    
    def get_object(self, queryset=None):
        content_page = super().get_object(queryset)
        language = get_language()
        activate(language)
        
        with Context(content_page) as translation_context:
            translation_context.read(language)
            
        marketing_translations = {}
        for marketing_field in content_page.marketingfield_set.all():
            with Context(marketing_field) as marketing_translation_context:
                marketing_translation_context.read(language)
                print(marketing_field)

                marketing_translations[marketing_field.id] = {
                    'headline': marketing_field.headline,
                    'subline': marketing_field.subline,
                    'text': marketing_field.text,
                    'image_url': marketing_field.image.url,
                }
        
        content_page.marketing_translations = marketing_translations

        return content_page

