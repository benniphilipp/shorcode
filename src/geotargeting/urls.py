from django.urls import path
from .views import country_name
from django.contrib.auth.decorators import login_required

app_name = 'geotargeting'

urlpatterns = [
    # path('', login_required(AnalyticsView.as_view()), name='analytics-view'),
    path('country_name/', country_name, name='country_name'),
    # path('analytics/total-links/', total_links_json_view, name='total_links_json'),
]