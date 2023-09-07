from django.http import HttpResponse
from django.views.generic import DetailView
from .models import ContentPage


class ContentPageDetailView(DetailView):
    model = ContentPage
    template_name = 'content_pages.html'
    context_object_name = 'content_page'
    slug_url_kwarg = 'slug'