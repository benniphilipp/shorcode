from django.urls import path
from .views import (
        LinkInBioListView,
        LinkInBioDetailView
    )


app_name = 'linkinbio'

urlpatterns = [
    path('', LinkInBioListView.as_view(), name='linkinbio_view_list'),
    path('detail/<int:pk>/', LinkInBioDetailView.as_view(), name='linkinbio_detail'),
]