from django.urls import path
from .views import AnalyticsView, click_analyse, ClickDataView, total_links_json_view
from django.contrib.auth.decorators import login_required

app_name = 'analytics'

urlpatterns = [
    path('', login_required(AnalyticsView.as_view()), name='analytics-view'),
    path('analyse/<int:shortcode>/', click_analyse, name='click-data-analyse'),
    path('click_data/', ClickDataView.as_view(), name='click-data'),
    path('analytics/total-links/', total_links_json_view, name='total_links_json'),
    #path('shortcode/click_data/<str:shortcode>/', shortcode_click_data, name='shortcode-click-data'),
]