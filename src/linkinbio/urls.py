from django.urls import path
from .views import (
        linkinnbio
    )


app_name = 'linkinbio'

urlpatterns = [
    path('', linkinnbio, name='linkinbio-list'),
#     path('archive/', login_required(ShortcodeArchiveListView.as_view()), name='archive-view'),
#     path('update/archive/', archive_post, name='dashboard-archive'),
#     path('ajax/export-shortcodes/', export_shortcodes_to_excel, name='ajax_export_shortcodes'),
#     path('list/', shortcode_view, name='shortcode_list_view'),
#     path('json-list/', load_shortcode_data_view, name='load_shortcode_data'),
#     path('update/<pk>/', update_post, name='dashboard-update'),
#     path('update/<pk>/view/', post_detaile_data_view, name='dashboard-update-view'),
#     path('get_favicon/', GetFaviconView.as_view(), name='get_favicon'),
#     path('serach/', filter_and_search_shortcodes, name='serach'),
#     path('tags/', get_all_tags, name='tags'),
#     path('tags-create/', CreateTagView.as_view(), name='tags-create'),
#     path('tags-list/', TagListView.as_view(), name='tag-list'),
#     path('tags-edit/<int:tag_id>/', edit_tag, name='tag-edit'),
#     path('tags-delete/<int:tag_id>/', TagDeleteView.as_view(), name='tag-delete'),
]