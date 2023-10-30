from django.urls import path
from .views import ContentPageDetailView

app_name = 'contentpage'

urlpatterns = [
    path('<str:slug>/', ContentPageDetailView.as_view(), name='content_page_view'),
]