from django.urls import path
from .views import ShortcodeClassListView, post_crate_view, post_detaile_data_view, archive_post, update_post


app_name = 'shortcode'

urlpatterns = [
    path('view/', ShortcodeClassListView.as_view(), name='dashboard-view'),
    path('create/', post_crate_view, name='dashboard-create'),
    path('update/<pk>/', update_post, name='dashboard-update'),
    path('update/archive/', archive_post, name='dashboard-archive'),
    path('update/<pk>/view/', post_detaile_data_view, name='dashboard-update-view'),
    
    # path('create/', CrateShortCodeCreateView.as_view(), name='dashboard-create'),
]