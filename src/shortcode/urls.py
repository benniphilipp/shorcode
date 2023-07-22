from django.urls import path
from .views import ShortcodeClassListView


urlpatterns = [
    path('view/', ShortcodeClassListView.as_view(), name='dashboard-view'),
]