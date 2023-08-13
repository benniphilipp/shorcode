from django.urls import path
from .views import AnalyticsView, ClickDataView, shortcode_click_data, total_links_json_view
from django.contrib.auth.decorators import login_required

app_name = 'analytics'

urlpatterns = [
    path('', login_required(AnalyticsView.as_view()), name='analytics-view'),
    path('click_data/', ClickDataView.as_view(), name='click-data'),
    path('shortcode/<str:shortcode>/click_data/', shortcode_click_data, name='shortcode-click-data'),
    path('analytics/total-links/', total_links_json_view, name='total_links_json'),
]