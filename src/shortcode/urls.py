from django.urls import path
from shortcode.views.views_limitation import toggle_limitation_active_status, get_limitation_active_status
from shortcode.views.views_main import (
        post_crate_view, 
        load_shortcode_data_view, 
        GetFaviconView, 
        post_detaile_data_view, 
        archive_post, update_post, 
        ShortcodeArchiveListView, 
        export_shortcodes_to_excel,
        filter_and_search_shortcodes,
        get_all_tags,
        CreateTagView,
        TagDeleteView,
        TagListView,
        edit_tag,
        shortcode_view)

from django.contrib.auth.decorators import login_required

app_name = 'shortcode'

urlpatterns = [
    path('create/', post_crate_view, name='dashboard-create'),
    path('archive/', login_required(ShortcodeArchiveListView.as_view()), name='archive-view'),
    path('update/archive/', archive_post, name='dashboard-archive'),
    path('ajax/export-shortcodes/', export_shortcodes_to_excel, name='ajax_export_shortcodes'),
    path('list/', shortcode_view, name='shortcode_list_view'),
    path('json-list/', load_shortcode_data_view, name='load_shortcode_data'),
    path('update/<pk>/', update_post, name='dashboard-update'),
    path('update/<pk>/view/', post_detaile_data_view, name='dashboard-update-view'),
    path('get_favicon/', GetFaviconView.as_view(), name='get_favicon'),
    path('serach/', filter_and_search_shortcodes, name='serach'),
    path('tags/', get_all_tags, name='tags'),
    path('tags-create/', CreateTagView.as_view(), name='tags-create'),
    path('tags-list/', TagListView.as_view(), name='tag-list'),
    path('tags-edit/<int:tag_id>/', edit_tag, name='tag-edit'),
    path('tags-delete/<int:tag_id>/', TagDeleteView.as_view(), name='tag-delete'),
    path('toggle_limitation_active/<int:pk>/', toggle_limitation_active_status, name='toggle_limitation_active'),
    path('get_limitation_active_status/<int:pk>/', get_limitation_active_status, name='get_limitation_active_status'),
]
