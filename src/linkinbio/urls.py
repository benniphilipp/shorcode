from django.urls import path

from .views import (
        LinkInBioListView,
        LinkInBioDetailView,
        ShortcodeClassListView,
        CreateShortcodeView,
        CreateLinkView
    )


app_name = 'linkinbio'

urlpatterns = [
    path('', LinkInBioListView.as_view(), name='linkinbio_view_list'),
    path('shortcode/', ShortcodeClassListView.as_view(), name='shortcode_class_list'),
    path('create_shortcode/', CreateShortcodeView.as_view(), name='create_shortcode'),
    path('detail/<int:pk>/', LinkInBioDetailView.as_view(), name='linkinbio_detail'),
    path('create_link/', CreateLinkView.as_view(), name='create_link'),
]