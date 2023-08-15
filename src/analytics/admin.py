from django.contrib import admin

# Register your models here.


from .models import ClickEvent, DailyClick, IPGeolocation

admin.site.register(ClickEvent)
admin.site.register(DailyClick)
admin.site.register(IPGeolocation)