from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url

from django.conf import settings
from django.conf.urls.static import static

from accounts.views import URLRedirectView

from django.contrib.flatpages import views as flatpages_views


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += i18n_patterns(
    path("pages/", include("django.contrib.flatpages.urls")),
    path('content/', include('contentpages.urls')),
    path('shortcode/', include('shortcode.urls')),
    path('analytics/', include('analytics.urls')),
    path('webclicktracker/', include('webclicktracker.urls')),
    path('trackingai/', include('trackingai.urls')),
    path('linkinbio/', include('linkinbio.urls')),
    path('geotargeting/', include('geotargeting.urls')),
    path('products/', include('products.urls')),
    url(r'^(?P<shortcode>[\w-]+)/$', URLRedirectView.as_view(), name='scode'), 
    path('', include('accounts.urls')),
)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
