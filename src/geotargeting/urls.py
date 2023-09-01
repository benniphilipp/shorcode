from django.urls import path
from .views import country_name, geo_themplate_list_view, index_geo_targeting, GeoThemplateListView, get_regions, GeoThemplateUpdateView, GeoThemplateDeleteView, GeoThemplateDetailView
from django.contrib.auth.decorators import login_required

app_name = 'geotargeting'

urlpatterns = [
    path('', index_geo_targeting, name='index_geo_targeting'),
    path('list/', geo_themplate_list_view, name='geo_targeting_list'),
    path('form/', GeoThemplateListView.as_view(), name='geo_targeting_form'),
    path('country_name/', country_name, name='country_name'),
    path('region_name/<int:geoname_id>/', get_regions, name='get_regions'),
    path('update/<int:pk>/', GeoThemplateUpdateView.as_view(), name='geo_template_update'),
    path('delete/<int:pk>/', GeoThemplateDeleteView.as_view(), name='geo_template_delete'),
    path('detail/<int:pk>/', GeoThemplateDetailView.as_view(), name='geo_template_detail'),
]