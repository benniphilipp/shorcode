from django.urls import path
from .views import ShortcodeClassListView, post_crate_view


app_name = 'shortcode'

urlpatterns = [
    path('view/', ShortcodeClassListView.as_view(), name='dashboard-view'),
    path('create/', post_crate_view, name='dashboard-create'),
    # path('create/', CrateShortCodeCreateView.as_view(), name='dashboard-create'),
]