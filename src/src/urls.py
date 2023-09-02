from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url

from django.conf import settings
from django.conf.urls.static import static

from accounts.views import URLRedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('shortcode/', include('shortcode.urls')),
    # path('analytics/', include('analytics.urls')),
    # path('webclicktracker/', include('webclicktracker.urls')),
    # path('trackingai/', include('trackingai.urls')),
    # path('linkinbio/', include('linkinbio.urls')),
    # path('geotargeting/', include('geotargeting.urls')),
    # path('', include('accounts.urls')),
    url(r'^(?P<shortcode>[\w-]+)/$', URLRedirectView.as_view(), name='scode'), 
]

urlpatterns += i18n_patterns(
    path('shortcode/', include('shortcode.urls')),
    path('analytics/', include('analytics.urls')),
    path('webclicktracker/', include('webclicktracker.urls')),
    path('trackingai/', include('trackingai.urls')),
    path('linkinbio/', include('linkinbio.urls')),
    path('geotargeting/', include('geotargeting.urls')),
    path('', include('accounts.urls')),
)


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
