from django.urls import path

from .views import (
        LinkInBioListView,
        LinkInBioDetailView,
        ShortcodeClassListView,
        CreateShortcodeView,
        CreateLinkView,
        LinkInBioLinksListView,
        UpdateLinksOrderView,
        get_social_media_platforms,
        SaveUrlSocialView,
        SocialMediaProfilesView,
        LinksDetaileJsonView,
        UpdateShortcodeLinkInBioView
    )


app_name = 'linkinbio'

urlpatterns = [
    path('', LinkInBioListView.as_view(), name='linkinbio_view_list'),
    path('shortcode/', ShortcodeClassListView.as_view(), name='shortcode_class_list'),
    path('create_shortcode/', CreateShortcodeView.as_view(), name='create_shortcode'),
    path('create_link/', CreateLinkView.as_view(), name='create_link'),
    path('update_links_order/', UpdateLinksOrderView.as_view(), name='update_links_order'),
    path('get_social_media_platforms/', get_social_media_platforms, name='get_social_media_platforms'),
    path('save_social_profiles/', SaveUrlSocialView.as_view(), name='save_url_social'),
    path('social_media_profiles/<int:link_in_bio_id>/', SocialMediaProfilesView.as_view(), name='social_media_profiles'),
    path('update_shorcode_linkinbio/<int:pk>/', UpdateShortcodeLinkInBioView.as_view(), name='update_shortcode_linkinbio'),
    path('detail/<int:pk>/', LinkInBioDetailView.as_view(), name='linkinbio_detail'),
    path('links/<int:linkinbio_id>/', LinkInBioLinksListView.as_view(), name='linkinbio_links_list'),
    path('link_detaile/<pk>/', LinksDetaileJsonView.as_view(), name='link_in_bio_link'),
]