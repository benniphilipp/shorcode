from django.urls import path
from .views import (website_click_view, 
                    remove_duplicates_view, 
                    save_click_view, 
                    save_website_click_recursive, 
                    create_website, 
                    website_list,
                    website_detail,
                    website_data_json
                    )

app_name = 'webclicktracker'

urlpatterns = [
    path('', website_click_view, name='click_view'),
    path('save_click/', save_click_view, name='save_click_view'),
    path('remove-duplicates/', remove_duplicates_view, name='remove_duplicates'),
    path('progress/', save_website_click_recursive, name='save_website_click_recursive'),
    path('create_website/', create_website, name='create_website'),
    path('website-list/', website_list, name='website_list'),
    path('website/<int:website_id>/', website_detail, name='website-detail'),
    path('website/<int:website_id>/data/', website_data_json, name='website-data-json'),
    # path('analyse/<int:shortcode>/', click_analyse, name='click-data-analyse'),
    # path('click_data/', ClickDataView.as_view(), name='click-data'),
    # path('analytics/total-links/', total_links_json_view, name='total_links_json'),
]